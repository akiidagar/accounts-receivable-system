import React, { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import api from '../services/api';
import CreateInvoiceModal from './CreateInvoiceModal';
import InvoiceTable from './InvoiceTable';
import StatCards from './StatCards';
import SearchAndFilter from './SearchAndFilter';
import Notification from './Notification';

const Dashboard = () => {
  const [invoices, setInvoices] = useState([]);
  const [stats, setStats] = useState({}); // Initialize as empty object
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [notification, setNotification] = useState('');
  const { user, logout } = useAuth();

  const fetchInvoices = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem('token');
      const params = new URLSearchParams({
        search: searchTerm,
        status: statusFilter
      });

      const response = await fetch(`http://localhost:3001/api/invoices?${params}`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (response.ok) {
        const data = await response.json();
        // Handle both paginated and direct array responses
        setInvoices(data.invoices || data);
      } else {
        console.error('Failed to fetch invoices');
      }
    } catch (error) {
      console.error('Failed to fetch invoices:', error);
      showNotification('Failed to fetch invoices', 'error');
    } finally {
      setLoading(false);
    }
  };

  const fetchStats = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch('http://localhost:3001/api/dashboard/stats', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      
      if (response.ok) {
        const data = await response.json();
        setStats(data);
      } else {
        // If stats endpoint doesn't exist, calculate from invoices
        console.log('Stats endpoint not available, will calculate from invoices');
      }
    } catch (error) {
      console.error('Failed to fetch stats:', error);
      // Calculate basic stats from invoices
      if (invoices.length > 0) {
        const basicStats = {
          total: invoices.length,
          pending: invoices.filter(inv => inv.payment_status === 'pending').length,
          paid: invoices.filter(inv => inv.payment_status === 'paid').length,
          totalAmount: invoices.reduce((sum, inv) => sum + (inv.amount_due || 0), 0)
        };
        setStats(basicStats);
      }
    }
  };

  useEffect(() => {
    fetchInvoices();
  }, [searchTerm, statusFilter]);

  useEffect(() => {
    if (invoices.length > 0) {
      fetchStats();
    }
  }, [invoices]);

  const handleInvoiceCreated = (newInvoice) => {
    setInvoices(prev => [newInvoice, ...prev]);
    fetchStats(); // Refresh stats
    showNotification(`Invoice ${newInvoice.invoice_id} created successfully!`);
  };

  const showNotification = (message, type = 'success') => {
    setNotification({ message, type });
    setTimeout(() => setNotification(''), 3000);
  };

  const copyPaymentLink = async (link) => {
    try {
      await navigator.clipboard.writeText(link);
      showNotification('Payment link copied to clipboard!');
    } catch (error) {
      console.error('Failed to copy link:', error);
      showNotification('Failed to copy link', 'error');
    }
  };

  if (loading && invoices.length === 0) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-4 border-blue-600 border-t-transparent mx-auto mb-4"></div>
          <p className="text-gray-600">Loading dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-6">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">
                Accounts Receivable Dashboard
              </h1>
              <p className="text-gray-600 mt-1">Welcome back, {user?.username}!</p>
            </div>
            <button
              onClick={logout}
              className="bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 transition duration-200 flex items-center gap-2"
            >
              Logout
            </button>
          </div>
        </div>
      </header>

      {/* Notification */}
      {notification && (
        <Notification 
          message={notification.message} 
          type={notification.type}
          onClose={() => setNotification('')}
        />
      )}

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Stats Cards */}
        <StatCards stats={stats} />

        {/* Search and Filter */}
        <SearchAndFilter 
          searchTerm={searchTerm}
          setSearchTerm={setSearchTerm}
          statusFilter={statusFilter}
          setStatusFilter={setStatusFilter}
          onCreateInvoice={() => setShowCreateModal(true)}
        />

        {/* Invoices Table */}
        <InvoiceTable 
          invoices={invoices}
          loading={loading}
          onCopyPaymentLink={copyPaymentLink}
        />
      </div>

      {/* Create Invoice Modal */}
      <CreateInvoiceModal
        isOpen={showCreateModal}
        onClose={() => setShowCreateModal(false)}
        onInvoiceCreated={handleInvoiceCreated}
      />
    </div>
  );
};

export default Dashboard;
