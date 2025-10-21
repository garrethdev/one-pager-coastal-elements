# 🔐 Authentication Setup - Frontend

## Overview

Ang frontend ay naka-integrate na sa NestJS backend gamit ang **Email OTP Authentication**. Passwordless login system na nag-leverage ng Supabase Auth.

## 🎯 Features Implemented

### ✅ Authentication Flow
- **Email OTP Request** - User nag-input ng email, backend nag-send ng 6-digit OTP
- **OTP Verification** - User nag-verify ng code, nag-issue ng JWT tokens
- **Auto-login** - Persistent sessions gamit localStorage
- **Protected Routes** - Automatic redirect to login kung hindi authenticated
- **Logout** - Complete session cleanup

### ✅ User Management
- JWT token storage (access_token, refresh_token)
- User profile data (credits, subscription plan)
- Profile refresh functionality
- Auto-redirect after login

### ✅ API Integration
- Complete API client para sa backend endpoints
- Error handling at timeout management
- Type-safe TypeScript interfaces
- Request/response interceptors

## 📁 File Structure

```
app/
├── lib/
│   └── api-client.ts              # API client para sa backend communication
├── context/
│   └── AuthContext.tsx            # Authentication state management
├── components/
│   └── auth/
│       ├── OtpRequestForm.tsx     # Email input form
│       ├── OtpVerificationForm.tsx # OTP verification form
│       └── ProtectedRoute.tsx     # Route protection wrapper
├── login/
│   └── page.tsx                   # Login page
└── dashboard/
    └── page.tsx                   # Protected dashboard (for testing)
```

## 🚀 Setup Instructions

### 1. Environment Variables

Create `.env.local` file sa root ng project:

```bash
# Copy from env.example
cp env.example .env.local
```

Update ang `.env.local`:

```env
NEXT_PUBLIC_API_URL=http://localhost:3000/api
NEXT_PUBLIC_API_TIMEOUT=10000
NEXT_PUBLIC_ENV=development
```

**IMPORTANTE:** 
- Siguraduhing ang backend server ay running sa `http://localhost:3000`
- I-update ang `NEXT_PUBLIC_API_URL` kung iba ang backend port

### 2. Install Dependencies

```bash
yarn install
# or
npm install
```

### 3. Run Development Server

```bash
yarn dev
# or
npm run dev
```

Server available at: `http://localhost:3001`

## 🔑 Authentication Flow

### Step 1: Request OTP

```
User → Input Email → Frontend → POST /api/auth/otp/request → Backend → Supabase → Email OTP
```

### Step 2: Verify OTP

```
User → Input 6-digit Code → Frontend → POST /api/auth/otp/verify → Backend → Supabase
↓
Backend Returns:
{
  user: { id, email, access_token, refresh_token, expires_in },
  profile: { current_credits, subscription_plan, ... }
}
↓
Frontend Saves to localStorage + Context State
↓
Redirect to Dashboard
```

### Step 3: Protected Routes

```
User accesses protected page → ProtectedRoute checks auth → 
  If authenticated: Render page
  If not: Redirect to /login
```

### Step 4: Logout

```
User clicks Logout → Frontend → POST /api/auth/logout → Backend → Supabase
↓
Clear localStorage + Context State
↓
Redirect to /login
```

## 📝 Usage Examples

### Using Auth in Components

```typescript
'use client';

import { useAuth } from '../context/AuthContext';

export default function MyComponent() {
  const { user, profile, isAuthenticated, logout } = useAuth();

  if (!isAuthenticated) {
    return <p>Please login</p>;
  }

  return (
    <div>
      <p>Welcome, {user.email}!</p>
      <p>Credits: {profile.current_credits}</p>
      <button onClick={logout}>Logout</button>
    </div>
  );
}
```

### Protected Page

```typescript
import { ProtectedRoute } from '../components/auth/ProtectedRoute';

export default function MyProtectedPage() {
  return (
    <ProtectedRoute>
      <div>This content is only visible to authenticated users</div>
    </ProtectedRoute>
  );
}
```

### API Calls with Authentication

```typescript
import { apiClient } from '../lib/api-client';
import { useAuth } from '../context/AuthContext';

export default function SearchComponent() {
  const { user } = useAuth();

  const handleSearch = async (query: string) => {
    const response = await apiClient.searchProperties(
      user.access_token,
      query
    );

    if (response.success) {
      console.log(response.data);
    } else {
      console.error(response.error);
    }
  };

  return <button onClick={() => handleSearch('Miami')}>Search</button>;
}
```

## 🔐 Security Features

1. **JWT Token Storage** - Secure localStorage storage
2. **Auto Token Validation** - Context validates on mount
3. **Protected Routes** - Automatic redirect kung expired/invalid
4. **HTTPS Only (Production)** - Secure token transmission
5. **Token Expiration Handling** - Auto logout on expire
6. **XSS Protection** - No eval(), proper sanitization

## 🧪 Testing Authentication Flow

### Manual Testing

1. **Start Backend Server** (port 3000)
   ```bash
   cd CE-one-pager-server
   npm run start:dev
   ```

2. **Start Frontend Server** (port 3001)
   ```bash
   cd one-pager-coastal-elements
   yarn dev
   ```

3. **Test OTP Flow**
   - Go to `http://localhost:3001/login`
   - Enter email address
   - Check email for 6-digit code
   - Enter OTP code
   - Should redirect to `/dashboard`
   - Verify user data is displayed

4. **Test Protected Routes**
   - Try accessing `/dashboard` without login
   - Should redirect to `/login`

5. **Test Logout**
   - Login first
   - Click logout button
   - Should clear session and redirect to login

### Expected Results

✅ **Successful Login:**
- OTP sent to email
- Code verified successfully
- User data saved to localStorage
- Redirect to dashboard
- User info displayed correctly

✅ **Failed Login:**
- Invalid email: Error message shown
- Wrong OTP: "Invalid code" error
- Expired OTP: 401 error with message

✅ **Protected Routes:**
- Not logged in → Redirect to `/login`
- Logged in → Show page content

✅ **Logout:**
- Session cleared
- LocalStorage cleared
- Redirect to login

## 🔧 API Client Methods

### Authentication
- `apiClient.requestOtp(email)` - Request OTP
- `apiClient.verifyOtp(email, token)` - Verify OTP
- `apiClient.logout(token)` - Logout user

### User Profile
- `apiClient.getUserProfile(token)` - Get profile
- `apiClient.updateCredits(token, credits)` - Update credits
- `apiClient.updateSubscription(token, plan)` - Update plan

### Search
- `apiClient.searchProperties(token, query, filters, page, limit)` - Search
- `apiClient.getQuickLists(token)` - Get quick search lists

### Saved Searches
- `apiClient.getSavedSearches(token, page, limit)` - Get saved
- `apiClient.saveSearch(token, query)` - Save search
- `apiClient.deleteSavedSearch(token, searchId)` - Delete saved

## 🐛 Troubleshooting

### Issue: "Network Error" or "Request timeout"

**Solution:**
- Ensure backend server is running
- Check `NEXT_PUBLIC_API_URL` in `.env.local`
- Verify CORS is enabled in backend
- Check backend logs for errors

### Issue: OTP not received

**Solution:**
- Check Supabase Auth settings
- Verify email provider configuration
- Check spam folder
- Review backend logs

### Issue: "Invalid token" errors

**Solution:**
- Check JWT_SECRET in backend matches
- Verify token not expired
- Clear localStorage and login again
- Check backend JWT verification

### Issue: Redirect loop

**Solution:**
- Clear browser cache
- Clear localStorage
- Check AuthProvider is wrapped correctly
- Verify protected route logic

## 📚 Next Steps

1. **Add Search Functionality** - Connect search to real API
2. **Implement Saved Searches** - Save/load search queries
3. **Add Export Feature** - CSV export functionality
4. **Profile Management** - Edit user settings
5. **Credits System** - Track and display credit usage
6. **Subscription Plans** - Upgrade/downgrade UI

## 🔗 Related Documentation

- [Backend API Documentation](http://localhost:3000/docs) - Swagger UI
- [Backend README](../CE-one-pager-server/README.md) - Backend setup
- [Supabase Auth Docs](https://supabase.com/docs/guides/auth) - Supabase reference

---

**Created:** 2025-10-21  
**Last Updated:** 2025-10-21  
**Author:** Coastal Elements Team

