import React from "react";
import { useState, useEffect } from "react";
import { Link } from "react-router-dom";

const LandingPage = () => {
  const [activeTab, setActiveTab] = useState(0);
  const stars = [
    <input
      type="radio"
      className="mask mask-star-2 bg-orange-400"
      defaultChecked
    />,
    <input
      type="radio"
      className="mask mask-star-2 bg-orange-400"
      defaultChecked
    />,
    <input
      type="radio"
      className="mask mask-star-2 bg-orange-400"
      defaultChecked
    />,
    <input
      type="radio"
      className="mask mask-star-2 bg-orange-400"
      defaultChecked
    />,
    <input
      type="radio"
      className="mask mask-star-2 bg-orange-400"
      defaultChecked
    />,
  ];

  const features = [
    {
      title: "Class Schedule Tracker",
      description:
        "Never miss a lecture with our intuitive class scheduling system.",
      icon: (
        <svg
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          strokeWidth={1.5}
          stroke="currentColor"
          className="size-6"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M6.75 2.994v2.25m10.5-2.25v2.25m-14.252 13.5V7.491a2.25 2.25 0 0 1 2.25-2.25h13.5a2.25 2.25 0 0 1 2.25 2.25v11.251m-18 0a2.25 2.25 0 0 0 2.25 2.25h13.5a2.25 2.25 0 0 0 2.25-2.25m-18 0v-7.5a2.25 2.25 0 0 1 2.25-2.25h13.5a2.25 2.25 0 0 1 2.25 2.25v7.5m-6.75-6h2.25m-9 2.25h4.5m.002-2.25h.005v.006H12v-.006Zm-.001 4.5h.006v.006h-.006v-.005Zm-2.25.001h.005v.006H9.75v-.006Zm-2.25 0h.005v.005h-.006v-.005Zm6.75-2.247h.005v.005h-.005v-.005Zm0 2.247h.006v.006h-.006v-.006Zm2.25-2.248h.006V15H16.5v-.005Z"
          />
        </svg>
      ),
      details:
        "Add, edit, or delete classes with subject details, time, day, and instructor information. Color coding helps you visually organize your schedule.",
      image: "/assets/platform-ss/class-schedule.jpg",
      benefits: [
        "Color-coded classes",
        "Easy editing",
        "Next class information",
        "Sync across devices",
      ],
    },
    {
      title: "Budget Tracker",
      description:
        "Manage your finances with our comprehensive budget tracking tools.",
      icon: (
        <svg
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          stroke-width="1.5"
          stroke="currentColor"
          class="size-6"
        >
          <path
            stroke-linecap="round"
            stroke-linejoin="round"
            d="M3.75 3v11.25A2.25 2.25 0 0 0 6 16.5h2.25M3.75 3h-1.5m1.5 0h16.5m0 0h1.5m-1.5 0v11.25A2.25 2.25 0 0 1 18 16.5h-2.25m-7.5 0h7.5m-7.5 0-1 3m8.5-3 1 3m0 0 .5 1.5m-.5-1.5h-9.5m0 0-.5 1.5m.75-9 3-3 2.148 2.148A12.061 12.061 0 0 1 16.5 7.605"
          />
        </svg>
      ),
      details:
        "Track income from various sources and monitor expenses across categories. Visual charts help you understand your spending patterns.",
      image: "/assets/platform-ss/budget-tracker.jpg",
      benefits: [
        "Income/expense tracking",
        "Visual charts",
        "Spending categories",
        "Savings goals",
      ],
    },
    {
      title: "Exam Q&A Generator",
      description: "Prepare for exams with AI-powered question generation.",
      icon: (
        <svg
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          stroke-width="1.5"
          stroke="currentColor"
          className="size-6"
        >
          <path
            stroke-linecap="round"
            stroke-linejoin="round"
            d="M6 6.878V6a2.25 2.25 0 0 1 2.25-2.25h7.5A2.25 2.25 0 0 1 18 6v.878m-12 0c.235-.083.487-.128.75-.128h10.5c.263 0 .515.045.75.128m-12 0A2.25 2.25 0 0 0 4.5 9v.878m13.5-3A2.25 2.25 0 0 1 19.5 9v.878m0 0a2.246 2.246 0 0 0-.75-.128H5.25c-.263 0-.515.045-.75.128m15 0A2.25 2.25 0 0 1 21 12v6a2.25 2.25 0 0 1-2.25 2.25H5.25A2.25 2.25 0 0 1 3 18v-6c0-.98.626-1.813 1.5-2.122"
          />
        </svg>
      ),
      details:
        "Generate practice questions in various formats. Set difficulty levels and use AI to create customized exam preparation materials.",
      image: "/assets/platform-ss/question-generator.jpg",
      benefits: [
        "Multiple question types",
        "Adjustable difficulty",
        "AI-powered generation",
        "Progress tracking",
      ],
    },
    {
      title: "Study Planner",
      description: "Break down big study goals into manageable tasks.",
      icon: (
        <svg
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          stroke-width="1.5"
          stroke="currentColor"
          class="size-6"
        >
          <path
            stroke-linecap="round"
            stroke-linejoin="round"
            d="M9 12h3.75M9 15h3.75M9 18h3.75m3 .75H18a2.25 2.25 0 0 0 2.25-2.25V6.108c0-1.135-.845-2.098-1.976-2.192a48.424 48.424 0 0 0-1.123-.08m-5.801 0c-.065.21-.1.433-.1.664 0 .414.336.75.75.75h4.5a.75.75 0 0 0 .75-.75 2.25 2.25 0 0 0-.1-.664m-5.8 0A2.251 2.251 0 0 1 13.5 2.25H15c1.012 0 1.867.668 2.15 1.586m-5.8 0c-.376.023-.75.05-1.124.08C9.095 4.01 8.25 4.973 8.25 6.108V8.25m0 0H4.875c-.621 0-1.125.504-1.125 1.125v11.25c0 .621.504 1.125 1.125 1.125h9.75c.621 0 1.125-.504 1.125-1.125V9.375c0-.621-.504-1.125-1.125-1.125H8.25ZM6.75 12h.008v.008H6.75V12Zm0 3h.008v.008H6.75V15Zm0 3h.008v.008H6.75V18Z"
          />
        </svg>
      ),
      details:
        "Allocate time slots for each subject, set priorities, and establish deadlines to stay on track with your studies.",
      image: "/assets/platform-ss/study-planner.jpg",
      benefits: [
        "Task breakdown",
        "Priority levels",
        "Deadline tracking",
        "Time allocation",
      ],
    },
    {
      title: "Study Time Tracker",
      description: "Monitor and optimize your study sessions.",
      icon: (
        <svg
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          stroke-width="1.5"
          stroke="currentColor"
          class="size-6"
        >
          <path
            stroke-linecap="round"
            stroke-linejoin="round"
            d="M12 6v6h4.5m4.5 0a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z"
          />
        </svg>
      ),
      details:
        "Track time spent on different subjects with our session timer. Analyze your study patterns to improve efficiency.",
      image: "/assets/platform-ss/time-tracker.jpg",
      benefits: [
        "Session timer",
        "Subject analytics",
        "Efficiency reports",
        "Study goals",
      ],
    },
  ];

  return (
    <div className="min-h-screen bg-base-100">
      {/* Hero Section */}
      <section
        id="hero"
        className="hero min-h-screen bg-gradient-to-r from-primary to-secondary text-primary-content"
      >
        <div className="hero-content text-center">
          <div className="max-w-3xl">
            <h1 className="text-5xl font-bold">
              All Your Study Tools in One Place
            </h1>
            <p className="py-6 text-xl">
              Student Life Toolkit combines five essential tools to help you
              excel in your academic journey. From class scheduling to exam
              preparation, we've got you covered.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link to="/dashboard" className="btn btn-accent btn-lg">
                Get Started
              </Link>
              <button className="btn btn-outline btn-lg btn-accent-content">
                View Demo
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Features Overview */}
      <section id="features" className="py-20 container mx-auto px-4">
        <h2 className="text-4xl font-bold text-center mb-4">
          Powerful Features for Students
        </h2>
        <p className="text-center text-xl mb-12 max-w-3xl mx-auto">
          Our platform brings together everything you need to stay organized,
          manage your time, and succeed in your studies.
        </p>

        <div className="tabs tabs-boxed justify-center mb-8">
          {features.map((feature, index) => (
            <a
              key={index}
              className={`tab tab-lg ${
                activeTab === index ? "tab-active" : ""
              }`}
              onClick={() => setActiveTab(index)}
            >
              {feature.icon} {feature.title}
            </a>
          ))}
        </div>

        <div className="flex flex-col lg:flex-row gap-8 items-center">
          <div className="flex-1">
            <img
              src={features[activeTab].image}
              alt={features[activeTab].title}
              className="rounded-lg shadow-2xl w-full"
            />
          </div>
          <div className="flex-1">
            <h3 className="text-3xl font-bold mb-4">
              {features[activeTab].title}
            </h3>
            <p className="text-lg mb-6">{features[activeTab].details}</p>
            <ul className="space-y-2">
              {features[activeTab].benefits.map((benefit, index) => (
                <li key={index} className="flex items-start">
                  <svg
                    className="w-6 h-6 text-green-500 mr-2 flex-shrink-0"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M5 13l4 4L19 7"
                    ></path>
                  </svg>
                  {benefit}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </section>

      {/* Feature Highlights */}
      <section className="py-20 bg-base-200">
        <div className="container mx-auto px-4">
          <h2 className="text-4xl font-bold text-center mb-16">
            How It Helps Students Succeed
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            <div className="card bg-base-100 shadow-xl">
              <div className="card-body">
                <div className="text-4xl mb-4">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke-width="1.5"
                    stroke="currentColor"
                    class="size-6"
                  >
                    <path
                      stroke-linecap="round"
                      stroke-linejoin="round"
                      d="M3 13.125C3 12.504 3.504 12 4.125 12h2.25c.621 0 1.125.504 1.125 1.125v6.75C7.5 20.496 6.996 21 6.375 21h-2.25A1.125 1.125 0 0 1 3 19.875v-6.75ZM9.75 8.625c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125v11.25c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 0 1-1.125-1.125V8.625ZM16.5 4.125c0-.621.504-1.125 1.125-1.125h2.25C20.496 3 21 3.504 21 4.125v15.75c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 0 1-1.125-1.125V4.125Z"
                    />
                  </svg>
                </div>
                <h3 className="card-title">Visual Learning Analytics</h3>
                <p>
                  Track your study patterns and receive insights to optimize
                  your learning process.
                </p>
              </div>
            </div>

            <div className="card bg-base-100 shadow-xl">
              <div className="card-body">
                <div className="text-4xl mb-4">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke-width="1.5"
                    stroke="currentColor"
                    class="size-6"
                  >
                    <path
                      stroke-linecap="round"
                      stroke-linejoin="round"
                      d="M16.023 9.348h4.992v-.001M2.985 19.644v-4.992m0 0h4.992m-4.993 0 3.181 3.183a8.25 8.25 0 0 0 13.803-3.7M4.031 9.865a8.25 8.25 0 0 1 13.803-3.7l3.181 3.182m0-4.991v4.99"
                    />
                  </svg>
                </div>
                <h3 className="card-title">Sync Across Devices</h3>
                <p>
                  Access your schedule, budget, and study plans from any device,
                  anywhere.
                </p>
              </div>
            </div>

            <div className="card bg-base-100 shadow-xl">
              <div className="card-body">
                <div className="text-4xl mb-4">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke-width="1.5"
                    stroke="currentColor"
                    class="size-6"
                  >
                    <path
                      stroke-linecap="round"
                      stroke-linejoin="round"
                      d="M7.5 8.25h9m-9 3H12m-9.75 1.51c0 1.6 1.123 2.994 2.707 3.227 1.129.166 2.27.293 3.423.379.35.026.67.21.865.501L12 21l2.755-4.133a1.14 1.14 0 0 1 .865-.501 48.172 48.172 0 0 0 3.423-.379c1.584-.233 2.707-1.626 2.707-3.228V6.741c0-1.602-1.123-2.995-2.707-3.228A48.394 48.394 0 0 0 12 3c-2.392 0-4.744.175-7.043.513C3.373 3.746 2.25 5.14 2.25 6.741v6.018Z"
                    />
                  </svg>
                </div>
                <h3 className="card-title">AI-Powered Question Generator</h3>
                <p>
                  Generate practice questions with AI by providing subject and
                  topic.
                </p>
              </div>
            </div>

            <div className="card bg-base-100 shadow-xl">
              <div className="card-body">
                <div className="text-4xl mb-4">
                  {" "}
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke-width="1.5"
                    stroke="currentColor"
                    class="size-6"
                  >
                    <path
                      stroke-linecap="round"
                      stroke-linejoin="round"
                      d="M3.75 3v11.25A2.25 2.25 0 0 0 6 16.5h2.25M3.75 3h-1.5m1.5 0h16.5m0 0h1.5m-1.5 0v11.25A2.25 2.25 0 0 1 18 16.5h-2.25m-7.5 0h7.5m-7.5 0-1 3m8.5-3 1 3m0 0 .5 1.5m-.5-1.5h-9.5m0 0-.5 1.5m.75-9 3-3 2.148 2.148A12.061 12.061 0 0 1 16.5 7.605"
                    />
                  </svg>
                </div>
                <h3 className="card-title">Budget Tracking</h3>
                <p>
                  Track your financial status by your income and expense
                  history.
                </p>
              </div>
            </div>

            <div className="card bg-base-100 shadow-xl">
              <div className="card-body">
                <div className="text-4xl mb-4">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke-width="1.5"
                    stroke="currentColor"
                    class="size-6"
                  >
                    <path
                      stroke-linecap="round"
                      stroke-linejoin="round"
                      d="M10.5 6a7.5 7.5 0 1 0 7.5 7.5h-7.5V6Z"
                    />
                    <path
                      stroke-linecap="round"
                      stroke-linejoin="round"
                      d="M13.5 10.5H21A7.5 7.5 0 0 0 13.5 3v7.5Z"
                    />
                  </svg>
                </div>
                <h3 className="card-title">Progress Tracking</h3>
                <p>
                  Monitor your academic progress and celebrate milestones along
                  your educational journey.
                </p>
              </div>
            </div>

            <div className="card bg-base-100 shadow-xl">
              <div className="card-body">
                <div className="text-4xl mb-4">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke-width="1.5"
                    stroke="currentColor"
                    class="size-6"
                  >
                    <path
                      stroke-linecap="round"
                      stroke-linejoin="round"
                      d="M18 18.72a9.094 9.094 0 0 0 3.741-.479 3 3 0 0 0-4.682-2.72m.94 3.198.001.031c0 .225-.012.447-.037.666A11.944 11.944 0 0 1 12 21c-2.17 0-4.207-.576-5.963-1.584A6.062 6.062 0 0 1 6 18.719m12 0a5.971 5.971 0 0 0-.941-3.197m0 0A5.995 5.995 0 0 0 12 12.75a5.995 5.995 0 0 0-5.058 2.772m0 0a3 3 0 0 0-4.681 2.72 8.986 8.986 0 0 0 3.74.477m.94-3.197a5.971 5.971 0 0 0-.94 3.197M15 6.75a3 3 0 1 1-6 0 3 3 0 0 1 6 0Zm6 3a2.25 2.25 0 1 1-4.5 0 2.25 2.25 0 0 1 4.5 0Zm-13.5 0a2.25 2.25 0 1 1-4.5 0 2.25 2.25 0 0 1 4.5 0Z"
                    />
                  </svg>
                </div>
                <h3 className="card-title">Instructors Info</h3>
                <p>
                  Get all your instructors details information such as, Phone
                  number, Email address, Website in one place.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section id="testimonials" className="py-20 container mx-auto px-4">
        <h2 className="text-4xl font-bold text-center mb-16">
          What Students Say
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          <div className="card bg-base-100 shadow-xl">
            <div className="card-body">
              <div className="rating rating-md mb-4">
                {stars.map((star) => {
                  return star;
                })}
              </div>
              <p className="mb-6">
                "The class tracker saved me so many times! Color-coding my
                subjects made my schedule so much easier to read at a glance."
              </p>
              <div className="flex items-center">
                <div className="avatar mr-4">
                  <div className="w-12 rounded-full">
                    <img
                      src="/assets/students-img/mahabub-khan.png"
                      alt="Student"
                    />
                  </div>
                </div>
                <div>
                  <h4 className="font-bold">Mahbub Khan</h4>
                  <p>Biology Major</p>
                </div>
              </div>
            </div>
          </div>

          <div className="card bg-base-100 shadow-xl">
            <div className="card-body">
              <div className="rating rating-md mb-4">
                {stars.map((star) => {
                  return star;
                })}
              </div>
              <p className="mb-6">
                "The budget tracker helped me save over ৳5000 last semester. The
                visual charts made it easy to see where I was overspending."
              </p>
              <div className="flex items-center">
                <div className="avatar mr-4">
                  <div className="w-12 rounded-full">
                    <img
                      src="/assets/students-img/tausif-hasan.png"
                      alt="Student"
                    />
                  </div>
                </div>
                <div>
                  <h4 className="font-bold">Tausif Hasan</h4>
                  <p>Engineering Student</p>
                </div>
              </div>
            </div>
          </div>

          <div className="card bg-base-100 shadow-xl">
            <div className="card-body">
              <div className="rating rating-md mb-4">
                {stars.map((star) => {
                  return star;
                })}
              </div>
              <p className="mb-6">
                "The exam generator is incredible! Being able to set different
                difficulty levels helped me prepare thoroughly for my finals."
              </p>
              <div className="flex items-center">
                <div className="avatar mr-4">
                  <div className="w-12 rounded-full">
                    <img
                      src="/assets/students-img/ridhika-roy.png"
                      alt="Student"
                    />
                  </div>
                </div>
                <div>
                  <h4 className="font-bold">Ridhika Roy</h4>
                  <p>Psychology Major</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
      {/* CTA Section */}
      <section className="py-20 bg-primary text-primary-content">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-4xl font-bold mb-6">
            Ready to Transform Your Study Experience?
          </h2>
          <p className="text-xl mb-10 max-w-2xl mx-auto">
            Join thousands of students who are already using Student Life
            Toolkit to achieve their academic goals.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link to="/dashboard" className="btn btn-accent btn-lg">
              Get Started
            </Link>
            <button className="btn btn-outline btn-lg btn-accent-content">
              View Demo
            </button>
          </div>
        </div>
      </section>
    </div>
  );
};

export default LandingPage;
