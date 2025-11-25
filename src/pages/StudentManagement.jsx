import React, { useState, useMemo, useCallback } from 'react';
import { Search, Filter, Edit, Trash2, PlusCircle, Users, BookOpen } from 'lucide-react';

// Mock Students\
const generateMockStudents = (count) => {
  const classes = ['8th', '9th', '10th', '11th', '12th'];
  const sections = ['A', 'B', 'C'];
  const firstNames = ['Aarav', 'Kabir', 'Rohan', 'Siddharth', 'Aisha', 'Meera'];
  const lastNames = ['Sharma', 'Patel', 'Kumar', 'Bose', 'Verma', 'Singh'];

  return Array.from({ length: count }, (_, i) => ({
    id: i + 1,
    studentId: `STU-${1000 + i}`,
    name: `${firstNames[i % firstNames.length]} ${lastNames[i % lastNames.length]}`,
    className: classes[i % classes.length],
    section: sections[i % sections.length],
    admissionYear: `202${i % 3}`,
  }));
};

const MOCK_STUDENTS = generateMockStudents(25);

const StudentManagement = () => {
  const [students, setStudents] = useState(MOCK_STUDENTS);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterClass, setFilterClass] = useState('All');

  const classes = ['All', ...new Set(MOCK_STUDENTS.map(s => s.className))];

  const handleSearchChange = (e) => setSearchTerm(e.target.value);
  const handleFilterChange = (e) => setFilterClass(e.target.value);

  const handleEdit = (id) => alert(`Navigate to edit page for student ID: ${id}`);

  const handleDelete = (id) => {
    if (window.confirm('Delete this student?')) {
      setStudents(prev => prev.filter(stu => stu.id !== id));
    }
  };

  const filteredStudents = useMemo(() => {
    let list = students;

    if (filterClass !== 'All') list = list.filter(stu => stu.className === filterClass);

    if (searchTerm) {
      const q = searchTerm.toLowerCase();
      list = list.filter(stu =>
        stu.name.toLowerCase().includes(q) ||
        stu.studentId.toLowerCase().includes(q) ||
        stu.className.toLowerCase().includes(q)
      );
    }

    return list.sort((a, b) => b.id - a.id);
  }, [students, searchTerm, filterClass]);

  return (
    <div className="min-h-screen bg-gray-50 sm:p-8">
      <div className="max-w-7xl mx-auto">
        <header className="mb-8">
          <h1 className="text-3xl font-extrabold text-gray-900 flex items-center">
            <Users className="w-8 h-8 mr-3 text-green-600" />
            Student Management
          </h1>
          <p className="text-gray-500">Track, manage, edit and organize all student records.</p>
        </header>

        <div className="bg-white p-4 rounded-xl shadow-md mb-6 flex flex-col md:flex-row gap-4 items-center">
          <div className="relative w-full md:w-1/2">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              type="text"
              placeholder="Search by Name, Student ID, or Class..."
              value={searchTerm}
              onChange={handleSearchChange}
              className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg"
            />
          </div>

          <div className="relative w-full md:w-1/4">
            <Filter className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
            <select
              value={filterClass}
              onChange={handleFilterChange}
              className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg bg-white"
            >
              {classes.map(c => (
                <option key={c} value={c}>Filter: {c}</option>
              ))}
            </select>
          </div>

          <button className="flex items-center bg-green-600 text-white px-4 py-3 rounded-lg shadow hover:bg-green-700">
            <PlusCircle className="w-5 h-5 mr-2" /> Add Student
          </button>
        </div>

        <div className="bg-white rounded-xl shadow overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-600 uppercase">Student ID</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-600 uppercase">Name</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-600 uppercase">Class</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-600 uppercase">Section</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-600 uppercase">Admission Year</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-600 uppercase">Actions</th>
              </tr>
            </thead>

            <tbody className="bg-white divide-y divide-gray-200">
              {filteredStudents.length ? (
                filteredStudents.map(stu => (
                  <tr key={stu.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 text-sm font-medium text-blue-600">{stu.studentId}</td>
                    <td className="px-6 py-4 text-sm text-gray-900">{stu.name}</td>
                    <td className="px-6 py-4 text-sm text-gray-500">{stu.className}</td>
                    <td className="px-6 py-4 text-sm text-gray-500">{stu.section}</td>
                    <td className="px-6 py-4 text-sm text-gray-500">{stu.admissionYear}</td>
                    <td className="px-6 py-4 text-sm font-medium">
                      <div className="flex space-x-2">
                        <button onClick={() => handleEdit(stu.id)} className="text-indigo-600 hover:text-indigo-900">
                          <Edit className="w-5 h-5" />
                        </button>
                        <button onClick={() => handleDelete(stu.id)} className="text-red-600 hover:text-red-900">
                          <Trash2 className="w-5 h-5" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="6" className="text-center py-6 text-gray-500">No students found.</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default StudentManagement;
