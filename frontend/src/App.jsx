import { Routes, Route, Navigate } from 'react-router-dom';
import { useAuth, AuthProvider } from './utils/auth';
import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';
import AdminPanel from './pages/Admin'; // Новый файл
import InfoPage from './pages/InfoPage';
function PrivateRoute({ children, adminOnly = false }) {
  const { token, user } = useAuth();
  
  if (!token) return <Navigate to="/login" />;
  
  // Если страница только для админа, а в токене не email админа — на выход
  if (adminOnly && user?.sub !== 'admin@qazzerep.kz') {
    return <Navigate to="/" />;
  }
  
  return children;
}

export default function App() {
  return (
    <AuthProvider>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        {/* Юзерский дешборд */}
        <Route path="/:slug" element={<InfoPage />} />
        <Route path="/" element={
          <PrivateRoute><Dashboard /></PrivateRoute>
        } />
        {/* Админка на отдельном эндпоинте */}
        <Route path="/admin" element={
          <PrivateRoute adminOnly={true}><AdminPanel /></PrivateRoute>
        } />
      </Routes>
    </AuthProvider>
  );
}
