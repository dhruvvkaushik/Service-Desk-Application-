# Firebase Setup Guide for Service Desk Application

This guide will help you set up Firebase for the Service Desk Application to enable real-time authentication, database, and storage functionality.

## 🚀 Step 1: Create Firebase Project

1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Click "Create a project" or "Add project"
3. Enter a project name (e.g., "service-desk-app")
4. Choose whether to enable Google Analytics (optional)
5. Click "Create project"

## 🔐 Step 2: Enable Authentication

1. In your Firebase project, go to "Authentication" in the left sidebar
2. Click "Get started"
3. Go to the "Sign-in method" tab
4. Enable "Email/Password" authentication:
   - Click on "Email/Password"
   - Toggle "Enable"
   - Click "Save"
5. Enable "Google" authentication:
   - Click on "Google"
   - Toggle "Enable"
   - Enter a project support email
   - Click "Save"

## 🗄️ Step 3: Set Up Firestore Database

1. In your Firebase project, go to "Firestore Database" in the left sidebar
2. Click "Create database"
3. Choose "Start in test mode" for development (you can secure it later)
4. Select a location for your database (choose the closest to your users)
5. Click "Done"

### Firestore Security Rules

Update your Firestore security rules in the "Rules" tab:

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // Users can read and write their own data
    match /users/{userId} {
      allow read, write: if request.auth != null && request.auth.uid == userId;
    }
    
    // Tickets: users can create and read their own tickets
    // Admins can read and write all tickets
    match /tickets/{ticketId} {
      allow create: if request.auth != null;
      allow read, write: if request.auth != null && (
        resource.data.createdBy == request.auth.token.email ||
        get(/databases/$(database)/documents/users/$(request.auth.uid)).data.role == 'admin'
      );
    }
  }
}
```

## 📁 Step 4: Set Up Storage (Optional)

1. In your Firebase project, go to "Storage" in the left sidebar
2. Click "Get started"
3. Choose "Start in test mode" for development
4. Select a location for your storage bucket
5. Click "Done"

## 🔧 Step 5: Get Firebase Configuration

1. In your Firebase project, go to "Project settings" (gear icon)
2. Scroll down to "Your apps" section
3. Click "Add app" and select "Web" (</>)
4. Register your app with a nickname (e.g., "service-desk-web")
5. Copy the Firebase configuration object

## 📝 Step 6: Update Configuration

Replace the placeholder configuration in `src/config/firebase.js` with your actual Firebase config:

```javascript
const firebaseConfig = {
  apiKey: "your-api-key",
  authDomain: "your-project.firebaseapp.com",
  projectId: "your-project-id",
  storageBucket: "your-project.appspot.com",
  messagingSenderId: "your-sender-id",
  appId: "your-app-id"
};
```

## 👥 Step 7: Create Admin User

1. Go to "Authentication" > "Users" in Firebase Console
2. Click "Add user"
3. Enter admin email and password
4. After creating the user, go to Firestore Database
5. Create a document in the `users` collection with the user's UID
6. Set the document data:
   ```json
   {
     "uid": "user-uid",
     "email": "admin@example.com",
     "name": "Admin User",
     "role": "admin",
     "createdAt": "2024-01-01T00:00:00.000Z",
     "lastLogin": "2024-01-01T00:00:00.000Z"
   }
   ```

## 🔒 Step 8: Environment Variables (Recommended)

Create a `.env` file in your project root:

```env
VITE_FIREBASE_API_KEY=your-api-key
VITE_FIREBASE_AUTH_DOMAIN=your-project.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=your-project-id
VITE_FIREBASE_STORAGE_BUCKET=your-project.appspot.com
VITE_FIREBASE_MESSAGING_SENDER_ID=your-sender-id
VITE_FIREBASE_APP_ID=your-app-id
```

Then update `src/config/firebase.js`:

```javascript
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: import.meta.env.VITE_FIREBASE_APP_ID
};
```

## 🚀 Step 9: Install Dependencies

Run the following command to install Firebase:

```bash
npm install firebase
```

## ✅ Step 10: Test the Integration

1. Start your development server: `npm run dev`
2. Try registering a new user
3. Test login functionality
4. Create a ticket and verify it appears in Firestore
5. Test real-time updates by opening multiple browser tabs

## 🔧 Advanced Configuration

### Custom Claims for Admin Role

For production, consider using Firebase Custom Claims for admin roles:

1. Set up Firebase Functions
2. Create a function to set admin claims
3. Use custom claims in security rules

### Indexes

Firestore may require composite indexes for complex queries. If you see errors about missing indexes:

1. Go to Firestore > Indexes
2. Create the required composite indexes
3. Wait for indexes to build

### Backup and Export

Set up automated backups for your Firestore data:

1. Use Firebase Extensions for automated backups
2. Export data regularly for compliance
3. Set up monitoring and alerts

## 🛡️ Security Best Practices

1. **Never expose API keys in client-side code** (use environment variables)
2. **Implement proper security rules** for Firestore
3. **Use Firebase Auth** for user management
4. **Enable App Check** for additional security
5. **Monitor usage** and set up billing alerts
6. **Regular security audits** of your rules and data

## 📊 Monitoring and Analytics

1. **Firebase Analytics**: Track user behavior
2. **Crashlytics**: Monitor app crashes
3. **Performance Monitoring**: Track app performance
4. **Firestore Usage**: Monitor database usage

## 🔄 Deployment Considerations

1. **Production Security Rules**: Update rules for production
2. **Environment Variables**: Use proper environment management
3. **Domain Verification**: Add your domain to authorized domains
4. **SSL Certificate**: Ensure HTTPS in production
5. **Backup Strategy**: Implement data backup procedures

## 🆘 Troubleshooting

### Common Issues:

1. **"Permission denied" errors**: Check Firestore security rules
2. **"Missing or insufficient permissions"**: Verify user authentication
3. **Real-time updates not working**: Check network connectivity
4. **Authentication errors**: Verify Firebase Auth configuration

### Debug Tips:

1. Enable Firebase debug mode in browser console
2. Check Firebase Console logs
3. Verify network requests in browser dev tools
4. Test with Firebase Emulator for local development

## 📚 Additional Resources

- [Firebase Documentation](https://firebase.google.com/docs)
- [Firestore Security Rules](https://firebase.google.com/docs/firestore/security/get-started)
- [Firebase Authentication](https://firebase.google.com/docs/auth)
- [Firebase Hosting](https://firebase.google.com/docs/hosting)

---

Your Service Desk Application is now ready with Firebase integration! 🎉 