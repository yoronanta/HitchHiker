# Hitchhiker App - Uber for Daily Commuters

A web application for daily hitchhiking that connects riders with drivers going the same way. Similar to Uber but focused on regular commuters sharing rides for their daily trips. 

## Disclaimer
Frontend is mostly vibecoded, since the main goal was to test the backend part. So all the visual inconsistencies are Claude Code's courtesy :) 

Also there are some known problems yet to be solved, such as:
- Auth issues, users can't login in existing accounts. 
- Google maps integration refuses to work consistently. 
- Stripe integration is not tested. 
- Major frontend artefacts.

## Features

- User authentication (signup/login)
- Trip creation and browsing
- Real-time map integration
- Ride matching functionality
- User profiles and ratings
- Payment processing
- Mobile-first responsive design

## Technology Stack

### Backend
- Node.js with Express.js
- MongoDB with Mongoose ODM
- JWT for authentication
- Socket.IO for real-time updates
- Stripe for payment processing

### Frontend 
- React with React Router
- Material-UI (MUI) for components
- React Google Maps API for map integration
- Socket.IO client for real-time communication

## Project Structure

```
backend/
├── controllers/      # Request handlers
├── models/           # Database models
├── routes/           # API route definitions
├── middleware/       # Custom middleware
├── utils/            # Helper functions
├── server.js         # Entry point
├── package.json      # Dependencies and scripts
└── .env              # Environment variables

frontend/
├── public/           # Static assets
├── src/
│   ├── components/   # Reusable UI components
│   ├── pages/        # Page components
│   ├── context/      # React context providers
│   ├── hooks/        # Custom React hooks
│   ├── services/     # API service functions
│   └── assets/       # Images, icons, styles
├── package.json      # Dependencies and scripts
└── README.md         # This file
```

## Setup Instructions

### Prerequisites
- Node.js (v14+)
- npm or yarn
- MongoDB instance
- Stripe account (for payments)
- Google Maps API key (for maps)

### Backend Setup
1. Navigate to the backend directory:
   ```bash
   cd backend
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Create a `.env` file based on the example:
   ```bash
   cp .env.example .env
   ```
   Then edit `.env` with your actual values:
   - `MONGODB_URI`: Your MongoDB connection string
   - `JWT_SECRET`: A strong secret for JWT signing
   - `STRIPE_SECRET_KEY`: Your Stripe secret key
   - `FRONTEND_URL`: URL where frontend will run (default: http://localhost:3000)

4. Start the development server:
   ```bash
   npm run dev
   ```
   The backend will run on http://localhost:5000

### Frontend Setup
1. Navigate to the frontend directory:
   ```bash
   cd frontend
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Start the development server:
   ```bash
   npm start
   ```
   The frontend will run on http://localhost:3000

## API Endpoints

### Authentication
- `POST /api/auth/register` - Register a new user
- `POST /api/auth/login` - Login user
- `GET /api/auth/profile` - Get current user profile (protected)
- `PUT /api/auth/profile` - Update user profile (protected)

### Trips
- `GET /api/trips` - Get pending trips (optional: lat/lng/radius for proximity)
- `POST /api/trips` - Create a new trip
- `GET /api/trips/:id` - Get trip by ID
- `PUT /api/trips/:id/accept` - Accept a trip (driver only)
- `PUT /api/trips/:id/start` - Start an accepted trip
- `PUT /api/trips/:id/complete` - Complete an in-progress trip
- `PUT /api/trips/:id/cancel` - Cancel a trip
- `GET /api/trips/user/trips` - Get current user's trips

### Users
- `GET /api/users` - Get all users (with filters)
- `GET /api/users/:id` - Get user by ID
- `GET /api/users/:id/ratings` - Get user's ratings
- `GET /api/users/verify-driver` - Verify driver status (protected)

### Payments
- `POST /api/payments/create-intent` - Create payment intent for a trip
- `POST /api/payments/confirm` - Confirm payment from frontend
- `GET /api/payments/:id` - Get payment by ID
- `GET /api/payments/user/payments` - Get current user's payments
- `DELETE /api/payments/:id/refund` - Refund a payment

## Database Models

### User
- `name`: String (required)
- `email`: String (required, unique)
- `passwordHash`: String (required)
- `phone`: String
- `vehicleInfo`: Object (make, model, year, color, licensePlate)
- `rating`: Number (0-5, default: 0)
- `totalRatings`: Number (default: 0)
- `isDriver`: Boolean (default: false)
- `isVerified`: Boolean (default: false)
- `createdAt`: Timestamp
- `updatedAt`: Timestamp

### Trip
- `rider`: ObjectId (ref: User, required)
- `driver`: ObjectId (ref: User)
- `startLocation`: GeoJSON Point (required)
- `endLocation`: GeoJSON Point (required)
- `startTime`: Date (required)
- `endTime`: Date
- `status`: String (pending, accepted, in_progress, completed, cancelled)
- `price`: Number (required)
- `distance`: Number (km)
- `estimatedDuration`: Number (minutes)
- `notes`: String
- `createdAt`: Timestamp
- `updatedAt`: Timestamp

### Rating
- `trip`: ObjectId (ref: Trip, required)
- `rater`: ObjectId (ref: User, required)
- `rated`: ObjectId (ref: User, required)
- `rating`: Number (1-5, required)
- `comment`: String
- `createdAt`: Timestamp

### Payment
- `trip`: ObjectId (ref: Trip, required)
- `payer`: ObjectId (ref: User, required)
- `payee`: ObjectId (ref: User, required)
- `amount`: Number (required)
- `currency`: String (default: USD)
- `status`: String (pending, processing, completed, failed, refunded)
- `stripePaymentIntentId`: String
- `stripeChargeId`: String
- `receiptUrl`: String
- `description`: String
- `createdAt`: Timestamp
- `updatedAt`: Timestamp

## Environment Variables

Create a `.env` file in the backend directory with:

```
PORT=5000
FRONTEND_URL=http://localhost:3000
MONGODB_URI=mongodb://localhost:27017/hitchhiker-app
JWT_SECRET=your_jwt_secret_here
STRIPE_SECRET_KEY=your_stripe_secret_key_here
NODE_ENV=development
```

## Development

### Backend
- Run tests: `npm test`
- Start server: `npm start` or `npm dev` for development with nodemon

### Frontend
- Run tests: `npm test`
- Start server: `npm start`
- Build for production: `npm run build`

## Deployment

For production deployment:
1. Set `NODE_ENV=production` in backend `.env`
2. Build frontend: `npm run build` in frontend directory
3. Serve the built frontend files from a static file server
4. Ensure all environment variables are properly set for production

## Contributing

1. Fork the repository
2. Create a feature branch
3. Commit your changes
4. Push to the branch
5. Open a pull request

## License

MIT

## Acknowledgments

- Material-UI for the UI component library
- Socket.IO for real-time communication
- Stripe for payment processing
- MongoDB for the database
- Express.js for the web framework
- React for the frontend library
