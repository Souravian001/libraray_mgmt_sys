# Library Management System - Deployment Guide

A complete vanilla HTML/CSS/JavaScript library management application with Supabase backend.

## Prerequisites

Before deployment, ensure you have:
- A Supabase account (free tier available at https://supabase.com)
- Node.js installed (for running a local server)
- Git (optional, for version control)

## Local Deployment Steps

### Step 1: Set Up Supabase Database

1. **Create a Supabase Project**
   - Go to https://supabase.com and sign in
   - Click "New Project"
   - Fill in project name, password, and region
   - Wait for project to initialize (2-3 minutes)

2. **Get Your Supabase Credentials**
   - Go to Settings → API
   - Copy your Project URL (Supabase URL)
   - Copy your Anon Public Key (Supabase Anon Key)
   - Copy your Service Role Key (for backend operations)

3. **Create Database Schema**
   - In Supabase, go to SQL Editor
   - Click "New Query"
   - Copy and paste the entire content of `database/schema.sql`
   - Click "Run" to execute
   - You should see success messages for all table creations

4. **Enable Authentication**
   - In Supabase, go to Authentication → Providers
   - Ensure Email is enabled (it's enabled by default)
   - Copy the JWT Secret from Authentication → Settings

### Step 2: Configure Environment Variables

1. **Create `.env.local` file** (in the root directory):
   \`\`\`
   SUPABASE_URL=https://your-project.supabase.co
   SUPABASE_ANON_KEY=your-anon-key-here
   SUPABASE_SERVICE_ROLE_KEY=your-service-role-key
   SUPABASE_JWT_SECRET=your-jwt-secret
   \`\`\`

2. **Update `js/supabase-config.js`**
   - This file is already set up to work with environment variables
   - Make sure it points to your `.env.local` credentials

### Step 3: Run Locally

#### Option A: Using Python (Recommended)

\`\`\`bash
# Open terminal in the project root directory
cd /path/to/library-management

# Run Python's built-in HTTP server
python -m http.server 8000

# Open your browser to: http://localhost:8000
\`\`\`

#### Option B: Using Node.js

\`\`\`bash
# Install http-server globally
npm install -g http-server

# Run from project root
http-server

# Open your browser to: http://localhost:8080
\`\`\`

#### Option C: Using Live Server (VS Code)

1. Install the "Live Server" extension in VS Code
2. Right-click on `index.html`
3. Select "Open with Live Server"
4. Browser will auto-open to your local development server

### Step 4: Test the Application

1. **Sign Up**
   - Create a new account with email and password
   - You'll be assigned a "user" role by default

2. **Admin Account (Optional)**
   - Sign up with an admin account
   - Go to Supabase SQL Editor
   - Run this query to make yourself admin:
     \`\`\`sql
     UPDATE users SET role = 'admin' WHERE email = 'your-admin-email@example.com';
     \`\`\`

3. **Test Features**
   - Dashboard: View statistics
   - Maintenance (Admin): Add/update books and members
   - Transactions: Issue and return books
   - Reports: View system statistics

### Step 5: Deploy to Production

#### Deploy to Vercel (Recommended)

1. **Push to GitHub**
   \`\`\`bash
   git init
   git add .
   git commit -m "Initial commit"
   git remote add origin https://github.com/your-username/library-system
   git push origin main
   \`\`\`

2. **Connect to Vercel**
   - Go to https://vercel.com
   - Click "Import Project"
   - Select your GitHub repository
   - Add environment variables (same as `.env.local`)
   - Click "Deploy"

#### Deploy to Netlify

1. **Push to GitHub** (same as above)

2. **Connect to Netlify**
   - Go to https://netlify.com
   - Click "Import an existing project"
   - Select your GitHub repository
   - Add environment variables
   - Click "Deploy"

## Environment Variables Reference

| Variable | Example | Description |
|----------|---------|-------------|
| SUPABASE_URL | `https://xxx.supabase.co` | Your Supabase project URL |
| SUPABASE_ANON_KEY | `eyJhbGc...` | Public key for client-side operations |
| SUPABASE_SERVICE_ROLE_KEY | `eyJhbGc...` | Private key for server-side operations |
| SUPABASE_JWT_SECRET | `super-secret-jwt...` | JWT encryption key |

## Troubleshooting

### Issue: "Cannot find supabase"
- **Solution**: Make sure you've updated `js/supabase-config.js` with correct credentials
- Check that SUPABASE_URL and SUPABASE_ANON_KEY are correctly set

### Issue: CORS Errors
- **Solution**: Add your domain to Supabase allowed hosts
- Go to Supabase Settings → Authentication
- Add your localhost/production URL to "Authorized domains"

### Issue: Database schema not creating
- **Solution**: Make sure you're using Supabase SQL Editor, not a different tool
- Check for any SQL syntax errors in the output
- Try running one table at a time

### Issue: Authentication not working
- **Solution**: Verify email is enabled in Supabase Auth Providers
- Check that user credentials are correctly entered
- Look for error messages in browser console (F12 → Console)

### Issue: Data not persisting
- **Solution**: Check Row Level Security (RLS) policies in Supabase
- Ensure your user has correct role (admin/user)
- Verify database tables were created successfully

## Project Structure

\`\`\`
.
         ├── index.html              # Main HTML file
         ├── css/
         │   └── styles.css         # All CSS styles
         ├── js/
         │   ├── supabase-config.js # Supabase connection
         │   ├── auth.js            # Authentication logic
         │   ├── app.js             # Main app logic
         │   ├── maintenance.js     # Admin maintenance module
         │   ├── transactions.js    # Book transactions module
         │   └── reports.js         # Reports module
         ├── database/
         │   └── schema.sql         # Database schema
         └── README.md              # This file
\`\`\`

## Features

- **Authentication**: Email/password login with role-based access
- **Book Management**: Add, update, and search books
- **Member Management**: Add and manage library members
- **Transactions**: Issue and return books with automatic date calculations
- **Fine Calculation**: Automatic fine calculation for overdue books (₹10/day)
- **Reports**: Dashboard with key library statistics
- **Admin Panel**: Exclusive features for admins

## Browser Support

- Chrome/Edge: ✅ Full support
- Firefox: ✅ Full support
- Safari: ✅ Full support
- IE11: ❌ Not supported

## API Used

This application uses the following Supabase APIs:
- Authentication API (for login/signup)
- PostgreSQL Database (for all data operations)
- Row Level Security (RLS) for data protection

## Security Notes

- All passwords are hashed by Supabase Auth
- Row Level Security ensures users only see their own data (or all data if admin)
- Never commit `.env.local` to version control
- Service role key should only be used in server-side code

## Getting Help

If you encounter issues:
1. Check the Troubleshooting section above
2. Look at browser console errors (F12 → Console)
3. Check Supabase Logs (Supabase Dashboard → Logs)
4. Visit Supabase Documentation: https://supabase.com/docs

## License

This project is open source and available under the MIT License.
