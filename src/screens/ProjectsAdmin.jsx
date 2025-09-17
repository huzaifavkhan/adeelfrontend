import React, { useState, useEffect } from "react";
import { 
  Building2, 
  Search, 
  Plus, 
  Edit3, 
  Trash2, 
  Save, 
  X, 
  MapPin, 
  DollarSign,
  Bed,
  Bath,
  Image as ImageIcon,
  Video as VideoIcon,
  Star,
  StarOff,
  Play,
  Tag,
  CheckCircle
} from "lucide-react";

export default function ProjectsAdmin({ token, onLogout }) {
  const [view, setView] = useState("list");
  const [projects, setProjects] = useState([]);
  const [filteredProjects, setFilteredProjects] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [currentProject, setCurrentProject] = useState({
    id: null,
    project_name: "",
    category: "",
    project_type: "",
    completion: "",
    status: "",
    location: "",
    area_size: "",
    price: "",
    beds: "",
    baths: "",
    latitude: "",
    longitude: "",
    description: "",
    images: [],
    videos: []
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
  const [projectToDelete, setProjectToDelete] = useState(null);

  // Fetch projects when component mounts
  useEffect(() => {
    if (token) {
      fetchProjects();
    }
  }, [token]);

  // Filter projects based on search term
  useEffect(() => {
    if (searchTerm.trim() === "") {
      setFilteredProjects(projects);
    } else {
      const filtered = projects.filter(project => {
        const searchLower = searchTerm.toLowerCase();
        return (
          project.id.toString().includes(searchLower) ||
          project.project_name.toLowerCase().includes(searchLower) ||
          project.location.toLowerCase().includes(searchLower) ||
          project.category?.toLowerCase().includes(searchLower) ||
          project.status?.toLowerCase().includes(searchLower) ||
          project.completion?.toLowerCase().includes(searchLower) ||
          project.price.toLowerCase().includes(searchLower)
        );
      });
      setFilteredProjects(filtered);
    }
  }, [searchTerm, projects]);

  // Fetch all projects
  const fetchProjects = async () => {
    try {
      const res = await fetch(`${import.meta.env.VITE_BACKEND_URL}/api/projects`);
      if (!res.ok) throw new Error("Failed to fetch projects");
      const data = await res.json();
      setProjects(data);
    } catch (err) {
      setMessage("❌ Error fetching projects: " + err.message);
    }
  };

  // Validate form fields
  const validateForm = () => {
    const errors = {};
    
    if (!currentProject.project_name.trim()) {
      errors.project_name = "Project name is required";
    }
    
    if (!currentProject.category) {
      errors.category = "Category is required";
    }
    
    if (!currentProject.project_type) {
      errors.project_type = "Project type is required";
    }
    
    if (!currentProject.completion) {
      errors.completion = "Completion status is required";
    }
    
    if (!currentProject.status) {
      errors.status = "Status is required";
    }
    
    if (!currentProject.location.trim()) {
      errors.location = "Location is required";
    }
    
    if (!currentProject.price.trim()) {
      errors.price = "Price is required";
    }
    
    setFieldErrors(errors);
    return Object.keys(errors).length === 0;
  };

  // Clear field error when user starts typing
  const handleProjectChangeWithValidation = (e) => {
    const { name, value } = e.target;
    setCurrentProject({
      ...currentProject,
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
    setCurrentProject({
      ...currentProject,
      images: currentProject.images.filter(img => img.id !== imageId)
    });
  };

  // Mark video for deletion
  const markVideoForDeletion = (videoId) => {
    setVideosToDelete([...videosToDelete, videoId]);
    setCurrentProject({
      ...currentProject,
      videos: currentProject.videos.filter(vid => vid.id !== videoId)
    });
  };

  // Set thumbnail for new images
  const setNewImageThumbnail = (index) => {
    setThumbnailIndex(index);
  };

  // Validate media before submission
  const validateMedia = () => {
    const totalNewImages = newImages.length;
    const totalExistingImages = view === "edit" ? currentProject.images.length : 0;
    const totalImages = totalNewImages + totalExistingImages;
    
    const totalNewVideos = newVideos.length;
    const totalExistingVideos = view === "edit" ? currentProject.videos.length : 0;
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

  // Add new project
  const handleAddProject = async () => {
    if (!validateForm()) {
      setMessage("❌ Please fill in all required fields");
      return;
    }
    
    if (!validateMedia()) return;
    
    setLoading(true);
    try {
      const formData = new FormData();
      Object.keys(currentProject).forEach((key) => {
        if (key !== 'id' && key !== 'images' && key !== 'videos') {
          formData.append(key, currentProject[key]);
        }
      });
      
      formData.append('thumbnailIndex', thumbnailIndex.toString());
      
      newImages.forEach((image) => {
        formData.append("images", image);
      });

      newVideos.forEach((video) => {
        formData.append("videos", video);
      });

      const res = await fetch(`${import.meta.env.VITE_BACKEND_URL}/api/admin/projects`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
        },
        body: formData,
      });

      if (!res.ok) throw new Error("Failed to add project");

      setMessage("✅ Project added successfully!");
      resetForm();
      fetchProjects();
      setView("list");
    } catch (err) {
      setMessage("❌ " + err.message);
    } finally {
      setLoading(false);
    }
  };

  // Update project
  const handleUpdateProject = async () => {
    if (!validateForm()) {
      setMessage("❌ Please fill in all required fields");
      return;
    }
    
    if (!validateMedia()) return;
    
    setLoading(true);
    try {
      const formData = new FormData();
      Object.keys(currentProject).forEach((key) => {
        if (key !== 'id' && key !== 'images' && key !== 'videos') {
          formData.append(key, currentProject[key]);
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

      const res = await fetch(`${import.meta.env.VITE_BACKEND_URL}/api/admin/projects/${currentProject.id}`, {
        method: "PUT",
        headers: {
          Authorization: `Bearer ${token}`,
        },
        body: formData,
      });

      if (!res.ok) throw new Error("Failed to update project");

      setMessage("✅ Project updated successfully!");
      resetForm();
      fetchProjects();
      setView("list");
    } catch (err) {
      setMessage("❌ " + err.message);
    } finally {
      setLoading(false);
    }
  };

  // Show delete confirmation modal
  const showDeleteConfirmation = (project) => {
    setProjectToDelete(project);
    setShowDeleteModal(true);
  };

  // Delete project
  const handleDeleteProject = async () => {
    if (!projectToDelete) return;
    
    setLoading(true);
    try {
      const res = await fetch(`${import.meta.env.VITE_BACKEND_URL}/api/admin/projects/${projectToDelete.id}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!res.ok) throw new Error("Failed to delete project");

      setMessage("✅ Project deleted successfully!");
      fetchProjects();
      setShowDeleteModal(false);
      setProjectToDelete(null);
    } catch (err) {
      setMessage("❌ " + err.message);
    } finally {
      setLoading(false);
    }
  };

  // Cancel delete
  const cancelDelete = () => {
    setShowDeleteModal(false);
    setProjectToDelete(null);
  };

  // Start editing a project
  const startEdit = (project) => {
    setCurrentProject({
      ...project,
      area_size: project.area_size?.toString() || "",
      beds: project.beds?.toString() || "",
      baths: project.baths?.toString() || "",
      latitude: project.latitude?.toString() || "",
      longitude: project.longitude?.toString() || "",
      videos: project.videos || []
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
    setCurrentProject({
      id: null,
      project_name: "",
      category: "",
      project_type: "",
      completion: "",
      status: "",
      location: "",
      area_size: "",
      price: "",
      beds: "",
      baths: "",
      latitude: "",
      longitude: "",
      description: "",
      images: [],
      videos: []
    });
    setNewImages([]);
    setNewVideos([]);
    setImagesToDelete([]);
    setVideosToDelete([]);
    setThumbnailIndex(0);
    setFieldErrors({});
  };

  // Get status color
  const getStatusColor = (status) => {
    switch (status?.toLowerCase()) {
      case "upcoming":
        return "bg-blue-100 text-blue-600";
      case "under construction":
        return "bg-yellow-100 text-yellow-600";
      case "completed":
        return "bg-green-100 text-green-600";
      default:
        return "bg-gray-100 text-gray-600";
    }
  };

  // Get category color
  const getCategoryColor = (category) => {
    switch (category?.toLowerCase()) {
      case "house":
        return "bg-purple-100 text-purple-600";
      case "apartment":
        return "bg-indigo-100 text-indigo-600";
      case "office":
        return "bg-blue-100 text-blue-600";
      case "shop":
        return "bg-orange-100 text-orange-600";
      case "plot":
        return "bg-green-100 text-green-600";
      default:
        return "bg-gray-100 text-gray-600";
    }
  };

  return (
    <div className="space-y-6">
      {message && (
        <div className={`p-4 rounded-lg font-medium ${
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
              <h2 className="text-3xl font-bold text-gray-900">Projects Management</h2>
              <div className="text-sm text-gray-500 mt-1">
                Total Projects: {projects.length}
                {searchTerm && ` | Filtered: ${filteredProjects.length}`}
              </div>
            </div>
            
            <div className="flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-4 w-full sm:w-auto">
              <div className="relative w-full sm:w-96">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Search className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  type="text"
                  placeholder="Search projects..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
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
              
              <button
                onClick={() => { setView("add"); resetForm(); setMessage(""); }}
                className="flex items-center space-x-2 px-6 py-3 bg-purple-600 text-white rounded-lg hover:bg-purple-700 font-medium transition-colors whitespace-nowrap"
              >
                <Plus className="w-4 h-4" />
                <span>Add Project</span>
              </button>
            </div>
          </div>
          
          <div className="grid gap-6">
            {filteredProjects.length === 0 ? (
              <div className="bg-white rounded-xl shadow-sm p-12 text-center">
                <div className="flex justify-center mb-4">
                  <Building2 className="w-16 h-16 text-gray-400" />
                </div>
                <h3 className="text-xl font-semibold text-gray-700 mb-2">
                  {searchTerm ? "No Projects Found" : "No Projects Found"}
                </h3>
                <p className="text-gray-500 mb-6">
                  {searchTerm 
                    ? `No projects match your search "${searchTerm}". Try different keywords.`
                    : "Start by adding your first project to the system."
                  }
                </p>
                {!searchTerm && (
                  <button
                    onClick={() => setView("add")}
                    className="flex items-center space-x-2 px-6 py-3 bg-purple-600 text-white rounded-lg hover:bg-purple-700 font-medium transition-colors mx-auto"
                  >
                    <Plus className="w-4 h-4" />
                    <span>Add First Project</span>
                  </button>
                )}
              </div>
            ) : (
              filteredProjects.map((project) => (
                <div key={project.id} className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden hover:shadow-md transition-shadow">
                  <div className="p-6">
                    <div className="flex justify-between items-start mb-4">
                      <div className="flex-1">
                        <div className="flex items-center space-x-2 mb-2">
                          <span className="text-xs bg-gray-100 text-gray-600 px-2 py-1 rounded font-mono">
                            ID: {project.id}
                          </span>
                          {project.category && (
                            <span className={`text-xs px-2 py-1 rounded ${getCategoryColor(project.category)}`}>
                              {project.category}
                            </span>
                          )}
                          {project.status && (
                            <span className={`text-xs px-2 py-1 rounded ${getStatusColor(project.status)}`}>
                              {project.status}
                            </span>
                          )}
                          <span className="text-xs bg-red-600 text-white px-2 py-1 rounded">
                            FOR {project.project_type?.toUpperCase()}
                          </span>
                        </div>
                        <h3 className="text-xl font-semibold text-gray-900 mb-2">
                          {project.project_name}
                        </h3>
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm text-gray-600">
                          <div className="flex items-center space-x-1">
                            <MapPin className="w-4 h-4" />
                            <span>{project.location}</span>
                          </div>
                          <div className="flex items-center space-x-1">
                            <DollarSign className="w-4 h-4" />
                            <span>{project.price}</span>
                          </div>
                          {project.area_size && (
                            <div className="flex items-center space-x-1">
                              <span className="font-medium">Area:</span> 
                              <span>{project.area_size} Sq. Yd.</span>
                            </div>
                          )}
                          {project.completion && (
                            <div className="flex items-center space-x-1">
                              <CheckCircle className="w-4 h-4" />
                              <span>{project.completion}</span>
                            </div>
                          )}
                        </div>
                        
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm text-gray-600 mt-2">
                          {project.beds > 0 && (
                            <div className="flex items-center space-x-1">
                              <Bed className="w-4 h-4" />
                              <span>{project.beds} Beds</span>
                            </div>
                          )}
                          {project.baths > 0 && (
                            <div className="flex items-center space-x-1">
                              <Bath className="w-4 h-4" />
                              <span>{project.baths} Baths</span>
                            </div>
                          )}
                        </div>
                        
                        {project.description && (
                          <div className="mt-3 text-sm text-gray-600">
                            <p className="line-clamp-2">{project.description}</p>
                          </div>
                        )}
                      </div>
                      
                      <div className="flex space-x-2 ml-6">
                        <button
                          onClick={() => startEdit(project)}
                          className="flex items-center space-x-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium"
                        >
                          <Edit3 className="w-4 h-4" />
                          <span>Edit</span>
                        </button>
                        <button
                          onClick={() => showDeleteConfirmation(project)}
                          disabled={loading}
                          className="flex items-center space-x-1 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 disabled:opacity-50 transition-colors font-medium"
                        >
                          <Trash2 className="w-4 h-4" />
                          <span>Delete</span>
                        </button>
                      </div>
                    </div>
                    
                    <div className="space-y-4">
                      {project.images && project.images.length > 0 && (
                        <div>
                          <div className="flex items-center space-x-2 mb-2">
                            <ImageIcon className="w-4 h-4 text-gray-600" />
                            <h4 className="text-sm font-medium text-gray-700">
                              Images ({project.images.length})
                            </h4>
                          </div>
                          <div className="flex space-x-3 overflow-x-auto pb-2">
                            {project.images.map((img) => (
                              <img
                                key={img.id}
                                src={img.url}
                                alt="Project"
                                className="w-24 h-24 object-cover rounded-lg border border-gray-200 flex-shrink-0"
                              />
                            ))}
                          </div>
                        </div>
                      )}

                      {project.videos && project.videos.length > 0 && (
                        <div>
                          <div className="flex items-center space-x-2 mb-2">
                            <VideoIcon className="w-4 h-4 text-gray-600" />
                            <h4 className="text-sm font-medium text-gray-700">
                              Videos ({project.videos.length})
                            </h4>
                          </div>
                          <div className="flex space-x-3 overflow-x-auto pb-2">
                            {project.videos.map((vid) => (
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

      {(view === "add" || view === "edit") && (
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
          <div className="bg-gray-50 px-6 py-4 border-b border-gray-200">
            <div className="flex items-center space-x-2">
              {view === "add" ? <Plus className="w-6 h-6 text-purple-600" /> : <Edit3 className="w-6 h-6 text-blue-600" />}
              <h2 className="text-2xl font-bold text-gray-900">
                {view === "add" ? "Add New Project" : "Edit Project"}
              </h2>
            </div>
          </div>
          
          <div className="p-6 space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Project Name <span className="text-red-500">*</span>
                </label>
                <input
                  name="project_name"
                  placeholder="e.g. Ocean View Towers"
                  value={currentProject.project_name}
                  onChange={handleProjectChangeWithValidation}
                  className={`w-full border rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent ${
                    fieldErrors.project_name ? 'border-red-500' : 'border-gray-300'
                  }`}
                  required
                />
                {fieldErrors.project_name && (
                  <p className="text-red-500 text-sm mt-1">{fieldErrors.project_name}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Category <span className="text-red-500">*</span></label>
                <select
                  name="category"
                  value={currentProject.category}
                  onChange={handleProjectChangeWithValidation}
                  className={`w-full border rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent ${
                    fieldErrors.category ? 'border-red-500' : 'border-gray-300'
                  }`}
                  required
                >
                  <option value="">Select Category</option>
                  <option value="House">House</option>
                  <option value="Apartment">Apartment</option>
                  <option value="Office">Office</option>
                  <option value="Shop">Shop</option>
                  <option value="Plot">Plot</option>
                </select>
                {fieldErrors.category && (
                  <p className="text-red-500 text-sm mt-1">{fieldErrors.category}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Project Type <span className="text-red-500">*</span></label>
                <select
                  name="project_type"
                  value={currentProject.project_type}
                  onChange={handleProjectChangeWithValidation}
                  className={`w-full border rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent ${
                    fieldErrors.project_type ? 'border-red-500' : 'border-gray-300'
                  }`}
                  required
                >
                  <option value="">Select Project Type</option>
                  <option value="Sale">For Sale</option>
                  <option value="Rent">For Rent</option>
                </select>
                {fieldErrors.project_type && (
                  <p className="text-red-500 text-sm mt-1">{fieldErrors.project_type}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Completion Year <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  name="completion"
                  value={currentProject.completion}
                  onChange={handleProjectChangeWithValidation}
                  className={`w-full border rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent ${
                    fieldErrors.completion ? 'border-red-500' : 'border-gray-300'
                  }`}
                  placeholder="Enter completion year (e.g. 2026)"
                  required
                />
                {fieldErrors.completion && (
                  <p className="text-red-500 text-sm mt-1">{fieldErrors.completion}</p>
                )}
              </div>


              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Status <span className="text-red-500">*</span></label>
                <select
                  name="status"
                  value={currentProject.status}
                  onChange={handleProjectChangeWithValidation}
                  className={`w-full border rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent ${
                    fieldErrors.status ? 'border-red-500' : 'border-gray-300'
                  }`}
                  required
                >
                  <option value="">Select Status</option>
                  <option value="Upcoming">Upcoming</option>
                  <option value="Under Construction">Under Construction</option>
                  <option value="Completed">Completed</option>
                </select>
                {fieldErrors.status && (
                  <p className="text-red-500 text-sm mt-1">{fieldErrors.status}</p>
                )}
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Location <span className="text-red-500">*</span></label>
                <input
                  name="location"
                  placeholder="e.g. DHA Phase 5"
                  value={currentProject.location}
                  onChange={handleProjectChangeWithValidation}
                  className={`w-full border rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent ${
                    fieldErrors.location ? 'border-red-500' : 'border-gray-300'
                  }`}
                  required
                />
                {fieldErrors.location && (
                  <p className="text-red-500 text-sm mt-1">{fieldErrors.location}</p>
                )}
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Area Size</label>
                <input
                  name="area_size"
                  placeholder="e.g. 500"
                  value={currentProject.area_size}
                  onChange={handleProjectChangeWithValidation}
                  className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Price <span className="text-red-500">*</span></label>
                <input
                  name="price"
                  type="text"
                  placeholder="e.g. 8.5 Crore"
                  value={currentProject.price}
                  onChange={handleProjectChangeWithValidation}
                  className={`w-full border rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent ${
                    fieldErrors.price ? 'border-red-500' : 'border-gray-300'
                  }`}
                  required
                />
                {fieldErrors.price && (
                  <p className="text-red-500 text-sm mt-1">{fieldErrors.price}</p>
                )}
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Bedrooms</label>
                <input
                  name="beds"
                  type="number"
                  placeholder="Leave blank if not applicable"
                  value={currentProject.beds}
                  onChange={handleProjectChangeWithValidation}
                  className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Bathrooms</label>
                <input
                  name="baths"
                  type="number"
                  placeholder="Leave blank if not applicable"
                  value={currentProject.baths}
                  onChange={handleProjectChangeWithValidation}
                  className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Latitude</label>
                <input
                  name="latitude"
                  type="number"
                  step="any"
                  placeholder="e.g. 24.8607"
                  value={currentProject.latitude}
                  onChange={handleProjectChangeWithValidation}
                  className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Longitude</label>
                <input
                  name="longitude"
                  type="number"
                  step="any"
                  placeholder="e.g. 67.0011"
                  value={currentProject.longitude}
                  onChange={handleProjectChangeWithValidation}
                  className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Description</label>
              <textarea
                name="description"
                rows="4"
                placeholder="Enter project description, features, amenities, etc."
                value={currentProject.description}
                onChange={handleProjectChangeWithValidation}
                className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent resize-vertical"
              />
            </div>

            {/* Current Images Section */}
            {view === "edit" && currentProject.images && currentProject.images.length > 0 && (
              <div className="space-y-3">
                <div className="flex items-center space-x-2">
                  <ImageIcon className="w-4 h-4 text-gray-600" />
                  <label className="block text-sm font-medium text-gray-700">Current Images</label>
                </div>
                <div className="flex flex-wrap gap-3">
                  {currentProject.images.map((img) => (
                    <div key={img.id} className="relative group">
                      <img
                        src={img.url}
                        alt="Project"
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
            {view === "edit" && currentProject.videos && currentProject.videos.length > 0 && (
              <div className="space-y-3">
                <div className="flex items-center space-x-2">
                  <VideoIcon className="w-4 h-4 text-gray-600" />
                  <label className="block text-sm font-medium text-gray-700">Current Videos</label>
                </div>
                <div className="flex flex-wrap gap-3">
                  {currentProject.videos.map((vid) => (
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
                className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-purple-50 file:text-purple-700 hover:file:bg-purple-100"
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
                className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-purple-50 file:text-purple-700 hover:file:bg-purple-100"
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
                onClick={view === "add" ? handleAddProject : handleUpdateProject}
                disabled={loading}
                className="flex-1 flex items-center justify-center space-x-2 bg-purple-600 text-white py-3 rounded-lg hover:bg-purple-700 disabled:opacity-50 disabled:cursor-not-allowed font-semibold transition-colors shadow-lg"
              >
                {loading ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                    <span>Saving...</span>
                  </>
                ) : (
                  <>
                    <Save className="w-4 h-4" />
                    <span>{view === "add" ? "Add Project" : "Update Project"}</span>
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
                  <h3 className="text-lg font-semibold text-gray-900">Delete Project</h3>
                  <p className="text-sm text-gray-500">This action cannot be undone</p>
                </div>
              </div>
              
              <div className="mb-6">
                <p className="text-gray-700 mb-3">
                  Are you sure you want to delete this project?
                </p>
                {projectToDelete && (
                  <div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
                    <div className="flex items-center space-x-2 mb-2">
                      <span className="text-xs bg-gray-200 text-gray-600 px-2 py-1 rounded font-mono">
                        ID: {projectToDelete.id}
                      </span>
                      {projectToDelete.category && (
                        <span className={`text-xs px-2 py-1 rounded ${getCategoryColor(projectToDelete.category)}`}>
                          {projectToDelete.category}
                        </span>
                      )}
                    </div>
                    <h4 className="font-semibold text-gray-900 mb-1">
                      {projectToDelete.project_name}
                    </h4>
                    <div className="text-sm text-gray-600 space-y-1">
                      <div className="flex items-center space-x-2">
                        <MapPin className="w-3 h-3" />
                        <span>{projectToDelete.location}</span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <DollarSign className="w-3 h-3" />
                        <span>{projectToDelete.price}</span>
                      </div>
                      <div className="flex items-center space-x-4 text-xs mt-2">
                        <span className="flex items-center space-x-1">
                          <ImageIcon className="w-3 h-3" />
                          <span>{projectToDelete.images?.length || 0} images</span>
                        </span>
                        <span className="flex items-center space-x-1">
                          <VideoIcon className="w-3 h-3" />
                          <span>{projectToDelete.videos?.length || 0} videos</span>
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
                  onClick={handleDeleteProject}
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
                      <span>Delete Project</span>
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}