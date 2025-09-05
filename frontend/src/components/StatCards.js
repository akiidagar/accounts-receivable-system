
import React from 'react';

const StatCards = ({ stats }) => {
  // Safety check - if stats is undefined or null, use empty object
  const safeStats = stats || {};

  return (
    <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
      <div className="bg-white p-6 rounded-xl shadow-sm">
        <h3 className="text-sm text-gray-600">Total Invoices</h3>
        <p className="text-2xl font-bold">{safeStats.total || 0}</p>
      </div>
      <div className="bg-white p-6 rounded-xl shadow-sm">
        <h3 className="text-sm text-gray-600">Pending</h3>
        <p className="text-2xl font-bold">{safeStats.pending || 0}</p>
      </div>
      <div className="bg-white p-6 rounded-xl shadow-sm">
        <h3 className="text-sm text-gray-600">Paid</h3>
        <p className="text-2xl font-bold">{safeStats.paid || 0}</p>
      </div>
      <div className="bg-white p-6 rounded-xl shadow-sm">
        <h3 className="text-sm text-gray-600">Total Amount</h3>
        <p className="text-2xl font-bold">
          ${safeStats.totalAmount ? safeStats.totalAmount.toFixed(2) : '0.00'}
        </p>
      </div>
    </div>
  );
};

export default StatCards;