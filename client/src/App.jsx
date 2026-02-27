import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import Navbar from './components/layout/Navbar';
import Landing from './pages/Landing';
import Login from './pages/Login';
import Signup from './pages/Signup';
import Dashboard from './pages/Dashboard';
import Gallery from './pages/Gallery';
import CraftDetail from './pages/CraftDetail';
import Profile from './pages/Profile';
import CreateCraft from './pages/CreateCraft';

const ProtectedRoute = ({ children }) => {
    const { isAuthenticated, loading } = useAuth();
    if (loading) return (
        <div className="min-h-screen flex items-center justify-center bg-cream-50">
            <div className="animate-pulse text-charcoal-700 text-xl tracking-wider">CRAFTELIER</div>
        </div>
    );
    return isAuthenticated ? children : <Navigate to="/login" />;
};

const PublicRoute = ({ children }) => {
    const { isAuthenticated, loading } = useAuth();
    if (loading) return (
        <div className="min-h-screen flex items-center justify-center bg-cream-50">
            <div className="animate-pulse text-charcoal-700 text-xl tracking-wider">CRAFTELIER</div>
        </div>
    );
    return isAuthenticated ? <Navigate to="/dashboard" /> : children;
};

function AppRoutes() {
    const { isAuthenticated } = useAuth();

    return (
        <>
            {isAuthenticated && <Navbar />}
            <Routes>
                <Route path="/" element={
                    <PublicRoute><Landing /></PublicRoute>
                } />
                <Route path="/login" element={
                    <PublicRoute><Login /></PublicRoute>
                } />
                <Route path="/signup" element={
                    <PublicRoute><Signup /></PublicRoute>
                } />
                <Route path="/dashboard" element={
                    <ProtectedRoute><Dashboard /></ProtectedRoute>
                } />
                <Route path="/gallery/:id" element={
                    <ProtectedRoute><Gallery /></ProtectedRoute>
                } />
                <Route path="/craft/:id" element={
                    <ProtectedRoute><CraftDetail /></ProtectedRoute>
                } />
                <Route path="/profile" element={
                    <ProtectedRoute><Profile /></ProtectedRoute>
                } />
                <Route path="/create" element={
                    <ProtectedRoute><CreateCraft /></ProtectedRoute>
                } />
                <Route path="*" element={<Navigate to="/" />} />
            </Routes>
        </>
    );
}

function App() {
    return (
        <Router>
            <AuthProvider>
                <AppRoutes />
            </AuthProvider>
        </Router>
    );
}

export default App;
