import React, { useState, useMemo, useCallback, useEffect } from 'react';
import { Search, Filter, Edit, Trash2, PlusCircle, Users, BookOpen, Award, Phone, Calendar } from 'lucide-react';
import { useAppContext } from '../context/AppContext';
import { getAllTeachers } from '../api/teacher.js'
import TeacherForm from './TeacherForm.jsx';
import { createTeacher } from '../api/teacher.js';

const TeacherManagement = () => {
  const [teachers, setTeachers] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterDepartment, setFilterDepartment] = useState('All');
  const [filterSubject, setFilterSubject] = useState('All');
  const [loadingData, setLoadingData] = useState(true);

  const [isFormOpen, setIsFormOpen] = useState(false);
  const [selectedTeacher, setSelectedTeacher] = useState(null);

  const { setMessage, setLoading } = useAppContext()

  const loadTeachers = async () => {
    setLoadingData(true);
    try {
      const data = await getAllTeachers();
      setTeachers(data || []); // Ensure it's always an array
    } catch (error) {
      console.error('Error loading teachers:', error);
      setTeachers([]); // Set empty array on error
    } finally {
      setLoadingData(false);
    }
  }

  useEffect(() => {
    loadTeachers();
  }, []);

  // In your TeacherManagement component, add these state variables and functions:


  const handleAddTeacher = () => {
    setSelectedTeacher(null);
    setIsFormOpen(true);
  };

  const handleEditTeacher = (teacher) => {
    setSelectedTeacher(teacher);
    setIsFormOpen(true);
  };

  const handleFormSubmit = async (formData) => {
    try {
      setLoading(true);
      if (selectedTeacher) {
        // Update existing teacher
        await updateTeacher(selectedTeacher.id, formData);
        setMessage('Teacher updated successfully!');
      } else {
        // Create new teacher
        await createTeacher(formData);
        setMessage('Teacher added successfully!');
      }
      setIsFormOpen(false);
      loadTeachers(); // Reload the list
    } catch (error) {
      setMessage('Error saving teacher: ' + error.message, 'error');
    } finally {
      setLoading(false);
    }
  };

  // Update your "Add Teacher" button:

  // Update your edit button:

  // Add the form component at the bottom:

  // Safe array methods with fallback to empty array
  const departments = ['All', ...new Set((teachers || []).map(t => t.department).filter(Boolean))];
  const subjects = ['All', ...new Set((teachers || []).map(t => t.subjectSpecialization).filter(Boolean))];

  const handleSearchChange = (e) => setSearchTerm(e.target.value);
  const handleDepartmentFilterChange = (e) => setFilterDepartment(e.target.value);
  const handleSubjectFilterChange = (e) => setFilterSubject(e.target.value);

  const handleEdit = (id) => alert(`Navigate to edit page for teacher ID: ${id}`);

  const handleDelete = (id) => {
    if (window.confirm('Delete this teacher?')) {
      setTeachers(prev => (prev || []).filter(teacher => teacher.id !== id));
    }
  };

  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  const getFullName = (teacher) => {
    if (!teacher || !teacher.user) return 'N/A';
    return `${teacher.user?.firstName || ''} ${teacher.user?.lastName || ''}`.trim();
  };

  const filteredTeachers = useMemo(() => {
    let list = teachers || []; // Ensure list is always an array

    if (filterDepartment !== 'All') {
      list = list.filter(teacher => teacher.department === filterDepartment);
    }

    if (filterSubject !== 'All') {
      list = list.filter(teacher => teacher.subjectSpecialization === filterSubject);
    }

    if (searchTerm) {
      const q = searchTerm.toLowerCase();
      list = list.filter(teacher =>
        getFullName(teacher).toLowerCase().includes(q) ||
        teacher.employeeId?.toLowerCase().includes(q) ||
        teacher.department?.toLowerCase().includes(q) ||
        teacher.subjectSpecialization?.toLowerCase().includes(q) ||
        teacher.user?.email?.toLowerCase().includes(q) ||
        teacher.qualification?.toLowerCase().includes(q)
      );
    }

    return list.sort((a, b) => new Date(b.createdAt || 0) - new Date(a.createdAt || 0));
  }, [teachers, searchTerm, filterDepartment, filterSubject]);

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

        <div className="bg-white p-4 rounded-xl shadow-md mb-6 grid grid-cols-1 md:grid-cols-4 gap-4 items-center">
          <div className="md:col-span-2">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type="text"
                placeholder="Search by Name, Employee ID, Department, Subject, or Email..."
                value={searchTerm}
                onChange={handleSearchChange}
                className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg"
              />
            </div>
          </div>

          <div className="relative">
            <Filter className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
            <select
              value={filterDepartment}
              onChange={handleDepartmentFilterChange}
              className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg bg-white"
            >
              {departments.map(dept => (
                <option key={dept} value={dept}>Dept: {dept}</option>
              ))}
            </select>
          </div>

          <div className="relative">
            <BookOpen className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
            <select
              value={filterSubject}
              onChange={handleSubjectFilterChange}
              className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg bg-white"
            >
              {subjects.map(subject => (
                <option key={subject} value={subject}>Subject: {subject}</option>
              ))}
            </select>
          </div>

          <button
            onClick={handleAddTeacher}
            className="flex items-center bg-blue-600 text-white px-4 py-3 rounded-lg shadow hover:bg-blue-700 md:col-start-4"
          >
            <PlusCircle className="w-5 h-5 mr-2" /> Add Teacher
          </button>
        </div>

        <div className="bg-white rounded-xl shadow overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-600 uppercase">Employee ID</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-600 uppercase">Teacher</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-600 uppercase">Department & Subject</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-600 uppercase">Experience & Qualification</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-600 uppercase">Class Teacher</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-600 uppercase">Hire Date</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-600 uppercase">Actions</th>
              </tr>
            </thead>

            <tbody className="bg-white divide-y divide-gray-200">
              {loadingData ? (
                <tr>
                  <td colSpan="7" className="text-center py-8 text-gray-500">
                    <div className="flex justify-center">
                      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
                    </div>
                  </td>
                </tr>
              ) : filteredTeachers.length ? (
                filteredTeachers.map(teacher => (
                  <tr key={teacher.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4">
                      <div className="text-sm font-medium text-blue-600">
                        {teacher.employeeId || 'N/A'}
                      </div>
                    </td>

                    <td className="px-6 py-4">
                      <div className="text-sm font-medium text-gray-900">
                        {getFullName(teacher)}
                      </div>
                      <div className="text-sm text-gray-500">{teacher.user?.email || 'N/A'}</div>
                      {teacher.emergencyContact && (
                        <div className="flex items-center mt-1 text-xs text-gray-400">
                          <Phone className="w-3 h-3 mr-1" />
                          {teacher.emergencyContact.phone}
                        </div>
                      )}
                    </td>

                    <td className="px-6 py-4">
                      <div className="text-sm font-medium text-gray-900">{teacher.department || 'N/A'}</div>
                      <div className="text-sm text-gray-500">{teacher.subjectSpecialization || 'N/A'}</div>
                    </td>

                    <td className="px-6 py-4">
                      <div className="text-sm text-gray-900">
                        {teacher.yearsOfExperience || 0} years exp
                      </div>
                      <div className="text-sm text-gray-500 truncate max-w-xs">
                        {teacher.qualification || 'N/A'}
                      </div>
                      {teacher.awardsAndCertifications?.length > 0 && (
                        <div className="flex items-center mt-1 text-xs text-amber-600">
                          <Award className="w-3 h-3 mr-1" />
                          {teacher.awardsAndCertifications.length} awards
                        </div>
                      )}
                    </td>

                    <td className="px-6 py-4">
                      {teacher.isClassTeacher ? (
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                          {teacher.classTeacherOfGrade || 'Class Teacher'}
                        </span>
                      ) : (
                        <span className="text-sm text-gray-500">No</span>
                      )}
                    </td>

                    <td className="px-6 py-4">
                      <div className="flex items-center text-sm text-gray-500">
                        <Calendar className="w-4 h-4 mr-1" />
                        {formatDate(teacher.hireDate)}
                      </div>
                    </td>

                    <td className="px-6 py-4">
                      <div className="flex space-x-2">
                        <button
                          onClick={() => handleEditTeacher(teacher)}
                          className="text-indigo-600 hover:text-indigo-900 p-1 rounded hover:bg-indigo-50"
                        >
                          <Edit className="w-5 h-5" />
                        </button>
                        <button
                          onClick={() => handleDelete(teacher.id)}
                          className="text-red-600 hover:text-red-900 p-1 rounded hover:bg-red-50"
                        >
                          <Trash2 className="w-5 h-5" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="7" className="text-center py-6 text-gray-500">
                    {teachers && teachers.length > 0 ? 'No teachers found matching your criteria.' : 'No teachers available.'}
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      <TeacherForm
        isOpen={isFormOpen}
        onClose={() => setIsFormOpen(false)}
        onSubmit={handleFormSubmit}
        initialData={selectedTeacher}
      />
    </div>
  );
};

export default TeacherManagement;
