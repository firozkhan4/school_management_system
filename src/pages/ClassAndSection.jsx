import React, { useState, useEffect } from 'react';
import {
  Users, UserSquare, Calendar, Home, Hash, CheckCircle, Clock, Save,
  BookOpen, Trello, Menu, X, Settings, LogOut, Plus, Edit, Trash2, Search, Zap, Check, X as XIcon
} from 'lucide-react';

// --- Global Mock Data ---
const mockClasses = ['Grade 1', 'Grade 5', 'Grade 10', 'Grade 12'];
const mockSections = ['A', 'B', 'C', 'D'];
const mockSchoolName = "ABC International School";

// --- Reusable Components ---

const Modal = ({ isOpen, onClose, title, children }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl shadow-2xl w-full max-w-xl overflow-hidden transform transition-all duration-300 scale-100">
        <div className="p-5 border-b flex justify-between items-center bg-blue-50">
          <h3 className="text-xl font-bold text-gray-800">{title}</h3>
          <button onClick={onClose} className="text-gray-500 hover:text-gray-700">
            <X size={24} />
          </button>
        </div>
        <div className="p-6">
          {children}
        </div>
      </div>
    </div>
  );
};

// --- Page Content Implementations ---

// Placeholder for Dashboard
const DashboardContent = () => (
  <div className="p-8 bg-white rounded-xl shadow-xl">
    <h2 className="text-3xl font-bold text-gray-800 mb-4">Welcome to SchoolHub!</h2>
    <p className="text-gray-600">This is the main control center for {mockSchoolName}. Use the sidebar to navigate modules.</p>
    <div className="mt-6 p-4 bg-blue-50 rounded-lg text-blue-700 font-medium flex items-center">
      <Trello size={20} className="mr-3" /> Quick Stats Summary goes here (e.g., Today's total present count).
    </div>
  </div>
);

// ----------------------------------------------------------------------
// Classes & Sections Management
// ----------------------------------------------------------------------
const ClassAndSection = ({ db, userId, setLoading, setMessage }) => {
  const [classes, setClasses] = useState([]);
  const [newClass, setNewClass] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentClass, setCurrentClass] = useState(null); // For editing
  const [editClassName, setEditClassName] = useState('');
  const [newSectionName, setNewSectionName] = useState('');
  const [dataLoading, setDataLoading] = useState(true);

  // --- Modal Management ---

  const openEditModal = (classData) => {
    setCurrentClass(classData);
    setEditClassName(classData.name);
    setNewSectionName('');
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setCurrentClass(null);
  };


  // --- CRUD Operations for Classes ---

  // Handle adding a new class (document)
  const handleAddClass = async (e) => {
    e.preventDefault();
    if (!db || !classesCollectionPath || !newClass.trim()) return;

    setLoading(true);
    setMessage('');
    const className = newClass.trim();

    try {
      await addDoc(collection(db, classesCollectionPath), {
        name: className,
        sections: mockSections.slice(0, 2), // Default sections
        createdAt: new Date().toISOString(),
      });
      setMessage(<span className="font-semibold flex items-center"><CheckCircle className="w-5 h-5 mr-2" /> Class '{className}' added successfully!</span>);
      setNewClass('');
    } catch (error) {
      console.error("Error adding class:", error);
      setMessage(`Error adding class: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  // Handle deleting a class (document)
  const handleDeleteClass = async (classId, className) => {
    if (!db || !classesCollectionPath) return;

    const isConfirmed = window.confirm(`Are you sure you want to delete the Class: ${className}? This will remove all associated data.`);

    if (isConfirmed) {
      setLoading(true);
      setMessage('');
      try {
        await deleteDoc(doc(db, classesCollectionPath, classId));
        setMessage(<span className="font-semibold flex items-center"><Trash2 className="w-5 h-5 mr-2" /> Class '{className}' deleted successfully.</span>);
      } catch (error) {
        console.error("Error deleting class:", error);
        setMessage(`Error deleting class: ${error.message}`);
      } finally {
        setLoading(false);
      }
    }
  };

  // Handle saving class name and section updates from modal
  const handleUpdateClassDetails = async (e) => {
    e.preventDefault();
    if (!db || !classesCollectionPath || !currentClass || !editClassName.trim()) return;

    setLoading(true);
    setMessage('');

    try {
      await updateDoc(doc(db, classesCollectionPath, currentClass.id), {
        name: editClassName.trim(),
        sections: currentClass.sections, // Sections are updated separately
      });
      setMessage(<span className="font-semibold flex items-center"><CheckCircle className="w-5 h-5 mr-2" /> Class '{editClassName}' updated successfully!</span>);
      closeModal();
    } catch (error) {
      console.error("Error updating class:", error);
      setMessage(`Error updating class: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };


  // --- CRUD Operations for Sections (Array fields) ---

  const handleAddSection = async (e) => {
    e.preventDefault();
    const sectionName = newSectionName.trim();
    if (!db || !currentClass || !sectionName) return;

    // Check if section already exists (case-insensitive)
    if (currentClass.sections.map(s => s.toLowerCase()).includes(sectionName.toLowerCase())) {
      alert('Section already exists!'); // Using alert for simple input validation feedback
      return;
    }

    setLoading(true);
    setMessage('');

    try {
      // Use arrayUnion to add the section to the array field
      await updateDoc(doc(db, classesCollectionPath, currentClass.id), {
        sections: arrayUnion(sectionName),
      });

      // Update local state temporarily for smooth UI (will be overwritten by onSnapshot)
      setCurrentClass(prev => ({
        ...prev,
        sections: [...prev.sections, sectionName]
      }));

      setNewSectionName('');
      setMessage(<span className="font-semibold flex items-center"><CheckCircle className="w-5 h-5 mr-2" /> Section '{sectionName}' added to {currentClass.name}.</span>);
    } catch (error) {
      console.error("Error adding section:", error);
      setMessage(`Error adding section: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  const handleRemoveSection = async (sectionToRemove) => {
    if (!db || !currentClass) return;

    setLoading(true);
    setMessage('');

    try {
      // Use arrayRemove to remove the section from the array field
      await updateDoc(doc(db, classesCollectionPath, currentClass.id), {
        sections: arrayRemove(sectionToRemove),
      });

      // Update local state temporarily
      setCurrentClass(prev => ({
        ...prev,
        sections: prev.sections.filter(s => s !== sectionToRemove)
      }));

      setMessage(<span className="font-semibold flex items-center"><XIcon className="w-5 h-5 mr-2" /> Section '{sectionToRemove}' removed from {currentClass.name}.</span>);
    } catch (error) {
      console.error("Error removing section:", error);
      setMessage(`Error removing section: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  // --- Class Edit Modal Content ---

  const classEditModalContent = currentClass && (
    <form onSubmit={handleUpdateClassDetails} className="space-y-6">
      <h3 className="text-lg font-bold text-gray-800">Class Name</h3>
      <div>
        <label htmlFor="editClassName" className="block text-sm font-medium text-gray-700">Class Name</label>
        <input
          type="text"
          id="editClassName"
          value={editClassName}
          onChange={(e) => setEditClassName(e.target.value)}
          required
          className="mt-1 block w-full rounded-lg border-gray-300 shadow-sm focus:ring-purple-500 focus:border-purple-500 border p-2"
        />
        <button
          type="submit"
          className="mt-3 w-full py-2 bg-purple-500 text-white rounded-lg hover:bg-purple-600 transition disabled:opacity-50"
          disabled={editClassName.trim() === currentClass.name || !editClassName.trim()}
        >
          <Save size={16} className="inline mr-2" /> Save Class Name
        </button>
      </div>

      <div className="border-t pt-4 space-y-4">
        <h3 className="text-lg font-bold text-gray-800">Manage Sections</h3>

        {/* Section List */}
        <div className="flex flex-wrap gap-2 p-3 border rounded-lg bg-gray-50 min-h-[50px]">
          {currentClass.sections.length > 0 ? (
            currentClass.sections.map(section => (
              <span key={section} className="flex items-center bg-purple-100 text-purple-800 text-sm font-medium px-3 py-1 rounded-full">
                {section}
                <button
                  type="button"
                  onClick={() => handleRemoveSection(section)}
                  className="ml-2 text-purple-600 hover:text-red-600 transition"
                  title={`Remove section ${section}`}
                >
                  <XIcon size={14} />
                </button>
              </span>
            ))
          ) : (
            <p className="text-gray-500 text-sm italic">No sections defined yet.</p>
          )}
        </div>

        {/* Add Section Form */}
        <form onSubmit={handleAddSection} className="flex space-x-2">
          <input
            type="text"
            placeholder="New section name (e.g., D)"
            value={newSectionName}
            onChange={(e) => setNewSectionName(e.target.value.toUpperCase().replace(/[^A-Z0-9]/g, ''))} // Restrict input for cleaner section names
            className="flex-grow rounded-lg border-gray-300 shadow-sm focus:ring-purple-500 focus:border-purple-500 border p-2"
          />
          <button
            type="submit"
            className="px-4 py-2 bg-green-500 text-white font-semibold rounded-lg hover:bg-green-600 transition disabled:opacity-50"
            disabled={!newSectionName.trim()}
          >
            <Plus size={16} className="inline mr-1" /> Add
          </button>
        </form>
      </div>
    </form>
  );

  // --- Main Render ---

  return (
    <div className="space-y-8">
      <h1 className="text-3xl font-extrabold text-gray-900 flex items-center">
        <BookOpen size={32} className="mr-3 text-purple-600" /> Class & Section Management
      </h1>
      <p className="text-gray-600">Create, view, and manage all academic classes and their corresponding sections.</p>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

        {/* Class Creation Form */}
        <div className="lg:col-span-1 bg-white p-6 rounded-xl shadow-xl h-fit">
          <h2 className="text-xl font-bold text-gray-800 border-b pb-3 mb-4">Add New Class</h2>
          <form onSubmit={handleAddClass} className="space-y-4">
            <div>
              <label htmlFor="newClass" className="block text-sm font-medium text-gray-700">Class Name (e.g., Grade 1, Primary 5)</label>
              <input
                type="text"
                id="newClass"
                value={newClass}
                onChange={(e) => setNewClass(e.target.value)}
                required
                className="mt-1 block w-full rounded-lg border-gray-300 shadow-sm focus:ring-purple-500 focus:border-purple-500 border p-2"
                placeholder="Enter class name"
              />
            </div>
            <button
              type="submit"
              disabled={dataLoading || !newClass.trim()}
              className="w-full flex justify-center items-center py-3 px-4 rounded-lg shadow-md text-base font-semibold text-white bg-purple-600 hover:bg-purple-700 transition duration-200 disabled:opacity-50"
            >
              <Plus className="h-5 w-5 mr-2" />
              Create Class
            </button>
          </form>
        </div>

        {/* Classes List */}
        <div className="lg:col-span-2 space-y-6">
          <h2 className="text-2xl font-bold text-gray-800 border-b pb-2">Active Classes ({classes.length})</h2>
          <div className="bg-white rounded-xl shadow-xl overflow-hidden">
            {dataLoading ? (
              <div className="text-center p-12 text-gray-500 flex flex-col items-center">
                <Zap className="h-8 w-8 animate-pulse text-purple-500" />
                <p className="mt-3">Loading class data...</p>
              </div>
            ) : classes.length === 0 ? (
              <div className="text-center p-12 text-gray-500">
                <p className="text-lg font-semibold">No classes created yet.</p>
                <p className="text-sm mt-2">Use the form on the left to add your first class.</p>
              </div>
            ) : (
              <div className="divide-y divide-gray-100">
                {classes.map(c => (
                  <div key={c.id} className="flex items-center justify-between p-4 hover:bg-purple-50 transition duration-150">
                    <div className="flex-1 min-w-0">
                      <p className="text-lg font-semibold text-gray-800">{c.name}</p>
                      <p className="text-sm text-gray-500">
                        Sections: <span className="font-medium text-purple-600">{c.sections && c.sections.length > 0 ? c.sections.join(', ') : 'No Sections'}</span>
                      </p>
                    </div>
                    <div className="flex space-x-2">
                      <button
                        className="text-blue-600 hover:text-blue-800 p-2 rounded-lg hover:bg-blue-100 transition"
                        onClick={() => openEditModal(c)}
                        title="Edit Class Details"
                      >
                        <Edit size={20} />
                      </button>
                      <button
                        className="text-red-600 hover:text-red-800 p-2 rounded-lg hover:bg-red-100 transition"
                        onClick={() => handleDeleteClass(c.id, c.name)}
                        title="Delete Class"
                      >
                        <Trash2 size={20} />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Class Edit Modal */}
      <Modal
        isOpen={isModalOpen}
        onClose={closeModal}
        title={`Edit Class: ${currentClass ? currentClass.name : ''}`}
      >
        {classEditModalContent}
      </Modal>

    </div>
  );
};


// RosterList now only used as a placeholder for Teachers
const RosterList = ({ type }) => (
  <div className="p-8 bg-white rounded-xl shadow-xl">
    <h2 className="text-3xl font-bold text-gray-800 mb-4 flex items-center">
      <UserSquare size={30} className="mr-3 text-teal-600" /> Manage {type}
    </h2>
    <p className="text-gray-600">This table shows a list of all active {type.toLowerCase()} with options to edit, view profile, or deactivate.</p>
    <div className="mt-6 p-4 bg-teal-50 rounded-lg text-teal-700 font-medium">
      {type} Management Placeholder.
    </div>
  </div>
);

// Attendance Manager (simplified for brevity, keeping only essential pieces)
const AttendanceManager = ({ loading, setLoading, message, setMessage }) => {
  // Simplified: only using mock data now, as Firebase logic is in App and Students
  const initialStudents = [
    { id: 101, name: "Arjun Singh", status: true, roll: 1 },
    { id: 102, name: "Priya Sharma", status: true, roll: 2 },
  ];
  const [studentList] = useState(initialStudents);

  // Placeholder functions for demonstration
  const handleSave = () => {
    setLoading(true);
    setTimeout(() => setLoading(false), 1500);
    setMessage(<span className="font-semibold flex items-center"><CheckCircle className="w-5 h-5 mr-2" /> Attendance saved (Mock)!</span>);
  };

  const renderAttendanceList = () => (
    <div className="shadow-lg rounded-xl overflow-hidden bg-white">
      <div className="p-4 bg-gray-50 border-b">
        <span className="text-gray-600">Mock Data: Total: <span className="text-blue-600 font-bold">{studentList.length}</span></span>
      </div>
      <div className="divide-y divide-gray-100">
        {studentList.map(item => (
          <div key={item.id} className="flex items-center justify-between p-4 hover:bg-blue-50 transition">
            <p className="font-semibold text-gray-800">{item.name}</p>
            <button className="bg-gray-200 text-gray-700 px-3 py-1 rounded-full text-xs">Toggle</button>
          </div>
        ))}
      </div>
    </div>
  );

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-extrabold text-gray-900 flex items-center">
        <Clock size={32} className="mr-3 text-blue-600" /> Daily Attendance Manager
      </h1>
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-1 bg-white p-6 rounded-xl shadow-lg h-fit space-y-5">
          <h2 className="text-xl font-bold text-gray-800 border-b pb-3 mb-2">Filters (Mock)</h2>
          <button onClick={handleSave} className="w-full py-3 bg-blue-600 text-white rounded-lg">
            Save Attendance
          </button>
        </div>
        <div className="lg:col-span-2 space-y-6">
          <h2 className="text-2xl font-bold text-gray-800 mb-4">Students Roster (Mock)</h2>
          {renderAttendanceList()}
        </div>
      </div>
    </div>
  );
};

// ----------------------------------------------------------------------
// Manage Students Content
// ----------------------------------------------------------------------
const ManageStudentsContent = ({ db, userId, setLoading, setMessage }) => {
  const [students, setStudents] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentStudent, setCurrentStudent] = useState(null); // For editing
  const [formData, setFormData] = useState({
    name: '', roll: '', class: mockClasses[0], section: mockSections[0], dob: '', contact: '', status: 'Active'
  });
  const [dataLoading, setDataLoading] = useState(true);

  const studentsCollectionPath = db && userId ? `artifacts/${__app_id}/public/data/students` : null;

  // Real-time Data Fetching (onSnapshot)
  useEffect(() => {
    if (!db || !userId) return;

    const q = query(collection(db, studentsCollectionPath));

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const studentList = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      })).sort((a, b) => (a.roll || 0) - (b.roll || 0)); // Sort locally by roll number

      setStudents(studentList);
      setDataLoading(false);
      console.log("Students data fetched in real-time.");
    }, (error) => {
      console.error("Error fetching students:", error);
      setMessage(`Error fetching students: ${error.message}`);
      setDataLoading(false);
    });

    return () => unsubscribe();
  }, [db, userId]);

  // Handle Form Changes
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  // Open/Close Modal & Reset Form
  const openAddModal = () => {
    setCurrentStudent(null);
    setFormData({ name: '', roll: '', class: mockClasses[0], section: mockSections[0], dob: '', contact: '', status: 'Active' });
    setIsModalOpen(true);
  };

  const openEditModal = (student) => {
    setCurrentStudent(student);
    setFormData(student);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
  };

  // CRUD Operations
  const handleSave = async (e) => {
    e.preventDefault();
    if (!db || !studentsCollectionPath) return;

    setLoading(true);
    setMessage('');

    // Ensure roll is stored as a number
    const dataToSave = {
      ...formData,
      roll: parseInt(formData.roll, 10) || 0,
      // Ensure other fields are present to avoid Firestore errors
      name: formData.name || '',
      dob: formData.dob || '',
      contact: formData.contact || '',
    };

    try {
      if (currentStudent) {
        // Update existing student
        await updateDoc(doc(db, studentsCollectionPath, currentStudent.id), dataToSave);
        setMessage(<span className="font-semibold flex items-center"><CheckCircle className="w-5 h-5 mr-2" /> Student '{formData.name}' updated successfully!</span>);
      } else {
        // Add new student
        await addDoc(collection(db, studentsCollectionPath), dataToSave);
        setMessage(<span className="font-semibold flex items-center"><CheckCircle className="w-5 h-5 mr-2" /> New student '{formData.name}' added successfully!</span>);
      }
      closeModal();
    } catch (error) {
      console.error("Error saving student:", error);
      setMessage(`Error saving student: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (studentId, studentName) => {
    if (!db || !studentsCollectionPath) return;

    // Using window.confirm for non-alert confirmation mechanism 
    const isConfirmed = window.confirm(`Are you sure you want to delete student: ${studentName}? This action cannot be undone.`);

    if (isConfirmed) {
      setLoading(true);
      setMessage('');
      try {
        await deleteDoc(doc(db, studentsCollectionPath, studentId));
        setMessage(<span className="font-semibold flex items-center"><Trash2 className="w-5 h-5 mr-2" /> Student '{studentName}' deleted successfully.</span>);
      } catch (error) {
        console.error("Error deleting student:", error);
        setMessage(`Error deleting student: ${error.message}`);
      } finally {
        setLoading(false);
      }
    }
  };

  // Filtered List for Table
  const filteredStudents = students.filter(student =>
    student.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    String(student.roll).includes(searchTerm) ||
    student.class.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Student Form Content
  const studentForm = (
    <form onSubmit={handleSave} className="space-y-4">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label htmlFor="name" className="block text-sm font-medium text-gray-700">Full Name</label>
          <input type="text" id="name" name="name" value={formData.name} onChange={handleChange} required
            className="mt-1 block w-full rounded-lg border-gray-300 shadow-sm focus:ring-blue-500 focus:border-blue-500 border p-2" />
        </div>
        <div>
          <label htmlFor="roll" className="block text-sm font-medium text-gray-700">Roll Number</label>
          <input type="number" id="roll" name="roll" value={formData.roll} onChange={handleChange} required
            className="mt-1 block w-full rounded-lg border-gray-300 shadow-sm focus:ring-blue-500 focus:border-blue-500 border p-2" />
        </div>
        <div>
          <label htmlFor="class" className="block text-sm font-medium text-gray-700">Class</label>
          <select id="class" name="class" value={formData.class} onChange={handleChange} required
            className="mt-1 block w-full rounded-lg border-gray-300 shadow-sm focus:ring-blue-500 focus:border-blue-500 border p-2">
            {mockClasses.map(c => <option key={c} value={c}>{c}</option>)}
          </select>
        </div>
        <div>
          <label htmlFor="section" className="block text-sm font-medium text-gray-700">Section</label>
          <select id="section" name="section" value={formData.section} onChange={handleChange} required
            className="mt-1 block w-full rounded-lg border-gray-300 shadow-sm focus:ring-blue-500 focus:border-blue-500 border p-2">
            {mockSections.map(s => <option key={s} value={s}>{s}</option>)}
          </select>
        </div>
        <div>
          <label htmlFor="dob" className="block text-sm font-medium text-gray-700">Date of Birth</label>
          <input type="date" id="dob" name="dob" value={formData.dob} onChange={handleChange}
            className="mt-1 block w-full rounded-lg border-gray-300 shadow-sm focus:ring-blue-500 focus:border-blue-500 border p-2" />
        </div>
        <div>
          <label htmlFor="contact" className="block text-sm font-medium text-gray-700">Contact Email</label>
          <input type="email" id="contact" name="contact" value={formData.contact} onChange={handleChange}
            className="mt-1 block w-full rounded-lg border-gray-300 shadow-sm focus:ring-blue-500 focus:border-blue-500 border p-2" />
        </div>
        <div className="sm:col-span-2">
          <label htmlFor="status" className="block text-sm font-medium text-gray-700">Status</label>
          <select id="status" name="status" value={formData.status} onChange={handleChange}
            className="mt-1 block w-full rounded-lg border-gray-300 shadow-sm focus:ring-blue-500 focus:border-blue-500 border p-2">
            <option value="Active">Active</option>
            <option value="Inactive">Inactive</option>
          </select>
        </div>
      </div>
      <button type="submit" disabled={dataLoading}
        className="w-full flex justify-center items-center py-3 px-4 rounded-lg shadow-md text-base font-semibold text-white bg-green-600 hover:bg-green-700 transition duration-200 disabled:opacity-50 mt-6">
        <Save className="h-5 w-5 mr-2" />
        {currentStudent ? 'Update Student' : 'Add Student'}
      </button>
    </form>
  );

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-extrabold text-gray-900 flex items-center">
        <Users size={32} className="mr-3 text-teal-600" /> Student Roster Management
      </h1>
      <p className="text-gray-600">View, add, edit, and delete student records in real-time using Firestore.</p>

      {/* Controls & Search */}
      <div className="flex flex-col sm:flex-row justify-between items-center space-y-4 sm:space-y-0">
        <div className="relative w-full sm:w-80">
          <Search size={20} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            placeholder="Search by name, roll, or class..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-xl shadow-inner focus:ring-teal-500 focus:border-teal-500"
          />
        </div>
        <button
          onClick={openAddModal}
          className="w-full sm:w-auto flex items-center px-6 py-2 bg-teal-600 text-white font-semibold rounded-xl shadow-lg hover:bg-teal-700 transition duration-200"
        >
          <Plus size={20} className="mr-2" /> Add New Student
        </button>
      </div>

      {/* Student Table */}
      <div className="bg-white rounded-xl shadow-xl overflow-x-auto">
        {dataLoading ? (
          <div className="text-center p-12 text-gray-500 flex flex-col items-center">
            <Zap className="h-8 w-8 animate-pulse text-teal-500" />
            <p className="mt-3">Loading student data from Firestore...</p>
            {(!db || !userId) && <p className="text-sm text-red-500 mt-2">Connecting to Firebase...</p>}
          </div>
        ) : filteredStudents.length === 0 && !searchTerm ? (
          <div className="text-center p-12 text-gray-500">
            <p className="text-lg font-semibold">No students found.</p>
            <p className="text-sm mt-2">Click "Add New Student" to get started!</p>
          </div>
        ) : filteredStudents.length === 0 && searchTerm ? (
          <div className="text-center p-12 text-gray-500">
            <p className="text-lg font-semibold">No results for "{searchTerm}".</p>
          </div>
        ) : (
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">Roll No</th>
                <th className="px-6 py-3 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">Name</th>
                <th className="px-6 py-3 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">Class</th>
                <th className="px-6 py-3 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">Contact</th>
                <th className="px-6 py-3 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">Status</th>
                <th className="px-6 py-3 text-center text-xs font-bold text-gray-500 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredStudents.map(student => (
                <tr key={student.id} className="hover:bg-teal-50 transition duration-150">
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{student.roll}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{student.name}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{student.class} {student.section}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-blue-600">{student.contact}</td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`px-3 inline-flex text-xs leading-5 font-semibold rounded-full ${student.status === 'Active' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                      }`}>
                      {student.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-center text-sm font-medium">
                    <div className="flex justify-center space-x-3">
                      <button onClick={() => openEditModal(student)} className="text-blue-600 hover:text-blue-900 p-1 rounded-lg hover:bg-blue-100 transition" title="Edit Student">
                        <Edit size={18} />
                      </button>
                      <button onClick={() => handleDelete(student.id, student.name)} className="text-red-600 hover:text-red-900 p-1 rounded-lg hover:bg-red-100 transition" title="Delete Student">
                        <Trash2 size={18} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      {/* Edit/Add Modal */}
      <Modal isOpen={isModalOpen} onClose={closeModal} title={currentStudent ? 'Edit Student Details' : 'Add New Student'}>
        {studentForm}
      </Modal>

    </div>
  );
};



export default ClassAndSection;
