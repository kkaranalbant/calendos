# Kalendos Mobile App

Cross-platform mobile e-commerce application for Kalendos - a Turkish tropical fruit marketplace powered by Shopify.

## Project Overview

Kalendos is a React Native mobile app that provides a seamless shopping experience for fresh, locally-grown tropical fruits. The app integrates with Shopify's Storefront API for product management and checkout, while maintaining a minimal custom backend for push notifications and webhooks.

### Key Features

- 🛍️ Product browsing & search (Shopify integration)
- 🛒 Shopping cart & checkout (Shopify native checkout)
- 👤 User authentication & profile management
- 📦 Order history & tracking
- 🔔 Push notifications (order updates, campaigns)
- 📍 Location services (address picker with maps)
- 📷 QR/Barcode scanner
- 📴 Offline mode (product caching)

### Tech Stack

**Mobile App:**
- React Native 0.82+ with TypeScript
- Apollo Client (Shopify GraphQL)
- Redux Toolkit (state management)
- React Navigation 7
- React Native Paper (UI components)

**Backend:**
- Node.js + Express + TypeScript
- PostgreSQL + Prisma ORM
- Firebase Admin SDK (push notifications)
- Shopify Webhooks handler

**Shopify Integration:**
- Storefront API (products, cart, checkout, customers)
- Admin API (webhooks, order management)

## Project Structure

\`\`\`
calendos/
├── mobile/                 # React Native mobile app
│   ├── android/           # Android native code
│   ├── ios/               # iOS native code
│   ├── src/
│   │   ├── shopify/      # Shopify API integration
│   │   ├── store/        # Redux store & slices
│   │   ├── navigation/   # Navigation setup
│   │   ├── screens/      # Screen components
│   │   ├── components/   # Reusable components
│   │   ├── theme/        # Theme & styling
│   │   └── services/     # Services (push, location, etc.)
│   └── package.json
│
├── backend/               # Minimal Node.js backend
│   ├── src/
│   │   ├── routes/       # API routes
│   │   ├── services/     # Business logic
│   │   ├── middlewares/  # Middleware
│   │   └── config/       # Configuration
│   ├── prisma/           # Database schema
│   └── package.json
│
├── shopify-app/          # Shopify app configuration & docs
│   └── README.md
│
└── README.md
\`\`\`

## Prerequisites

- **Node.js** 20+ LTS
- **npm** or **yarn**
- **React Native CLI** (or npx)
- **Xcode** (for iOS development - macOS only)
- **Android Studio** (for Android development)
- **PostgreSQL** 15+
- **Shopify Partner Account**
- **Firebase Project** (for push notifications)

## Getting Started

### 1. Clone the Repository

\`\`\`bash
git clone <repository-url>
cd calendos
\`\`\`

### 2. Mobile App Setup

\`\`\`bash
cd mobile

# Install dependencies
npm install

# For iOS (macOS only)
cd ios && pod install && cd ..

# Copy environment variables
cp .env.example .env
# Edit .env and add your Shopify credentials
\`\`\`

#### Configure Shopify Credentials

Edit \`mobile/.env\`:

\`\`\`env
SHOPIFY_STORE_DOMAIN=your-store.myshopify.com
SHOPIFY_STOREFRONT_API_URL=https://your-store.myshopify.com/api/2024-01/graphql.json
SHOPIFY_STOREFRONT_ACCESS_TOKEN=your_storefront_token_here
\`\`\`

See \`shopify-app/README.md\` for detailed Shopify setup instructions.

#### Run the App

\`\`\`bash
# Start Metro bundler
npm start

# Run on iOS (separate terminal)
npm run ios

# Run on Android (separate terminal)
npm run android
\`\`\`

### 3. Backend Setup

\`\`\`bash
cd backend

# Install dependencies
npm install

# Copy environment variables
cp .env.example .env
# Edit .env and add database, Shopify, and Firebase credentials

# Generate Prisma client
npm run prisma:generate

# Run database migrations
npm run prisma:migrate

# Start development server
npm run dev
\`\`\`

Backend will run on http://localhost:3000

#### Configure Backend Environment

Edit \`backend/.env\`:

\`\`\`env
DATABASE_URL="postgresql://localhost:5432/kalendos"
SHOPIFY_WEBHOOK_SECRET=your_webhook_secret
SHOPIFY_ADMIN_API_ACCESS_TOKEN=your_admin_token
FIREBASE_PROJECT_ID=your_project_id
# ... (see .env.example for all variables)
\`\`\`

### 4. Database Setup

\`\`\`bash
# Create PostgreSQL database
createdb kalendos

# Or using psql
psql -U postgres
CREATE DATABASE kalendos;
\\q

# Run migrations
cd backend
npm run prisma:migrate

# (Optional) Open Prisma Studio to view data
npm run prisma:studio
\`\`\`

### 5. Shopify App Configuration

Follow the detailed guide in \`shopify-app/README.md\` to:

1. Create Shopify Partner account
2. Create custom Shopify app
3. Configure Storefront API access token
4. Configure Admin API access token
5. Setup webhooks

## Development Phases

This project follows an 8-phase development plan:

- ✅ **Phase 1**: Project setup, Shopify integration, basic structure
- ✅ **Phase 2**: Authentication & customer management
- ✅ **Phase 3**: Product catalog & search
- ✅ **Phase 4**: Cart & checkout
- ✅ **Phase 5**: User profile & orders
- ✅ **Phase 6**: Advanced features (Wishlist, Dark Mode, Share)
- ⏳ **Phase 7**: Content & polish
- ⏳ **Phase 8**: Deployment & launch

**MVP+ READY!** 🎉 All core + advanced features complete (Phases 1-6).

## Available Scripts

### Mobile App

\`\`\`bash
npm start          # Start Metro bundler
npm run ios        # Run on iOS simulator
npm run android    # Run on Android emulator
npm run lint       # Lint code
npm test           # Run tests
\`\`\`

### Backend

\`\`\`bash
npm run dev              # Start development server (with auto-reload)
npm run build            # Build TypeScript to JavaScript
npm start                # Start production server
npm run prisma:generate  # Generate Prisma client
npm run prisma:migrate   # Run database migrations
npm run prisma:studio    # Open Prisma Studio (database GUI)
\`\`\`

## Project Status: Phase 6 Complete ✅

Phase 6 (Advanced Features) has been completed. **MVP+ is now ready!** 🚀

The following are now ready:

### Phase 1 - Setup ✅
- React Native project initialized with TypeScript
- Apollo Client configured for Shopify GraphQL
- Redux Toolkit store setup (auth & cart slices)
- React Navigation structure (Auth & Main navigators)
- Theme system (colors, typography, spacing)
- Environment variables configuration
- Shopify GraphQL queries & mutations (products, customers, cart)
- Express + TypeScript minimal backend
- Prisma ORM with PostgreSQL schema

### Phase 2 - Authentication ✅
- Login screen with Shopify Customer API
- Register screen with form validation
- Forgot password flow
- Customer access token management
- Auth state management with Redux

### Phase 3 - Product Catalog ✅
- Home screen with featured products and categories
- Product list screen (grid/list view toggle)
- Product detail screen (images, variants, description)
- Search screen with filters and sorting
- Collection-based filtering
- Product card and category card components
- Infinite scroll pagination
- Pull-to-refresh functionality
- Image lazy loading

### Phase 4 - Cart & Checkout ✅
- Cart screen with full item management
- Add to cart functionality in ProductDetailScreen
- Quantity update and remove item actions
- Cart badge showing item count on tab navigator
- Shopify Cart API integration (create, update, remove)
- CheckoutWebView with Shopify native checkout
- Order confirmation screen
- Cart persistence with AsyncStorage
- Real-time cart sync with Shopify
- Custom useCart hook for cart operations

### Phase 5 - User Profile & Orders ✅
- Profile screen with customer information
- Edit profile with form validation
- Address management (list, add, edit, delete, set default)
- Order history with pagination
- Order detail screen with tracking info
- Settings screen (notifications, app preferences)
- Logout functionality with confirmation
- ProfileNavigator stack for seamless navigation
- useCustomer and useOrders custom hooks
- Full Shopify Customer API integration

### Phase 6 - Advanced Features (Quick Wins) ✅
- **Wishlist/Favorites**: Save products, favorites screen, heart icons, badge counter
- **Dark Mode**: Light/Dark themes, theme toggle in Settings, AsyncStorage persistence
- **Product Share**: Share products via native share sheet (WhatsApp, Instagram, etc.)
- useFavorites custom hook
- ThemeContext for global theme management
- No new dependencies (built-in React Native APIs)

### Shopify Integration ✅
- Shopify GraphQL queries (products, collections, search, cart, customers, orders)
- Shopify Cart mutations (create, add lines, update, remove)
- Shopify Customer mutations (update, address CRUD)
- Product variants handling
- Price range display
- Stock availability checking
- Image optimization
- Native Shopify checkout integration
- Order tracking and history

## Next Steps (Phase 7)

Phase 7 will focus on content & polish:

1. Blog/Content integration (Shopify Blog API)
2. FAQ and About screens
3. Error handling improvements
4. Loading states polish (skeleton screens, shimmer effects)
5. Animations & transitions
6. Deep linking setup
7. Performance optimization
8. Accessibility improvements

### Optional Phase 6 Advanced Features
- Multi-language support (i18n)
- Product reviews and ratings
- Push notifications (Firebase Cloud Messaging)
- Offline mode with product caching
- QR/Barcode scanner
- Location services and maps

## Troubleshooting

### "Module not found" errors

\`\`\`bash
cd mobile
rm -rf node_modules
npm install
cd ios && pod install && cd ..
\`\`\`

### Metro bundler cache issues

\`\`\`bash
npm start -- --reset-cache
\`\`\`

### Android build errors

\`\`\`bash
cd android
./gradlew clean
cd ..
npm run android
\`\`\`

### iOS build errors

\`\`\`bash
cd ios
pod deintegrate
pod install
cd ..
npm run ios
\`\`\`

## Contributing

This is a private project for Kalendos. Please follow the development plan and coding standards.

## License

Private - All rights reserved by Kalendos.

## Support

For setup issues or questions, refer to:
- \`shopify-app/README.md\` - Shopify configuration
- \`mobile/README.md\` - Mobile app details
- \`backend/README.md\` - Backend details
- Project plan: \`/root/.claude/plans/hashed-nibbling-lake.md\`

---

**Last Updated**: 2025-12-04
**Current Phase**: Phase 6 Complete ✅ **MVP+ READY!** 🚀
**Next Phase**: Phase 7 - Content & Polish
