// lib/services/appointmentService.ts
import { 
  collection, 
  addDoc, 
  query, 
  where, 
  getDocs, 
  getDoc,
  orderBy, 
  doc, 
  updateDoc, 
  deleteDoc,
  serverTimestamp,
  Timestamp
} from 'firebase/firestore';
import { db } from '../firebase';
import { getTodayString } from '../utils/dateUtils';

export interface AppointmentData {
  date: string;
  serviceType: string;
  time: string;
  doctorId: string;
  doctorName: string;
  userEmail: string;
  userId: string;
  userfirstname: string;
  userlastname: string;
  userphonenumber: string;
  useradress: string;
  userdescription: string;
  status?: 'Pending' | 'Confirmed' | 'Cancelled' | 'Completed';
  createdAt?: Timestamp;
  updatedAt?: Timestamp;
}

export interface Appointment extends AppointmentData {
  id: string;
}

// Create a new appointment
export const createAppointment = async (appointmentData: AppointmentData): Promise<string> => {
  try {
    const appointmentWithTimestamp = {
      ...appointmentData,
      status: appointmentData.status || 'Pending',
      createdAt: Timestamp.now(),
      updatedAt: Timestamp.now()
    };

    const docRef = await addDoc(collection(db, 'appointments'), appointmentWithTimestamp);
    console.log('Appointment created with ID:', docRef.id);
    return docRef.id;
  } catch (error) {
    console.error('Error creating appointment:', error);
    throw error;
  }
};

// Get appointments for a specific doctor
// Debug function to get all appointments (for troubleshooting)
export const getAllAppointments = async (): Promise<Appointment[]> => {
  try {
    console.log('🔍 Getting ALL appointments from database...');
    
    const appointmentsRef = collection(db, 'appointments');
    const querySnapshot = await getDocs(appointmentsRef);
    const appointments: Appointment[] = [];
    
    console.log('📋 Total appointments in database:', querySnapshot.size);
    
    querySnapshot.forEach((doc) => {
      const appointmentData = doc.data();
      console.log('📄 Appointment found:', { 
        id: doc.id, 
        doctorId: appointmentData.doctorId, 
        doctorName: appointmentData.doctorName,
        date: appointmentData.date,
        patientName: `${appointmentData.userfirstname} ${appointmentData.userlastname}`
      });
      appointments.push({
        id: doc.id,
        ...appointmentData
      } as Appointment);
    });
    
    return appointments;
  } catch (error) {
    console.error('❌ Error getting all appointments:', error);
    return [];
  }
};

export const getDoctorAppointments = async (doctorId: string): Promise<Appointment[]> => {
  try {
    console.log('🔍 getDoctorAppointments called with doctorId:', doctorId);
    
    const appointmentsRef = collection(db, 'appointments');
    
    // Try simple query first without orderBy to avoid index issues
    const q = query(
      appointmentsRef,
      where('doctorId', '==', doctorId)
    );
    
    console.log('🔍 Executing Firebase query...');
    const querySnapshot = await getDocs(q);
    const appointments: Appointment[] = [];
    
    console.log('📋 Query snapshot size:', querySnapshot.size);
    
    querySnapshot.forEach((doc) => {
      const appointmentData = doc.data();
      console.log('📄 Found appointment:', { id: doc.id, doctorId: appointmentData.doctorId, date: appointmentData.date });
      appointments.push({
        id: doc.id,
        ...appointmentData
      } as Appointment);
    });
    
    // Sort appointments by date and time locally
    appointments.sort((a, b) => {
      if (a.date !== b.date) {
        return new Date(b.date).getTime() - new Date(a.date).getTime();
      }
      return b.time.localeCompare(a.time);
    });
    
    console.log('✅ Returning appointments count:', appointments.length);
    return appointments;
  } catch (error) {
    console.error('Error fetching doctor appointments:', error);
    throw error;
  }
};

// Get appointments for today for a specific doctor
export const getDoctorTodayAppointments = async (doctorId: string): Promise<Appointment[]> => {
  try {
    console.log('🔍 getDoctorTodayAppointments called with doctorId:', doctorId);
    
    const todayString = getTodayString();
    
    console.log('📅 Today string for comparison:', todayString);
    
    // Get all appointments for this doctor first, then filter locally
    console.log('🔍 Getting all doctor appointments first...');
    const allDoctorAppointments = await getDoctorAppointments(doctorId);
    
    // Filter for today's appointments locally
    const todayAppointments = allDoctorAppointments.filter(appointment => {
      return appointment.date === todayString;
    });
    
    console.log('� Filtered today appointments count:', todayAppointments.length);
    
    // Sort by time
    todayAppointments.sort((a, b) => a.time.localeCompare(b.time));
    
    todayAppointments.forEach(apt => {
      console.log('📄 Today appointment:', { 
        id: apt.id, 
        date: apt.date,
        time: apt.time,
        patient: `${apt.userfirstname} ${apt.userlastname}`
      });
    });
    
    console.log('✅ Returning today appointments count:', todayAppointments.length);
    return todayAppointments;
  } catch (error) {
    console.error('Error fetching today appointments:', error);
    throw error;
  }
};

// Get upcoming appointments for a specific doctor
export const getDoctorUpcomingAppointments = async (doctorId: string): Promise<Appointment[]> => {
  try {
    console.log('🔍 getDoctorUpcomingAppointments called with doctorId:', doctorId);
    
    const todayString = getTodayString();
    
    console.log('📅 Today string for comparison:', todayString);
    
    // Get all appointments for this doctor first, then filter locally
    console.log('🔍 Getting all doctor appointments first...');
    const allDoctorAppointments = await getDoctorAppointments(doctorId);
    
    // Filter for upcoming appointments locally
    const upcomingAppointments = allDoctorAppointments.filter(appointment => {
      return appointment.date > todayString;
    });
    
    console.log('📋 Filtered upcoming appointments count:', upcomingAppointments.length);
    
    // Sort by date, then by time
    upcomingAppointments.sort((a, b) => {
      const dateComparison = a.date.localeCompare(b.date);
      if (dateComparison === 0) {
        return a.time.localeCompare(b.time);
      }
      return dateComparison;
    });
    
    upcomingAppointments.forEach(apt => {
      console.log('📄 Upcoming appointment:', { 
        id: apt.id, 
        date: apt.date,
        time: apt.time,
        patient: `${apt.userfirstname} ${apt.userlastname}`
      });
    });
    
    console.log('✅ Returning upcoming appointments count:', upcomingAppointments.length);
    return upcomingAppointments;
  } catch (error) {
    console.error('Error fetching upcoming appointments:', error);
    throw error;
  }
};

// Get past appointments for a specific doctor
export const getDoctorPastAppointments = async (doctorId: string): Promise<Appointment[]> => {
  try {
    console.log('🔍 getDoctorPastAppointments called with doctorId:', doctorId);
    
    const todayString = getTodayString();
    
    console.log('📅 Today string for comparison:', todayString);
    
    // Get all appointments for this doctor first, then filter locally
    console.log('🔍 Getting all doctor appointments first...');
    const allDoctorAppointments = await getDoctorAppointments(doctorId);
    
    // Filter for past appointments locally
    const pastAppointments = allDoctorAppointments.filter(appointment => {
      return appointment.date < todayString;
    });
    
    console.log('📋 Filtered past appointments count:', pastAppointments.length);
    
    // Sort by date (newest first) and then by time
    pastAppointments.sort((a, b) => {
      if (a.date !== b.date) {
        return new Date(b.date).getTime() - new Date(a.date).getTime();
      }
      return b.time.localeCompare(a.time);
    });
    
    pastAppointments.forEach(apt => {
      console.log('📄 Past appointment:', { 
        id: apt.id, 
        date: apt.date,
        time: apt.time,
        patient: `${apt.userfirstname} ${apt.userlastname}`
      });
    });
    
    console.log('✅ Returning past appointments count:', pastAppointments.length);
    return pastAppointments;
  } catch (error) {
    console.error('Error fetching past appointments:', error);
    throw error;
  }
};

// Get unique patients for a specific doctor
export const getDoctorPatients = async (doctorId: string): Promise<any[]> => {
  try {
    console.log('🔍 getDoctorPatients called with doctorId:', doctorId);
    
    // Get all appointments for this doctor first, then process locally
    const allDoctorAppointments = await getDoctorAppointments(doctorId);
    
    console.log('📋 Processing appointments to extract unique patients...');
    
    const patientsMap = new Map();
    
    allDoctorAppointments.forEach((appointment) => {
      const patientKey = appointment.userId;
      
      if (!patientsMap.has(patientKey)) {
        // Calculate next appointment (future appointments only)
        const today = new Date().toISOString().split('T')[0];
        const futureAppointments = allDoctorAppointments
          .filter(apt => apt.userId === appointment.userId && apt.date >= today)
          .sort((a, b) => a.date.localeCompare(b.date));
        
        const nextAppointment = futureAppointments.length > 0 
          ? `${futureAppointments[0].date} at ${futureAppointments[0].time}` 
          : null;
        
        // Calculate age (mock for now - you can enhance this with actual birth date)
        const age = Math.floor(Math.random() * 40) + 20; // Random age between 20-60
        
        patientsMap.set(patientKey, {
          id: appointment.userId,
          patientName: `${appointment.userfirstname} ${appointment.userlastname}`,
          email: appointment.userEmail,
          phone: appointment.userphonenumber,
          address: appointment.useradress,
          age: age,
          lastVisit: appointment.date,
          nextAppointment: nextAppointment,
          status: 'Active', // You can implement logic to determine this
          medicalConditions: appointment.userdescription || "None recorded",
          allergies: "None recorded", // This would come from patient profile
          appointments: [],
          totalAppointments: 0
        });
      }
      
      // Add appointment to patient's appointment list
      const patient = patientsMap.get(patientKey);
      patient.appointments.push({
        id: appointment.id,
        date: appointment.date,
        time: appointment.time,
        serviceType: appointment.serviceType,
        description: appointment.userdescription
      });
      
      // Update total appointments count
      patient.totalAppointments = patient.appointments.length;
      
      // Update last visit if this appointment is more recent
      if (appointment.date > patient.lastVisit) {
        patient.lastVisit = appointment.date;
      }
    });
    
    const patients = Array.from(patientsMap.values());
    
    console.log('👥 Unique patients found:', patients.length);
    patients.forEach(patient => {
      console.log('👤 Patient:', {
        name: patient.patientName,
        email: patient.email,
        totalAppointments: patient.totalAppointments,
        lastVisit: patient.lastVisit,
        nextAppointment: patient.nextAppointment
      });
    });
    
    return patients;
  } catch (error) {
    console.error('Error fetching doctor patients:', error);
    throw error;
  }
};

// Get doctor profile by ID
export const getDoctorProfile = async (doctorId: string): Promise<any> => {
  try {
    console.log('🔍 getDoctorProfile called with doctorId:', doctorId);
    
    const userRef = doc(db, 'users', doctorId);
    const userDoc = await getDoc(userRef);
    
    if (userDoc.exists()) {
      const doctorData = userDoc.data();
      console.log('👨‍⚕️ Doctor profile found:', doctorData);
      
      return {
        id: userDoc.id,
        fullName: `${doctorData.firstName || ''} ${doctorData.lastName || ''}`.trim(),
        firstName: doctorData.firstName || '',
        lastName: doctorData.lastName || '',
        email: doctorData.email || '',
        phone: doctorData.phone || '',
        licenseNumber: doctorData.licenseNumber || '',
        specialization: doctorData.specialization || '',
        experience: doctorData.experience || '',
        bio: doctorData.bio || '',
        address: doctorData.address || '',
        education: doctorData.education || '',
        certifications: doctorData.certifications || '',
        profileImage: doctorData.profileImage || '',
        isApproved: doctorData.isApproved || false,
        role: doctorData.role || 'doctor',
        createdAt: doctorData.createdAt || null
      };
    } else {
      console.log('❌ Doctor profile not found');
      return null;
    }
  } catch (error) {
    console.error('Error fetching doctor profile:', error);
    throw error;
  }
};

// Submit doctor profile changes for admin approval
export const submitDoctorProfileChanges = async (doctorId: string, changes: any): Promise<void> => {
  try {
    console.log('🔄 Submitting doctor profile changes for approval:', changes);
    
    const pendingChangesRef = collection(db, 'pendingChanges');
    const changeDoc = {
      doctorId: doctorId,
      changeType: 'doctorProfile',
      originalData: await getDoctorProfile(doctorId),
      proposedChanges: changes,
      status: 'pending',
      submittedAt: new Date().toISOString(),
      submittedBy: doctorId,
      reviewedAt: null,
      reviewedBy: null,
      adminNotes: ''
    };
    
    const docRef = await addDoc(pendingChangesRef, changeDoc);
    console.log('✅ Profile changes submitted for approval with ID:', docRef.id);
  } catch (error) {
    console.error('Error submitting profile changes:', error);
    throw error;
  }
};

// Get pending changes for a doctor
export const getDoctorPendingChanges = async (doctorId: string): Promise<any[]> => {
  try {
    console.log('🔍 Getting pending changes for doctorId:', doctorId);
    
    const pendingChangesRef = collection(db, 'pendingChanges');
    const q = query(
      pendingChangesRef,
      where('doctorId', '==', doctorId),
      where('status', '==', 'pending')
    );
    
    const querySnapshot = await getDocs(q);
    const pendingChanges: any[] = [];
    
    querySnapshot.forEach((doc) => {
      pendingChanges.push({
        id: doc.id,
        ...doc.data()
      });
    });
    
    console.log('📋 Found pending changes:', pendingChanges.length);
    return pendingChanges;
  } catch (error) {
    console.error('Error fetching pending changes:', error);
    throw error;
  }
};

// Update appointment status
export const updateAppointmentStatus = async (appointmentId: string, status: string): Promise<void> => {
  try {
    const appointmentRef = doc(db, 'appointments', appointmentId);
    await updateDoc(appointmentRef, {
      status,
      updatedAt: Timestamp.now()
    });
    console.log('Appointment status updated successfully');
  } catch (error) {
    console.error('Error updating appointment status:', error);
    throw error;
  }
};

// Delete appointment
export const deleteAppointment = async (appointmentId: string): Promise<void> => {
  try {
    await deleteDoc(doc(db, 'appointments', appointmentId));
    console.log('Appointment deleted successfully');
  } catch (error) {
    console.error('Error deleting appointment:', error);
    throw error;
  }
};

// Get appointment statistics for doctor dashboard
export const getDoctorAppointmentStats = async (doctorId: string) => {
  try {
    console.log('📊 Getting appointment stats for doctorId:', doctorId);
    
    const today = new Date();
    const todayString = today.toISOString().split('T')[0];
    
    console.log('📅 Today string:', todayString);
    
    // Get all appointments for this doctor
    const allAppointments = await getDoctorAppointments(doctorId);
    console.log('📋 Total appointments found:', allAppointments.length);
    
    // Get today's appointments
    const todayAppointments = allAppointments.filter(apt => apt.date === todayString);
    console.log('📅 Today appointments:', todayAppointments.length);
    
    // Get new bookings (appointments created in last 7 days)
    const lastWeek = new Date();
    lastWeek.setDate(lastWeek.getDate() - 7);
    console.log('📅 Last week cutoff:', lastWeek.toISOString());
    
    // Handle different date formats for createdAt
    const newBookings = allAppointments.filter(apt => {
      if (!apt.createdAt) return false;
      
      let createdDate;
      try {
        if (typeof apt.createdAt === 'string') {
          createdDate = new Date(apt.createdAt);
        } else if (apt.createdAt.toDate && typeof apt.createdAt.toDate === 'function') {
          createdDate = apt.createdAt.toDate();
        } else {
          // Fallback for any other format
          createdDate = new Date(apt.createdAt.seconds * 1000); // Firestore Timestamp
        }
        
        return createdDate >= lastWeek;
      } catch (error) {
        console.error('Error parsing createdAt date:', error);
        return false;
      }
    });
    console.log('📊 New bookings (last 7 days):', newBookings.length);
    
    // Get unique patients count
    const uniquePatients = new Set(allAppointments.map(apt => apt.userId)).size;
    console.log('👥 Unique patients:', uniquePatients);
    
    const stats = {
      totalPatients: uniquePatients,
      newBookings: newBookings.length,
      todaySessions: todayAppointments.length,
      profileViews: 1 // You might want to implement this separately
    };
    
    console.log('✅ Final stats:', stats);
    return stats;
  } catch (error) {
    console.error('Error fetching appointment stats:', error);
    throw error;
  }
};