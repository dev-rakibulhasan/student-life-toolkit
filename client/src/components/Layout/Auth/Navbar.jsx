import React from "react";
import ThemeToggler from "../../UI/ThemeToggler";
import useAuth from "../../../hooks/useAuth";

const Navbar = () => {
  const { user } = useAuth();
  return (
    <div className="navbar bg-base-100 shadow-sm">
      <div className="navbar-start">
        <div className="dropdown lg:hidden">
          <label
            htmlFor="my-drawer"
            role="button"
            className="btn btn-ghost btn-circle"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-5 w-5"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              {" "}
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M4 6h16M4 12h16M4 18h7"
              />{" "}
            </svg>
          </label>
        </div>
        <h1 className="text-xl font-bold">Welcome, {user?.name}</h1>
      </div>

      <div className="navbar-end">
        <ThemeToggler />
      </div>
    </div>
  );
};

export default Navbar;
