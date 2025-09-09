import React from "react";
import { Link } from "react-router-dom";

const Footer = () => {
  return (
    <footer className="footer p-10 bg-neutral text-neutral-content flex flex-col sm:flex-row flex-wrap justify-between gap-6">
      <div className="flex-1 min-w-[150px]">
        <span className="footer-title">Services</span>
        <Link to="/class-schedules" className="link link-hover">
          Class Scheduling
        </Link>
        <Link to="/budget-tracker" className="link link-hover">
          Budget Management
        </Link>
        <Link to="/time-tracker" className="link link-hover">
          Time Tracking
        </Link>
        <Link to="/study-planner" className="link link-hover">
          Study Planning
        </Link>
      </div>

      <div className="flex-1 min-w-[150px]">
        <span className="footer-title">Company</span>
        <a className="link link-hover">About us</a>
        <a className="link link-hover">Contact</a>
        <a className="link link-hover">Jobs</a>
        <a className="link link-hover">Press kit</a>
      </div>

      <div className="flex-1 min-w-[150px]">
        <span className="footer-title">Legal</span>
        <a className="link link-hover">Terms of use</a>
        <a className="link link-hover">Privacy policy</a>
        <a className="link link-hover">Cookie policy</a>
      </div>
    </footer>
  );
};

export default Footer;
