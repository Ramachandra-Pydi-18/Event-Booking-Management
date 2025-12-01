# Admin User Setup Guide

## Method 1: Register as Admin through Frontend (Easiest)

1. **Go to the Registration page**
2. **Fill in your details:**
   - Name
   - Email
   - Password
   - Phone (optional)
3. **Select "Admin" from the "Account Type" dropdown**
4. **Enter the Admin Registration Key:**
   - Default key: `ADMIN123`
   - You can change this in backend `.env` file by adding:
     ```
     ADMIN_REGISTRATION_KEY=your_custom_key_here
     ```
5. **Click "Sign Up"**
6. **You're now registered as an admin!**

## Method 2: Create Admin via Script

Run this command in the backend directory:

```bash
cd backend
npm run create:admin <email> <password> [name]
```

**Example:**
```bash
npm run create:admin admin@example.com password123 "Admin User"
```

This will:
- Create a new admin user if the email doesn't exist
- Or update an existing user to admin if they already exist

## Method 3: Update Existing User to Admin (MongoDB)

If you already have a user account and want to make it admin:

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
3. Navigate to `users` collection
4. Find your user document
5. Edit the `role` field: change `"user"` to `"admin"`
6. Save

### Using MongoDB Atlas:
1. Go to MongoDB Atlas dashboard
2. Click "Browse Collections"
3. Select your database → `users` collection
4. Find your user document
5. Click "Edit Document"
6. Change `role` from `"user"` to `"admin"`
7. Click "Update"

## Changing the Admin Registration Key

For security, you can change the admin registration key:

1. **Add to backend `.env` file:**
   ```env
   ADMIN_REGISTRATION_KEY=your_secure_key_here
   ```

2. **Restart the backend server**

3. **Use the new key when registering as admin**

If `ADMIN_REGISTRATION_KEY` is not set in `.env`, the default key `ADMIN123` will be used.

## After Creating Admin

Once you're an admin:
1. **Login** with your admin credentials
2. You'll see an **"Admin"** link in the navigation
3. Click it to access the **Admin Dashboard**
4. You can now:
   - Create events
   - View all bookings
   - Manage events
   - Delete events

## Troubleshooting

**Q: I don't see "Admin" in navigation after registering as admin**
- Make sure you logged out and logged back in
- Check your browser console for errors
- Verify your user role is "admin" in the database

**Q: "Invalid admin registration key" error**
- Default key is `ADMIN123` (all caps)
- Check if you set a custom key in `.env`
- Make sure backend server is restarted after changing `.env`

**Q: Can't access admin dashboard**
- Verify your user role is "admin" in MongoDB
- Check backend terminal for authorization errors
- Make sure you're logged in

## Security Note

⚠️ **Important:** The default admin key `ADMIN123` is for development only. For production:
1. Set a strong, unique `ADMIN_REGISTRATION_KEY` in your `.env` file
2. Keep it secret
3. Only share it with trusted administrators

