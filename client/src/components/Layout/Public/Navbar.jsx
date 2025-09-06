import { Link } from "react-router-dom";
import useAuth from "../../../hooks/useAuth";
import ThemeToggler from "../../UI/ThemeToggler";

const Navbar = () => {
  const { user, logout } = useAuth();

  return (
    <div className="navbar bg-base-100 shadow-lg">
      <div className="flex-1">
        <Link to="/" className="btn btn-ghost normal-case text-xl">
          Student Life Toolkit
        </Link>
      </div>
      <div className="flex-none">
        <ul className="menu menu-horizontal px-1">
          {!user ? (
            <>
              <li>
                <Link to="/login">Login</Link>
              </li>
              <li>
                <Link to="/register">Register</Link>
              </li>
            </>
          ) : (
            <>
              <li>{<Link to="/class-schedules">Classes</Link>}</li>
              <li>
                <button onClick={logout}>Log out</button>
              </li>
            </>
          )}
        </ul>
        <ThemeToggler />
      </div>
    </div>
  );
};

export default Navbar;
