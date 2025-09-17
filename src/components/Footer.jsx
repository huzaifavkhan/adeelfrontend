// src/components/Footer.jsx
import React from "react";
import { FaFacebookF, FaInstagram, FaLinkedinIn } from "react-icons/fa";
import { HiOutlineMail, HiOutlinePhone, HiOutlineOfficeBuilding } from "react-icons/hi";
import { Link } from "react-router-dom";
import logo from "/uploads/logo-white.png";

export default function Footer() {
  return (
    <footer id="contact" className="bg-[#2B2B2B] text-white w-full">
      <div className="px-6 lg:px-12 py-6">
        {/* Grid for 3 columns */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Left column */}
          <div className="flex flex-col items-start text-left">
            <img src={logo} alt="Adeel Corporation" className="h-24 w-auto sm:-mt-2 -ml-5" />
            <p className="text-sm text-gray-300 max-w-xs mt-2">
              Trusted property solutions across Karachi. Apartments, homes, shops, plots & more.
            </p>
          </div>

          {/* Center column */}
          <div className="flex flex-col items-start text-left md:items-center md:text-center">
            <h3 className="font-semibold">GET IN TOUCH</h3>
            <ul className="mt-4 space-y-2 text-sm text-gray-300">
              <li className="flex items-center gap-2 md:justify-center">
                <HiOutlineOfficeBuilding /> Khayaban-e-Shahbaz, Phase 6 Defence Housing Authority
              </li>
              <li className="flex items-center gap-2 md:justify-center">
                <HiOutlineMail /> adeel@adeelcorp.com
              </li>
              <li className="flex items-center gap-2 md:justify-center">
                <HiOutlinePhone /> +92 300 8213333
              </li>
            </ul>
          </div>

          {/* Right column */}
          <div className="flex flex-col items-start text-left md:items-end md:text-left">
            <div className="w-full md:w-auto">
              <h3 className="font-semibold">COMPANY</h3>
              <ul className="mt-4 space-y-2 text-sm text-gray-300">
                <li>
                  <a href="/terms" className="hover:text-white transition-colors">
                    Terms & Conditions
                  </a>
                </li>
                <li>
                  <a href="/privacy" className="hover:text-white transition-colors">
                    Privacy Policy
                  </a>
                </li>
                <li>
                  <Link to="/contact" className="hover:text-white transition-colors">
                    Support
                  </Link>
                </li>
              </ul>

              {/* Social Icons */}
              <div className="mt-4 flex gap-2">
                <a
                  href="https://facebook.com/share/16xxRo4ePs/?mibextid=wwXIfr"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-8 h-8 flex items-center justify-center rounded-full border border-white hover:bg-white hover:text-black transition transform hover:scale-110 shadow-md"
                >
                  <FaFacebookF size={16} />
                </a>
                <a
                  href="https://instagram.com/adeelcorporation"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-8 h-8 flex items-center justify-center rounded-full border border-white hover:bg-white hover:text-black transition transform hover:scale-110 shadow-md"
                >
                  <FaInstagram size={16} />
                </a>
                <a
                  href="https://www.linkedin.com/company/adeel-corporation/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-8 h-8 flex items-center justify-center rounded-full border border-white hover:bg-white hover:text-black transition transform hover:scale-110 shadow-md"
                >
                  <FaLinkedinIn size={16} />
                </a>
              </div>
            </div>
          </div>
        </div>

        {/* Copyright */}
        <div className="mt-6 text-xs text-gray-400 text-center border-t border-gray-600 pt-4">
          © {new Date().getFullYear()} Adeel Corporation. All rights reserved.
        </div>
      </div>
    </footer>
  );
}
