// Simple test to create a user and test suspend functionality
const testUserCreation = async () => {
  console.log('👤 Creating test user...\n');

  try {
    // Create a test user
    const signupResponse = await fetch('http://localhost:3002/api/auth/signup-firebase', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        firstName: 'Test',
        lastName: 'User',
        email: 'testuser@example.com',
        password: 'password123',
        role: 'user'
      }),
    });

    const signupData = await signupResponse.json();
    console.log('✅ User creation response:', signupData);

    if (signupData.success) {
      console.log('✅ Test user created successfully!');
      console.log('📝 You can now test the suspend functionality manually:');
      console.log('1. Go to http://localhost:3002/admin');
      console.log('2. Find the test user in the Users section');
      console.log('3. Click the "Decline" button to suspend the user');
      console.log('4. Try to login with testuser@example.com / password123');
      console.log('5. You should see the suspension message');
      console.log('6. Click "Accept" to reactivate the user');
      console.log('7. Try logging in again - it should work');
    } else {
      console.log('❌ Failed to create test user:', signupData.message);
    }

  } catch (error) {
    console.error('❌ Test failed:', error);
  }
};

// Run the test
testUserCreation();