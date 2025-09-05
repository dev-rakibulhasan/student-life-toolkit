import { Outlet } from "react-router-dom";
import Drawer from "./Drawer";
import PrivateRoute from "../../Auth/PrivateRoute";
import { useEffect } from "react";

const AuthenticatedLayout = () => {
  useEffect(() => {
    sessionStorage.removeItem("justLoggedIn");
  }, []);
  return (
    <PrivateRoute>
      <Drawer>
        <main className="flex-1 p-4">
          <Outlet />
        </main>
      </Drawer>
    </PrivateRoute>
  );
};

export default AuthenticatedLayout;
