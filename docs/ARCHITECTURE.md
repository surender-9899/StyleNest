# StyleNest Architecture & Build Plan

This document captures the structure used to implement the MVP from the supplied specification and UI references.

## 1. High-level architecture

```text
                         PUBLIC USERS
                              |
                        React + Vite
                              |
                         REST / Cookies
                              |
                    Node.js + Express API
                 _________/_____|______\________
                /                 |               \
         MongoDB/Mongoose     Cloudinary     AnalyticsEvent

                         ADMIN USER
                              |
                     Protected React routes
                              |
                     Protected admin APIs
```

The public website is visual and fashion-oriented. The admin panel is functional and data-oriented. Both are one application and share the same REST backend.

## 2. Frontend structure

```text
client/src/
├── admin/
│   ├── AdminGuard.jsx
│   ├── AdminLogin.jsx
│   ├── Dashboard.jsx
│   ├── Products.jsx
│   ├── ProductForm.jsx
│   ├── Categories.jsx
│   ├── Analytics.jsx
│   └── Preview.jsx
├── components/
│   ├── Header.jsx
│   ├── Footer.jsx
│   ├── ProductCard.jsx
│   ├── WishlistButton.jsx
│   ├── Spinner.jsx
│   └── Toast.jsx
├── context/
│   ├── AuthContext.jsx
│   └── WishlistContext.jsx
├── layouts/
│   ├── PublicLayout.jsx
│   └── AdminLayout.jsx
├── pages/
│   ├── Home.jsx
│   ├── Products.jsx
│   ├── Category.jsx
│   ├── ProductDetails.jsx
│   ├── AuthPages.jsx
│   ├── Wishlist.jsx
│   ├── Account.jsx
│   └── StaticPages.jsx
├── services/api.js
├── utils/analytics.js
├── App.jsx
├── main.jsx
└── index.css
```

## 3. Backend structure

```text
server/
├── config/
│   ├── db.js
│   └── cloudinary.js
├── controllers/
│   ├── authController.js
│   ├── productController.js
│   ├── categoryController.js
│   ├── wishlistController.js
│   └── analyticsController.js
├── middleware/
│   ├── auth.js
│   ├── upload.js
│   └── errorHandler.js
├── models/
│   ├── Product.js
│   ├── Category.js
│   ├── User.js
│   ├── Admin.js
│   └── AnalyticsEvent.js
├── routes/
├── services/imageService.js
├── utils/
├── scripts/seedAdmin.js
├── scripts/seedData.js
└── src/server.js
```

## 4. MongoDB models

### Product

- name
- slug (unique)
- description
- price
- originalPrice
- category (ObjectId ref Category)
- brand
- gender (women / men / unisex)
- store
- affiliateUrl
- images[] ({ url, publicId, alt })
- imageUrl (primary image)
- tags[]
- status (draft / published)
- seoTitle
- metaDescription
- viewsCount
- affiliateClickCount
- createdAt / updatedAt

### Category

- name (unique)
- slug (unique)
- createdAt / updatedAt

### User

- name
- email (unique)
- passwordHash
- wishlist[] (Product ObjectIds)
- createdAt / updatedAt

### Admin

- email (unique)
- passwordHash
- createdAt / updatedAt

### AnalyticsEvent

- eventType: VISIT / PRODUCT_VIEW / AFFILIATE_CLICK
- productId
- categoryId
- store
- source
- sessionId
- path
- timestamp

## 5. REST API list

### Public

- GET `/api/products`
- GET `/api/products/search?q=...`
- GET `/api/products/:slug`
- GET `/api/categories`
- GET `/api/categories/:slug`

### User auth

- POST `/api/auth/register`
- POST `/api/auth/login`
- POST `/api/auth/logout`
- GET `/api/auth/me`

### Wishlist

- GET `/api/wishlist`
- POST `/api/wishlist/:productId`
- DELETE `/api/wishlist/:productId`

### Admin auth (explicit aliases included)

- POST `/api/admin/login`
- POST `/api/admin/logout`
- GET `/api/admin/me`

The `/api/auth/admin/*` equivalents also exist for internal compatibility.

### Admin products

- GET `/api/admin/products`
- POST `/api/admin/products`
- GET `/api/admin/products/:id`
- PUT `/api/admin/products/:id`
- DELETE `/api/admin/products/:id`
- PATCH `/api/admin/products/:id/status/published`
- PATCH `/api/admin/products/:id/status/draft`

### Admin categories

- GET `/api/admin/categories`
- POST `/api/admin/categories`
- PUT `/api/admin/categories/:id`
- DELETE `/api/admin/categories/:id`

### Analytics

- POST `/api/analytics/visit`
- POST `/api/analytics/product-view`
- GET `/api/admin/analytics`
- GET `/api/admin/analytics/products`
- GET `/api/admin/analytics/categories`
- GET `/api/admin/analytics/sources`
- GET `/api/admin/analytics/stores`

### Affiliate redirect

- GET `/go/:productId`

The redirect route intentionally sits outside `/api` so a product's public Shop button is a clean redirect URL.

## 6. Authentication flow

### User

```text
Register/Login
   ↓
bcrypt compare/hash
   ↓
JWT signed
   ↓
HTTP-only user_token cookie
   ↓
Wishlist endpoints verify cookie
```

### Admin

```text
Admin seed → MongoDB Admin document
   ↓
/admin/login
   ↓
bcrypt compare
   ↓
JWT with type=admin
   ↓
HTTP-only admin_token cookie
   ↓
AdminGuard + requireAdmin middleware
```

The two token cookies and authorization paths are logically separate.

## 7. Core product flow

```text
Admin adds product
   ↓
Multiple images → Cloudinary
   ↓
Image URLs + product metadata → MongoDB
   ↓
Unique slug generated
   ↓
Public URL shown to admin
   ↓
Social media uses that exact URL
   ↓
User opens published product
   ↓
PRODUCT_VIEW event
   ↓
Shop button → /go/:productId
   ↓
AFFILIATE_CLICK event
   ↓
302 redirect to stored exact affiliate URL
```

## 8. Draft privacy

Draft products are returned only to authenticated admin APIs. Public queries always use `status=published`. Draft preview uses `/admin/preview/:id`, which is protected by the admin guard and admin API.

## 9. Pages

### Public

- `/`
- `/products`
- `/products/:slug`
- `/fashion/:categorySlug/:slug`
- `/category/:slug`
- `/search`
- `/login`
- `/register`
- `/wishlist`
- `/account`
- `/about`
- `/contact`
- `/privacy-policy`
- `/terms`
- `/affiliate-disclosure`

### Admin

- `/admin/login`
- `/admin/dashboard`
- `/admin/products`
- `/admin/products/add`
- `/admin/products/edit/:id`
- `/admin/categories`
- `/admin/analytics`
- `/admin/preview/:id`

## 10. Development phases

### Phase 1 — foundation

Project setup, routing, Tailwind, Express, MongoDB connection, environment variables, reusable layouts/components.

### Phase 2 — admin security & catalogue

Admin seed, admin login, protected APIs, categories, product CRUD, multiple-image upload, drafts/publishing.

### Phase 3 — public discovery

Home, categories, product grid, search, filters, sorting, product details, SEO metadata, exact social product links.

### Phase 4 — user account & wishlist

Register, login, logout, wishlist toggle/remove, anonymous wishlist messaging.

### Phase 5 — analytics & affiliate redirect

Visitor/session events, product views, affiliate clicks, sources, store breakdown, dashboard metrics and charts, `/go/:productId` redirect.

### Phase 6 — hardening

Validation, rate limiting, error handling, responsive QA, accessibility, README, seed data, sitemap/robots, production environment review.

## 11. Deliberate non-features

No shopping cart, payments, orders, reviews, comparison engine, price tracking, AI images, social API posting, notifications, multiple admins/roles, or recommendation engine in this MVP.
