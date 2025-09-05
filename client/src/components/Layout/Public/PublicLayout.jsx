import { Outlet } from "react-router-dom";
import Navbar from "./Navbar";
import Footer from "./Footer";
import PublicRoute from "../../Auth/PublicRoute";

const PublicLayout = () => {
  return (
    <PublicRoute>
      <Navbar />
      <main className="flex-1 p-4">
        <Outlet />
      </main>
      <Footer />
    </PublicRoute>
  );
};

export default PublicLayout;
