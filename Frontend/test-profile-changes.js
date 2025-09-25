// Test script to verify profile changes workflow
const testProfileChangesWorkflow = async () => {
  const baseUrl = 'http://localhost:3006';
  
  try {
    console.log('🧪 Testing Profile Changes Workflow');
    console.log('=====================================');
    
    // Step 1: Check current profile changes
    console.log('\n📋 Step 1: Checking current profile changes...');
    const response = await fetch(`${baseUrl}/api/admin/profile-changes`);
    const data = await response.json();
    
    console.log('Profile Changes Response:', JSON.stringify(data, null, 2));
    
    if (data.success) {
      console.log(`✅ Found ${data.total} total profile changes`);
      console.log(`👨‍⚕️ Doctor changes: ${data.doctorChanges.length}`);
      console.log(`💪 Trainer changes: ${data.trainerChanges.length}`);
      
      // Show details of each change
      data.doctorChanges.forEach((change, index) => {
        console.log(`\nDoctor Change ${index + 1}:`);
        console.log(`  ID: ${change.id}`);
        console.log(`  Status: ${change.status}`);
        console.log(`  Doctor ID: ${change.doctorId}`);
        console.log(`  Submitted: ${change.submittedAt}`);
        if (change.reviewedAt) {
          console.log(`  Reviewed: ${change.reviewedAt}`);
        }
        console.log(`  Proposed Changes:`, JSON.stringify(change.proposedChanges, null, 4));
      });
      
      data.trainerChanges.forEach((change, index) => {
        console.log(`\nTrainer Change ${index + 1}:`);
        console.log(`  ID: ${change.id}`);
        console.log(`  Status: ${change.status}`);
        console.log(`  Trainer ID: ${change.trainerId}`);
        console.log(`  Submitted: ${change.submittedAt}`);
        if (change.reviewedAt) {
          console.log(`  Reviewed: ${change.reviewedAt}`);
        }
        console.log(`  Proposed Changes:`, JSON.stringify(change.proposedChanges, null, 4));
      });
      
      // Test approving a pending change if any exist
      const pendingChanges = [...data.doctorChanges, ...data.trainerChanges].filter(c => c.status === 'pending');
      
      if (pendingChanges.length > 0) {
        console.log(`\n🔄 Step 2: Testing approval of pending change...`);
        const changeToApprove = pendingChanges[0];
        
        const approvalResponse = await fetch(`${baseUrl}/api/admin/profile-changes`, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            changeId: changeToApprove.id,
            action: 'approve',
            adminId: 'test-admin',
            adminNotes: 'Approved by automated test'
          })
        });
        
        const approvalResult = await approvalResponse.json();
        console.log('Approval Result:', JSON.stringify(approvalResult, null, 2));
        
        if (approvalResult.success) {
          console.log('✅ Profile change approved successfully!');
          console.log('📱 The changes should now be reflected in the user\'s profile and visible in the doctor settings page.');
          
          // Check updated profile changes
          console.log('\n📋 Step 3: Checking updated profile changes...');
          const updatedResponse = await fetch(`${baseUrl}/api/admin/profile-changes`);
          const updatedData = await updatedResponse.json();
          
          const approvedChange = [...updatedData.doctorChanges, ...updatedData.trainerChanges]
            .find(c => c.id === changeToApprove.id);
          
          if (approvedChange && approvedChange.status === 'approved') {
            console.log('✅ Change status updated to approved');
            console.log('📅 Reviewed at:', approvedChange.reviewedAt);
          }
        }
      } else {
        console.log('\n⚠️  No pending changes found to test approval workflow');
      }
      
    } else {
      console.log('❌ Error fetching profile changes:', data.error);
    }
    
  } catch (error) {
    console.error('❌ Test failed:', error);
  }
};

// Run the test
testProfileChangesWorkflow();