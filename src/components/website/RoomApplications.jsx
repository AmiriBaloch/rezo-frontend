"use client";
import React, { useState, useEffect } from "react";
import { FaBed, FaBath, FaSearch } from "react-icons/fa";
import { IoIosArrowDown, IoIosArrowUp } from "react-icons/io";
import { MdOutlineSquareFoot } from "react-icons/md";
import axios from "axios";
import { useDispatch } from 'react-redux';
import { propertyApiSlice, useApprovePropertyMutation, useRejectPropertyMutation } from '../../features/properties/propertyApiSlice';

const RoomApplications = () => {
    const [searchQuery, setSearchQuery] = useState("");
    const [expandedId, setExpandedId] = useState(null);
    const [selectedApp, setSelectedApp] = useState(null);
    const [currentPage, setCurrentPage] = useState(1);
    const [windowWidth, setWindowWidth] = useState(0);
    const [filteredRequests, setFilteredRequests] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [actionMessage, setActionMessage] = useState(null);
    const itemsPerPage = 6;
    const dispatch = useDispatch();
    const [approveProperty] = useApprovePropertyMutation();
    const [rejectProperty] = useRejectPropertyMutation();

    // Fetch both pending and approved properties from backend
    const fetchAllProperties = async () => {
        setLoading(true);
        setError(null);
        try {
            // Fetch pending properties
            const pendingRes = await axios.get("/api/properties/pending");
            const pending = pendingRes.data.data || [];
            
            // Fetch approved properties
            const approvedRes = await axios.get("/api/properties");
            const approved = approvedRes.data.data || [];
            
            // Combine and set
            const combined = [...pending, ...approved];
            setFilteredRequests(combined);
            setLoading(false);
        } catch (err) {
            setLoading(false);
            setError(err.response?.data?.error || err.message || "Failed to load properties");
        }
    };

    useEffect(() => {
        fetchAllProperties();
    }, []);

    // Search filter
    useEffect(() => {
        if (!searchQuery) return;
        setFilteredRequests(prev => prev.filter((app) =>
            [app.title, app.owner?.profile?.firstName, app.address, app.status]
                .some(field => (field || "").toLowerCase().includes(searchQuery.toLowerCase()))
        ));
        setCurrentPage(1);
    }, [searchQuery]);

    useEffect(() => {
        if (typeof window !== "undefined") {
            setWindowWidth(window.innerWidth);
            const handleResize = () => setWindowWidth(window.innerWidth);
            window.addEventListener("resize", handleResize);
            return () => window.removeEventListener("resize", handleResize);
        }
    }, []);

    // Sort: pending first, then approved, then others
    const sortedRequests = [...filteredRequests].sort((a, b) => {
        if (a.status === 'PENDING' && b.status !== 'PENDING') return -1;
        if (a.status !== 'PENDING' && b.status === 'PENDING') return 1;
        if (a.status === 'APPROVED' && b.status !== 'APPROVED') return -1;
        if (a.status !== 'APPROVED' && b.status === 'APPROVED') return 1;
        return 0;
    });
    const totalPages = Math.ceil(sortedRequests.length / itemsPerPage);
    const paginatedRequests = sortedRequests.slice(
        (currentPage - 1) * itemsPerPage,
        currentPage * itemsPerPage
    );

    const handlePageChange = (page) => {
        if (page >= 1 && page <= totalPages) {
            setCurrentPage(page);
            window.scrollTo({ top: 0, behavior: 'smooth' });
        }
    };

    const toggleDropdown = (id) => {
        setExpandedId(expandedId === id ? null : id);
    };

    // Approve property
    const handleApprove = async (id) => {
        setActionMessage(null);
        try {
            console.log('Approving property:', id);
            await approveProperty(id).unwrap();
            console.log('Property approved successfully:', id);
            setActionMessage('Property approved successfully!');
            
            // Clear the current filtered requests to force a fresh fetch
            setFilteredRequests([]);
            
            // Fetch fresh data
            await fetchAllProperties();
            
            // Clear any search query to show all properties
            setSearchQuery("");
            
        } catch (err) {
            console.error('Error approving property:', err);
            setActionMessage('Error approving property: ' + (err.response?.data?.error || err.message));
        }
    };

    // Reject/delete property
    const handleReject = async (id, status) => {
        setActionMessage(null);
        try {
            if (status === 'PENDING') {
                await rejectProperty(id).unwrap();
            } else {
                await axios.delete(`/api/properties/${id}`);
            }
            setActionMessage('Property deleted successfully!');
            
            // Clear the current filtered requests to force a fresh fetch
            setFilteredRequests([]);
            
            // Fetch fresh data
            await fetchAllProperties();
            
            // Clear any search query to show all properties
            setSearchQuery("");
            
        } catch (err) {
            setActionMessage('Error deleting property: ' + (err.response?.data?.error || err.message));
        }
    };

    const getStatusColor = (status) => {
        switch (status) {
            case 'APPROVED': return 'text-green-500';
            case 'REJECTED': return 'text-secondary';
            case 'PENDING': return 'text-yellow-500';
            default: return 'text-gray-500';
        }
    };

    if (loading) return <div>Loading...</div>;
    if (error) return <div style={{ color: 'red', padding: '2rem', fontWeight: 'bold' }}>Error: {error}</div>;

    return (
        <div className="bg-gray-50 p-4 md:p-6 min-h-screen">
            <h1 className="text-2xl md:text-4xl font-semibold text-center my-2 md:my-4">Property Applications</h1>
            {/* Search and Count */}
            <div className="flex flex-col md:flex-row justify-between items-center mb-4 gap-4">
                <h2 className="text-base md:text-lg font-semibold">{filteredRequests.length} Requests</h2>
                <div className="relative w-full md:w-60">
                    <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                    <input
                        type="text"
                        placeholder="Search"
                        className="border border-gray-300 w-full pl-10 pr-4 py-2 rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                    />
                </div>
            </div>
            {actionMessage && (
                <div style={{ color: actionMessage.startsWith('Error') ? 'red' : 'green', fontWeight: 'bold', marginBottom: '1rem' }}>{actionMessage}</div>
            )}
            {/* Table Header - Hidden on mobile */}
            {windowWidth > 768 && (
                <div className="hidden md:flex ml-4 py-3 px-4 text-gray-700 text-lg font-semibold border-b">
                    <span className="mx-2 w-32">Title</span>
                    <span className="mx-12 w-60">Address</span>
                    <span className="mx-12">Price</span>
                    <span className="w-36 mx-2">Owner</span>
                    <span className="w-40 mx-6">Created</span>
                    <span className="w-40 mx-2">More</span>
                </div>
            )}
            {/* Requests List */}
            {paginatedRequests.map((app) => (
                <div key={app.id} className={`border-b py-4 ${app.status === 'PENDING' ? 'bg-yellow-50' : ''}`}>
                    <div className="flex flex-wrap items-center cursor-pointer gap-2 md:gap-0" onClick={() => toggleDropdown(app.id)}>
                        <input type="checkbox" id={app.id} className="hidden md:block mx-2" />
                        <div className="flex items-center w-full md:w-auto">
                            <img src={app.photos?.[0] || "/Hero/hero.jpg"} alt={app.title} className="w-10 h-10 rounded mx-2" />
                            <div className="flex flex-col md:flex-row md:items-center">
                                <span className="font-semibold px-2 md:mr-16 md:w-20">{app.title}</span>
                                {windowWidth > 768 && (
                                    <span className="px-3 md:mr-24 md:w-60">{app.address}</span>
                                )}
                            </div>
                        </div>
                        {windowWidth > 768 ? (
                            <>
                                <span className="px-2 md:mr-10">{app.basePrice} {app.currency}</span>
                                <div className="flex items-center">
                                    <img src={app.owner?.profile?.avatarUrl || "/Hero/hero.jpg"} alt={app.owner?.profile?.firstName} className="w-10 h-10 rounded-full" />
                                    <span className="w-36 px-2">{app.owner?.profile?.firstName}</span>
                                </div>
                                <span className="w-40 px-2">{new Date(app.createdAt).toLocaleDateString()}</span>
                                <span className={`w-40 px-2 ${getStatusColor(app.status)}`}>
                                    {app.status === 'PENDING' && <span className="font-bold">PENDING</span>}
                                    {app.status === 'APPROVED' && <span className="font-bold">APPROVED</span>}
                                    {app.status !== 'PENDING' && app.status !== 'APPROVED' && app.status}
                                </span>
                            </>
                        ) : (
                            <div className="flex flex-col ml-auto">
                                <span className="text-sm">{app.basePrice} {app.currency}</span>
                                <span className={`text-xs ${getStatusColor(app.status)}`}>
                                    {app.status === 'PENDING' && <span className="font-bold">PENDING</span>}
                                    {app.status === 'APPROVED' && <span className="font-bold">APPROVED</span>}
                                    {app.status !== 'PENDING' && app.status !== 'APPROVED' && app.status}
                                </span>
                            </div>
                        )}
                        <button className="px-3 mx-2 ml-auto md:ml-0">
                            {expandedId === app.id ? <IoIosArrowUp /> : <IoIosArrowDown />}
                        </button>
                    </div>
                    {/* Dropdown Content */}
                    {expandedId === app.id && (
                        <div className="bg-gray-200 p-4 mt-2 rounded">
                            <div className="flex flex-col md:flex-row items-start gap-4">
                                <img src={app.photos?.[0] || "/Hero/hero.jpg"} alt={app.title} className="w-full md:w-48 h-48 rounded object-cover" />
                                <div className="w-full md:w-1/4">
                                    <h3 className="text-lg font-bold">{app.title} - {app.address}</h3>
                                    <p className="text-gray-500 py-2 md:py-6">{app.address}</p>
                                    <div className="flex items-center space-x-4 pt-4 md:pt-16">
                                        <span className="flex items-center bg-gray-300 px-2 py-1 rounded-xl text-sm">
                                            <FaBed className="mx-1.5" /> {app.roomSpecs?.find(r => r.type === "BEDROOM")?.count || 0}
                                        </span>
                                        <span className="flex items-center bg-gray-300 px-2 py-1 rounded-xl text-sm">
                                            <MdOutlineSquareFoot className="mx-1.5" /> {app.sizeSqft || 0} sqft
                                        </span>
                                        <span className="flex items-center bg-gray-300 px-2 py-1 rounded-xl text-sm">
                                            <FaBath className="mx-1.5" /> {app.roomSpecs?.find(r => r.type === "BATHROOM")?.count || 0}
                                        </span>
                                    </div>
                                </div>
                                <div className="w-full md:w-1/4 flex flex-col items-start md:items-center gap-2">
                                    <div>
                                        <span className="text-primary">Owner: </span>
                                        <span className="font-semibold">{app.owner?.profile?.firstName} {app.owner?.profile?.lastName}</span>
                                    </div>
                                    <div>
                                        <span className="text-primary">Phone: </span>
                                        <span className="font-semibold">{app.owner?.profile?.phone}</span>
                                    </div>
                                </div>
                                <div className="w-full md:w-1/2 flex flex-col items-start md:items-center gap-2">
                                    <strong className="text-primary">Description:</strong>
                                    <p className="text-gray-500 font-light text-sm max-h-24 overflow-y-auto">
                                        {app.description}
                                    </p>
                                    <div className="flex gap-2 mt-2">
                                        {app.status === 'PENDING' && (
                                            <button
                                                className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600"
                                                onClick={e => { e.stopPropagation(); handleApprove(app.id); }}
                                            >
                                                Approve
                                            </button>
                                        )}
                                        <button
                                            className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600 ml-2"
                                            onClick={() => handleReject(app.id, app.status)}
                                        >
                                            Delete
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}
                </div>
            ))}
            {/* Pagination Controls */}
            <div className="flex flex-col md:flex-row justify-between items-center mt-6 gap-4">
                <p className="text-gray-600 text-sm">
                    Showing {itemsPerPage * (currentPage - 1) + 1} to{" "}
                    {Math.min(currentPage * itemsPerPage, filteredRequests.length)} of{" "}
                    {filteredRequests.length} entries
                </p>

                <div className="flex gap-2">
                    <button
                        onClick={() => handlePageChange(currentPage - 1)}
                        disabled={currentPage === 1}
                        className="px-3 py-1 border rounded-md bg-gray-100 hover:bg-gray-200 disabled:opacity-50"
                    >
                        Prev
                    </button>

                    {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                        let pageNum;
                        if (totalPages <= 5) {
                            pageNum = i + 1;
                        } else if (currentPage <= 3) {
                            pageNum = i + 1;
                        } else if (currentPage >= totalPages - 2) {
                            pageNum = totalPages - 4 + i;
                        } else {
                            pageNum = currentPage - 2 + i;
                        }

                        return (
                            <button
                                key={pageNum}
                                onClick={() => handlePageChange(pageNum)}
                                className={`px-3 py-1 border rounded-md ${currentPage === pageNum
                                    ? "bg-blue-500 text-white"
                                    : "bg-gray-100 hover:bg-gray-200"
                                    }`}
                            >
                                {pageNum}
                            </button>
                        );
                    })}

                    {totalPages > 5 && currentPage < totalPages - 2 && (
                        <span className="px-3 py-1">...</span>
                    )}

                    {totalPages > 5 && currentPage < totalPages - 2 && (
                        <button
                            onClick={() => handlePageChange(totalPages)}
                            className={`px-3 py-1 border rounded-md ${currentPage === totalPages
                                ? "bg-blue-500 text-white"
                                : "bg-gray-100 hover:bg-gray-200"
                                }`}
                        >
                            {totalPages}
                        </button>
                    )}

                    <button
                        onClick={() => handlePageChange(currentPage + 1)}
                        disabled={currentPage === totalPages || totalPages === 0}
                        className="px-3 py-1 border rounded-md bg-gray-100 hover:bg-gray-200 disabled:opacity-50"
                    >
                        Next
                    </button>
                </div>
            </div>
        </div>
    );
};

export default RoomApplications;