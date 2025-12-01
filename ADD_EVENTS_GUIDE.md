# How to Add Events to the System

There are two ways to add events to your Event Booking System:

## Method 1: Using the Admin Dashboard (Recommended)

1. **Make sure you have an admin account:**
   - Register a user account through the frontend
   - Update the user role to "admin" in MongoDB:
     ```javascript
     // Connect to MongoDB (using MongoDB Compass, MongoDB Shell, or MongoDB Atlas)
     db.users.updateOne(
       { email: "your_email@example.com" },
       { $set: { role: "admin" } }
     )
     ```

2. **Login as admin:**
   - Go to the frontend and login with your admin account
   - You should see an "Admin" link in the navigation

3. **Create events:**
   - Click on "Admin" in the navigation
   - Click the "+ Add New Event" button
   - Fill in the event details:
     - Title
     - Description
     - Category (concert, conference, workshop, sports, theater, other)
     - Date
     - Time
     - Venue Name
     - Venue Address
     - City
     - Total Tickets
     - Price per Ticket
     - Organizer Name
     - Image URL (optional)
   - Click "Create Event"

## Method 2: Using the Seed Script (Quick Start)

This will add 6 sample events to your database:

1. **Make sure you have an admin user:**
   - Register a user through the frontend
   - Update the user role to "admin" in MongoDB (see Method 1, step 1)

2. **Run the seed script:**
   ```bash
   cd backend
   npm run seed:events
   ```

   This will create 6 sample events:
   - Summer Music Festival 2024 (Concert)
   - Tech Innovation Conference 2024 (Conference)
   - Web Development Workshop (Workshop)
   - Basketball Championship Finals (Sports)
   - Broadway Musical: The Phantom (Theater)
   - Food & Wine Festival (Other)

## Making a User Admin

### Using MongoDB Shell:
```javascript
use event-booking
db.users.updateOne(
  { email: "your_email@example.com" },
  { $set: { role: "admin" } }
)
```

### Using MongoDB Compass:
1. Open MongoDB Compass
2. Connect to your database
3. Navigate to the `users` collection
4. Find your user document
5. Edit the `role` field and change it from `"user"` to `"admin"`
6. Save the document

### Using MongoDB Atlas:
1. Go to your MongoDB Atlas dashboard
2. Click on "Browse Collections"
3. Select your database and `users` collection
4. Find your user document
5. Click "Edit Document"
6. Change `role` from `"user"` to `"admin"`
7. Click "Update"

## Troubleshooting

**Q: I don't see the "Admin" link in navigation**
- Make sure you're logged in
- Verify your user role is set to "admin" in the database
- Try logging out and logging back in

**Q: I get "Not authorized" when trying to create events**
- Your user role must be "admin" in the database
- Check the backend terminal for error messages

**Q: Events are not showing up**
- Make sure events have `status: "active"` in the database
- Check if the date is in the future
- Refresh the events page

## Event Fields Explained

- **Title**: Name of the event
- **Description**: Detailed information about the event
- **Category**: Type of event (concert, conference, workshop, sports, theater, other)
- **Date**: Event date (must be in the future)
- **Time**: Event time (format: HH:MM, e.g., "18:00")
- **Venue Name**: Name of the venue
- **Venue Address**: Street address of the venue
- **City**: City where the event is held
- **Total Tickets**: Maximum number of tickets available
- **Price**: Price per ticket (in USD)
- **Organizer**: Name of the event organizer
- **Image URL**: Optional image URL for the event (use Unsplash or similar)

