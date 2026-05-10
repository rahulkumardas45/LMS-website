# 📚 LMS Website – MERN Stack Learning Management System

A **full-stack Learning Management System (LMS)** built using the **MERN Stack** that allows users to browse, purchase, and learn courses online with **secure authentication**, **Stripe payment integration**, and a powerful **Admin Panel** for educators to manage courses and track student progress.

🔗 **Live Demo (Frontend)**: https://lms-website-frontend.vercel.app/

---

## 🚀 Features Overview

### 👨‍🎓 **Student Features**
- ✅ User registration and secure authentication (Clerk)
- ✅ Browse and discover available courses
- ✅ Detailed course previews with sample lectures
- ✅ Purchase courses using **Stripe payment gateway**
- ✅ Access enrolled courses and track progress
- ✅ Watch lectures in interactive video player
- ✅ Mark lectures as complete
- ✅ Rate and review courses
- ✅ Responsive and modern UI

### 🧑‍💼 **Educator/Admin Panel**
- ✅ Educator authentication and role management
- ✅ Create, update, and delete courses
- ✅ Organize courses into chapters and lectures
- ✅ Upload course content with media files
- ✅ Set course pricing and discounts
- ✅ View student enrollments
- ✅ Track earnings and sales analytics
- ✅ Manage course publications
- ✅ View course ratings and reviews

### 💳 **Payment & Security**
- ✅ Stripe payment gateway integration
- ✅ Secure checkout flow with webhooks
- ✅ Payment verification on backend
- ✅ JWT-based authentication
- ✅ Role-based access control (RBAC)
- ✅ Clerk authentication service

---

## 🛠️ **Tech Stack**

### **Frontend**
| Technology | Purpose |
|-----------|----------|
| **React.js** | UI library and component-based architecture |
| **Vite** | Fast build tool and dev server |
| **JavaScript (ES6+)** | Modern JavaScript features |
| **Axios** | HTTP client for API requests |
| **React Router v6** | Client-side routing |
| **Clerk** | Authentication and user management |
| **React YouTube** | YouTube video embedding |
| **React Toastify** | Toast notifications |
| **Quill Editor** | Rich text editor for course descriptions |
| **TailwindCSS** | Utility-first CSS framework |
| **humanize-duration** | Format duration in readable format |

### **Backend**
| Technology | Purpose |
|-----------|----------|
| **Node.js** | JavaScript runtime |
| **Express.js** | Web framework |
| **MongoDB** | NoSQL database |
| **Mongoose** | MongoDB object modeling |
| **Clerk** | Authentication & authorization |
| **Stripe API** | Payment processing |
| **Cloudinary** | Cloud image storage |
| **Multer** | File upload middleware |
| **JWT** | Token-based authentication |
| **CORS** | Cross-origin resource sharing |
| **dotenv** | Environment variable management |

### **Deployment**
| Service | Component |
|---------|----------|
| **Vercel** | Frontend hosting |
| **Render/Railway** | Backend hosting |
| **MongoDB Atlas** | Cloud database |
| **Cloudinary** | Image CDN |
| **Stripe** | Payment processing |

---

## 📁 **Project Structure**

```
LMS-Website/
│
├── client/                           # Frontend (React + Vite)
│   ├── public/                       # Static assets
│   ├── src/
│   │   ├── assets/                   # Images, SVGs, icons
│   │   ├── components/
│   │   │   ├── student/              # Student UI components
│   │   │   │   ├── Navbar.jsx        # Navigation bar
│   │   │   │   ├── CourseCard.jsx    # Course card component
│   │   │   │   ├── Footer.jsx        # Footer component
│   │   │   │   └── ...
│   │   │   └── educator/             # Educator UI components
│   │   ├── pages/
│   │   │   ├── student/              # Student pages
│   │   │   │   ├── Home.jsx          # Landing page
│   │   │   │   ├── CourseList.jsx    # Course listing
│   │   │   │   ├── CourseDetail.jsx  # Course details
│   │   │   │   ├── MyEnrollments.jsx # Enrolled courses
│   │   │   │   └── Player.jsx        # Video player
│   │   │   └── educator/             # Educator pages
│   │   │       ├── Educator.jsx      # Educator dashboard
│   │   │       ├── AddCourse.jsx     # Add new course
│   │   │       ├── MyCourses.jsx     # View courses
│   │   │       └── StudentEnrolled.jsx
│   │   ├── context/
│   │   │   └── AppContext.jsx        # Global state management
│   │   ├── services/
│   │   │   └── api.js                # Axios API client
│   │   ├── App.jsx                   # Main App component
│   │   ├── main.jsx                  # React entry point
│   │   └── index.css                 # Global styles
│   ├── .env.example                  # Environment variables template
│   ├── package.json
│   └── vite.config.js
│
├── server/                           # Backend (Node.js + Express)
│   ├── controllers/
│   │   ├── educatorController.js     # Educator business logic
│   │   ├── courseController.js       # Course management logic
│   │   ├── userController.js         # User management logic
│   │   ├── Webhooks.js               # Stripe & Clerk webhooks
│   │   └── authController.js         # Authentication logic
│   ├── models/
│   │   ├── User.js                   # User schema
│   │   ├── Course.js                 # Course schema
│   │   ├── CourseProgress.js         # Progress tracking
│   │   ├── Purchase.js               # Purchase records
│   │   └── ...
│   ├── routes/
│   │   ├── educatorRoutes.js         # Educator endpoints
│   │   ├── courseRoutes.js           # Course endpoints
│   │   ├── userRoutes.js             # User endpoints
│   │   └── authRoutes.js             # Auth endpoints
│   ├── middleware/
│   │   ├── auth.js                   # Authentication middleware
│   │   ├── errorHandler.js           # Error handling
│   │   └── validation.js             # Input validation
│   ├── configs/
│   │   ├── mongodb.js                # MongoDB connection
│   │   ├── cloudinary.js             # Cloudinary config
│   │   └── stripe.js                 # Stripe config
│   ├── utils/
│   │   ├── helpers.js                # Utility functions
│   │   └── validators.js             # Validation utilities
│   ├── server.js                     # Server entry point
│   ├── .env.example                  # Environment variables template
│   └── package.json
│
├── docs/                             # Documentation
│   ├── API.md                        # API endpoints documentation
│   ├── ARCHITECTURE.md               # System architecture
│   └── CONTRIBUTING.md               # Contributing guidelines
│
├── .gitignore
├── README.md                         # Main documentation
└── LICENSE
```

---

## ⚙️ **Environment Variables Setup**

### **Backend (`server/.env`)**

```env
# Server Configuration
PORT=5000
NODE_ENV=development

# Database
MONGO_URI=mongodb+srv://username:password@cluster.mongodb.net/lms-database

# Authentication (Clerk)
CLERK_SECRET_KEY=your_clerk_secret_key_here
CLERK_WEBHOOK_SECRET=your_webhook_secret_here

# Payment Gateway (Stripe)
STRIPE_SECRET_KEY=sk_test_your_stripe_secret_key
STRIPE_WEBHOOK_SECRET=whsec_your_webhook_secret

# Cloud Storage (Cloudinary)
CLOUDINARY_NAME=your_cloudinary_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_SECRET_KEY=your_secret_key

# JWT Configuration
JWT_SECRET=your_jwt_secret_key_for_tokens
JWT_EXPIRE=7d

# Email Configuration (Optional)
EMAIL_SERVICE=gmail
EMAIL_USER=your_email@gmail.com
EMAIL_PASSWORD=your_app_password
```

### **Frontend (`client/.env`)**

```env
# API Configuration
VITE_BACKEND_URL=http://localhost:5000
VITE_API_TIMEOUT=10000

# Authentication (Clerk)
VITE_CLERK_PUBLISHABLE_KEY=pk_test_your_clerk_publishable_key

# Payment Gateway (Stripe)
VITE_STRIPE_PUBLIC_KEY=pk_test_your_stripe_public_key

# Currency
VITE_CURRENCY=USD
```

---

## 🧑‍💻 **Installation & Setup**

### **Prerequisites**
- Node.js (v16 or higher)
- npm or yarn
- MongoDB Atlas account (free tier available)
- Stripe account (free to create)
- Clerk account (free tier available)
- Cloudinary account (free tier available)

### **1️⃣ Clone the Repository**

```bash
git clone https://github.com/rahulkumardas45/LMS-website.git
cd LMS-website
```

### **2️⃣ Backend Setup**

```bash
# Navigate to server directory
cd server

# Install dependencies
npm install

# Create .env file with your credentials
cp .env.example .env
# Edit .env with your actual values

# Start the backend server
npm run dev
# Server will run on http://localhost:5000
```

### **3️⃣ Frontend Setup**

```bash
# Navigate to client directory (in a new terminal)
cd client

# Install dependencies
npm install

# Create .env file
cp .env.example .env
# Edit .env with your backend URL and API keys

# Start the development server
npm run dev
# Frontend will run on http://localhost:5173
```

---

## 📡 **API Endpoints Overview**

For detailed API documentation, see [docs/API.md](./docs/API.md)

### **Course Endpoints**
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/course/all` | Get all published courses |
| GET | `/api/course/:id` | Get course details by ID |

### **Educator Endpoints**
| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/educator/update-role` | Update user role to educator |
| POST | `/api/educator/add-course` | Create new course |
| GET | `/api/educator/educator-course` | Get educator's courses |
| PUT | `/api/educator/update-course` | Update course |
| DELETE | `/api/educator/delete-course` | Delete course |

### **User Endpoints**
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/user/data` | Get user profile |
| GET | `/api/user/enrolled-courses` | Get enrolled courses |
| POST | `/api/user/purchase` | Purchase a course |
| POST | `/api/user/update-course-progress` | Mark lecture complete |
| POST | `/api/user/get-course-progress` | Get course progress |
| POST | `/api/user/add-rating` | Add course rating |

---

## 🚀 **Deployment Guide**

### **Deploy Frontend to Vercel**

```bash
# Install Vercel CLI
npm i -g vercel

# Navigate to client directory
cd client

# Deploy
vercel

# Add environment variables in Vercel dashboard
# VITE_BACKEND_URL, VITE_CLERK_PUBLISHABLE_KEY, etc.
```

### **Deploy Backend to Render**

1. Push code to GitHub
2. Go to [Render.com](https://render.com)
3. Create new Web Service
4. Connect GitHub repository
5. Set environment variables
6. Deploy

### **Deploy Backend to Railway**

1. Go to [Railway.app](https://railway.app)
2. Connect GitHub account
3. Create new project
4. Select LMS-website repository
5. Add environment variables
6. Deploy

---

## 🧪 **Testing the Application**

### **Manual Testing Checklist**
- [ ] User registration and login
- [ ] Course browsing and filtering
- [ ] Course purchase flow
- [ ] Payment verification
- [ ] Accessing enrolled courses
- [ ] Playing videos and marking complete
- [ ] Educator course creation
- [ ] Rating and reviewing courses

### **API Testing with Postman**

1. Import the API collection from `docs/API.md`
2. Set Postman variables:
   - `base_url`: http://localhost:5000
   - `token`: JWT token from login
3. Test each endpoint

---

## 🐛 **Troubleshooting**

### **Backend Connection Issues**

**Problem**: `Cannot connect to MongoDB`
```bash
# Solution: Check MongoDB URI
- Verify MongoDB Atlas connection string
- Ensure IP whitelist includes your IP
- Check MONGO_URI in .env file
```

**Problem**: `CORS Error`
```bash
# Solution: Update CORS in server.js
app.use(cors({
  origin: 'http://localhost:5173',
  credentials: true
}))
```

### **Frontend Issues**

**Problem**: `Blank page or 404 errors`
```bash
# Solution: 
- Clear browser cache (Ctrl+Shift+Delete)
- Restart dev server (npm run dev)
- Check VITE_BACKEND_URL in .env
```

**Problem**: `API calls failing`
```bash
# Solution:
- Verify backend is running on PORT 5000
- Check VITE_BACKEND_URL matches backend URL
- Look at browser console for error details
```

### **Payment Issues**

**Problem**: `Stripe webhook not firing`
```bash
# Solution:
- Use Stripe CLI for local testing
- Verify STRIPE_WEBHOOK_SECRET in .env
- Check webhook endpoint in Stripe dashboard
```

### **Authentication Issues**

**Problem**: `Clerk authentication not working`
```bash
# Solution:
- Verify CLERK_PUBLISHABLE_KEY and CLERK_SECRET_KEY
- Check Clerk app settings
- Ensure Clerk is configured in both frontend and backend
```

---

## 📚 **Documentation Files**

- **[docs/API.md](./docs/API.md)** - Complete API documentation with examples
- **[docs/ARCHITECTURE.md](./docs/ARCHITECTURE.md)** - System architecture and database design
- **[docs/CONTRIBUTING.md](./docs/CONTRIBUTING.md)** - Contributing guidelines and code standards

---

## 🤝 **Contributing**

We welcome contributions! Please see [CONTRIBUTING.md](./docs/CONTRIBUTING.md) for guidelines on:
- Code standards
- Commit conventions
- Pull request process
- Bug reports
- Feature requests

---

## 📝 **License**

This project is licensed under the MIT License - see LICENSE file for details.

---

## 💡 **Support & Questions**

- 📧 Email: support@lmswebsite.com
- 🐛 Report bugs: [GitHub Issues](https://github.com/rahulkumardas45/LMS-website/issues)
- 💬 Discussions: [GitHub Discussions](https://github.com/rahulkumardas45/LMS-website/discussions)

---

## 🎯 **Roadmap**

- [ ] Live classes feature
- [ ] Course certificates
- [ ] Advanced analytics dashboard
- [ ] Mobile app (React Native)
- [ ] AI-powered course recommendations
- [ ] Community forum
- [ ] Live chat support
- [ ] Course presets and templates

---

**Made with ❤️ by Rahul Kumar Das**
