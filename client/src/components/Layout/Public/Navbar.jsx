import { Link } from "react-router-dom";
import { useState } from "react";
import useAuth from "../../../hooks/useAuth";
import ThemeToggler from "../../UI/ThemeToggler";

const Navbar = () => {
  const { user, logout } = useAuth();
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="navbar bg-base-100 shadow-md sticky top-0 z-50 px-4 sm:px-8">
      <div className="flex-1">
        <Link to="/" className="btn btn-ghost normal-case text-xl">
          STUDENT LIFE TOOLKIT
        </Link>
      </div>

      <div className="flex-none flex items-center">
        {/* Desktop menu */}
        <ul className="menu menu-horizontal px-1 hidden sm:flex gap-2">
          <li>
            <Link to="/">Home</Link>
          </li>
          <li>
            <a href="#features">Features</a>
          </li>
          <li>
            <a href="#testimonials">Testimonials</a>
          </li>
          {!user ? (
            <>
              <li>
                <Link to="/login">Login</Link>
              </li>
              <li className="btn btn-sm btn-accent mr-2">
                <Link to="/register">Get Started</Link>
              </li>
            </>
          ) : (
            <>
              <li>
                <Link to="/class-schedules">Dashboard</Link>
              </li>
              <li>
                <button onClick={logout}>Log out</button>
              </li>
            </>
          )}
        </ul>

        {/* Theme toggler */}
        <ThemeToggler />

        {/* Hamburger button */}
        <div className="sm:hidden ml-2">
          <button
            className="btn btn-square btn-ghost"
            onClick={() => setIsOpen(!isOpen)}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-6 w-6"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              {isOpen ? (
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M6 18L18 6M6 6l12 12"
                />
              ) : (
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M4 6h16M4 12h16M4 18h16"
                />
              )}
            </svg>
          </button>
        </div>
      </div>

      {/* Mobile menu */}
      {isOpen && (
        <div className="sm:hidden absolute top-full left-0 w-full bg-base-100 shadow-md z-40">
          <ul className="menu menu-vertical px-4 py-2 gap-2">
            <li>
              <Link to="/" onClick={() => setIsOpen(false)}>
                Home
              </Link>
            </li>
            <li>
              <a href="#features" onClick={() => setIsOpen(false)}>
                Features
              </a>
            </li>
            <li>
              <a href="#testimonials" onClick={() => setIsOpen(false)}>
                Testimonials
              </a>
            </li>
            {!user ? (
              <>
                <li>
                  <Link to="/login" onClick={() => setIsOpen(false)}>
                    Login
                  </Link>
                </li>
                <li className="btn btn-sm btn-accent w-full">
                  <Link to="/register" onClick={() => setIsOpen(false)}>
                    Get Started
                  </Link>
                </li>
              </>
            ) : (
              <>
                <li>
                  <Link to="/class-schedules" onClick={() => setIsOpen(false)}>
                    Dashboard
                  </Link>
                </li>
                <li>
                  <button
                    onClick={() => {
                      logout();
                      setIsOpen(false);
                    }}
                    className="w-full text-left"
                  >
                    Log out
                  </button>
                </li>
              </>
            )}
          </ul>
        </div>
      )}
    </div>
  );
};

export default Navbar;
