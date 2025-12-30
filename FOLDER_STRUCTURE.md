# Rambo - Real Estate Marketplace
## Project Folder Structure

```
aiproject/
├── app/                          # Next.js App Router
│   ├── (auth)/                   # Auth routes group
│   │   ├── sign-in/
│   │   ├── sign-up/
│   │   └── join-as-owner/
│   ├── (main)/                   # Main routes group
│   │   ├── page.tsx              # Home page (Hero + Listings)
│   │   ├── rent/
│   │   ├── buy/
│   │   └── layout.tsx            # Main layout with header
│   ├── dashboard/                # Owner dashboard
│   │   ├── page.tsx              # Analytics dashboard
│   │   ├── add-listing/
│   │   └── verify/
│   ├── chat/                     # Chat interface
│   │   └── [conversationId]/
│   ├── profile/
│   └── layout.tsx                # Root layout
│
├── components/
│   ├── ui/                       # Reusable UI components
│   │   ├── Button.tsx
│   │   ├── Input.tsx
│   │   ├── Select.tsx
│   │   ├── Card.tsx
│   │   └── Modal.tsx
│   ├── layout/
│   │   ├── Header.tsx            # Glassmorphism sticky header
│   │   ├── Footer.tsx
│   │   └── Navigation.tsx
│   ├── property/
│   │   ├── PropertyCard.tsx
│   │   ├── PropertyGrid.tsx
│   │   ├── PropertyFilters.tsx
│   │   ├── LocationSelector.tsx
│   │   └── PropertyDetails.tsx
│   ├── owner/
│   │   ├── OwnerDashboard.tsx
│   │   ├── AnalyticsChart.tsx    # Line graph for revenue
│   │   ├── AddListingForm.tsx
│   │   ├── DocumentUpload.tsx
│   │   └── PropertyStatusToggle.tsx
│   ├── chat/
│   │   ├── ChatWindow.tsx
│   │   ├── MessageList.tsx
│   │   ├── MessageInput.tsx
│   │   └── AttachmentUpload.tsx
│   ├── booking/
│   │   ├── BookingForm.tsx
│   │   └── PaymentForm.tsx
│   └── rating/
│       └── RatingModal.tsx       # Deal completion rating
│
├── lib/
│   ├── prisma.ts                 # Prisma client instance
│   ├── auth.ts                   # OTP authentication logic
│   ├── utils.ts                  # Utility functions
│   ├── validations.ts            # Zod schemas
│   └── constants.ts              # Theme colors, constants
│
├── prisma/
│   ├── schema.prisma             # Database schema
│   └── migrations/               # Auto-generated migrations
│
├── public/
│   ├── images/
│   └── icons/
│
├── styles/
│   └── globals.css               # Global styles with theme
│
├── types/
│   └── index.ts                  # TypeScript type definitions
│
├── hooks/
│   ├── useAuth.ts
│   ├── useChat.ts
│   └── useProperty.ts
│
├── api/                          # API routes (if using Pages Router)
│   └── routes/                   # Or tRPC routes
│
├── .env.example
├── .gitignore
├── package.json
├── tsconfig.json
├── next.config.js
└── README.md
```

## Technology Stack Recommendations

- **Framework**: Next.js 14+ (App Router)
- **Database**: PostgreSQL with Prisma ORM
- **Styling**: Tailwind CSS
- **UI Components**: shadcn/ui or custom components
- **Real-time**: Socket.io or Pusher for chat
- **Charts**: Recharts or Chart.js for analytics
- **File Upload**: Uploadthing or AWS S3
- **Email OTP**: Resend or Nodemailer
- **Payment**: Stripe (for rent bookings)

