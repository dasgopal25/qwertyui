# 🌟 Wish Creator Website

A full-stack MERN application for creating beautiful personalised wish websites.

## ✨ Features
- 12 wish categories (Birthday, Anniversary, Valentine's Day, etc.)
- 7–11 animated templates per category
- Photo upload, custom/default messages (EN/HI/BN)
- Color theme customisation
- ₹49 payment via UPI QR code
- Admin panel: verify payments, activate/deactivate links
- 24-hour auto-expiry via node-cron

## 🚀 Quick Start

### 1. Clone and install
```bash
git clone <repo>
cd wish-creator
npm run install-all
```

### 2. Configure environment
```bash
cd server
cp .env.example .env
# Edit .env with your MongoDB URI, Cloudinary keys, JWT secret
```

### 3. Create admin account
```bash
# Start the server first, then:
curl -X POST http://localhost:5000/api/auth/setup \
  -H "Content-Type: application/json" \
  -d '{"username":"admin","password":"your_password"}'
```

### 4. Run in development
```bash
cd ..          # back to root
npm run dev    # starts both client (5173) and server (5000)
```

## 📁 Project Structure
```
wish-creator/
├── client/          # React + Vite frontend
│   └── src/
│       ├── pages/   # Home, TemplatePicker, WishForm, PaymentPage, WishPage, Admin
│       ├── components/
│       ├── context/ # WishContext, AuthContext
│       ├── api/     # axios, wishApi, adminApi
│       └── utils/   # i18n, colorThemes, whatsapp
└── server/          # Express + MongoDB backend
    ├── models/      # Submission, Template, Admin, Settings
    ├── routes/
    ├── controllers/
    ├── middleware/
    └── utils/
```

## 🔑 Admin Panel
URL: `http://localhost:5173/admin`

Actions:
- View all submissions
- Verify payment screenshots
- Activate/deactivate wish links
- Update QR code, pricing, WhatsApp number

## 🌐 Wish Page URL Format
```
https://yourdomain.com/w/{8-char-slug}
```

## 💳 Payment Flow
1. User fills form → submits
2. Redirected to payment page with QR code
3. User pays ₹49, uploads screenshot OR sends on WhatsApp
4. Admin verifies → activates link
5. User receives link (valid 24 hours)

## 🛠 Tech Stack
- **Frontend**: React 18, Vite, React Router v6, Framer Motion, React Hot Toast
- **Backend**: Node.js, Express.js, Mongoose
- **Database**: MongoDB Atlas
- **Storage**: Cloudinary (photos + payment screenshots)
- **Auth**: JWT + bcrypt
- **Scheduler**: node-cron (auto-expire links)
# asdfghj
