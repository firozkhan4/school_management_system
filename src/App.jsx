import { BrowserRouter, Routes, Route, Navigate } from 'react-router'
import Login from './pages/Login'
import Registration from './pages/Registration'
import Layout from './pages/Layout.jsx'
import Dashboard from './pages/Dashboard'
import Attendance from './pages/Attendance.jsx'
import ClassAndSection from './pages/ClassAndSection.jsx'
import Admission from './pages/AdmissionForm.jsx'
import { useAuthContext } from './context/AuthContext.jsx'
import NotFound from './pages/NotFound.jsx'


const PrivateRoute = ({ children }) => {
  const { isLoggedIn, isLoading } = useAuthContext()

  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return isLoggedIn ? <>{children}</> : <Navigate to="/login" replace />
}


function App() {
  return (
    <>
      <BrowserRouter>
        <Routes>
          {/* Layout as parent route with nested routes */}

          <Route path="/" element={<PrivateRoute><Layout /></PrivateRoute>}>
            <Route index element={<Navigate to="/dashboard" replace />} />
            <Route path='dashboard' element={<Dashboard />} />
            <Route path='attendance' element={<Attendance />} />
            <Route path='classes' element={<ClassAndSection />} />
            <Route path='admission' element={<Admission />} />
          </Route>

          <Route path='/login' element={<Login />} />
          <Route path='/signup' element={<Registration />} />

          {/* Optional: Catch-all route for 404 pages */}
          <Route path='*' element={<NotFound />} />

        </Routes>

      </BrowserRouter>
    </>
  )
}

export default App
