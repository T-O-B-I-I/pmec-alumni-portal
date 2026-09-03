# PMEC Alumni Portal

A full-stack web application designed for the Parala Maharaja Engineering College (PMEC) to connect alumni, students, and faculty mentors. 

## Features

- **Role-Based Access Control:** Secure portal with four distinct user roles:
  - **Alumni:** Can build and manage detailed professional profiles, search for peers, and connect with mentors.
  - **Mentor (Faculty):** Faculty members can maintain their profiles and mentor students/alumni.
  - **Coordinator (Admin):** Can manage the alumni directory, track user statistics, post notices, approve password resets, and export data.
  - **Super Admin:** Ultimate oversight to manage coordinators and system-wide configurations.
- **Dynamic Notice Board:** A central board for announcements and upcoming events managed by Coordinators.
- **Alumni Directory:** Advanced search filtering and Excel data exporting for administrators.
- **Secure Password Management:** Complete auth flows including JWT sessions, secure "Change Password", and a Coordinator-approved "Forgot Password" reset request system.
- **Faculty Mentorship Program:** Pre-seeded faculty profiles (scraped from official college resources) to seamlessly onboard mentors.
- **Serverless Ready:** Configured to deploy seamlessly on serverless platforms like Vercel, utilizing memory storage for image uploads (Base64 conversion) to bypass read-only filesystem limitations.

## Tech Stack

### Frontend
- **Framework:** React 19 (via Vite)
- **Styling:** Tailwind CSS v4 
- **Routing:** React Router v7
- **Icons & Animations:** Lucide React, Framer Motion

### Backend
- **Server:** Node.js & Express.js
- **Database:** MongoDB & Mongoose
- **Language:** TypeScript
- **Authentication:** JSON Web Tokens (JWT) & bcryptjs for password hashing
- **File Uploads:** Multer (Configured for memory storage & Base64 encoding)
- **Web Scraping:** Cheerio (for automated faculty seeding scripts)

## Getting Started

### Prerequisites
- Node.js (v18 or higher)
- MongoDB (Local instance or MongoDB Atlas cluster)

### Environment Variables
Create a `.env` file in the `backend/` directory with the following variables:
```env
MONGODB_URI=your_mongodb_connection_string
PORT=5000
JWT_SECRET=your_secret_key
SUPERADMIN_EMAIL=xyz@gmail.com
SUPERADMIN_PASSWORD=psswd
```

### Installation

1. **Clone the repository:**
   ```bash
   git clone https://github.com/T-O-B-I-I/pmec-alumni-portal.git
   cd pmec-alumni-portal
   ```

2. **Setup the Backend:**
   ```bash
   cd backend
   npm install
   npm run dev
   ```
   *The backend will run on `http://localhost:5000`*

3. **Setup the Frontend:**
   ```bash
   cd ../frontend
   npm install
   npm run dev
   ```
   *The frontend will run on the default Vite port (usually `http://localhost:5173`)*

## Available Scripts (Backend)

- `npx tsx src/scripts/seedMentors.ts`: Scrapes the college website to seed initial faculty mentor profiles.
- `npx tsx src/scripts/updateMentorPhotos.ts`: Updates existing faculty profiles with the latest photos.
- `npx tsx seedAdmin.ts`: Seeds the initial Super Admin account based on the `.env` configuration.

## Deployment

This repository is configured with a `vercel.json` file for immediate deployment on Vercel.

1. Import the project into Vercel.
2. Override the Build Command in Vercel settings if needed (or rely on the automated Vercel pipeline).
3. Ensure all environment variables from your local `.env` are mirrored in the Vercel Project Settings.
4. The API routes will be proxy-mapped automatically based on the `vercel.json` rewrites.
