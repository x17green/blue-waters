# Bayelsa Boat Club - Bayelsa Boat Booking Platform

A sophisticated, modern boat booking platform built for the Ministry of Marine and Blue Economy. This MVP includes customer-facing booking interfaces, operator dashboards, and a comprehensive database system for managing trips, bookings, payments, and passenger check-ins.


## 📚 Documentation Index

| Topic | Path |
|--------|------|
| 🧭 Overview & Vision | [docs/business_overview.md](docs/business_overview.md) |
| ⚙️ Architecture | [docs/architecture.md](docs/architecture.md) |
| 🧮 Database Schema | [docs/database.md](docs/database.md) |
| 🔐 MetaTickets Integration | [docs/integrations.md](docs/integrations.md) |
| 🧾 API Design | [docs/api.md](docs/api.md) |
| 🧰 Developer Setup | [docs/setup.md](docs/setup.md) |
| 🗓️ Product Roadmap | [docs/roadmap.md](docs/roadmap.md) |


## Features

### 🚢 Customer Features
- **Browse & Search**: Advanced trip search with filtering by route, date, price, and ratings
- **Easy Booking**: Intuitive multi-step booking process
- **Payment Integration**: Support for card, mobile money, and bank transfers
- **Dashboard**: View booking history, manage reservations, track upcoming trips
- **Reviews & Ratings**: Leave feedback on completed trips

### 👨‍✈️ Operator Features
- **Trip Management**: Create and manage boat trips and schedules
- **Dashboard Analytics**: Revenue tracking, booking statistics, and performance metrics
- **Passenger Management**: View passenger lists and manage check-ins
- **Rating & Reputation**: Monitor operator ratings and customer reviews

### 🛡️ Safety & Security
- **User Authentication**: Secure sign-up and login with Supabase Auth
- **Row Level Security**: Database-level security policies
- **Secure Payments**: PCI-compliant payment handling
- **QR Code Check-in**: Contactless passenger check-in system

## Tech Stack

- **Frontend**: Next.js 16 (App Router) with React 19.2
- **UI Component Library**: HeroUI (NextUI) with TypeScript
- **Styling**: Tailwind CSS with custom design tokens
- **Animations**: Framer Motion for smooth interactions
- **Database**: Supabase PostgreSQL
- **Charts**: Recharts for analytics visualization
- **Authentication**: Supabase Auth
- **Package Manager**: pnpm

## Design System

### Color Palette (40-10-60 Rule)
- **Primary Blue (40%)**: `#0080D0` - Ocean water theme
- **Accent Orange (10%)**: `#FF6B35` - Calypso drink inspired
- **Neutrals (60%)**: Whites, light grays, and backgrounds

### Typography
- **Headings**: Geist font family
- **Body**: Geist font family
- **Maximum 2 font families** for optimal performance

## Getting Started

### Prerequisites
- Node.js 18+ 
- pnpm package manager
- Supabase project (free tier available)

### Installation

1. **Clone and Install Dependencies**
```bash
pnpm install
```

2. **Setup Supabase**
   - Create a Supabase project at https://supabase.com
   - Get your project URL and anon key from the project settings
   - Create a `.env.local` file:

```bash
cp .env.example .env.local
```

3. **Add Environment Variables**
Edit `.env.local` with your Supabase credentials:
```
NEXT_PUBLIC_SUPABASE_URL=your_project_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_anon_key
```

4. **Setup Database Schema**
The database schema will be automatically created when you connect Supabase. The schema includes:
- `users` - User profiles and authentication
- `boat_operators` - Operator information and ratings
- `boats` - Boat details and specifications
- `routes` - Predefined routes
- `trips` - Scheduled trips
- `bookings` - Customer bookings
- `passengers` - Passenger details
- `payments` - Payment records
- `check_ins` - Check-in records
- `reviews` - Customer reviews and ratings

5. **Run Development Server**
```bash
pnpm dev
```

Visit http://localhost:3000 to see the application.

## Project Structure

```
/app
  /operator
    /dashboard     - Operator dashboard with analytics
  /checkout        - Payment checkout page
  /dashboard       - Customer dashboard
  /book            - Trip booking interface
  /search          - Trip search and filtering
  /login           - User authentication
  /signup          - New user registration
  /page.tsx        - Landing page

/components
  /hero            - Hero section with search
  /featured-trips  - Trip cards display
  /how-it-works    - Step-by-step guide
  /testimonials    - Customer reviews
  /footer          - Footer navigation
  /providers       - NextUI provider setup

/lib
  /supabase.ts     - Supabase client configuration

/styles
  /globals.css     - Global styles and design tokens

/scripts
  /init-database.sql  - Database schema setup
  /setup-db.js       - Database initialization script
```

## Database Schema

### Users Table
```sql
- id (UUID, PRIMARY KEY)
- email (VARCHAR, UNIQUE)
- full_name (VARCHAR)
- phone (VARCHAR)
- user_type (VARCHAR: 'customer', 'operator', 'staff', 'admin')
- profile_picture_url (TEXT)
- is_active (BOOLEAN)
- created_at, updated_at (TIMESTAMP)
```

### Bookings Table
```sql
- id (UUID, PRIMARY KEY)
- user_id (UUID, FOREIGN KEY)
- trip_id (UUID, FOREIGN KEY)
- number_of_passengers (INT)
- total_amount (DECIMAL)
- booking_status (VARCHAR: 'pending', 'confirmed', 'checked_in', 'completed', 'cancelled')
- payment_status (VARCHAR: 'pending', 'paid', 'failed', 'refunded')
- booking_reference (VARCHAR, UNIQUE)
- created_at, updated_at (TIMESTAMP)
```

## Key Pages

### Landing Page (`/`)
- Hero section with search functionality
- Featured trips carousel
- "How It Works" guide
- Customer testimonials
- Call-to-action sections

### Search & Browse (`/search`, `/book`)
- Advanced filtering (route, date, price, rating)
- Trip details and availability
- Booking summary sidebar
- Responsive grid layout

### Booking Flow
1. **Browse** (`/book`) - Select trip and passengers
2. **Checkout** (`/checkout`) - Enter details and payment
3. **Confirmation** - Booking confirmation with reference number

### Authentication
- **Sign Up** (`/signup`) - New user registration with user type selection
- **Login** (`/login`) - User authentication
- **Dashboard** (`/dashboard`) - View bookings and account info

### Operator Dashboard (`/operator/dashboard`)
- Revenue analytics with charts
- Weekly booking statistics
- Upcoming trips management
- Passenger statistics

## Styling & Animations

### Framer Motion Animations
- Page transitions with fade and slide effects
- Staggered component animations
- Hover effects on cards
- Smooth scrolling animations
- Loading states with animated spinners

### Tailwind CSS Features
- Custom color tokens (primary, accent, secondary)
- Responsive breakpoints (sm, md, lg)
- Gradient backgrounds
- Glassmorphism effects
- Shadow and depth effects

## Authentication Flow

1. User signs up with email and password
2. Supabase Auth creates user account
3. User profile created in `users` table
4. User type (customer/operator) stored
5. JWT token issued for session management
6. Row Level Security policies enforce data access

## Security Features

- **Password Hashing**: Bcrypt via Supabase Auth
- **Session Management**: HTTP-only cookies (Supabase)
- **Row Level Security**: Database policies restrict data access
- **Input Validation**: Client-side form validation
- **CORS Protection**: Supabase handles cross-origin requests
- **XSS Prevention**: React's built-in XSS protection

## Payment Integration

The checkout page supports multiple payment methods:
- **Credit/Debit Cards**: Via Stripe or Paystack
- **Mobile Money**: MTN, Airtel, Glo integration
- **Bank Transfer**: Direct bank account transfers

Currently using mock payment flow. To implement real payments:

1. **Card Payments**: Integrate Stripe or Paystack
2. **Mobile Money**: Use provider APIs (MTN, Airtel)
3. **Bank Transfer**: Use payment verification API

## Future Enhancements

- [ ] Real payment gateway integration
- [ ] Email notifications for bookings and confirmations
- [ ] SMS alerts for trip updates
- [ ] QR code generation for digital tickets
- [ ] Refund and cancellation management
- [ ] Dispute resolution system
- [ ] Multi-language support
- [ ] Mobile app version
- [ ] Real-time seat selection
- [ ] Loyalty rewards program

## Environment Variables

| Variable | Description | Example |
|----------|-------------|---------|
| `NEXT_PUBLIC_SUPABASE_URL` | Supabase project URL | `https://xxx.supabase.co` |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Supabase anonymous key | `eyJxxx...` |

## Deployment

### Deploy to Vercel

1. Push code to GitHub
2. Connect GitHub repository to Vercel
3. Add environment variables in Vercel dashboard
4. Deploy automatically on every push

```bash
# Manual deployment
vercel deploy
```

## Development Guidelines

### Code Style
- Use TypeScript for type safety
- Follow React best practices (hooks, functional components)
- Use 'use client' for client-side components
- Implement proper error handling

### Component Structure
- Keep components small and focused
- Use composition over inheritance
- Implement proper PropTypes or TypeScript interfaces
- Add proper JSDoc comments

### Performance
- Use Next.js Image component for optimization
- Implement lazy loading for routes
- Use React.memo for expensive components
- Optimize database queries with proper indexes

## Testing

Run tests with:
```bash
pnpm test
```

## Troubleshooting

### Supabase Connection Issues
1. Verify environment variables are set correctly
2. Check that Supabase project is active
3. Ensure CORS is configured properly
4. Check browser console for specific errors

### Build Errors
1. Clear `.next` folder: `rm -rf .next`
2. Clear node_modules: `rm -rf node_modules && pnpm install`
3. Check TypeScript errors: `pnpm tsc --noEmit`

### Database Errors
1. Verify database tables exist
2. Check Row Level Security policies
3. Ensure user has proper permissions
4. Check Supabase logs for detailed errors

--- 

## Support

For issues or questions:
1. Check existing documentation
2. Review Supabase documentation
3. Check Next.js documentation
4. Open an issue in the repository

---

### 🔗 Quick Links

- [Architecture Overview](docs/architecture.md)
- [API Endpoints](docs/api.md)
- [Database Schema](docs/database.md)

---

### 🧑‍💻 Authors
- **Marshall “Green”** — Lead Engineer  
<!-- **Stella** — MetaTickets Integration Partner  -->

--- 

## License

This project is built for the Ministry of Maritime and Blue Economy in Bayelsa, Nigeria.

MIT License © 2026 Bayelsa Cruise Systems.

---

**Ready to sail? Visit http://localhost:3000 to get started! ⛵**
