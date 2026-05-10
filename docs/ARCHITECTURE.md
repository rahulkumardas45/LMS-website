# 🏗️ System Architecture

Detailed overview of the LMS Website architecture, data models, authentication flow, and component structure.

---

## 📊 System Architecture Diagram

```
┌─────────────────────────────────────────────────────────────────┐
│                        CLIENT (React + Vite)                    │
├─────────────────────────────────────────────────────────────────┤
│  Pages: Home, CourseList, CourseDetail, Player, MyEnrollments  │
│  Components: Navbar, CourseCard, Footer, Rating                 │
│  Context: AppContext (Global State Management)                  │
│  Services: Axios API Client, Clerk Auth                         │
└───────────────────────────┬──────────────────────────────────────┘
                            │
                   HTTP/HTTPS (REST API)
                            │
┌───────────────────────────▼──────────────────────────────────────┐
│                  SERVER (Node.js + Express)                      │
├─────────────────────────────────────────────────────────────────┤
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐           │
│  │   Routes     │  │ Controllers  │  │   Models     │           │
│  │              │  │              │  │              │           │
│  │ /educator    │→ │ educator     │→ │ User         │           │
│  │ /course      │  │ course       │  │ Course       │           │
│  │ /user        │  │ user         │  │ Purchase     │           │
│  │ /webhook     │  │ webhooks     │  │ Progress     │           │
│  └──────────────┘  └──────────────┘  └──────────────┘           │
│                            │                                     │
│         ┌──────────────────┼──────────────────┐                  │
│         │                  │                  │                  │
│    ┌────▼────┐        ┌───▼────┐       ┌────▼─────┐            │
│    │ Middleware       │ Database │      │ External  │           │
│    │                  │          │      │ Services  │           │
│    │ • Auth (Clerk)   │MongoDB  │      │           │           │
│    │ • Error Handler  │ Atlas   │      │ Stripe    │           │
│    │ • Validation     │          │      │ Cloudinary│           │
│    │ • CORS           │         │      │ Clerk     │           │
│    └────────────────┘ └────────┘      └───────────┘           │
└─────────────────────────────────────────────────────────────────┘
```

---

## 📦 Database Schema

### User Schema

```javascript
{
  _id: String,              // Clerk user ID
  name: String,             // User full name
  email: String,            // User email
  imageUrl: String,         // Profile picture URL
  enrolledCourses: [         // Array of course IDs
    ObjectId (Course ref)
  ],
  timestamps: true           // createdAt, updatedAt
}
```

**Indexes**:
- `_id` (Primary key)
- `email` (Unique)

---

### Course Schema

```javascript
{
  _id: ObjectId,
  courseTitle: String,       // Course name
  courseDescription: String, // HTML content
  courseThumbnail: String,   // Image URL
  coursePrice: Number,       // Price in cents
  discount: Number,          // 0-100 percentage
  isPublished: Boolean,      // Published status
  
  // Course content structure
  courseContent: [
    {
      chapterId: String,
      chapterOrder: Number,
      chapterTitle: String,
      chapterContent: [
        {
          lectureId: String,
          lectureTitle: String,
          lectureDuration: Number,  // in minutes
          lectureUrl: String,       // YouTube URL
          isPreviewFree: Boolean,   // Sample lecture
          lectureOrder: Number
        }
      ]
    }
  ],
  
  // Ratings and reviews
  courseRatings: [
    {
      userId: String,  // Clerk user ID
      rating: Number   // 1-5 stars
    }
  ],
  
  // Educator info
  educator: String,          // Clerk user ID
  educatorName: String,      // Denormalized name
  
  // Student tracking
  enrolledStudents: [String], // Array of user IDs
  
  timestamps: true           // createdAt, updatedAt
}
```

**Indexes**:
- `_id` (Primary key)
- `educator` (For educator queries)
- `isPublished` (For course listing)

---

### CourseProgress Schema

```javascript
{
  _id: ObjectId,
  userId: String,            // Clerk user ID
  courseId: String,          // Course ID
  completed: Boolean,        // Course completion status
  lectureCompleted: [        // Array of lecture IDs
    String
  ],
  timestamps: true
}
```

**Indexes**:
- `userId` + `courseId` (Composite, unique)

---

### Purchase Schema (Optional, for payment tracking)

```javascript
{
  _id: ObjectId,
  userId: String,            // Clerk user ID
  courseId: ObjectId,        // Course ID
  amount: Number,            // Amount paid in cents
  stripeSessionId: String,   // Stripe session ID
  status: String,            // 'pending', 'completed', 'failed'
  paymentDate: Date,
  timestamps: true
}
```

---

## 🔐 Authentication Flow

### User Authentication

```
┌──────────────┐
│   Frontend   │
│   (React)    │
└──────┬───────┘
       │
       │ 1. User clicks "Sign Up/Login"
       ▼
┌──────────────┐
│    Clerk     │  ← Handles all authentication
│   (Auth      │    - Sign up form
│   Service)   │    - Email verification
└──────┬───────┘    - OAuth (Google, GitHub)
       │
       │ 2. User authenticated
       │    JWT token issued
       ▼
┌──────────────┐
│   Frontend   │
│   Stores     │  ← Token in localStorage
│   JWT Token  │
└──────┬───────┘
       │
       │ 3. API request with token
       │    Headers: { Authorization: Bearer <token> }
       ▼
┌──────────────┐
│   Backend    │
│   Verifies   │  ← @clerk/express middleware
│   Token      │    Validates token signature
└──────┬───────┘
       │
       │ 4. Token valid?
       ├─ YES → Grant access
       └─ NO  → Return 401 Unauthorized
```

### Educator Role Assignment

```
┌─────────────────────────┐
│ User clicks             │
│ "Become Educator"       │
└────────────┬────────────┘
             │
             ▼
┌─────────────────────────┐
│ POST /api/educator/     │
│ update-role             │
│ (with JWT token)        │
└────────────┬────────────┘
             │
             ▼
┌─────────────────────────┐
│ Backend updates         │
│ Clerk publicMetadata    │
│ role: 'educator'        │
└────────────┬────────────┘
             │
             ▼
┌─────────────────────────┐
│ Frontend checks         │
│ user.publicMetadata     │
│ Shows educator panel    │
└─────────────────────────┘
```

---

## 💳 Payment Flow (Stripe)

```
┌──────────────┐
│   Frontend   │
│   Student    │
└──────┬───────┘
       │
       │ 1. Click "Enroll"
       │    POST /api/user/purchase
       │    Body: { courseId }
       ▼
┌──────────────┐
│   Backend    │
│   Create     │  ← Creates Stripe
│   Checkout   │    checkout session
└──────┬───────┘
       │
       │ 2. Return session_url
       ▼
┌──────────────┐
│   Frontend   │
│   Redirect   │
│   to Stripe  │
└──────┬───────┘
       │
       │ 3. User enters payment details
       ▼
┌──────────────┐
│   Stripe     │  ← Processes payment
│   Payment    │    Validates card
│   Gateway    │    Charges account
└──────┬───────┘
       │
       │ 4. Payment success
       │    Calls webhook
       ▼
┌──────────────┐
│   Backend    │
│   Webhook    │  ← POST /stripe
│   Handler    │    Event: checkout.session.completed
└──────┬───────┘
       │
       │ 5. Enroll user
       │    - Add courseId to
       │      user.enrolledCourses
       │    - Add userId to
       │      course.enrolledStudents
       ▼
┌──────────────┐
│   Frontend   │
│   Redirect   │  ← Redirect to
│   Success    │    /my-enrollments
└──────────────┘
```

---

## 🎯 Component Hierarchy

### Frontend Component Tree

```
App (src/App.jsx)
├── Navbar (Conditional)
│   ├── Logo
│   ├── Search
│   └── User Menu
│
├── Routes
│   ├── Student Routes
│   │   ├── Home
│   │   │   └── Hero Section
│   │   │   └── Featured Courses
│   │   │   └── Statistics
│   │   ├── CourseList
│   │   │   ├── Filter Panel
│   │   │   └── CourseCard (repeated)
│   │   ├── CourseDetail
│   │   │   ├── Course Header
│   │   │   ├── Course Content
│   │   │   ├── Reviews/Ratings
│   │   │   └── Enroll Button
│   │   ├── MyEnrollments
│   │   │   └── CourseCard (for enrolled courses)
│   │   └── Player
│   │       ├── Video Player
│   │       ├── Lecture List
│   │       ├── Progress Tracker
│   │       └── Rating Component
│   │
│   └── Educator Routes
│       ├── Educator (Outlet)
│       │   ├── Dashboard
│       │   ├── AddCourse
│       │   │   ├── Form
│       │   │   ├── Chapter/Lecture Editor
│       │   │   └── Image Uploader
│       │   ├── MyCourses
│       │   │   └── Course Table
│       │   └── StudentEnrolled
│       │       └── Student List
│
└── Footer
    ├── Links
    └── Social Media
```

---

## 🔄 State Management (Context API)

### AppContext Structure

```javascript
// src/context/AppContext.jsx

export const AppContext = {
  // State Variables
  backendUrl: String,           // API base URL
  currency: String,             // Currency symbol
  isEducator: Boolean,          // User is educator?
  allCourses: Array,            // All published courses
  enrolledCourses: Array,       // User's enrolled courses
  userData: Object,             // Current user data
  
  // Functions
  fetchAllCourses: Function,    // Fetch all courses
  fetchUserData: Function,      // Get user profile
  fetchUserEnrolledCourses: Function, // Get enrolled courses
  calculateRating: Function,    // Calculate avg rating
  calculateChapterTime: Function, // Get chapter duration
  calculateCourseDuration: Function, // Get course duration
  calculateTotalLecture: Function, // Count lectures
  getToken: Function,           // Get JWT from Clerk
}
```

**Benefits**:
- Avoid prop drilling
- Share data across components
- Centralized API calls
- Easy to debug

---

## 📡 API Request Flow

### Typical API Request Sequence

```javascript
// 1. Component needs data
const MyComponent = () => {
  const { backendUrl, getToken } = useContext(AppContext);
  
  // 2. useEffect fetches data
  useEffect(() => {
    fetchData();
  }, []);
  
  // 3. Get JWT token from Clerk
  const fetchData = async () => {
    const token = await getToken();
    
    // 4. Make API request with token
    const { data } = await axios.get(
      `${backendUrl}/api/endpoint`,
      {
        headers: {
          Authorization: `Bearer ${token}`
        }
      }
    );
    
    // 5. Update local state
    if (data.success) {
      setData(data.result);
    } else {
      toast.error(data.message);
    }
  };
}
```

---

## 🛡️ Security Architecture

### Authentication & Authorization

```
┌─────────────────────────────────────┐
│      Authentication Layer           │
├─────────────────────────────────────┤
│ 1. Clerk handles user registration  │
│ 2. JWT tokens issued by Clerk       │
│ 3. Backend verifies token signature │
│ 4. @clerk/express middleware        │
└─────────────────────────────────────┘

┌─────────────────────────────────────┐
│     Authorization Layer             │
├─────────────────────────────────────┤
│ 1. Role-based access control        │
│ 2. User role stored in Clerk        │
│ 3. Middleware checks permissions    │
│ 4. Resource ownership validation    │
└─────────────────────────────────────┘

┌─────────────────────────────────────┐
│      Data Protection                │
├─────────────────────────────────────┤
│ 1. Passwords never sent to backend  │
│ 2. HTTPS/TLS for all connections   │
│ 3. Sensitive data encrypted         │
│ 4. CORS enabled for frontend only  │
│ 5. Rate limiting on API endpoints   │
└─────────────────────────────────────┘
```

### Webhook Security

```javascript
// Stripe Webhook Verification
const stripeWebhooks = (req, res) => {
  const sig = req.headers['stripe-signature'];
  const event = stripe.webhooks.constructEvent(
    req.body,
    sig,
    STRIPE_WEBHOOK_SECRET  // Verify signature
  );
}

// Clerk Webhook Verification
const clerkWebhooks = (req, res) => {
  const event = req.body;
  // Clerk middleware verifies signature
};
```

---

## 📈 Scalability Considerations

### Current Architecture Limitations

| Component | Limitation | Solution |
|-----------|-----------|----------|
| Database | Single MongoDB instance | Use replica sets, sharding |
| Backend | Single server | Load balancing, auto-scaling |
| Images | Cloudinary | Already scalable |
| Storage | No video storage | Use S3 + CloudFront |
| Cache | No caching | Add Redis for sessions |

### Future Improvements

```
┌─────────────────────────────────────────┐
│    Load Balancer (Nginx/HAProxy)        │
└────────────────┬────────────────────────┘
                 │
     ┌───────────┼───────────┐
     ▼           ▼           ▼
┌────────┐  ┌────────┐  ┌────────┐
│Backend │  │Backend │  │Backend │
│Server 1│  │Server 2│  │Server 3│
└───┬────┘  └───┬────┘  └───┬────┘
    │           │           │
    └───────────┼───────────┘
                ▼
          ┌──────────────┐
          │  Redis Cache │
          └──────────────┘
                │
                ▼
    ┌──────────────────────┐
    │ MongoDB Cluster      │
    │ (Replica Set)        │
    └──────────────────────┘
```

---

## 🔄 Data Flow Diagram

### Course Creation Flow

```
┌─────────────────────┐
│  Educator clicks    │
│  "Create Course"    │
└──────────┬──────────┘
           │
           ▼
┌─────────────────────────────────────┐
│  AddCourse Component                │
│  - Course title input               │
│  - Description editor               │
│  - Chapter/Lecture builder          │
│  - Image upload                     │
└──────────┬──────────────────────────┘
           │
           │ FormData with:
           │ - courseData (JSON)
           │ - image file
           ▼
┌─────────────────────────────────────┐
│  POST /api/educator/add-course      │
└──────────┬──────────────────────────┘
           │
           ▼
┌─────────────────────────────────────┐
│  Backend: educatorController        │
│  1. Verify educator role            │
│  2. Upload image to Cloudinary      │
│  3. Get image URL                   │
└──────────┬──────────────────────────┘
           │
           ▼
┌─────────────────────────────────────┐
│  Create Course document in MongoDB  │
│  - Title, description               │
│  - Thumbnail URL                    │
│  - Content structure                │
│  - Educator ID                      │
└──────────┬──────────────────────────┘
           │
           ▼
┌─────────────────────────────────────┐
│  Return success response            │
└──────────┬──────────────────────────┘
           │
           ▼
┌─────────────────────────────────────┐
│  Frontend updates UI                │
│  - Show success message             │
│  - Redirect to MyCourses            │
│  - Display new course               │
└─────────────────────────────────────┘
```

---

## 📊 Database Relationships

```
┌─────────────────┐
│      User       │
├─────────────────┤
│ _id (Clerk)     │
│ name            │
│ email           │
│ imageUrl        │ 
│ enrolledCourses │───┐
│ (array)         │   │
└─────────────────┘   │ References
                      │
                      ▼
            ┌──────────────────┐
            │     Course       │
            ├──────────────────┤
            │ _id              │
            │ courseTitle      │
            │ educator (User)  │◄──┐
            │ enrolledStudents │   │ References
            │ (array of Users) │   │
            │ courseContent    │   │
            │ courseRatings    │   │
            └──────────────────┘   │
                      ▲             │
                      │─────────────┘

            ┌──────────────────────┐
            │  CourseProgress      │
            ├──────────────────────┤
            │ userId (User)        │
            │ courseId (Course)    │
            │ lectureCompleted     │
            │ completed            │
            └──────────────────────┘
```

---

## 🚀 Deployment Architecture

### Production Environment

```
                     Internet
                        │
         ┌──────────────┴──────────────┐
         │                             │
    ┌────▼────┐                  ┌────▼────┐
    │ Vercel  │                  │ Render/ │
    │(Frontend)                  │Railway  │
    │ React   │                  │(Backend)│
    │ Vite    │                  │Express  │
    └────┬────┘                  └────┬────┘
         │                            │
         │         HTTPS API          │
         └────────────────────────────┘
                      │
         ┌────────────┴─────────────┐
         │                          │
    ┌────▼──────┐           ┌──────▼────┐
    │ Cloudinary│           │ Stripe    │
    │(Images)   │           │(Payments) │
    └───────────┘           └──────────┘
         │                          │
    ┌────▼─────────────────────────▼───┐
    │  MongoDB Atlas (Database)         │
    │  - Cloud-hosted                   │
    │  - Replicated                     │
    │  - Backup enabled                 │
    └───────────────────────────────────┘
```

---

## 📝 Notes

- **Stateless Backend**: Each request is independent, enables scaling
- **Microservices Ready**: Easy to extract services (payments, storage, auth)
- **Database Normalization**: Denormalized some fields (educatorName) for performance
- **Webhook Driven**: Payment updates via webhooks, not polling
