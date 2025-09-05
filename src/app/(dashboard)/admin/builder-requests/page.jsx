"use client";
import React from 'react';
import BuilderRequests from '@/components/admin/BuilderRequests';

export default function BuilderRequestsPage() {
  return (
    <div className="min-h-screen bg-gray-100 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Builder Requests Management</h1>
          <p className="mt-2 text-gray-600">
            Review and manage builder applications from tenants
          </p>
        </div>
        
        <BuilderRequests />
      </div>
    </div>
  );
}
