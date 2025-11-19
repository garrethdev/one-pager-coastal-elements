# Coastal Elements One Pager - Frontend

Frontend application for Coastal Elements using **Next.js**, **TypeScript**, and **Tailwind CSS**.

## 🚀 Quick Start

### Prerequisites
- Node.js v18+
- Backend server running (CE-one-pager-server)
- Supabase account configured

### Setup

1. **Install dependencies:**
   ```bash
   yarn install
   # or
   npm install
   ```

2. **Create `.env.local` file:**
   ```bash
   cp env.example .env.local
   ```

3. **Configure environment variables:**
   ```env
   NEXT_PUBLIC_API_URL=http://localhost:3000/api
   NEXT_PUBLIC_API_TIMEOUT=10000
   NEXT_PUBLIC_ENV=development
   # Optional (for waitlist only):
   HUBSPOT_PRIVATE_APP_TOKEN=your_hubspot_token_here
   ```

4. **Run development server:**
   ```bash
   yarn dev
   # or
   npm run dev
   ```

✅ **Frontend available at:** `http://localhost:3001`

## 🔐 Authentication

### Email OTP Flow

1. **Request OTP:**
   - User enters email on `/login` page
   - Frontend requests OTP from backend
   - Backend sends 6-digit OTP to email

2. **Verify OTP:**
   - User enters OTP code
   - Frontend verifies with backend
   - Backend returns JWT tokens
   - Frontend saves to localStorage and context

3. **Protected Routes:**
   - `ProtectedRoute` component checks authentication
   - Redirects to `/login` if not authenticated

4. **Logout:**
   - Clears localStorage and context
   - Redirects to `/login`

### Using Auth in Components

```typescript
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

## 📁 Project Structure

```
app/
├── lib/
│   └── api-client.ts              # API client for backend
├── context/
│   └── AuthContext.tsx            # Authentication state
├── components/
│   ├── auth/                      # Auth components
│   ├── search/                    # Search components
│   └── ...
├── login/
│   └── page.tsx                   # Login page
├── dashboard/
│   └── page.tsx                   # Dashboard (protected)
└── waitlist/
    └── page.tsx                   # Waitlist page
```

## 🔧 Environment Variables

### Required for Authentication

```env
NEXT_PUBLIC_API_URL=http://localhost:3000/api
NEXT_PUBLIC_API_TIMEOUT=10000
NEXT_PUBLIC_ENV=development
```

### Optional (Waitlist Only)

```env
HUBSPOT_PRIVATE_APP_TOKEN=your_hubspot_token_here
```

**Note:** HubSpot token is only needed for waitlist feature. Authentication works without it.

## 🧪 Testing

### Manual Testing Flow

1. **Start Backend:**
   ```bash
   cd CE-one-pager-server
   npm run start:dev
   ```

2. **Start Frontend:**
   ```bash
   yarn dev
   ```

3. **Test Login:**
   - Go to `http://localhost:3001/login`
   - Enter email
   - Check email for OTP
   - Enter OTP
   - Should redirect to dashboard

4. **Test Protected Routes:**
   - Clear localStorage
   - Try accessing `/dashboard`
   - Should redirect to `/login`

## 🐛 Troubleshooting

### Network Error / CORS
- Ensure backend is running
- Check `NEXT_PUBLIC_API_URL` in `.env.local`
- Verify CORS enabled in backend

### OTP Not Received
- Check Supabase Auth settings
- Verify email provider configuration
- Check spam folder

### Invalid Token
- Check JWT_SECRET matches backend
- Clear localStorage and login again
- Verify token not expired

## 🚀 Deployment

The easiest way to deploy is using [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme).

## 🔗 Related

- **Backend:** [CE-one-pager-server](../CE-one-pager-server/README.md)
- **API Documentation:** See Swagger UI at `http://localhost:3000/docs` (when backend running)
