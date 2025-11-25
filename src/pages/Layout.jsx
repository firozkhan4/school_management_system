import React, { useState } from 'react';
import { Outlet } from 'react-router';
import { Menu } from 'lucide-react';
import Footer from '../components/Footer';
import Avatar from '@mui/material/Avatar';
import LeftSidebar from '../components/LeftSidebar.jsx';
import { useAppContext } from '../context/AppContext.jsx';


const Layout = () => {
  const {
    isSidebarOpen, setIsSidebarOpen,
    loading, setLoading,
    currentPage, setCurrentPage,
    message, setMessage,
    NAV_LINKS,
    user
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
              alt=""
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
