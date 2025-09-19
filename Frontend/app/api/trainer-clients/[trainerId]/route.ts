import { NextRequest, NextResponse } from 'next/server';
import { 
  collection, 
  query, 
  where, 
  getDocs,
  doc,
  getDoc 
} from 'firebase/firestore';
import { db } from '@/lib/firebase';

// GET - Fetch all clients for a specific trainer
export async function GET(request: NextRequest, { params }: { params: Promise<{ trainerId: string }> }) {
  try {
    const { trainerId } = await params;
    console.log('Fetching clients for trainer:', trainerId);

    let appointments: any[] = [];
    let retries = 3;

    while (retries > 0) {
      try {
        // Get all trainer appointments from the correct collection to extract client information
        const appointmentsRef = collection(db, 'trainers-appointment');
        const q = query(
          appointmentsRef,
          where('doctorId', '==', trainerId) // Note: using doctorId as it stores trainerId in your schema
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

    // Extract unique clients from appointments
    const clientsMap = new Map();
    
    for (const appointment of appointments) {
      const clientId = appointment.userId;
      
      if (!clientsMap.has(clientId)) {
        // Try to get additional user details from users collection
        let userDetails = null;
        try {
          const userDoc = await getDoc(doc(db, 'users', clientId));
          if (userDoc.exists()) {
            userDetails = userDoc.data();
          }
        } catch (error) {
          console.log('Could not fetch user details for:', clientId);
        }

        // Calculate client statistics
        const clientAppointments = appointments.filter(apt => apt.userId === clientId);
        const totalSessions = clientAppointments.length;
        const completedSessions = clientAppointments.filter(apt => apt.status === 'Completed').length;
        const confirmedSessions = clientAppointments.filter(apt => apt.status === 'Confirmed').length;
        const pendingSessions = clientAppointments.filter(apt => apt.status === 'Pending').length;
        
        // Get the most recent appointment
        const sortedAppointments = clientAppointments.sort((a, b) => 
          new Date(b.createdAt?.toDate?.() || b.createdAt || 0).getTime() - new Date(a.createdAt?.toDate?.() || a.createdAt || 0).getTime()
        );
        const latestAppointment = sortedAppointments[0];
        
        // Find next upcoming session
        const today = new Date().toISOString().split('T')[0];
        const upcomingSessions = clientAppointments
          .filter(apt => apt.date > today && apt.status !== 'Cancelled')
          .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
        
        const nextSession = upcomingSessions.length > 0 ? upcomingSessions[0].date : null;
        
        // Determine client status
        const hasRecentActivity = clientAppointments.some(apt => {
          const aptDate = new Date(apt.date);
          const twoWeeksAgo = new Date();
          twoWeeksAgo.setDate(twoWeeksAgo.getDate() - 14);
          return aptDate >= twoWeeksAgo;
        });
        
        const status = hasRecentActivity || upcomingSessions.length > 0 ? 'active' : 'inactive';
        
        // Calculate progress (percentage of completed sessions)
        const progress = totalSessions > 0 ? Math.round((completedSessions / totalSessions) * 100) : 0;
        
        // Create client object using the actual database schema
        const client = {
          id: clientId,
          name: `${appointment.userfirstname} ${appointment.userlastname}`,
          email: appointment.userEmail,
          phone: appointment.userphonenumber,
          address: appointment.useradress,
          joinDate: latestAppointment?.createdAt?.toDate?.()?.toISOString?.()?.split('T')[0] || 
                   (latestAppointment?.createdAt ? new Date(latestAppointment.createdAt).toISOString().split('T')[0] : new Date().toISOString().split('T')[0]),
          goals: appointment.userdescription || 'General Fitness', // Using userdescription as goals
          status,
          totalSessions,
          completedSessions,
          confirmedSessions,
          pendingSessions,
          nextSession,
          progress,
          age: userDetails?.age || null, // Age not in appointment schema
          notes: appointment.userdescription || 'No notes available',
          // Aggregate session types using serviceType from schema
          sessionTypes: [...new Set(clientAppointments.map(apt => apt.serviceType))],
          // Recent achievements based on completed sessions
          achievements: completedSessions >= 10 ? ['10+ Sessions Completed', 'Dedicated Client'] : 
                       completedSessions >= 5 ? ['5+ Sessions Completed', 'Regular Attendee'] : 
                       completedSessions >= 1 ? ['First Session Completed'] : [],
          // Last session date
          lastSessionDate: completedSessions > 0 ? 
            clientAppointments
              .filter(apt => apt.status === 'Completed')
              .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())[0]?.date 
            : null
        };
        
        clientsMap.set(clientId, client);
      }
    }

    const clients = Array.from(clientsMap.values());
    
    // Sort clients by most recent activity
    clients.sort((a, b) => {
      const aDate = new Date(a.lastSessionDate || a.joinDate || 0);
      const bDate = new Date(b.lastSessionDate || b.joinDate || 0);
      return bDate.getTime() - aDate.getTime();
    });

    console.log(`Found ${clients.length} unique clients for trainer ${trainerId}`);

    return NextResponse.json({
      success: true,
      clients,
      totalClients: clients.length,
      activeClients: clients.filter(c => c.status === 'active').length,
      inactiveClients: clients.filter(c => c.status === 'inactive').length
    }, { status: 200 });

  } catch (error) {
    console.error('Error fetching trainer clients:', error);
    
    return NextResponse.json({
      success: false,
      message: 'Failed to fetch clients',
      error: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 });
  }
}