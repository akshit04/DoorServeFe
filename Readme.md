# DoorServe Frontend

React TypeScript frontend for the DoorServe home services platform.

## What's in this repo

- **Customer Interface**: Browse services, book appointments, manage bookings
- **Partner Dashboard**: Service management, booking tracking, analytics
- **Modern UI**: Built with React, TypeScript, and Tailwind CSS

## How to run the app

### Prerequisites
- Node.js (16+)
- npm

### Setup Steps

1. **Clone and install**
   ```bash
   git clone https://github.com/your-username/door-serve-fe.git
   cd door-serve-fe
   npm install
   ```

2. **Create .env file**
   ```bash
   # Create .env in root directory
   REACT_APP_API_URL=http://localhost:8080/api
   ```

3. **Start the app**
   ```bash
   PORT=3000 npm start
   ```

4. **Open browser**
   Go to [http://localhost:3000](http://localhost:3000)

## Available Scripts

```bash
npm start          # Start development server
npm run build      # Build for production
npm test           # Run tests
```

## Tech Stack

- React 18 + TypeScript
- Tailwind CSS for styling
- TanStack Query for API calls
- React Router for navigation
