# Setup Instructions

## Supabase Configuration

This application uses Supabase for database and storage. Follow these steps to set up:

### 1. Create a Supabase Project

1. Go to [supabase.com](https://supabase.com) and create a new project
2. Wait for the project to be fully initialized

### 2. Get Your Credentials

1. In your Supabase dashboard, go to **Settings** > **API**
2. Copy the following:
   - Project URL (under "Project API")
   - Anon/Public key (under "Project API keys")

### 3. Configure Environment Variables

1. Create a `.env` file in the root directory (copy from `.env.example`)
2. Add your Supabase credentials:
   ```
   VITE_SUPABASE_URL=your_project_url_here
   VITE_SUPABASE_ANON_KEY=your_anon_key_here
   ```

### 4. Database Setup

The database tables and RLS policies have been created with migrations. The system includes:

- **users** - User profiles with email-based tracking
- **tasks** - Tasks linked to user emails
- **attendance** - Attendance records linked to user emails
- **events** - Event management
- **announcements** - Announcements
- **feedback** - User feedback
- **resources** - Department resources
- **academic_materials** - Academic resources

### 5. Storage Setup

A storage bucket named `profile-photos` has been created for profile pictures. It's publicly accessible for viewing but only users can upload their own photos.

## Features

### Profile Management

- Users can update their name and profile photo
- Email is immutable and used for tracking
- Name changes are reflected across all tasks and attendance records
- Profile photos are stored in Supabase Storage

### Tracking System

- All tasks and attendance are linked to user emails
- Username changes don't affect historical data
- Easy to trace user activity even after name changes

## Important Notes

1. **Email is the primary identifier** - Never change user emails
2. **Name updates are safe** - Name changes update everywhere
3. **Photo uploads** - Maximum 5MB per image
4. **RLS Security** - All tables have Row Level Security enabled
