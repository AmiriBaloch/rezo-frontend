import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";

const BulkEdit = () => {
  // Sample data
  const initialProperties = [
    {
      id: 1,
      name: "Property",
      status: "online",
      propertyName: "Casa da Alegria",
      datePublished: "01-01-2024",
      price: "300$",
      listingId: "1596",
      location: "Rua dos Amores, 42",
      image: "https://images.unsplash.com/photo-1560518883-ce09059eeffa?q=80&w=1973&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    },
    {
      id: 2,
      name: "Property",
      status: "offline",
      propertyName: "Casa da Alegria",
      datePublished: "01-01-2024",
      price: "300$",
      listingId: "1597",
      location: "Rua dos Amores, 42",
      image: "https://images.unsplash.com/photo-1560518883-ce09059eeffa?q=80&w=1973&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    },
  ];

  const [properties, setProperties] = useState(initialProperties);
  const [filteredProperties, setFilteredProperties] = useState(initialProperties);
  const [selectedItems, setSelectedItems] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(5);
  const [isMobile, setIsMobile] = useState(false);
  const [editingProperty, setEditingProperty] = useState(null);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [propertyToDelete, setPropertyToDelete] = useState(null);

  // Check screen size
  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 768);
    };

    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  // Filter properties based on search term
  useEffect(() => {
    const filtered = properties.filter(property =>
      Object.values(property).some(
        value => value.toString().toLowerCase().includes(searchTerm.toLowerCase())
      )
    );
    setFilteredProperties(filtered);
    setCurrentPage(1);
  }, [searchTerm, properties]);

  // Select/deselect all items
  const toggleSelectAll = (e) => {
    if (e.target.checked) {
      setSelectedItems(filteredProperties.map(property => property.id));
    } else {
      setSelectedItems([]);
    }
  };

  // Toggle individual item selection
  const toggleItemSelection = (id) => {
    setSelectedItems(prev =>
      prev.includes(id)
        ? prev.filter(itemId => itemId !== id)
        : [...prev, id]
    );
  };

  // Handle edit property
  const handleEdit = (property) => {
    setEditingProperty(property);
    // In a real app, you would open a modal or form here
    console.log("Editing property:", property);
    alert(`Edit form would open for property ID: ${property.id}`);
  };

  // Handle update property
  const handleUpdate = (updatedProperty) => {
    setProperties(prev =>
      prev.map(property =>
        property.id === updatedProperty.id ? updatedProperty : property
      )
    );
    setEditingProperty(null);
    // In a real app, you would also make an API call here
    console.log("Updated property:", updatedProperty);
  };

  // Handle delete confirmation
  const confirmDelete = (property) => {
    setPropertyToDelete(property);
    setShowDeleteModal(true);
  };

  // Handle delete property
  const handleDelete = (id) => {
    setProperties(prev => prev.filter(property => property.id !== id));
    setSelectedItems(prev => prev.filter(itemId => itemId !== id));
    setShowDeleteModal(false);
    setPropertyToDelete(null);
    // In a real app, you would also make an API call here
    console.log("Deleted property with ID:", id);
  };

  // Bulk delete selected properties
  const handleBulkDelete = () => {
    if (selectedItems.length === 0) {
      alert("Please select at least one property to delete");
      return;
    }
    if (window.confirm(`Are you sure you want to delete ${selectedItems.length} selected properties?`)) {
      setProperties(prev => prev.filter(property => !selectedItems.includes(property.id)));
      setSelectedItems([]);
      // In a real app, you would also make an API call here
      console.log("Bulk deleted properties with IDs:", selectedItems);
    }
  };

  // Pagination logic
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = filteredProperties.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(filteredProperties.length / itemsPerPage);

  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  // Status badge component
  const StatusBadge = ({ status }) => (
    <div
      className={`py-[1px] px-[6px] rounded-[6px] w-fit flex items-center justify-center mx-auto text-[12px] ${status === "online"
          ? "bg-[#ECFDF3] text-[#027A48]"
          : "bg-[#FEF3F2] text-[#B42318]"
        }`}
    >
      <i
        className={`bi bi-dot text-[25px] ${status === "online" ? "text-[#12B76A]" : "text-[#B42318]"
          }`}
      ></i>
      {status.charAt(0).toUpperCase() + status.slice(1)}
    </div>
  );

  // Mobile property card
  const MobilePropertyCard = ({ property }) => (
    <div className="mb-4 rounded-lg shadow-sm border border-gray-100">
      <div className="flex items-start justify-between mb-3">
        <div className="flex items-center gap-3">
          <input
            type="checkbox"
            checked={selectedItems.includes(property.id)}
            onChange={() => toggleItemSelection(property.id)}
            className="w-4 h-4 cursor-pointer accent-f3"
          />
          <img
            src={property.image}
            alt={property.name}
            className="w-10 h-10 object-cover rounded"
          />
          <div>
            <h3 className="font-medium text-gray-900">{property.name}</h3>
            <StatusBadge status={property.status} />
          </div>
        </div>
        <div className="flex gap-2">
          <button
            onClick={() => confirmDelete(property)}
            className="text-gray-500 hover:text-secondary"
          >
            <i className="bi bi-trash text-lg"></i>
          </button>
          <button
            onClick={() => handleEdit(property)}
            className="text-gray-500 hover:text-primary"
          >
            <i className="bi bi-pencil-square text-lg"></i>
          </button>
        </div>
      </div>
      <div className="grid grid-cols-2 gap-2 text-sm">
        <div>
          <p className="text-gray-500">Property</p>
          <p>{property.propertyName}</p>
        </div>
        <div>
          <p className="text-gray-500">Published</p>
          <p>{property.datePublished}</p>
        </div>
        <div>
          <p className="text-gray-500">Price</p>
          <p>{property.price}</p>
        </div>
        <div>
          <p className="text-gray-500">ID</p>
          <p>{property.listingId}</p>
        </div>
        <div className="col-span-2">
          <p className="text-gray-500">Location</p>
          <p>{property.location}</p>
        </div>
      </div>
    </div>
  );

  return (
    <div className="w-full flex flex-col gap-5 rounded-lg p-2 bg-white">
      {/* Header Section */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex items-center flex-wrap gap-4">
          <button
            className="bg-primary py-1.5 px-4 rounded-md text-sm font-medium text-white shadow-sm hover:bg-f2-dark transition-colors"
            onClick={handleBulkDelete}
          >
            Bulk Delete
          </button>
          <button
            className="bg-primary py-1.5 px-4 rounded-md text-sm font-medium text-white shadow-sm hover:bg-f2-dark transition-colors"
            onClick={() => alert("Bulk edit functionality would open here")}
          >
            Bulk Edit
          </button>
          <div className="flex items-center gap-2">
            <h4 className="text-sm text-gray-600 font-semibold">Properties</h4>
            <i className="bi bi-toggle-on text-primary text-xl"></i>
            <h4 className="text-sm text-gray-600 font-semibold">Rooms</h4>
          </div>
        </div>

        <div className="flex flex-col sm:flex-row items-center gap-3">
          <div className="flex gap-2 w-full sm:w-auto">
            <Link to='/addroom' className="w-full sm:w-auto bg-primary py-1.5 px-4 rounded-md text-sm font-medium text-white shadow-sm hover:bg-blue-600 transition-colors">
              Add Room
            </Link>
            <Link to='/addproperty' className="w-full sm:w-auto bg-primary py-1.5 px-4 rounded-md text-sm font-medium text-white shadow-sm hover:bg-blue-600 transition-colors">
              Add Property
            </Link>
          </div>
          <div className="relative w-full sm:w-64">
            <input
              type="text"
              placeholder="Search"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full bg-transparent border border-gray-300 rounded-md placeholder:text-gray-500 text-sm py-2 pl-10 pr-3 focus:outline-none focus:ring-2 focus:ring-f2 focus:border-transparent"
            />
            <i className="bi bi-search text-gray-500 absolute left-3 top-1/2 transform -translate-y-1/2"></i>
          </div>
        </div>
      </div>

      {/* Table Section */}
      {isMobile ? (
        <div className="space-y-3">
          {currentItems.map((property) => (
            <MobilePropertyCard key={property.id} property={property} />
          ))}
        </div>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full bg-white">
            <thead className="bg-gray-100 rounded-xl">
              <tr className="text-xs text-gray-600">
                <th className="font-medium py-3 px-6 text-left">
                  <div className="flex items-center gap-2">
                    <input
                      type="checkbox"
                      checked={
                        selectedItems.length > 0 &&
                        selectedItems.length === filteredProperties.length
                      }
                      onChange={toggleSelectAll}
                      className="w-4 h-4 cursor-pointer accent-f3"
                    />
                    Name
                  </div>
                </th>
                <th className="font-medium py-3 px-6 text-left">
                  Status <i className="bi bi-arrow-down ml-1"></i>
                </th>
                <th className="font-medium py-3 px-6 text-left">
                  Properties <i className="bi bi-question-circle ml-1"></i>
                </th>
                <th className="font-medium py-3 px-6 text-left">Date Published</th>
                <th className="font-medium py-3 px-6 text-left">Price</th>
                <th className="font-medium py-3 px-6 text-left">Listing ID</th>
                <th className="font-medium py-3 px-6 text-left">Location</th>
                <th className="font-medium py-3 px-6 text-left">Actions</th>
              </tr>
            </thead>

            <tbody className="divide-y divide-gray-200">
              {currentItems.map((property) => (
                <tr
                  key={property.id}
                  className={`text-sm ${selectedItems.includes(property.id) ? "bg-blue-100" : "hover:bg-gray-50"
                    }`}
                >
                  <td className="py-4 px-6">
                    <div className="flex items-center gap-3">
                      <input
                        type="checkbox"
                        checked={selectedItems.includes(property.id)}
                        onChange={() => toggleItemSelection(property.id)}
                        className="w-4 h-4 cursor-pointer accent-f3"
                      />
                      <Link to='/manage-property'> 
                      <img
                        src={property.image}
                        alt={property.name}
                        className="w-10 h-10 object-cover rounded"
                      />
                      </Link>
                      
                      <span className="font-medium text-gray-900">
                        {property.name}
                      </span>
                    </div>
                  </td>
                  <td className="py-4 px-6">
                    <StatusBadge status={property.status} />
                  </td>
                  <td className="py-4 px-6">{property.propertyName}</td>
                  <td className="py-4 px-6">{property.datePublished}</td>
                  <td className="py-4 px-6">{property.price}</td>
                  <td className="py-4 px-6">{property.listingId}</td>
                  <td className="py-4 px-6">{property.location}</td>
                  <td className="py-4 px-6">
                    <div className="flex gap-4">
                      <button
                        onClick={() => confirmDelete(property)}
                        className="text-secondary"
                      >
                        <i className="bi bi-trash text-xl"></i>
                      </button>
                      <button
                        onClick={() => handleEdit(property)}
                        className="text-primary"
                      >
                        <i className="bi bi-pencil-square text-lg"></i>
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Pagination Section */}
      {filteredProperties.length > 0 ? (
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 bg-white p-4 rounded-lg shadow-sm">
          <button
            onClick={() => paginate(Math.max(1, currentPage - 1))}
            disabled={currentPage === 1}
            className="py-2 px-4 border border-gray-300 flex items-center gap-2 text-sm font-semibold text-gray-700 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <i className="bi bi-arrow-left"></i>
            Previous
          </button>

          <div className="flex items-center gap-1">
            {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
              let pageNumber;
              if (totalPages <= 5) {
                pageNumber = i + 1;
              } else if (currentPage <= 3) {
                pageNumber = i + 1;
              } else if (currentPage >= totalPages - 2) {
                pageNumber = totalPages - 4 + i;
              } else {
                pageNumber = currentPage - 2 + i;
              }

              return (
                <button
                  key={pageNumber}
                  onClick={() => paginate(pageNumber)}
                  className={`w-10 h-10 flex items-center justify-center rounded-lg text-sm font-medium ${currentPage === pageNumber
                      ? "bg-[#F4F4F4] text-[#16457E]"
                      : "text-gray-600 hover:bg-gray-100"
                    }`}
                >
                  {pageNumber}
                </button>
              );
            })}

            {totalPages > 5 && currentPage < totalPages - 2 && (
              <span className="w-10 h-10 flex items-center justify-center text-gray-600">
                ...
              </span>
            )}

            {totalPages > 5 && currentPage < totalPages - 2 && (
              <button
                onClick={() => paginate(totalPages)}
                className={`w-10 h-10 flex items-center justify-center rounded-lg text-sm font-medium ${currentPage === totalPages
                    ? "bg-[#F4F4F4] text-[#16457E]"
                    : "text-gray-600 hover:bg-gray-100"
                  }`}
              >
                {totalPages}
              </button>
            )}
          </div>

          <button
            onClick={() => paginate(Math.min(totalPages, currentPage + 1))}
            disabled={currentPage === totalPages}
            className="py-2 px-4 border border-gray-300 flex items-center gap-2 text-sm font-semibold text-gray-700 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Next
            <i className="bi bi-arrow-right"></i>
          </button>
        </div>
      ) : (
        <div className="py-10 text-center text-gray-500">
          No properties found matching your search criteria.
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {showDeleteModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg max-w-md w-full">
            <h3 className="text-lg font-semibold mb-4">Confirm Delete</h3>
            <p className="mb-6">
              Are you sure you want to delete {propertyToDelete?.propertyName || "this property"}?
            </p>
            <div className="flex justify-end gap-3">
              <button
                onClick={() => setShowDeleteModal(false)}
                className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
              >
                Cancel
              </button>
              <button
                onClick={() => handleDelete(propertyToDelete.id)}
                className="px-4 py-2 bg-secondary text-white rounded-md hover:bg-red-600"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default BulkEdit;