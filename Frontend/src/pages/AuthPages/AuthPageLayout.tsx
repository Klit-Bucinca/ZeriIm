import React from "react";
import GridShape from "../../components/common/GridShape";
import ThemeTogglerTwo from "../../components/common/ThemeTogglerTwo";

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="relative p-6 bg-white z-1 dark:bg-gray-900 sm:p-0">
      <div className="relative flex flex-col justify-center w-full h-screen lg:flex-row dark:bg-gray-900 sm:p-0">
        {children}
        {/* Background Image Section */}
        <div
          className="items-center hidden w-full h-full lg:w-1/2 bg-cover bg-center lg:grid"
          style={{ backgroundImage: `url('/images/Bc-sign.png')` }}
        >
          <div className="relative flex items-center justify-center z-1 bg-black/12 w-full h-full">
            {/* Optional Grid Shape */}
            <GridShape />
          </div>
        </div>

        {/* Theme Toggler */}
        <div className="fixed z-50 hidden bottom-6 right-6 sm:block">
          <ThemeTogglerTwo />
        </div>
      </div>
    </div>
  );
}
