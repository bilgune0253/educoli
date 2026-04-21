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
import ProtectedRoute from "./components/ProtectedRoute";

function App() {
  return (
    <>
      <Navbar />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/courses" element={<Courses />} />
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
      </Routes>
    </>
  );
}

export default App;