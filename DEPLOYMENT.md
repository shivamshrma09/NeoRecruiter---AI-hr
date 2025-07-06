# NeoRecruiter - Free Deployment Guide

## 🚀 Free Deployment Options

### 1. Frontend Deployment (Vercel) - FREE
**Steps:**
1. Go to [vercel.com](https://vercel.com)
2. Sign up with GitHub account
3. Import your repository: `shivamshrma09/NeoRecruiter---AI-hr`
4. Set build settings:
   - Framework: Vite
   - Root Directory: `Frontend`
   - Build Command: `npm run build`
   - Output Directory: `dist`
5. Add environment variable:
   - `VITE_BASE_URL`: Your backend URL (from step 2)
6. Deploy!

**Your frontend will be live at**: `https://your-project-name.vercel.app`

### 2. Backend Deployment (Render) - FREE
**Steps:**
1. Go to [render.com](https://render.com)
2. Sign up with GitHub account
3. Create new Web Service
4. Connect repository: `shivamshrma09/NeoRecruiter---AI-hr`
5. Set configuration:
   - Root Directory: `Backend`
   - Build Command: `npm install`
   - Start Command: `npm start`
6. Add environment variables:
   ```
   PORT=10000
   MONGO_URI=your-mongodb-atlas-connection-string
   JWT_SECRET=your-super-secret-jwt-key
   EMAIL_USER=your-gmail@gmail.com
   EMAIL_PASS=your-gmail-app-password
   GEMINI_API_KEY=your-gemini-api-key
   NODE_ENV=production
   ```
7. Deploy!

**Your backend will be live at**: `https://your-service-name.onrender.com`

### 3. Database (MongoDB Atlas) - FREE
**Steps:**
1. Go to [mongodb.com/atlas](https://mongodb.com/atlas)
2. Sign up for free account
3. Create new cluster (M0 Sandbox - FREE)
4. Create database user
5. Add IP address (0.0.0.0/0 for all access)
6. Get connection string
7. Replace in backend environment variables

**Free tier includes**: 512 MB storage, shared RAM

### 4. Email Service (Gmail) - FREE
**Steps:**
1. Enable 2-factor authentication on Gmail
2. Generate app-specific password:
   - Google Account → Security → App passwords
   - Generate password for "Mail"
3. Use this password in EMAIL_PASS environment variable

### 5. AI Service (Google Gemini) - FREE TIER
**Steps:**
1. Go to [ai.google.dev](https://ai.google.dev)
2. Get free API key
3. Free tier: 15 requests per minute
4. Add to GEMINI_API_KEY environment variable

## 📋 Complete Deployment Checklist

### ✅ Pre-Deployment
- [ ] Code pushed to GitHub
- [ ] All environment variables identified
- [ ] Gmail app password generated
- [ ] Gemini API key obtained

### ✅ Database Setup
- [ ] MongoDB Atlas cluster created
- [ ] Database user created
- [ ] Network access configured
- [ ] Connection string obtained

### ✅ Backend Deployment
- [ ] Render account created
- [ ] Web service configured
- [ ] Environment variables added
- [ ] Build and start commands set
- [ ] Deployment successful

### ✅ Frontend Deployment
- [ ] Vercel account created
- [ ] Repository imported
- [ ] Build settings configured
- [ ] Backend URL added to environment
- [ ] Deployment successful

### ✅ Testing
- [ ] Frontend loads correctly
- [ ] Backend API responds
- [ ] Database connection works
- [ ] Email sending works
- [ ] AI analysis works
- [ ] File uploads work

## 🔧 Environment Variables Reference

### Backend (.env)
```env
PORT=10000
MONGO_URI=mongodb+srv://username:password@cluster.mongodb.net/neorecruiter
JWT_SECRET=your-super-secret-jwt-key-minimum-32-characters
EMAIL_USER=your-email@gmail.com
EMAIL_PASS=your-16-character-app-password
GEMINI_API_KEY=your-gemini-api-key
NODE_ENV=production
```

### Frontend (.env)
```env
VITE_BASE_URL=https://your-backend-url.onrender.com
```

## 🌐 Expected URLs After Deployment

- **Frontend**: `https://neorecruiter-frontend.vercel.app`
- **Backend**: `https://neorecruiter-backend.onrender.com`
- **Database**: MongoDB Atlas (cloud-hosted)

## 🔍 Troubleshooting

### Common Issues:

1. **Build Fails on Vercel**
   - Check if Frontend folder structure is correct
   - Verify package.json in Frontend directory
   - Check build logs for specific errors

2. **Backend Not Starting on Render**
   - Verify start command: `npm start`
   - Check if server.js exists in Backend folder
   - Review environment variables

3. **Database Connection Fails**
   - Verify MongoDB Atlas connection string
   - Check network access settings (allow all IPs)
   - Ensure database user has proper permissions

4. **Email Not Sending**
   - Verify Gmail app password (not regular password)
   - Check if 2-factor authentication is enabled
   - Test with simple email first

5. **AI Analysis Not Working**
   - Verify Gemini API key is correct
   - Check API quota and billing
   - Review console logs for errors

## 💰 Cost Breakdown (All FREE)

- **Vercel**: Free tier (100GB bandwidth/month)
- **Render**: Free tier (750 hours/month)
- **MongoDB Atlas**: Free tier (512MB storage)
- **Gmail**: Free (with existing account)
- **Gemini AI**: Free tier (15 requests/minute)

**Total Monthly Cost**: $0 🎉

## 📈 Scaling Options

When you outgrow free tiers:
- **Vercel Pro**: $20/month
- **Render Starter**: $7/month
- **MongoDB Atlas M10**: $9/month
- **Gemini AI Pay-as-you-go**: $0.001 per request

## 🎯 Post-Deployment Steps

1. **Test All Features**
   - HR registration/login
   - Interview creation
   - Candidate interview flow
   - AI analysis
   - Email notifications

2. **Monitor Performance**
   - Check response times
   - Monitor error rates
   - Review usage metrics

3. **Update Documentation**
   - Update README with live URLs
   - Share with users/clients
   - Create user guides

## 🔒 Security Considerations

- Never commit .env files
- Use strong JWT secrets
- Enable CORS properly
- Monitor API usage
- Regular security updates

---

**Your NeoRecruiter platform is now live and ready for users! 🚀**