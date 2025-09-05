import React from 'react';

const StatCards = ({ stats = {} }) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
      <div className="bg-white p-6 rounded-xl shadow-sm">
        <h3 className="text-sm text-gray-600">Total Invoices</h3>
        <p className="text-2xl font-bold">{stats.total || 0}</p>
      </div>
      <div className="bg-white p-6 rounded-xl shadow-sm">
        <h3 className="text-sm text-gray-600">Pending</h3>
        <p className="text-2xl font-bold">{stats.pending || 0}</p>
      </div>
      <div className="bg-white p-6 rounded-xl shadow-sm">
        <h3 className="text-sm text-gray-600">Paid</h3>
        <p className="text-2xl font-bold">{stats.paid || 0}</p>
      </div>
      <div className="bg-white p-6 rounded-xl shadow-sm">
        <h3 className="text-sm text-gray-600">Total Amount</h3>
        <p className="text-2xl font-bold">${(stats.totalAmount || 0).toFixed(2)}</p>
      </div>
    </div>
  );
};

export default StatCards;
