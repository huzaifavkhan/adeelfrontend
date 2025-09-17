import React, { useEffect, useState } from "react";
import { Link, useSearchParams } from "react-router-dom";
import Header from "../components/Header";
import Footer from "../components/Footer";
import LoadingScreen from "../components/LoadingScreen";
import { FaBed, FaBath, FaMapMarkerAlt, FaChevronLeft, FaChevronRight } from "react-icons/fa";

function PropertiesListing() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [properties, setProperties] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [totalProperties, setTotalProperties] = useState(0);
  
  // Pagination state
  const currentPage = parseInt(searchParams.get('page')) || 1;
  const propertiesPerPage = 50;
  const totalPages = Math.ceil(totalProperties / propertiesPerPage);

  useEffect(() => {
    fetchProperties();
  }, [currentPage]);

  const fetchProperties = async () => {
    setLoading(true);
    try {
      const offset = (currentPage - 1) * propertiesPerPage;
      const response = await fetch(
        `${import.meta.env.VITE_BACKEND_URL}/api/properties?limit=${propertiesPerPage}&offset=${offset}`
      );
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const data = await response.json();
      
      // Handle the response structure from your backend
      if (data.properties && data.pagination) {
        // New paginated response structure
        setProperties(data.properties);
        setTotalProperties(data.pagination.total);
      } else if (data.properties && data.total !== undefined) {
        // Alternative paginated response structure
        setProperties(data.properties);
        setTotalProperties(data.total);
      } else if (Array.isArray(data)) {
        // Fallback: if backend returns array directly (old behavior)
        setProperties(data);
        setTotalProperties(data.length);
      } else {
        setProperties([]);
        setTotalProperties(0);
      }
      
      setError("");
    } catch (err) {
      setError(`Failed to load properties: ${err.message}`);
      setProperties([]);
    } finally {
      setLoading(false);
    }
  };

  const handlePageChange = (pageNumber) => {
    if (pageNumber >= 1 && pageNumber <= totalPages) {
      setSearchParams({ page: pageNumber.toString() });
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const getPaginationNumbers = () => {
    const delta = 2; // Number of pages to show on each side of current page
    const range = [];
    const rangeWithDots = [];

    for (let i = Math.max(2, currentPage - delta); 
         i <= Math.min(totalPages - 1, currentPage + delta); 
         i++) {
      range.push(i);
    }

    if (currentPage - delta > 2) {
      rangeWithDots.push(1, '...');
    } else {
      rangeWithDots.push(1);
    }

    rangeWithDots.push(...range);

    if (currentPage + delta < totalPages - 1) {
      rangeWithDots.push('...', totalPages);
    } else if (totalPages > 1) {
      rangeWithDots.push(totalPages);
    }

    return rangeWithDots;
  };

  if (loading) return <LoadingScreen />;

  return (
    <div className="min-h-screen flex flex-col" style={{ fontFamily: '"Segoe UI", Helvetica, Arial, sans-serif' }}>
      <Header />
      
      <main className="flex-1 bg-gray-50 py-10 px-6 md:px-12 mt-20">
        <div className="max-w-7xl mx-auto">
          {/* Header Section */}
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-800 mb-2">Properties for Sale & Rent</h1>
            <p className="text-gray-600">
              Showing {Math.min(propertiesPerPage, properties.length)} of {totalProperties} properties 
              (Page {currentPage} of {totalPages})
            </p>
          </div>

          {/* Error State */}
          {error && (
            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded mb-6">
              {error}
            </div>
          )}

          {/* Properties Grid */}
          {properties.length > 0 ? (
            <>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 mb-8">
                {properties.map((property) => (
                  <PropertyCard key={property.id} property={property} />
                ))}
              </div>

              {/* Pagination */}
              {totalPages > 1 && (
                <div className="flex flex-col items-center space-y-4 mt-8">
                  {/* Main Pagination Controls */}
                  <div className="flex items-center space-x-2">
                    {/* Previous Button */}
                    <button
                      onClick={() => handlePageChange(currentPage - 1)}
                      disabled={currentPage === 1}
                      className={`flex items-center px-3 py-2 rounded-lg transition-colors ${
                        currentPage === 1
                          ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                          : 'bg-white text-gray-700 hover:bg-gray-50 border border-gray-300 shadow-sm'
                      }`}
                    >
                      <FaChevronLeft className="w-4 h-4 mr-1" />
                      <span className="hidden sm:inline">Previous</span>
                      <span className="sm:hidden">Prev</span>
                    </button>

                    {/* Page Numbers */}
                    <div className="flex space-x-1">
                      {getPaginationNumbers().map((pageNum, index) => (
                        <React.Fragment key={index}>
                          {pageNum === '...' ? (
                            <span className="px-3 py-2 text-gray-500">...</span>
                          ) : (
                            <button
                              onClick={() => handlePageChange(pageNum)}
                              className={`px-3 py-2 rounded-lg transition-colors min-w-[40px] ${
                                currentPage === pageNum
                                  ? 'bg-orange-500 text-white shadow-md'
                                  : 'bg-white text-gray-700 hover:bg-gray-50 border border-gray-300 shadow-sm'
                              }`}
                            >
                              {pageNum}
                            </button>
                          )}
                        </React.Fragment>
                      ))}
                    </div>

                    {/* Next Button */}
                    <button
                      onClick={() => handlePageChange(currentPage + 1)}
                      disabled={currentPage === totalPages}
                      className={`flex items-center px-3 py-2 rounded-lg transition-colors ${
                        currentPage === totalPages
                          ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                          : 'bg-white text-gray-700 hover:bg-gray-50 border border-gray-300 shadow-sm'
                      }`}
                    >
                      <span className="hidden sm:inline">Next</span>
                      <span className="sm:hidden">Next</span>
                      <FaChevronRight className="w-4 h-4 ml-1" />
                    </button>
                  </div>

                  {/* Page Info */}
                  <div className="text-center text-gray-500 text-sm">
                    Page {currentPage} of {totalPages} • {totalProperties.toLocaleString()} total properties
                  </div>

                  {/* Mobile Quick Jump */}
                  <div className="sm:hidden">
                    <select
                      value={currentPage}
                      onChange={(e) => handlePageChange(parseInt(e.target.value))}
                      className="px-3 py-2 border border-gray-300 rounded-lg bg-white text-gray-700"
                    >
                      {Array.from({ length: totalPages }, (_, i) => i + 1).map(page => (
                        <option key={page} value={page}>
                          Page {page}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>
              )}
            </>
          ) : (
            !loading && (
              <div className="text-center py-12">
                <div className="text-6xl text-gray-300 mb-4">🏠</div>
                <h2 className="text-xl font-semibold text-gray-600 mb-2">No Properties Found</h2>
                <p className="text-gray-500">There are no properties available at the moment.</p>
              </div>
            )
          )}
        </div>
      </main>

      <Footer />
    </div>
  );
}

// Property Card Component
function PropertyCard({ property }) {
  const areaLabel = ['apartment', 'office', 'shop'].includes(property.property_type?.toLowerCase()) 
    ? 'Sq. Ft.' 
    : 'Sq. Yd.';

  const firstImage = property.images?.[0]?.url || '/api/placeholder/300/200';

  return (
    <Link to={`/property/${property.id}`} className="block group">
      <div className="bg-white rounded-xl shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-300">
        {/* Property Image */}
        <div className="relative h-48 overflow-hidden">
          <img
            src={firstImage}
            alt={property.property_type}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
            onError={(e) => {
              e.target.src = '/api/placeholder/300/200';
            }}
          />
          
          {/* Purpose Badge */}
          <div className="absolute top-3 left-3">
            <span className={`px-2 py-1 text-xs font-semibold rounded-full ${
              property.purpose?.toLowerCase() === 'sale' 
                ? 'bg-green-100 text-green-800' 
                : 'bg-blue-100 text-blue-800'
            }`}>
              For {property.purpose}
            </span>
          </div>

          {/* Media Count */}
          {(property.images?.length > 1 || property.videos?.length > 0) && (
            <div className="absolute top-3 right-3 bg-black bg-opacity-60 text-white text-xs px-2 py-1 rounded">
              {property.images?.length || 0} Photos
              {property.videos?.length > 0 && ` • ${property.videos.length} Videos`}
            </div>
          )}
        </div>

        {/* Property Details */}
        <div className="p-4">
          {/* Price */}
          <div className="mb-2">
            <span className="text-xl font-bold text-gray-800">
              <span className="text-sm mr-1">PKR</span>
              {property.price?.toLocaleString()}
            </span>
          </div>

          {/* Property Type & Location */}
          <div className="mb-3">
            <h3 className="font-semibold text-gray-800 capitalize mb-1">
              {property.property_type}
            </h3>
            <div className="flex items-center text-gray-600 text-sm">
              <FaMapMarkerAlt className="w-3 h-3 mr-1" />
              <span className="truncate">{property.location}</span>
            </div>
          </div>

          {/* Features */}
          <div className="flex items-center justify-between text-sm text-gray-600">
            <div className="flex items-center space-x-4">
              {property.beds > 0 && (
                <div className="flex items-center">
                  <FaBed className="w-3 h-3 mr-1" />
                  <span>{property.beds}</span>
                </div>
              )}
              {property.baths > 0 && (
                <div className="flex items-center">
                  <FaBath className="w-3 h-3 mr-1" />
                  <span>{property.baths}</span>
                </div>
              )}
            </div>
            <div className="text-xs">
              {Number(property.area_size).toLocaleString()} {areaLabel}
            </div>
          </div>
        </div>
      </div>
    </Link>
  );
}

export default PropertiesListing;