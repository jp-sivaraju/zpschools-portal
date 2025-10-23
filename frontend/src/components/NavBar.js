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
    <header className="glass-card sticky-nav top-0 z-50 border-b" style={{borderColor: 'rgba(197, 165, 114, 0.15)'}}>
      <nav className="container mx-auto px-6 py-5 flex justify-between items-center">
        <Link to="/" className="flex items-center space-x-4">
          <div className="w-14 h-14 rounded-full flex items-center justify-center border-2 shadow-xl" style={{
            background: 'linear-gradient(135deg, var(--crimson) 0%, var(--maroon) 100%)',
            borderColor: 'var(--gold)'
          }}>
            <span className="text-white font-bold text-xl" style={{fontFamily: 'Libre Baskerville'}}>ZP</span>
          </div>
          <div>
            <h1 className="text-lg font-bold tracking-tight" style={{color: 'var(--ivory)', fontFamily: 'Libre Baskerville'}}>
              Zilla Parishad Schools
            </h1>
            <p className="text-xs" style={{color: 'var(--gold)'}}>Konaseema District • Est. 2022</p>
          </div>
        </Link>
        <div className="flex items-center space-x-8">
          <Link to="/schools" className="font-medium transition-all hover:translate-y-[-1px]" style={{color: 'var(--ivory)'}} data-testid="nav-schools">
            Schools
          </Link>
          <Link to="/alumni" className="font-medium transition-all hover:translate-y-[-1px]" style={{color: 'var(--ivory)'}} data-testid="nav-alumni">
            Alumni
          </Link>
          <Link to="/events" className="font-medium transition-all hover:translate-y-[-1px]" style={{color: 'var(--ivory)'}} data-testid="nav-events">
            Events
          </Link>
          <Link to="/donations" className="font-medium transition-all hover:translate-y-[-1px]" style={{color: 'var(--gold)'}} data-testid="nav-donate">
            Give Back
          </Link>
          {user ? (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button className="text-white px-6 py-2.5 rounded-lg font-semibold" style={{
                  background: 'linear-gradient(135deg, var(--crimson) 0%, var(--maroon) 100%)',
                  boxShadow: '0 4px 16px rgba(165, 28, 48, 0.3)'
                }} data-testid="nav-user-menu">
                  {user.name}
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="bg-black/95 border-white/10 backdrop-blur-xl">
                <DropdownMenuItem onClick={() => navigate('/dashboard')} className="text-white" data-testid="menu-dashboard">Dashboard</DropdownMenuItem>
                <DropdownMenuItem onClick={() => navigate('/profile')} className="text-white" data-testid="menu-profile">Profile</DropdownMenuItem>
                {(user.role === 'admin' || user.role === 'meo') && (
                  <DropdownMenuItem onClick={() => navigate('/admin')} className="text-white" data-testid="menu-admin">Admin</DropdownMenuItem>
                )}
                <DropdownMenuItem onClick={handleLogout} className="text-white" data-testid="menu-logout">Logout</DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          ) : (
            <Link to="/" data-testid="nav-login">
              <Button className="text-white px-6 py-2.5 rounded-lg font-semibold" style={{
                background: 'linear-gradient(135deg, var(--crimson) 0%, var(--maroon) 100%)',
                boxShadow: '0 4px 16px rgba(165, 28, 48, 0.3)'
              }}>Sign In</Button>
            </Link>
          )}
        </div>
      </nav>
    </header>
  );
};

export default NavBar;
