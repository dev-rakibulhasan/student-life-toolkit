import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import LandingPage from "./pages/public/LandingPage";
import Login from "./pages/public/Login";
import Register from "./pages/public/Register";
import AuthenticatedLayout from "./components/Layout/Auth/AuthenticatedLayout";
import PublicLayout from "./components/Layout/Public/PublicLayout";
import NotFound from "./pages/partial/NotFound";
import ClassSchedules from "./pages/user/ClassSchedules";
import BudgetTracker from "./pages/user/BudgetTracker";
import ManageQuestions from "./pages/user/ManageQuestions";
import ToastProvider from "./components/UI/ToastProvider";

function App() {
  return (
    <Router>
      <Routes>
        {/* Public routes without drawer */}
        <Route element={<PublicLayout />}>
          <Route path="/" element={<LandingPage />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
        </Route>

        {/* Routes with drawer layout */}
        <Route element={<AuthenticatedLayout />}>
          <Route path="/class-schedules" element={<ClassSchedules />} />
          <Route path="/budget-tracker" element={<BudgetTracker />} />
          <Route path="/manage-questions" element={<ManageQuestions />} />
        </Route>
        <Route path="*" element={<NotFound />} />
      </Routes>
      <ToastProvider />
    </Router>
  );
}

export default App;
