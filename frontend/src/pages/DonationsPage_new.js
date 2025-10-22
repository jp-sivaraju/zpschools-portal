import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { API } from '../App';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import NavBar from '../components/NavBar';
import { toast } from 'sonner';

const DonationsPage = () => {
  const [donations, setDonations] = useState([]);
  const [schools, setSchools] = useState([]);
  const [showDonateModal, setShowDonateModal] = useState(false);
  const [formData, setFormData] = useState({
    donor_name: '',
    donor_email: '',
    amount: '',
    school_id: '',
    purpose: ''
  });

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const [donationsRes, schoolsRes] = await Promise.all([
        axios.get(`${API}/donations`),
        axios.get(`${API}/schools`)
      ]);
      setDonations(donationsRes.data);
      setSchools(schoolsRes.data);
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  };

  const handleDonate = async (e) => {
    e.preventDefault();
    try {
      await axios.post(`${API}/donations`, {
        ...formData,
        amount: parseFloat(formData.amount)
      });
      toast.success('Thank you for your generous contribution!');
      setShowDonateModal(false);
      setFormData({ donor_name: '', donor_email: '', amount: '', school_id: '', purpose: '' });
      fetchData();
    } catch (error) {
      toast.error('Error processing donation');
    }
  };

  const totalDonations = donations.reduce((sum, d) => sum + d.amount, 0);

  return (
    <div className="min-h-screen" style={{backgroundColor: 'var(--charcoal)'}}>
      <div className="gradient-mesh"></div>
      <NavBar />
      
      <div className="container mx-auto px-6 py-16 relative">
        <div className="max-w-7xl mx-auto">
          {/* Hero Section */}
          <div className="glass-card rounded-3xl p-16 mb-16 relative overflow-hidden text-center">
            <div className="absolute inset-0 opacity-10" style={{background: 'linear-gradient(135deg, var(--crimson), var(--maroon)'}}></div>
            <div className="relative">
              <div className="inline-block px-4 py-2 rounded-full mb-6" style={{
                background: 'rgba(197, 165, 114, 0.15)',
                border: '1px solid var(--gold)'
              }}>
                <span style={{color: 'var(--gold)'}} className="text-sm font-semibold">
                  💝 Make an Impact
                </span>
              </div>
              <h1 className="text-6xl font-bold mb-6" style={{fontFamily: 'Libre Baskerville', color: 'var(--ivory)'}}>
                Give Back to Your <span style={{color: 'var(--gold)'}}>Alma Mater</span>
              </h1>
              <p className="text-2xl mb-10 max-w-3xl mx-auto" style={{color: 'var(--ivory)', opacity: 0.8}}>
                Your contribution transforms lives and builds futures for thousands of students across Konaseema
              </p>
              <Button
                onClick={() => setShowDonateModal(true)}
                className="text-white px-12 py-6 text-xl rounded-xl font-semibold shadow-2xl hover:scale-105 transition-transform"
                style={{background: 'linear-gradient(135deg, var(--crimson), var(--maroon))'}}
                data-testid="donate-now-btn"
              >
                Donate Now
              </Button>
            </div>
          </div>

          {/* Impact Stats */}
          <div className="grid md:grid-cols-3 gap-8 mb-20">
            <div className="glass-card p-10 rounded-3xl text-center hover:scale-105 transition-all">
              <div className="text-5xl mb-4">💰</div>
              <p className="text-5xl font-bold mb-3 impact-number" data-testid="total-donations">₹{totalDonations.toLocaleString()}</p>
              <p className="text-sm font-semibold" style={{color: 'var(--ivory)', opacity: 0.7}}>TOTAL CONTRIBUTIONS</p>
            </div>
            <div className="glass-card p-10 rounded-3xl text-center hover:scale-105 transition-all">
              <div className="text-5xl mb-4">🤝</div>
              <p className="text-5xl font-bold mb-3 impact-number" data-testid="donor-count">{donations.length}</p>
              <p className="text-sm font-semibold" style={{color: 'var(--ivory)', opacity: 0.7}}>GENEROUS DONORS</p>
            </div>
            <div className="glass-card p-10 rounded-3xl text-center hover:scale-105 transition-all">
              <div className="text-5xl mb-4">🏫</div>
              <p className="text-5xl font-bold mb-3 impact-number" data-testid="schools-supported">
                {new Set(donations.filter(d => d.school_id).map(d => d.school_id)).size}
              </p>
              <p className="text-sm font-semibold" style={{color: 'var(--ivory)', opacity: 0.7}}>SCHOOLS SUPPORTED</p>
            </div>
          </div>

          {/* Recent Donations */}
          <div className="glass-card p-12 rounded-3xl">
            <h2 className="text-3xl font-bold mb-8" style={{fontFamily: 'Libre Baskerville', color: 'var(--ivory)'}}>Recent Contributors</h2>
            {donations.length > 0 ? (
              <div className="space-y-4">
                {donations.slice(0, 10).map((donation) => (
                  <div key={donation.id} className="leaderboard-item" data-testid={`donation-${donation.id}`}>
                    <div className="w-12 h-12 rounded-full flex items-center justify-center mr-4" style={{background: 'linear-gradient(135deg, var(--crimson), var(--maroon))'}}>
                      <span className="text-white text-xl">💝</span>
                    </div>
                    <div className="flex-1">
                      <p className="font-bold" style={{color: 'var(--ivory)'}}>{donation.donor_name}</p>
                      <p className="text-sm" style={{color: 'var(--ivory)', opacity: 0.7}}>{donation.purpose || 'General Support'}</p>
                    </div>
                    <div className="text-right">
                      <p className="text-2xl font-bold" style={{color: 'var(--gold)'}}>₹{donation.amount.toLocaleString()}</p>
                      <p className="text-xs" style={{color: 'var(--ivory)', opacity: 0.6}}>{new Date(donation.created_at).toLocaleDateString()}</p>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-center py-8" style={{color: 'var(--ivory)', opacity: 0.7}}>Be the first to contribute!</p>
            )}
          </div>
        </div>
      </div>

      {/* Donation Modal */}
      <Dialog open={showDonateModal} onOpenChange={setShowDonateModal}>
        <DialogContent className="sm:max-w-md bg-black/95 border border-white/10 text-white backdrop-blur-xl" data-testid="donate-dialog">
          <DialogHeader>
            <DialogTitle className="text-2xl font-bold" style={{fontFamily: 'Libre Baskerville'}}>Make a Contribution</DialogTitle>
            <DialogDescription className="text-gray-400">Support education in Konaseema District</DialogDescription>
          </DialogHeader>
          <form onSubmit={handleDonate} className="space-y-5 mt-6">
            <div>
              <Label htmlFor="donor_name" className="text-gray-300 mb-2 block">Your Name</Label>
              <Input
                id="donor_name"
                data-testid="donor-name-input"
                className="bg-white/5 border-white/10 text-white"
                value={formData.donor_name}
                onChange={(e) => setFormData({...formData, donor_name: e.target.value})}
                required
              />
            </div>
            <div>
              <Label htmlFor="donor_email" className="text-gray-300 mb-2 block">Email</Label>
              <Input
                id="donor_email"
                type="email"
                data-testid="donor-email-input"
                className="bg-white/5 border-white/10 text-white"
                value={formData.donor_email}
                onChange={(e) => setFormData({...formData, donor_email: e.target.value})}
                required
              />
            </div>
            <div>
              <Label htmlFor="amount" className="text-gray-300 mb-2 block">Amount (₹)</Label>
              <Input
                id="amount"
                type="number"
                min="1"
                data-testid="donation-amount-input"
                className="bg-white/5 border-white/10 text-white"
                value={formData.amount}
                onChange={(e) => setFormData({...formData, amount: e.target.value})}
                required
              />
            </div>
            <Button type="submit" className="w-full py-3 text-white rounded-xl font-semibold" style={{
              background: 'linear-gradient(135deg, var(--crimson), var(--maroon))'
            }} data-testid="submit-donation-btn">
              Donate ₹{formData.amount || '0'}
            </Button>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default DonationsPage;
