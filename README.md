# RuralLearn - Comprehensive Educational Platform

**React + Vite | Node.js + Express | MongoDB | Authentication with JWT | Leaderboard System**

---

## 🎯 Overview

**RuralLearn** is a full-stack educational web application designed to revolutionize learning in rural and underserved areas. Our platform provides an interactive learning environment with lessons, quizzes, progress tracking, and competitive leaderboards. It connects students with teachers and parents to foster collaborative learning and academic excellence.

With features like detailed lesson content, interactive quizzes, real-time leaderboards, and comprehensive progress tracking, RuralLearn creates an engaging digital classroom for educational institutions and remote learners.

---

## 🚀 Features

### 📚 Lesson Management
- 📖 **Create & Upload Lessons**: Teachers can create detailed lessons with multimedia support
- 🎬 **Video Integration**: Embed educational videos and learning materials
- 📝 **Rich Content**: Support for text, images, PDFs, and structured learning modules
- 🔍 **Browse Lessons**: Students can explore and access all available lessons
- ⭐ **Progress Tracking**: Track which lessons students have completed

### 📝 Quiz System
- ❓ **Multiple Choice Quizzes**: Create comprehensive assessments with multiple question types
- ⏱️ **Timed Assessments**: Set time limits for quiz completion
- 🎯 **Instant Scoring**: Automatic grading and immediate feedback
- 📊 **Question Bank**: Organized questions by difficulty (Easy, Medium, Hard)
- 🔄 **Attempt History**: Track student attempts and improvements over time

### 🏆 Leaderboard & Rankings
- 🥇 **Global Leaderboard**: View top performers across all quizzes
- 📈 **Quiz-Specific Rankings**: Rankings for individual quizzes
- 🎖️ **Score Aggregation**: Average performance metrics and total scores
- 👤 **Profile Highlighting**: Current user highlighted in leaderboard
- 🔐 **Secure Rankings**: Only authenticated users can view leaderboards

### 📱 Multi-Role System
- 👨‍🎓 **Students**: Complete lessons, attempt quizzes, view progress, see rankings
- 👨‍🏫 **Teachers**: Create content, manage quizzes, monitor student progress, post quizzes
- 👨‍👩‍👧 **Parents**: Monitor child's progress, view grades, access leaderboard insights

### 🔐 Authentication & Security
- 🔑 **JWT Authentication**: Secure token-based authentication
- 🔄 **Refresh Tokens**: Seamless session management with automatic token refresh
- 🛡️ **Role-Based Access Control**: Granular permissions for different user types
- 📊 **Secure API Endpoints**: Protected routes with middleware validation

### 👤 User Profile Management
- 📸 **Avatar Upload**: Profile pictures with Cloudinary integration
- ℹ️ **Profile Information**: Complete user details (name, email, grade, school)
- 🔐 **Password Management**: Secure password change functionality
- ✏️ **Profile Updates**: Easy editing of user information

---

## 🏗️ Architecture

### Frontend (React + Vite)
- **Framework**: React 19 with modern hooks and functional components
- **Build Tool**: Vite for lightning-fast development and optimized production builds
- **Styling**: Tailwind CSS for responsive and modern UI design
- **Icons**: Lucide React and React Icons for beautiful iconography
- **Routing**: React Router v7 for seamless client-side navigation
- **HTTP Client**: Axios with interceptors for API communication
- **State Management**: React Context API for global state
- **Animations**: Framer Motion for smooth transitions and interactions
- **UI Components**: Custom components built with Tailwind CSS

### Backend (Node.js + Express)
- **Runtime**: Node.js with ES6 modules
- **Framework**: Express.js with RESTful API architecture
- **Database**: MongoDB with Mongoose ODM for schema modeling
- **Authentication**: JWT with access and refresh tokens
- **File Storage**: Cloudinary integration for image uploads
- **Middleware**: Custom middleware for authentication, role verification, file uploads
- **Error Handling**: Centralized error handling with custom API error responses
- **Async Operations**: Async/await with error handling utilities

---

## 🔧 Tech Stack

### Frontend Technologies
- **React** - UI library
- **Vite** - Build tool
- **Tailwind CSS** - Styling
- **React Router** - Routing
- **Axios** - HTTP client
- **Framer Motion** - Animations
- **Lucide React** - Icons

### Backend Technologies
- **Node.js** - Runtime
- **Express.js** - Web framework
- **MongoDB** - Database
- **Mongoose** - ODM
- **JWT** - Authentication
- **Bcrypt** - Password hashing
- **Cloudinary** - File storage
- **Dotenv** - Environment variables

### Infrastructure & Services
- **Cloudinary** - Media storage and CDN
- **MongoDB Atlas** - Cloud database
- **Vercel** - Frontend deployment
- **Render** - Backend deployment
- **Nodemailer** - Email notifications (future)

---

## 📊 Core Models

### User Model
```
{
  fullName: String,
  userName: String (unique),
  email: String (unique),
  password: String (hashed),
  role: Enum(Student, Teacher, Parent),
  avatar: String (Cloudinary URL),
  grade: String (for Students),
  school: String,
  watchHistory: [Video References],
  refreshToken: String,
  timestamps: true
}
```

### Quiz Model
```
{
  title: String,
  subject: String,
  description: String,
  duration: Number (minutes),
  totalMarks: Number,
  questions: [Question References],
  difficulty: Enum(easy, medium, hard),
  createdBy: User Reference,
  tags: [String],
  timestamps: true
}
```

### Quiz Result Model
```
{
  quizId: Quiz Reference,
  studentId: User Reference,
  answers: [{
    questionId: Question Reference,
    selectedOptionIndex: Number,
    isCorrect: Boolean,
    score: Number
  }],
  totalScore: Number,
  totalPercentage: Number,
  completedAt: Date,
  isAttempted: Boolean,
  timestamps: true
}
```

### Lesson Model
```
{
  title: String,
  subject: String,
  description: String,
  content: String (rich text),
  grade: String,
  videos: [Video References],
  resources: [String] (file URLs),
  createdBy: User Reference,
  tags: [String],
  difficulty: String,
  timestamps: true
}
```

---

## 🚀 Getting Started

### Prerequisites
- Node.js (v16+)
- npm or yarn
- MongoDB Atlas account (or local MongoDB)
- Cloudinary account

### Environment Variables

#### Backend (.env)
```
PORT=8080
MONGODB_URI=your_mongodb_connection_string
ACCESS_TOKEN_SECRET=your_access_token_secret
REFERESH_TOKEN_SECRET=your_refresh_token_secret
ACCESS_TOKEN_EXPIRY=1d
REFERESH_TOKEN_EXPIRY=30d
CLOUDINARY_NAME=your_cloudinary_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret
NODE_ENV=development
```

#### Frontend (.env)
```
VITE_API_URL=http://localhost:8080
```

### Installation

1. **Clone the repository**
```bash
git clone <repository-url>
cd ruralLearn
```

2. **Setup Backend**
```bash
cd backend
npm install
npm start
```

3. **Setup Frontend**
```bash
cd frontend
npm install
npm run dev
```

4. **Access the application**
- Frontend: http://localhost:5173
- Backend API: http://localhost:8080/api/v1

---

## 📝 API Endpoints

### Authentication
- `POST /api/v1/users/register` - Register new user
- `POST /api/v1/users/login` - Login user
- `POST /api/v1/users/logout` - Logout user
- `POST /api/v1/users/refresh-token` - Refresh access token

### Users
- `GET /api/v1/users/me` - Get current user profile
- `PUT /api/v1/users/account-detail-update` - Update profile
- `PUT /api/v1/users/update-avatar` - Upload avatar
- `POST /api/v1/users/change-password` - Change password

### Lessons
- `GET /api/v1/lessons/get-all-lessons` - Get all lessons
- `GET /api/v1/lessons/:id` - Get lesson details
- `POST /api/v1/lessons/upload-lesson` - Create lesson (Teacher only)
- `PUT /api/v1/lessons/update/:id` - Update lesson (Teacher only)
- `DELETE /api/v1/lessons/:id` - Delete lesson (Teacher only)

### Quizzes
- `GET /api/v1/quizzes/get-all-quizzes` - Get all quizzes
- `GET /api/v1/quizzes/quize/:id` - Get quiz details
- `POST /api/v1/quizzes/upload-quize` - Create quiz (Teacher only)
- `PUT /api/v1/quizzes/update-quize/:id` - Update quiz (Teacher only)
- `DELETE /api/v1/quizzes/quize-delete/:id` - Delete quiz (Teacher only)
- `POST /api/v1/quizzes/response/:id` - Submit quiz response
- `GET /api/v1/quizzes/result/:id` - Get quiz result
- `GET /api/v1/quizzes/leaderboard` - Get leaderboard rankings

---

## 🎯 User Roles & Permissions

### 👨‍🎓 Student
- ✅ View all lessons and quizzes
- ✅ Attempt quizzes multiple times
- ✅ View personal quiz results
- ✅ Access leaderboard and rankings
- ✅ Update profile information
- ❌ Cannot create content
- ❌ Cannot manage quizzes/lessons

### 👨‍🏫 Teacher
- ✅ All student features
- ✅ Create and manage lessons
- ✅ Create and manage quizzes
- ✅ View student submissions
- ✅ Monitor platform analytics
- ✅ Publish content to students

### 👨‍👩‍👧 Parent
- ✅ View child progress and scores
- ✅ Access leaderboard insights
- ✅ Search student rankings
- ✅ Monitor academic performance
- ❌ Cannot create/edit content
- ❌ Cannot take quizzes

---

## 🔄 Workflow

### Student Taking a Quiz
1. Student navigates to Quiz Page
2. Selects a quiz to attempt
3. Views quiz details and questions
4. Submits answers
5. Receives instant score and feedback
6. Views result with detailed breakdown
7. Appears in leaderboard rankings

### Teacher Creating Content
1. Teacher logs in to dashboard
2. Creates new lesson or quiz
3. Adds content, questions, and answers
4. Sets difficulty and tags
5. Publishes to platform
6. Monitors student attempts and performance

### Parent Monitoring Progress
1. Parent logs in
2. Views child's progress dashboard
3. Searches leaderboard for performance
4. Monitors quiz scores and trends
5. Accesses detailed academic insights

---

## 🐛 Troubleshooting

### 401 Unauthorized Errors
- Clear browser localStorage: `localStorage.clear(); window.location.reload();`
- Ensure you're logged in with valid credentials
- Check that backend is running on port 8080
- Verify JWT secrets match in backend

### Token Expiry
- The app automatically refreshes tokens using refresh tokens
- If still getting 401, clear localStorage and log in again

### MongoDB Connection Issues
- Check MongoDB URI in .env file
- Ensure MongoDB Atlas cluster is active
- Verify IP whitelist includes your machine

---

## 📈 Features Roadmap

- 🎓 Certificate of Completion system
- 📧 Email notifications for quiz submissions
- 💬 Real-time discussion forums
- 📱 Mobile app (React Native)
- 🎮 Gamification elements (points, badges)
- 📊 Advanced analytics dashboard
- 🔔 Push notifications
- 👥 Peer-to-peer learning collaboration

---

## 📄 License

This project is licensed under the ISC License.

---

## 🤝 Contributing

We welcome contributions! Please feel free to submit a Pull Request.

---

## 📞 Support

For support, feedback, or feature requests, please open an issue or contact the development team.

---

⭐ **If you found this project helpful, please give it a star!**

Built with ❤️ for revolutionizing rural education