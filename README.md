# Annapurna Nutrition

This project is a React application that connects directly to Supabase for backend services. It uses Vite as the build tool and development server.

## Project Setup

The project has been configured to use a client-only architecture with Supabase providing the backend services.

### Running the Application

To run the application in development mode:

```bash
npm run dev
```

To build the application for production:

```bash
npm run build
```

To preview the production build locally:

```bash
npm run preview
```

## Configuration

The application uses environment variables for configuration. These are stored in the `.env` file:

- `VITE_SUPABASE_URL`: The URL of your Supabase project
- `VITE_SUPABASE_ANON_KEY`: The anonymous key for your Supabase project

## Architecture

The application uses the following technologies:

- React for the frontend
- Supabase for authentication and database
- React Query for data fetching and state management
- Wouter for routing
- Shadcn UI components for the user interface
- Tailwind CSS for styling
