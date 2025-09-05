"use client";
import React from 'react';
import Link from 'next/link';
import { MdOutlineAddHome, MdOutlineAddHomeWork } from "react-icons/md";
import { FaRupeeSign, FaMagnifyingGlassChart } from "react-icons/fa6";
import { SiGoogletagmanager } from "react-icons/si";
import { useSelector } from 'react-redux';
import { selectCurrentUserId } from '@/features/auth/authSlice';
import { useGetOwnerPropertiesQuery } from '@/features/properties/propertyApiSlice';

export default function OwnerDashboard() {
  const userId = useSelector(selectCurrentUserId);
  const [userData, setUserData] = React.useState(null);
  const [activeTab, setActiveTab] = React.useState('sale');
  
  const { data: propertiesData } = useGetOwnerPropertiesQuery(userId, {
    skip: !userId
  });

  const properties = propertiesData?.data || [];
  const totalProperties = properties.length;
  const saleProperties = properties.filter(p => p.listingType === 'SALE').length;
  const rentProperties = properties.filter(p => p.listingType === 'RENT').length;
  const pendingProperties = properties.filter(p => p.status === 'PENDING').length;

  React.useEffect(() => {
    const stored = localStorage.getItem('user');
    if (stored) {
      setUserData(JSON.parse(stored));
    }
  }, []);

  const handleTabClick = (tab) => {
    setActiveTab(tab);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <div className="bg-gray-100 h-96 mb-8">
        {/* Hero content */}
        <div className="h-full flex items-center justify-center">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
            <div className="flex justify-center">
              {/* Centered Property search form */}
              <div className="bg-white rounded-xl shadow-2xl p-6 lg:p-8 max-w-4xl w-full">
                {/* Tabs */}
                <div className="flex mb-6 bg-gray-100 rounded-lg p-1">
                  <button 
                    onClick={() => handleTabClick('rent')}
                    className={`flex-1 py-2 px-4 text-sm font-medium rounded-md transition-colors ${
                      activeTab === 'rent' 
                        ? 'text-white' 
                        : 'text-gray-600 hover:bg-gray-200'
                    }`}
                    style={{ backgroundColor: activeTab === 'rent' ? '#99763d' : 'transparent' }}
                  >
                    Rent
                  </button>
                  <button 
                    onClick={() => handleTabClick('sale')}
                    className={`flex-1 py-2 px-4 text-sm font-medium rounded-md transition-colors ${
                      activeTab === 'sale' 
                        ? 'text-white' 
                        : 'text-gray-600 hover:bg-gray-200'
                    }`}
                    style={{ backgroundColor: activeTab === 'sale' ? '#99763d' : 'transparent' }}
                  >
                    Sale
                  </button>
                </div>

                {/* Stats Cards */}
                <div className="grid grid-cols-2 gap-4">
                  {/* Total Rent Properties - Zooms when Rent tab is active */}
                  <div className={`bg-blue-50 rounded-lg p-4 transform transition-all duration-300 ${
                    activeTab === 'rent' ? 'scale-110' : 'scale-100'
                  }`}>
                    <div className="flex items-center">
                      <div className="p-2 bg-blue-100 rounded-lg">
                        <MdOutlineAddHome className="w-6 h-6 text-blue-600" />
                      </div>
                      <div className="ml-3">
                        <p className="text-sm font-medium text-gray-600">Total Rent Properties</p>
                        <p className="text-xl font-bold text-gray-900">{rentProperties}</p>
                      </div>
                    </div>
                  </div>

                  {/* Total Properties for Sale - Zooms when Sale tab is active */}
                  <div className={`bg-green-50 rounded-lg p-4 transform transition-all duration-300 ${
                    activeTab === 'sale' ? 'scale-110' : 'scale-100'
                  }`}>
                    <div className="flex items-center">
                      <div className="p-2 bg-green-100 rounded-lg">
                        <FaRupeeSign className="w-6 h-6 text-green-600" />
                      </div>
                      <div className="ml-3">
                        <p className="text-sm font-medium text-gray-600">Total Properties for Sale</p>
                        <p className="text-xl font-bold text-gray-900">{saleProperties}</p>
                      </div>
                    </div>
                  </div>

                  {/* Rental Pending Properties - Zooms when Rent tab is active */}
                  <div className={`bg-purple-50 rounded-lg p-4 transform transition-all duration-300 ${
                    activeTab === 'rent' ? 'scale-110' : 'scale-100'
                  }`}>
                    <div className="flex items-center">
                      <div className="p-2 bg-purple-100 rounded-lg">
                        <FaMagnifyingGlassChart className="w-6 h-6 text-purple-600" />
                      </div>
                      <div className="ml-3">
                        <p className="text-sm font-medium text-gray-600">Rental Pending Properties</p>
                        <p className="text-xl font-bold text-gray-900">{pendingProperties}</p>
                      </div>
                    </div>
                  </div>

                  {/* Saled Pending Properties - Zooms when Sale tab is active */}
                  <div className={`bg-orange-50 rounded-lg p-4 transform transition-all duration-300 ${
                    activeTab === 'sale' ? 'scale-110' : 'scale-100'
                  }`}>
                    <div className="flex items-center">
                      <div className="p-2 bg-orange-100 rounded-lg">
                        <SiGoogletagmanager className="w-6 h-6 text-orange-600" />
                      </div>
                      <div className="ml-3">
                        <p className="text-sm font-medium text-gray-600">Saled Pending Properties</p>
                        <p className="text-xl font-bold text-gray-900">{pendingProperties}</p>
                      </div>
                    </div>
                  </div>
                </div>
                
                {/* Category buttons */}
                <div className="flex gap-2 mt-6">
                  {activeTab === 'rent' ? (
                    <>
                      <Link href="/owner/rent-commercial-property" className="flex-1">
                        <button className="w-full bg-gray-800 text-white py-2 px-3 rounded-lg text-sm font-medium hover:bg-gray-700 transition-colors flex items-center justify-center gap-2">
                          <MdOutlineAddHomeWork className="w-4 h-4" />
                          Rent Commercial Property
                        </button>
                      </Link>
                      <Link href="/owner/rent-property" className="flex-1">
                        <button className="w-full bg-gray-800 text-white py-2 px-3 rounded-lg text-sm font-medium hover:bg-gray-700 transition-colors flex items-center justify-center gap-2">
                          <MdOutlineAddHome className="w-4 h-4" />
                          Rent Residential Property
                        </button>
                      </Link>
                      <Link href="/owner/rent-agricultural-land" className="flex-1">
                        <button className="w-full bg-gray-800 text-white py-2 px-3 rounded-lg text-sm font-medium hover:bg-gray-700 transition-colors flex items-center justify-center gap-2">
                          <FaMagnifyingGlassChart className="w-4 h-4" />
                          Rent Agricultural Land
                        </button>
                      </Link>
                    </>
                  ) : (
                    <>
                      <Link href="/owner/sale-property" className="flex-1">
                        <button className="w-full bg-gray-800 text-white py-2 px-3 rounded-lg text-sm font-medium hover:bg-gray-700 transition-colors flex items-center justify-center gap-2">
                          <MdOutlineAddHomeWork className="w-4 h-4" />
                          Sale Commercial Property
                        </button>
                      </Link>
                                    <Link href="/owner/sale-residential-property" className="flex-1">
                <button className="w-full bg-gray-800 text-white py-2 px-3 rounded-lg text-sm font-medium hover:bg-gray-700 transition-colors flex items-center justify-center gap-2">
                  <MdOutlineAddHome className="w-4 h-4" />
                  Sale Residential Property
                </button>
              </Link>
                      <Link href="/owner/sale-agricultural-land" className="flex-1">
                        <button className="w-full bg-gray-800 text-white py-2 px-3 rounded-lg text-sm font-medium hover:bg-gray-700 transition-colors flex items-center justify-center gap-2">
                          <FaMagnifyingGlassChart className="w-4 h-4" />
                          Sale Agricultural Land
                        </button>
                      </Link>
                    </>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Recent Activity */}
        <div className="bg-white rounded-lg shadow-sm p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Recent Activity</h3>
          <div className="text-center py-8 text-gray-500">
            <p>No recent activity to display</p>
            <p className="text-sm mt-2">Start by adding your first property!</p>
          </div>
        </div>
      </div>
    </div>
  );
}


