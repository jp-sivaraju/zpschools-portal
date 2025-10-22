import React, { useState, useContext } from 'react';
import { Link } from 'react-router-dom';
import { AuthContext, API } from '../App';
import axios from 'axios';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

const HomePage = () => {
  const { user, login } = useContext(AuthContext);
  const [showAuth, setShowAuth] = useState(false);
  const [isLogin, setIsLogin] = useState(true);
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    name: '',
    phone: '',
    role: 'student'
  });

  const handleAuth = async (e) => {
    e.preventDefault();
    try {
      if (isLogin) {
        const res = await axios.post(`${API}/auth/login`, {
          email: formData.email,
          password: formData.password
        });
        login(res.data.access_token, res.data.user);
        toast.success('Login successful!');
        setShowAuth(false);
      } else {
        await axios.post(`${API}/auth/register`, formData);
        toast.success('Registration successful! Please login.');
        setIsLogin(true);
      }
    } catch (error) {
      toast.error(error.response?.data?.detail || 'Authentication failed');
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-orange-50">
      {/* Header */}
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
              <Link to="/dashboard" data-testid="nav-dashboard">
                <Button className="btn-primary bg-blue-600 hover:bg-blue-700">Dashboard</Button>
              </Link>
            ) : (
              <Button onClick={() => setShowAuth(true)} className="btn-primary bg-blue-600 hover:bg-blue-700" data-testid="nav-login">Login</Button>
            )}
          </div>
        </nav>
      </header>

      {/* Hero Section */}
      <section className="container mx-auto px-4 py-20">
        <div className="grid md:grid-cols-2 gap-12 items-center">
          <div className="fade-in">
            <h1 className="text-5xl md:text-6xl font-bold text-gray-900 mb-6 leading-tight">
              Empowering <span className="text-blue-600">300+ Schools</span> in Konaseema
            </h1>
            <p className="text-lg text-gray-600 mb-8 leading-relaxed">
              Connecting students, alumni, and educators across Zilla Parishad schools in Andhra Pradesh. Together, we build a brighter future.
            </p>
            <div className="flex space-x-4">
              <Link to="/schools" data-testid="hero-explore-btn">
                <Button className="btn-primary bg-blue-600 hover:bg-blue-700 text-white px-8 py-6 text-lg rounded-full">
                  Explore Schools
                </Button>
              </Link>
              <Link to="/alumni" data-testid="hero-join-btn">
                <Button variant="outline" className="border-2 border-blue-600 text-blue-600 hover:bg-blue-50 px-8 py-6 text-lg rounded-full">
                  Join Alumni Network
                </Button>
              </Link>
            </div>
          </div>
          <div className="relative">
            <img
              src="https://images.unsplash.com/photo-1639910232134-8cc7505c4e64?w=800"
              alt="Indian government school building"
              className="rounded-3xl shadow-2xl card-hover w-full h-[400px] object-cover"
            />
            <div className="absolute -bottom-6 -left-6 bg-white p-6 rounded-2xl shadow-xl">
              <p className="text-4xl font-bold text-blue-600">300+</p>
              <p className="text-gray-600 font-medium">Schools Connected</p>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="bg-gradient-to-r from-blue-600 to-orange-500 py-16">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-4 gap-8 text-center text-white">
            <div className="fade-in">
              <p className="text-5xl font-bold mb-2">300+</p>
              <p className="text-blue-100">ZP Schools</p>
            </div>
            <div className="fade-in">
              <p className="text-5xl font-bold mb-2">100K+</p>
              <p className="text-blue-100">Students & Alumni</p>
            </div>
            <div className="fade-in">
              <p className="text-5xl font-bold mb-2">22</p>
              <p className="text-blue-100">Mandals</p>
            </div>
            <div className="fade-in">
              <p className="text-5xl font-bold mb-2">44</p>
              <p className="text-blue-100">MEO Officers</p>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="container mx-auto px-4 py-20">
        <h2 className="text-4xl font-bold text-center text-gray-900 mb-16">Portal Features</h2>
        <div className="grid md:grid-cols-3 gap-8">
          {[
            {
              title: 'School Directory',
              description: 'Browse 300+ schools with detailed information, facilities, staff, and contact details.',
              image: 'https://images.unsplash.com/flagged/photo-1574097656146-0b43b7660cb6?w=400',
              link: '/schools'
            },
            {
              title: 'Alumni Network',
              description: 'Connect with alumni, participate in forums, mentoring programs, and support your school.',
              image: 'https://images.unsplash.com/photo-1714194821788-6fd3634f01f1?w=400',
              link: '/alumni'
            },
            {
              title: 'Events & Programs',
              description: 'Stay updated with school events, cultural activities, and educational programs.',
              image: 'https://images.unsplash.com/photo-1731662262743-d4ed80b88672?w=400',
              link: '/events'
            },
            {
              title: 'Donation Portal',
              description: 'Support schools with financial contributions for infrastructure and educational needs.',
              image: 'https://images.unsplash.com/photo-1629273229664-11fabc0becc0?w=400',
              link: '/donations'
            },
            {
              title: 'Discussion Forums',
              description: 'Engage in meaningful discussions, share experiences, and collaborate with peers.',
              image: 'https://images.unsplash.com/photo-1572847748080-bac263fae977?w=400',
              link: '/forum'
            },
            {
              title: 'Admin Dashboard',
              description: 'Comprehensive management tools for administrators and MEO officers.',
              image: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=400',
              link: '/admin'
            }
          ].map((feature, idx) => (
            <Link to={feature.link} key={idx}>
              <div className="card-hover bg-white rounded-2xl overflow-hidden shadow-lg" data-testid={`feature-card-${idx}`}>
                <img src={feature.image} alt={feature.title} className="w-full h-48 object-cover" />
                <div className="p-6">
                  <h3 className="text-xl font-bold text-gray-900 mb-2">{feature.title}</h3>
                  <p className="text-gray-600">{feature.description}</p>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* CTA Section */}
      <section className="bg-gradient-to-br from-blue-600 to-blue-800 py-20">
        <div className="container mx-auto px-4 text-center text-white">
          <h2 className="text-4xl font-bold mb-6">Ready to Make a Difference?</h2>
          <p className="text-xl text-blue-100 mb-8 max-w-2xl mx-auto">
            Join thousands of students, alumni, and educators working together to transform education in Konaseema.
          </p>
          <Button onClick={() => setShowAuth(true)} className="btn-primary bg-white text-blue-600 hover:bg-gray-100 px-10 py-6 text-lg rounded-full" data-testid="cta-register">Get Started Today</Button>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-12">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-4 gap-8">
            <div>
              <h3 className="text-xl font-bold mb-4">ZP School Portal</h3>
              <p className="text-gray-400">Empowering education across Konaseema District, Andhra Pradesh.</p>
            </div>
            <div>
              <h4 className="font-bold mb-4">Quick Links</h4>
              <ul className="space-y-2 text-gray-400">
                <li><Link to="/schools" className="hover:text-white">Schools</Link></li>
                <li><Link to="/alumni" className="hover:text-white">Alumni</Link></li>
                <li><Link to="/events" className="hover:text-white">Events</Link></li>
                <li><Link to="/donations" className="hover:text-white">Donate</Link></li>
              </ul>
            </div>
            <div>
              <h4 className="font-bold mb-4">Support</h4>
              <ul className="space-y-2 text-gray-400">
                <li><Link to="/" className="hover:text-white">Contact Us</Link></li>
                <li><Link to="/" className="hover:text-white">Help Center</Link></li>
                <li><Link to="/" className="hover:text-white">Privacy Policy</Link></li>
              </ul>
            </div>
            <div>
              <h4 className="font-bold mb-4">Connect</h4>
              <p className="text-gray-400">Email: info@zpschools.ap.gov.in</p>
              <p className="text-gray-400 mt-2">Phone: +91 12345 67890</p>
            </div>
          </div>
          <div className="border-t border-gray-800 mt-8 pt-8 text-center text-gray-400">
            <p>&copy; 2025 ZP School Portal, Konaseema District. All rights reserved.</p>
          </div>
        </div>
      </footer>

      {/* Auth Modal */}
      <Dialog open={showAuth} onOpenChange={setShowAuth}>
        <DialogContent className="sm:max-w-md" data-testid="auth-dialog">
          <DialogHeader>
            <DialogTitle>{isLogin ? 'Login' : 'Register'}</DialogTitle>
            <DialogDescription>
              {isLogin ? 'Welcome back! Login to access your account.' : 'Create an account to get started.'}
            </DialogDescription>
          </DialogHeader>
          <form onSubmit={handleAuth} className="space-y-4">
            {!isLogin && (
              <div>
                <Label htmlFor="name">Full Name</Label>
                <Input
                  id="name"
                  data-testid="auth-name-input"
                  value={formData.name}
                  onChange={(e) => setFormData({...formData, name: e.target.value})}
                  required={!isLogin}
                />
              </div>
            )}
            <div>
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                data-testid="auth-email-input"
                value={formData.email}
                onChange={(e) => setFormData({...formData, email: e.target.value})}
                required
              />
            </div>
            <div>
              <Label htmlFor="password">Password</Label>
              <Input
                id="password"
                type="password"
                data-testid="auth-password-input"
                value={formData.password}
                onChange={(e) => setFormData({...formData, password: e.target.value})}
                required
              />
            </div>
            {!isLogin && (
              <>
                <div>
                  <Label htmlFor="phone">Phone (Optional)</Label>
                  <Input
                    id="phone"
                    data-testid="auth-phone-input"
                    value={formData.phone}
                    onChange={(e) => setFormData({...formData, phone: e.target.value})}
                  />
                </div>
                <div>
                  <Label htmlFor="role">Role</Label>
                  <Select value={formData.role} onValueChange={(val) => setFormData({...formData, role: val})}>
                    <SelectTrigger data-testid="auth-role-select">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="student">Student</SelectItem>
                      <SelectItem value="alumni">Alumni</SelectItem>
                      <SelectItem value="parent">Parent</SelectItem>
                      <SelectItem value="donor">Donor</SelectItem>
                      <SelectItem value="mentor">Mentor</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </>
            )}
            <Button type="submit" className="w-full bg-blue-600 hover:bg-blue-700" data-testid="auth-submit-btn">
              {isLogin ? 'Login' : 'Register'}
            </Button>
            <p className="text-center text-sm text-gray-600">
              {isLogin ? "Don't have an account? " : 'Already have an account? '}
              <button
                type="button"
                onClick={() => setIsLogin(!isLogin)}
                className="text-blue-600 font-medium hover:underline"
                data-testid="auth-toggle-btn"
              >
                {isLogin ? 'Register' : 'Login'}
              </button>
            </p>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default HomePage;
