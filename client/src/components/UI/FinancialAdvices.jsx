import React, { useState, useEffect } from "react";

const finAdvices = [
  "Save at least 20% of your income every month.",
  "Avoid unnecessary debt whenever possible.",
  "Invest early to take advantage of compound interest.",
  "Create an emergency fund covering 3–6 months of expenses.",
  "Track your expenses to understand your spending habits.",
  "Diversify your investments to reduce risk.",
  "Focus on needs before wants when spending.",
  "Review and adjust your financial goals regularly.",
  "Don’t put all your money in one investment.",
  "Build multiple streams of income for stability.",
];

export default function FinancialAdvices() {
  const [adviceIndex, setAdviceIndex] = useState(0);
  const [displayText, setDisplayText] = useState("");
  const [charIndex, setCharIndex] = useState(0);
  const [isDeleting, setIsDeleting] = useState(false);

  useEffect(() => {
    const currentAdvice = finAdvices[adviceIndex];

    let typingSpeed = isDeleting ? 50 : 100;

    if (!isDeleting && charIndex === currentAdvice.length) {
      // Pause before deleting
      typingSpeed = 2000;
      setTimeout(() => setIsDeleting(true), typingSpeed);
      return;
    }

    if (isDeleting && charIndex === 0) {
      setIsDeleting(false);
      setAdviceIndex((prev) => (prev + 1) % finAdvices.length);
    }

    const timeout = setTimeout(() => {
      setDisplayText(
        currentAdvice.substring(0, charIndex + (isDeleting ? -1 : 1))
      );
      setCharIndex((prev) => prev + (isDeleting ? -1 : 1));
    }, typingSpeed);

    return () => clearTimeout(timeout);
  }, [charIndex, isDeleting, adviceIndex]);

  return (
    <div role="alert" className="alert alert-info alert-soft">
      <span>{displayText}</span>
    </div>
  );
}
