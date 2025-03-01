import { Navigate, Route, Routes } from "react-router-dom";
import "./App.css";
import JobsListPage from "./pages/JobListPage/JobsListPage.tsx";
import JobDetailsPage from "./pages/JobDetailsPage/JobDetailsPage.tsx";
import LoginPage from "./pages/LoginPage/LoginPage.tsx";
import RegisterPage from "./pages/RegisterPage/RegisterPage.tsx";
import HomePage from "./pages/HomePage/HomePage.tsx";
import NavBar from "./components/NavBar/NavBar.tsx";
import { AuthProvider } from "./auth/AuthContext.tsx";
import PostJobPage from "./pages/PostJobPage/PostJobPage.tsx";
import MyApplicationsPage from "./pages/MyApplicationsPage/MyApplicationsPage.tsx";
import EmployerJobsPage from "./pages/EmployerJobsPage/EmployerJobsPage.tsx";

function App() {
  return (
    <AuthProvider>
      <NavBar />
      <Routes>
        <Route path="/home" element={<HomePage />} />
        <Route path="/jobs" element={<JobsListPage />} />
        <Route path="/jobs/:id" element={<JobDetailsPage />} />
        <Route path="/applications" element={<MyApplicationsPage />} />
        <Route path="/post-job" element={<PostJobPage />} />
        <Route path="/posted-jobs/" element={<EmployerJobsPage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route path="*" element={<Navigate to="/home" />} />
      </Routes>
    </AuthProvider>
  );
}

export default App;
