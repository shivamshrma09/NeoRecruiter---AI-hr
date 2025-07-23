# NeoRecruiter API Endpoint Fixes

## Issues Fixed

1. **404 Error on `/hr/interviews` and `/mock/data` endpoints**
   - Added proper mock data endpoint at `/mock/data`
   - Fixed authentication middleware to properly handle tokens
   - Enhanced fallback mechanism in frontend API interceptor

## Changes Made

1. **Created new mock route**
   - Added `mock.route.js` with `/data` endpoint to serve demo data
   - Added health check endpoint at `/mock/health`

2. **Fixed authentication middleware**
   - Updated `hr.middleware.js` to properly verify tokens
   - Added proper handling for demo user vs. regular users
   - Added blacklisted token check

3. **Enhanced frontend API fallback**
   - Improved error handling in API interceptor
   - Added last-resort local mock data
   - Fixed method for fallback request

## How to Test

1. Start the backend server:
   ```
   cd Backend
   npm run dev
   ```

2. Start the frontend:
   ```
   cd Frontend
   npm run dev
   ```

3. Login with demo credentials:
   - Email: interview123@gmail.com
   - Password: interv@123

4. The dashboard should now load properly with mock data if the main API fails.

## Additional Notes

- The mock data is served from `utils/demoData.js`
- The frontend will automatically try the fallback endpoint if the main API fails
- Authentication now properly handles both demo users and regular users