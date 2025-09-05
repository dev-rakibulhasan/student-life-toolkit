const LandingPage = () => {
  return (
    <div>
      <div className="hero min-h-screen bg-base-200">
        <div className="hero-content text-center">
          <div className="max-w-md">
            <h1 className="text-5xl font-bold">Student Life Toolkit</h1>
            <p className="py-6">
              Plan your classes, track your budget, generate exam practice
              questions, and organize your study goals—all in one simple app.
              With unique tools like Focus Mode and one-click PDF export,
              StudentHub makes staying productive and stress-free easier than
              ever.
            </p>
            <div className="flex gap-4 justify-center">
              <button className="btn btn-primary">Get Started</button>
              <button className="btn btn-info">Learn More</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LandingPage;
