import { useAppContext } from "../context/AppContext";
import { Users, UserSquare, Clock, BookOpen, Trello, X, Settings, LogOut, GraduationCap } from 'lucide-react';
import { Link } from 'react-router'
import LogoutButton from "./ui/LogoutButton";



const LeftSidebar = () => {
  const {
    isSidebarOpen,
    setIsSidebarOpen,
    currentPage,
    setCurrentPage,
    setMessage,
    NAV_LINKS
  } = useAppContext();

  return (
    <>
      {/* Mobile Sidebar Backdrop */}
      {isSidebarOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-30 lg:hidden"
          onClick={() => setIsSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <div
        className={`fixed lg:static top-0 left-0 h-screen w-64 text-white flex flex-col z-40 transition-transform duration-300 ease-in-out lg:translate-x-0 ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'
          }`}
        style={{ background: 'linear-gradient(to bottom, #1e40af 0%, #1e3a8a 100%)' }}
      >
        {/* Sidebar Header/Logo */}
        <div className="flex items-center justify-between p-6 bg-blue-900 shadow-xl border-b border-blue-700">
          <Link to={"/"} className="text-2xl font-extrabold tracking-wider flex items-center">
            <BookOpen size={28} className="mr-2 text-yellow-300" />
            SchoolHub
          </Link>
          <button
            className="lg:hidden text-white hover:text-yellow-300"
            onClick={() => setIsSidebarOpen(false)}
          >
            <X size={24} />
          </button>
        </div>

        {/* Navigation Links */}
        <nav className="flex-grow p-4 space-y-2 overflow-y-auto">
          {NAV_LINKS.map(link => {
            const isActive = currentPage === link.id;
            const IconComponent = link.icon;

            return (
              <Link
                to={link.link}
                key={link.id}
                onClick={() => {
                  setCurrentPage(link.id);
                  setIsSidebarOpen(false);
                  setMessage('');
                }}
                className={`w-full flex items-center space-x-3 px-4 py-3 rounded-xl font-medium transition-colors duration-150 text-left ${isActive
                  ? 'bg-blue-700 text-yellow-300 border-l-4 border-yellow-300 shadow-inner'
                  : 'hover:bg-blue-700 text-blue-100'
                  }`}
              >
                <IconComponent size={20} />
                <span>{link.name}</span>
              </Link>
            );
          })}
        </nav>

        {/* Footer/Settings */}
        <div className="p-4 border-t border-blue-700 space-y-2">
          <button className="w-full flex items-center space-x-3 px-4 py-2 rounded-lg text-blue-100 hover:bg-blue-700 transition">
            <Settings size={20} />
            <span>Settings</span>
          </button>
          <LogoutButton />
          {/* <button className="w-full flex items-center space-x-3 px-4 py-2 rounded-lg text-red-300 hover:bg-red-700 hover:text-white transition"> */}
          {/*   <LogOut size={20} /> */}
          {/*   <span>Logout</span> */}
          {/* </button> */}
        </div>
      </div>
    </>
  );
};

export default LeftSidebar;
