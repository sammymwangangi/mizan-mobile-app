# 🚨 Google OAuth Error 400: Fix Guide

## The Problem
You're seeing "Access blocked: authorisation error" because your Google OAuth app configuration is incomplete.

## 🎯 IMMEDIATE SOLUTION

### Step 1: Configure OAuth Consent Screen
1. Go to [Google Cloud Console](https://console.cloud.google.com/apis/credentials/consent)
2. Select your project
3. Configure OAuth consent screen:

```
App Information:
├── App name: Mizan Money
├── User support email: sammymwinzi2@gmail.com
├── App logo: (optional - upload your app icon)
└── App domain: https://zibhzfmeyifbrduiesoh.supabase.co

Developer contact information:
└── Email addresses: sammymwinzi2@gmail.com

Authorized domains:
├── zibhzfmeyifbrduiesoh.supabase.co
└── localhost (for development)
```

### Step 2: Choose App Status

#### Option A: Testing Mode (Quick Fix - 5 minutes)
```
1. Keep publishing status as "Testing"
2. Go to "Test users" section  
3. Add test users:
   - sammymwinzi2@gmail.com
   - (any other emails you want to test with)
4. Save changes
```

#### Option B: Production Mode (Recommended - 1-7 days)
```
1. Change publishing status to "In production"
2. Fill out additional verification forms
3. Submit for Google review
4. Wait for approval (1-7 days)
5. Anyone can sign in once approved
```

### Step 3: Verify OAuth Client Configuration
Go to [Credentials](https://console.cloud.google.com/apis/credentials) and ensure:

```
Authorized JavaScript origins:
├── https://zibhzfmeyifbrduiesoh.supabase.co
├── https://localhost:3000
└── http://localhost:8082

Authorized redirect URIs:
├── https://zibhzfmeyifbrduiesoh.supabase.co/auth/v1/callback
├── exp://localhost:8082
├── exp://192.168.100.180:8082  
└── com.wingi.mizanbankingapp://redirect
```

## 🏃‍♂️ Quick Fix (Recommended):

**For immediate testing, use Option A (Testing Mode):**

1. **OAuth Consent Screen** → **Test users** → **ADD USERS**
2. Add: `sammymwinzi2@gmail.com`
3. **SAVE**
4. Test Google sign-in again

## 🧪 After Making Changes:

1. **Wait 5-10 minutes** for Google changes to propagate
2. **Clear browser cache** if testing on web
3. **Restart your app** and test again
4. **Check console logs** for detailed error info

## 🔍 Debugging Steps:

If it still doesn't work:

```bash
# Check your Google Cloud Console project
echo "Project ID: Check your active project in GCP"
echo "Client ID: 16096905643-h03qn1q2hmn7ri72llvam249us27q1ee.apps.googleusercontent.com"

# Verify environment variables
cat .env | grep GOOGLE
```

## ✅ Success Indicators:

You'll know it's working when:
- ✅ No "Access blocked" error
- ✅ Google login popup appears normally  
- ✅ User can select Google account
- ✅ App receives authentication token
- ✅ User is signed into your app

## 📞 Still Need Help?

If the error persists after configuring the consent screen:

1. **Double-check** the OAuth consent screen is saved
2. **Verify** your email is added as a test user
3. **Wait 10 minutes** for changes to propagate
4. **Try a different Google account** that's added as a test user
5. **Check** that you're using the correct Google Cloud project

---

**The most common fix is adding your email as a test user in OAuth consent screen!** 🎯
