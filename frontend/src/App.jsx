import { Routes, Route } from "react-router-dom";
import Navbar from "./components/Navbar";
import Home from "./pages/Home";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Courses from "./pages/Courses";
import CreateCourse from "./pages/CreateCourse";
import MyRequests from "./pages/MyRequests";
import TutorRequests from "./pages/TutorRequests";
import Reviews from "./pages/Reviews";
import AdminDashboard from "./pages/AdminDashboard";
import ProtectedRoute from "./components/ProtectedRoute";
import AdminRoute from "./components/AdminRoute";
import CourseDetail from "./pages/CourseDetail";
import RequestDetail from "./pages/RequestDetail";

function App() {
  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950">
      <Navbar />

      <main>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/courses" element={<Courses />} />
          <Route path="/courses/:id" element={<CourseDetail />} />

          <Route
            path="/create-course"
            element={
              <ProtectedRoute>
                <CreateCourse />
              </ProtectedRoute>
            }
          />

          <Route
            path="/my-requests"
            element={
              <ProtectedRoute>
                <MyRequests />
              </ProtectedRoute>
            }
          />

          <Route
            path="/tutor-requests"
            element={
              <ProtectedRoute>
                <TutorRequests />
              </ProtectedRoute>
            }
          />

          <Route path="/reviews/:tutorId" element={<Reviews />} />

          <Route
            path="/admin"
            element={
              <AdminRoute>
                <AdminDashboard />
              </AdminRoute>
            }
          />
          <Route
            path="/my-requests/:id"
            element={
              <ProtectedRoute>
                <RequestDetail />
              </ProtectedRoute>
            }
          />
        </Routes>
      </main>
    </div>
  );
}

export default App;