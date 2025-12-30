# 🏛️ Rambo - Premium Real Estate Marketplace

A high-end, minimal, and classy real estate marketplace built with Next.js, PostgreSQL, and Prisma.

## 🎯 Project Overview

Rambo is a luxury real estate platform that distinguishes between **Buy** and **Rent** transactions with different workflows:

- **BUY Section**: Houses and Apartments only. Requires physical meetup booking.
- **RENT Section**: Rooms, Houses, Apartments, and Villas. Online payment/booking enabled.

## 👥 User Roles

### Customer
- Browse properties with location-based filtering
- Bookmark favorite properties
- Book properties (rent or buy)
- Rate sellers after deal completion

### Owner
- Must verify with documents before listing
- Access to private analytics dashboard
- Add/edit property listings with photo/video support
- Toggle property status (Available, Rented, Bought)
- View revenue analytics (Money Earned vs. Date)

## 🎨 Design System

### Theme Colors
- **Charcoal**: `#1A1A1A` (Primary dark)
- **Off-white**: `#F9F9F9` (Background)
- **Gold Accents**: Subtle luxury highlights

### Typography
- **Headings**: Playfair Display (elegant, serif)
- **UI Text**: Inter (clean, sans-serif)

### UI Components
- **Header**: Sticky glassmorphism effect
- **Navigation**: Home, Rent, Buy (center), Auth (right)
- **Dashboard**: Professional analytics with Line Graphs
- **Chat**: Real-time messenger-style (text + attachments)

## 📁 Project Structure

See `FOLDER_STRUCTURE.md` for detailed folder organization.

## 🗄️ Database Schema

The Prisma schema (`prisma/schema.prisma`) includes:

### Core Models
- **User**: Role-based profiles (Customer/Owner) with verification
- **Property**: Rent/Buy listings with location, media, and status
- **Bookmark**: User favorites
- **Conversation & Message**: Real-time chat system
- **Booking**: Rent/Buy transactions with payment tracking
- **Rating**: Deal completion ratings (1-5 stars)
- **Revenue**: Owner analytics data

### Key Features
- Owner document verification workflow
- Property status management (Available/Rented/Bought)
- Separate workflows for Rent (online payment) vs Buy (physical meetup)
- Revenue tracking for analytics dashboard

## 🚀 Getting Started

### Prerequisites
- Node.js 18+ and npm/yarn
- PostgreSQL database
- Environment variables configured

### Setup Steps

1. **Install Dependencies**
   ```bash
   npm install
   # or
   yarn install
   ```

2. **Configure Environment**
   ```bash
   cp .env.example .env
   # Add your DATABASE_URL and other secrets
   ```

3. **Initialize Database**
   ```bash
   npx prisma generate
   npx prisma migrate dev --name init
   ```

4. **Run Development Server**
   ```bash
   npm run dev
   # or
   yarn dev
   ```

## 📋 Development Roadmap

### ✅ Phase 1: Foundation (Current)
- [x] Folder structure
- [x] Database schema
- [ ] Project initialization (Next.js, Prisma, Tailwind)

### 🔄 Phase 2: Layout & Theme (TASK 1)
- [ ] Global layout with glassmorphism header
- [ ] Theme configuration (colors, fonts)
- [ ] Navigation components
- [ ] Responsive design system

### 🔄 Phase 3: Authentication (TASK 2)
- [ ] Email-based OTP verification
- [ ] "Join as Owner" portal
- [ ] Document upload for owner verification
- [ ] Role-based access control

### 🔄 Phase 4: Core Pages (TASK 3)
- [ ] Hero section with location selector
- [ ] Featured listings (Rent & Buy)
- [ ] Property detail pages
- [ ] Owner dashboard with analytics
- [ ] Add listing form with media upload

### 🔄 Phase 5: Interactions (TASK 4)
- [ ] Booking flow (Rent vs Buy)
- [ ] Payment integration (Stripe for Rent)
- [ ] Real-time chat system
- [ ] Deal completion rating system
- [ ] Property status toggle

## 🔐 Authentication Flow

1. **Customer Sign Up/In**: Email OTP verification
2. **Owner Registration**: 
   - Special "Join as Owner" portal
   - Document upload (ID, business license, etc.)
   - Admin verification required
   - Access granted after approval

## 💳 Payment & Booking

### Rent Properties
- Online payment via Stripe
- Instant booking confirmation
- Payment status tracking

### Buy Properties
- Physical meetup booking
- Meeting date/location scheduling
- No online payment (handled offline)

## 📊 Analytics Dashboard

Owner dashboard features:
- **Revenue Chart**: Line graph showing Money Earned vs. Date
- **Property Performance**: Views, bookings, conversions
- **Transaction History**: All rent/buy transactions

## 💬 Chat System

- Real-time messaging between users
- Text messages + file attachments
- Property-specific conversations
- Message read receipts

## 🎯 Next Steps

After reviewing the folder structure and database schema:

1. **Confirm Technology Stack**: Next.js 14+, Prisma, Tailwind CSS
2. **Set Up Project**: Initialize Next.js project with TypeScript
3. **Configure Database**: Set up PostgreSQL connection
4. **Begin TASK 1**: Implement layout and theme system

---

**Ready to proceed?** Let me know when you'd like to start with TASK 1 (Layout & Theme) or if you'd like any adjustments to the structure/schema.
