import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { API } from '../App';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
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
      toast.success('Donation successful! Thank you for your contribution.');
      setShowDonateModal(false);
      setFormData({ donor_name: '', donor_email: '', amount: '', school_id: '', purpose: '' });
      fetchData();
    } catch (error) {
      toast.error('Error processing donation');
    }
  };

  const totalDonations = donations.reduce((sum, d) => sum + d.amount, 0);

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-orange-50">
      <NavBar />
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-6xl mx-auto">
          {/* Hero */}
          <div className="bg-gradient-to-r from-blue-600 to-orange-500 rounded-3xl p-12 text-white mb-8">
            <h1 className="text-5xl font-bold mb-4">Support Our Schools</h1>
            <p className="text-blue-100 text-lg mb-6">Your contribution makes a difference in the lives of thousands of students</p>
            <Button
              onClick={() => setShowDonateModal(true)}
              className="bg-white text-blue-600 hover:bg-gray-100 px-8 py-6 text-lg rounded-full"
              data-testid="donate-now-btn"
            >
              Donate Now
            </Button>
          </div>

          {/* Stats */}
          <div className="grid md:grid-cols-3 gap-6 mb-8">
            <Card className="card-hover">
              <CardHeader>
                <CardTitle className="text-sm text-gray-600">Total Donations</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-4xl font-bold text-blue-600" data-testid="total-donations">₹{totalDonations.toLocaleString()}</p>
              </CardContent>
            </Card>
            <Card className="card-hover">
              <CardHeader>
                <CardTitle className="text-sm text-gray-600">Number of Donors</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-4xl font-bold text-green-600" data-testid="donor-count">{donations.length}</p>
              </CardContent>
            </Card>
            <Card className="card-hover">
              <CardHeader>
                <CardTitle className="text-sm text-gray-600">Schools Supported</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-4xl font-bold text-orange-600" data-testid="schools-supported">
                  {new Set(donations.filter(d => d.school_id).map(d => d.school_id)).size}
                </p>
              </CardContent>
            </Card>
          </div>

          {/* Impact Section */}
          <Card className="mb-8">
            <CardHeader>
              <CardTitle>Our Impact</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid md:grid-cols-2 gap-6">
                <img
                  src="https://images.unsplash.com/photo-1629273229664-11fabc0becc0?w=600"
                  alt="Students studying"
                  className="w-full h-64 object-cover rounded-xl"
                />
                <div>
                  <h3 className="text-xl font-bold text-gray-900 mb-4">How Your Donation Helps</h3>
                  <ul className="space-y-3 text-gray-600">
                    <li className="flex items-start space-x-3">
                      <span className="text-blue-600 font-bold">✓</span>
                      <span>Improve infrastructure and facilities</span>
                    </li>
                    <li className="flex items-start space-x-3">
                      <span className="text-blue-600 font-bold">✓</span>
                      <span>Provide books and learning materials</span>
                    </li>
                    <li className="flex items-start space-x-3">
                      <span className="text-blue-600 font-bold">✓</span>
                      <span>Support technology and digital learning</span>
                    </li>
                    <li className="flex items-start space-x-3">
                      <span className="text-blue-600 font-bold">✓</span>
                      <span>Fund scholarships for deserving students</span>
                    </li>
                    <li className="flex items-start space-x-3">
                      <span className="text-blue-600 font-bold">✓</span>
                      <span>Organize educational programs and workshops</span>
                    </li>
                  </ul>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Recent Donations */}
          <Card>
            <CardHeader>
              <CardTitle>Recent Donations</CardTitle>
            </CardHeader>
            <CardContent>
              {donations.length > 0 ? (
                <div className="space-y-3">
                  {donations.slice(0, 10).map((donation) => (
                    <div key={donation.id} className="flex justify-between items-center p-4 bg-gradient-to-r from-blue-50 to-white rounded-lg" data-testid={`donation-${donation.id}`}>
                      <div>
                        <p className="font-medium text-gray-900">{donation.donor_name}</p>
                        <p className="text-sm text-gray-600">{donation.purpose || 'General Support'}</p>
                      </div>
                      <div className="text-right">
                        <p className="font-bold text-blue-600">₹{donation.amount.toLocaleString()}</p>
                        <p className="text-xs text-gray-500">{new Date(donation.created_at).toLocaleDateString()}</p>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-gray-600 text-center py-8">No donations yet. Be the first to contribute!</p>
              )}
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Donation Modal */}
      <Dialog open={showDonateModal} onOpenChange={setShowDonateModal}>
        <DialogContent className="sm:max-w-md" data-testid="donate-dialog">
          <DialogHeader>
            <DialogTitle>Make a Donation</DialogTitle>
            <DialogDescription>Support education in Konaseema District</DialogDescription>
          </DialogHeader>
          <form onSubmit={handleDonate} className="space-y-4">
            <div>
              <Label htmlFor="donor_name">Your Name</Label>
              <Input
                id="donor_name"
                data-testid="donor-name-input"
                value={formData.donor_name}
                onChange={(e) => setFormData({...formData, donor_name: e.target.value})}
                required
              />
            </div>
            <div>
              <Label htmlFor="donor_email">Email</Label>
              <Input
                id="donor_email"
                type="email"
                data-testid="donor-email-input"
                value={formData.donor_email}
                onChange={(e) => setFormData({...formData, donor_email: e.target.value})}
                required
              />
            </div>
            <div>
              <Label htmlFor="amount">Amount (₹)</Label>
              <Input
                id="amount"
                type="number"
                min="1"
                data-testid="donation-amount-input"
                value={formData.amount}
                onChange={(e) => setFormData({...formData, amount: e.target.value})}
                required
              />
            </div>
            <div>
              <Label htmlFor="school_id">School (Optional)</Label>
              <Select value={formData.school_id} onValueChange={(val) => setFormData({...formData, school_id: val})}>
                <SelectTrigger data-testid="school-select">
                  <SelectValue placeholder="Select a school or leave blank for general" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="">General Support</SelectItem>
                  {schools.slice(0, 20).map(school => (
                    <SelectItem key={school.id} value={school.id}>{school.name}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label htmlFor="purpose">Purpose (Optional)</Label>
              <Textarea
                id="purpose"
                data-testid="donation-purpose-input"
                value={formData.purpose}
                onChange={(e) => setFormData({...formData, purpose: e.target.value})}
                placeholder="e.g., Library books, Sports equipment"
              />
            </div>
            <Button type="submit" className="w-full bg-blue-600 hover:bg-blue-700" data-testid="submit-donation-btn">
              Donate ₹{formData.amount || '0'}
            </Button>
            <p className="text-xs text-gray-500 text-center">
              Note: This is a demo. Payment integration with Razorpay will be added in production.
            </p>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default DonationsPage;
