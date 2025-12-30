# Rambo - Real Estate Marketplace
## Current Project Folder Structure

```
aiproject/
├── app/                          # Next.js App Router
│   ├── globals.css
│   ├── layout.tsx                # Root layout
│   ├── page.tsx                  # Home page
│   ├── api/                      # API routes
│   │   ├── auth/
│   │   │   ├── me/
│   │   │   │   └── route.ts
│   │   │   ├── send-otp/
│   │   │   │   └── route.ts
│   │   │   ├── signup/
│   │   │   │   └── route.ts
│   │   │   └── verify-otp/
│   │   │       └── route.ts
│   │   ├── booking/
│   │   │   ├── [id]/
│   │   │   │   └── complete/
│   │   │   │       └── route.ts
│   │   │   ├── create/
│   │   │   │   └── route.ts
│   │   │   ├── my-bookings/
│   │   │   │   └── route.ts
│   │   │   └── payment/
│   │   │       └── route.ts
│   │   ├── bookmark/
│   │   │   └── [propertyId]/
│   │   │       └── route.ts
│   │   ├── bookmarks/
│   │   │   └── route.ts
│   │   ├── chat/
│   │   │   ├── conversations/
│   │   │   │   ├── route.ts
│   │   │   │   └── [id]/
│   │   │   │       └── route.ts
│   │   │   ├── messages/
│   │   │   │   └── route.ts
│   │   │   └── upload/
│   │   │       └── route.ts
│   │   ├── property/
│   │   │   ├── [id]/
│   │   │   │   ├── route.ts
│   │   │   │   └── status/
│   │   │   │       └── route.ts
│   │   │   └── my-properties/
│   │   │       └── route.ts
│   │   └── rating/
│   │       └── create/
│   │           └── route.ts
│   ├── bookmarks/
│   │   └── page.tsx
│   ├── chat/
│   │   ├── page.tsx
│   │   └── [conversationId]/
│   │       └── page.tsx
│   ├── dashboard/
│   │   ├── layout.tsx
│   │   ├── page.tsx
│   │   └── properties/
│   │       └── page.tsx
│   └── property/
│       └── [id]/
│           └── page.tsx
├── components/
│   ├── PropertySection.tsx
│   ├── auth/
│   │   ├── OTPVerification.tsx
│   │   ├── SignInModal.tsx
│   │   └── SignUpModal.tsx
│   ├── booking/
│   │   ├── BookingModal.tsx
│   │   ├── MeetupScheduler.tsx
│   │   └── PaymentForm.tsx
│   ├── chat/
│   │   ├── AttachmentUpload.tsx
│   │   ├── ChatList.tsx
│   │   ├── ChatWindow.tsx
│   │   ├── MessageInput.tsx
│   │   └── MessageList.tsx
│   ├── layout/
│   │   ├── ConditionalHeader.tsx
│   │   ├── Header.tsx
│   │   └── owner/
│   │       └── PropertyStatusToggle.tsx
│   ├── property/
│   │   └── PropertyCard.tsx
│   ├── rating/
│   │   └── RatingModal.tsx
│   └── ui/
│       └── Modal.tsx
├── lib/
│   ├── auth.ts
│   ├── constants.ts
│   ├── prisma.ts
│   ├── utils.ts
│   └── validations.ts
├── prisma/
│   └── schema.prisma
├── types/
│   └── index.ts
├── next-env.d.ts
├── next.config.js
├── package.json
├── postcss.config.js
├── README.md
├── tailwind.config.ts
└── tsconfig.json
```

## Technology Stack

- **Framework**: Next.js 14+ (App Router)
- **Database**: PostgreSQL with Prisma ORM
- **Styling**: Tailwind CSS
- **Authentication**: OTP-based
- **Real-time Chat**: Implemented
- **Payments**: Stripe integration
- **File Uploads**: Supported
- **UI Components**: Custom components with Tailwind

## Features

- User authentication with OTP
- Property listings and search
- Booking system with payments
- Chat between users and owners
- Owner dashboard for managing properties
- Bookmarks for properties
- Ratings for completed deals

