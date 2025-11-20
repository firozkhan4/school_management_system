import React, { useState } from 'react';
import { Outlet } from 'react-router';
import {
  Users, UserSquare, Calendar, Home, Hash, CheckCircle, Clock, Save,
  BookOpen, Trello, Menu,
} from 'lucide-react';
import Footer from '../components/Footer';
import Avatar from '@mui/material/Avatar';
import LeftSidebar from '../components/LeftSidebar.jsx';
import { useAppContext } from '../context/AppContext.jsx';

// --- Global Mock Data ---
const mockClasses = ['Grade 1', 'Grade 5', 'Grade 10', 'Grade 12'];
const mockSections = ['A', 'B', 'C', 'D'];
const mockDepartments = ['Academics', 'Administration', 'Support Staff'];
const mockSchoolName = "ABC International School";

// --- Reusable Components ---
// --- Page Content Implementations (Functions for single-file structure) ---
// const NAV_LINKS = [
//   { id: 'dashboard', name: 'Dashboard', icon: Trello },
//   { id: 'attendance', name: 'Attendance', icon: Clock },
//   { id: 'classes', name: 'Classes & Sections', icon: BookOpen },
//   { id: 'students', name: 'Manage Students', icon: Users },
//   { id: 'teachers', name: 'Manage Teachers', icon: UserSquare },
// ];
//


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

// Placeholder for Classes & Sections
const ClassCreatorContent = () => (
  <div className="p-8 bg-white rounded-xl shadow-xl">
    <h2 className="text-3xl font-bold text-gray-800 mb-4 flex items-center"><BookOpen size={30} className="mr-3 text-purple-600" /> Class & Section Management</h2>
    <p className="text-gray-600">This area would contain the dynamic form to create new classes and sections.</p>
    <div className="mt-6 p-4 bg-purple-50 rounded-lg text-purple-700 font-medium">
      Placeholder for Class Creation Form (as built previously).
    </div>
  </div>
);

// Student/Teacher List (Shared for Students/Teachers Management pages)
const RosterList = ({ type }) => (
  <div className="p-8 bg-white rounded-xl shadow-xl">
    <h2 className="text-3xl font-bold text-gray-800 mb-4 flex items-center">
      <Users size={30} className="mr-3 text-teal-600" /> Manage {type}
    </h2>
    <p className="text-gray-600">This table shows a list of all active {type.toLowerCase()} with options to edit, view profile, or deactivate.</p>
    <div className="mt-6 p-4 bg-teal-50 rounded-lg text-teal-700 font-medium">
      {type} Table Placeholder (ID, Name, Contact, Actions).
    </div>
  </div>
);

// ----------------------------------------------------------------------
// Attendance Manager Content (Refactored from previous App.jsx)
// ----------------------------------------------------------------------
const AttendanceManager = ({ loading, setLoading, message, setMessage }) => {
  const [activeTab, setActiveTab] = useState('student');
  const [currentDate, setCurrentDate] = useState(new Date().toISOString().substring(0, 10));
  const [currentClass, setCurrentClass] = useState(mockClasses[0]);
  const [currentSection, setCurrentSection] = useState(mockSections[0]);
  const [currentDepartment, setCurrentDepartment] = useState(mockDepartments[0]);

  // Mock Data for Attendance
  const initialStudents = [
    { id: 101, name: "Arjun Singh", status: true, roll: 1 },
    { id: 102, name: "Priya Sharma", status: true, roll: 2 },
    { id: 103, name: "Rohit Verma", status: false, roll: 3 },
    { id: 104, name: "Sanya Malik", status: true, roll: 4 },
  ];
  const initialTeachers = [
    { id: 201, name: "Ms. Anita Reddy (Math)", status: true, department: 'Academics' },
    { id: 202, name: "Mr. Vivek Nambiar (Science)", status: true, department: 'Academics' },
    { id: 203, name: "Mrs. Leena Singh (English)", status: false, department: 'Academics' },
  ];

  const [studentList, setStudentList] = useState(initialStudents);
  const [teacherList, setTeacherList] = useState(initialTeachers);

  const toggleAttendance = (listType, id) => {
    setMessage('');
    if (listType === 'student') {
      setStudentList(studentList.map(item =>
        item.id === id ? { ...item, status: !item.status } : item
      ));
    } else {
      setTeacherList(teacherList.map(item =>
        item.id === id ? { ...item, status: !item.status } : item
      ));
    }
  };

  const setAllAttendance = (listType, status) => {
    setMessage('');
    if (listType === 'student') {
      setStudentList(studentList.map(item => ({ ...item, status })));
    } else {
      setTeacherList(teacherList.map(item => ({ ...item, status })));
    }
  };

  const handleSave = () => {
    setLoading(true);
    setMessage('');
    const attendanceData = activeTab === 'student' ? studentList : teacherList;
    const saveTarget = activeTab === 'student' ? `Class ${currentClass} - Section ${currentSection}` : `Department ${currentDepartment}`;

    setTimeout(() => {
      setLoading(false);
      setMessage(
        <span className="font-semibold flex items-center">
          <CheckCircle className="w-5 h-5 mr-2" />
          Attendance for **{saveTarget}** on **{currentDate}** saved successfully!
        </span>
      );
    }, 1500);
  };

  const renderAttendanceList = (listType) => {
    const list = listType === 'student' ? studentList : teacherList;
    const isStudent = listType === 'student';

    if (list.length === 0) {
      return <div className="text-center p-8 text-gray-500 bg-gray-50 rounded-lg">No {isStudent ? 'students' : 'teachers'} found.</div>;
    }

    const presentCount = list.filter(i => i.status).length;
    const absentCount = list.length - presentCount;

    return (
      <div className="shadow-lg rounded-xl overflow-hidden bg-white">
        <div className="flex items-center justify-between p-4 bg-gray-50 border-b border-gray-200">
          <div className="flex space-x-4 text-sm font-medium">
            <span className="text-gray-600">Total: <span className="text-blue-600 font-bold">{list.length}</span></span>
            <span className="text-gray-600">Present: <span className="text-green-600 font-bold">{presentCount}</span></span>
            <span className="text-gray-600">Absent: <span className="text-red-600 font-bold">{absentCount}</span></span>
          </div>
          <div className="hidden sm:flex space-x-2">
            <button onClick={() => setAllAttendance(listType, true)} className="px-3 py-1 text-xs font-medium rounded-lg text-green-700 bg-green-100 hover:bg-green-200 transition">Mark All Present</button>
            <button onClick={() => setAllAttendance(listType, false)} className="px-3 py-1 text-xs font-medium rounded-lg text-red-700 bg-red-100 hover:bg-red-200 transition">Mark All Absent</button>
          </div>
        </div>
        <div className="divide-y divide-gray-100">
          {list.map((item, index) => (
            <div key={item.id} className="flex items-center justify-between p-4 hover:bg-blue-50 transition">
              <div className="flex items-center space-x-4">
                <div className="w-8 h-8 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center font-bold text-sm">
                  {isStudent ? item.roll : index + 1}
                </div>
                <div>
                  <p className="font-semibold text-gray-800">{item.name}</p>
                  {isStudent && <p className="text-xs text-gray-500">Roll No: {item.roll}</p>}
                </div>
              </div>
              <AttendanceToggle
                isPresent={item.status}
                onClick={() => toggleAttendance(listType, item.id)}
                disabled={loading}
              />
            </div>
          ))}
        </div>
      </div>
    );
  };

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-extrabold text-gray-900 flex items-center">
        <Clock size={32} className="mr-3 text-blue-600" /> Daily Attendance Manager
      </h1>

      {/* Tabs */}
      <div className="flex space-x-2 border-b border-gray-300">
        <button
          onClick={() => setActiveTab('student')}
          className={`px-4 py-2 text-lg font-semibold rounded-t-lg transition-colors ${activeTab === 'student' ? 'bg-white text-blue-700 border border-b-0 border-gray-300' : 'text-gray-600 hover:text-blue-500'
            }`}
        >
          <Users className="inline h-5 w-5 mr-2" /> Student Attendance
        </button>
        <button
          onClick={() => setActiveTab('teacher')}
          className={`px-4 py-2 text-lg font-semibold rounded-t-lg transition-colors ${activeTab === 'teacher' ? 'bg-white text-blue-700 border border-b-0 border-gray-300' : 'text-gray-600 hover:text-blue-500'
            }`}
        >
          <UserSquare className="inline h-5 w-5 mr-2" /> Teacher Attendance
        </button>
      </div>

      {/* Control Panel and List */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

        {/* Controls Column */}
        <div className="lg:col-span-1 bg-white p-6 rounded-xl shadow-lg h-fit space-y-5">
          <h2 className="text-xl font-bold text-gray-800 border-b pb-3 mb-2">Filters</h2>
          {/* Date Picker */}
          <div>
            <label htmlFor="date" className="block text-sm font-medium text-gray-700 mb-1 flex items-center"><Calendar size={16} className="mr-1" /> Attendance Date</label>
            <input
              type="date"
              id="date"
              value={currentDate}
              onChange={(e) => setCurrentDate(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg shadow-sm focus:ring-blue-500 focus:border-blue-500"
              max={new Date().toISOString().substring(0, 10)}
            />
          </div>

          {/* Student Specific Filters */}
          {activeTab === 'student' && (
            <>
              <div>
                <label htmlFor="class" className="block text-sm font-medium text-gray-700 mb-1 flex items-center"><Home size={16} className="mr-1" /> Select Class</label>
                <select
                  id="class"
                  value={currentClass}
                  onChange={(e) => setCurrentClass(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg shadow-sm focus:ring-blue-500 focus:border-blue-500"
                >
                  {mockClasses.map(c => <option key={c} value={c}>{c}</option>)}
                </select>
              </div>
              <div>
                <label htmlFor="section" className="block text-sm font-medium text-gray-700 mb-1 flex items-center"><Hash size={16} className="mr-1" /> Select Section</label>
                <select
                  id="section"
                  value={currentSection}
                  onChange={(e) => setCurrentSection(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg shadow-sm focus:ring-blue-500 focus:border-blue-500"
                >
                  {mockSections.map(s => <option key={s} value={s}>{s}</option>)}
                </select>
              </div>
            </>
          )}

          {/* Teacher Specific Filter */}
          {activeTab === 'teacher' && (
            <div>
              <label htmlFor="department" className="block text-sm font-medium text-gray-700 mb-1 flex items-center"><BookOpen size={16} className="mr-1" /> Select Department</label>
              <select
                id="department"
                value={currentDepartment}
                onChange={(e) => setCurrentDepartment(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg shadow-sm focus:ring-blue-500 focus:border-blue-500"
              >
                {mockDepartments.map(d => <option key={d} value={d}>{d}</option>)}
              </select>
            </div>
          )}

          {/* Save Button */}
          <button
            onClick={handleSave}
            disabled={loading}
            className="w-full flex justify-center items-center py-3 px-4 border border-transparent rounded-lg shadow-lg text-base font-semibold text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-4 focus:ring-blue-500 focus:ring-opacity-50 transition duration-200 ease-in-out disabled:opacity-50 mt-4"
          >
            {loading ? (
              <>
                <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Saving...
              </>
            ) : (
              <>
                <Save className="h-5 w-5 mr-2" />
                Save Attendance
              </>
            )}
          </button>
        </div>

        {/* Attendance List Column */}
        <div className="lg:col-span-2 space-y-6">
          <h2 className="text-2xl font-bold text-gray-800 mb-4">
            {activeTab === 'student' ? 'Students' : 'Teachers'} Roster
          </h2>
          {renderAttendanceList(activeTab)}
        </div>
      </div>
    </div>
  );
};
// ----------------------------------------------------------------------
// Main Application Shell
// ----------------------------------------------------------------------

const Layout = () => {
  const {
    isSidebarOpen, setIsSidebarOpen,
    loading, setLoading,
    currentPage, setCurrentPage,
    message, setMessage,
    NAV_LINKS
  } = useAppContext()


  return (
    <div className="flex min-h-screen" style={{ fontFamily: 'Inter, sans-serif' }}>

      {/* Sidebar (Desktop/Fixed) */}
      <LeftSidebar />

      {/* Mobile Sidebar Backdrop */}
      {isSidebarOpen && (
        <div
          className="fixed inset-0 bg-black opacity-50 z-30 lg:hidden"
          onClick={() => setIsSidebarOpen(false)}
        />
      )}

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col bg-gray-100 transition-all duration-300 max-h-screen  ">

        {/* Header/Top Bar */}
        <header className="sticky top-0 z-20 bg-white shadow-md p-4 flex items-center justify-between lg:justify-end">

          {/* Mobile Menu Button */}
          <button className="lg:hidden p-2 text-gray-700 hover:text-blue-600" onClick={() => setIsSidebarOpen(true)}>
            <Menu size={28} />
          </button>

          <div className="hidden lg:flex flex-grow justify-start">
            <span className="text-xl font-semibold text-gray-700">
              {NAV_LINKS.find(link => link.id === currentPage)?.name}
            </span>
          </div>

          {/* User/Profile Info */}
          <div className="flex items-center space-x-3">
            <span className="text-sm font-medium text-gray-600 hidden sm:block">Admin User</span>
            <Avatar
              alt="Admin User"
              src="/static/images/avatar/1.jpg"
              sx={{ width: 45, height: 45 }}
            />

          </div>
        </header>

        {/* Scrollable Content Area */}

        <main className="flex-grow overflow-auto p-4 sm:p-8">
          {/* Global Message/Feedback Area */}
          {message && (
            <div className={`p-4 rounded-xl text-sm mb-6 shadow-md transition-opacity duration-300 ${message.includes('successfully') ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
              {message}
            </div>
          )}
          <Outlet />
        </main>

        <Footer />

      </div>
    </div>
  );
};

export default Layout;
