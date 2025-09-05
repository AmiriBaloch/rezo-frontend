"use client";

import React, { useState } from 'react';
import { FaPlus, FaMoneyBillWave, FaDownload, FaClock, FaCheck, FaTimes } from 'react-icons/fa';
import { 
  useGetPaymentRequestsQuery, 
  useRequestPaymentMutation,
  useGetWithdrawalsQuery,
  useRequestWithdrawalMutation
} from '../../../../features/builder/builderApiSlice';

const BuilderPayments = () => {
  const [showPaymentForm, setShowPaymentForm] = useState(false);
  const [showWithdrawalForm, setShowWithdrawalForm] = useState(false);
  const [paymentForm, setPaymentForm] = useState({
    amount: '',
    description: '',
    workSubmissionId: ''
  });
  const [withdrawalForm, setWithdrawalForm] = useState({
    amount: '',
    bankDetails: {
      accountNumber: '',
      bankName: '',
      ifscCode: ''
    },
    reason: ''
  });

  const { data: payments, isLoading: paymentsLoading } = useGetPaymentRequestsQuery();
  const { data: withdrawals, isLoading: withdrawalsLoading } = useGetWithdrawalsQuery();
  const [requestPayment, { isLoading: isRequestingPayment }] = useRequestPaymentMutation();
  const [requestWithdrawal, { isLoading: isRequestingWithdrawal }] = useRequestWithdrawalMutation();

  const handlePaymentSubmit = async (e) => {
    e.preventDefault();
    try {
      await requestPayment(paymentForm).unwrap();
      setPaymentForm({ amount: '', description: '', workSubmissionId: '' });
      setShowPaymentForm(false);
    } catch (error) {
      console.error('Error requesting payment:', error);
    }
  };

  const handleWithdrawalSubmit = async (e) => {
    e.preventDefault();
    try {
      await requestWithdrawal(withdrawalForm).unwrap();
      setWithdrawalForm({
        amount: '',
        bankDetails: { accountNumber: '', bankName: '', ifscCode: '' },
        reason: ''
      });
      setShowWithdrawalForm(false);
    } catch (error) {
      console.error('Error requesting withdrawal:', error);
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'PENDING':
        return 'bg-yellow-100 text-yellow-800';
      case 'APPROVED':
        return 'bg-green-100 text-green-800';
      case 'REJECTED':
        return 'bg-red-100 text-red-800';
      case 'PAID':
        return 'bg-blue-100 text-blue-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-gray-800">Payment Management</h2>
        <div className="flex space-x-3">
          <button
            onClick={() => setShowPaymentForm(true)}
            className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            <FaPlus className="mr-2" />
            Request Payment
          </button>
          <button
            onClick={() => setShowWithdrawalForm(true)}
            className="flex items-center px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
          >
            <FaDownload className="mr-2" />
            Request Withdrawal
          </button>
        </div>
      </div>

      {/* Payment Request Form */}
      {showPaymentForm && (
        <div className="bg-gray-50 p-6 rounded-lg mb-6">
          <h3 className="text-lg font-medium text-gray-900 mb-4">Request Payment</h3>
          <form onSubmit={handlePaymentSubmit} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Amount *
                </label>
                <input
                  type="number"
                  name="amount"
                  value={paymentForm.amount}
                  onChange={(e) => setPaymentForm(prev => ({ ...prev, amount: e.target.value }))}
                  required
                  min="0"
                  step="0.01"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Work Submission ID
                </label>
                <input
                  type="text"
                  name="workSubmissionId"
                  value={paymentForm.workSubmissionId}
                  onChange={(e) => setPaymentForm(prev => ({ ...prev, workSubmissionId: e.target.value }))}
                  placeholder="Optional"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Description *
              </label>
              <textarea
                name="description"
                value={paymentForm.description}
                onChange={(e) => setPaymentForm(prev => ({ ...prev, description: e.target.value }))}
                required
                rows="3"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
            <div className="flex justify-end space-x-3">
              <button
                type="button"
                onClick={() => setShowPaymentForm(false)}
                className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={isRequestingPayment}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50"
              >
                {isRequestingPayment ? 'Submitting...' : 'Submit Request'}
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Withdrawal Request Form */}
      {showWithdrawalForm && (
        <div className="bg-gray-50 p-6 rounded-lg mb-6">
          <h3 className="text-lg font-medium text-gray-900 mb-4">Request Withdrawal</h3>
          <form onSubmit={handleWithdrawalSubmit} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Amount *
                </label>
                <input
                  type="number"
                  name="amount"
                  value={withdrawalForm.amount}
                  onChange={(e) => setWithdrawalForm(prev => ({ ...prev, amount: e.target.value }))}
                  required
                  min="0"
                  step="0.01"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Bank Name *
                </label>
                <input
                  type="text"
                  name="bankName"
                  value={withdrawalForm.bankDetails.bankName}
                  onChange={(e) => setWithdrawalForm(prev => ({ 
                    ...prev, 
                    bankDetails: { ...prev.bankDetails, bankName: e.target.value }
                  }))}
                  required
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Account Number *
                </label>
                <input
                  type="text"
                  name="accountNumber"
                  value={withdrawalForm.bankDetails.accountNumber}
                  onChange={(e) => setWithdrawalForm(prev => ({ 
                    ...prev, 
                    bankDetails: { ...prev.bankDetails, accountNumber: e.target.value }
                  }))}
                  required
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  IFSC Code *
                </label>
                <input
                  type="text"
                  name="ifscCode"
                  value={withdrawalForm.bankDetails.ifscCode}
                  onChange={(e) => setWithdrawalForm(prev => ({ 
                    ...prev, 
                    bankDetails: { ...prev.bankDetails, ifscCode: e.target.value }
                  }))}
                  required
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Reason
              </label>
              <textarea
                name="reason"
                value={withdrawalForm.reason}
                onChange={(e) => setWithdrawalForm(prev => ({ ...prev, reason: e.target.value }))}
                rows="2"
                placeholder="Optional"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
            <div className="flex justify-end space-x-3">
              <button
                type="button"
                onClick={() => setShowWithdrawalForm(false)}
                className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={isRequestingWithdrawal}
                className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors disabled:opacity-50"
              >
                {isRequestingWithdrawal ? 'Submitting...' : 'Submit Request'}
              </button>
            </div>
          </form>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Payment Requests */}
        <div className="bg-white rounded-lg shadow">
          <div className="px-6 py-4 border-b border-gray-200">
            <h3 className="text-lg font-medium text-gray-900">Payment Requests</h3>
          </div>
          <div className="p-6">
            {paymentsLoading ? (
              <div className="text-center py-4">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
              </div>
            ) : payments?.data && payments.data.length > 0 ? (
              <div className="space-y-4">
                {payments.data.map((payment) => (
                  <div key={payment.id} className="border border-gray-200 rounded-lg p-4">
                    <div className="flex justify-between items-start mb-2">
                      <div className="flex items-center">
                        <FaMoneyBillWave className="h-5 w-5 text-green-600 mr-2" />
                        <span className="font-medium">${payment.amount}</span>
                      </div>
                      <span className={`px-2 py-1 text-xs font-medium rounded-full ${getStatusColor(payment.status)}`}>
                        {payment.status}
                      </span>
                    </div>
                    <p className="text-sm text-gray-600 mb-2">{payment.description}</p>
                    <div className="flex justify-between items-center text-xs text-gray-500">
                      <span>{new Date(payment.createdAt).toLocaleDateString()}</span>
                      {payment.workSubmission && (
                        <span>Work: {payment.workSubmission.title}</span>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-8 text-gray-500">
                <FaMoneyBillWave className="h-12 w-12 mx-auto mb-4 text-gray-300" />
                <p>No payment requests yet</p>
              </div>
            )}
          </div>
        </div>

        {/* Withdrawal Requests */}
        <div className="bg-white rounded-lg shadow">
          <div className="px-6 py-4 border-b border-gray-200">
            <h3 className="text-lg font-medium text-gray-900">Withdrawal Requests</h3>
          </div>
          <div className="p-6">
            {withdrawalsLoading ? (
              <div className="text-center py-4">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
              </div>
            ) : withdrawals?.data && withdrawals.data.length > 0 ? (
              <div className="space-y-4">
                {withdrawals.data.map((withdrawal) => (
                  <div key={withdrawal.id} className="border border-gray-200 rounded-lg p-4">
                    <div className="flex justify-between items-start mb-2">
                      <div className="flex items-center">
                        <FaDownload className="h-5 w-5 text-blue-600 mr-2" />
                        <span className="font-medium">${withdrawal.amount}</span>
                      </div>
                      <span className={`px-2 py-1 text-xs font-medium rounded-full ${getStatusColor(withdrawal.status)}`}>
                        {withdrawal.status}
                      </span>
                    </div>
                    <p className="text-sm text-gray-600 mb-2">
                      Bank: {withdrawal.bankDetails?.bankName} - {withdrawal.bankDetails?.accountNumber}
                    </p>
                    {withdrawal.reason && (
                      <p className="text-sm text-gray-600 mb-2">Reason: {withdrawal.reason}</p>
                    )}
                    <div className="flex justify-between items-center text-xs text-gray-500">
                      <span>{new Date(withdrawal.createdAt).toLocaleDateString()}</span>
                      {withdrawal.processedAt && (
                        <span>Processed: {new Date(withdrawal.processedAt).toLocaleDateString()}</span>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-8 text-gray-500">
                <FaDownload className="h-12 w-12 mx-auto mb-4 text-gray-300" />
                <p>No withdrawal requests yet</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default BuilderPayments;
