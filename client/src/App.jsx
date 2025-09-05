import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import LandingPage from "./pages/public/LandingPage";
import Login from "./pages/public/Login";
import Register from "./pages/public/Register";
import AuthenticatedLayout from "./components/Layout/Auth/AuthenticatedLayout";
import PublicLayout from "./components/Layout/Public/PublicLayout";
import NotFound from "./pages/partial/NotFound";

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
        <Route element={<AuthenticatedLayout />}>{/*  */}</Route>
        <Route path="*" element={<NotFound />} />
      </Routes>
    </Router>
  );
}

export default App;
