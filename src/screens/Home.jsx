// Home.jsx
import React, { useMemo, useState, useEffect } from "react";
import background from "/uploads/background.jpg";
import logo from "/uploads/logo.png";
import Footer from "../components/Footer";
import { FaPhone, FaHome, FaDollarSign, FaHandshake } from "react-icons/fa";
import { FaBed, FaBath, FaRulerCombined } from "react-icons/fa";
import { NavLink, useNavigate } from "react-router-dom";
import AOS from "aos";
import "aos/dist/aos.css";
import CustomDropdown from "../components/CustomDropdown";
import { FaMapMarkerAlt, FaRegImage, FaVideo} from "react-icons/fa";
import { FaBars, FaTimes } from "react-icons/fa";
import FloatingChatbot from "../components/FloatingChatBot";


// Format number into PKR scale (Thousand, Lakh, Crore, Arab)
function formatPKR(num) {
  if (!num) return "";
  if (num < 1000) return `<${num}`;
  if (num < 100000) return `<${(num / 1000)} Thousand`;
  if (num < 10000000) return `<${(num / 100000)} Lakh`;
  if (num < 1000000000) return `<${(num / 10000000)} Crore`;
  return `<${(num / 1000000000)} Arab`;
}

// ---------------- Header ----------------
// Updated Header component for Home.jsx
function Header() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 30);
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

  const linkClasses = ({ isActive }) => {
    const base =
      "relative pb-1 transition-all duration-300 hover:text-transparent hover:bg-clip-text hover:bg-gradient-to-r hover:from-pink-600 hover:via-red-500 hover:to-orange-500";
    const underline = `
      after:content-['']
      after:absolute
      after:left-0 after:bottom-0
      after:h-[2px] after:w-full
      after:origin-left
      after:scale-x-0
      after:bg-gradient-to-r after:from-pink-600 after:via-red-500 after:to-orange-500
      after:transition-transform after:duration-300
      hover:after:scale-x-100
    `;
    const activeText = isActive
      ? "text-transparent bg-clip-text bg-gradient-to-r from-pink-600 via-red-500 to-orange-500 after:scale-x-100"
      : scrolled
      ? "text-gray-600"
      : "text-white";
    return `${base} ${underline} ${activeText}`;
  };

  return (
    <>
      <header
        className={`fixed top-0 left-0 w-full z-50 transition-all duration-300 ${
          scrolled 
            ? "md:bg-white/80 md:backdrop-blur md:shadow-sm bg-white shadow-sm" 
            : "md:bg-transparent bg-white md:shadow-none shadow-sm"
        }`}
      >
        <div className="flex items-center justify-between h-18 w-full">
          {/* Logo */}
          <div className="flex-shrink-0 ml-0 h-20">
            <img src={logo} alt="Logo" className="h-auto w-24 object-contain" />
          </div>

          {/* Navigation */}
          <nav className="hidden md:flex items-center gap-8 text-base font-semibold absolute left-1/2 transform -translate-x-1/2">
            <NavLink to="/home" className={linkClasses} end>
              Home
            </NavLink>
            <NavLink to="/about" className={linkClasses} end>
              About
            </NavLink>
            <NavLink to="/properties" className={linkClasses}>
              Properties
            </NavLink>
            <NavLink to="/projects" className={linkClasses}>
              Projects
            </NavLink>
            <NavLink to="/contact" className={linkClasses} end>
              Contact Us
            </NavLink>
          </nav>

          {/* Phone Contact and Mobile Menu Button */}
          <div className="flex items-center gap-2 mr-2 md:mr-4">
            {/* Phone Contact */}
            <div className={`flex items-center gap-2 font-semibold text-xs md:text-base transition-colors duration-300 ${
              scrolled ? "text-rose-500" : "md:text-rose-500 text-rose-500"
            }`}>
              <FaPhone className="hidden sm:inline h-4 w-4" style={{ transform: "rotateY(180deg)" }} />
              <span className="hidden sm:inline">+92 300 8213333</span>
            </div>

            {/* Mobile Menu Button */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className={`md:hidden p-2 transition-colors duration-300 ${
                scrolled ? "text-gray-600 hover:text-gray-900" : "text-gray-600 hover:text-gray-900"
              }`}
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
          className={`md:hidden absolute top-full left-0 right-0 shadow-lg transition-all duration-300 ease-in-out bg-white
            ${mobileMenuOpen ? "opacity-100 visible translate-y-0" : "opacity-0 invisible -translate-y-2"}
          `}
        >
          <div className="px-4 py-2">
            <NavLink
              to="/home"
              onClick={() => setMobileMenuOpen(false)}
              className={({ isActive }) => 
                `block px-4 py-3 text-base font-medium transition-all duration-300 hover:text-transparent hover:bg-clip-text hover:bg-gradient-to-r hover:from-pink-600 hover:via-red-500 hover:to-orange-500 ${
                  isActive
                    ? "text-transparent bg-clip-text bg-gradient-to-r from-pink-600 via-red-500 to-orange-500 font-semibold"
                    : "text-gray-600"
                }`
              }
            >
              Home
            </NavLink>
            <NavLink
              to="/about"
              onClick={() => setMobileMenuOpen(false)}
              className={({ isActive }) => 
                `block px-4 py-3 text-base font-medium transition-all duration-300 hover:text-transparent hover:bg-clip-text hover:bg-gradient-to-r hover:from-pink-600 hover:via-red-500 hover:to-orange-500 ${
                  isActive
                    ? "text-transparent bg-clip-text bg-gradient-to-r from-pink-600 via-red-500 to-orange-500 font-semibold"
                    : "text-gray-600"
                }`
              }
            >
              About
            </NavLink>
            <NavLink
              to="/properties"
              onClick={() => setMobileMenuOpen(false)}
              className={({ isActive }) => 
                `block px-4 py-3 text-base font-medium transition-all duration-300 hover:text-transparent hover:bg-clip-text hover:bg-gradient-to-r hover:from-pink-600 hover:via-red-500 hover:to-orange-500 ${
                  isActive
                    ? "text-transparent bg-clip-text bg-gradient-to-r from-pink-600 via-red-500 to-orange-500 font-semibold"
                    : "text-gray-600"
                }`
              }
            >
              Properties
            </NavLink>
            <NavLink
              to="/projects"
              onClick={() => setMobileMenuOpen(false)}
              className={({ isActive }) => 
                `block px-4 py-3 text-base font-medium transition-all duration-300 hover:text-transparent hover:bg-clip-text hover:bg-gradient-to-r hover:from-pink-600 hover:via-red-500 hover:to-orange-500 ${
                  isActive
                    ? "text-transparent bg-clip-text bg-gradient-to-r from-pink-600 via-red-500 to-orange-500 font-semibold"
                    : "text-gray-600"
                }`
              }
            >
              Projects
            </NavLink>
            <NavLink
              to="/contact"
              onClick={() => setMobileMenuOpen(false)}
              className={({ isActive }) => 
                `block px-4 py-3 text-base font-medium transition-all duration-300 hover:text-transparent hover:bg-clip-text hover:bg-gradient-to-r hover:from-pink-600 hover:via-red-500 hover:to-orange-500 ${
                  isActive
                    ? "text-transparent bg-clip-text bg-gradient-to-r from-pink-600 via-red-500 to-orange-500 font-semibold"
                    : "text-gray-600"
                }`
              }
            >
              Contact Us
            </NavLink>
            
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


// ---------------- Hero ----------------
function Hero({ onSearch, filters, setFilters }) {
  const navigate = useNavigate();

  // Determine area unit based on property type
  const areaLabel =
    filters.propertyType === "Apartment" ||
    filters.propertyType === "Office" ||
    filters.propertyType === "Shop"
      ? "Area (Sq. Ft.)"
      : "Area (Sq. Yd.)";

  return (
    <section
      data-aos="fade-in"
      className="relative bg-cover bg-center min-h-[70vh] flex items-center"
      style={{ backgroundImage: `url(${background})` }}
    >
      <div className="absolute inset-0 bg-black/40" />
      <div className="relative z-10 mx-auto max-w-4xl px-4 sm:px-6 lg:px-8 py-24 text-center">
        <h1 data-aos="fade-up" className="text-4xl md:text-5xl font-bold tracking-tight text-white brockman-font">
          Find your next property — fast.
        </h1>
        <p data-aos="fade-up" data-aos-delay="200" className="mt-4 text-gray-200 max-w-prose mx-auto brockman-font">
          Minimalist search. Real results. Browse apartments, houses, plots, and
          commercial spaces across Karachi.
        </p>

        <div
          data-aos="zoom-in"
          data-aos-delay="400"
          className="mt-10 bg-white rounded-2xl shadow-lg border border-orange-100 p-6 w-full"
        >
          <div className="grid md:grid-cols-2 gap-3">
            <CustomDropdown
              label={<p className="brockman-font">Property Type</p>}
              value={filters.propertyType}
              onChange={(v) => setFilters((f) => ({ ...f, propertyType: v }))}
              options={["Any", "Apartment", "House", "Plot", "Shop", "Office"]}
            />

            <CustomDropdown
              label={<p className="brockman-font">Purpose</p>}
              value={filters.purpose}
              onChange={(v) => setFilters((f) => ({ ...f, purpose: v }))}
              options={["Any", "Sale", "Rent"]}
            />

            <div>
              <label className="block text-xs text-gray-600 mb-1 brockman-font">
            {areaLabel}  </label>
              <input
                type="number"
                value={filters.maxArea || ""}
                onChange={(e) => {
                  setFilters((f) => ({
                    ...f,
                    maxArea: e.target.value ? Number(e.target.value) : "",
                  }));
                }}
                placeholder="Enter area"
                className="w-full rounded-xl border border-orange-200 px-3 py-1.5 focus:outline-none focus:ring-2 focus:ring-orange-500"
              />
            </div>

            <div>
              <label className="block text-xs text-gray-600 mb-1 brockman-font">Max Price (PKR)</label>
              <input
                type="number"
                value={filters.maxPrice || ""}
                onChange={(e) =>
                  setFilters((f) => ({
                    ...f,
                    maxPrice: Number(e.target.value) || undefined,
                  }))
                }
                placeholder="e.g. 50000000"
                className="w-full rounded-xl border border-orange-200 px-3 py-1.5 focus:outline-none focus:ring-2 focus:ring-orange-500"
              />
              {filters.maxPrice && (
                <p className="text-xs text-gray-500 mt-1 text-left brockman-font">{formatPKR(filters.maxPrice)}</p>
              )}
            </div>

            <div className="md:col-span-2">
              <button
                onClick={() => {
                  onSearch();
                  navigate("/properties", { state: { filters } });
                }}
                className="w-full rounded-xl bg-gradient-to-r from-pink-600 via-red-500 to-orange-500 
                  text-white font-medium py-2.5 brockman-font
                  transform transition-transform duration-300 ease-in-out
                  hover:-translate-y-1 hover:shadow-xl hover:opacity-90"
              >
                Search Properties
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}


// ---------------- ListingCard ----------------
function ListingCard({ p }) {
  const navigate = useNavigate();
  const img =
    p.images && p.images.length > 0
      ? p.images[0].url
      : "https://via.placeholder.com/400x200?text=No+Image";

  return (
    <div
      onClick={() => navigate(`/properties/${p.id}`, { state: { property: p } })}
      className="bg-white rounded-xl group shadow-sm overflow-hidden hover:shadow-md transition-all duration-300 cursor-pointer transform hover:-translate-y-1 brockman-font"
    >
      {/* Image Section */}
      <div className="relative group">
        <img
          src={img}
          alt={p.property_name}
          className="w-full h-32 sm:h-36 object-cover transition-transform duration-500 group-hover:scale-105"
        />

        {/* Purpose Badge */}
        <div className="absolute top-2 left-2 bg-red-600 text-white text-xs font-semibold px-2 py-0.5 rounded-full shadow-md brockman-font">
          FOR {p.purpose?.toUpperCase()}
        </div>

        {/* Location (bottom-left) */}
        <div className="absolute bottom-2 left-2 flex items-center bg-black/70 text-white text-xs px-1.5 py-0.5 rounded backdrop-blur-sm">
          <FaMapMarkerAlt className="mr-1 text-pink-400 flex-shrink-0 text-xs" />
          <span className="font-medium truncate max-w-28 brockman-font">{p.location}</span>
        </div>

        {/* Media Counts (bottom-right) */}
        <div className="absolute bottom-2 right-2 flex items-center gap-0.5">
          <div className="flex items-center bg-black/70 text-white text-xs px-1.5 py-0.5 rounded backdrop-blur-sm">
            <FaRegImage className="mr-0.5 flex-shrink-0 text-xs" />
            <span className="brockman-font text-xs">{p.images?.length || 0}</span>
          </div>
          <div className="flex items-center bg-black/70 text-white text-xs px-1.5 py-0.5 rounded backdrop-blur-sm">
            <FaVideo className="mr-0.5 flex-shrink-0 text-xs" />
            <span className="brockman-font text-xs">{p.videos?.length || 0}</span>
          </div>
        </div>
      </div>

      {/* Info Section */}
      <div className="p-3">
        {/* Price */}
        <p className="text-gray-900 text-sm sm:text-base font-bold mb-1 brockman-font">
          <span className="text-xs mr-1">PKR</span>
          {p.price}
        </p>

        {/* Property name */}
        <h2 className="text-xs sm:text-sm font-semibold text-gray-800 mb-2 line-clamp-1 brockman-font">
          {p.property_name}
        </h2>

        {/* Features */}
        <div className="flex items-center text-xs text-gray-500 gap-3 mb-2">
          {/* Beds */}
          {p.beds &&
            !["n/a", "-", "0"].includes(String(p.beds).trim().toLowerCase()) && (
              <span className="flex items-center gap-0.5">
                <FaBed className="h-3 w-3 flex-shrink-0" />
                <span className="brockman-font">Bed: {p.beds}</span>
              </span>
            )}

          {/* Baths */}
          {p.baths &&
            !["n/a", "-", "0"].includes(String(p.baths).trim().toLowerCase()) && (
              <span className="flex items-center gap-0.5">
                <FaBath className="h-3 w-3 flex-shrink-0" />
                <span className="brockman-font">Bath: {p.baths}</span>
              </span>
            )}

          {/* Area */}
          <span className="flex items-center gap-0.5">
            <FaRulerCombined className="h-3 w-3 flex-shrink-0" />
            <span className="brockman-font text-xs">
              {Number(p.area_size).toLocaleString()}{" "}
              {p?.property_type?.toLowerCase() === "apartment" ||
              p?.property_type?.toLowerCase() === "office" ||
              p?.property_type?.toLowerCase() === "shop"
                ? " Sq.Ft"
                : " Sq.Yd"}
            </span>
          </span>
        </div>

        {/* Description */}
        <p className="text-gray-600 text-xs leading-relaxed line-clamp-2 brockman-font">
          {p.description || "Premium property in excellent location with modern amenities and facilities."}
        </p>
      </div>
    </div>
  );
}



// ---------------- Focus Section ----------------
function Focus() {
  const navigate = useNavigate();

  return (
    <section className="bg-gradient-to-b from-white via-orange-50 to-white py-16 brockman-font">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 text-center">
        <span
          data-aos="fade-up"
          className="inline-block bg-gradient-to-r from-pink-500 via-red-500 to-orange-500 text-white px-4 py-1 rounded-full text-sm font-medium mb-4 brockman-font"
        >
          Our Services
        </span>
        <h2
          data-aos="fade-up"
          data-aos-delay="200"
          className="text-3xl md:text-4xl font-bold text-gray-900 mb-12 brockman-font"
        >
          Our Main Focus
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Buy a home */}
          <div
            data-aos="zoom-in"
            className="rounded-2xl bg-white p-8 shadow-sm border border-orange-100 hover:shadow-lg transition"
          >
            <div className="flex items-center justify-center mb-4">
              <div className="p-4 rounded-full bg-orange-50">
                <FaHome className="h-12 w-12 text-orange-500" />
              </div>
            </div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2 brockman-font">Buy a Property</h3>
            <p className="text-gray-600 text-sm mb-4 brockman-font">
              Over 1 million+ homes for sale available on the website. We can match you with a house you'll want to call home.
            </p>
            <button
              onClick={() =>
                navigate("/properties", {
                  state: { filters: { purpose: "Sale" } },
                })
              }
              className="text-orange-600 hover:text-orange-700 font-medium text-sm brockman-font"
            >
              Find A Property →
            </button>
          </div>

          {/* Rent a home */}
          <div
            data-aos="zoom-in"
            data-aos-delay="200"
            className="rounded-2xl bg-white p-8 shadow-sm border border-orange-100 hover:shadow-lg transition"
          >
            <div className="flex items-center justify-center mb-4">
              <div className="p-4 rounded-full bg-orange-50">
                <FaDollarSign className="h-12 w-12 text-orange-500" />
              </div>
            </div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2 brockman-font">Rent a Property</h3>
            <p className="text-gray-600 text-sm mb-4 brockman-font">
              Browse thousands of houses and apartments for rent. We'll help you find the perfect place to live.
            </p>
            <button
              onClick={() =>
                navigate("/properties", {
                  state: { filters: { purpose: "Rent" } },
                })
              }
              className="text-orange-600 hover:text-orange-700 font-medium text-sm brockman-font"
            >
              Rent a Property →
            </button>
          </div>

          {/* Sell a home */}
          <div
            data-aos="zoom-in"
            data-aos-delay="400"
            className="rounded-2xl bg-white p-8 shadow-sm border border-orange-100 hover:shadow-lg transition"
          >
            <div className="flex items-center justify-center mb-4">
              <div className="p-4 rounded-full bg-orange-50">
                <FaHandshake className="h-12 w-12 text-orange-500" />
              </div>
            </div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2 brockman-font">Sell a Property</h3>
            <p className="text-gray-600 text-sm mb-4 brockman-font">
              Over 1 million+ buyers are waiting. We can match your property with the right person fast.
            </p>
            <button
              onClick={() => navigate("/contact")}
              className="text-orange-600 hover:text-orange-700 font-medium text-sm brockman-font"
            >
              Contact Us →
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}


// ---------------- Listings ----------------
function Listings({ properties }) {
  // Get the 12 most recent properties
  const recentProperties = useMemo(() => {
    if (!properties || properties.length === 0) return [];

    // Sort by created_at date (most recent first) and take first 12
    return [...properties]
      .sort((a, b) => {
        const dateA = new Date(a.created_at || a.createdAt || 0);
        const dateB = new Date(b.created_at || b.createdAt || 0);
        return dateB - dateA;
      })
      .slice(0, 12);
  }, [properties]);

  return (
    <section
      id="listings"
      className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-10 brockman-font"
    >
      {/* Header Section */}
      <div 
        className="flex flex-col md:flex-row md:items-end md:justify-between gap-4 mb-6"
        data-aos="fade-up"
      >
        <div>
          <h2 className="text-2xl md:text-3xl font-bold text-gray-900 brockman-font">
            Recent Listings
          </h2>
          <p className="text-gray-600 text-sm mt-1 brockman-font">
            Most recent properties added to our collection
          </p>
        </div>
        
        {/* View all button */}
        <NavLink 
          to="/properties" 
          className="text-lg md:text-xl text-orange-700 hover:text-orange-800 md:self-end brockman-font"
        >
          View all →
        </NavLink>
      </div>

      {/* Properties Grid - matches Properties page tile view */}
      {recentProperties.length > 0 ? (
        <div className="grid gap-3 sm:gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5">
          {recentProperties.map((p) => (
            <ListingCard key={p.id} p={p} />
          ))}
        </div>
      ) : (
        <div className="text-center py-12">
          <div className="text-gray-400 text-6xl mb-4">🏠</div>
          <p className="text-xl text-gray-600 mb-2 brockman-font">No properties available</p>
          <p className="text-gray-500 brockman-font">Check back soon for new listings</p>
        </div>
      )}
    </section>
  );
}

// ---------------- How It Works ----------------
function HowItWorks() {
  const steps = [
    {
      num: 1,
      title: "Find Your Property",
      desc: "Use our search to discover properties matching your exact needs. Filter by location, price, area and more.",
      icon: "🔍",
    },
    {
      num: 2,
      title: "Schedule a Visit",
      desc: "Book an in-person viewing of your selected properties at your convenience.",
      icon: "📅",
    },
    {
      num: 3,
      title: "Close the Deal",
      desc: "Complete the required paperwork, get expert guidance from our agents, and secure your dream property with ease.",
      icon: "📄",
    },
  ];

  return (
    <section className="bg-gradient-to-b from-white via-orange-50 to-white py-16 brockman-font">
      <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8 text-center">
        <h2
          data-aos="fade-up"
          className="text-3xl md:text-4xl font-bold text-gray-900 mb-12 brockman-font"
        >
          How It Works
        </h2>

        <div className="flex flex-col md:flex-row items-start justify-center gap-12 relative">
          {steps.map((s, i) => (
            <div
              key={i}
              data-aos="fade-up"
              data-aos-delay={i * 200}
              className="flex-1 flex flex-col items-center text-center relative"
            >
              {/* Number bubble */}
              <div className="flex items-center justify-center w-10 h-10 rounded-full bg-gradient-to-r from-rose-500 to-orange-500 text-white font-bold mb-4 brockman-font">
                {s.num}
              </div>

              {/* Icon box */}
              <div className="flex items-center justify-center w-20 h-20 rounded-2xl bg-white shadow-md border border-gray-100 mb-4">
                <span className="text-3xl">{s.icon}</span>
              </div>

              {/* Title & desc */}
              <h3 className="text-lg font-semibold text-gray-900 mb-2 brockman-font">
                {s.title}
              </h3>
              <p className="text-sm text-gray-600 brockman-font">{s.desc}</p>

              {/* Connector line (for desktop) */}
              {i < steps.length - 1 && (
                <div className="hidden md:block absolute top-12 right-[-6rem] w-24 h-[2px] bg-gradient-to-r from-rose-500 to-orange-500"></div>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

// ---------------- Main Page ----------------
export default function Home() {
  const [filters, setFilters] = useState({
    propertyType: "Any",
    purpose: "Any",
    beds: "Any",
    maxArea: undefined,
    maxPrice: undefined,
  });
  const [trigger, setTrigger] = useState(0);
  const [properties, setProperties] = useState([]);

  useEffect(() => {
    AOS.init({
      duration: 800,
      once: true,
      easing: "ease-in-out",
    });
  }, []);

  // Fetch properties from backend
  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await fetch(`${import.meta.env.VITE_BACKEND_URL}/api/properties`);
        const data = await res.json();
        setProperties(data);
      } catch (err) {
        console.error("Failed to fetch properties", err);
      }
    };
    fetchData();
  }, []);

  const filtered = useMemo(() => {
    const bedNum =
      typeof filters.beds === "number"
        ? filters.beds
        : filters.beds === "Any"
        ? undefined
        : Number(filters.beds);

    return properties.filter((p) => {
      return (
        (filters.propertyType === "Any" ||
          p.property_type === filters.propertyType) &&
        (filters.purpose === "Any" || p.purpose === filters.purpose) &&
        (!bedNum || p.beds >= bedNum) &&
        (!filters.maxArea || Number(p.area_size) >= filters.maxArea) &&
        (!filters.maxPrice || Number(p.price) <= filters.maxPrice)
      );
    });
  }, [filters, properties, trigger]);

  return (
    <>
      <Header />
      <Hero
        filters={filters}
        setFilters={setFilters}
        onSearch={() => setTrigger((t) => t + 1)}
      />

      {/* Our Main Focus Section */}
      <Focus />

      {/* Recent Listings Section - Now shows 12 most recent properties */}
      <Listings properties={properties} />

      {/* How It Works Section */}
      <HowItWorks />

      {/* Footer */}
      <Footer />
      <FloatingChatbot />
    </>
  );
}