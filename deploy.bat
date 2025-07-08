@echo off
echo 🚀 Starting NeoRecruiter Firebase Deployment...

echo.
echo 📦 Installing Firebase CLI globally...
npm install -g firebase-tools

echo.
echo 🔐 Login to Firebase (if not already logged in)...
firebase login

echo.
echo 🏗️ Building Frontend...
cd Frontend
npm run build
cd ..

echo.
echo ☁️ Deploying Backend Functions...
cd Backend
npm install
firebase deploy --only functions
cd ..

echo.
echo 🌐 Deploying Frontend to Firebase Hosting...
cd Frontend
firebase deploy --only hosting
cd ..

echo.
echo ✅ Deployment Complete!
echo 🌐 Frontend: https://neorecruiter-ai.web.app
echo ⚡ Backend: https://us-central1-neorecruiter-ai.cloudfunctions.net/api
echo.
pause