# Setup Guide

## Quick Start

### 1. Backend Setup

```bash
cd backend
npm install
```

Create `.env` file:

```env
PORT=5000
MONGO_URI=mongodb://localhost:27017/event-booking
JWT_SECRET=your_super_secret_jwt_key_change_this
JWT_EXPIRE=30d
EMAIL_USER=your_email@gmail.com
EMAIL_PASS=your_app_password
STRIPE_SECRET_KEY=sk_test_your_stripe_secret_key
STRIPE_WEBHOOK_SECRET=whsec_your_webhook_secret
```

Start backend:

```bash
npm run dev
```

### 2. Frontend Setup

```bash
cd frontend
npm install
```

Create `.env` file:

```env
VITE_API_URL=http://localhost:5000/api
VITE_STRIPE_PUBLISHABLE_KEY=pk_test_your_stripe_publishable_key
```

Start frontend:

```bash
npm run dev
```

### 3. Create Admin User

After registering a user through the frontend, update the role in MongoDB:

```javascript
// Connect to MongoDB
use event-booking

// Update user role to admin
db.users.updateOne(
  { email: "your_email@example.com" },
  { $set: { role: "admin" } }
)
```

Or use MongoDB Compass/Atlas to update the user document.

## Testing Stripe Payments

For testing, use Stripe test cards:

- Success: `4242 4242 4242 4242`
- Decline: `4000 0000 0000 0002`
- Use any future expiry date and any CVC

## Email Configuration

For Gmail:

1. Enable 2-Factor Authentication
2. Generate App Password: https://myaccount.google.com/apppasswords
3. Use the app password in `EMAIL_PASS`

## MongoDB Setup Options

### Local MongoDB

1. Install MongoDB Community Edition
2. Start MongoDB service
3. Use: `mongodb://localhost:27017/event-booking`

### MongoDB Atlas (Cloud)

1. Create account at https://www.mongodb.com/cloud/atlas
2. Create a cluster
3. Get connection string
4. Update `MONGO_URI` in `.env`

## Troubleshooting

### Backend won't start

- Check if MongoDB is running
- Verify `.env` file exists and has correct values
- Check if port 5000 is available

### Frontend won't connect to backend

- Verify backend is running on port 5000
- Check `VITE_API_URL` in frontend `.env`
- Check CORS settings in backend

### Payment not working

- Verify Stripe keys are correct
- Check if using test keys for test mode
- Check browser console for errors

### Email not sending

- Verify Gmail app password is correct
- Check if 2FA is enabled
- Check email service logs in backend console
