# NeoRecruiter - Firebase Deployment Guide

## 🚀 Quick Deployment

### Option 1: Automated Script
```bash
# Run the deployment script
deploy.bat
```

### Option 2: Manual Steps

#### 1. Install Firebase CLI
```bash
npm install -g firebase-tools
```

#### 2. Login to Firebase
```bash
firebase login
```

#### 3. Create Firebase Project
```bash
firebase projects:create neorecruiter-ai
```

#### 4. Deploy Backend (Functions)
```bash
cd Backend
npm install
firebase deploy --only functions
```

#### 5. Deploy Frontend (Hosting)
```bash
cd Frontend
npm run build
firebase deploy --only hosting
```

## 🔧 Configuration

### Environment Variables (Firebase Functions)
Set these in Firebase Console → Functions → Configuration:

```bash
firebase functions:config:set \
  app.mongo_uri="mongodb+srv://username:password@cluster.mongodb.net/neorecruiter" \
  app.jwt_secret="your-jwt-secret" \
  app.email_user="your-email@gmail.com" \
  app.email_pass="your-app-password" \
  app.gemini_api_key="your-gemini-api-key"
```

### Or use Firebase Console:
1. Go to Firebase Console
2. Select your project
3. Functions → Configuration
4. Add environment variables

## 📱 Expected URLs After Deployment

- **Frontend**: `https://neorecruiter-ai.web.app`
- **Backend API**: `https://us-central1-neorecruiter-ai.cloudfunctions.net/api`

## 🔍 Troubleshooting

### Common Issues:

1. **Functions deployment fails**
   - Check Node.js version (use 18)
   - Verify all dependencies installed
   - Check environment variables

2. **CORS errors**
   - Update CORS configuration in app.js
   - Add your domain to allowed origins

3. **Database connection fails**
   - Verify MongoDB Atlas connection string
   - Check network access settings
   - Ensure environment variables are set

## 💰 Firebase Pricing

### Free Tier Limits:
- **Hosting**: 10GB storage, 10GB/month transfer
- **Functions**: 2M invocations/month, 400K GB-seconds
- **Firestore**: 1GB storage, 50K reads/day

### Paid Plans:
- **Blaze Plan**: Pay-as-you-go
- Functions: $0.40/M invocations
- Hosting: $0.026/GB storage

## 🔒 Security Setup

### 1. Firebase Security Rules
```javascript
// Firestore rules (if using Firestore)
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /{document=**} {
      allow read, write: if request.auth != null;
    }
  }
}
```

### 2. Environment Variables
- Never commit .env files
- Use Firebase Functions config
- Rotate API keys regularly

## 📊 Monitoring

### Firebase Console Features:
- **Functions Logs**: Monitor API calls
- **Performance**: Track response times
- **Analytics**: User engagement
- **Crashlytics**: Error reporting

## 🚀 CI/CD Setup (Optional)

### GitHub Actions
```yaml
name: Deploy to Firebase
on:
  push:
    branches: [ main ]

jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
    - uses: actions/checkout@v2
    - uses: actions/setup-node@v2
      with:
        node-version: '18'
    - run: npm ci
    - run: npm run build
    - uses: FirebaseExtended/action-hosting-deploy@v0
      with:
        repoToken: '${{ secrets.GITHUB_TOKEN }}'
        firebaseServiceAccount: '${{ secrets.FIREBASE_SERVICE_ACCOUNT }}'
        projectId: neorecruiter-ai
```

## ✅ Post-Deployment Checklist

- [ ] Frontend loads correctly
- [ ] Backend API responds
- [ ] Database connection works
- [ ] Email sending works
- [ ] AI analysis works
- [ ] File uploads work
- [ ] Authentication works
- [ ] All routes accessible

## 🎉 Success!

Your NeoRecruiter platform is now live on Firebase:
- **Frontend**: https://neorecruiter-ai.web.app
- **Backend**: https://us-central1-neorecruiter-ai.cloudfunctions.net/api

**Total Cost**: Free tier covers most usage!

---

**Need Help?** Check Firebase documentation or contact support.