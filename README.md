# Event Booking System

A full-stack MERN (MongoDB, Express.js, React, Node.js) application for booking event tickets with secure payment processing, calendar management, and notification system.

## Features

### User Features

- 🔐 **Authentication** - Secure user registration and login
- 🎫 **Browse Events** - View available events with filtering and search
- 📅 **Event Details** - Detailed event information with calendar integration
- 💳 **Secure Payments** - Stripe integration for ticket booking
- 📧 **Notifications** - Email confirmations and event reminders
- 📊 **Dashboard** - View booking history and manage reservations

### Admin Features

- 🎛️ **Event Management** - Create, update, and delete events
- 📈 **Booking Analytics** - View all bookings and manage availability
- 💰 **Pricing Control** - Set and update ticket prices
- 📊 **Dashboard** - Comprehensive admin dashboard

## Tech Stack

### Backend

- **Node.js** - Runtime environment
- **Express.js** - Web framework
- **MongoDB** - Database
- **Mongoose** - ODM
- **JWT** - Authentication
- **Stripe** - Payment processing
- **Nodemailer** - Email notifications
- **bcryptjs** - Password hashing

### Frontend

- **React** - UI library
- **React Router** - Routing
- **Axios** - HTTP client
- **Stripe.js** - Payment integration
- **Vite** - Build tool

## Installation

### Prerequisites

- Node.js (v14 or higher)
- MongoDB (local or MongoDB Atlas)
- Stripe account (for payment processing)
- Gmail account (for email notifications)

### Backend Setup

1. Navigate to the backend directory:

```bash
cd backend
```

2. Install dependencies:

```bash
npm install
```

3. Create a `.env` file in the backend directory:

```env
PORT=5000
MONGO_URI=mongodb://localhost:27017/event-booking
JWT_SECRET=your_super_secret_jwt_key
JWT_EXPIRE=30d
EMAIL_USER=your_email@gmail.com
EMAIL_PASS=your_app_password
STRIPE_SECRET_KEY=sk_test_your_stripe_secret_key
STRIPE_WEBHOOK_SECRET=whsec_your_webhook_secret
```

4. Start the backend server:

```bash
npm run dev
```

The backend server will run on `http://localhost:5000`

### Frontend Setup

1. Navigate to the frontend directory:

```bash
cd frontend
```

2. Install dependencies:

```bash
npm install
```

3. Create a `.env` file in the frontend directory:

```env
VITE_API_URL=http://localhost:5000/api
VITE_STRIPE_PUBLISHABLE_KEY=pk_test_your_stripe_publishable_key
```

4. Start the development server:

```bash
npm run dev
```

The frontend will run on `http://localhost:3000`

## Configuration

### MongoDB Setup

1. Install MongoDB locally or use MongoDB Atlas
2. Update `MONGO_URI` in `.env` file
3. The database will be created automatically on first connection

### Stripe Setup

1. Create a Stripe account at https://stripe.com
2. Get your API keys from the Stripe Dashboard
3. Add the keys to both backend and frontend `.env` files
4. For webhooks, use Stripe CLI or configure in dashboard

### Email Setup (Gmail)

1. Enable 2-factor authentication on your Gmail account
2. Generate an App Password: https://myaccount.google.com/apppasswords
3. Use the app password in `EMAIL_PASS` in backend `.env`

## API Endpoints

### Authentication

- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - Login user
- `GET /api/auth/me` - Get current user (Protected)

### Events

- `GET /api/events` - Get all events
- `GET /api/events/:id` - Get single event
- `POST /api/events` - Create event (Admin only)
- `PUT /api/events/:id` - Update event (Admin only)
- `DELETE /api/events/:id` - Delete event (Admin only)

### Bookings

- `GET /api/bookings` - Get user bookings (Protected)
- `GET /api/bookings/all` - Get all bookings (Admin only)
- `POST /api/bookings` - Create booking (Protected)
- `GET /api/bookings/:id` - Get single booking (Protected)
- `PUT /api/bookings/:id/payment` - Update payment status (Protected)
- `POST /api/bookings/:id/reminder` - Send reminder (Protected)

### Payments

- `POST /api/payments/create-intent` - Create payment intent (Protected)
- `POST /api/payments/confirm` - Confirm payment (Protected)
- `POST /api/payments/webhook` - Stripe webhook handler

## Project Structure

```
event-booking-system/
├── backend/
│   ├── config/
│   │   └── db.js
│   ├── controllers/
│   │   ├── authController.js
│   │   ├── eventController.js
│   │   ├── bookingController.js
│   │   └── paymentController.js
│   ├── middleware/
│   │   ├── auth.js
│   │   └── errorHandler.js
│   ├── models/
│   │   ├── User.js
│   │   ├── Event.js
│   │   └── Booking.js
│   ├── routes/
│   │   ├── authRoutes.js
│   │   ├── eventRoutes.js
│   │   ├── bookingRoutes.js
│   │   └── paymentRoutes.js
│   ├── server.js
│   └── package.json
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   │   ├── auth/
│   │   │   └── layout/
│   │   ├── context/
│   │   │   └── AuthContext.jsx
│   │   ├── pages/
│   │   │   ├── Home.jsx
│   │   │   ├── Events.jsx
│   │   │   ├── EventDetails.jsx
│   │   │   ├── Login.jsx
│   │   │   ├── Register.jsx
│   │   │   ├── Dashboard.jsx
│   │   │   ├── AdminDashboard.jsx
│   │   │   └── Booking.jsx
│   │   ├── App.jsx
│   │   └── main.jsx
│   └── package.json
└── README.md
```

## Usage

### Creating an Admin User

1. Register a new user through the frontend
2. In MongoDB, update the user's role to "admin":

```javascript
db.users.updateOne({ email: "admin@example.com" }, { $set: { role: "admin" } });
```

### Booking Flow

1. User browses events
2. Selects an event and number of tickets
3. Creates a booking
4. Completes payment via Stripe
5. Receives email confirmation
6. Gets reminder before event date

## Security Features

- Password hashing with bcrypt
- JWT token authentication
- Protected routes
- Role-based access control
- Secure payment processing with Stripe

## Responsive Design

The application is fully responsive and works on:

- Desktop
- Tablet
- Mobile devices

## Future Enhancements

- [ ] Calendar view for events
- [ ] QR code tickets
- [ ] Social media integration
- [ ] Event reviews and ratings
- [ ] Multi-language support
- [ ] Push notifications
- [ ] Advanced analytics dashboard

## License

This project is open source and available under the MIT License.

## Support

For issues and questions, please open an issue on the repository.
