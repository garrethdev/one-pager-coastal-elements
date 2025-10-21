# 🔐 Supabase OTP Setup Guide

## Issue: Magic Link Instead of 6-Digit Code

**Problem:** Email receives magic link only, walang 6-digit OTP code na pwedeng i-type.

**Root Cause:** Supabase default configuration prioritizes magic link over token display.

---

## ✅ Complete Solution (2 Steps)

### Step 1: Configure Supabase Dashboard ⚙️

**Go to Supabase Dashboard:**
1. Login: https://app.supabase.com
2. Select: Your Coastal Elements project
3. Navigate: **Authentication** → **Email Templates**

---

### Step 2: Update Email Template 📧

**Click "Magic Link" template and update:**

#### Current Template (Default):
```html
<h2>Confirm your signup</h2>
<p>Follow this link to confirm your user:</p>
<p><a href="{{ .ConfirmationURL }}">Confirm your mail</a></p>
```

#### New Template (With OTP Code):
```html
<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8">
  <title>Your Login Code</title>
  <style>
    body {
      font-family: Arial, sans-serif;
      line-height: 1.6;
      color: #333;
      max-width: 600px;
      margin: 0 auto;
      padding: 20px;
    }
    .code-box {
      background-color: #f4f4f4;
      border: 2px dashed #007bff;
      border-radius: 8px;
      padding: 20px;
      text-align: center;
      margin: 20px 0;
    }
    .code {
      font-size: 36px;
      font-weight: bold;
      letter-spacing: 8px;
      color: #007bff;
      font-family: 'Courier New', monospace;
    }
    .expiry {
      color: #666;
      font-size: 14px;
      margin-top: 10px;
    }
    .alternative {
      margin-top: 30px;
      padding-top: 20px;
      border-top: 1px solid #ddd;
    }
    .btn {
      display: inline-block;
      padding: 12px 24px;
      background-color: #007bff;
      color: white;
      text-decoration: none;
      border-radius: 5px;
      margin-top: 10px;
    }
  </style>
</head>
<body>
  <h2>🔐 Your Realtor AI Login Code</h2>
  
  <p>Hello!</p>
  <p>You requested to sign in to <strong>Realtor AI</strong>. Enter this verification code in the app:</p>
  
  <div class="code-box">
    <div class="code">{{ .Token }}</div>
    <p class="expiry">⏰ This code expires in 10 minutes</p>
  </div>
  
  <p><strong>How to use:</strong></p>
  <ol>
    <li>Go back to the login page</li>
    <li>Enter this 6-digit code</li>
    <li>Click "Verify & Continue"</li>
  </ol>
  
  <div class="alternative">
    <p style="color: #666; font-size: 14px;">
      <strong>Alternative:</strong> If the code doesn't work, you can click this button to sign in automatically:
    </p>
    <a href="{{ .ConfirmationURL }}" class="btn">Sign in with One Click</a>
  </div>
  
  <p style="margin-top: 30px; color: #999; font-size: 12px;">
    If you didn't request this code, you can safely ignore this email.
  </p>
</body>
</html>
```

**Key Changes:**
- ✅ Added `{{ .Token }}` - Displays 6-digit code
- ✅ Styled code prominently
- ✅ Added expiry notice
- ✅ Kept magic link as backup
- ✅ Added instructions

---

### Step 3: Verify Email Settings

**Still in Supabase Dashboard:**

1. Go to: **Authentication** → **Providers** → **Email**

2. **Verify settings:**
   ```
   ✅ Enable Email Provider: ON
   ✅ Confirm email: OFF (for testing) or ON (for production)
   ✅ Secure email change: ON
   ⚙️ Mailer: Default (or configured SMTP)
   ```

3. **Email OTP Settings (if available):**
   ```
   ⏰ OTP Expiry: 600 seconds (10 minutes)
   🔢 OTP Length: 6 digits
   ```

---

### Step 4: Test Configuration

**After saving the template:**

1. **Request OTP:**
   - Go to: http://localhost:3001/login
   - Enter email
   - Click "Send Login Code"

2. **Check Email:**
   - Open inbox
   - Look for "Your Realtor AI Login Code"
   - Should see **6-digit code** prominently displayed
   - Should also see magic link button (as backup)

3. **Test OTP Entry:**
   - Copy the 6-digit code
   - Enter in verification form
   - Should work! ✅

---

## 🎯 Backend Changes (Already Done)

Updated backend to explicitly request token-based OTP:

```typescript
// CE-one-pager-server/src/modules/auth/auth.service.ts
await this.supabase.auth.signInWithOtp({
  email: email,
  options: {
    shouldCreateUser: true,
    emailRedirectTo: undefined, // Force token mode
  },
});
```

**This tells Supabase:** "Don't rely on redirect URL, send token for manual entry"

---

## 📧 Email Template Variables

Available variables sa Supabase email templates:

| Variable | Description | Example |
|----------|-------------|---------|
| `{{ .Token }}` | 6-digit OTP code | `123456` |
| `{{ .TokenHash }}` | Hashed token | `abc123...` |
| `{{ .ConfirmationURL }}` | Magic link URL | `https://...` |
| `{{ .Email }}` | User's email | `user@example.com` |
| `{{ .SiteURL }}` | Your site URL | `http://localhost:3001` |
| `{{ .RedirectTo }}` | Redirect URL | Custom redirect |

---

## 🔄 After Making Changes

### Restart Backend (if needed):
```bash
# Backend should auto-reload, but kung hindi:
# Ctrl+C to stop
cd CE-one-pager-server
npm run start:dev
```

### Frontend stays the same:
- ✅ No restart needed
- ✅ Already configured to accept 6-digit input

---

## ✅ Expected Result

### Email (Before):
```
Subject: Confirm your email

Click this link to confirm:
https://xxxxx.supabase.co/auth/v1/verify?token=xxxxx
```
❌ No code to type

### Email (After):
```
Subject: Your Realtor AI Login Code

🔐 Your verification code is:

  1 2 3 4 5 6

⏰ Expires in 10 minutes

Instructions:
1. Go back to login page
2. Enter this code
3. Click verify

Alternatively, click here to sign in:
[Sign in with One Click]
```
✅ Code prominently displayed!
✅ Magic link still available as backup!

---

## 🧪 Testing Checklist

After configuration:

- [ ] Request OTP from login page
- [ ] Receive email within 1-2 minutes
- [ ] Email shows 6-digit code clearly
- [ ] Code is readable and copy-able
- [ ] Code works when entered in form
- [ ] Magic link button also works (backup)
- [ ] Expiry time is mentioned
- [ ] Email looks professional

---

## 🐛 Troubleshooting

### Issue: Still receiving magic link only

**Solutions:**
1. Clear browser cache
2. Request new OTP (old emails cached)
3. Check Supabase template was saved
4. Verify using correct email template (Magic Link template)
5. Wait 2-3 minutes for changes to propagate

### Issue: Email not received

**Solutions:**
1. Check spam folder
2. Verify email provider in Supabase works
3. Check Supabase logs for send errors
4. Try different email address

### Issue: Code doesn't work

**Solutions:**
1. Check code not expired (10 minutes)
2. Verify typing correctly (no spaces)
3. Try copy-paste instead
4. Request new code
5. Use magic link button as backup

---

## 🎯 Summary

**What Changed:**
1. ✅ Backend: Added `emailRedirectTo: undefined` to force token mode
2. ✅ Supabase: Updated email template to show `{{ .Token }}`

**What Stays Same:**
- ✅ Frontend: Already configured correctly
- ✅ OTP verification flow: Already working
- ✅ Database: No changes needed

**Result:**
- ✅ Users receive **6-digit code** in email
- ✅ Users can **type the code** in form
- ✅ Magic link still works as **backup**
- ✅ Professional, user-friendly email

---

## 📞 Support

Kung may issues pa:
1. Check Supabase project logs
2. Check backend console for errors
3. Verify email template saved correctly
4. Test with different email providers

---

**Last Updated:** 2025-10-21  
**Status:** Ready for Testing

