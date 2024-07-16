import React from 'react';

const History = () => {
  // Sample document data
  const documents = [
    {
      id: 1,
      filename: 'document1.pdf',
      modifiedDate: '2024-01-10',
      submittedDate: '2024-01-09',
      time: '10:30 AM',
      purpose: 'Invoice'
    },
    {
      id: 2,
      filename: 'document2.docx',
      modifiedDate: '2024-01-11',
      submittedDate: '2024-01-10',
      time: '11:45 AM',
      purpose: 'Contract'
    },
    // Add more documents as needed
  ];

  return (
    <div className="container mx-auto p-8">
      <h1 className="text-3xl mb-6 text-center font-semibold text-gray-800">Document Details</h1>
      
      {/* Table */}
      <div className="bg-white shadow-md rounded my-6">
        <table className="min-w-full leading-normal">
          <thead>
            <tr>
              <th className="px-5 py-3 border-b-2 border-gray-200 bg-gray-100 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Filename</th>
              <th className="px-5 py-3 border-b-2 border-gray-200 bg-gray-100 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Modified Date</th>
              <th className="px-5 py-3 border-b-2 border-gray-200 bg-gray-100 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Submitted Date</th>
              <th className="px-5 py-3 border-b-2 border-gray-200 bg-gray-100 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Time</th>
              <th className="px-5 py-3 border-b-2 border-gray-200 bg-gray-100 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Purpose of Document</th>
            </tr>
          </thead>
          <tbody>
            {documents.map((document) => (
              <tr key={document.id}>
                <td className="px-5 py-5 border-b border-gray-200 bg-white text-sm">{document.filename}</td>
                <td className="px-5 py-5 border-b border-gray-200 bg-white text-sm">{document.modifiedDate}</td>
                <td className="px-5 py-5 border-b border-gray-200 bg-white text-sm">{document.submittedDate}</td>
                <td className="px-5 py-5 border-b border-gray-200 bg-white text-sm">{document.time}</td>
                <td className="px-5 py-5 border-b border-gray-200 bg-white text-sm">{document.purpose}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default History;
