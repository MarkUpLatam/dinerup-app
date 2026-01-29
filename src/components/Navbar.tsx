import { Building2, LogOut, User } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import logo from '../images/LogoDinerUp.png';

export default function Navbar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  if (!user) return null;

  return (
    <nav className="bg-white border-b border-gray-200 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center space-x-3">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-white/20  rounded-2xl mb-4  overflow-hidden">
                <img 
                  src={logo} 
                  alt="DinerUp Logo" 
                  className="w-10 h-10 object-contain"
                />
              </div>
            <div>
              <h1 className="text-xl font-bold text-gray-800">DinerUp</h1>
              <p className="text-xs text-gray-500">by MarkUp</p>
            </div>
          </div>

          <div className="flex items-center space-x-4">

            <button
              onClick={handleLogout}
              className="flex items-center space-x-2 px-4 py-2 text-gray-700 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <LogOut className="w-5 h-5" />
              <span className="font-medium">Salir</span>
            </button>
          </div>
        </div>
      </div>
    </nav>
  );
}
