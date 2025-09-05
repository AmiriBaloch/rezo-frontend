"use client";

import { useState, useEffect } from 'react';
import { MdAdd, MdEdit, MdDelete, MdAssignment, MdCheckCircle, MdCancel } from 'react-icons/md';
import { BiCalendar, BiBuilding, BiUser } from 'react-icons/bi';

const BuilderProjects = () => {
  const [projects, setProjects] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedStatus, setSelectedStatus] = useState('all');
  const [showCreateModal, setShowCreateModal] = useState(false);

  useEffect(() => {
    fetchProjects();
  }, []);

  const fetchProjects = async () => {
    try {
      // TODO: Replace with actual API call
      // const response = await fetch('/api/builder/projects');
      // const data = await response.json();
      
      // Mock data for now
      setProjects([
        {
          id: '1',
          name: 'Sunset Villa',
          description: 'Luxury residential villa with modern amenities',
          plotSize: '5000 sq ft',
          constructionType: 'Residential',
          estimatedCompletion: '2024-06-15',
          status: 'IN_PROGRESS',
          tenant: {
            profile: {
              firstName: 'John',
              lastName: 'Doe'
            }
          },
          images: ['https://example.com/villa1.jpg'],
          createdAt: '2024-01-15'
        },
        {
          id: '2',
          name: 'Ocean View Complex',
          description: 'Commercial complex with retail and office spaces',
          plotSize: '15000 sq ft',
          constructionType: 'Commercial',
          estimatedCompletion: '2024-08-20',
          status: 'PENDING',
          tenant: {
            profile: {
              firstName: 'Jane',
              lastName: 'Smith'
            }
          },
          images: ['https://example.com/complex1.jpg'],
          createdAt: '2024-02-01'
        },
        {
          id: '3',
          name: 'Green Meadows',
          description: 'Eco-friendly residential community',
          plotSize: '8000 sq ft',
          constructionType: 'Residential',
          estimatedCompletion: '2024-05-10',
          status: 'COMPLETED',
          tenant: {
            profile: {
              firstName: 'Mike',
              lastName: 'Johnson'
            }
          },
          images: ['https://example.com/meadows1.jpg'],
          createdAt: '2023-11-20'
        }
      ]);
    } catch (error) {
      console.error('Error fetching projects:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'PENDING': return 'bg-yellow-100 text-yellow-800';
      case 'IN_PROGRESS': return 'bg-blue-100 text-blue-800';
      case 'COMPLETED': return 'bg-green-100 text-green-800';
      case 'CANCELLED': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'PENDING': return <MdAssignment className="text-lg" />;
      case 'IN_PROGRESS': return <BiBuilding className="text-lg" />;
      case 'COMPLETED': return <MdCheckCircle className="text-lg" />;
      case 'CANCELLED': return <MdCancel className="text-lg" />;
      default: return <BiBuilding className="text-lg" />;
    }
  };

  const filteredProjects = selectedStatus === 'all' 
    ? projects 
    : projects.filter(project => project.status === selectedStatus);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">My Projects</h1>
          <p className="text-gray-600">Manage your construction projects and track progress</p>
        </div>
        <button
          onClick={() => setShowCreateModal(true)}
          className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors flex items-center space-x-2"
        >
          <MdAdd className="text-xl" />
          <span>New Project</span>
        </button>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-lg shadow-md p-4">
        <div className="flex items-center space-x-4">
          <span className="text-sm font-medium text-gray-700">Filter by status:</span>
          <select
            value={selectedStatus}
            onChange={(e) => setSelectedStatus(e.target.value)}
            className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="all">All Projects</option>
            <option value="PENDING">Pending</option>
            <option value="IN_PROGRESS">In Progress</option>
            <option value="COMPLETED">Completed</option>
            <option value="CANCELLED">Cancelled</option>
          </select>
        </div>
      </div>

      {/* Projects Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredProjects.map((project) => (
          <div key={project.id} className="bg-white rounded-lg shadow-md overflow-hidden">
            {/* Project Image */}
            <div className="h-48 bg-gray-200 relative">
              {project.images && project.images.length > 0 ? (
                <img
                  src={project.images[0]}
                  alt={project.name}
                  className="w-full h-full object-cover"
                  onError={(e) => {
                    e.target.src = 'https://via.placeholder.com/400x300?text=Project+Image';
                  }}
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center text-gray-500">
                  <BiBuilding className="text-4xl" />
                </div>
              )}
              
              {/* Status Badge */}
              <div className="absolute top-3 right-3">
                <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(project.status)} flex items-center space-x-1`}>
                  {getStatusIcon(project.status)}
                  <span>{project.status.replace('_', ' ')}</span>
                </span>
              </div>
            </div>

            {/* Project Details */}
            <div className="p-4 space-y-3">
              <h3 className="text-lg font-semibold text-gray-900">{project.name}</h3>
              <p className="text-sm text-gray-600 line-clamp-2">{project.description}</p>
              
              <div className="space-y-2">
                <div className="flex items-center space-x-2 text-sm text-gray-600">
                  <BiBuilding className="text-lg" />
                  <span>{project.constructionType}</span>
                </div>
                <div className="flex items-center space-x-2 text-sm text-gray-600">
                  <BiCalendar className="text-lg" />
                  <span>Due: {new Date(project.estimatedCompletion).toLocaleDateString()}</span>
                </div>
                <div className="flex items-center space-x-2 text-sm text-gray-600">
                  <BiUser className="text-lg" />
                  <span>Tenant: {project.tenant?.profile?.firstName} {project.tenant?.profile?.lastName}</span>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex space-x-2 pt-2">
                <button className="flex-1 bg-blue-600 text-white px-3 py-2 rounded-md hover:bg-blue-700 transition-colors text-sm">
                  View Details
                </button>
                <button className="px-3 py-2 border border-gray-300 rounded-md hover:bg-gray-50 transition-colors">
                  <MdEdit className="text-lg text-gray-600" />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {filteredProjects.length === 0 && (
        <div className="text-center py-12">
          <BiBuilding className="text-6xl text-gray-300 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">No projects found</h3>
          <p className="text-gray-600">
            {selectedStatus === 'all' 
              ? 'You haven\'t created any projects yet.' 
              : `No projects with status "${selectedStatus.toLowerCase()}" found.`
            }
          </p>
          <button
            onClick={() => setShowCreateModal(true)}
            className="mt-4 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
          >
            Create Your First Project
          </button>
        </div>
      )}

      {/* Create Project Modal */}
      {showCreateModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-2xl mx-4">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Create New Project</h2>
            {/* TODO: Add project creation form */}
            <div className="flex justify-end space-x-3">
              <button
                onClick={() => setShowCreateModal(false)}
                className="px-4 py-2 border border-gray-300 rounded-md hover:bg-gray-50 transition-colors"
              >
                Cancel
              </button>
              <button className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors">
                Create Project
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default BuilderProjects;
