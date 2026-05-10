# 📡 API Documentation

Complete API reference for LMS Website backend endpoints.

**Base URL**: `http://localhost:5000` (Development) or your deployed backend URL

**Authentication**: JWT token required for protected routes (pass in `Authorization: Bearer <token>` header)

---

## 📋 Table of Contents

1. [Authentication](#authentication)
2. [Course Endpoints](#course-endpoints)
3. [Educator Endpoints](#educator-endpoints)
4. [User Endpoints](#user-endpoints)
5. [Webhook Endpoints](#webhook-endpoints)
6. [Error Handling](#error-handling)
7. [Status Codes](#status-codes)

---

## 🔐 Authentication

### Overview

The API uses **JWT (JSON Web Tokens)** for authentication via **Clerk**. All protected endpoints require a valid JWT token.

### Getting a Token

1. User logs in through Clerk on frontend
2. Frontend receives JWT token from Clerk
3. Pass token in `Authorization` header for API requests

### Example Request with Auth

```bash
curl -X GET http://localhost:5000/api/user/data \
  -H "Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
```

### JavaScript (Axios) Example

```javascript
const token = await getToken(); // From Clerk
const { data } = await axios.get('http://localhost:5000/api/user/data', {
  headers: {
    Authorization: `Bearer ${token}`
  }
});
```

---

## 📚 Course Endpoints

### 1. Get All Published Courses

**Endpoint**: `GET /api/course/all`

**Authentication**: Not required

**Description**: Retrieves all published courses with basic information

**Response**:
```json
{
  "success": true,
  "courses": [
    {
      "_id": "675ac1512100b91a6d9b8b24",
      "courseTitle": "Web Development Basics",
      "courseDescription": "Learn HTML, CSS, and JavaScript",
      "courseThumbnail": "https://cloudinary.com/image.jpg",
      "coursePrice": 4999,
      "discount": 20,
      "educatorName": "John Doe",
      "courseRatings": [
        { "userId": "user123", "rating": 5 },
        { "userId": "user456", "rating": 4 }
      ],
      "enrolledStudents": ["user123", "user456"],
      "isPublished": true,
      "createdAt": "2025-01-15T10:30:00Z",
      "updatedAt": "2025-01-15T10:30:00Z"
    }
  ]
}
```

**cURL Example**:
```bash
curl -X GET http://localhost:5000/api/course/all
```

**JavaScript Example**:
```javascript
const { data } = await axios.get('http://localhost:5000/api/course/all');
console.log(data.courses);
```

---

### 2. Get Course by ID

**Endpoint**: `GET /api/course/:id`

**Authentication**: Not required

**Description**: Retrieves detailed course information including content structure

**Parameters**:
- `id` (URL param, required): Course ID

**Response**:
```json
{
  "success": true,
  "courseData": {
    "_id": "675ac1512100b91a6d9b8b24",
    "courseTitle": "Web Development Basics",
    "courseDescription": "Learn HTML, CSS, and JavaScript",
    "courseThumbnail": "https://cloudinary.com/image.jpg",
    "coursePrice": 4999,
    "discount": 20,
    "educator": "educator_id_123",
    "educatorName": "John Doe",
    "isPublished": true,
    "courseContent": [
      {
        "chapterId": "ch_1",
        "chapterTitle": "Getting Started",
        "chapterOrder": 1,
        "chapterContent": [
          {
            "lectureId": "lec_1",
            "lectureTitle": "What is Web Development?",
            "lectureDuration": 15,
            "lectureUrl": "https://youtube.com/watch?v=...",
            "isPreviewFree": true,
            "lectureOrder": 1
          }
        ]
      }
    ],
    "courseRatings": [
      { "userId": "user123", "rating": 5 }
    ],
    "enrolledStudents": ["user123"],
    "createdAt": "2025-01-15T10:30:00Z",
    "updatedAt": "2025-01-15T10:30:00Z"
  }
}
```

**cURL Example**:
```bash
curl -X GET http://localhost:5000/api/course/675ac1512100b91a6d9b8b24
```

**JavaScript Example**:
```javascript
const courseId = '675ac1512100b91a6d9b8b24';
const { data } = await axios.get(`http://localhost:5000/api/course/${courseId}`);
console.log(data.courseData);
```

---

## 👨‍🏫 Educator Endpoints

### 1. Update User Role to Educator

**Endpoint**: `POST /api/educator/update-role`

**Authentication**: Required ✅

**Description**: Upgrades user role to educator in Clerk metadata

**Request Body**: (empty)

**Response**:
```json
{
  "success": true,
  "message": "you can publish a course now"
}
```

**cURL Example**:
```bash
curl -X POST http://localhost:5000/api/educator/update-role \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -H "Content-Type: application/json"
```

**JavaScript Example**:
```javascript
const token = await getToken();
const { data } = await axios.post(
  'http://localhost:5000/api/educator/update-role',
  {},
  {
    headers: { Authorization: `Bearer ${token}` }
  }
);
console.log(data.message);
```

---

### 2. Add New Course

**Endpoint**: `POST /api/educator/add-course`

**Authentication**: Required ✅

**Description**: Creates a new course with chapters and lectures

**Request Body** (FormData with file):
```javascript
const formData = new FormData();
formData.append('courseData', JSON.stringify({
  courseTitle: 'Advanced React',
  courseDescription: '<p>Learn React in depth</p>',
  coursePrice: 9999,
  discount: 15,
  courseContent: [
    {
      chapterId: 'ch_1',
      chapterTitle: 'React Basics',
      chapterOrder: 1,
      chapterContent: [
        {
          lectureId: 'lec_1',
          lectureTitle: 'Introduction to React',
          lectureDuration: 30,
          lectureUrl: 'https://youtube.com/watch?v=...',
          isPreviewFree: true,
          lectureOrder: 1
        }
      ]
    }
  ]
}));
formData.append('image', imageFile); // File object from input
```

**Response**:
```json
{
  "success": true,
  "message": "Course Added",
  "course": {
    "_id": "675ac1512100b91a6d9b8b24",
    "courseTitle": "Advanced React",
    "courseThumbnail": "https://cloudinary.com/image.jpg",
    "educator": "educator_id_123",
    "educatorName": "John Doe",
    "isPublished": true,
    "createdAt": "2025-01-20T10:30:00Z"
  }
}
```

**JavaScript Example**:
```javascript
const formData = new FormData();
formData.append('courseData', JSON.stringify(courseData));
formData.append('image', imageFile);

const token = await getToken();
const { data } = await axios.post(
  'http://localhost:5000/api/educator/add-course',
  formData,
  {
    headers: {
      Authorization: `Bearer ${token}`,
      'Content-Type': 'multipart/form-data'
    }
  }
);
console.log(data.course);
```

---

### 3. Get Educator's Courses

**Endpoint**: `GET /api/educator/educator-course`

**Authentication**: Required ✅

**Description**: Retrieves all courses created by the authenticated educator

**Response**:
```json
{
  "success": true,
  "courses": [
    {
      "_id": "675ac1512100b91a6d9b8b24",
      "courseTitle": "Web Development",
      "courseThumbnail": "https://cloudinary.com/image.jpg",
      "coursePrice": 4999,
      "discount": 20,
      "enrolledStudents": ["user1", "user2"],
      "isPublished": true,
      "createdAt": "2025-01-15T10:30:00Z"
    }
  ]
}
```

**JavaScript Example**:
```javascript
const token = await getToken();
const { data } = await axios.get(
  'http://localhost:5000/api/educator/educator-course',
  {
    headers: { Authorization: `Bearer ${token}` }
  }
);
console.log(data.courses);
```

---

## 👤 User Endpoints

### 1. Get User Data

**Endpoint**: `GET /api/user/data`

**Authentication**: Required ✅

**Description**: Retrieves authenticated user's profile information

**Response**:
```json
{
  "success": true,
  "user": {
    "_id": "user_clerk_id_123",
    "name": "John Doe",
    "email": "john@example.com",
    "imageUrl": "https://lh3.googleusercontent.com/...",
    "enrolledCourses": ["675ac1512100b91a6d9b8b24", "675ac1512100b91a6d9b8b25"],
    "createdAt": "2025-01-15T10:30:00Z"
  }
}
```

**JavaScript Example**:
```javascript
const token = await getToken();
const { data } = await axios.get(
  'http://localhost:5000/api/user/data',
  {
    headers: { Authorization: `Bearer ${token}` }
  }
);
console.log(data.user);
```

---

### 2. Get Enrolled Courses

**Endpoint**: `GET /api/user/enrolled-courses`

**Authentication**: Required ✅

**Description**: Retrieves all courses enrolled by the user

**Response**:
```json
{
  "success": true,
  "enrolledCourses": [
    {
      "_id": "675ac1512100b91a6d9b8b24",
      "courseTitle": "Web Development",
      "courseThumbnail": "https://cloudinary.com/image.jpg",
      "educatorName": "John Doe",
      "courseRatings": [{"userId": "user123", "rating": 5}],
      "courseContent": [...],
      "enrolledStudents": [...]
    }
  ]
}
```

**JavaScript Example**:
```javascript
const token = await getToken();
const { data } = await axios.get(
  'http://localhost:5000/api/user/enrolled-courses',
  {
    headers: { Authorization: `Bearer ${token}` }
  }
);
console.log(data.enrolledCourses);
```

---

### 3. Purchase Course

**Endpoint**: `POST /api/user/purchase`

**Authentication**: Required ✅

**Description**: Initiates Stripe checkout session for course purchase

**Request Body**:
```json
{
  "courseId": "675ac1512100b91a6d9b8b24"
}
```

**Response**:
```json
{
  "success": true,
  "session_url": "https://checkout.stripe.com/pay/cs_test_..."
}
```

**JavaScript Example**:
```javascript
const token = await getToken();
const { data } = await axios.post(
  'http://localhost:5000/api/user/purchase',
  { courseId: '675ac1512100b91a6d9b8b24' },
  {
    headers: { Authorization: `Bearer ${token}` }
  }
);

// Redirect to Stripe checkout
window.location.replace(data.session_url);
```

---

### 4. Update Course Progress

**Endpoint**: `POST /api/user/update-course-progress`

**Authentication**: Required ✅

**Description**: Marks a lecture as complete

**Request Body**:
```json
{
  "courseId": "675ac1512100b91a6d9b8b24",
  "lectureId": "lec_1"
}
```

**Response**:
```json
{
  "success": true,
  "message": "Lecture marked as complete"
}
```

**JavaScript Example**:
```javascript
const token = await getToken();
const { data } = await axios.post(
  'http://localhost:5000/api/user/update-course-progress',
  {
    courseId: '675ac1512100b91a6d9b8b24',
    lectureId: 'lec_1'
  },
  {
    headers: { Authorization: `Bearer ${token}` }
  }
);
console.log(data.message);
```

---

### 5. Get Course Progress

**Endpoint**: `POST /api/user/get-course-progress`

**Authentication**: Required ✅

**Description**: Retrieves user's progress in a specific course

**Request Body**:
```json
{
  "courseId": "675ac1512100b91a6d9b8b24"
}
```

**Response**:
```json
{
  "success": true,
  "progressData": {
    "_id": "prog_123",
    "userId": "user_123",
    "courseId": "675ac1512100b91a6d9b8b24",
    "completed": false,
    "lectureCompleted": ["lec_1", "lec_2"],
    "createdAt": "2025-01-20T10:30:00Z"
  }
}
```

**JavaScript Example**:
```javascript
const token = await getToken();
const { data } = await axios.post(
  'http://localhost:5000/api/user/get-course-progress',
  { courseId: '675ac1512100b91a6d9b8b24' },
  {
    headers: { Authorization: `Bearer ${token}` }
  }
);
console.log(data.progressData.lectureCompleted);
```

---

### 6. Add Course Rating

**Endpoint**: `POST /api/user/add-rating`

**Authentication**: Required ✅

**Description**: Adds or updates user's rating for a course

**Request Body**:
```json
{
  "courseId": "675ac1512100b91a6d9b8b24",
  "rating": 5
}
```

**Response**:
```json
{
  "success": true,
  "message": "Rating added successfully"
}
```

**JavaScript Example**:
```javascript
const token = await getToken();
const { data } = await axios.post(
  'http://localhost:5000/api/user/add-rating',
  {
    courseId: '675ac1512100b91a6d9b8b24',
    rating: 5
  },
  {
    headers: { Authorization: `Bearer ${token}` }
  }
);
console.log(data.message);
```

---

## 🔔 Webhook Endpoints

### Stripe Webhook

**Endpoint**: `POST /stripe`

**Authentication**: Not required (Stripe signature verification)

**Description**: Handles Stripe payment webhooks

**Events Handled**:
- `checkout.session.completed` - Payment successful, enroll user
- `charge.failed` - Payment failed
- `charge.refunded` - Refund processed

**Setup**:
```bash
# In Stripe Dashboard:
# 1. Go to Developers > Webhooks
# 2. Add endpoint: https://your-backend.com/stripe
# 3. Select events: checkout.session.completed
# 4. Copy signing secret to STRIPE_WEBHOOK_SECRET
```

### Clerk Webhook

**Endpoint**: `POST /clerk`

**Authentication**: Clerk signature verification

**Description**: Handles user events from Clerk

**Events Handled**:
- `user.created` - Create user in database
- `user.updated` - Update user data
- `user.deleted` - Delete user data

---

## ❌ Error Handling

### Error Response Format

```json
{
  "success": false,
  "message": "Error description here"
}
```

### Common Errors

| Error | Status Code | Solution |
|-------|-------------|----------|
| `Unauthorized: User not found` | 401 | Pass valid JWT token |
| `Course not found` | 404 | Check course ID |
| `Thumbnail Not Attached` | 400 | Include image file in FormData |
| `Already Enrolled` | 400 | User already purchased course |
| `Payment failed` | 402 | Check payment method |
| `CORS Error` | 403 | Frontend URL not whitelisted |

### Error Handling Example

```javascript
try {
  const { data } = await axios.post(
    'http://localhost:5000/api/user/purchase',
    { courseId: '675ac1512100b91a6d9b8b24' },
    {
      headers: { Authorization: `Bearer ${token}` }
    }
  );
  
  if (data.success) {
    window.location.replace(data.session_url);
  } else {
    console.error(data.message); // Handle error
  }
} catch (error) {
  console.error(error.response?.data?.message || error.message);
}
```

---

## 📊 Status Codes

| Code | Meaning |
|------|----------|
| `200` | OK - Request successful |
| `201` | Created - Resource created |
| `400` | Bad Request - Invalid data |
| `401` | Unauthorized - Invalid token |
| `403` | Forbidden - No permission |
| `404` | Not Found - Resource not found |
| `409` | Conflict - Resource already exists |
| `500` | Server Error - Internal error |

---

## 🔄 API Workflow Examples

### User Enrollment Workflow

```javascript
// 1. Get all courses
const courses = await axios.get('http://localhost:5000/api/course/all');

// 2. Get course details
const course = await axios.get(`http://localhost:5000/api/course/${courseId}`);

// 3. Purchase course
const { session_url } = await axios.post(
  'http://localhost:5000/api/user/purchase',
  { courseId },
  { headers: { Authorization: `Bearer ${token}` } }
);

// 4. Redirect to payment
window.location.replace(session_url);

// 5. After payment, Stripe webhook triggers enrollment

// 6. Fetch enrolled courses
const enrolled = await axios.get(
  'http://localhost:5000/api/user/enrolled-courses',
  { headers: { Authorization: `Bearer ${token}` } }
);
```

### Educator Course Creation Workflow

```javascript
// 1. Update role to educator
await axios.post(
  'http://localhost:5000/api/educator/update-role',
  {},
  { headers: { Authorization: `Bearer ${token}` } }
);

// 2. Create course with chapters and lectures
const formData = new FormData();
formData.append('courseData', JSON.stringify(courseData));
formData.append('image', imageFile);

const course = await axios.post(
  'http://localhost:5000/api/educator/add-course',
  formData,
  { headers: { Authorization: `Bearer ${token}` } }
);

// 3. Fetch educator's courses
const myCourses = await axios.get(
  'http://localhost:5000/api/educator/educator-course',
  { headers: { Authorization: `Bearer ${token}` } }
);
```

---

## 📞 API Support

For API issues:
1. Check error message in response
2. Review this documentation
3. Check browser console for details
4. Open GitHub issue with:
   - Request URL
   - Request body
   - Error response
   - Steps to reproduce
