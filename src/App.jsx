import { BrowserRouter, Routes, Route, Navigate } from 'react-router'
import Login from './pages/Login'
import Registration from './pages/Registration'
import Layout from './pages/Layout.jsx'
import Dashboard from './pages/Dashboard'
import Home from './pages/Home.jsx'
import Attendance from './pages/Attendance.jsx'
import ClassAndSection from './pages/ClassAndSection.jsx'
import Admission from './pages/AdmissionForm.jsx'
import { useAuthContext } from './context/AuthContext.jsx'
import NotFound from './pages/NotFound.jsx'
import LoadingSpinner from './components/LoadingSpinner.jsx'


const PrivateRoute = ({ children }) => {
  const { isLoggedIn, isLoading } = useAuthContext()

  if (isLoading) {
    return (
      <LoadingSpinner />
    );
  }

  return isLoggedIn ? <>{children}</> : <Navigate to="/login" replace />
}

const AuthRoute = ({ children }) => {
  const { isLoggedIn, isLoading } = useAuthContext()

  if (isLoading) {
    return (
      <LoadingSpinner />
    );
  }


  return isLoggedIn ? <Navigate to="/app/dashboard" replace /> : <>{children}</>;
}


function App() {
  return (
    <>
      <BrowserRouter>
        <Routes>
          {/* Public routes */}
          <Route path='/' element={<Home />} />

          <Route path='/login' element={<AuthRoute><Login /></AuthRoute>} />
          <Route path='/signup' element={<AuthRoute><Registration /></AuthRoute>} />

          {/* Protected routes with layout */}
          <Route path='/app' element={<PrivateRoute><Layout /></PrivateRoute>}>
            <Route index element={<Navigate to="/app/dashboard" replace />} />
            <Route path='dashboard' element={<Dashboard />} />
            <Route path='attendance' element={<Attendance />} />
            <Route path='classes' element={<ClassAndSection />} />
            <Route path='admission' element={<Admission />} />
          </Route>

          {/* Optional: Catch-all route for 404 pages */}
          <Route path='*' element={<NotFound />} />
        </Routes>
      </BrowserRouter>   </>
  )
}

export default App
