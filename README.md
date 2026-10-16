# StyleNest — Fashion Affiliate Discovery MVP

StyleNest is a React + Vite + Tailwind frontend backed by Node.js + Express + MongoDB/Mongoose. It is a discovery site, not an ecommerce checkout: users discover products on StyleNest and are redirected to the exact external retailer URL via an affiliate redirect.

## Architecture

```text
React/Vite/Tailwind
      |
      | REST + HTTP-only cookies
      v
Node.js + Express
  |     |       |
  v     v       v
MongoDB Cloudinary Analytics Events
```

The public site and protected admin panel are two UI experiences in the same app. User authentication exists only for wishlist functionality. Admin authentication is separate and has no public registration page.

## Main folders

```text
client/src/
  components/    reusable public UI
  layouts/       PublicLayout, AdminLayout
  pages/         public pages
  admin/         admin login, dashboard, catalogue, analytics, preview
  context/       user auth + wishlist state
  services/      API client
  utils/         analytics + helpers
server/
  config/        MongoDB + Cloudinary
  controllers/   business logic
  middleware/    auth, upload, errors
  models/        Product, Category, User, Admin, AnalyticsEvent
  routes/        REST routes
  services/      image upload/cleanup
  scripts/       admin + demo data seed
```

## Setup

1. Install Node.js 20+ and create a MongoDB Atlas database.
2. Copy `client/.env.example` to `client/.env` and `server/.env.example` to `server/.env`.
3. Fill in `MONGODB_URI`, `JWT_SECRET`, `CLIENT_URL`, `SERVER_URL`, and Cloudinary credentials. Use a long random JWT secret.
4. Configure `ADMIN_EMAIL` and `ADMIN_PASSWORD` and run:

```bash
npm install
npm run seed:admin
npm run seed:data
npm run dev
```

Frontend: `http://localhost:5173`
API health check: `http://localhost:5000/api/health`

For real product images, configure Cloudinary. The add/edit product form supports multiple image uploads (up to 10, 5 MB each). MongoDB stores image URLs and Cloudinary public IDs, not binary image data.

## Affiliate flow

Public product URL:
`/fashion/:categorySlug/:slug`

Shop button:
`GET /go/:productId`

The backend verifies the product is published, records an `AFFILIATE_CLICK`, then redirects to the exact stored HTTP/HTTPS affiliate URL.

## Analytics

Tracked events are `VISIT`, `PRODUCT_VIEW`, and `AFFILIATE_CLICK`. Traffic source can come from UTM source values or common referrer domains. The MVP deliberately does not fabricate retailer purchases, sales, or commission values.

## Security notes

- Passwords are stored as bcrypt hashes.
- User/admin JWTs are placed in separate HTTP-only cookies.
- Admin API routes require admin authentication.
- Wishlist API routes require user authentication.
- Login endpoints are rate limited.
- Affiliate URLs are validated to HTTP/HTTPS only.
- `.env` is ignored by git.

## Production

Use a frontend host and backend host of your choice. Set production `CLIENT_URL`, `SERVER_URL`, `COOKIE_SECURE=true`, and an appropriate cross-site cookie configuration. Review the placeholder legal pages before launch.
