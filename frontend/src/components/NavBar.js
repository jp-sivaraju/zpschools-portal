import React, { useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { AuthContext } from '../App';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { toast } from 'sonner';

const NavBar = () => {
  const { user, logout } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    toast.success('Logged out successfully');
    navigate('/');
  };

  return (
    <header className="glass-card sticky top-0 z-50 border-b border-gray-200">
      <nav className="container mx-auto px-4 py-4 flex justify-between items-center">
        <Link to="/" className="flex items-center space-x-3">
          <div className="w-12 h-12 bg-gradient-to-br from-blue-600 to-orange-500 rounded-full flex items-center justify-center">
            <span className="text-white font-bold text-xl">ZP</span>
          </div>
          <div>
            <h1 className="text-xl font-bold text-gray-900">ZP School Portal</h1>
            <p className="text-xs text-gray-600">Konaseema District, AP</p>
          </div>
        </Link>
        <div className="flex items-center space-x-4">
          <Link to="/schools" className="text-gray-700 hover:text-blue-600 font-medium transition-colors" data-testid="nav-schools">Schools</Link>
          <Link to="/alumni" className="text-gray-700 hover:text-blue-600 font-medium transition-colors" data-testid="nav-alumni">Alumni</Link>
          <Link to="/events" className="text-gray-700 hover:text-blue-600 font-medium transition-colors" data-testid="nav-events">Events</Link>
          <Link to="/donations" className="text-gray-700 hover:text-blue-600 font-medium transition-colors" data-testid="nav-donate">Donate</Link>
          {user ? (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button className="bg-blue-600 hover:bg-blue-700" data-testid="nav-user-menu">
                  {user.name}
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem onClick={() => navigate('/dashboard')} data-testid="menu-dashboard">Dashboard</DropdownMenuItem>
                <DropdownMenuItem onClick={() => navigate('/profile')} data-testid="menu-profile">Profile</DropdownMenuItem>
                {(user.role === 'admin' || user.role === 'meo') && (
                  <DropdownMenuItem onClick={() => navigate('/admin')} data-testid="menu-admin">Admin</DropdownMenuItem>
                )}
                <DropdownMenuItem onClick={handleLogout} data-testid="menu-logout">Logout</DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          ) : (
            <Link to="/" data-testid="nav-login">
              <Button className="bg-blue-600 hover:bg-blue-700">Login</Button>
            </Link>
          )}
        </div>
      </nav>
    </header>
  );
};

export default NavBar;
