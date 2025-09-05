import { Link } from "react-router-dom";

const NotFound = () => {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-base-100 text-center px-4">
      <h1 className="text-9xl font-bold text-error animate-bounce">404</h1>
      <h2 className="text-3xl md:text-5xl font-bold mt-4 text-base-content">
        Oops! Page not found.
      </h2>
      <p className="text-lg mt-2 text-base-content/70">
        The page you're looking for doesn't exist or has been moved.
      </p>

      <div className="mt-6">
        <Link to="/" className="btn btn-primary btn-wide">
          Back to Homepage
        </Link>
      </div>
    </div>
  );
};

export default NotFound;
