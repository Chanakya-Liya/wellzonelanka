import { NextRequest, NextResponse } from 'next/server';
import { 
  collection, 
  query, 
  where, 
  getDocs,
  orderBy 
} from 'firebase/firestore';
import { db } from '@/lib/firebase';

// GET - Fetch trainer dashboard statistics
export async function GET(request: NextRequest, { params }: { params: Promise<{ trainerId: string }> }) {
  try {
    const { trainerId } = await params;
    console.log('Fetching dashboard stats for trainer:', trainerId);

    let appointments: any[] = [];
    let retries = 3;

    while (retries > 0) {
      try {
        // Get all trainer appointments
        const appointmentsRef = collection(db, 'trainers-appointment');
        const q = query(
          appointmentsRef,
          where('doctorId', '==', trainerId)
        );

        const querySnapshot = await getDocs(q);
        
        querySnapshot.forEach((doc) => {
          appointments.push({
            id: doc.id,
            ...doc.data()
          });
        });

        break;

      } catch (error: any) {
        retries--;
        if ((error.code === 'unavailable' || error.message.includes('UNAVAILABLE')) && retries > 0) {
          console.log(`Firestore unavailable, retrying... (${retries} attempts left)`);
          await new Promise(resolve => setTimeout(resolve, 1000));
          continue;
        }
        throw error;
      }
    }

    // Calculate statistics
    const today = new Date().toISOString().split('T')[0];
    const tomorrow = new Date(Date.now() + 86400000).toISOString().split('T')[0];

    const stats = {
      totalAppointments: appointments.length,
      todaysSessions: appointments.filter(apt => apt.date === today).length,
      newBookings: appointments.filter(apt => {
        const createdDate = apt.createdAt?.toDate?.()?.toISOString?.()?.split('T')[0] || today;
        return createdDate === today;
      }).length,
      confirmedAppointments: appointments.filter(apt => apt.status.toLowerCase() === 'confirmed').length,
      pendingAppointments: appointments.filter(apt => apt.status.toLowerCase() === 'pending').length,
      completedAppointments: appointments.filter(apt => apt.status.toLowerCase() === 'completed').length,
      cancelledAppointments: appointments.filter(apt => apt.status.toLowerCase() === 'cancelled').length,
      uniqueClients: new Set(appointments.map(apt => apt.userEmail)).size,
      upcomingAppointments: appointments.filter(apt => apt.date > today),
      pastAppointments: appointments.filter(apt => apt.date < today),
      thisWeekAppointments: appointments.filter(apt => {
        const aptDate = new Date(apt.date);
        const weekAgo = new Date();
        weekAgo.setDate(weekAgo.getDate() - 7);
        return aptDate >= weekAgo && aptDate <= new Date();
      }).length,
      thisMonthAppointments: appointments.filter(apt => {
        const aptDate = new Date(apt.date);
        const monthAgo = new Date();
        monthAgo.setMonth(monthAgo.getMonth() - 1);
        return aptDate >= monthAgo && aptDate <= new Date();
      }).length
    };

    // Get recent appointments for dashboard
    const recentAppointments = appointments
      .sort((a, b) => new Date(b.createdAt?.toDate?.() || 0).getTime() - new Date(a.createdAt?.toDate?.() || 0).getTime())
      .slice(0, 5);

    // Get today's sessions
    const todaysSessions = appointments
      .filter(apt => apt.date === today)
      .map(apt => ({
        id: apt.id,
        clientName: `${apt.userfirstname || ''} ${apt.userlastname || ''}`.trim(),
        sessionType: apt.serviceType || apt.sessionType || 'Training Session',
        time: apt.time,
        duration: apt.duration || '60 min',
        status: apt.status,
        userfirstname: apt.userfirstname,
        userlastname: apt.userlastname,
        userEmail: apt.userEmail
      }))
      .sort((a, b) => {
        const timeA = parseInt(a.time.replace(/[^\d]/g, ''));
        const timeB = parseInt(b.time.replace(/[^\d]/g, ''));
        return timeA - timeB;
      });

    console.log(`Generated stats for trainer ${trainerId}:`, stats);

    return NextResponse.json({
      success: true,
      stats,
      recentAppointments,
      todaysSessions,
      totalAppointments: appointments.length
    }, { status: 200 });

  } catch (error) {
    console.error('Error fetching trainer stats:', error);
    
    return NextResponse.json({
      success: false,
      message: 'Failed to fetch trainer statistics',
      error: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 });
  }
}