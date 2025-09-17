// Simple test script to create a test appointment
// This is just for debugging - run this in browser console

const testAppointment = {
  date: "2025-09-17", // Today's date
  serviceType: "Consultation",
  time: "10:00 AM",
  doctorId: "eNRqpc8os8MBgoBe9vKi", // The doctor ID from terminal output
  doctorName: "Dr. Anjitha Sahashya", 
  userEmail: "test.patient@gmail.com",
  userId: "user_test_123",
  userfirstname: "Test",
  userlastname: "Patient",
  userphonenumber: "0771234567",
  useradress: "123 Test Street, Colombo",
  userdescription: "Regular checkup appointment for testing",
  status: "Confirmed"
};

console.log("Test appointment data:", testAppointment);

// To create this appointment, copy the data above and use it in the appointment booking form
// Or run createAppointment(testAppointment) in the browser console if the function is available