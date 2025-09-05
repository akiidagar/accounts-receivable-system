import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';

const PaymentPage = () => {
  const { invoiceId } = useParams();
  const [invoice, setInvoice] = useState(null);
  const [loading, setLoading] = useState(true);
  const [processing, setProcessing] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchInvoice();
  }, [invoiceId]);

  const fetchInvoice = async () => {
    try {
      const response = await fetch(`http://localhost:3001/api/invoices/${invoiceId}`);
      if (response.ok) {
        const data = await response.json();
        setInvoice(data);
      } else {
        setError('Invoice not found');
      }
    } catch (error) {
      setError('Failed to load invoice');
    }
    setLoading(false);
  };

  const handlePayment = async () => {
    setProcessing(true);
    try {
      const response = await fetch(`http://localhost:3001/api/payments/${invoiceId}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ amount: invoice.amount_due })
      });

      if (response.ok) {
        setSuccess(true);
      } else {
        const errorData = await response.json();
        setError(errorData.error);
      }
    } catch (error) {
      setError('Payment processing failed');
    }
    setProcessing(false);
  };

  if (loading) return <div className="flex justify-center items-center min-h-screen">Loading...</div>;
  if (error && !invoice) return <div className="flex justify-center items-center min-h-screen text-red-500">{error}</div>;

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4">
      <div className="max-w-md mx-auto bg-white rounded-xl shadow-lg overflow-hidden">
        <div className="bg-blue-600 px-6 py-8 text-white text-center">
          <h2 className="text-2xl font-bold">Invoice Payment</h2>
        </div>
        
        <div className="p-6">
          {success ? (
            <div className="text-center">
              <div className="text-green-600 text-4xl mb-4">✓</div>
              <h3 className="text-xl font-bold mb-2">Payment Successful!</h3>
              <p>Your payment of ${invoice.amount_due.toFixed(2)} has been processed.</p>
            </div>
          ) : (
            <>
              <div className="mb-6">
                <h3 className="text-lg font-semibold mb-4">Invoice Details</h3>
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span>Invoice ID:</span>
                    <span className="font-medium">{invoice.invoice_id}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Customer:</span>
                    <span className="font-medium">{invoice.customer_name}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Due Date:</span>
                    <span className="font-medium">{new Date(invoice.due_date).toLocaleDateString()}</span>
                  </div>
                  <div className="flex justify-between border-t pt-2">
                    <span className="text-lg font-semibold">Amount Due:</span>
                    <span className="text-2xl font-bold text-blue-600">
                      ${invoice.amount_due.toFixed(2)}
                    </span>
                  </div>
                </div>
              </div>

              {error && (
                <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
                  {error}
                </div>
              )}

              <button
                onClick={handlePayment}
                disabled={processing || invoice.payment_status === 'paid'}
                className="w-full bg-blue-600 text-white py-3 px-6 rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {processing ? 'Processing...' : `Pay $${invoice.amount_due.toFixed(2)}`}
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default PaymentPage;
