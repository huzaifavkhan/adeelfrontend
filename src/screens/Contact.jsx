// src/screens/Contact.jsx
import React, { useState, useEffect } from "react";
import Header from "../components/Header";
import Footer from "../components/Footer";
import {
  HiOutlineMail,
  HiOutlinePhone,
  HiOutlineOfficeBuilding,
} from "react-icons/hi";
import { FaFacebookF, FaInstagram, FaLinkedinIn } from "react-icons/fa";
import background from "/uploads/background1.webp";
import AOS from "aos";
import "aos/dist/aos.css";
import FloatingChatbot from "../components/FloatingChatBot";

export default function Contact() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    subject: "",
    message: "",
  });

  const [errors, setErrors] = useState({});

  useEffect(() => {
    AOS.init({
      duration: 800,
      once: true,
      easing: "ease-in-out",
    });
  }, []);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    if (errors[e.target.name]) {
      setErrors({ ...errors, [e.target.name]: "" });
    }
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData.name.trim()) newErrors.name = "Name is required";
    if (!formData.email.trim()) newErrors.email = "Email is required";
    else if (!/\S+@\S+\.\S+/.test(formData.email))
      newErrors.email = "Please enter a valid email";

    if (!formData.phone.trim()) newErrors.phone = "Phone number is required";
    else if (!/^\+?[\d\s-()]+$/.test(formData.phone))
      newErrors.phone = "Please enter a valid phone number";

    if (!formData.subject.trim()) newErrors.subject = "Subject is required";
    if (!formData.message.trim()) newErrors.message = "Message is required";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (validateForm()) {
      const { name, email, phone, subject, message } = formData;

      // Cleanly formatted WhatsApp message
      const whatsappNumber = "+923008213333";
      const whatsappMessage = 
      `Name: ${name}
Email: ${email}
Phone: ${phone}
Subject: ${subject}
Message: ${message}`;

      const whatsappLink = `https://wa.me/${whatsappNumber.replace(/[^\d]/g, "")}?text=${encodeURIComponent(whatsappMessage)}`;
      window.open(whatsappLink, "_blank");

      // Clear form
      setFormData({
        name: "",
        email: "",
        phone: "",
        subject: "",
        message: "",
      });
    }
  };

  return (
    <>
      <Header />

      <div
        className="min-h-screen flex flex-col py-16 sm:py-20 lg:py-24 bg-contain bg-center bg-no-repeat brockman-font"
        style={{ backgroundImage: `url(${background})` }}
        data-aos="zoom-in" 
      >
        {/* Container with responsive padding */}
        <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col lg:flex-row gap-8 lg:gap-12">
            
            {/* Left Column: Heading + Contact Info + Social Links */}
            <div
              className="flex flex-col justify-start gap-6 lg:w-1/2 mt-8 lg:mt-16"
              data-aos="fade-right"
            >
              <div className="text-center lg:text-left">
                <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-gray-900 mb-3 sm:mb-4 brockman-font">
                  Get in Touch
                </h1>
                <p className="text-gray-600 text-sm sm:text-base lg:text-lg mb-6 lg:mb-10 max-w-md mx-auto lg:mx-0 brockman-font">
                  Have a question or want to work with us? Send a message and we'll
                  get back to you as soon as possible.
                </p>
              </div>

              {/* Contact Info */}
              <div className="flex flex-col gap-4 sm:gap-6">
                <div className="flex items-start gap-3 text-gray-700 text-sm sm:text-base brockman-font">
                  <HiOutlineOfficeBuilding 
                    className="text-pink-500 flex-shrink-0 mt-1" 
                    size={20} 
                  />
                  <span className="leading-relaxed">
                    Khayaban-e-Shahbaz, Phase 6 Defence Housing Authority, Karachi
                  </span>
                </div>
                
                <a 
                  href="mailto:adeel@adeelcorp.com"
                  className="flex items-center gap-3 text-gray-700 hover:text-pink-500 transition-colors text-sm sm:text-base brockman-font"
                >
                  <HiOutlineMail className="text-pink-500 flex-shrink-0" size={20} />
                  <span>adeel@adeelcorp.com</span>
                </a>
                
                <a 
                  href="tel:+923008213333"
                  className="flex items-center gap-3 text-gray-700 hover:text-pink-500 transition-colors text-sm sm:text-base brockman-font"
                >
                  <HiOutlinePhone className="text-pink-500 flex-shrink-0" size={20} />
                  <span>+92 300 8213333</span>
                </a>
              </div>

              {/* Social Links */}
              <div className="flex gap-4 justify-center lg:justify-start">
                <a
                  href="https://facebook.com/share/16xxRo4ePs/?mibextid=wwXIfr"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="p-3 rounded-full bg-rose-50 text-rose-500 hover:bg-rose-500 hover:text-white transition-all duration-300 transform hover:scale-110"
                >
               <FaFacebookF size={18} />
                </a>
                <a
                  href="https://instagram.com/adeelcorporation"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="p-3 rounded-full bg-rose-50 text-rose-500 hover:bg-rose-500 hover:text-white transition-all duration-300 transform hover:scale-110"
                >
                  <FaInstagram size={18} />
                </a>
                <a
                  href="https://www.linkedin.com/company/adeel-corporation/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="p-3 rounded-full bg-rose-50 text-rose-500 hover:bg-rose-500 hover:text-white transition-all duration-300 transform hover:scale-110"
                >
                  <FaLinkedinIn size={18} />
                </a>
              </div>
            </div>

            {/* Right Column: Contact Form Card */}
            <div
              className="flex justify-center lg:justify-end lg:w-1/2 mt-8 lg:mt-0"
              data-aos="fade-left"
            >
              <div className="bg-white rounded-2xl shadow-lg p-6 sm:p-8 w-full max-w-[500px] mx-4 sm:mx-0">
                <form className="flex flex-col gap-4 sm:gap-5" onSubmit={handleSubmit}>
                  
                  {/* Name Field */}
                  <div className="relative" data-aos="fade-up">
                    <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-2 brockman-font">
                      Your Name <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      name="name"
                      value={formData.name}
                      onChange={handleChange}
                      placeholder="How should we address you?"
                      className="w-full bg-transparent border-0 border-b-2 border-gray-300 pb-2 text-sm sm:text-base placeholder-gray-400 focus:outline-none focus:border-orange-500 transition-colors brockman-font"
                    />
                    {errors.name && (
                      <span className="text-red-500 text-xs sm:text-sm mt-1 block brockman-font">
                        {errors.name}
                      </span>
                    )}
                  </div>

                  {/* Phone Field */}
                  <div className="relative" data-aos="fade-up">
                    <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-2 brockman-font">
                      Phone Number <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      name="phone"
                      value={formData.phone}
                      onChange={handleChange}
                      placeholder="Your phone number"
                      className="w-full bg-transparent border-0 border-b-2 border-gray-300 pb-2 text-sm sm:text-base placeholder-gray-400 focus:outline-none focus:border-orange-500 transition-colors brockman-font"
                    />
                    {errors.phone && (
                      <span className="text-red-500 text-xs sm:text-sm mt-1 block brockman-font">
                        {errors.phone}
                      </span>
                    )}
                  </div>

                  {/* Email Field */}
                  <div className="relative" data-aos="fade-up">
                    <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-2 brockman-font">
                      Email Address <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      placeholder="Your email address?"
                      className="w-full bg-transparent border-0 border-b-2 border-gray-300 pb-2 text-sm sm:text-base placeholder-gray-400 focus:outline-none focus:border-orange-500 transition-colors brockman-font"
                    />
                    {errors.email && (
                      <span className="text-red-500 text-xs sm:text-sm mt-1 block brockman-font">
                        {errors.email}
                      </span>
                    )}
                  </div>

                  {/* Subject Field */}
                  <div className="relative" data-aos="fade-up">
                    <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-2 brockman-font">
                      Subject <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      name="subject"
                      value={formData.subject}
                      onChange={handleChange}
                      placeholder="What is this about?"
                      className="w-full bg-transparent border-0 border-b-2 border-gray-300 pb-2 text-sm sm:text-base placeholder-gray-400 focus:outline-none focus:border-orange-500 transition-colors brockman-font"
                    />
                    {errors.subject && (
                      <span className="text-red-500 text-xs sm:text-sm mt-1 block brockman-font">
                        {errors.subject}
                      </span>
                    )}
                  </div>

                  {/* Message Field */}
                  <div className="relative" data-aos="fade-up">
                    <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-2 brockman-font">
                      Your Message <span className="text-red-500">*</span>
                    </label>
                    <div className="w-full max-h-32 overflow-y-auto">
                      <textarea
                        name="message"
                        value={formData.message}
                        onChange={handleChange}
                        placeholder="What would you like to say?"
                        className="w-full bg-transparent border-0 border-b-2 border-gray-300 pb-2 text-sm sm:text-base placeholder-gray-400 focus:outline-none focus:border-orange-500 transition-colors resize-none brockman-font"
                        style={{ minHeight: "4rem" }}
                      ></textarea>
                    </div>
                    {errors.message && (
                      <span className="text-red-500 text-xs sm:text-sm mt-1 block brockman-font">
                        {errors.message}
                      </span>
                    )}
                  </div>

                  {/* Submit Button */}
                    <button
                      type="submit"
                      className="w-full rounded-xl bg-gradient-to-r from-pink-600 via-red-500 to-orange-500 text-white font-medium py-3 text-sm sm:text-base brockman-font
                                transform will-change-transform transition duration-300 ease-in-out hover:-translate-y-1 hover:shadow-xl active:transform-none touch-manipulation"
                    >
                      Send Your Question
                    </button>
                </form>
              </div>
            </div>
          </div>
        </div>
      </div>
      <Footer />
      <FloatingChatbot />
    </>
  );
}