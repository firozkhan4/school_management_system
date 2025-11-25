import React, { useState, useMemo, useCallback, useEffect } from 'react';
import { Search, Filter, Edit, Trash2, PlusCircle, Users, BookOpen } from 'lucide-react';
import { useAppContext } from '../context/AppContext';
import { getAllTeachers } from '../api/teacher.js'

const TeacherManagement = () => {
  const [teachers, setTeachers] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterSubject, setFilterSubject] = useState('All');


  const [loadingData, setLoadingData] = useState(true);

  const { setMessage, setLoading } = useAppContext()


  const loadTeachers = async () => {
    setLoadingData(true);
    const data = await getAllTeachers();
    setTeachers(data);
    setLoadingData(false);
  }

  useEffect(() => { loadTeachers() }, [])

  const subjects = ['All', ...new Set(teachers.map(t => t.subject))];

  const handleSearchChange = (e) => setSearchTerm(e.target.value);
  const handleFilterChange = (e) => setFilterSubject(e.target.value);

  const handleEdit = (id) => alert(`Navigate to edit page for teacher ID: ${id}`);

  const handleDelete = (id) => {
    if (window.confirm('Delete this teacher?')) {
      setTeachers(prev => prev.filter(teacher => teacher.id !== id));
    }
  };

  const filteredTeachers = useMemo(() => {
    let list = teachers;

    if (filterSubject !== 'All') list = list.filter(teacher => teacher.subject === filterSubject);

    if (searchTerm) {
      const q = searchTerm.toLowerCase();
      list = list.filter(teacher =>
        teacher.name.toLowerCase().includes(q) ||
        teacher.teacherId.toLowerCase().includes(q) ||
        teacher.subject.toLowerCase().includes(q) ||
        teacher.email.toLowerCase().includes(q)
      );
    }

    return list.sort((a, b) => b.id - a.id);
  }, [teachers, searchTerm, filterSubject]);

  return (
    <div className="min-h-screen bg-gray-50 sm:p-8">
      <div className="max-w-7xl mx-auto">
        <header className="mb-8">
          <h1 className="text-3xl font-extrabold text-gray-900 flex items-center">
            <Users className="w-8 h-8 mr-3 text-blue-600" />
            Teacher Management
          </h1>
          <p className="text-gray-500">Track, manage, edit and organize all teacher records.</p>
        </header>

        <div className="bg-white p-4 rounded-xl shadow-md mb-6 flex flex-col md:flex-row gap-4 items-center">
          <div className="relative w-full md:w-1/2">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              type="text"
              placeholder="Search by Name, Teacher ID, Subject, or Email..."
              value={searchTerm}
              onChange={handleSearchChange}
              className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg"
            />
          </div>

          <div className="relative w-full md:w-1/4">
            <Filter className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
            <select
              value={filterSubject}
              onChange={handleFilterChange}
              className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg bg-white"
            >
              {subjects.map(subject => (
                <option key={subject} value={subject}>Filter: {subject}</option>
              ))}
            </select>
          </div>

          <button className="flex items-center bg-blue-600 text-white px-4 py-3 rounded-lg shadow hover:bg-blue-700">
            <PlusCircle className="w-5 h-5 mr-2" /> Add Teacher
          </button>
        </div>

        <div className="bg-white rounded-xl shadow overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-600 uppercase">Teacher ID</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-600 uppercase">Name</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-600 uppercase">Subject</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-600 uppercase">Grade Level</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-600 uppercase">Email</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-600 uppercase">Join Date</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-600 uppercase">Actions</th>
              </tr>
            </thead>

            <tbody className="bg-white divide-y divide-gray-200">
              {filteredTeachers.length ? (
                filteredTeachers.map(teacher => (
                  <tr key={teacher.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 text-sm font-medium text-blue-600">{teacher.teacherId}</td>
                    <td className="px-6 py-4 text-sm text-gray-900">{teacher.name}</td>
                    <td className="px-6 py-4 text-sm text-gray-500">{teacher.subject}</td>
                    <td className="px-6 py-4 text-sm text-gray-500">{teacher.gradeLevel}</td>
                    <td className="px-6 py-4 text-sm text-gray-500">{teacher.email}</td>
                    <td className="px-6 py-4 text-sm text-gray-500">{teacher.joinDate}</td>
                    <td className="px-6 py-4 text-sm font-medium">
                      <div className="flex space-x-2">
                        <button onClick={() => handleEdit(teacher.id)} className="text-indigo-600 hover:text-indigo-900">
                          <Edit className="w-5 h-5" />
                        </button>
                        <button onClick={() => handleDelete(teacher.id)} className="text-red-600 hover:text-red-900">
                          <Trash2 className="w-5 h-5" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="7" className="text-center py-6 text-gray-500">No teachers found.</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default TeacherManagement;
