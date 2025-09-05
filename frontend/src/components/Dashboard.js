import React, { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import CreateInvoiceModal from './CreateInvoiceModal';
import EditInvoiceModal from './EditInvoiceModal';
import InvoiceTable from './InvoiceTable';
import StatCards from './StatCards';
import SearchAndFilter from './SearchAndFilter';
import Notification from './Notification';

const Dashboard = () => {
  const [invoices, setInvoices] = useState([]);
  const [stats, setStats] = useState({});
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [editingInvoice, setEditingInvoice] = useState(null);
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
        
        if (Array.isArray(data)) {
          setInvoices(data);
        } else if (data.invoices && Array.isArray(data.invoices)) {
          setInvoices(data.invoices);
        } else {
          console.error('Unexpected API response format:', data);
          setInvoices([]);
        }
      } else {
        console.error('Failed to fetch invoices, status:', response.status);
        setInvoices([]);
      }
    } catch (error) {
      console.error('Network error fetching invoices:', error);
      setInvoices([]);
      showNotification('Failed to fetch invoices', 'error');
    } finally {
      setLoading(false);
    }
  };

  const calculateStats = (invoiceList) => {
    const stats = {
      total: invoiceList.length,
      pending: invoiceList.filter(inv => inv.payment_status === 'pending').length,
      paid: invoiceList.filter(inv => inv.payment_status === 'paid').length,
      totalAmount: invoiceList.reduce((sum, inv) => sum + (parseFloat(inv.amount_due) || 0), 0)
    };
    setStats(stats);
  };

  useEffect(() => {
    fetchInvoices();
  }, [searchTerm, statusFilter]);

  useEffect(() => {
    calculateStats(invoices);
  }, [invoices]);

  const handleInvoiceCreated = (newInvoice) => {
    setInvoices(prev => [newInvoice, ...prev]);
    showNotification(`Invoice ${newInvoice.invoice_id} created successfully!`);
  };

  const handleInvoiceUpdated = (updatedInvoice) => {
    setInvoices(prev => 
      prev.map(inv => 
        inv.invoice_id === updatedInvoice.invoice_id ? updatedInvoice : inv
      )
    );
    showNotification(`Invoice ${updatedInvoice.invoice_id} updated successfully!`);
  };

  const handleInvoiceDeleted = (invoiceId) => {
    setInvoices(prev => prev.filter(inv => inv.invoice_id !== invoiceId));
    showNotification(`Invoice ${invoiceId} deleted successfully!`);
  };

  const handleEditInvoice = (invoice) => {
    setEditingInvoice(invoice);
    setShowEditModal(true);
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
              <i className="fas fa-sign-out-alt"></i>
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
          onDeleteInvoice={handleInvoiceDeleted}
          onEditInvoice={handleEditInvoice}
        />
      </div>

      {/* Create Invoice Modal */}
      <CreateInvoiceModal
        isOpen={showCreateModal}
        onClose={() => setShowCreateModal(false)}
        onInvoiceCreated={handleInvoiceCreated}
      />

      {/* Edit Invoice Modal */}
      <EditInvoiceModal
        isOpen={showEditModal}
        onClose={() => {
          setShowEditModal(false);
          setEditingInvoice(null);
        }}
        invoice={editingInvoice}
        onInvoiceUpdated={handleInvoiceUpdated}
      />
    </div>
  );
};

export default Dashboard;
