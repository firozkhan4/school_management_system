import { BookOpen, Clock, GraduationCap, Trello, User, Users, UserSquare } from 'lucide-react';
import { createContext, useContext, useState } from 'react';

// Create context
const AppContext = createContext();

const NAV_LINKS = [
  { id: 'dashboard', name: 'Dashboard', icon: Trello, link: 'dashboard' },
  { id: 'attendance', name: 'Attendance', icon: Clock, link: 'attendance' },
  { id: 'classes', name: 'Classes & Sections', icon: BookOpen, link: 'classes' },
  { id: 'students', name: 'Manage Students', icon: Users, link: 'students' },
  { id: 'teachers', name: 'Manage Teachers', icon: UserSquare, link: 'teachers' },
  { id: 'admission', name: 'Admission', icon: GraduationCap, link: 'admission' },
];



// Context provider component
export const AppProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [theme, setTheme] = useState('light');
  const [loading, setLoading] = useState(false);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [message, setMessage] = useState(''); // Global Message/Success
  const [currentPage, setCurrentPage] = useState('dashboard');
  const [isLoggedIn, setIsLoggedIn] = useState(() => {
    const token = localStorage.getItem("token");
    return !!token;
  })

  // Values to be shared
  const value = {
    NAV_LINKS,
    user, setUser,
    theme, setTheme,
    loading, setLoading,
    isSidebarOpen, setIsSidebarOpen,
    message, setMessage,
    currentPage, setCurrentPage,
    isLoggedIn, setIsLoggedIn
  };

  return (
    <AppContext.Provider value={value}>
      {children}
    </AppContext.Provider>
  );
};

// Custom hook to use context
export const useAppContext = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useAppContext must be used within AppProvider');
  }
  return context;
};
