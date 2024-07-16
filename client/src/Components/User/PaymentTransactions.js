import React, { useState } from 'react';
const PaymentTransactions = () => {
  const transactions = [
    {
      id: 1,
      Name: 'varshith',
      date: '2024-02-11',
      amount: '$150',
      status: 'cancelled',
      action: 'Details'
    },
    {
      id: 2,
      Name: 'John due',
      date: '2024-01-11',
      amount: '$150',
      status: 'received',
      action: 'Details'
    },
    // Add more transactions as needed
  ];

  const [statusFilter, setStatusFilter] = useState('all');
  const [startDateFilter, setStartDateFilter] = useState('');
  const [endDateFilter, setEndDateFilter] = useState('');
  const [sortOrder, setSortOrder] = useState('asc');

  const filteredTransactions = transactions.filter(transaction => {
    if (statusFilter !== 'all' && transaction.status !== statusFilter) {
      return false;
    }

    if (startDateFilter && new Date(transaction.date) < new Date(startDateFilter)) {
      return false;
    }
    if (endDateFilter && new Date(transaction.date) > new Date(endDateFilter)) {
      return false;
    }

    return true;
  });

  const sortedTransactions = filteredTransactions.sort((a, b) => {
    const dateA = new Date(a.date);
    const dateB = new Date(b.date);

    const multiplier = sortOrder === 'asc' ? 1 : -1;

    if (dateA < dateB) {
      return -1 * multiplier;
    }
    if (dateA > dateB) {
      return 1 * multiplier;
    }
    return 0;
  });

  return (
    <div className="container mx-auto p-2">
      {/* Filter row */}
      <div className="flex justify-between mb-4  border border-gray-200 rounded p-4">
          <div className="flex items-center">
            <div className="flex">
                <button onClick={() => setStatusFilter('all')} className={`status-button ${statusFilter === 'all' && 'active'}`} style={{ color: statusFilter === 'all' ? 'orange' : 'gray', borderBottom: statusFilter === 'all' ? '2px solid orange' : 'none', marginRight: '40px' }}>All</button>
                <button onClick={() => setStatusFilter('received')} className={`status-button ${statusFilter === 'received' && 'active'}`} style={{ color: statusFilter === 'received' ? 'orange' : 'gray', borderBottom: statusFilter === 'received' ? '2px solid orange' : 'none', marginRight: '40px' }}>Received</button>
                <button onClick={() => setStatusFilter('cancelled')} className={`status-button ${statusFilter === 'cancelled' && 'active'}`} style={{ color: statusFilter === 'cancelled' ? 'orange' : 'gray', borderBottom: statusFilter === 'cancelled' ? '2px solid orange' : 'none', marginRight: '40px' }}>Cancelled</button>
                <button onClick={() => setStatusFilter('onHold')} className={`status-button ${statusFilter === 'onHold' && 'active'}`} style={{ color: statusFilter === 'onHold' ? 'orange' : 'gray', borderBottom: statusFilter === 'onHold' ? '2px solid orange' : 'none' }}>On Hold</button>
              </div>
          </div>
        <div className="flex items-center">
          <label className="text-gray-500 font-semibold mr-2">Select Start and End Date:</label>
          <input type="date" onChange={(e) => setStartDateFilter(e.target.value)} className="border border-gray-300 rounded px-2 py-1 mr-4" />
          <input type="date" onChange={(e) => setEndDateFilter(e.target.value)} className="border border-gray-300 rounded px-2 py-1" />
        </div>
      </div>
      <div className="bg-white shadow-md rounded my-6 overflow-y-auto">
  <table className="min-w-full leading-normal rounded">
    <thead>
      <tr>
        <th className="px-5 py-3 border-b-2 border-gray-200 bg-gray-200 bg-opacity-40 text-left text-sm font-semibold text-blue-900 tracking-wider">Name</th>
        <th className="px-5 py-3 border-b-2 border-gray-200 bg-gray-200 bg-opacity-40 text-left text-sm font-semibold text-blue-900 tracking-wider">Date</th>
        <th className="px-5 py-3 border-b-2 border-gray-200 bg-gray-200 bg-opacity-40 text-left text-sm font-semibold text-blue-900 tracking-wider">Amount</th>
        <th className="px-5 py-3 border-b-2 border-gray-200 bg-gray-200 bg-opacity-40 text-left text-sm font-semibold text-blue-900 tracking-wider">Status</th>
        <th className="px-5 py-3 border-b-2 border-gray-200 bg-gray-200 bg-opacity-40 text-left text-sm font-semibold text-blue-900 tracking-wider">Action</th>
      </tr>
    </thead>
    <tbody>
      {sortedTransactions.map((transaction) => (
        <tr key={transaction.id}>
          <td className="px-5 py-3 border-b border-gray-200 bg-white text-sm font-semibold text-blue-900">{transaction.Name}</td>
          <td className="px-5 py-3 border-b border-gray-200 bg-white text-sm font-semibold text-blue-900">{transaction.date}</td>
          <td className="px-5 py-3 border-b border-gray-200 bg-white text-sm font-semibold text-blue-900">{transaction.amount}</td>
          <td className={`px-5 py-3 border-b border-gray-200 bg-white text-sm font-semibold ${transaction.status === 'cancelled' ? 'text-red-500' : (transaction.status === 'received' ? 'text-green-500' : '')}`}>{transaction.status}</td>
          <td className="px-5 py-3 border-b border-gray-200 bg-white text-sm font-semibold text-blue-900">
            <button className="rounded bg-white-500 text-blue-900 border-b-2 font-semibold border-gray px-2 py-1">{transaction.action}</button>
          </td>
        </tr>
      ))}
    </tbody>
  </table>
</div>
</div>
  );
};

export default PaymentTransactions;