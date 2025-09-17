import React, { useEffect, useState } from "react";
import { useParams, useLocation, useNavigate } from "react-router-dom";
import Header from "../components/Header";
import Footer from "../components/Footer";
import { FaBed, FaBath, FaPhone, FaWhatsapp, FaArrowLeft, FaArrowRight, FaPlay, FaPause, FaMapMarkerAlt, FaExpand, FaChevronDown, FaChevronUp } from "react-icons/fa";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import 'leaflet/dist/leaflet.css';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import L from 'leaflet';
import LoadingScreen from "../components/LoadingScreen";
import FloatingChatbot from "../components/FloatingChatBot";

function PropertyDetails() {
  const { id } = useParams();
  const location = useLocation();
  const navigate = useNavigate();
  
  // Get the return state that was passed from Properties component
  const returnState = location.state?.returnState;
  
  const [property, setProperty] = useState(null);
  const [errorMessage, setErrorMessage] = useState("");
  const [loading, setLoading] = useState(true);
  const [currentSlide, setCurrentSlide] = useState(0);
  const [activeTab, setActiveTab] = useState("overview");
  const [videoStates, setVideoStates] = useState({});
  const [showContactForm, setShowContactForm] = useState(false);
  const [isDescriptionExpanded, setIsDescriptionExpanded] = useState(false);

  const [lightboxOpen, setLightboxOpen] = useState(false);
  const [lightboxIndex, setLightboxIndex] = useState(0);

  // Contact form state
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [message, setMessage] = useState("");

  // Form validation errors state
  const [formErrors, setFormErrors] = useState({
    name: "",
    email: "",
    phone: "",
    message: ""
  });

  // Handle back navigation with state preservation
  const handleBackToProperties = () => {
    if (returnState) {
      // Navigate back with the preserved state
      navigate('/properties', {
        state: {
          filters: returnState.filters,
          viewMode: returnState.viewMode,
          currentPage: returnState.currentPage,
          scrollPosition: returnState.scrollPosition,
          showFilters: returnState.showFilters
        }
      });
    } else {
      // Fallback: navigate back normally
      navigate('/properties');
    }
  };

  const markerIcon = new L.Icon({
    iconUrl: 'https://icons.iconarchive.com/icons/paomedia/small-n-flat/1024/map-marker-icon.png',
    shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-shadow.png',
    iconSize: [25, 41],
    iconAnchor: [12, 41],
    popupAnchor: [1, -34],
    shadowSize: [41, 41]
  });

  const openLightbox = (index) => {
    setLightboxIndex(index);
    setLightboxOpen(true);
  };

  const closeLightbox = () => setLightboxOpen(false);

  const nextLightbox = () => {
    setLightboxIndex((prev) => (prev + 1) % mediaItems.length);
  };

  const prevLightbox = () => {
    setLightboxIndex((prev) => (prev - 1 + mediaItems.length) % mediaItems.length);
  };

  // Function to determine if description should be collapsible
  const shouldTruncateDescription = (description) => {
    if (!description) return false;
    // Truncate if description is longer than 300 characters or has more than 4 lines
    return description.length > 300 || description.split('\n').length > 4;
  };

  // Function to get truncated description
  const getTruncatedDescription = (description) => {
    if (!description) return "";
    const lines = description.split('\n');
    if (lines.length > 4) {
      return lines.slice(0, 4).join('\n') + '...';
    }
    if (description.length > 300) {
      return description.substring(0, 300) + '...';
    }
    return description;
  };

  // Determine area label based on property type
  const areaLabel = property?.property_type?.toLowerCase() === "apartment" || 
                   property?.property_type?.toLowerCase() === "office" || 
                   property?.property_type?.toLowerCase() === "shop" 
                   ? "Sq. Ft." : "Sq. Yd.";

  // Combine images and videos into a single media array
  const getMediaItems = () => {
    if (!property) return [];
    const mediaItems = [];

    // Add images
    if (property.images?.length) {
      property.images.forEach(img => {
        mediaItems.push({
          id: "img-" + img.id,
          type: 'image',
          url: img.url,
          originalId: img.id
        });
      });
    }

    // Add videos
    if (property.videos?.length) {
      property.videos.forEach(video => {
        mediaItems.push({
          id: "vid-" + video.id,
          type: 'video',
          url: video.url,
          originalId: video.id,
          thumbnail: video.thumbnail_url
        });
      });
    }

    return mediaItems;
  };

  // Function to determine if a file is a video based on URL extension
  const isVideoFile = (url) => {
    const videoExtensions = ['.mp4', '.webm', '.ogg', '.mov', '.avi', '.mkv'];
    return videoExtensions.some(ext => url.toLowerCase().includes(ext));
  };

  // Handle video play/pause
  const toggleVideoPlayback = (videoId, videoElement) => {
    if (videoElement.paused) {
      videoElement.play();
      setVideoStates(prev => ({ ...prev, [videoId]: 'playing' }));
    } else {
      videoElement.pause();
      setVideoStates(prev => ({ ...prev, [videoId]: 'paused' }));
    }
  };

  useEffect(() => {
    if (!id) {
      setErrorMessage("No property ID provided");
      setLoading(false);
      return;
    }

    const apiUrl = import.meta.env.VITE_BACKEND_URL + "/api/properties/" + id;
    
    fetch(apiUrl)
      .then((res) => {
        if (!res.ok) throw new Error("HTTP error! status: " + res.status);
        return res.json();
      })
      .then((data) => {
        setProperty(data);
        const defaultMessage = "I would like to inquire about your property " + data.property_name + " - ID (" + data.id + "). Please contact me at your earliest convenience.";
        setMessage(defaultMessage);
        setLoading(false);
      })
      .catch((err) => {
        setErrorMessage("Could not load property details: " + err.message);
        setLoading(false);
      });
  }, [id]);

  const validateForm = () => {
    const errors = { name: "", email: "", phone: "", message: "" };
    let isValid = true;

    // Name validation
    if (!name.trim()) {
      errors.name = "Name is required.";
      isValid = false;
    }

    // Email validation
    if (!email.trim()) {
      errors.email = "Email is required.";
      isValid = false;
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      errors.email = "Enter a valid email address.";
      isValid = false;
    }

    // Phone validation
    if (!phone.trim()) {
      errors.phone = "Phone number is required.";
      isValid = false;
    } else if (!/^03\d{2}-\d{7}$/.test(phone)) {
      errors.phone = "Please enter a valid phone number (format: 03XX-XXXXXX).";
      isValid = false;
    }

    // Message validation
    if (!message.trim()) {
      errors.message = "Message cannot be empty.";
      isValid = false;
    }

    setFormErrors(errors);
    return isValid;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setFormErrors({ name: "", email: "", phone: "", message: "" });

    if (!validateForm()) {
      return;
    }

    // Create WhatsApp message
    const whatsappMessage = "New Property Inquiry:\n" +
      "Name: " + name + "\n" +
      "Phone: " + phone + "\n" +
      "Email: " + email + "\n" +
      "Message: " + message;

    const whatsappUrl = "https://wa.me/923008213333?text=" + encodeURIComponent(whatsappMessage);

    // Open WhatsApp
    window.open(whatsappUrl, '_blank');

    // Reset form
    setName("");
    setEmail("");
    setPhone("");
    const resetMessage = "I would like to inquire about your property " + property.property_name + " - ID (" + property.id + "). Please contact me at your earliest convenience.";
    setMessage(resetMessage);
    setShowContactForm(false);
  };

  // Function to handle tab clicks and smooth scrolling to specific sections
  const handleTabClick = (tabName) => {
    setActiveTab(tabName);
    const sectionElement = document.getElementById(tabName + '-section');
    if (sectionElement) {
      const elementPosition = sectionElement.offsetTop;
      const headerHeight = 100;
      const offsetPosition = elementPosition - headerHeight;

      window.scrollTo({
        top: offsetPosition,
        behavior: 'smooth'
      });
    }
  };

  if (loading) return <LoadingScreen />;

  if (errorMessage) return <div className="flex items-center justify-center min-h-screen text-red-500 px-4 text-center brockman-font">{errorMessage}</div>;

  if (!property) return <div className="flex items-center justify-center min-h-screen px-4 text-center brockman-font">Property not found</div>;

  const mediaItems = getMediaItems();

  // Slider arrows
  const NextArrow = ({ onClick }) => (
    <button
      onClick={onClick}
      className="absolute top-1/2 right-2 md:right-4 transform -translate-y-1/2 text-white text-xl md:text-2xl z-10 hover:text-gray-300 bg-black bg-opacity-50 rounded-full w-8 h-8 md:w-10 md:h-10 flex items-center justify-center"
    >
      <FaArrowRight />
    </button>
  );

  const PrevArrow = ({ onClick }) => (
    <button
      onClick={onClick}
      className="absolute top-1/2 left-2 md:left-4 transform -translate-y-1/2 text-white text-xl md:text-2xl z-10 hover:text-gray-300 bg-black bg-opacity-50 rounded-full w-8 h-8 md:w-10 md:h-10 flex items-center justify-center"
    >
      <FaArrowLeft />
    </button>
  );

  const sliderSettings = {
    dots: false,
    infinite: true,
    speed: 500,
    slidesToShow: 1,
    slidesToScroll: 1,
    nextArrow: <NextArrow />,
    prevArrow: <PrevArrow />,
    afterChange: (index) => setCurrentSlide(index),
  };

  const formatValue = (value) => {
    if (
      value === null ||
      value === undefined ||
      value === "" ||
      value === "0" ||
      value === 0 ||
      value === "N/A" ||
      value === "n/a" ||
      (typeof value === "string" && ["n/a", "na", "-", "N/A", "NA"].includes(value.trim().toLowerCase()))
    ) {
      return "-";
    }
    return value;
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1 bg-gray-50 py-6 md:py-10 px-3 md:px-6 lg:px-12 mt-20">
        
        {/* Back Button */}
        <div className="mb-6">
          <button 
            onClick={handleBackToProperties}
            className="flex items-center text-gray-600 hover:text-gray-900 transition-colors duration-200 group"
          >
            <FaArrowLeft className="mr-2 group-hover:-translate-x-1 transition-transform duration-200" />
            <span className="brockman-font text-sm md:text-base">Back to Properties</span>
          </button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 md:gap-8">
          {/* Left Content */}
          <div className="lg:col-span-2">
            {/* Media Slider */}
            <div className="relative rounded-lg md:rounded-2xl overflow-hidden shadow-lg">
              {mediaItems?.length ? (
                <>
                  <Slider {...sliderSettings} className="h-[250px] sm:h-[300px] md:h-[400px]">
                    {mediaItems.map((media, index) => (
                      <div
                        key={media.id}
                        className="h-[250px] sm:h-[300px] md:h-[400px] cursor-pointer relative group"
                        onClick={() => openLightbox(index)}
                      >
                        {media.type === 'image' ? (
                          <>
                            <img
                              src={media.url}
                              alt={property.property_type}
                              className="w-full h-[250px] sm:h-[300px] md:h-[400px] object-cover rounded-lg md:rounded-2xl transition-all duration-300 group-hover:brightness-50"
                            />
                            {/* Hover Overlay */}
                            <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-40 transition-all duration-300 flex items-center justify-center opacity-0 group-hover:opacity-100 rounded-lg md:rounded-2xl">
                              <div className="text-center text-white transform translate-y-2 group-hover:translate-y-0 transition-transform duration-300">
                                <FaExpand className="text-2xl md:text-3xl mb-2 mx-auto" />
                                <p className="text-sm md:text-base font-medium brockman-font">Click to view in full screen</p>
                              </div>
                            </div>
                          </>
                        ) : (
                          <div className="relative w-full h-[250px] sm:h-[300px] md:h-[400px] group">
                            <video
                              className="w-full h-[250px] sm:h-[300px] md:h-[400px] object-cover rounded-lg md:rounded-2xl transition-all duration-300 group-hover:brightness-50"
                              controls
                              preload="metadata"
                              poster={media.thumbnail}
                            >
                              <source src={media.url} type="video/mp4" />
                              <source src={media.url} type="video/webm" />
                              <source src={media.url} type="video/ogg" />
                              Your browser does not support the video tag.
                            </video>
                            {/* Hover Overlay for Video */}
                            <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-40 transition-all duration-300 flex items-center justify-center opacity-0 group-hover:opacity-100 rounded-lg md:rounded-2xl pointer-events-none">
                              <div className="text-center text-white transform translate-y-2 group-hover:translate-y-0 transition-transform duration-300">
                                <FaExpand className="text-2xl md:text-3xl mb-2 mx-auto" />
                                <p className="text-sm md:text-base font-medium brockman-font">Click to view in full screen</p>
                              </div>
                            </div>
                          </div>
                        )}
                      </div>
                    ))}
                  </Slider>
                  <div className="absolute bottom-3 left-1/2 transform -translate-x-1/2 text-white text-xs md:text-sm px-2 md:px-3 py-1 rounded-full bg-black bg-opacity-50 brockman-font">
                    {currentSlide + 1}/{mediaItems.length}
                  </div>
                </>
              ) : (
                <div className="w-full h-[250px] sm:h-[300px] md:h-[400px] bg-gray-200 flex items-center justify-center">
                  <div className="text-center text-gray-500">
                    <div className="text-2xl md:text-4xl mb-2">📷</div>
                    <p className="text-sm md:text-base brockman-font">No Media Available</p>
                  </div>
                </div>
              )}
            </div>
          
          {/* Project Title */}
            <div className="mt-4 md:mt-6">
              <h1 className="text-xl md:text-2xl font-bold text-gray-900 mb-2 brockman-font">{property.property_name}</h1>
            </div>

            {/* Tabs */}
            <div className="mt-4 md:mt-5 border-b overflow-x-auto">
              <div className="flex gap-4 md:gap-6 text-gray-600 font-medium min-w-max">
                <button
                  onClick={() => handleTabClick("overview")}
                  className={"pb-2 border-b-2 transition-colors whitespace-nowrap text-sm md:text-base brockman-font " + 
                    (activeTab === "overview" ? "border-orange-500 text-orange-600" : "border-transparent hover:text-orange-600")}
                >
                  Overview
                </button>
                <button
                  onClick={() => handleTabClick("description")}
                  className={"pb-2 border-b-2 transition-colors whitespace-nowrap text-sm md:text-base brockman-font " + 
                    (activeTab === "description" ? "border-orange-500 text-orange-600" : "border-transparent hover:text-orange-600")}
                >
                  Description
                </button>
                <button
                  onClick={() => handleTabClick("location")}
                  className={"pb-2 border-b-2 transition-colors whitespace-nowrap text-sm md:text-base brockman-font " + 
                    (activeTab === "location" ? "border-orange-500 text-orange-600" : "border-transparent hover:text-orange-600")}
                >
                  Location & Nearby
                </button>
              </div>
            </div>

            {/* All Content in One Card */}
            <div className="mt-4 md:mt-8 bg-white rounded-lg md:rounded-xl shadow-md p-4 md:p-6 space-y-4 md:space-y-6">
              {/* Overview Section */}
              <div id="overview-section">
                <h2 className="text-xl md:text-2xl font-bold mb-3 md:mb-4 brockman-font">Overview</h2>
                
                {/* Mobile: Single column, Desktop: 2 columns with 4 rows each */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3 md:gap-6 text-gray-700">
                  {/* Left Column */}
                  <div className="space-y-2">
                    <div className="flex justify-between border-b py-2 text-sm md:text-base">
                      <span className="font-medium brockman-font">Type</span>
                      <span className="brockman-font">{property.property_type}</span>
                    </div>
                    <div className="flex justify-between border-b py-2 text-sm md:text-base">
                      <span className="font-medium brockman-font">Price</span>
                      <span className="brockman-font"><span className="text-xs md:text-sm mr-1">PKR</span>{property.price}</span>
                    </div>
                    <div className="flex justify-between border-b py-2 text-sm md:text-base">
                      <span className="font-medium brockman-font">Location</span>
                      <span className="text-right brockman-font">{property.location}</span>
                    </div>
                    <div className="flex justify-between border-b py-2 text-sm md:text-base">
                      <span className="font-medium brockman-font">Area</span>
                      <span className="brockman-font">{Number(property.area_size).toLocaleString()} {areaLabel}</span>
                    </div>
                    {/* Mobile only - continue with remaining items */}
                    <div className="md:hidden flex justify-between border-b py-2 text-sm">
                      <span className="font-medium brockman-font">Purpose</span>
                      <span className="brockman-font">{property.purpose}</span>
                    </div>
                    <div className="md:hidden flex justify-between border-b py-2 text-sm">
                      <span className="font-medium brockman-font">Bedroom(s)</span>
                      <span className="brockman-font">  {formatValue(property.bedrooms)} </span>
                    </div>
                    <div className="md:hidden flex justify-between border-b py-2 text-sm">
                      <span className="font-medium brockman-font">Bath(s)</span>
                      <span className="brockman-font">{formatValue(property.baths)}</span>
                    </div>
                    <div className="md:hidden flex justify-between border-b py-2 text-sm">
                      <span className="font-medium brockman-font">Added</span>
                      <span className="brockman-font">{new Date(property.created_at).toLocaleDateString()}</span>
                    </div>
                  </div>
                  
                  {/* Right Column - Only visible on desktop */}
                  <div className="hidden md:block space-y-2">
                    <div className="flex justify-between border-b py-2 text-sm md:text-base">
                      <span className="font-medium brockman-font">Purpose</span>
                      <span className="brockman-font">{property.purpose}</span>
                    </div>
                    <div className="flex justify-between border-b py-2 text-sm md:text-base">
                      <span className="font-medium brockman-font">Bedroom(s)</span>
                      <span className="brockman-font">{formatValue(property.beds)}</span>
                    </div>
                    <div className="flex justify-between border-b py-2 text-sm md:text-base">
                      <span className="font-medium brockman-font">Bath(s)</span>
                      <span className="brockman-font">{formatValue(property.baths)}</span>
                    </div>
                    <div className="flex justify-between border-b py-2 text-sm md:text-base">
                      <span className="font-medium brockman-font">Added</span>
                      <span className="brockman-font">{new Date(property.created_at).toLocaleDateString()}</span>
                    </div>
                  </div>
                </div>

                {/* Media Summary */}
                {(property.images?.length || property.videos?.length) && (
                  <div className="mt-4 p-3 md:p-4 bg-gray-50 rounded-lg">
                    <h3 className="font-semibold mb-2 text-sm md:text-base brockman-font">Media Gallery</h3>
                    <div className="flex gap-4 text-xs md:text-sm text-gray-600">
                      {property.images?.length > 0 && (
                        <span className="brockman-font">📷 {property.images.length} Photo{property.images.length > 1 ? 's' : ''}</span>
                      )}
                      {property.videos?.length > 0 && (
                        <span className="brockman-font">📹 {property.videos.length} Video{property.videos.length > 1 ? 's' : ''}</span>
                      )}
                    </div>
                  </div>
                )}
              </div>

              {/* Description Section with Collapsible Content */}
              <div id="description-section">
                <h2 className="text-xl md:text-2xl font-bold mb-2 md:mb-3 brockman-font">Description</h2>
                
                {property.description ? (
                  <div className="relative">
                    {/* Description Content with Smooth Transition */}
                    <div 
                      className={`overflow-hidden transition-all duration-700 ease-in-out transform ${
                        isDescriptionExpanded || !shouldTruncateDescription(property.description)
                          ? 'max-h-screen opacity-100' 
                          : 'max-h-32 opacity-100'
                      }`}
                      style={{
                        transition: 'max-height 0.7s cubic-bezier(0.4, 0, 0.2, 1), opacity 0.3s ease-in-out'
                      }}
                    >
                      <p className="text-gray-600 whitespace-pre-line text-sm md:text-base leading-relaxed brockman-font transition-all duration-500">
                        {isDescriptionExpanded || !shouldTruncateDescription(property.description)
                          ? property.description
                          : getTruncatedDescription(property.description)
                        }
                      </p>
                    </div>

                    {/* Enhanced Fade Overlay when collapsed */}
                    {shouldTruncateDescription(property.description) && !isDescriptionExpanded && (
                      <div 
                        className="absolute bottom-0 left-0 right-0 h-12 pointer-events-none transition-opacity duration-500"
                      />
                    )}

                    {/* Show More/Less Button - Original Style */}
                    {shouldTruncateDescription(property.description) && (
                      <button
                        onClick={() => setIsDescriptionExpanded(!isDescriptionExpanded)}
                        className="mt-3 flex items-center gap-2 text-orange-600 hover:text-orange-700 font-medium text-sm md:text-base transition-colors brockman-font"
                      >
                        {isDescriptionExpanded ? (
                          <>
                            <span>Show Less</span>
                            <FaChevronUp className="text-xs" />
                          </>
                        ) : (
                          <>
                            <span>Read More</span>
                            <FaChevronDown className="text-xs" />
                          </>
                        )}
                      </button>
                    )}
                  </div>
                ) : (
                  <p className="text-gray-500 text-sm md:text-base brockman-font">No description available.</p>
                )}
              </div>

              {/* Location Section */}
              <div id="location-section">
                <h2 className="text-xl md:text-2xl font-bold mb-3 md:mb-4 brockman-font">Location & Nearby</h2>
                {property.latitude && property.longitude ? (
                  <div className="relative z-0 rounded-lg overflow-hidden border border-gray-200">
                    <MapContainer
                      center={[property.latitude, property.longitude]}
                      zoom={15}
                      style={{ height: '300px', width: '100%', zIndex: 1 }}
                      scrollWheelZoom={true}
                      zoomControl={true}
                      attributionControl={true}
                    >
                      <TileLayer
                        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                      />
                      <Marker position={[property.latitude, property.longitude]} icon={markerIcon}>
                        <Popup>
                          <span className="brockman-font">{property.property_type} - {property.location}</span>
                        </Popup>
                      </Marker>
                    </MapContainer>
                  </div>
                ) : (
                  <p className="text-sm md:text-base brockman-font">Map not available for this property.</p>
                )}
              </div>
            </div>
          </div>

          {/* Desktop Sidebar - Hidden on mobile */}
          <div className="lg:col-span-1 hidden lg:block">
            <div className="bg-white rounded-2xl shadow-lg p-6 sticky top-24">
              <p className="text-2xl font-bold text-gray-800 mb-2 brockman-font">
                <span className="text-sm mr-1">PKR</span>{property.price}
              </p>

              {/* Contact Buttons */}
              <div className="flex gap-3 mb-3">
                <a
                  href={"https://wa.me/923008213333?text=" + encodeURIComponent("I would like to inquire about your property " + property.property_name + " - ID (" + property.id + "). Please contact me at your earliest convenience.")}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center justify-center gap-1 w-1/2 bg-emerald-500 hover:bg-emerald-600 text-white py-2 rounded-lg transition transform hover:scale-105 brockman-font"
                >
                  <FaWhatsapp />
                  WhatsApp
                </a>
                <a
                  href="tel:+923008213333"
                  className="flex items-center justify-center gap-2 w-1/2 bg-emerald-600 hover:bg-emerald-700 text-white py-2 rounded-lg transition transform hover:scale-105 brockman-font"
                >
                  <FaPhone className="animate-pulse transform scale-x-[-1]" />
                  Call
                </a>
              </div>

              {/* Contact Form */}
              <form className="space-y-2" onSubmit={handleSubmit}>
                {/* Name */}
                <div className="relative">
                  <label
                    htmlFor="name"
                    className="absolute left-3 top-1 text-gray-600 brockman-font"
                    style={{ fontSize: "0.65rem" }}
                  >
                    NAME<span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    id="name"
                    className={"block w-full border rounded-lg px-3 pt-4 pb-1 focus:outline-none focus:ring-2 focus:ring-orange-500 bg-gray-100 " + (formErrors.name ? 'border-red-500' : '')}
                    style={{ fontSize: "0.76rem" }}
                    value={name}
                    onChange={(e) => {
                      setName(e.target.value);
                      if (formErrors.name) {
                        setFormErrors(prev => ({ ...prev, name: "" }));
                      }
                    }}
                  />
                  {formErrors.name && <p className="text-red-500 text-xs mt-1 brockman-font">{formErrors.name}</p>}
                </div>

                {/* Phone */}
                <div className="relative">
                  <label
                    htmlFor="phone"
                    className="absolute left-3 top-1 text-gray-600 brockman-font"
                    style={{ fontSize: "0.65rem" }}
                  >
                    PHONE<span className="text-red-500">*</span>
                  </label>
                  <input
                    type="tel"
                    id="phone"
                    maxLength={12}
                    className={"block w-full border rounded-lg px-3 pt-4 pb-1 focus:outline-none focus:ring-2 focus:ring-orange-500 bg-gray-100 " + (formErrors.phone ? 'border-red-500' : '')}
                    style={{ fontSize: "0.76rem" }}
                    value={phone}
                    onChange={(e) => {
                      let value = e.target.value.replace(/\D/g, "");
                      if (value.length > 4) {
                        value = value.slice(0, 4) + "-" + value.slice(4, 11);
                      }
                      setPhone(value);
                      if (formErrors.phone) {
                        setFormErrors(prev => ({ ...prev, phone: "" }));
                      }
                    }}
                  />
                  {formErrors.phone && (
                    <p className="text-red-500 text-xs mt-1 brockman-font">{formErrors.phone}</p>
                  )}
                </div>

                {/* Email */}
                <div className="relative">
                  <label
                    htmlFor="email"
                    className="absolute left-3 top-1 text-gray-600 brockman-font"
                    style={{ fontSize: "0.65rem" }}
                  >
                    EMAIL<span className="text-red-500">*</span>
                  </label>
                  <input
                    type="email"
                    id="email"
                    className={"block w-full border rounded-lg px-3 pt-4 pb-1 focus:outline-none focus:ring-2 focus:ring-orange-500 bg-gray-100 " + (formErrors.email ? 'border-red-500' : '')}
                    style={{ fontSize: "0.76rem" }}
                    value={email}
                    onChange={(e) => {
                      setEmail(e.target.value);
                      if (formErrors.email) {
                        setFormErrors(prev => ({ ...prev, email: "" }));
                      }
                    }}
                  />
                  {formErrors.email && <p className="text-red-500 text-xs mt-1 brockman-font">{formErrors.email}</p>}
                </div>

                {/* Message */}
                <div className="relative">
                  <label
                    htmlFor="message"
                    className="absolute left-3 top-1 text-gray-600 brockman-font"
                    style={{ fontSize: "0.65rem" }}
                  >
                    MESSAGE<span className="text-red-500">*</span>
                  </label>
                  <textarea
                    id="message"
                    rows="4"
                    className={"block w-full border rounded-lg px-3 pt-4 pb-1 focus:outline-none focus:ring-2 focus:ring-orange-500 bg-gray-100 " + (formErrors.message ? 'border-red-500' : '')}
                    style={{ fontSize: "0.76rem" }}
                    value={message}
                    onChange={(e) => {
                      setMessage(e.target.value);
                      if (formErrors.message) {
                        setFormErrors(prev => ({ ...prev, message: "" }));
                      }
                    }}
                  />
                  {formErrors.message && <p className="text-red-500 text-xs mt-1 brockman-font">{formErrors.message}</p>}
                </div>

                <button
                  type="submit"
                  className="w-full rounded-xl bg-gradient-to-r from-pink-600 via-red-500 to-orange-500 hover:opacity-90 text-white font-medium py-2.5 transform transition-transform duration-300 ease-in-out hover:-translate-y-1 hover:shadow-xl brockman-font"
                >
                  Send Message
                </button>
              </form>
            </div>
          </div>
        </div>
      </main>

      {/* Mobile Bottom Contact Bar - Only 2 buttons */}
      {!showContactForm && (
        <div className="lg:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 p-3 z-40">
          <div className="flex gap-2">
            <button
              onClick={() => setShowContactForm(true)}
              className="flex items-center justify-center gap-2 flex-1 bg-emerald-500 hover:bg-emerald-600 text-white py-3 rounded-lg transition transform hover:scale-105 font-medium text-sm brockman-font"
            >
              <FaWhatsapp />
              WhatsApp
            </button>
            <a
              href="tel:+923008213333"
              className="flex items-center justify-center gap-2 flex-1 bg-emerald-600 hover:bg-emerald-700 text-white py-3 rounded-lg transition transform hover:scale-105 font-medium text-sm brockman-font"
            >
              <FaPhone className="animate-pulse transform scale-x-[-1]" />
              Call
            </a>
          </div>
        </div>
      )}

      {/* Mobile Contact Form Modal */}
      {showContactForm && (
        <div className="lg:hidden fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4" style={{ zIndex: 45, paddingBottom: '1px' }}>
          <div className="bg-white rounded-2xl w-full max-w-sm shadow-2xl transform transition-all" style={{ marginBottom: '20px' }}>
            <div className="p-4 border-b border-gray-200 flex justify-between items-center">
              <h3 className="text-lg font-semibold text-gray-800 brockman-font">Contact via WhatsApp</h3>
              <button
                onClick={() => setShowContactForm(false)}
                className="text-gray-400 hover:text-gray-600 transition-colors p-1"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            
            <form className="p-5 space-y-3" onSubmit={handleSubmit}>
              {/* Name */}
              <div className="relative">
                <label
                  htmlFor="mobile-name"
                  className="absolute left-3 top-1 text-gray-600 brockman-font"
                  style={{ fontSize: "0.65rem" }}
                >
                  NAME<span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  id="mobile-name"
                  className={"block w-full border rounded-lg px-3 pt-4 pb-1 focus:outline-none focus:ring-2 focus:ring-orange-500 bg-gray-50 transition-colors " + (formErrors.name ? 'border-red-500' : 'border-gray-300')}
                  style={{ fontSize: "0.76rem" }}
                  value={name}
                  onChange={(e) => {
                    setName(e.target.value);
                    if (formErrors.name) {
                      setFormErrors(prev => ({ ...prev, name: "" }));
                    }
                  }}
                />
                {formErrors.name && <p className="text-red-500 text-xs mt-1 brockman-font">{formErrors.name}</p>}
              </div>

              {/* Phone */}
              <div className="relative">
                <label
                  htmlFor="mobile-phone"
                  className="absolute left-3 top-1 text-gray-600 brockman-font"
                  style={{ fontSize: "0.65rem" }}
                >
                  PHONE<span className="text-red-500">*</span>
                </label>
                <input
                  type="tel"
                  id="mobile-phone"
                  maxLength={12}
                  className={"block w-full border rounded-lg px-3 pt-4 pb-1 focus:outline-none focus:ring-2 focus:ring-orange-500 bg-gray-50 transition-colors " + (formErrors.phone ? 'border-red-500' : 'border-gray-300')}
                  style={{ fontSize: "0.76rem" }}
                  value={phone}
                  onChange={(e) => {
                    let value = e.target.value.replace(/\D/g, "");
                    if (value.length > 4) {
                      value = value.slice(0, 4) + "-" + value.slice(4, 11);
                    }
                    setPhone(value);
                    if (formErrors.phone) {
                      setFormErrors(prev => ({ ...prev, phone: "" }));
                    }
                  }}
                />
                {formErrors.phone && <p className="text-red-500 text-xs mt-1 brockman-font">{formErrors.phone}</p>}
              </div>

              {/* Email */}
              <div className="relative">
                <label
                  htmlFor="mobile-email"
                  className="absolute left-3 top-1 text-gray-600 brockman-font"
                  style={{ fontSize: "0.65rem" }}
                >
                  EMAIL<span className="text-red-500">*</span>
                </label>
                <input
                  type="email"
                  id="mobile-email"
                  className={"block w-full border rounded-lg px-3 pt-4 pb-1 focus:outline-none focus:ring-2 focus:ring-orange-500 bg-gray-50 transition-colors " + (formErrors.email ? 'border-red-500' : 'border-gray-300')}
                  style={{ fontSize: "0.76rem" }}
                  value={email}
                  onChange={(e) => {
                    setEmail(e.target.value);
                    if (formErrors.email) {
                      setFormErrors(prev => ({ ...prev, email: "" }));
                    }
                  }}
                />
                {formErrors.email && <p className="text-red-500 text-xs mt-1 brockman-font">{formErrors.email}</p>}
              </div>

              {/* Message */}
              <div className="relative">
                <label
                  htmlFor="mobile-message"
                  className="absolute left-3 top-1 text-gray-600 brockman-font"
                  style={{ fontSize: "0.65rem" }}
                >
                  MESSAGE<span className="text-red-500">*</span>
                </label>
                <textarea
                  id="mobile-message"
                  rows="4"
                  className={"block w-full border rounded-lg px-3 pt-4 pb-1 focus:outline-none focus:ring-2 focus:ring-orange-500 bg-gray-50 transition-colors resize-none " + (formErrors.message ? 'border-red-500' : 'border-gray-300')}
                  style={{ fontSize: "0.76rem" }}
                  value={message}
                  onChange={(e) => {
                    setMessage(e.target.value);
                    if (formErrors.message) {
                      setFormErrors(prev => ({ ...prev, message: "" }));
                    }
                  }}
                />
                {formErrors.message && <p className="text-red-500 text-xs mt-1 brockman-font">{formErrors.message}</p>}
              </div>

              <button
                type="submit"
                className="w-full rounded-xl bg-gradient-to-r from-pink-600 via-red-500 to-orange-500 hover:opacity-90 text-white font-medium py-3 transform transition-all duration-300 hover:scale-[1.02] hover:shadow-xl flex items-center justify-center gap-2 brockman-font"
              >
                <FaWhatsapp className="text-lg" />
                Send via WhatsApp
              </button>
            </form>
          </div>
        </div>
      )}

      {/* Add padding bottom for mobile to account for fixed bottom bar */}
      <div className="lg:hidden h-16"></div>

      {lightboxOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-90 flex items-center justify-center z-50">
          {/* Close button */}
          <button
            onClick={closeLightbox}
            className="absolute top-4 right-6 text-white text-3xl font-bold hover:text-gray-300 transition-colors"
          >
            &times;
          </button>

          {/* Left Arrow */}
          <button
            onClick={prevLightbox}
            className="absolute left-2 top-1/2 transform -translate-y-1/2 z-50 bg-black bg-opacity-50 rounded-full p-2 hover:bg-opacity-70 transition-all"
          >
            <FaArrowLeft className="text-white text-lg" />
          </button>

          {/* Media */}
          <div className="max-w-full max-h-full flex items-center justify-center">
            {mediaItems[lightboxIndex].type === "image" ? (
              <img
                src={mediaItems[lightboxIndex].url}
                alt={`Fullscreen ${lightboxIndex}`}
                className="max-w-full max-h-screen object-contain"
              />
            ) : (
              <video
                controls
                autoPlay
                className="max-w-full max-h-screen object-contain"
              >
                <source src={mediaItems[lightboxIndex].url} type="video/mp4" />
              </video>
            )}
          </div>

          {/* Right Arrow */}
          <button
            onClick={nextLightbox}
            className="absolute right-2 top-1/2 transform -translate-y-1/2 z-50 bg-black bg-opacity-50 rounded-full p-2 hover:bg-opacity-70 transition-all"
          >
            <FaArrowRight className="text-white text-lg" />
          </button>

          {/* Counter */}
          <div className="absolute bg-black bg-opacity-50 text-white px-3 py-1 rounded-full text-xs bottom-2 brockman-font">
            {lightboxIndex + 1} / {mediaItems.length}
          </div>
        </div>
      )}

      <Footer />
      <FloatingChatbot />
    </div>
  );
}

export default PropertyDetails;