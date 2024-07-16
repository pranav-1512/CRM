import React, { useState } from "react";

const LoadingWrapper = ({ children }) => {
  const [isLoading, setIsLoading] = useState(true);

  // Simulate API call delay
  setTimeout(() => {
    setIsLoading(false);
  }, 2000);

  return isLoading ? (
    <div className="flex space-x-2 justify-center items-center h-screen">
      <span className="sr-only">Loading...</span>
      <div
        className="h-8 w-8 rounded-full animate-bounce"
        style={{ animationDelay: "-0.3s", backgroundColor: "transparent" }}
      ></div>
      <div
        className="h-8 w-8 rounded-full animate-bounce"
        style={{ animationDelay: "-0.15s", backgroundColor: "transparent" }}
      ></div>
      <div
        className="h-8 w-8 rounded-full animate-bounce"
        style={{ backgroundColor: "transparent" }}
      ></div>
    </div>
  ) : (
    <>{children}</>
  );
};

export default LoadingWrapper;
