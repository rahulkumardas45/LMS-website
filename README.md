# 📚 LMS Website – MERN Stack Learning Management System

A **full-stack Learning Management System (LMS)** built using the **MERN Stack** that allows users to browse, purchase, and learn courses online.  
It includes **secure authentication**, **Razorpay payment integration**, and a powerful **Admin Panel** to manage courses, users, and sales.

🔗 **Live Demo (Frontend)**:  
👉 https://lms-website-frontend.vercel.app/

---

## 🚀 Features

### 👨‍🎓 User Features
- User authentication (Signup / Login)
- Browse available courses
- Purchase courses using **Razorpay**
- Access enrolled courses
- Responsive & modern UI

### 🧑‍💼 Admin Panel
- Admin authentication
- Create, update & delete courses
- Upload course details
- Manage users
- Track sales & payments

### 💳 Payments
- Razorpay payment gateway integration
- Secure checkout flow
- Payment verification on backend

---

## 🛠️ Tech Stack

### Frontend
- React.js
- JavaScript (ES6+)
- HTML5, CSS3
- Axios
- React Router

### Backend
- Node.js
- Express.js
- MongoDB (Mongoose)
- JWT Authentication
- Razorpay API

### Deployment
- Frontend: **Vercel**
- Backend: **Render / Railway**
- Database: **MongoDB Atlas**

---

```md
## 📁 Project Structure

```bash
LMS-Website/
│
├── client/                 # Frontend (React)
│   ├── public/             # Static files
│   └── src/
│       ├── components/     # Reusable UI components
│       ├── pages/          # Pages (Home, Login, Courses, Admin)
│       ├── services/       # API calls & Axios setup
│       ├── context/        # Global state management
│       ├── App.js          # Main React component
│       └── index.js        # React entry point
│
├── server/                 # Backend (Node.js + Express)
│   ├── controllers/        # Business logic
│   ├── models/             # MongoDB schemas
│   ├── routes/             # API routes
│   ├── middleware/         # Auth & error handling
│   ├── config/             # DB & env configuration
│   ├── utils/              # Helper functions
│   └── server.js           # Server entry point
│
├── .gitignore              # Git ignored files
└── README.md               # Project documentation
---

## ⚙️ Environment Variables

### Backend (`server/.env`)
PORT=5000
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret
RAZORPAY_KEY_ID=your_key_id
RAZORPAY_KEY_SECRET=your_key_secret


### Frontend (`client/.env`)
REACT_APP_API_URL=http://localhost:5000
REACT_APP_RAZORPAY_KEY=your_key_id


---


## 🧑‍💻 Installation & Setup

### 1️⃣ Clone the Repository
```bash
git clone https://github.com/your-username/lms-website.git
cd lms-website
