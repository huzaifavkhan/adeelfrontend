import React, { useState, useEffect } from "react";
import { 
  Building2, 
  Search, 
  Plus, 
  LogOut, 
  Edit3, 
  Trash2, 
  Save, 
  X, 
  Home, 
  MapPin, 
  DollarSign,
  Bed,
  Bath,
  Image as ImageIcon,
  Video as VideoIcon,
  FileText,
  Star,
  StarOff,
  Play,
  Layers
} from "lucide-react";
import ProjectsAdmin from "./ProjectsAdmin"; // Import the ProjectsAdmin component

export default function Admin() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [token, setToken] = useState(null);
  const [currentSection, setCurrentSection] = useState("properties"); // "properties" or "projects"
  const [view, setView] = useState("list");
  const [properties, setProperties] = useState([]);
  const [filteredProperties, setFilteredProperties] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [currentProperty, setCurrentProperty] = useState({
    id: null,
    property_name:"",
    purpose: "",
    location: "",
    area_size: "",
    price: "",
    beds: "",
    baths: "",
    latitude: "",
    longitude: "",
    description: "",
    images: [],
    videos: [],
    property_type: ""
  });
  const [newImages, setNewImages] = useState([]);
  const [newVideos, setNewVideos] = useState([]);
  const [imagesToDelete, setImagesToDelete] = useState([]);
  const [videosToDelete, setVideosToDelete] = useState([]);
  const [thumbnailIndex, setThumbnailIndex] = useState(0);
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const [fieldErrors, setFieldErrors] = useState({});
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [propertyToDelete, setPropertyToDelete] = useState(null);

  // Fetch properties when logged in and in properties section
  useEffect(() => {
    if (token && currentSection === "properties") {
      fetchProperties();
    }
  }, [token, currentSection]);

  // Filter properties based on search term
  useEffect(() => {
    if (searchTerm.trim() === "") {
      setFilteredProperties(properties);
    } else {
      const filtered = properties.filter(property => {
        const searchLower = searchTerm.toLowerCase();
        return (
          property.id.toString().includes(searchLower) ||
          property.location.toLowerCase().includes(searchLower) ||
          property.purpose.toLowerCase().includes(searchLower) ||
          property.area_size.toLowerCase().includes(searchLower) ||
          property.price.toLowerCase().includes(searchLower)
        );
      });
      setFilteredProperties(filtered);
    }
  }, [searchTerm, properties]);

  // Handle login
  const handleLogin = async () => {
    if (!email || !password) {
      setMessage("❌ Please fill in both email and password");
      return;
    }
    
    setLoading(true);
    try {
      const res = await fetch(`${import.meta.env.VITE_BACKEND_URL}/api/auth/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      if (!res.ok) throw new Error("Invalid credentials");

      const data = await res.json();
      setToken(data.token);
      setMessage("✅ Login successful!");
      setEmail("");
      setPassword("");
    } catch (err) {
      setMessage("❌ " + err.message);
    } finally {
      setLoading(false);
    }
  };

  // Handle key press for login
  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      handleLogin();
    }
  };

  // Fetch all properties
  const fetchProperties = async () => {
    try {
      const res = await fetch(`${import.meta.env.VITE_BACKEND_URL}/api/properties`);
      if (!res.ok) throw new Error("Failed to fetch properties");
      const data = await res.json();
      setProperties(data);
    } catch (err) {
      setMessage("❌ Error fetching properties: " + err.message);
    }
  };

  // Validate form fields
  const validateForm = () => {
    const errors = {};
    
    if (!currentProperty.property_name.trim()) {
      errors.property_name = "Property name is required";
    }
    
    if (!currentProperty.purpose) {
      errors.purpose = "Purpose is required";
    }
    
    if (!currentProperty.location.trim()) {
      errors.location = "Location is required";
    }
    
    if (!currentProperty.area_size.trim()) {
      errors.area_size = "Area size is required";
    }
    
    if (!currentProperty.price.trim()) {
      errors.price = "Price is required";
    }
    
    if (!currentProperty.property_type) {
      errors.property_type = "Property type is required";
    }
    
    setFieldErrors(errors);
    return Object.keys(errors).length === 0;
  };

  // Clear field error when user starts typing
  const handlePropertyChangeWithValidation = (e) => {
    const { name, value } = e.target;
    setCurrentProperty({
      ...currentProperty,
      [name]: value
    });
    
    if (fieldErrors[name]) {
      setFieldErrors({
        ...fieldErrors,
        [name]: ""
      });
    }
  };

  // Handle image file uploads
  const handleImageChange = (e) => {
    const selectedFiles = Array.from(e.target.files);
    const totalImages = newImages.length + selectedFiles.length;
    
    if (totalImages > 18) {
      setMessage("❌ Maximum 18 images allowed. Please select fewer images.");
      return;
    }
    
    setNewImages([...newImages, ...selectedFiles]);
    setMessage("");
  };

  // Handle video file uploads
  const handleVideoChange = (e) => {
    const selectedFiles = Array.from(e.target.files);
    const totalVideos = newVideos.length + selectedFiles.length;
    
    if (totalVideos > 2) {
      setMessage("❌ Maximum 2 videos allowed. Please select fewer videos.");
      return;
    }
    
    setNewVideos([...newVideos, ...selectedFiles]);
    setMessage("");
  };

  // Remove image from new images list
  const removeNewImage = (index) => {
    const updatedImages = newImages.filter((_, i) => i !== index);
    setNewImages(updatedImages);
    
    if (view === "add") {
      if (thumbnailIndex >= updatedImages.length) {
        setThumbnailIndex(Math.max(0, updatedImages.length - 1));
      }
    }
  };

  // Remove video from new videos list
  const removeNewVideo = (index) => {
    const updatedVideos = newVideos.filter((_, i) => i !== index);
    setNewVideos(updatedVideos);
  };

  // Mark image for deletion
  const markImageForDeletion = (imageId) => {
    setImagesToDelete([...imagesToDelete, imageId]);
    setCurrentProperty({
      ...currentProperty,
      images: currentProperty.images.filter(img => img.id !== imageId)
    });
  };

  // Mark video for deletion
  const markVideoForDeletion = (videoId) => {
    setVideosToDelete([...videosToDelete, videoId]);
    setCurrentProperty({
      ...currentProperty,
      videos: currentProperty.videos.filter(vid => vid.id !== videoId)
    });
  };

  // Set thumbnail for new images
  const setNewImageThumbnail = (index) => {
    setThumbnailIndex(index);
  };

  // Validate media before submission
  const validateMedia = () => {
    const totalNewImages = newImages.length;
    const totalExistingImages = view === "edit" ? currentProperty.images.length : 0;
    const totalImages = totalNewImages + totalExistingImages;
    
    const totalNewVideos = newVideos.length;
    const totalExistingVideos = view === "edit" ? currentProperty.videos.length : 0;
    const totalVideos = totalNewVideos + totalExistingVideos;
    
    if (view === "add" && totalImages < 1) {
      setMessage("❌ At least 1 image is required");
      return false;
    }
    
    if (totalImages > 18) {
      setMessage("❌ Maximum 18 images allowed");
      return false;
    }

    if (totalVideos > 2) {
      setMessage("❌ Maximum 2 videos allowed");
      return false;
    }
    
    return true;
  };

  // Add new property
  const handleAddProperty = async () => {
    if (!validateForm()) {
      setMessage("❌ Please fill in all required fields");
      return;
    }
    
    if (!validateMedia()) return;
    
    setLoading(true);
    try {
      const formData = new FormData();
      Object.keys(currentProperty).forEach((key) => {
        if (key !== 'id' && key !== 'images' && key !== 'videos') {
          formData.append(key, currentProperty[key]);
        }
      });
      
      formData.append('thumbnailIndex', thumbnailIndex.toString());
      
      newImages.forEach((image) => {
        formData.append("images", image);
      });

      newVideos.forEach((video) => {
        formData.append("videos", video);
      });

      const res = await fetch(`${import.meta.env.VITE_BACKEND_URL}/api/admin/properties`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
        },
        body: formData,
      });

      if (!res.ok) throw new Error("Failed to add property");

      setMessage("✅ Property added successfully!");
      resetForm();
      fetchProperties();
      setView("list");
    } catch (err) {
      setMessage("❌ " + err.message);
    } finally {
      setLoading(false);
    }
  };

  // Update property
  const handleUpdateProperty = async () => {
    if (!validateForm()) {
      setMessage("❌ Please fill in all required fields");
      return;
    }
    
    if (!validateMedia()) return;
    
    setLoading(true);
    try {
      const formData = new FormData();
      Object.keys(currentProperty).forEach((key) => {
        if (key !== 'id' && key !== 'images' && key !== 'videos') {
          formData.append(key, currentProperty[key]);
        }
      });

      if (imagesToDelete.length > 0) {
        formData.append('deleteImageIds', JSON.stringify(imagesToDelete));
      }

      if (videosToDelete.length > 0) {
        formData.append('deleteVideoIds', JSON.stringify(videosToDelete));
      }
      
      if (newImages.length > 0) {
        formData.append('thumbnailIndex', thumbnailIndex.toString());
      }
      
      newImages.forEach((image) => {
        formData.append("images", image);
      });

      newVideos.forEach((video) => {
        formData.append("videos", video);
      });

      const res = await fetch(`${import.meta.env.VITE_BACKEND_URL}/api/admin/properties/${currentProperty.id}`, {
        method: "PUT",
        headers: {
          Authorization: `Bearer ${token}`,
        },
        body: formData,
      });

      if (!res.ok) throw new Error("Failed to update property");

      setMessage("✅ Property updated successfully!");
      resetForm();
      fetchProperties();
      setView("list");
    } catch (err) {
      setMessage("❌ " + err.message);
    } finally {
      setLoading(false);
    }
  };

  // Show delete confirmation modal
  const showDeleteConfirmation = (property) => {
    setPropertyToDelete(property);
    setShowDeleteModal(true);
  };

  // Delete property
  const handleDeleteProperty = async () => {
    if (!propertyToDelete) return;
    
    setLoading(true);
    try {
      const res = await fetch(`${import.meta.env.VITE_BACKEND_URL}/api/admin/properties/${propertyToDelete.id}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!res.ok) throw new Error("Failed to delete property");

      setMessage("✅ Property deleted successfully!");
      fetchProperties();
      setShowDeleteModal(false);
      setPropertyToDelete(null);
    } catch (err) {
      setMessage("❌ " + err.message);
    } finally {
      setLoading(false);
    }
  };

  // Cancel delete
  const cancelDelete = () => {
    setShowDeleteModal(false);
    setPropertyToDelete(null);
  };

  // Start editing a property
  const startEdit = (property) => {
    setCurrentProperty({
      ...property,
      price: property.price.toString(),
      beds: property.beds?.toString() || "",
      baths: property.baths?.toString() || "",
      latitude: property.latitude?.toString() || "",
      longitude: property.longitude?.toString() || "",
      videos: property.videos || []
    });
    setView("edit");
    setImagesToDelete([]);
    setVideosToDelete([]);
    setNewImages([]);
    setNewVideos([]);
    setThumbnailIndex(0);
  };

  // Reset form
  const resetForm = () => {
    setCurrentProperty({
      id: null,
      property_name:"",
      purpose: "",
      location: "",
      area_size: "",
      price: "",
      beds: "",
      baths: "",
      latitude: "",
      longitude: "",
      description: "",
      images: [],
      videos: [],
      property_type: ""
    });
    setNewImages([]);
    setNewVideos([]);
    setImagesToDelete([]);
    setVideosToDelete([]);
    setThumbnailIndex(0);
    setFieldErrors({});
  };

  // Handle section change
  const handleSectionChange = (section) => {
    setCurrentSection(section);
    setView("list");
    resetForm();
    setMessage("");
    setSearchTerm("");
  };

  // Logout
  const handleLogout = () => {
    setToken(null);
    setCurrentSection("properties");
    setView("list");
    resetForm();
    setMessage("");
    setSearchTerm("");
  };

  if (!token) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100 p-6">
        <div className="bg-white shadow-xl rounded-2xl w-full max-w-md p-8 border border-gray-200">
          <div className="text-center mb-8">
            <div className="flex justify-center mb-4">
              <Building2 className="w-12 h-12 text-blue-600" />
            </div>
            <h2 className="text-3xl font-bold text-gray-800 mb-2">Admin Login</h2>
            <p className="text-gray-600">Access your property management dashboard</p>
          </div>
          
          <div className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Email Address</label>
              <input
                type="email"
                placeholder="Enter Admin Email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                onKeyPress={handleKeyPress}
                className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                required
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Password</label>
              <input
                type="password"
                placeholder="Enter Admin Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                onKeyPress={handleKeyPress}
                className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                required
              />
            </div>
            
            <button
              onClick={handleLogin}
              disabled={loading}
              className="w-full bg-blue-600 text-white py-3 rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed font-semibold transition-colors shadow-lg"
            >
              {loading ? "Signing in..." : "Sign In"}
            </button>
            
            {message && (
              <div className={`p-4 rounded-lg text-center font-medium ${
                message.includes('✅') 
                  ? 'bg-green-100 text-green-700 border border-green-200' 
                  : 'bg-red-100 text-red-700 border border-red-200'
              }`}>
                {message}
              </div>
            )}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <nav className="bg-white shadow-lg border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2">
                <Building2 className="w-8 h-8 text-blue-600" />
                <h1 className="text-2xl font-bold text-gray-900">AdeelCorp Admin</h1>
              </div>
              <span className="text-sm text-gray-500">
                {currentSection === "properties" ? "Property Management Dashboard" : "Project Management Dashboard"}
              </span>
            </div>
            
            <div className="flex items-center space-x-4">
              {/* Properties Section Button */}
              <button
                onClick={() => handleSectionChange("properties")}
                className={`flex items-center space-x-2 px-4 py-2 rounded-lg font-medium transition-all ${
                  currentSection === "properties" 
                    ? "bg-blue-600 text-white shadow-md" 
                    : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                }`}
              >
                <Home className="w-4 h-4" />
                <span>Properties</span>
              </button>

              {/* Projects Section Button */}
              <button
                onClick={() => handleSectionChange("projects")}
                className={`flex items-center space-x-2 px-4 py-2 rounded-lg font-medium transition-all ${
                  currentSection === "projects" 
                    ? "bg-purple-600 text-white shadow-md" 
                    : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                }`}
              >
                <Layers className="w-4 h-4" />
                <span>Projects</span>
              </button>
              
              {/* Only show Add button for properties section when in list view */}
              {currentSection === "properties" && (
                <button
                  onClick={() => { setView("add"); resetForm(); setMessage(""); }}
                  className={`flex items-center space-x-2 px-4 py-2 rounded-lg font-medium transition-all ${
                    view === "add" 
                      ? "bg-green-600 text-white shadow-md" 
                      : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                  }`}
                >
                  <Plus className="w-4 h-4" />
                  <span>Add Property</span>
                </button>
              )}
              
              <button
                onClick={handleLogout}
                className="flex items-center space-x-2 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 font-medium transition-colors shadow-md"
              >
                <LogOut className="w-4 h-4" />
                <span>Logout</span>
              </button>
            </div>
          </div>
        </div>
      </nav>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Render Projects Admin Component */}
        {currentSection === "projects" && (
          <ProjectsAdmin token={token} onLogout={handleLogout} />
        )}

        {/* Properties Management Section */}
        {currentSection === "properties" && (
          <>
            {message && (
              <div className={`mb-6 p-4 rounded-lg font-medium ${
                message.includes('✅') 
                  ? 'bg-green-100 text-green-700 border border-green-200' 
                  : 'bg-red-100 text-red-700 border border-red-200'
              }`}>
                {message}
              </div>
            )}

            {view === "list" && (
              <div>
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8 space-y-4 sm:space-y-0">
                  <div>
                    <h2 className="text-3xl font-bold text-gray-900">Properties Management</h2>
                    <div className="text-sm text-gray-500 mt-1">
                      Total Properties: {properties.length}
                      {searchTerm && ` | Filtered: ${filteredProperties.length}`}
                    </div>
                  </div>
                  
                  <div className="relative w-full sm:w-96">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <Search className="h-5 w-5 text-gray-400" />
                    </div>
                    <input
                      type="text"
                      placeholder="Search by ID, location, purpose, area, or price..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                    {searchTerm && (
                      <button
                        onClick={() => setSearchTerm("")}
                        className="absolute inset-y-0 right-0 pr-3 flex items-center"
                      >
                        <X className="h-5 w-5 text-gray-400 hover:text-gray-600" />
                      </button>
                    )}
                  </div>
                </div>
                
                <div className="grid gap-6">
                  {filteredProperties.length === 0 ? (
                    <div className="bg-white rounded-xl shadow-sm p-12 text-center">
                      <div className="flex justify-center mb-4">
                        <Home className="w-16 h-16 text-gray-400" />
                      </div>
                      <h3 className="text-xl font-semibold text-gray-700 mb-2">
                        {searchTerm ? "No Properties Found" : "No Properties Found"}
                      </h3>
                      <p className="text-gray-500 mb-6">
                        {searchTerm 
                          ? `No properties match your search "${searchTerm}". Try different keywords.`
                          : "Start by adding your first property to the system."
                        }
                      </p>
                      {!searchTerm && (
                        <button
                          onClick={() => setView("add")}
                          className="flex items-center space-x-2 px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-medium transition-colors mx-auto"
                        >
                          <Plus className="w-4 h-4" />
                          <span>Add First Property</span>
                        </button>
                      )}
                    </div>
                  ) : (
                    filteredProperties.map((property) => (
                      <div key={property.id} className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden hover:shadow-md transition-shadow">
                        <div className="p-6">
                          <div className="flex justify-between items-start mb-4">
                            <div className="flex-1">
                              <div className="flex items-center space-x-2 mb-2">
                                <span className="text-xs bg-gray-100 text-gray-600 px-2 py-1 rounded font-mono">
                                  ID: {property.id}
                                </span>
                              </div>
                              <h3 className="text-xl font-semibold text-gray-900 mb-2">
                                {property.property_name || `${property.purpose} - ${property.location}`}
                              </h3>
                              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm text-gray-600">
                                <div className="flex items-center space-x-1">
                                  <span className="font-medium">Area:</span> 
                                  <span>{property.area_size}</span>
                                </div>
                                <div className="flex items-center space-x-1">
                                  <DollarSign className="w-4 h-4" />
                                  <span>{property.price}</span>
                                </div>
                                <div className="flex items-center space-x-1">
                                  <Bed className="w-4 h-4" />
                                  <span>{property.beds || 'N/A'}</span>
                                </div>
                                <div className="flex items-center space-x-1">
                                  <Bath className="w-4 h-4" />
                                  <span>{property.baths || 'N/A'}</span>
                                </div>
                              </div>
                              
                              {property.description && (
                                <div className="mt-3 text-sm text-gray-600">
                                  <p className="line-clamp-2">{property.description}</p>
                                </div>
                              )}
                              
                              {(property.latitude && property.longitude) && (
                                <div className="mt-2 text-sm text-gray-500 flex items-center space-x-1">
                                  <MapPin className="w-4 h-4" />
                                  <span>Coordinates: {property.latitude}, {property.longitude}</span>
                                </div>
                              )}
                            </div>
                            
                            <div className="flex space-x-2 ml-6">
                              <button
                                onClick={() => startEdit(property)}
                                className="flex items-center space-x-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium"
                              >
                                <Edit3 className="w-4 h-4" />
                                <span>Edit</span>
                              </button>
                              <button
                                onClick={() => showDeleteConfirmation(property)}
                                disabled={loading}
                                className="flex items-center space-x-1 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 disabled:opacity-50 transition-colors font-medium"
                              >
                                <Trash2 className="w-4 h-4" />
                                <span>Delete</span>
                              </button>
                            </div>
                          </div>
                          
                          <div className="space-y-4">
                            {property.images && property.images.length > 0 && (
                              <div>
                                <div className="flex items-center space-x-2 mb-2">
                                  <ImageIcon className="w-4 h-4 text-gray-600" />
                                  <h4 className="text-sm font-medium text-gray-700">
                                    Images ({property.images.length})
                                  </h4>
                                </div>
                                <div className="flex space-x-3 overflow-x-auto pb-2">
                                  {property.images.map((img) => (
                                    <img
                                      key={img.id}
                                      src={img.url}
                                      alt="Property"
                                      className="w-24 h-24 object-cover rounded-lg border border-gray-200 flex-shrink-0"
                                    />
                                  ))}
                                </div>
                              </div>
                            )}

                            {property.videos && property.videos.length > 0 && (
                              <div>
                                <div className="flex items-center space-x-2 mb-2">
                                  <VideoIcon className="w-4 h-4 text-gray-600" />
                                  <h4 className="text-sm font-medium text-gray-700">
                                    Videos ({property.videos.length})
                                  </h4>
                                </div>
                                <div className="flex space-x-3 overflow-x-auto pb-2">
                                  {property.videos.map((vid) => (
                                    <div key={vid.id} className="relative w-24 h-24 flex-shrink-0">
                                      <video
                                        src={vid.url}
                                        className="w-full h-full object-cover rounded-lg border border-gray-200"
                                        muted
                                      />
                                      <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-30 rounded-lg">
                                        <Play className="w-6 h-6 text-white" />
                                      </div>
                                    </div>
                                  ))}
                                </div>
                              </div>
                            )}
                          </div>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </div>
            )}

            {/* Property Add/Edit Form */}
            {(view === "add" || view === "edit") && (
              <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
                <div className="bg-gray-50 px-6 py-4 border-b border-gray-200">
                  <div className="flex items-center space-x-2">
                    {view === "add" ? <Plus className="w-6 h-6 text-green-600" /> : <Edit3 className="w-6 h-6 text-blue-600" />}
                    <h2 className="text-2xl font-bold text-gray-900">
                      {view === "add" ? "Add New Property" : "Edit Property"}
                    </h2>
                  </div>
                </div>
                
                <div className="p-6 space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Property Name <span className="text-red-500">*</span></label>
                      <input
                        name="property_name"
                        placeholder="e.g. Ocean View Apartment"
                        value={currentProperty.property_name}
                        onChange={handlePropertyChangeWithValidation}
                        className={`w-full border rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                          fieldErrors.property_name ? 'border-red-500' : 'border-gray-300'
                        }`}
                        required
                      />
                      {fieldErrors.property_name && (
                        <p className="text-red-500 text-sm mt-1">{fieldErrors.property_name}</p>
                      )}
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Purpose <span className="text-red-500">*</span></label>
                      <select
                        name="purpose"
                        value={currentProperty.purpose}
                        onChange={handlePropertyChangeWithValidation}
                        className={`w-full border rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                          fieldErrors.purpose ? 'border-red-500' : 'border-gray-300'
                        }`}
                        required
                      >
                        <option value="">Select Purpose</option>
                        <option value="Sale">For Sale</option>
                        <option value="Rent">For Rent</option>
                      </select>
                      {fieldErrors.purpose && (
                        <p className="text-red-500 text-sm mt-1">{fieldErrors.purpose}</p>
                      )}
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Location <span className="text-red-500">*</span></label>
                      <input
                        name="location"
                        placeholder="e.g. DHA Phase 5"
                        value={currentProperty.location}
                        onChange={handlePropertyChangeWithValidation}
                        className={`w-full border rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                          fieldErrors.location ? 'border-red-500' : 'border-gray-300'
                        }`}
                        required
                      />
                      {fieldErrors.location && (
                        <p className="text-red-500 text-sm mt-1">{fieldErrors.location}</p>
                      )}
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Area Size <span className="text-red-500">*</span></label>
                      <input
                        name="area_size"
                        placeholder="e.g. 1200 sq ft"
                        value={currentProperty.area_size}
                        onChange={handlePropertyChangeWithValidation}
                        className={`w-full border rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                          fieldErrors.area_size ? 'border-red-500' : 'border-gray-300'
                        }`}
                        required
                      />
                      {fieldErrors.area_size && (
                        <p className="text-red-500 text-sm mt-1">{fieldErrors.area_size}</p>
                      )}
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Price <span className="text-red-500">*</span></label>
                      <input
                        name="price"
                        type="text"
                        placeholder="e.g. 5 crore"
                        value={currentProperty.price}
                        onChange={handlePropertyChangeWithValidation}
                        className={`w-full border rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                          fieldErrors.price ? 'border-red-500' : 'border-gray-300'
                        }`}
                        required
                      />
                      {fieldErrors.price && (
                        <p className="text-red-500 text-sm mt-1">{fieldErrors.price}</p>
                      )}
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Property Type <span className="text-red-500">*</span></label>
                      <select
                        name="property_type"
                        value={currentProperty.property_type}
                        onChange={handlePropertyChangeWithValidation}
                        className={`w-full border rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                          fieldErrors.property_type ? 'border-red-500' : 'border-gray-300'
                        }`}
                        required
                      >
                        <option value="">Select Property Type</option>
                        <option value="Home">Home</option>
                        <option value="Plot">Plot</option>
                        <option value="Office">Office</option>
                        <option value="Shop">Shop</option>
                        <option value="Apartment">Apartment</option>
                      </select>
                      {fieldErrors.property_type && (
                        <p className="text-red-500 text-sm mt-1">{fieldErrors.property_type}</p>
                      )}
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Bedrooms</label>
                      <input
                        name="beds"
                        type="number"
                        placeholder="Leave blank if not applicable"
                        value={currentProperty.beds}
                        onChange={handlePropertyChangeWithValidation}
                        className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      />
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Bathrooms</label>
                      <input
                        name="baths"
                        type="number"
                        placeholder="Leave blank if not applicable"
                        value={currentProperty.baths}
                        onChange={handlePropertyChangeWithValidation}
                        className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      />
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Latitude</label>
                      <input
                        name="latitude"
                        type="number"
                        step="any"
                        placeholder="e.g. 24.8607"
                        value={currentProperty.latitude}
                        onChange={handlePropertyChangeWithValidation}
                        className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      />
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Longitude</label>
                      <input
                        name="longitude"
                        type="number"
                        step="any"
                        placeholder="e.g. 67.0011"
                        value={currentProperty.longitude}
                        onChange={handlePropertyChangeWithValidation}
                        className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Description</label>
                    <textarea
                      name="description"
                      rows="4"
                      placeholder="Enter property description, features, amenities, etc."
                      value={currentProperty.description}
                      onChange={handlePropertyChangeWithValidation}
                      className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-vertical"
                    />
                  </div>

                  {/* Current Images Section */}
                  {view === "edit" && currentProperty.images && currentProperty.images.length > 0 && (
                    <div className="space-y-3">
                      <div className="flex items-center space-x-2">
                        <ImageIcon className="w-4 h-4 text-gray-600" />
                        <label className="block text-sm font-medium text-gray-700">Current Images</label>
                      </div>
                      <div className="flex flex-wrap gap-3">
                        {currentProperty.images.map((img) => (
                          <div key={img.id} className="relative group">
                            <img
                              src={img.url}
                              alt="Property"
                              className="w-32 h-32 object-cover rounded-lg border border-gray-200"
                            />
                            <button
                              type="button"
                              onClick={() => markImageForDeletion(img.id)}
                              className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full w-8 h-8 flex items-center justify-center text-sm hover:bg-red-600 opacity-0 group-hover:opacity-100 transition-opacity shadow-lg"
                            >
                              <X className="w-4 h-4" />
                            </button>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Current Videos Section */}
                  {view === "edit" && currentProperty.videos && currentProperty.videos.length > 0 && (
                    <div className="space-y-3">
                      <div className="flex items-center space-x-2">
                        <VideoIcon className="w-4 h-4 text-gray-600" />
                        <label className="block text-sm font-medium text-gray-700">Current Videos</label>
                      </div>
                      <div className="flex flex-wrap gap-3">
                        {currentProperty.videos.map((vid) => (
                          <div key={vid.id} className="relative group">
                            <div className="relative w-32 h-32">
                              <video
                                src={vid.url}
                                className="w-full h-full object-cover rounded-lg border border-gray-200"
                                muted
                              />
                              <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-30 rounded-lg">
                                <Play className="w-8 h-8 text-white" />
                              </div>
                            </div>
                            <button
                              type="button"
                              onClick={() => markVideoForDeletion(vid.id)}
                              className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full w-8 h-8 flex items-center justify-center text-sm hover:bg-red-600 opacity-0 group-hover:opacity-100 transition-opacity shadow-lg"
                            >
                              <X className="w-4 h-4" />
                            </button>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Upload Images Section */}
                  <div>
                    <div className="flex items-center space-x-2 mb-2">
                      <ImageIcon className="w-4 h-4 text-gray-600" />
                      <label className="block text-sm font-medium text-gray-700">
                        {view === "add" ? "Upload Images *" : "Add New Images"}
                      </label>
                      <span className="text-xs text-gray-500">
                        ({view === "add" ? "Min: 1" : "Optional"}, Max: 18)
                      </span>
                    </div>
                    <input
                      type="file"
                      multiple
                      accept="image/*"
                      onChange={handleImageChange}
                      className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
                    />
                    
                    {newImages.length > 0 && (
                      <div className="mt-4 space-y-3">
                        <p className="text-sm font-medium text-gray-700">
                          Selected Images ({newImages.length}/18)
                        </p>
                        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3">
                          {newImages.map((file, index) => (
                            <div key={index} className="relative group">
                              <img
                                src={URL.createObjectURL(file)}
                                alt={`Preview ${index + 1}`}
                                className="w-full h-24 object-cover rounded-lg border border-gray-200"
                              />
                              
                              <button
                                type="button"
                                onClick={() => setNewImageThumbnail(index)}
                                className={`absolute top-2 left-2 rounded-full w-6 h-6 flex items-center justify-center text-xs transition-all ${
                                  thumbnailIndex === index 
                                    ? "bg-yellow-500 text-white shadow-lg" 
                                    : "bg-gray-700 bg-opacity-50 text-white opacity-0 group-hover:opacity-100"
                                }`}
                                title={thumbnailIndex === index ? "Thumbnail" : "Set as thumbnail"}
                              >
                                {thumbnailIndex === index ? <Star className="w-3 h-3" /> : <StarOff className="w-3 h-3" />}
                              </button>
                              
                              <button
                                type="button"
                                onClick={() => removeNewImage(index)}
                                className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center text-xs hover:bg-red-600 opacity-0 group-hover:opacity-100 transition-opacity shadow-lg"
                              >
                                <X className="w-3 h-3" />
                              </button>
                              
                              <div className="absolute bottom-0 left-0 right-0 bg-black bg-opacity-50 text-white text-xs p-1 rounded-b-lg truncate">
                                {file.name}
                              </div>
                            </div>
                          ))}
                        </div>
                        
                        {thumbnailIndex < newImages.length && (
                          <p className="text-xs text-gray-600 flex items-center space-x-1">
                            <Star className="w-3 h-3 text-yellow-500" />
                            <span>Thumbnail: {newImages[thumbnailIndex]?.name}</span>
                          </p>
                        )}
                      </div>
                    )}
                  </div>

                  {/* Upload Videos Section */}
                  <div>
                    <div className="flex items-center space-x-2 mb-2">
                      <VideoIcon className="w-4 h-4 text-gray-600" />
                      <label className="block text-sm font-medium text-gray-700">
                        {view === "add" ? "Upload Videos (Optional)" : "Add New Videos"}
                      </label>
                      <span className="text-xs text-gray-500">
                        (Max: 2, Size limit: 100MB each)
                      </span>
                    </div>
                    <input
                      type="file"
                      multiple
                      accept="video/*"
                      onChange={handleVideoChange}
                      className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-purple-50 file:text-purple-700 hover:file:bg-purple-100"
                    />
                    
                    {newVideos.length > 0 && (
                      <div className="mt-4 space-y-3">
                        <p className="text-sm font-medium text-gray-700">
                          Selected Videos ({newVideos.length}/2)
                        </p>
                        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3">
                          {newVideos.map((file, index) => (
                            <div key={index} className="relative group">
                              <video
                                src={URL.createObjectURL(file)}
                                className="w-full h-24 object-cover rounded-lg border border-gray-200"
                                muted
                              />
                              <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-30 rounded-lg">
                                <Play className="w-6 h-6 text-white" />
                              </div>
                              
                              <button
                                type="button"
                                onClick={() => removeNewVideo(index)}
                                className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center text-xs hover:bg-red-600 opacity-0 group-hover:opacity-100 transition-opacity shadow-lg"
                              >
                                <X className="w-3 h-3" />
                              </button>
                              
                              <div className="absolute bottom-0 left-0 right-0 bg-black bg-opacity-50 text-white text-xs p-1 rounded-b-lg truncate">
                                {file.name}
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>

                  <div className="flex space-x-4 pt-4">
                    <button
                      onClick={view === "add" ? handleAddProperty : handleUpdateProperty}
                      disabled={loading}
                      className="flex-1 flex items-center justify-center space-x-2 bg-green-600 text-white py-3 rounded-lg hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed font-semibold transition-colors shadow-lg"
                    >
                      {loading ? (
                        <>
                          <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                          <span>Saving...</span>
                        </>
                      ) : (
                        <>
                          <Save className="w-4 h-4" />
                          <span>{view === "add" ? "Add Property" : "Update Property"}</span>
                        </>
                      )}
                    </button>
                    
                    <button
                      onClick={() => { setView("list"); resetForm(); setMessage(""); }}
                      className="flex items-center space-x-2 px-8 py-3 bg-gray-600 text-white rounded-lg hover:bg-gray-700 font-semibold transition-colors shadow-lg"
                    >
                      <X className="w-4 h-4" />
                      <span>Cancel</span>
                    </button>
                  </div>
                </div>
              </div>
            )}

            {/* Delete Confirmation Modal */}
            {showDeleteModal && (
              <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
                <div className="bg-white rounded-xl shadow-2xl max-w-md w-full">
                  <div className="p-6">
                    <div className="flex items-center space-x-3 mb-4">
                      <div className="flex-shrink-0 w-10 h-10 bg-red-100 rounded-full flex items-center justify-center">
                        <Trash2 className="w-5 h-5 text-red-600" />
                      </div>
                      <div>
                        <h3 className="text-lg font-semibold text-gray-900">Delete Property</h3>
                        <p className="text-sm text-gray-500">This action cannot be undone</p>
                      </div>
                    </div>
                    
                    <div className="mb-6">
                      <p className="text-gray-700 mb-3">
                        Are you sure you want to delete this property?
                      </p>
                      {propertyToDelete && (
                        <div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
                          <div className="flex items-center space-x-2 mb-2">
                            <span className="text-xs bg-gray-200 text-gray-600 px-2 py-1 rounded font-mono">
                              ID: {propertyToDelete.id}
                            </span>
                          </div>
                          <h4 className="font-semibold text-gray-900 mb-1">
                            {propertyToDelete.property_name || `${propertyToDelete.purpose} - ${propertyToDelete.location}`}
                          </h4>
                          <div className="text-sm text-gray-600 space-y-1">
                            <div className="flex items-center space-x-2">
                              <MapPin className="w-3 h-3" />
                              <span>{propertyToDelete.location}</span>
                            </div>
                            <div className="flex items-center space-x-2">
                              <DollarSign className="w-3 h-3" />
                              <span>{propertyToDelete.price}</span>
                            </div>
                            <div className="flex items-center space-x-2">
                              <Home className="w-3 h-3" />
                              <span>{propertyToDelete.area_size}</span>
                            </div>
                            <div className="flex items-center space-x-4 text-xs">
                              <span className="flex items-center space-x-1">
                                <ImageIcon className="w-3 h-3" />
                                <span>{propertyToDelete.images?.length || 0} images</span>
                              </span>
                              <span className="flex items-center space-x-1">
                                <VideoIcon className="w-3 h-3" />
                                <span>{propertyToDelete.videos?.length || 0} videos</span>
                              </span>
                            </div>
                          </div>
                        </div>
                      )}
                    </div>
                    
                    <div className="flex space-x-3">
                      <button
                        onClick={cancelDelete}
                        disabled={loading}
                        className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 font-medium transition-colors disabled:opacity-50"
                      >
                        Cancel
                      </button>
                      <button
                        onClick={handleDeleteProperty}
                        disabled={loading}
                        className="flex-1 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 font-medium transition-colors disabled:opacity-50 flex items-center justify-center space-x-2"
                      >
                        {loading ? (
                          <>
                            <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                            <span>Deleting...</span>
                          </>
                        ) : (
                          <>
                            <Trash2 className="w-4 h-4" />
                            <span>Delete Property</span>
                          </>
                        )}
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}