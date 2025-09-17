import React, { useState, useEffect, useMemo } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { FaMapMarkerAlt, FaHome, FaMoneyBillWave, FaRegImage, FaFilter, FaTimes, FaVideo, FaChevronLeft, FaChevronRight, FaTh, FaList } from "react-icons/fa";
import { FaBed, FaBath, FaRulerCombined } from "react-icons/fa";
import Header from "../components/Header";
import Footer from "../components/Footer";
import CustomDropdown from "../components/CustomDropdown";
import LoadingScreen from "../components/LoadingScreen";
import FloatingChatbot from "../components/FloatingChatBot";

export default function Projects() {
  const navigate = useNavigate();
  const location = useLocation();

  // Initialize filters from location state or defaults
  const initialFilters = (location.state && location.state.filters) || {
    category: "All",
    completion: "",
    status: "Any",
    location: "",
    minPrice: "",
    maxPrice: "",
    project_type: "Any",
  };

  // Get preserved state from navigation or use defaults
  const getInitialViewMode = () => {
    if (location.state && location.state.viewMode) {
      return location.state.viewMode;
    }
    const savedViewMode = sessionStorage.getItem('projects-view-mode');
    return savedViewMode || 'tile';
  };

  const getInitialPage = () => {
    if (location.state && location.state.currentPage) {
      return location.state.currentPage;
    }
    const savedPage = sessionStorage.getItem('projects-current-page');
    return savedPage ? parseInt(savedPage) : 1;
  };

  const getInitialScrollPosition = () => {
    if (location.state && location.state.scrollPosition) {
      return location.state.scrollPosition;
    }
    return 0;
  };

  // State management
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showFilters, setShowFilters] = useState(false);
  const [filters, setFilters] = useState(initialFilters);
  const [viewMode, setViewMode] = useState(getInitialViewMode);
  const [windowWidth, setWindowWidth] = useState(typeof window !== 'undefined' ? window.innerWidth : 1024);
  const [currentPage, setCurrentPage] = useState(getInitialPage);
  
  const PROJECTS_PER_PAGE = viewMode === 'tile' ? 60 : 20;

  // Restore scroll position after component mounts
  useEffect(() => {
    const initialScrollPosition = getInitialScrollPosition();
    if (initialScrollPosition > 0) {
      setTimeout(() => {
        window.scrollTo(0, initialScrollPosition);
      }, 100);
    }
  }, []);

  // Save view mode to sessionStorage whenever it changes
  useEffect(() => {
    sessionStorage.setItem('projects-view-mode', viewMode);
  }, [viewMode]);

  // Save current page to sessionStorage whenever it changes
  useEffect(() => {
    sessionStorage.setItem('projects-current-page', currentPage.toString());
  }, [currentPage]);

  // Window resize listener
  useEffect(() => {
    const handleResize = () => {
      setWindowWidth(window.innerWidth);
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const isMobile = windowWidth <= 639;

  // Fetch projects from API
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        
        const projectsRes = await fetch(`${import.meta.env.VITE_BACKEND_URL}/api/projects`);
        const projectsData = await projectsRes.json();
        setProjects(projectsData);

      } catch (err) {
        console.error("Error fetching data:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  // Filter change handler
  const handleFilterChange = (e) => {
    setFilters({ ...filters, [e.target.name]: e.target.value });
    setCurrentPage(1);
  };

  // Reset pagination when view mode changes
  useEffect(() => {
    setCurrentPage(1);
  }, [viewMode]);

  // Close filters on mobile when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (showFilters && !event.target.closest('.filter-sidebar') && !event.target.closest('.filter-toggle')) {
        setShowFilters(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [showFilters]);

  // Function to handle navigation to project details with state preservation
  const navigateToProject = (project) => {
    const currentScrollPosition = window.pageYOffset || document.documentElement.scrollTop;
    
    navigate(`/projects/${project.id}`, {
      state: { 
        project,
        // Preserve current state for when user returns
        returnState: {
          filters,
          viewMode,
          currentPage,
          scrollPosition: currentScrollPosition,
          showFilters
        }
      },
    });
  };

  // Parse price utility
  function parsePrice(text) {
    if (!text) return 0;
    text = text.toLowerCase().trim();

    if (text.includes("crore")) {
      return parseFloat(text) * 10000000;
    } else if (text.includes("lakh")) {
      return parseFloat(text) * 100000;
    } else if (text.includes("thousand")) {
      return parseFloat(text) * 1000;
    } else if (text.includes("arab")) {
      return parseFloat(text) * 1000000000;
    }
    return Number(text) || 0;
  }

  // Format price utility
  function formatPKR(num) {
    if (!num) return "";
    if (num < 1000) return `${num}`;
    if (num < 100000) return `${num / 1000} Thousand`;
    if (num < 10000000) return `${num / 100000} Lakh`;
    if (num < 1000000000) return `${num / 10000000} Crore`;
    return `${num / 1000000000} Arab`;
  }

  // Get status color
  const getStatusColor = (status) => {
    switch (status?.toLowerCase()) {
      case "upcoming":
        return "bg-blue-600";
      case "under construction":
        return "bg-yellow-600";
      case "completed":
        return "bg-green-600";
      default:
        return "bg-gray-600";
    }
  };

  // Get project type color
  const getProjectTypeColor = (projectType) => {
    switch (projectType?.toLowerCase()) {
      case "sale":
        return "bg-red-600";
      case "rent":
        return "bg-purple-600";
      default:
        return "bg-gray-600";
    }
  };

  // Filter options
  const categoryOptions = ["All", "Apartment", "House", "Shop", "Plot", "Office"];
  const statusOptions = ["Any", "Upcoming", "Under Construction", "Completed"];

  // Filter projects
  const filteredProjects = useMemo(() => {
    return projects.filter((project) => {
      // Category filter
      if (filters.category !== "All") {
        const matchesCategory = project.category?.toLowerCase() === filters.category.toLowerCase();
        if (!matchesCategory) return false;
      }

      // Completion year filter
      if (filters.completion && filters.completion.trim() !== "") {
        const inputYear = filters.completion.toString().trim();
        const projectCompletion = project.completion?.toString().trim();
        
        if (projectCompletion && !projectCompletion.includes(inputYear)) {
          return false;
        }
      }

      // Status filter
      if (filters.status !== "Any") {
        const matchesStatus = project.status?.toLowerCase() === filters.status.toLowerCase();
        if (!matchesStatus) return false;
      }

      // Location filter
      if (filters.location && !project.location?.toLowerCase().includes(filters.location.toLowerCase())) {
        return false;
      }

      // Project type filter
      if (filters.project_type !== "Any" && project.project_type !== filters.project_type) {
        return false;
      }

      // Price filters
      const priceNum = parsePrice(project.price);
      if (filters.minPrice && priceNum < filters.minPrice) return false;
      if (filters.maxPrice && priceNum > filters.maxPrice) return false;

      return true;
    });
  }, [filters, projects]);

  // Pagination logic
  const totalPages = Math.ceil(filteredProjects.length / PROJECTS_PER_PAGE);
  const startIndex = (currentPage - 1) * PROJECTS_PER_PAGE;
  const endIndex = startIndex + PROJECTS_PER_PAGE;
  const currentProjects = filteredProjects.slice(startIndex, endIndex);

  // Reset to page 1 if current page exceeds total pages
  useEffect(() => {
    if (currentPage > totalPages && totalPages > 0) {
      setCurrentPage(1);
    }
  }, [filteredProjects, currentPage, totalPages]);

  // Pagination handlers
  const goToPage = (page) => {
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const goToPrevious = () => {
    if (currentPage > 1) {
      goToPage(currentPage - 1);
    }
  };

  const goToNext = () => {
    if (currentPage < totalPages) {
      goToPage(currentPage + 1);
    }
  };

  // Generate page numbers for pagination
  const getPageNumbers = () => {
    const pages = [];
    const maxVisiblePages = 5;
    
    if (totalPages <= maxVisiblePages) {
      for (let i = 1; i <= totalPages; i++) {
        pages.push(i);
      }
    } else {
      let startPage = Math.max(1, currentPage - 2);
      let endPage = Math.min(totalPages, startPage + maxVisiblePages - 1);
      
      if (endPage - startPage + 1 < maxVisiblePages) {
        startPage = Math.max(1, endPage - maxVisiblePages + 1);
      }
      
      if (startPage > 1) {
        pages.push(1);
        if (startPage > 2) pages.push('...');
      }
      
      for (let i = startPage; i <= endPage; i++) {
        pages.push(i);
      }
      
      if (endPage < totalPages) {
        if (endPage < totalPages - 1) pages.push('...');
        pages.push(totalPages);
      }
    }
    
    return pages;
  };

  const areaLabel =
    filters.category === "Apartment" ||
    filters.category === "Office" ||
    filters.category === "Shop"
      ? "Sq. Ft."
      : "Sq. Yd.";

  // Render Tile View Project Card
  const renderTileProject = (project) => (
    <div
      key={project.id}
      onClick={() => navigateToProject(project)}
      className="bg-white rounded-xl group shadow-sm overflow-hidden hover:shadow-md transition-all duration-300 cursor-pointer transform hover:-translate-y-1"
    >
      {/* Images */}
      <div className="relative group">
        <img
          src={
            project.images && project.images.length > 0
              ? project.images[0].url
              : "https://via.placeholder.com/300x150?text=No+Image"
          }
          alt={project.project_name}
          className="w-full h-32 sm:h-36 object-cover transition-transform duration-500 group-hover:scale-105"
        />

        {/* Status Badge - Top Left */}
        <div className={`absolute top-2 left-2 ${getStatusColor(project.status)} text-white text-xs font-semibold px-2 py-0.5 rounded-full shadow-md brockman-font`}>
          {project.status?.toUpperCase() || 'COMPLETED'}
        </div>

        {/* Project Type Badge - Top Right */}
        {project.project_type && (
          <div className={`absolute top-2 right-2 ${getProjectTypeColor(project.project_type)} text-white text-xs font-semibold px-2 py-0.5 rounded-full shadow-md brockman-font`}>
            {project.project_type.toUpperCase()}
          </div>
        )}

        {/* Location */}
        <div className="absolute bottom-2 left-2 flex items-center bg-black/70 text-white text-xs px-1.5 py-0.5 rounded backdrop-blur-sm">
          <FaMapMarkerAlt className="mr-1 text-pink-400 flex-shrink-0 text-xs" />
          <span className="font-medium truncate max-w-28 brockman-font">{project.location}</span>
        </div>

        {/* Media Counts */}
        <div className="absolute bottom-2 right-2 flex items-center gap-0.5">
          <div className="flex items-center bg-black/70 text-white text-xs px-1.5 py-0.5 rounded backdrop-blur-sm">
            <FaRegImage className="mr-0.5 flex-shrink-0 text-xs" />
            <span className="brockman-font text-xs">{project.images?.length || 0}</span>
          </div>
          <div className="flex items-center bg-black/70 text-white text-xs px-1.5 py-0.5 rounded backdrop-blur-sm">
            <FaVideo className="mr-0.5 flex-shrink-0 text-xs" />
            <span className="brockman-font text-xs">{project.videos?.length || 0}</span>
          </div>
        </div>
      </div>

      {/* Info */}
      <div className="p-3">
        {/* Price */}
        <p className="text-gray-900 text-sm sm:text-base font-bold mb-1 brockman-font">
          <span className="text-xs mr-1">PKR</span>
          {project.price}
        </p>
        
        {/* Project name */}
        <h2 className="text-xs sm:text-sm font-semibold text-gray-800 mb-2 line-clamp-1 brockman-font">
          {project.project_name}
        </h2>

        {/* Features */}
        <div className="flex items-center text-xs text-gray-500 gap-3 mb-2">

          {/* Beds */}
          {project.beds &&
            !["n/a", "-", "0"].includes(String(project.beds).trim().toLowerCase()) && (
              <span className="flex items-center gap-0.5">
                <FaBed className="h-3 w-3 flex-shrink-0" />
                <span className="brockman-font">Bed: {project.beds}</span>
              </span>
            )}

          {/* Baths */}
          {project.baths &&
            !["n/a", "-", "0"].includes(String(project.baths).trim().toLowerCase()) && (
              <span className="flex items-center gap-0.5">
                <FaBath className="h-3 w-3 flex-shrink-0" />
                <span className="brockman-font">Bath: {project.baths}</span>
              </span>
            )}

          {/* Area */}
          {project.area_size && (
            <span className="flex items-center gap-0.5">
              <FaRulerCombined className="h-3 w-3 flex-shrink-0" />
              <span className="brockman-font text-xs">
                {Number(project.area_size).toLocaleString()}{" "}
                {project?.category?.toLowerCase() === "apartment" ||
                project?.category?.toLowerCase() === "office" ||
                project?.category?.toLowerCase() === "shop"
                  ? " Sq.Ft"
                  : " Sq.Yd"}
              </span>
            </span>
          )}
        </div>

        {/* Completion */}
        <div className="flex justify-between items-center mb-2">
          <span className="text-xs text-gray-500 brockman-font">Completion: {project.completion}</span>
        </div>

        {/* Description */}
        <p className="text-gray-600 text-xs leading-relaxed line-clamp-2 brockman-font">
          {project.description || "Premium project with modern amenities and excellent location."}
        </p>
      </div>
    </div>
  );

  // Render List View Project Card
  const renderListProject = (project) => (
    <div
      key={project.id}
      onClick={() => navigateToProject(project)}
      className="bg-white rounded-xl shadow-sm overflow-hidden hover:shadow-md transition-all duration-300 cursor-pointer transform hover:-translate-y-0.5 mb-3"
    >
      <div className="flex flex-col sm:flex-row h-full">
        {/* Image */}
        <div className="relative sm:w-48 sm:flex-shrink-0 overflow-hidden h-32 sm:h-44">
          <img
            src={
              project.images && project.images.length > 0
                ? project.images[0].url
                : "https://via.placeholder.com/200x120?text=No+Image"
            }
            alt={project.project_name}
            className="w-full h-full object-cover transition-transform duration-500 hover:scale-105"
          />

          {/* Status Badge - Top Left */}
          <div className={`absolute top-2 left-2 ${getStatusColor(project.status)} text-white text-xs font-semibold px-2 py-0.5 rounded-full shadow-md brockman-font`}>
            {project.status?.toUpperCase() || 'COMPLETED'}
          </div>

          {/* Project Type Badge - Top Right */}
          {project.project_type && (
            <div className={`absolute top-2 right-2 ${getProjectTypeColor(project.project_type)} text-white text-xs font-semibold px-2 py-0.5 rounded-full shadow-md brockman-font`}>
              {project.project_type.toUpperCase()}
            </div>
          )}

          {/* Media Counts */}
          <div className="absolute bottom-2 right-2 flex items-center gap-0.5">
            <div className="flex items-center bg-black/70 text-white text-xs px-1.5 py-0.5 rounded backdrop-blur-sm">
              <FaRegImage className="mr-0.5 flex-shrink-0 text-xs" />
              <span className="brockman-font text-xs">{project.images?.length || 0}</span>
            </div>
            <div className="flex items-center bg-black/70 text-white text-xs px-1.5 py-0.5 rounded backdrop-blur-sm">
              <FaVideo className="mr-0.5 flex-shrink-0 text-xs" />
              <span className="brockman-font text-xs">{project.videos?.length || 0}</span>
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="flex-1 p-4 flex flex-col justify-between">
          {/* Header */}
          <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between mb-2">
            <div className="flex-1">
              <h2 className="text-lg font-bold text-gray-900 mb-1 line-clamp-1 brockman-font">
                {project.project_name}
              </h2>
              <div className="flex items-center text-gray-600 sm:mb-0 mb-2">
                <FaMapMarkerAlt className="mr-1 text-pink-500 flex-shrink-0 text-sm" />
                <span className="brockman-font text-sm truncate">{project.location}</span>
              </div>
            </div>
            <div className="text-right sm:ml-4">
              <p className="text-lg font-bold text-gray-900 brockman-font">
                <span className="text-xs mr-1">PKR</span>
                {project.price}
              </p>
            </div>
          </div>

          {/* Features */}
          <div className="flex flex-wrap items-center gap-4 sm:mb-2 mb-3">
            {/* Category */}
            <span className="flex items-center gap-1 text-gray-500 text-sm">
              <FaHome className="h-3 w-3 flex-shrink-0 text-gray-500" />
              <span className="brockman-font">{project.category}</span>
            </span>

            {/* Beds */}
            {project.beds &&
              !["n/a", "-", "0"].includes(String(project.beds).trim().toLowerCase()) && (
                <span className="flex items-center gap-1 text-gray-500 text-sm">
                  <FaBed className="h-3 w-3 flex-shrink-0 text-gray-500" />
                  <span className="brockman-font">Bed: {project.beds}</span>
                </span>
              )}

            {/* Baths */}
            {project.baths &&
              !["n/a", "-", "0"].includes(String(project.baths).trim().toLowerCase()) && (
                <span className="flex items-center gap-1 text-gray-500 text-sm">
                  <FaBath className="h-3 w-3 flex-shrink-0 text-gray-500" />
                  <span className="brockman-font">Bath: {project.baths}</span>
                </span>
              )}

            {/* Area */}
            {project.area_size && (
              <span className="flex items-center gap-1 text-gray-500 text-sm">
                <FaRulerCombined className="h-3 w-3 flex-shrink-0 text-gray-500" />
                <span className="brockman-font text-sm">
                  {Number(project.area_size).toLocaleString()}{" "}
                  {project?.category?.toLowerCase() === "apartment" ||
                  project?.category?.toLowerCase() === "office" ||
                  project?.category?.toLowerCase() === "shop"
                    ? "Sq.Ft"
                    : "Sq.Yd"}
                </span>
              </span>
            )}

            {/* Completion */}
            {project.completion && (
              <span className="flex items-center gap-1 text-gray-500 text-sm">
                <span className="brockman-font">Completion: {project.completion}</span>
              </span>
            )}
          </div>

          {/* Description */}
          <p className="text-gray-600 text-sm leading-relaxed line-clamp-2 brockman-font">
            {project.description || "No description available for this project."}
          </p>
        </div>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen flex flex-col">
      <Header />

      <main className="flex-1 bg-gray-50 pt-20 pb-10">
        <div className="px-4 sm:px-6 lg:px-8">
          {/* Mobile Filter Toggle & Header Section */}
          <div className="mb-6">
            {/* Mobile Filter Toggle Button */}
            <button
              onClick={() => setShowFilters(!showFilters)}
              className="lg:hidden filter-toggle fixed top-24 left-4 z-30 bg-orange-500 text-white p-3 rounded-full shadow-lg hover:bg-orange-600 transition-colors duration-200"
            >
              <FaFilter className="h-5 w-5" />
            </button>
            
            {/* Header Section with View Toggle */}
            <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between mt-8">
              {/* Left: Header */}
              <div className="text-center lg:text-left flex-1">
                <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-gray-900 brockman-font">
                  Our Projects
                </h1>
                <p className="text-gray-600 mt-2 lg:mx-0 mx-auto brockman-font">
                  Discover premium real estate projects across Pakistan. From luxury developments to commercial spaces.
                </p>
              </div>

              {/* Right: View Toggle */}
              {!isMobile && (
                <div className="flex justify-center lg:justify-end lg:ml-8 lg:flex-shrink-0 mt-4 lg:mt-0">
                  <div className="bg-white rounded-xl shadow-md border border-gray-200 p-1 flex">
                    <button
                      onClick={() => setViewMode('tile')}
                      className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 brockman-font ${
                        viewMode === 'tile'
                          ? 'bg-gradient-to-r from-pink-500 to-orange-500 text-white shadow-md'
                          : 'text-gray-600 hover:bg-gray-100'
                      }`}
                    >
                      <FaTh className="h-4 w-4" />
                      <span>Grid</span>
                    </button>
                    <button
                      onClick={() => setViewMode('list')}
                      className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 brockman-font ${
                        viewMode === 'list'
                          ? 'bg-gradient-to-r from-pink-500 to-orange-500 text-white shadow-md'
                          : 'text-gray-600 hover:bg-gray-100'
                      }`}
                    >
                      <FaList className="h-4 w-4" />
                      <span>List</span>
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>

          <div className="flex gap-6">
            {/* Mobile Overlay */}
            {showFilters && (
              <div className="lg:hidden fixed inset-0 bg-black bg-opacity-50 z-40" />
            )}

            {/* Sidebar */}
            <aside className={`
              filter-sidebar
              ${showFilters ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
              fixed lg:sticky top-20 left-0 z-50 lg:z-auto
              w-80 lg:w-64 bg-white rounded-r-xl lg:rounded-xl shadow-lg lg:shadow-md 
              p-4 lg:p-4 h-[calc(100vh-5rem)] lg:h-fit lg:max-h-[80vh] 
              overflow-y-auto transition-transform duration-300 ease-in-out pb-24
            `}>
              {/* Mobile Close Button */}
              <div className="lg:hidden flex justify-between items-center mb-4">
                <h2 className="text-lg font-semibold brockman-font">Filters</h2>
                <button
                  onClick={() => setShowFilters(false)}
                  className="p-2 hover:bg-gray-100 rounded-full transition-colors"
                >
                  <FaTimes className="h-5 w-5 text-gray-500" />
                </button>
              </div>

              <h2 className="hidden lg:block text-lg font-semibold mb-4 brockman-font">Filters</h2>

              {/* Category Filter */}
              <div className="w-full mb-2">
                <label className="block text-sm font-medium mb-1 brockman-font">Category</label>
                <CustomDropdown
                  value={filters.category}
                  onChange={(val) =>
                    handleFilterChange({
                      target: { name: "category", value: val },
                    })
                  }
                  options={categoryOptions}
                />
              </div>

              {/* Completion Year Filter */}
              <div className="w-full mb-2">
                <label className="block text-sm font-medium mb-1 brockman-font">Completion Year</label>
                <input
                  type="number"
                  name="completion"
                  value={filters.completion}
                  onChange={handleFilterChange}
                  placeholder="Enter year (e.g., 2024)"
                  min="2020"
                  max="2030"
                  className="w-full rounded-xl border border-orange-200 bg-white px-3 py-2 text-sm text-gray-900 shadow-sm focus:outline-none focus:ring-2 focus:ring-orange-500 hover:border-orange-400"
                />
              </div>

              {/* Status Filter */}
              <div className="w-full mb-2">
                <label className="block text-sm font-medium mb-1 brockman-font">Status</label>
                <CustomDropdown
                  value={filters.status}
                  onChange={(val) =>
                    handleFilterChange({
                      target: { name: "status", value: val },
                    })
                  }
                  options={statusOptions}
                />
              </div>

              {/* Project Type */}
              <div className="w-full mb-2">
                <label className="block text-sm font-medium mb-1 brockman-font">Project Type</label>
                <CustomDropdown
                  value={filters.project_type}
                  onChange={(val) =>
                    handleFilterChange({
                      target: { name: "project_type", value: val },
                    })
                  }
                  options={["Any", "Sale", "Rent"]}
                />
              </div>

              {/* Location */}
              <div className="w-full mb-2">
                <label className="block text-sm font-medium mb-1 brockman-font">Location</label>
                <input
                  type="text"
                  name="location"
                  value={filters.location}
                  onChange={handleFilterChange}
                  placeholder="Enter area"
                  className="w-full rounded-xl border border-orange-200 bg-white px-3 py-2 text-sm text-gray-900 shadow-sm focus:outline-none focus:ring-2 focus:ring-orange-500 hover:border-orange-400"
                />
              </div>

              {/* Price Range */}
              <div className="mb-4">
                <label className="block text-sm font-medium mb-1 brockman-font">Price (PKR)</label>
                <div className="flex items-center gap-2">
                  <input
                    type="number"
                    name="minPrice"
                    value={filters.minPrice || ""}
                    onChange={(e) =>
                      setFilters((f) => ({
                        ...f,
                        minPrice: e.target.value ? Number(e.target.value) : "",
                      }))
                    }
                    className="w-1/2 rounded-xl border border-orange-200 bg-white px-3 py-2 text-sm text-gray-900 shadow-sm hover:border-orange-400 focus:outline-none focus:ring-2 focus:ring-orange-500"
                    placeholder="Min"
                  />

                  <span className="text-gray-500 text-sm font-medium brockman-font">to</span>
                  <input
                    type="number"
                    name="maxPrice"
                    value={filters.maxPrice || ""}
                    onChange={(e) =>
                      setFilters((f) => ({
                        ...f,
                        maxPrice: e.target.value ? Number(e.target.value) : "",
                      }))
                    }
                    className="w-1/2 rounded-xl border border-orange-200 bg-white px-2 py-2 text-sm text-gray-900 shadow-sm 
                              hover:border-orange-400 focus:outline-none focus:ring-2 focus:ring-orange-500"
                    placeholder="Max"
                  />
                </div>

                {/* Show formatted values */}
                <div className="flex gap-2 text-xs text-gray-500 -mt-3 mb-1">
                  <span className="w-1/2 truncate brockman-font ml-1">
                    {filters.minPrice ? formatPKR(filters.minPrice) : ""}
                  </span>
                  <span className="w-1/2 truncate brockman-font ml-7">
                    {filters.maxPrice ? formatPKR(filters.maxPrice) : ""}
                  </span>
                </div>
              </div>

              {/* Apply Filters Button (Mobile Only) */}
              <div className="lg:hidden">
                <button
                  onClick={() => setShowFilters(false)}
                  className="w-full bg-orange-500 text-white py-2 px-4 rounded-xl font-semibold hover:bg-orange-600 transition-colors duration-200 brockman-font"
                >
                  Apply Filters
                </button>
              </div>
            </aside>

            {/* Projects Display Area */}
            <div className="flex-1 min-w-0">
              {loading ? (
                <LoadingScreen />
              ) : filteredProjects.length === 0 ? (
                <div className="text-center py-12">
                  <div className="text-gray-400 text-6xl mb-4">🏗️</div>
                  <p className="text-xl text-gray-600 mb-2 brockman-font">No projects found</p>
                  <p className="text-gray-500 brockman-font">Try adjusting your filters to see more results</p>
                </div>
              ) : (
                <>
                  {/* Projects Grid/List */}
                  {viewMode === 'tile' ? (
                    /* Tile View - Grid Layout */
                    <div className="grid gap-3 sm:gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5">
                      {currentProjects.map(renderTileProject)}
                    </div>
                  ) : (
                    /* List View - Stacked Layout */
                    <div className="space-y-4">
                      {currentProjects.map(renderListProject)}
                    </div>
                  )}

                  {/* Pagination Component */}
                  {totalPages > 1 && (
                    <div className="mt-12 flex justify-center">
                      <div className="flex items-center space-x-1 sm:space-x-2">
                        {/* Previous Button */}
                        <button
                          onClick={goToPrevious}
                          disabled={currentPage === 1}
                          className={`flex items-center px-3 sm:px-4 py-2 rounded-xl text-sm font-semibold transition-all duration-200 brockman-font ${
                            currentPage === 1
                              ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                              : 'bg-white text-gray-700 border border-gray-300 hover:bg-gradient-to-r hover:from-pink-50 hover:to-orange-50 hover:border-orange-300 hover:text-orange-600 shadow-sm hover:shadow-md'
                          }`}
                        >
                          <FaChevronLeft className="h-3 w-3 sm:mr-2" />
                          <span className="hidden sm:inline">Previous</span>
                        </button>

                        {/* Page Numbers */}
                        <div className="flex items-center space-x-1">
                          {getPageNumbers().map((page, index) => (
                            <button
                              key={index}
                              onClick={() => typeof page === 'number' && goToPage(page)}
                              disabled={page === '...'}
                              className={`px-3 sm:px-4 py-2 rounded-xl text-sm font-semibold transition-all duration-200 brockman-font ${
                                page === currentPage
                                  ? 'bg-gradient-to-r from-pink-500 to-orange-500 text-white shadow-lg'
                                  : page === '...'
                                  ? 'text-gray-400 cursor-default'
                                  : 'bg-white text-gray-700 border border-gray-300 hover:bg-gradient-to-r hover:from-pink-50 hover:to-orange-50 hover:border-orange-300 hover:text-orange-600 shadow-sm hover:shadow-md'
                              }`}
                            >
                              {page}
                            </button>
                          ))}
                        </div>

                        {/* Next Button */}
                        <button
                          onClick={goToNext}
                          disabled={currentPage === totalPages}
                          className={`flex items-center px-3 sm:px-4 py-2 rounded-xl text-sm font-semibold transition-all duration-200 brockman-font ${
                            currentPage === totalPages
                              ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                              : 'bg-white text-gray-700 border border-gray-300 hover:bg-gradient-to-r hover:from-pink-50 hover:to-orange-50 hover:border-orange-300 hover:text-orange-600 shadow-sm hover:shadow-md'
                          }`}
                        >
                          <span className="hidden sm:inline">Next</span>
                          <FaChevronRight className="h-3 w-3 sm:ml-2" />
                        </button>
                      </div>
                    </div>
                  )}

                  {/* Results Summary */}
                  {filteredProjects.length > 0 && (
                    <div className="mt-8 text-center text-sm text-gray-500 bg-white rounded-lg py-3 px-4 shadow-sm border border-gray-100 brockman-font">
                      <div>
                        Showing {startIndex + 1}-{Math.min(endIndex, filteredProjects.length)} of {filteredProjects.length} projects
                      </div>
                      {totalPages > 1 && (
                        <div className="mt-1">
                          Page {currentPage} of {totalPages}
                        </div>
                      )}
                    </div>
                  )}
                </>
              )}
            </div>
          </div>
        </div>
      </main>

      <Footer />
      <FloatingChatbot />
    </div>
  );
}