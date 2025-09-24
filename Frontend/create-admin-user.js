// Create admin user in the database
const createAdminUser = async () => {
  console.log('👤 Creating Admin User...\n');

  try {
    // Create an admin user
    const signupResponse = await fetch('http://localhost:3002/api/auth/signup-firebase', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        firstName: 'Admin',
        lastName: 'User',
        email: 'admin@wellzonelanka.com',
        password: 'admin123',
        role: 'admin'
      }),
    });

    const signupData = await signupResponse.json();
    console.log('✅ Admin user creation response:', signupData);

    if (signupData.success) {
      console.log('✅ Admin user created successfully!');
      console.log('📝 Admin Credentials:');
      console.log('   Email: admin@wellzonelanka.com');
      console.log('   Password: admin123');
      console.log('   Role: admin');
      console.log('\n🔐 Admin Login Instructions:');
      console.log('1. Go to http://localhost:3002/auth/login');
      console.log('2. Use the admin credentials above');
      console.log('3. You will be automatically redirected to http://localhost:3002/admin');
      console.log('4. You cannot navigate back to main website pages');
      console.log('5. Use the logout button in the admin panel to exit');
    } else {
      console.log('❌ Failed to create admin user:', signupData.message);
      if (signupData.message.includes('already exists')) {
        console.log('✅ Admin user already exists! You can use the credentials:');
        console.log('   Email: admin@wellzonelanka.com');
        console.log('   Password: admin123');
      }
    }

  } catch (error) {
    console.error('❌ Test failed:', error);
  }
};

// Run the test
createAdminUser();