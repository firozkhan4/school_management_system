import React, { useState, useMemo, useCallback } from 'react';
import { Search, Filter, Edit, Trash2, CheckCircle, Clock, XCircle, Users, BookOpen } from 'lucide-react';

// --- Mock Data Generator (Simulates data fetched from the backend) ---
const generateMockApplications = (count) => {
  const statuses = ['Pending', 'Accepted', 'Rejected', 'Interviewing'];
  const grades = ['10th', '9th', '12th', '8th', '11th'];
  const firstNames = ["Aarav", "Priya", "Kabir", "Diya", "Rohan", "Anjali", "Siddharth", "Meera"];
  const lastNames = ["Sharma", "Verma", "Singh", "Jain", "Reddy", "Patel", "Kumar", "Bose"];

  return Array.from({ length: count }, (_, i) => {
    const status = statuses[i % statuses.length];
    const grade = grades[i % grades.length];
    const firstName = firstNames[i % firstNames.length];
    const lastName = lastNames[i % lastNames.length];
    const applicationNumber = `ADM-${1000 + i}`;

    return {
      id: i + 1,
      applicationNumber,
      applicantName: `${firstName} ${lastName}`,
      gradeApplied: grade,
      academicYear: `2024-2025`,
      dateOfBirth: `2008-0${(i % 12) + 1}-15`,
      category: i % 2 === 0 ? 'general' : 'sc',
      status: status,
      submissionDate: `2024-06-${(i % 28) + 1}`,
    };
  });
};

const MOCK_APPLICATIONS = generateMockApplications(20);

// --- Status Badge Component ---
const StatusBadge = ({ status }) => {
  let color = 'bg-gray-100 text-gray-800';
  let Icon = Clock;

  switch (status) {
    case 'Accepted':
      color = 'bg-green-100 text-green-800 border border-green-300';
      Icon = CheckCircle;
      break;
    case 'Rejected':
      color = 'bg-red-100 text-red-800 border border-red-300';
      Icon = XCircle;
      break;
    case 'Interviewing':
      color = 'bg-blue-100 text-blue-800 border border-blue-300';
      Icon = Users;
      break;
    case 'Pending':
    default:
      color = 'bg-yellow-100 text-yellow-800 border border-yellow-300';
      Icon = Clock;
      break;
  }

  return (
    <span className={`inline-flex items-center px-3 py-1 text-xs font-medium rounded-full ${color} transition duration-150`}>
      <Icon className="w-3 h-3 mr-1" />
      {status}
    </span>
  );
};

// --- Main Application Component (Admission List Dashboard) ---
const Admission = () => {
  const [applications, setApplications] = useState(MOCK_APPLICATIONS);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('All');

  // Available statuses for the filter dropdown
  const availableStatuses = ['All', ...new Set(MOCK_APPLICATIONS.map(app => app.status))];

  // Handlers
  const handleSearchChange = useCallback((e) => {
    setSearchTerm(e.target.value);
  }, []);

  const handleFilterChange = useCallback((e) => {
    setFilterStatus(e.target.value);
  }, []);

  const handleEdit = useCallback((id) => {
    console.log(`Editing application with ID: ${id}`);
    // In a real app, this would navigate to the edit form
    alert(`Navigating to Edit Form for Application ID: ${id}`);
  }, []);

  const handleDelete = useCallback((id) => {
    console.log(`Deleting application with ID: ${id}`);
    if (window.confirm(`Are you sure you want to delete application ID: ${id}?`)) {
      // In a real app, this would be an API call to delete the record
      setApplications(prev => prev.filter(app => app.id !== id));
      alert(`Application ${id} deleted (mock action).`);
    }
  }, []);

  // Filtered list using useMemo for performance
  const filteredApplications = useMemo(() => {
    let filtered = applications;

    // 1. Filter by Status
    if (filterStatus !== 'All') {
      filtered = filtered.filter(app => app.status === filterStatus);
    }

    // 2. Filter by Search Term (case-insensitive search across key fields)
    if (searchTerm) {
      const lowerCaseSearch = searchTerm.toLowerCase();
      filtered = filtered.filter(app => (
        app.applicantName.toLowerCase().includes(lowerCaseSearch) ||
        app.applicationNumber.toLowerCase().includes(lowerCaseSearch) ||
        app.gradeApplied.toLowerCase().includes(lowerCaseSearch)
      ));
    }

    // Sort by ID (newest first, mock)
    return filtered.sort((a, b) => b.id - a.id);
  }, [applications, filterStatus, searchTerm]);


  return (
    <div className="min-h-screen bg-gray-50 p-4 sm:p-8 antialiased">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <header className="mb-8">
          <h1 className="text-3xl sm:text-4xl font-extrabold text-gray-900 flex items-center">
            <BookOpen className="w-8 h-8 mr-3 text-blue-600" />
            Admission Applications List
          </h1>
          <p className="text-gray-500 mt-1">Manage, filter, and review all student admission records.</p>
        </header>

        {/* Controls Bar (Search & Filter) */}
        <div className="bg-white p-4 rounded-xl shadow-lg mb-6 flex flex-col md:flex-row gap-4 items-center">

          {/* Search Input */}
          <div className="relative w-full md:w-1/2">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              type="text"
              placeholder="Search by Applicant Name, Application #, or Grade..."
              value={searchTerm}
              onChange={handleSearchChange}
              className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500 transition shadow-sm"
            />
          </div>

          {/* Filter Dropdown */}
          <div className="relative w-full md:w-1/4">
            <Filter className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
            <select
              value={filterStatus}
              onChange={handleFilterChange}
              className="appearance-none w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500 bg-white transition shadow-sm"
            >
              {availableStatuses.map(status => (
                <option key={status} value={status}>
                  Filter by: {status}
                </option>
              ))}
            </select>
          </div>

          {/* Total Count */}
          <div className="hidden md:block w-full md:w-1/4 text-right text-gray-600 font-medium">
            Showing {filteredApplications.length} of {applications.length} results
          </div>
        </div>

        {/* Application Table */}
        <div className="bg-white rounded-xl shadow-xl overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Application #</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Applicant Name</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Grade</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Submission Date</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredApplications.length > 0 ? (
                filteredApplications.map((app) => (
                  <tr key={app.id} className="hover:bg-gray-50 transition duration-100">
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-blue-600">{app.applicationNumber}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{app.applicantName}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{app.gradeApplied}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{app.submissionDate}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm">
                      <StatusBadge status={app.status} />
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <div className="flex space-x-2">
                        <button
                          onClick={() => handleEdit(app.id)}
                          title="Edit Application"
                          className="text-indigo-600 hover:text-indigo-900 p-1 rounded-full hover:bg-indigo-50 transition"
                        >
                          <Edit className="w-5 h-5" />
                        </button>
                        <button
                          onClick={() => handleDelete(app.id)}
                          title="Delete Application"
                          className="text-red-600 hover:text-red-900 p-1 rounded-full hover:bg-red-50 transition"
                        >
                          <Trash2 className="w-5 h-5" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="6" className="px-6 py-8 text-center text-lg text-gray-500">
                    No applications match your current filters.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default Admission;
