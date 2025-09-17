// src/components/Header.jsx
import React, { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import logo from "/uploads/logo.png";
import { FaPhone, FaBars, FaTimes } from "react-icons/fa";

export default function Header() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const location = useLocation();

  // Get the current route path for highlighting
  const currentPath = location.pathname.replace("/", "") || "home";

  // Scroll effect for header background
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 50);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // Handle mobile menu resize
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 768) {
        setMobileMenuOpen(false);
      }
    };
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  return (
    <>
      {/* Header */}
      <header
        className={`fixed top-0 left-0 w-full z-50 transition-all duration-300 ${
          scrolled
            ? "sm:bg-white/80 sm:backdrop-blur sm:shadow-sm bg-white"
            : "sm:bg-white sm:shadow-sm bg-white"
        }`}
      >
        <div className="flex items-center justify-between h-18 w-full">
          {/* Logo */}
          <div className="flex-shrink-0 h-20">
            <Link to="/home">
              <img
                src={logo}
                alt="Logo"
                className="h-auto w-24 object-contain"
              />
            </Link>
          </div>

          {/* Navigation */}
          <nav className="hidden md:flex items-center gap-8 text-base font-semibold absolute left-1/2 transform -translate-x-1/2">
            {["Home", "About", "Properties", "Projects", "Contact"].map(
              (item) => {
                const key = item.toLowerCase().replace(/\s+/g, "");
                const isActive = currentPath === key;
                const displayName = item === "Contact" ? "Contact Us" : item;

                const baseClasses =
                  "relative pb-1 transition-all duration-300 text-gray-600 hover:text-transparent hover:bg-clip-text hover:bg-gradient-to-r hover:from-pink-600 hover:via-red-500 hover:to-orange-500";

                const underlineClasses = `
                  after:content-['']
                  after:absolute
                  after:left-0
                  after:bottom-0
                  after:h-[2px]
                  after:w-full
                  after:origin-left
                  after:scale-x-0
                  after:bg-gradient-to-r
                  after:from-pink-600
                  after:via-red-500
                  after:to-orange-500
                  after:transition-transform
                  after:duration-300
                  hover:after:scale-x-100
                  ${isActive ? "after:scale-x-100" : ""}
                `;

                const activeTextClasses = isActive
                  ? "text-transparent bg-clip-text bg-gradient-to-r from-pink-600 via-red-500 to-orange-500"
                  : "";

                const combinedClass = `${baseClasses} ${underlineClasses} ${activeTextClasses}`;

                return (
                  <Link key={key} to={`/${key}`} className={combinedClass}>
                    {displayName}
                  </Link>
                );
              }
            )}
          </nav>

          {/* Phone number and Mobile Menu Button */}
          <div className="flex items-center gap-2 mr-2 md:mr-4">
            {/* Phone number */}
            <div className="flex items-center gap-2 text-rose-500 font-semibold text-xs md:text-base">
              <FaPhone className="hidden sm:inline h-4 w-4" style={{ transform: "rotateY(180deg)" }} />
              <span className="hidden sm:inline">+92 300 8213333</span>
            </div>

            {/* Mobile Menu Button */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="md:hidden p-2 text-gray-600 hover:text-gray-900 transition-colors duration-300"
              aria-label="Toggle mobile menu"
            >
              {mobileMenuOpen ? (
                <FaTimes className="h-5 w-5" />
              ) : (
                <FaBars className="h-5 w-5" />
              )}
            </button>
          </div>
        </div>

        {/* Mobile Navigation Menu */}
        <div
          className={`md:hidden absolute top-full left-0 right-0 shadow-lg transition-all duration-300 ease-in-out
            ${mobileMenuOpen ? "opacity-100 visible translate-y-0" : "opacity-0 invisible -translate-y-2"}
            ${scrolled && mobileMenuOpen ? "bg-white" : "bg-white"}
          `}
        >

          <div className="px-4 py-2">
            {["Home", "About", "Properties", "Projects", "Contact"].map(
              (item) => {
                const key = item.toLowerCase().replace(/\s+/g, "");
                const isActive = currentPath === key;
                const displayName = item === "Contact" ? "Contact Us" : item;

                const mobileActiveClasses = isActive
                  ? "text-transparent bg-clip-text bg-gradient-to-r from-pink-600 via-red-500 to-orange-500 font-semibold"
                  : "text-gray-600";

                return (
                  <Link
                    key={key}
                    to={`/${key}`}
                    onClick={() => setMobileMenuOpen(false)}
                    className={`block px-4 py-3 text-base font-medium transition-all duration-300 hover:text-transparent hover:bg-clip-text hover:bg-gradient-to-r hover:from-pink-600 hover:via-red-500 hover:to-orange-500 ${mobileActiveClasses}`}
                  >
                    {displayName}
                  </Link>
                );
              }
            )}
            
            {/* Mobile Phone Number */}
            <div className="pt-2 border-t border-gray-200">
              <div className="flex items-center gap-2 px-4 py-2 text-rose-500 font-semibold text-base">
                <FaPhone className="h-4 w-4" style={{ transform: "rotateY(180deg)" }} />
                <span>+92 300 8213333</span>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Mobile Menu Backdrop */}
      {mobileMenuOpen && (
        <div
          className="fixed inset-0 bg-black/20 backdrop-blur-sm z-40 md:hidden"
          onClick={() => setMobileMenuOpen(false)}
        />
      )}
    </>
  );
}