import React from "react";
import { useState, useEffect } from "react";
import { Link } from "react-router-dom";

const LandingPage = () => {
  const [activeTab, setActiveTab] = useState(0);

  const features = [
    {
      title: "Class Schedule Tracker",
      description:
        "Never miss a lecture with our intuitive class scheduling system.",
      icon: "📅",
      details:
        "Add, edit, or delete classes with subject details, time, day, and instructor information. Color coding helps you visually organize your schedule.",
      image: "/api/placeholder/400/300",
      benefits: [
        "Color-coded subjects",
        "Easy editing",
        "Notification system",
        "Sync across devices",
      ],
    },
    {
      title: "Budget Tracker",
      description:
        "Manage your finances with our comprehensive budget tracking tools.",
      icon: "💰",
      details:
        "Track income from various sources and monitor expenses across categories. Visual charts help you understand your spending patterns.",
      image: "/api/placeholder/400/300",
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
      icon: "📝",
      details:
        "Generate practice questions in various formats. Set difficulty levels and use AI to create customized exam preparation materials.",
      image: "/api/placeholder/400/300",
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
      icon: "📚",
      details:
        "Allocate time slots for each subject, set priorities, and establish deadlines to stay on track with your studies.",
      image: "/api/placeholder/400/300",
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
      icon: "⏱️",
      details:
        "Track time spent on different subjects with our session timer. Analyze your study patterns to improve efficiency.",
      image: "/api/placeholder/400/300",
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
                <div className="text-4xl mb-4">📊</div>
                <h3 className="card-title">Visual Learning Analytics</h3>
                <p>
                  Track your study patterns and receive insights to optimize
                  your learning process.
                </p>
              </div>
            </div>

            <div className="card bg-base-100 shadow-xl">
              <div className="card-body">
                <div className="text-4xl mb-4">🔄</div>
                <h3 className="card-title">Sync Across Devices</h3>
                <p>
                  Access your schedule, budget, and study plans from any device,
                  anywhere.
                </p>
              </div>
            </div>

            <div className="card bg-base-100 shadow-xl">
              <div className="card-body">
                <div className="text-4xl mb-4">🤖</div>
                <h3 className="card-title">AI-Powered Suggestions</h3>
                <p>
                  Get personalized study recommendations based on your
                  performance and goals.
                </p>
              </div>
            </div>

            <div className="card bg-base-100 shadow-xl">
              <div className="card-body">
                <div className="text-4xl mb-4">🔔</div>
                <h3 className="card-title">Smart Reminders</h3>
                <p>
                  Never miss a class, deadline, or study session with our
                  intelligent notification system.
                </p>
              </div>
            </div>

            <div className="card bg-base-100 shadow-xl">
              <div className="card-body">
                <div className="text-4xl mb-4">📈</div>
                <h3 className="card-title">Progress Tracking</h3>
                <p>
                  Monitor your academic progress and celebrate milestones along
                  your educational journey.
                </p>
              </div>
            </div>

            <div className="card bg-base-100 shadow-xl">
              <div className="card-body">
                <div className="text-4xl mb-4">👥</div>
                <h3 className="card-title">Collaboration Tools</h3>
                <p>
                  Share study plans and resources with classmates for group
                  projects and study sessions.
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
                <input
                  type="radio"
                  name="rating-1"
                  className="mask mask-star-2 bg-orange-400"
                  checked
                  readOnly
                />
                <input
                  type="radio"
                  name="rating-1"
                  className="mask mask-star-2 bg-orange-400"
                  checked
                  readOnly
                />
                <input
                  type="radio"
                  name="rating-1"
                  className="mask mask-star-2 bg-orange-400"
                  checked
                  readOnly
                />
                <input
                  type="radio"
                  name="rating-1"
                  className="mask mask-star-2 bg-orange-400"
                  checked
                  readOnly
                />
                <input
                  type="radio"
                  name="rating-1"
                  className="mask mask-star-2 bg-orange-400"
                  checked
                  readOnly
                />
              </div>
              <p className="mb-6">
                "The class tracker saved me so many times! Color-coding my
                subjects made my schedule so much easier to read at a glance."
              </p>
              <div className="flex items-center">
                <div className="avatar mr-4">
                  <div className="w-12 rounded-full">
                    <img src="/api/placeholder/48/48" alt="Student" />
                  </div>
                </div>
                <div>
                  <h4 className="font-bold">Sarah Johnson</h4>
                  <p>Biology Major</p>
                </div>
              </div>
            </div>
          </div>

          <div className="card bg-base-100 shadow-xl">
            <div className="card-body">
              <div className="rating rating-md mb-4">
                <input
                  type="radio"
                  name="rating-2"
                  className="mask mask-star-2 bg-orange-400"
                  checked
                  readOnly
                />
                <input
                  type="radio"
                  name="rating-2"
                  className="mask mask-star-2 bg-orange-400"
                  checked
                  readOnly
                />
                <input
                  type="radio"
                  name="rating-2"
                  className="mask mask-star-2 bg-orange-400"
                  checked
                  readOnly
                />
                <input
                  type="radio"
                  name="rating-2"
                  className="mask mask-star-2 bg-orange-400"
                  checked
                  readOnly
                />
                <input
                  type="radio"
                  name="rating-2"
                  className="mask mask-star-2 bg-orange-400"
                  checked
                  readOnly
                />
              </div>
              <p className="mb-6">
                "The budget tracker helped me save over $500 last semester. The
                visual charts made it easy to see where I was overspending."
              </p>
              <div className="flex items-center">
                <div className="avatar mr-4">
                  <div className="w-12 rounded-full">
                    <img src="/api/placeholder/48/48" alt="Student" />
                  </div>
                </div>
                <div>
                  <h4 className="font-bold">Michael Chen</h4>
                  <p>Engineering Student</p>
                </div>
              </div>
            </div>
          </div>

          <div className="card bg-base-100 shadow-xl">
            <div className="card-body">
              <div className="rating rating-md mb-4">
                <input
                  type="radio"
                  name="rating-3"
                  className="mask mask-star-2 bg-orange-400"
                  checked
                  readOnly
                />
                <input
                  type="radio"
                  name="rating-3"
                  className="mask mask-star-2 bg-orange-400"
                  checked
                  readOnly
                />
                <input
                  type="radio"
                  name="rating-3"
                  className="mask mask-star-2 bg-orange-400"
                  checked
                  readOnly
                />
                <input
                  type="radio"
                  name="rating-3"
                  className="mask mask-star-2 bg-orange-400"
                  checked
                  readOnly
                />
                <input
                  type="radio"
                  name="rating-3"
                  className="mask mask-star-2 bg-orange-400"
                  checked
                  readOnly
                />
              </div>
              <p className="mb-6">
                "The exam generator is incredible! Being able to set different
                difficulty levels helped me prepare thoroughly for my finals."
              </p>
              <div className="flex items-center">
                <div className="avatar mr-4">
                  <div className="w-12 rounded-full">
                    <img src="/api/placeholder/48/48" alt="Student" />
                  </div>
                </div>
                <div>
                  <h4 className="font-bold">Jessica Williams</h4>
                  <p>Psychology Major</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
      {/* FAQ Section */}
      <section id="faq" className="py-20">
        <h2 className="text-4xl font-bold text-center mb-16">
          Frequently Asked Questions
        </h2>
        <div className="collapse collapse-plus bg-base-100 border border-base-300">
          <input type="radio" name="my-accordion-3" defaultChecked />
          <div className="collapse-title font-semibold">
            How do I create an account?
          </div>
          <div className="collapse-content text-sm">
            Click the "Sign Up" button in the top right corner and follow the
            registration process.
          </div>
        </div>
        <div className="collapse collapse-plus bg-base-100 border border-base-300">
          <input type="radio" name="my-accordion-3" />
          <div className="collapse-title font-semibold">
            I forgot my password. What should I do?
          </div>
          <div className="collapse-content text-sm">
            Click on "Forgot Password" on the login page and follow the
            instructions sent to your email.
          </div>
        </div>
        <div className="collapse collapse-plus bg-base-100 border border-base-300">
          <input type="radio" name="my-accordion-3" />
          <div className="collapse-title font-semibold">
            How do I update my profile information?
          </div>
          <div className="collapse-content text-sm">
            Go to "My Account" settings and select "Edit Profile" to make
            changes.
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
