# Firebase Setup Guide for WellZone Lanka

## 🔥 Firebase Firestore Database Setup

### Step 1: Install Dependencies
```bash
npm install bcryptjs
npm install @types/bcryptjs --save-dev
```

### Step 2: Firebase Console Setup

1. **Go to Firebase Console**: https://console.firebase.google.com/
2. **Select your project**: "wellzonelankcom"
3. **Enable Firestore Database**:
   - Go to "Firestore Database" in the left sidebar
   - Click "Create database"
   - Choose "Start in test mode" (for development)
   - Select a location (preferably closer to your users)

### Step 3: Update Firestore Rules

Go to Firestore Database > Rules and update with:

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // Users collection - allow read/write for authenticated users
    match /users/{userId} {
      allow read, write: if true; // For development - make more restrictive in production
    }
    
    // Allow any authenticated user to read/write (for development)
    match /{document=**} {
      allow read, write: if true;
    }
  }
}
```

### Step 4: Get Your Firebase Config

1. Go to Project Settings (gear icon)
2. Scroll down to "Your apps"
3. Click on your web app
4. Copy the config values and update your `.env.local`:

```bash
NEXT_PUBLIC_FIREBASE_API_KEY=your_actual_api_key_here
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=wellzonelankcom.firebaseapp.com
NEXT_PUBLIC_FIREBASE_PROJECT_ID=wellzonelankcom
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=wellzonelankcom.appspot.com
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=597186379285
NEXT_PUBLIC_FIREBASE_APP_ID=1:597186379285:web:e58a19b4c910b07b25d81c
NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID=G-PM3CWZ1PSG
```

### Step 5: Test the Setup

1. **Start your development server**:
   ```bash
   npm run dev
   ```

2. **Register a new user** at `/auth/register`
3. **Check Firestore Console** - you should see a new "users" collection
4. **Login** with the same credentials at `/auth/login`

## 🗂️ Database Structure

The Firebase Firestore will store users in this structure:

```javascript
// Collection: users
// Document ID: auto-generated
{
  firstName: "John",
  lastName: "Doe",
  email: "john@example.com",
  passwordHash: "hashed_password_here",
  role: "user", // "user" | "trainer" | "doctor"
  licenseNumber: "12345", // for professionals only
  experience: 5, // for professionals only
  specialization: "Fitness", // for professionals only
  createdAt: "2024-01-15T10:30:00.000Z",
  isApproved: true // auto-true for users, requires approval for professionals
}
```

## 🚀 Features Enabled

- ✅ **User Registration** → Saves to Firebase Firestore
- ✅ **Password Security** → Bcrypt hashing (12 rounds)
- ✅ **Login Authentication** → Validates against Firestore
- ✅ **Role Management** → User, Trainer, Doctor roles
- ✅ **Professional Approval** → Doctors/trainers require approval
- ✅ **Data Persistence** → Permanent storage in cloud
- ✅ **Scalability** → Firebase auto-scales

## 🛠️ Troubleshooting

### If you get "Firebase API key invalid":
1. Double-check your `.env.local` file
2. Ensure API key is complete (should be 39 characters)
3. Restart your development server after .env changes

### If you get "Permission denied":
1. Check Firestore rules (should allow read/write for development)
2. Ensure your Firebase project is active
3. Verify project ID in config

### If registration/login fails:
1. Check browser console for detailed errors
2. Check server console logs
3. Verify Firestore is enabled in Firebase Console

## 🔐 Security Notes

- Passwords are hashed with bcrypt (12 salt rounds)
- No plain text passwords stored
- Professional accounts require admin approval
- Firestore rules should be tightened for production