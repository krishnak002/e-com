# ShopKart — Full-Stack E-commerce Application

ShopKart is a full-stack e-commerce application built with React, Express and MongoDB. It includes customer authentication, product browsing, a detailed product view, cart and checkout, order tracking, product reviews and a responsive admin dashboard.

## Features

### Customer storefront

- Register and login with JWT authentication
- Browse, search, filter and sort products
- Browse products by category
- Open a complete product detail view
- View pricing, discounts, stock, description and ratings
- Add products to cart only after login
- Update quantity or remove products from the cart
- Add products to a wishlist
- Add ratings and written product reviews
- Responsive layout for desktop, tablet and mobile

### Checkout and orders

- Secure checkout form
- Customer name and phone number
- Complete delivery address and pincode
- Cash on Delivery, UPI and Card payment options
- Payment transaction reference support
- Order and payment status tracking
- Sensitive card information is never stored

### Professional admin dashboard

- Revenue, order, product, customer and stock statistics
- View complete customer and delivery information
- View and manage every customer order
- Update fulfilment status:
  - Placed
  - Confirmed
  - Packed
  - Shipped
  - Delivered
  - Cancelled
- Update payment status:
  - Pending
  - Paid
  - Failed
  - Refunded
- Create, update and delete products
- Manage product title, category, price, MRP, image, description, badge and stock
- Category management interface
- Low-stock indicators and inventory overview

## Technology stack

### Frontend

- React 19
- Vite
- Axios
- CSS3
- ESLint

### Backend

- Node.js
- Express 5
- MongoDB and Mongoose
- JSON Web Tokens
- bcrypt password hashing
- Express Validator
- CORS

## Project structure

```text
Day-5-EMS/
├── client/
│   ├── public/
│   └── src/
│       ├── api/
│       ├── components/
│       ├── data/
│       ├── pages/
│       ├── App.jsx
│       ├── admin.css
│       └── styles.css
├── server/
│   ├── configs/
│   ├── controllers/
│   ├── middlewares/
│   ├── models/
│   ├── routers/
│   ├── services/
│   └── index.js
├── package.json
└── README.md
```

## Requirements

Install the following before running the application:

- Node.js 18 or newer
- npm
- MongoDB Community Server or a MongoDB Atlas database

## Installation

Clone or download the project and open its root directory.

Install frontend dependencies:

```bash
cd client
npm install
```

Install backend dependencies:

```bash
cd ../server
npm install
```

## Environment variables

Create a `.env` file inside the `server` directory:

```env
MONGODB_URL=mongodb://127.0.0.1:27017/shopkart
JWT_SECRET=replace_with_a_long_random_secret
```

Do not commit the real `.env` file or expose `JWT_SECRET` publicly.

## Running the application

Open two terminals from the project root.

Start the backend server:

```bash
npm run server
```

The API runs at:

```text
http://localhost:3000
```

Start the frontend development server:

```bash
npm run client
```

Open the local URL printed by Vite, normally:

```text
http://localhost:5173
```

## Available commands

Run these commands from the project root:

| Command | Description |
| --- | --- |
| `npm run client` | Start the Vite frontend |
| `npm run server` | Start the backend in watch mode |
| `npm start` | Start the backend normally |
| `npm run client:lint` | Check frontend code with ESLint |
| `npm run client:build` | Create a production frontend build |

## Creating an admin user

New registrations receive the `user` role by default. To create an administrator:

1. Register a normal account from the website.
2. Open MongoDB Compass or MongoDB Shell.
3. Find the account in the `users` collection.
4. Change its role from `user` to `admin`.

Example MongoDB command:

```javascript
db.users.updateOne(
  { email: "admin@example.com" },
  { $set: { role: "admin" } }
)
```

Log out and log in again after changing the role so a new admin JWT is issued.

## API endpoints

The API base URL is `http://localhost:3000/api`.

### Authentication and users

| Method | Endpoint | Access | Description |
| --- | --- | --- | --- |
| POST | `/user/register` | Public | Register a customer |
| POST | `/user/login` | Public | Login and receive a JWT |
| GET | `/user/me` | Authenticated | Get the current user |
| GET | `/user/get-all-user` | Admin | List users |
| PATCH | `/user/update-user/:id` | Admin | Update a user |
| DELETE | `/user/delete-user/:id` | Admin | Delete a user |

### Products and reviews

| Method | Endpoint | Access | Description |
| --- | --- | --- | --- |
| GET | `/products` | Public | List all products |
| POST | `/products` | Admin | Create a product |
| PATCH | `/products/:id` | Admin | Update a product |
| DELETE | `/products/:id` | Admin | Delete a product |
| POST | `/products/:id/reviews` | Authenticated | Add a product review |

### Orders

| Method | Endpoint | Access | Description |
| --- | --- | --- | --- |
| POST | `/orders` | Authenticated | Place an order |
| GET | `/orders/mine` | Authenticated | Get current customer's orders |
| GET | `/orders` | Admin | List all orders |
| PATCH | `/orders/:id` | Admin | Update order or payment status |

For protected endpoints, send the JWT in the request header:

```http
Authorization: Bearer YOUR_JWT_TOKEN
```

## Main database models

- `User`: name, email, hashed password and role
- `Product`: catalogue information, pricing, inventory, description and reviews
- `Order`: customer, delivery address, order items, total, payment and fulfilment status

## Production build

Create an optimized frontend build:

```bash
npm run client:build
```

The generated application will be available inside `client/dist`.

## Security notes

- Passwords are hashed with bcrypt.
- Protected routes require a valid JWT.
- Admin routes require the `admin` role.
- Card numbers, CVV and other sensitive card information are not stored.
- Use a strong and private `JWT_SECRET` in production.
- Configure production CORS origins before deploying publicly.

## Future improvements

- Connect Razorpay or Stripe for real online payments
- Add image upload with Cloudinary or S3
- Add customer order-history UI
- Persist categories in their own database collection
- Add coupons, shipping charges and tax rules
- Add email and SMS order notifications
- Add pagination and advanced analytics

## License

This project is intended for learning and portfolio use.
