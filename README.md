# RecipeBook

RecipeBook is a modern, responsive web application for exploring, managing, and sharing dessert and bakery recipes. The project is designed with an interactive dual-language user interface, robust security, and administrator features.

## Tech Stack

*   **Framework:** Next.js (App Router)
*   **Database:** MongoDB via Mongoose
*   **Authentication:** NextAuth.js (Credentials Provider with hashed passwords)
*   **Styling:** Tailwind CSS v4, Lucide React icons, and Spline 3D animations
*   **Email Services:** Nodemailer (supporting SMTP App Passwords and Google OAuth2 protocols)
*   **Internationalization:** Local context-based translation provider (supporting Spanish and English)

## Key Features

1.  **Recipe Explorer:** A clean catalog page showing recipe cards with details on preparation time, difficulty level, and category.
2.  **Interactive Details:** A detailed view for each recipe showing ingredients list, step-by-step instructions, and servings selector.
3.  **Favorites System:** Authenticated users can toggle recipes as favorites. Favorites are persistent in the database and manageable from a dedicated user view.
4.  **Internationalization:** Complete interface translation between Spanish and English, storing selections in local storage and cookies.
5.  **Admin Panel:** Administrators can view aggregated application statistics, expand user favorite lists, and send system notification emails (welcome or custom broadcast messages).
6.  **3D Visuals:** Spline 3D integration in authentication routes for a high-quality aesthetic layout.

## Project Structure

*   `src/app/`: Next.js pages, layouts, and API routes.
*   `src/components/`: Reusable UI components and vector illustrations.
*   `src/context/`: Context providers, including multi-language support.
*   `src/lib/`: Database configuration (Mongoose connection cache) and authentication handler.
*   `src/locales/`: JSON translation files.
*   `src/models/`: Database schema definitions (User, Recipe, Favorite).
*   `src/services/`: Server-side services for database access and email processing.
*   `src/types/`: Shared and environment type definitions.

## Getting Started

### Prerequisites

*   Node.js (v18 or higher recommended)
*   MongoDB instance (local or Atlas)
*   SMTP credentials (e.g., Gmail App Password or OAuth2 client)

### Environment Variables

Create a `.env.local` file in the root directory and define the following variables:

```env
# MongoDB Connection URI
MONGODB_URI=mongodb://localhost:27017/recipebook

# NextAuth Configuration
NEXTAUTH_SECRET=your_nextauth_secret_key
NEXTAUTH_URL=http://localhost:3000

# Administrator Setup
ADMIN_EMAIL=admin@example.com

# SMTP / Email Configuration
EMAIL_USER=your_email@gmail.com

# For SMTP App Password Authentication:
EMAIL_PASSWORD=your_gmail_app_password

# For SMTP Google OAuth2 Authentication (Alternative):
GCLOUD_CLIENT_ID=your_google_client_id
GCLOUD_CLIENT_SECRET=your_google_client_secret
GCLOUD_REFRESH_TOKEN=your_google_refresh_token
```

### Installation

1.  Install dependencies:
    ```bash
    npm install
    ```

2.  Run the development server:
    ```bash
    npm run dev
    ```

3.  Open [http://localhost:3000](http://localhost:3000) in your web browser.

## Architectural Notes

The codebase maintains strict separation of execution contexts:
*   Files starting with `SIDE: Server-side` run strictly in the Node.js server context (API routes, services, database models, and connection logic).
*   Files starting with `SIDE: Client-side` execute in the browser context (interactive components, pages marked with `"use client"`, and contexts using browser API like localStorage).
