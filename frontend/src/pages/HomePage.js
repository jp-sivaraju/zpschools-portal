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
    <div className="min-h-screen text-white" style={{backgroundColor: 'var(--charcoal)'}}>
      <div className="gradient-mesh"></div>
      
      {/* Academic Header with School Seal */}
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
              <p className="text-xs" style={{color: 'var(--gold)'}}>Konaseema District • Est. 1947</p>
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
              <Link to="/dashboard" data-testid="nav-dashboard">
                <Button className="text-white px-6 py-2.5 rounded-lg font-semibold" style={{
                  background: 'linear-gradient(135deg, var(--crimson) 0%, var(--maroon) 100%)',
                  boxShadow: '0 4px 16px rgba(165, 28, 48, 0.3)'
                }}>Dashboard</Button>
              </Link>
            ) : (
              <Button onClick={() => setShowAuth(true)} className="text-white px-6 py-2.5 rounded-lg font-semibold" style={{
                background: 'linear-gradient(135deg, var(--crimson) 0%, var(--maroon) 100%)',
                boxShadow: '0 4px 16px rgba(165, 28, 48, 0.3)'
              }} data-testid="nav-login">Sign In</Button>
            )}
          </div>
        </nav>
      </header>

      {/* Inspirational Hero Section - Harvard/MIT Style */}
      <section className="relative overflow-hidden pt-24 pb-32">
        {/* Video/Image Background Overlay */}
        <div className="absolute inset-0 opacity-20">
          <img
            src="https://images.unsplash.com/photo-1639910232134-8cc7505c4e64?w=1920"
            alt="Campus background"
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0" style={{background: 'linear-gradient(to bottom, var(--charcoal), transparent, var(--charcoal))'}}></div>
        </div>
        
        <div className="container mx-auto px-6 relative">
          <div className="max-w-5xl mx-auto text-center space-y-12">
            <div className="fade-in-up">
              <div className="inline-flex items-center px-5 py-2 rounded-full mb-8 border" style={{
                background: 'rgba(197, 165, 114, 0.1)',
                borderColor: 'var(--gold)'
              }}>
                <span style={{color: 'var(--gold)'}} className="text-sm font-semibold">
                  🎓 Empowering 300+ Schools Since 1947
                </span>
              </div>
              
              <h1 className="text-6xl lg:text-7xl font-bold leading-[1.15] mb-8" style={{
                fontFamily: 'Libre Baskerville',
                color: 'var(--ivory)'
              }}>
                Building Tomorrow's Leaders,{' '}
                <span style={{color: 'var(--gold)'}}>Today</span>
              </h1>
              
              <p className="text-2xl leading-relaxed max-w-3xl mx-auto mb-12" style={{color: 'var(--ivory)', opacity: 0.85}}>
                Join a legacy of excellence. Connect with alumni, mentors, and educators transforming education across Konaseema District, Andhra Pradesh.
              </p>
            </div>
            
            <div className="flex flex-wrap gap-6 justify-center fade-in-up delay-200">
              <Link to="/schools" data-testid="hero-explore-btn">
                <Button className="text-white px-10 py-5 text-lg rounded-xl font-semibold shadow-2xl hover:scale-105 transition-transform" style={{
                  background: 'linear-gradient(135deg, var(--crimson) 0%, var(--maroon) 100%)'
                }}>
                  Explore Schools
                </Button>
              </Link>
              <Link to="/alumni" data-testid="hero-join-btn">
                <Button variant="outline" className="px-10 py-5 text-lg rounded-xl font-semibold backdrop-blur-sm hover:scale-105 transition-transform" style={{
                  border: '2px solid var(--gold)',
                  color: 'var(--gold)',
                  background: 'rgba(197, 165, 114, 0.1)'
                }}>
                  Join Alumni Network →
                </Button>
              </Link>
            </div>
            
            {/* Impact Stats */}
            <div className="grid md:grid-cols-3 gap-8 pt-16 fade-in-up delay-300">
              <div className="glass-card p-8 rounded-2xl">
                <p className="text-5xl font-bold impact-number mb-2">300+</p>
                <p className="text-sm font-semibold" style={{color: 'var(--ivory)', opacity: 0.7}}>SCHOOLS CONNECTED</p>
              </div>
              <div className="glass-card p-8 rounded-2xl">
                <p className="text-5xl font-bold impact-number mb-2">100K+</p>
                <p className="text-sm font-semibold" style={{color: 'var(--ivory)', opacity: 0.7}}>STUDENTS & ALUMNI</p>
              </div>
              <div className="glass-card p-8 rounded-2xl">
                <p className="text-5xl font-bold impact-number mb-2">75+</p>
                <p className="text-sm font-semibold" style={{color: 'var(--ivory)', opacity: 0.7}}>YEARS OF LEGACY</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Alumni Success Stories - Harvard Style */}
      <section className="py-32 relative">
        <div className="container mx-auto px-6">
          <div className="max-w-7xl mx-auto">
            <div className="text-center mb-20">
              <h2 className="text-5xl font-bold mb-6" style={{fontFamily: 'Libre Baskerville', color: 'var(--ivory)'}}>
                Alumni Making an <span style={{color: 'var(--gold)'}}>Impact</span>
              </h2>
              <p className="text-xl" style={{color: 'var(--ivory)', opacity: 0.7}}>
                Stories of excellence from our global community
              </p>
            </div>

            <div className="magazine-grid">
              {/* Featured Story */}
              <div className="magazine-feature">
                <div className="featured-alumni-card h-full relative rounded-2xl overflow-hidden group">
                  <img
                    src="https://images.unsplash.com/photo-1714194821788-6fd3634f01f1?w=800"
                    alt="Featured Alumni"
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/50 to-transparent"></div>
                  <div className="absolute bottom-0 left-0 right-0 p-10">
                    <div className="inline-block px-4 py-1 rounded-full mb-4" style={{background: 'var(--crimson)', color: 'white'}}>
                      <span className="text-sm font-semibold">Featured Alumni</span>
                    </div>
                    <h3 className="text-4xl font-bold mb-4" style={{fontFamily: 'Libre Baskerville', color: 'var(--ivory)'}}>
                      Dr. Ramesh Kumar
                    </h3>
                    <p className="text-lg mb-2" style={{color: 'var(--gold)'}}>
                      Class of 1995 • ZPHS Amalapuram
                    </p>
                    <p className="text-gray-300 text-lg">
                      Leading cancer research at Johns Hopkins University, published 50+ papers, mentoring 100+ students
                    </p>
                  </div>
                </div>
              </div>

              {/* Side Stories */}
              <div className="magazine-aside space-y-6">
                {[
                  { name: 'Priya Sharma', batch: '2005', role: 'CEO, Tech Startup', achievement: '$50M Series B' },
                  { name: 'Anil Reddy', batch: '1998', role: 'IAS Officer', achievement: 'Dist. Collector' }
                ].map((alumni, idx) => (
                  <div key={idx} className="glass-card p-6 rounded-2xl hover:scale-105 transition-all cursor-pointer">
                    <div className="flex items-center gap-4 mb-4">
                      <div className="w-16 h-16 rounded-full" style={{background: 'linear-gradient(135deg, var(--crimson), var(--maroon))'}}></div>
                      <div>
                        <h4 className="font-bold text-lg" style={{color: 'var(--ivory)'}}>
                          {alumni.name}
                        </h4>
                        <p className="text-sm" style={{color: 'var(--gold)'}}>Class of {alumni.batch}</p>
                      </div>
                    </div>
                    <p className="font-semibold mb-2" style={{color: 'var(--ivory)', opacity: 0.9}}>{alumni.role}</p>
                    <p className="text-sm" style={{color: 'var(--ivory)', opacity: 0.7}}>{alumni.achievement}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Testimonial Quote */}
            <div className="mt-20 max-w-4xl mx-auto">
              <div className="testimonial-quote">
                <p className="text-2xl leading-relaxed italic mb-6" style={{fontFamily: 'Crimson Text', color: 'var(--ivory)'}}>
                  "The foundation I received at ZPHS shaped my entire career. Today, I'm proud to give back and mentor the next generation of leaders from my alma mater."
                </p>
                <div className="flex items-center gap-4">
                  <div className="w-16 h-16 rounded-full" style={{background: 'linear-gradient(135deg, var(--crimson), var(--maroon))'}}></div>
                  <div>
                    <p className="font-bold" style={{color: 'var(--ivory)'}}>Dr. Ramesh Kumar</p>
                    <p className="text-sm" style={{color: 'var(--gold)'}}>Research Scientist, Johns Hopkins</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Mission & Legacy Section */}
      <section className="py-32 relative" style={{background: 'linear-gradient(180deg, transparent 0%, rgba(165, 28, 48, 0.05) 50%, transparent 100%)'}}>
        <div className="container mx-auto px-6">
          <div className="max-w-7xl mx-auto">
            <div className="grid lg:grid-cols-2 gap-20 items-center">
              <div>
                <div className="inline-block px-4 py-2 rounded-full mb-6" style={{background: 'rgba(197, 165, 114, 0.15)', border: '1px solid var(--gold)'}}>
                  <span style={{color: 'var(--gold)'}} className="text-sm font-semibold">Our Legacy</span>
                </div>
                <h2 className="text-5xl font-bold mb-8" style={{fontFamily: 'Libre Baskerville', color: 'var(--ivory)'}}>
                  75 Years of Educational Excellence
                </h2>
                <p className="text-xl leading-relaxed mb-12" style={{color: 'var(--ivory)', opacity: 0.8}}>
                  Since 1947, Zilla Parishad schools in Konaseema have been the cornerstone of quality education in rural Andhra Pradesh, nurturing generations of leaders, innovators, and change-makers.
                </p>
                
                {/* Timeline */}
                <div className="space-y-0">
                  {[
                    { year: '1947', event: 'First ZP School established in Amalapuram' },
                    { year: '1985', event: 'Expansion to 100+ schools across district' },
                    { year: '2010', event: 'Digital transformation initiative launched' },
                    { year: '2025', event: '300+ schools, 100K+ alumni network' }
                  ].map((item, idx) => (
                    <div key={idx} className="timeline-item">
                      <div className="flex items-baseline gap-6">
                        <span className="text-2xl font-bold shrink-0" style={{color: 'var(--gold)', fontFamily: 'Libre Baskerville'}}>
                          {item.year}
                        </span>
                        <p className="text-lg" style={{color: 'var(--ivory)', opacity: 0.9}}>
                          {item.event}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
              
              <div className="relative">
                <div className="glass-card p-8 rounded-3xl">
                  <h3 className="text-3xl font-bold mb-8" style={{fontFamily: 'Libre Baskerville', color: 'var(--ivory)'}}>
                    Global Alumni Reach
                  </h3>
                  <img
                    src="https://images.unsplash.com/photo-1639910232134-8cc7505c4e64?w=800"
                    alt="Global map"
                    className="w-full h-64 object-cover rounded-2xl mb-6"
                  />
                  <div className="grid grid-cols-3 gap-4">
                    {[
                      { country: 'USA', count: '2,500+' },
                      { country: 'UK', count: '800+' },
                      { country: 'UAE', count: '1,200+' },
                      { country: 'Singapore', count: '400+' },
                      { country: 'Australia', count: '600+' },
                      { country: 'India', count: '95,000+' }
                    ].map((location, idx) => (
                      <div key={idx} className="text-center p-4 rounded-xl" style={{background: 'rgba(197, 165, 114, 0.1)'}}>
                        <p className="text-2xl font-bold mb-1" style={{color: 'var(--gold)'}}>
                          {location.count}
                        </p>
                        <p className="text-sm" style={{color: 'var(--ivory)', opacity: 0.7}}>
                          {location.country}
                        </p>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Bento Grid Features Section */}
      <section className="container mx-auto px-6 py-32">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-20 fade-in-up">
            <h2 className="text-5xl font-bold mb-6">
              Everything You Need,{' '}
              <span className="text-gradient">All in One Place</span>
            </h2>
            <p className="text-xl text-gray-400 max-w-2xl mx-auto">
              A comprehensive platform designed for modern educational institutions
            </p>
          </div>

          <div className="bento-grid">
            {/* Large feature card */}
            <Link to="/schools" className="bento-item-1">
              <div className="premium-card h-full p-8 flex flex-col justify-between" data-testid="feature-card-0">
                <div>
                  <div className="badge-premium mb-6">300+ Schools</div>
                  <h3 className="text-3xl font-bold mb-4">School Directory</h3>
                  <p className="text-gray-400 text-lg mb-6">
                    Comprehensive profiles with facilities, staff, contact details, and performance metrics.
                  </p>
                </div>
                <div className="mt-auto">
                  <img
                    src="https://images.unsplash.com/flagged/photo-1574097656146-0b43b7660cb6?w=600"
                    alt="School Directory"
                    className="w-full h-64 object-cover rounded-2xl image-hover"
                  />
                </div>
              </div>
            </Link>

            {/* Alumni Network */}
            <Link to="/alumni" className="bento-item-2">
              <div className="premium-card h-full p-8" data-testid="feature-card-1">
                <img
                  src="https://images.unsplash.com/photo-1714194821788-6fd3634f01f1?w=400"
                  alt="Alumni Network"
                  className="w-full h-48 object-cover rounded-xl image-hover mb-6"
                />
                <h3 className="text-2xl font-bold mb-3">Alumni Network</h3>
                <p className="text-gray-400">Connect, collaborate, and give back to your alma mater</p>
              </div>
            </Link>

            {/* Events */}
            <Link to="/events" className="bento-item-3">
              <div className="premium-card h-full p-8" data-testid="feature-card-2">
                <img
                  src="https://images.unsplash.com/photo-1731662262743-d4ed80b88672?w=400"
                  alt="Events"
                  className="w-full h-48 object-cover rounded-xl image-hover mb-6"
                />
                <h3 className="text-2xl font-bold mb-3">Events & Programs</h3>
                <p className="text-gray-400">Stay updated with activities and cultural programs</p>
              </div>
            </Link>

            {/* Donations */}
            <Link to="/donations" className="bento-item-4">
              <div className="premium-card h-full p-6 text-center" data-testid="feature-card-3">
                <div className="text-4xl mb-4">💝</div>
                <h3 className="text-xl font-bold mb-2">Support</h3>
                <p className="text-gray-400 text-sm">Make an impact</p>
              </div>
            </Link>

            {/* Forums */}
            <Link to="/forum" className="bento-item-5">
              <div className="premium-card h-full p-6 text-center" data-testid="feature-card-4">
                <div className="text-4xl mb-4">💬</div>
                <h3 className="text-xl font-bold mb-2">Forums</h3>
                <p className="text-gray-400 text-sm">Engage & discuss</p>
              </div>
            </Link>

            {/* Admin */}
            <Link to="/admin" className="bento-item-6">
              <div className="premium-card h-full p-6 text-center" data-testid="feature-card-5">
                <div className="text-4xl mb-4">⚙️</div>
                <h3 className="text-xl font-bold mb-2">Admin Tools</h3>
                <p className="text-gray-400 text-sm">Manage & analyze</p>
              </div>
            </Link>
          </div>
        </div>
      </section>

      {/* Premium CTA Section */}
      <section className="py-32 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-blue-600/20 via-violet-600/20 to-emerald-600/20"></div>
        <div className="container mx-auto px-6 relative">
          <div className="max-w-4xl mx-auto text-center">
            <div className="fade-in-up">
              <div className="badge-premium mb-8 mx-auto">Join the Movement</div>
              <h2 className="text-6xl font-bold mb-8 leading-tight">
                Ready to Make a{' '}
                <span className="text-gradient">Difference?</span>
              </h2>
              <p className="text-2xl text-gray-400 mb-12 leading-relaxed max-w-3xl mx-auto">
                Join thousands of students, alumni, and educators working together to transform education in Konaseema.
              </p>
              <div className="flex flex-wrap gap-4 justify-center">
                <Button 
                  onClick={() => setShowAuth(true)} 
                  className="btn-premium text-white px-12 py-5 text-lg rounded-2xl" 
                  data-testid="cta-register"
                >
                  Get Started Today
                </Button>
                <Link to="/schools">
                  <Button 
                    variant="outline" 
                    className="border border-white/20 bg-white/5 text-white hover:bg-white/10 px-12 py-5 text-lg rounded-2xl backdrop-blur-sm"
                  >
                    Explore Schools
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Premium Footer */}
      <footer className="border-t border-white/10 bg-black/50 backdrop-blur-xl">
        <div className="container mx-auto px-6 py-16">
          <div className="grid md:grid-cols-4 gap-12 mb-12">
            <div>
              <div className="flex items-center space-x-3 mb-6">
                <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-violet-600 rounded-xl flex items-center justify-center">
                  <span className="text-white font-bold">ZP</span>
                </div>
                <span className="text-lg font-semibold">ZP School Portal</span>
              </div>
              <p className="text-gray-400 leading-relaxed">
                Empowering education across Konaseema District, Andhra Pradesh.
              </p>
            </div>
            <div>
              <h4 className="font-semibold mb-4 text-white">Quick Links</h4>
              <ul className="space-y-3">
                <li><Link to="/schools" className="text-gray-400 hover:text-white transition-colors">Schools</Link></li>
                <li><Link to="/alumni" className="text-gray-400 hover:text-white transition-colors">Alumni</Link></li>
                <li><Link to="/events" className="text-gray-400 hover:text-white transition-colors">Events</Link></li>
                <li><Link to="/donations" className="text-gray-400 hover:text-white transition-colors">Support</Link></li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-4 text-white">Resources</h4>
              <ul className="space-y-3">
                <li><Link to="/" className="text-gray-400 hover:text-white transition-colors">Contact Us</Link></li>
                <li><Link to="/" className="text-gray-400 hover:text-white transition-colors">Help Center</Link></li>
                <li><Link to="/" className="text-gray-400 hover:text-white transition-colors">Privacy Policy</Link></li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-4 text-white">Connect</h4>
              <p className="text-gray-400 mb-2">info@zpschools.ap.gov.in</p>
              <p className="text-gray-400">+91 12345 67890</p>
            </div>
          </div>
          <div className="premium-divider my-8"></div>
          <div className="flex flex-col md:flex-row justify-between items-center text-gray-400 text-sm">
            <p>&copy; 2025 ZP School Portal, Konaseema District. All rights reserved.</p>
            <p className="mt-4 md:mt-0">Built with ❤️ for education</p>
          </div>
        </div>
      </footer>

      {/* Premium Auth Modal */}
      <Dialog open={showAuth} onOpenChange={setShowAuth}>
        <DialogContent className="sm:max-w-md bg-black/95 border border-white/10 text-white backdrop-blur-xl" data-testid="auth-dialog">
          <DialogHeader>
            <DialogTitle className="text-2xl font-bold text-white">{isLogin ? 'Welcome Back' : 'Join Us'}</DialogTitle>
            <DialogDescription className="text-gray-400">
              {isLogin ? 'Sign in to access your account' : 'Create your account to get started'}
            </DialogDescription>
          </DialogHeader>
          <form onSubmit={handleAuth} className="space-y-5 mt-6">
            {!isLogin && (
              <div>
                <Label htmlFor="name" className="text-gray-300 mb-2 block">Full Name</Label>
                <Input
                  id="name"
                  data-testid="auth-name-input"
                  className="bg-white/5 border-white/10 text-white placeholder:text-gray-500 focus:border-blue-500"
                  value={formData.name}
                  onChange={(e) => setFormData({...formData, name: e.target.value})}
                  required={!isLogin}
                />
              </div>
            )}
            <div>
              <Label htmlFor="email" className="text-gray-300 mb-2 block">Email</Label>
              <Input
                id="email"
                type="email"
                data-testid="auth-email-input"
                className="bg-white/5 border-white/10 text-white placeholder:text-gray-500 focus:border-blue-500"
                value={formData.email}
                onChange={(e) => setFormData({...formData, email: e.target.value})}
                required
              />
            </div>
            <div>
              <Label htmlFor="password" className="text-gray-300 mb-2 block">Password</Label>
              <Input
                id="password"
                type="password"
                data-testid="auth-password-input"
                className="bg-white/5 border-white/10 text-white placeholder:text-gray-500 focus:border-blue-500"
                value={formData.password}
                onChange={(e) => setFormData({...formData, password: e.target.value})}
                required
              />
            </div>
            {!isLogin && (
              <>
                <div>
                  <Label htmlFor="phone" className="text-gray-300 mb-2 block">Phone (Optional)</Label>
                  <Input
                    id="phone"
                    data-testid="auth-phone-input"
                    className="bg-white/5 border-white/10 text-white placeholder:text-gray-500 focus:border-blue-500"
                    value={formData.phone}
                    onChange={(e) => setFormData({...formData, phone: e.target.value})}
                  />
                </div>
                <div>
                  <Label htmlFor="role" className="text-gray-300 mb-2 block">Role</Label>
                  <Select value={formData.role} onValueChange={(val) => setFormData({...formData, role: val})}>
                    <SelectTrigger data-testid="auth-role-select" className="bg-white/5 border-white/10 text-white">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent className="bg-black/95 border-white/10">
                      <SelectItem value="student" className="text-white">Student</SelectItem>
                      <SelectItem value="alumni" className="text-white">Alumni</SelectItem>
                      <SelectItem value="parent" className="text-white">Parent</SelectItem>
                      <SelectItem value="donor" className="text-white">Donor</SelectItem>
                      <SelectItem value="mentor" className="text-white">Mentor</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </>
            )}
            <Button type="submit" className="w-full btn-premium text-white py-3" data-testid="auth-submit-btn">
              {isLogin ? 'Sign In' : 'Create Account'}
            </Button>
            <p className="text-center text-sm text-gray-400 pt-2">
              {isLogin ? "Don't have an account? " : 'Already have an account? '}
              <button
                type="button"
                onClick={() => setIsLogin(!isLogin)}
                className="text-blue-400 font-medium hover:text-blue-300 transition-colors"
                data-testid="auth-toggle-btn"
              >
                {isLogin ? 'Sign Up' : 'Sign In'}
              </button>
            </p>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default HomePage;
