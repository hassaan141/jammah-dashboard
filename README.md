# Community Console - Jamah

A Next.js web application for managing Muslim community organizations. This platform allows masjids and Islamic organizations to apply for access, manage their profiles, and create events for their communities.

## Features

### MVP Features (Build-Ready)

#### Public Application System
- **Apply Page** (`/apply`): Organizations can submit applications with basic info, contact details, and supporting documents
- **Status Tracking**: Applications are tracked with submitted/in_review/approved/rejected status

#### Platform Admin Area (`/admin`)
- **Dashboard**: Overview of application statistics and recent activity
- **Application Review**: Review, approve, or reject organization applications
- **Organization Management**: Manage verified organizations and their status

#### Organization Admin Area (`/org`)
- **Dashboard**: Overview of organization events and quick actions
- **Profile Management**: Update organization info, logo, banner, bio, location
- **Event Management**: Create, edit, publish/unpublish, and delete events
- **Event Publishing**: Automatically triggers notifications to mobile app users

#### Authentication & Security
- **Supabase Auth**: Magic link and password authentication
- **Row Level Security**: Proper access control for all data
- **Role-based Access**: Platform admins vs organization admins

## Tech Stack

- **Frontend**: Next.js 15 with App Router, TypeScript, Tailwind CSS
- **Backend**: Supabase (PostgreSQL, Auth, Storage, Edge Functions)
- **Deployment**: Vercel (recommended) or any Node.js hosting

## Setup Instructions

### 1. Database Setup

1. Go to your Supabase project dashboard
2. Navigate to the SQL Editor
3. Copy and paste the contents of `database/setup.sql`
4. Execute the SQL to create all tables, policies, and triggers

### 2. Environment Variables

Create a `.env.local` file in the root directory:

```bash
NEXT_PUBLIC_SUPABASE_URL=your_supabase_project_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key

# For production, you'll also need:
# SUPABSE_SERVICE_ROLE_KEY=your_service_role_key
```

### 3. Install Dependencies

```bash
npm install
```

### 4. Run Development Server

```bash
npm run dev
```

Visit `http://localhost:3000` to see the application.

### 5. Configure Admin Access

By default, admin access is granted to emails containing `@jamah.admin` or the specific email `admin@jamah.com`. 

To customize this:
1. Edit `src/app/admin/layout.tsx`
2. Modify the `isAdmin` condition
3. Update the RLS policies in `database/setup.sql` accordingly

## Project Structure

```
src/
├── app/                    # Next.js App Router pages
│   ├── admin/             # Platform admin area
│   ├── org/               # Organization admin area
│   ├── apply/             # Public application form
│   ├── signin/            # Authentication
│   └── page.tsx           # Landing page
├── components/            # Reusable React components
├── lib/                   # Utility functions and configurations
│   └── supabase/         # Supabase client setup
└── database/             # Database schema and setup
```

## Key Workflows

### A) Public Applicant Workflow
1. Visit `/apply` → submit application form
2. Receives "Submitted" confirmation
3. When approved → receives email with magic link
4. Signs in → lands on `/org` to set up profile and create events

### B) Organization Admin Workflow
1. **Profile Setup**: Upload logo/banner, fill bio, location, contact info
2. **Event Management**:
   - Create event (title, description, datetime, venue, optional image)
   - Save as Draft → preview → Publish
   - On publish: automatically sends notifications to mobile app subscribers
   - Can unpublish or update events

### C) Platform Admin Workflow
1. **Application Review**: Filter by status, open applications, review details
2. **Approval Process**: Approve (creates organization + admin) or reject with reason
3. **Organization Management**: Toggle verified status, monitor activity

## Database Schema

### Core Tables

- **organization_applications**: Stores application submissions
- **organizations**: Verified organizations with profile info
- **organization_admins**: Links users to organizations they can manage
- **events**: Organization events with publish status
- **event_notifications**: Tracks when notifications are sent

### Security Features

- **Row Level Security**: All tables protected with appropriate policies
- **Public Access**: Only verified organizations and published events visible
- **Admin Access**: Platform admins can manage all data
- **Organization Scope**: Org admins can only manage their own data

## Integration with Mobile App

The Community Console is designed to work with your existing Jamah mobile app:

1. **Events API**: Mobile app reads published events from verified organizations
2. **Notifications**: When events are published, notifications are sent to subscribers
3. **Organization Data**: Mobile app displays organization profiles and info
4. **Shared Database**: Both systems use the same Supabase backend

## Deployment

### Vercel (Recommended)

1. Connect your GitHub repository to Vercel
2. Add environment variables in Vercel dashboard
3. Deploy automatically on push to main branch

### Manual Deployment

1. Build the application: `npm run build`
2. Deploy to any Node.js hosting provider
3. Ensure environment variables are set in production

## Customization

### Adding Organization Types
1. Update the enum constraint in `database/setup.sql`
2. Add new options to the application form in `src/app/apply/page.tsx`

### Custom Admin Logic
1. Modify admin detection in `src/app/admin/layout.tsx`
2. Update RLS policies in the database accordingly

### Branding
1. Update colors and styles in `tailwind.config.js`
2. Replace logos and branding text throughout the application
3. Customize email templates (if using custom email service)

## Support

For questions or issues:
1. Check the GitHub issues
2. Review Supabase documentation for database/auth questions
3. Consult Next.js documentation for frontend issues

---

**Note**: This is the MVP version focusing on core functionality. Additional features like multi-admin invites, advanced search, recurring events, and detailed analytics can be added in future iterations.
# jammah-dashboard
