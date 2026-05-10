# 🤝 Contributing to LMS Website

Thank you for considering contributing to the LMS Website project! We welcome contributions from the community.

## 📋 Table of Contents

1. [Code of Conduct](#code-of-conduct)
2. [Getting Started](#getting-started)
3. [Development Workflow](#development-workflow)
4. [Coding Standards](#coding-standards)
5. [Commit Conventions](#commit-conventions)
6. [Pull Request Process](#pull-request-process)
7. [Testing](#testing)
8. [Bug Reports](#bug-reports)
9. [Feature Requests](#feature-requests)

---

## 📖 Code of Conduct

### Our Pledge

In the interest of fostering an open and welcoming environment, we as contributors and maintainers pledge to:

- **Be respectful**: Treat all contributors with respect and kindness
- **Be inclusive**: Welcome contributors of all backgrounds and experience levels
- **Be constructive**: Provide helpful feedback and suggestions
- **Be professional**: Maintain a professional tone in all interactions

### Unacceptable Behavior

- Harassment, discrimination, or offensive comments
- Attacks on someone's character or motivation
- Publishing private information without consent
- Other conduct which could reasonably be considered inappropriate

---

## 🚀 Getting Started

### Prerequisites

- Node.js v16+
- npm or yarn
- Git
- GitHub account

### Fork and Clone

```bash
# 1. Fork the repository on GitHub
# (Click "Fork" button on repository page)

# 2. Clone your fork
git clone https://github.com/YOUR_USERNAME/LMS-website.git
cd LMS-website

# 3. Add upstream remote
git remote add upstream https://github.com/rahulkumardas45/LMS-website.git

# 4. Create a branch
git checkout -b feature/your-feature-name
```

### Setup Development Environment

```bash
# Backend setup
cd server
npm install
cp .env.example .env
# Edit .env with your test credentials
npm run dev

# Frontend setup (in new terminal)
cd client
npm install
cp .env.example .env
# Edit .env with your test backend URL
npm run dev
```

---

## 🔄 Development Workflow

### Step 1: Create a Branch

Create a descriptive branch name:

```bash
# Feature
git checkout -b feature/user-authentication

# Bug fix
git checkout -b fix/login-error

# Documentation
git checkout -b docs/api-guide

# Improvement
git checkout -b improve/database-performance
```

### Step 2: Make Changes

Edit files and follow coding standards (see below).

### Step 3: Test Your Changes

```bash
# Manual testing
- Test in browser
- Check console for errors
- Verify API responses

# Run linter (when available)
npm run lint

# Run tests (when available)
npm run test
```

### Step 4: Commit Changes

See [Commit Conventions](#commit-conventions) below.

### Step 5: Push and Create PR

```bash
# Push to your fork
git push origin feature/your-feature-name

# Create Pull Request on GitHub
# (Compare your branch with upstream main)
```

---

## 📝 Coding Standards

### JavaScript/Node.js

#### Style Guide

```javascript
// ✅ DO: Use ES6+ features
const getUserData = async (userId) => {
  const user = await User.findById(userId);
  return user;
};

// ❌ DON'T: Use old syntax
function getUserData(userId) {
  return User.findById(userId);
}

// ✅ DO: Use meaningful variable names
const courseTitle = 'Advanced JavaScript';

// ❌ DON'T: Use unclear abbreviations
const ct = 'Advanced JavaScript';

// ✅ DO: Use consistent indentation (2 spaces)
const obj = {
  name: 'Course',
  duration: 10
};

// ❌ DON'T: Mix indentation
const obj = {
    name: 'Course',
  duration: 10
};
```

#### Naming Conventions

```javascript
// Variables and Functions: camelCase
const userName = 'John';
const calculateTotal = () => {};

// Constants: UPPER_SNAKE_CASE
const MAX_RETRIES = 3;
const API_TIMEOUT = 5000;

// Classes and Components: PascalCase
class UserController {}
const UserProfile = () => {}; // React component

// Private functions: prefix with underscore
const _validateEmail = (email) => {};
```

#### Function Documentation (JSDoc)

```javascript
/**
 * Fetches a course by ID with all related data
 * 
 * @async
 * @param {string} courseId - The unique course identifier
 * @param {string} userId - Optional: User ID for enrollment check
 * @returns {Promise<Object>} Course object with chapters and lectures
 * @throws {Error} If course not found
 * 
 * @example
 * const course = await getCourseData('675ac1512100b91a6d9b8b24');
 * console.log(course.courseTitle);
 */
export const getCourseData = async (courseId, userId = null) => {
  try {
    const course = await Course.findById(courseId).populate('educator', 'name');
    
    if (!course) {
      throw new Error('Course not found');
    }
    
    // Hide non-preview lectures
    course.courseContent.forEach(chapter => {
      chapter.chapterContent.forEach(lecture => {
        if (!lecture.isPreviewFree) {
          lecture.lectureUrl = '';
        }
      });
    });
    
    return course;
  } catch (error) {
    console.error('Error fetching course:', error);
    throw error;
  }
};
```

### React Components

#### Functional Components with Hooks

```javascript
import React, { useState, useEffect, useContext } from 'react';
import { AppContext } from '../../context/AppContext';
import axios from 'axios';
import { toast } from 'react-toastify';

/**
 * CourseCard Component
 * 
 * Displays a course in card format with title, instructor, rating, and price.
 * 
 * @component
 * @param {Object} props - Component props
 * @param {Object} props.course - Course data object
 * @param {string} props.course._id - Course ID
 * @param {string} props.course.courseTitle - Course title
 * @param {number} props.course.coursePrice - Course price
 * @returns {JSX.Element} Rendered course card
 * 
 * @example
 * <CourseCard course={courseData} />
 */
const CourseCard = ({ course }) => {
  const { currency, calculateRating } = useContext(AppContext);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    // Component logic
  }, []);

  const handleEnroll = async () => {
    try {
      setLoading(true);
      // Enrollment logic
    } catch (err) {
      setError(err.message);
      toast.error(err.message);
    } finally {
      setLoading(false);
    }
  };

  if (error) return <div className="error">{error}</div>;
  if (loading) return <div>Loading...</div>;

  return (
    <div className="course-card">
      <img src={course.courseThumbnail} alt={course.courseTitle} />
      <h3>{course.courseTitle}</h3>
      <p>Rating: {calculateRating(course)}</p>
      <p>Price: {currency}{course.coursePrice}</p>
      <button onClick={handleEnroll}>Enroll Now</button>
    </div>
  );
};

export default CourseCard;
```

#### Component Best Practices

```javascript
// ✅ DO: Props destructuring
const UserProfile = ({ userId, userName }) => {
  return <h1>{userName}</h1>;
};

// ❌ DON'T: Destructure in function body
const UserProfile = (props) => {
  const { userId, userName } = props;
  return <h1>{userName}</h1>;
};

// ✅ DO: Use proper key in lists
{courses.map((course) => (
  <CourseCard key={course._id} course={course} />
))}

// ❌ DON'T: Use index as key
{courses.map((course, index) => (
  <CourseCard key={index} course={course} />
))}
```

### Backend Controllers

#### Controller Pattern

```javascript
/**
 * Get all published courses
 * 
 * @async
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 * @returns {JSON} Success response with courses array
 * 
 * @example
 * GET /api/course/all
 * Response: { success: true, courses: [...] }
 */
export const getAllCourses = async (req, res) => {
  try {
    // Validate input
    const { page = 1, limit = 10 } = req.query;

    // Business logic
    const courses = await Course.find({ isPublished: true })
      .select(['-courseContent', '-enrolledStudents'])
      .populate('educator', 'name')
      .limit(limit * 1)
      .skip((page - 1) * limit);

    if (!courses) {
      return res.status(404).json({
        success: false,
        message: 'Courses not found'
      });
    }

    // Send response
    res.json({
      success: true,
      courses,
      total: await Course.countDocuments({ isPublished: true })
    });
  } catch (error) {
    console.error('Error fetching courses:', error);
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};
```

---

## 📦 Commit Conventions

Use clear, descriptive commit messages following this format:

```
<type>(<scope>): <subject>

<body>

<footer>
```

### Type

- `feat`: A new feature
- `fix`: A bug fix
- `docs`: Documentation changes
- `style`: Code style changes (formatting, semicolons, etc)
- `refactor`: Code refactoring without feature changes
- `perf`: Performance improvements
- `test`: Adding or updating tests
- `chore`: Build, dependencies, or tooling changes

### Scope

Optional: Indicates the area of code affected

- `auth`, `course`, `payment`, `user`, `api`, etc.

### Subject

- Imperative mood ("add" not "added")
- Don't capitalize first letter
- No period at the end
- Maximum 50 characters

### Examples

```bash
# Good commits
git commit -m "feat(auth): add JWT token refresh mechanism"
git commit -m "fix(course): resolve pagination issue in course list"
git commit -m "docs: update API documentation for payment endpoints"
git commit -m "refactor(database): optimize course queries with indexes"
git commit -m "perf: reduce bundle size by lazy loading components"
```

### Bad Commits

```bash
# ❌ Bad
git commit -m "updated stuff"
git commit -m "Fixed bugs"
git commit -m "Working on new feature"
```

---

## 📤 Pull Request Process

### Before Creating a PR

1. Update your branch with upstream changes

```bash
git fetch upstream
git rebase upstream/main
```

2. Ensure all changes are committed

```bash
git status
```

3. Push your changes

```bash
git push origin feature/your-feature-name
```

### PR Title

Follow the commit convention:

```
[FEATURE] Add JWT token refresh mechanism
[BUG] Fix pagination in course list
[DOCS] Update API documentation
```

### PR Description Template

```markdown
## Description

Brief description of what this PR does.

## Type of Change

- [ ] New feature
- [ ] Bug fix
- [ ] Breaking change
- [ ] Documentation

## Related Issues

Closes #123

## Changes Made

- Change 1
- Change 2
- Change 3

## Testing

- [ ] Tested on local environment
- [ ] All manual tests passed
- [ ] No console errors

## Screenshots (if applicable)

[Add screenshots or GIFs]

## Checklist

- [ ] My code follows the style guidelines
- [ ] I have commented my code
- [ ] I have made corresponding changes to documentation
- [ ] My changes generate no new warnings
- [ ] I have tested my changes
```

### PR Review Process

1. Automated checks run (linting, tests)
2. Maintainers review code
3. Requested changes are made
4. PR is approved and merged

---

## 🧪 Testing

### Manual Testing Checklist

Before submitting a PR:

- [ ] Feature works as intended
- [ ] No console errors or warnings
- [ ] No broken UI elements
- [ ] Responsive on mobile/tablet
- [ ] API calls return expected data
- [ ] Error handling works correctly
- [ ] Previous features still work

### Browser Testing

Test in:
- Chrome/Edge (latest)
- Firefox (latest)
- Safari (latest)

---

## 🐛 Bug Reports

### Use GitHub Issues

Click "Issues" → "New Issue" → "Bug Report"

### Bug Report Template

```markdown
## Description

Clear description of the bug.

## Steps to Reproduce

1. Step 1
2. Step 2
3. Step 3

## Expected Behavior

What should happen?

## Actual Behavior

What actually happened?

## Screenshots

[Add screenshots]

## Environment

- Browser: [e.g., Chrome 95]
- OS: [e.g., Windows 11]
- Node version: [e.g., 16.13.0]

## Additional Context

Any other relevant information.
```

---

## 💡 Feature Requests

### Use GitHub Issues

Click "Issues" → "New Issue" → "Feature Request"

### Feature Request Template

```markdown
## Description

Clear description of the requested feature.

## Use Case

Why is this feature needed?

## Proposed Solution

How should this feature work?

## Alternatives

Any alternative approaches?

## Additional Context

Any other relevant information.
```

---

## 📚 Resources

- [API Documentation](./API.md)
- [Architecture Guide](./ARCHITECTURE.md)
- [Main README](../README.md)
- [Git Tutorial](https://git-scm.com/doc)
- [React Documentation](https://react.dev)
- [Express.js Guide](https://expressjs.com/)

---

## 🙏 Thank You!

Thank you for contributing to make LMS Website better! Your efforts are greatly appreciated.

---

**Questions?** Open a discussion on GitHub or reach out to the maintainers.
