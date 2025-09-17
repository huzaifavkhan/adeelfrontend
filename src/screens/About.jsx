// src/screens/About.jsx
import React, { useEffect } from "react";
import Header from "../components/Header";
import Footer from "../components/Footer";
import { useNavigate } from "react-router-dom";
import AOS from "aos";
import "aos/dist/aos.css";
import { FaArrowRight } from "react-icons/fa";
import FloatingChatbot from "../components/FloatingChatBot";

export default function About() {
  const navigate = useNavigate();

  useEffect(() => {
    AOS.init({
      duration: 1000,
      once: true,
      easing: "ease-out-cubic",
      offset: 50,
      disable: false,
    });
  }, []);

  return (
    <div className="flex flex-col min-h-screen overflow-x-hidden">
      <Header />

      {/* Hero Section */}
      <section
        data-aos="fade-in"
        data-aos-duration="1200"
        className="relative bg-gradient-to-r from-pink-500 to-orange-600 text-white py-16 sm:py-20 lg:py-24 mt-16 sm:mt-18 lg:mt-20 px-4 sm:px-6 lg:px-8 text-center brockman-font"
      >
        <div className="max-w-4xl mx-auto">
          <h1 
            data-aos="fade-up" 
            data-aos-delay="300"
            data-aos-duration="800"
            className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold mb-4 sm:mb-6 brockman-font"
          >
            About Us
          </h1>
          <p 
            data-aos="fade-up" 
            data-aos-delay="500" 
            data-aos-duration="800"
            className="text-sm sm:text-base md:text-lg lg:text-xl max-w-3xl mx-auto leading-relaxed brockman-font"
          >
            We help people find their dream properties with ease. Whether you're looking 
            for a new home, a shop, or an office, our platform connects you to the best 
            listings available.
          </p>
        </div>
      </section>

      {/* Who We Are */}
      <section className="py-12 sm:py-16 lg:py-20 px-4 sm:px-6 lg:px-8 brockman-font overflow-hidden">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col lg:flex-row items-center gap-8 lg:gap-12 xl:gap-16">
            
            {/* Image Section */}
            <div 
              data-aos="fade-right" 
              data-aos-duration="1000"
              data-aos-delay="200"
              data-aos-offset="100"
              className="w-full lg:w-1/2"
            >
              <div className="aspect-[4/3] bg-gradient-to-br from-pink-100 to-orange-100 rounded-2xl shadow-lg flex items-center justify-center transform transition-all duration-500 hover:shadow-2xl hover:scale-105">
                <div className="text-center text-gray-500 p-8 brockman-font">
                  <div className="w-16 h-16 sm:w-20 sm:h-20 mx-auto mb-4 bg-gradient-to-r from-pink-500 to-orange-600 rounded-full flex items-center justify-center transform transition-transform duration-300 hover:rotate-12">
                    <svg className="w-8 h-8 sm:w-10 sm:h-10 text-white" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M4 3a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V5a2 2 0 00-2-2H4zm12 12H4l4-8 3 6 2-4 3 6z" clipRule="evenodd" />
                    </svg>
                  </div>
                  <p className="text-sm sm:text-base brockman-font">About Us Image</p>
                </div>
              </div>
            </div>

            {/* Content Section */}
            <div className="w-full lg:w-1/2 text-center lg:text-left">
              <h2 
                data-aos="fade-up" 
                data-aos-duration="800"
                data-aos-delay="400"
                className="text-2xl sm:text-3xl lg:text-4xl font-bold text-gray-800 mb-4 sm:mb-6 brockman-font bg-gradient-to-r from-pink-600 to-orange-600 bg-clip-text text-transparent"
              >
                Who We Are
              </h2>
              
              <div 
                data-aos="fade-up" 
                data-aos-duration="800"
                data-aos-delay="600"
                className="space-y-4 sm:space-y-6"
              >
                <p className="text-gray-600 text-sm sm:text-base lg:text-lg leading-relaxed brockman-font transform transition-all duration-300 hover:text-gray-800">
                  We are a passionate team dedicated to making property search simple, 
                  reliable, and stress-free. Our goal is to connect buyers, sellers, 
                  and renters through an easy-to-use platform with verified listings.
                </p>
                
                <p 
                  data-aos="fade-up" 
                  data-aos-duration="800"
                  data-aos-delay="800"
                  className="text-gray-600 text-sm sm:text-base lg:text-lg leading-relaxed brockman-font transform transition-all duration-300 hover:text-gray-800"
                >
                  Transparency, trust, and technology are at the heart of everything we do. 
                  With years of expertise, we bring you closer to the property you deserve.
                </p>
              </div>
              
              {/* Optional decorative element */}
              <div 
                data-aos="fade-up" 
                data-aos-duration="600"
                data-aos-delay="1000"
                className="mt-6 sm:mt-8 flex justify-center lg:justify-start"
              >
                <div className="w-16 h-1 bg-gradient-to-r from-pink-500 to-orange-600 rounded-full"></div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Mission & Vision */}
      <section className="bg-gray-50 py-12 sm:py-16 lg:py-20 px-4 sm:px-6 lg:px-8 brockman-font">
        <div className="max-w-6xl mx-auto text-center">
          <h2 
            data-aos="fade-up" 
            data-aos-duration="800"
            data-aos-delay="100"
            className="text-2xl sm:text-3xl lg:text-4xl font-bold text-gray-800 mb-8 sm:mb-12 brockman-font"
          >
            Our Mission & Vision
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 sm:gap-8 lg:gap-10">
            
            {/* Mission Card */}
            <div 
              data-aos="flip-left" 
              data-aos-delay="200" 
              data-aos-duration="1000"
              className="bg-white shadow-lg rounded-2xl p-6 sm:p-8 lg:p-10 hover:shadow-2xl transition-all duration-500 brockman-font group hover:-translate-y-2"
            >
              <div className="mb-4 sm:mb-6">
                <div className="w-12 h-12 sm:w-16 sm:h-16 mx-auto bg-gradient-to-r from-orange-500 to-orange-600 rounded-full flex items-center justify-center mb-4 transform transition-transform duration-300 group-hover:scale-110 group-hover:rotate-12">
                  <svg className="w-6 h-6 sm:w-8 sm:h-8 text-white" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M6 6V5a3 3 0 013-3h2a3 3 0 013 3v1h2a2 2 0 012 2v6a2 2 0 01-2 2H4a2 2 0 01-2-2V8a2 2 0 012-2h2zm10 0H4v6h12V6z" clipRule="evenodd" />
                  </svg>
                </div>
                <h3 className="text-lg sm:text-xl lg:text-2xl font-semibold text-orange-500 mb-3 sm:mb-4 brockman-font transition-colors duration-300 group-hover:text-orange-600">
                  Our Mission
                </h3>
              </div>
              <p className="text-gray-600 text-sm sm:text-base lg:text-lg leading-relaxed brockman-font transition-colors duration-300 group-hover:text-gray-700">
                To simplify property transactions and empower people with the 
                right tools and information to make smarter real estate decisions.
              </p>
            </div>

            {/* Vision Card */}
            <div 
              data-aos="flip-right" 
              data-aos-delay="400" 
              data-aos-duration="1000"
              className="bg-white shadow-lg rounded-2xl p-6 sm:p-8 lg:p-10 hover:shadow-2xl transition-all duration-500 brockman-font group hover:-translate-y-2"
            >
              <div className="mb-4 sm:mb-6">
                <div className="w-12 h-12 sm:w-16 sm:h-16 mx-auto bg-gradient-to-r from-pink-600 to-pink-700 rounded-full flex items-center justify-center mb-4 transform transition-transform duration-300 group-hover:scale-110 group-hover:rotate-12">
                  <svg className="w-6 h-6 sm:w-8 sm:h-8 text-white" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M10 12a2 2 0 100-4 2 2 0 000 4z" />
                    <path fillRule="evenodd" d="M.458 10C1.732 5.943 5.522 3 10 3s8.268 2.943 9.542 7c-1.274 4.057-5.064 7-9.542 7S1.732 14.057.458 10zM14 10a4 4 0 11-8 0 4 4 0 018 0z" clipRule="evenodd" />
                  </svg>
                </div>
                <h3 className="text-lg sm:text-xl lg:text-2xl font-semibold text-pink-600 mb-3 sm:mb-4 brockman-font transition-colors duration-300 group-hover:text-pink-700">
                  Our Vision
                </h3>
              </div>
              <p className="text-gray-600 text-sm sm:text-base lg:text-lg leading-relaxed brockman-font transition-colors duration-300 group-hover:text-gray-700">
                To be the most trusted and user-friendly property platform, 
                connecting communities and shaping the future of real estate.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Call to Action */}
      <section
        data-aos="zoom-in-up"
        data-aos-duration="1000"
        data-aos-delay="200"
        className="bg-white text-gray-800 py-12 sm:py-16 lg:py-20 px-4 sm:px-6 lg:px-8 text-center brockman-font"
      >
        <div className="max-w-4xl mx-auto">
          <h2 
            data-aos="fade-up" 
            data-aos-delay="400" 
            data-aos-duration="800"
            className="text-xl sm:text-2xl lg:text-3xl font-bold mb-4 sm:mb-6 brockman-font bg-gradient-to-r from-orange-500 to-pink-600 bg-clip-text text-transparent"
          >
            Ready to Find Your Dream Property?
          </h2>
          <p 
            data-aos="fade-up" 
            data-aos-delay="600" 
            data-aos-duration="800"
            className="text-sm sm:text-base text-gray-600 leading-relaxed max-w-2xl mx-auto mb-6 sm:mb-8 brockman-font"
          >
            Explore thousands of verified listings and connect with property owners today.
          </p>
          
          <div 
            data-aos="zoom-in" 
            data-aos-delay="800"
            data-aos-duration="600"
          >
            <button
              onClick={() => navigate("/properties")}
              className="inline-flex items-center gap-2 bg-gradient-to-r from-orange-500 to-pink-600 text-white font-semibold 
                        px-6 sm:px-8 lg:px-10 py-3 sm:py-4 rounded-full shadow-lg text-sm sm:text-base
                        transform transition-all duration-500 ease-out hover:-translate-y-2 hover:shadow-2xl hover:scale-105
                        active:transform-none touch-manipulation focus:outline-none focus:ring-4 focus:ring-pink-300 brockman-font
                        relative overflow-hidden group"
            >
              <span className="absolute inset-0 w-full h-full bg-gradient-to-r from-pink-600 to-orange-500 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></span>
              <span className="relative z-10 flex items-center gap-2">
                Browse Properties
                <FaArrowRight className="w-4 h-4 transform transition-transform duration-300 group-hover:translate-x-1" />
              </span>
            </button>
          </div>
        </div>
      </section>
      <Footer />
      <FloatingChatbot />
    </div>
  );
}