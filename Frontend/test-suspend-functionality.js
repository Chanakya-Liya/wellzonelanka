// Test script to verify suspend functionality
const testSuspendFunctionality = async () => {
  console.log('🔒 Testing Suspend Functionality...\n');

  try {
    // Test 1: Normal user login (should work)
    console.log('1. Testing normal user login (should work)...');
    const normalLoginResponse = await fetch('http://localhost:3002/api/auth/signin-firebase', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        email: 'john.doe@example.com',
        password: 'password123'
      }),
    });

    const normalLoginData = await normalLoginResponse.json();
    console.log('✅ Normal login response:', normalLoginData);

    if (normalLoginData.user) {
      const userId = normalLoginData.user.id;
      console.log('📝 User ID found:', userId);

      // Test 2: Suspend the user
      console.log('\n2. Testing user suspension...');
      const suspendResponse = await fetch('http://localhost:3002/api/admin/users', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          userId: userId,
          isApproved: false
        }),
      });

      const suspendData = await suspendResponse.json();
      console.log('✅ Suspend response:', suspendData);

      // Test 3: Try to login with suspended account (should fail)
      console.log('\n3. Testing suspended user login (should fail)...');
      const suspendedLoginResponse = await fetch('http://localhost:3002/api/auth/signin-firebase', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email: 'john.doe@example.com',
          password: 'password123'
        }),
      });

      const suspendedLoginData = await suspendedLoginResponse.json();
      console.log('❌ Suspended login response:', suspendedLoginData);
      
      if (suspendedLoginResponse.status === 403) {
        console.log('✅ Suspension is working correctly - login blocked!');
        console.log('📝 Error message:', suspendedLoginData.message);
      } else {
        console.log('❌ ISSUE: Suspended user was able to login!');
      }

      // Test 4: Reactivate the user
      console.log('\n4. Testing user reactivation...');
      const reactivateResponse = await fetch('http://localhost:3002/api/admin/users', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          userId: userId,
          isApproved: true
        }),
      });

      const reactivateData = await reactivateResponse.json();
      console.log('✅ Reactivate response:', reactivateData);

      // Test 5: Try to login with reactivated account (should work)
      console.log('\n5. Testing reactivated user login (should work)...');
      const reactivatedLoginResponse = await fetch('http://localhost:3002/api/auth/signin-firebase', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email: 'john.doe@example.com',
          password: 'password123'
        }),
      });

      const reactivatedLoginData = await reactivatedLoginResponse.json();
      console.log('✅ Reactivated login response:', reactivatedLoginData);
      
      if (reactivatedLoginResponse.status === 200) {
        console.log('✅ Reactivation is working correctly - login successful!');
      } else {
        console.log('❌ ISSUE: Reactivated user cannot login!');
      }
    } else {
      console.log('❌ No user found for testing. Please ensure there is a user with email john.doe@example.com');
    }

  } catch (error) {
    console.error('❌ Test failed:', error);
  }

  console.log('\n🔒 Suspend functionality test completed!');
};

// Run the test
testSuspendFunctionality();