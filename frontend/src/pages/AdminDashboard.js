import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { API } from '../App';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import NavBar from '../components/NavBar';
import { toast } from 'sonner';

const AdminDashboard = () => {
  const [stats, setStats] = useState(null);
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);

  // Mock data
  const MOCK_STATS = {
    total_schools: 3,
    total_users: 6,
    total_alumni: 3,
    total_donation_amount: 325000,
    pending_approvals: 2,
  };

  const MOCK_USERS = [
    { id: 'u1', name: 'Admin User', email: 'admin@example.com', role: 'admin', approved: true },
    { id: 'u2', name: 'MEO Officer', email: 'meo@example.com', role: 'meo', approved: true },
    { id: 'u3', name: 'Priya Sharma', email: 'priya@example.com', role: 'alumni', approved: false },
    { id: 'u4', name: 'Anil Reddy', email: 'anil@example.com', role: 'alumni', approved: false },
    { id: 'u5', name: 'Student A', email: 'studenta@example.com', role: 'student', approved: true },
    { id: 'u6', name: 'Teacher B', email: 'teacherb@example.com', role: 'teacher', approved: true },
  ];

  useEffect(() => {
    fetchAdminData();
  }, []);

  const fetchAdminData = async () => {
    try {
      // Use mocks instead of API
      setStats(MOCK_STATS);
      setUsers(MOCK_USERS);
    } catch (error) {
      toast.error('Error loading admin data');
    } finally {
      setLoading(false);
    }
  };

  const approveUser = async (userId) => {
    try {
      // Simulate local approval
      setUsers(prev =>
        prev.map(u => (u.id === userId ? { ...u, approved: true } : u))
      );
      // Update pending approvals count
      setStats(prev => ({
        ...prev,
        pending_approvals: Math.max(
          0,
          users.filter(u => !u.approved && u.role === 'alumni').length - 1
        ),
      }));
      toast.success('User approved successfully');
    } catch (error) {
      toast.error('Error approving user');
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-orange-50">
        <NavBar />
        <div className="container mx-auto px-4 py-8">
          <div className="skeleton h-96 rounded-xl"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-orange-50">
      <NavBar />
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-4xl font-bold text-gray-900 mb-8">Admin Dashboard</h1>

        {/* Stats Grid */}
        <div className="grid md:grid-cols-4 gap-6 mb-8">
          <Card className="card-hover">
            <CardHeader>
              <CardTitle className="text-sm text-gray-600">Total Schools</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-4xl font-bold text-blue-600" data-testid="stat-schools">{stats?.total_schools || 0}</p>
            </CardContent>
          </Card>
          <Card className="card-hover">
            <CardHeader>
              <CardTitle className="text-sm text-gray-600">Total Users</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-4xl font-bold text-green-600" data-testid="stat-users">{stats?.total_users || 0}</p>
            </CardContent>
          </Card>
          <Card className="card-hover">
            <CardHeader>
              <CardTitle className="text-sm text-gray-600">Total Alumni</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-4xl font-bold text-purple-600" data-testid="stat-alumni">{stats?.total_alumni || 0}</p>
            </CardContent>
          </Card>
          <Card className="card-hover">
            <CardHeader>
              <CardTitle className="text-sm text-gray-600">Total Donations</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-4xl font-bold text-orange-600" data-testid="stat-donations">₹{stats?.total_donation_amount?.toLocaleString() || 0}</p>
            </CardContent>
          </Card>
        </div>

        {/* Management Tabs */}
        <Tabs defaultValue="users" className="space-y-6">
          <TabsList className="grid grid-cols-3 md:grid-cols-6 w-full" data-testid="admin-tabs">
            <TabsTrigger value="users">Users</TabsTrigger>
            <TabsTrigger value="schools">Schools</TabsTrigger>
            <TabsTrigger value="approvals">Approvals</TabsTrigger>
            <TabsTrigger value="uploads">Bulk Upload</TabsTrigger>
            <TabsTrigger value="notifications">Notifications</TabsTrigger>
            <TabsTrigger value="analytics">Analytics</TabsTrigger>
          </TabsList>

          <TabsContent value="users">
            <Card>
              <CardHeader>
                <CardTitle>User Management</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Name</th>
                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Email</th>
                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Role</th>
                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200">
                      {users.map((user) => (
                        <tr key={user.id} data-testid={`user-row-${user.id}`}>
                          <td className="px-4 py-3 text-sm text-gray-900">{user.name}</td>
                          <td className="px-4 py-3 text-sm text-gray-600">{user.email}</td>
                          <td className="px-4 py-3 text-sm">
                            <span className="inline-block bg-blue-100 text-blue-800 px-2 py-1 rounded text-xs">
                              {user.role}
                            </span>
                          </td>
                          <td className="px-4 py-3 text-sm">
                            <span className={`inline-block px-2 py-1 rounded text-xs ${user.approved ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'}`}>
                              {user.approved ? 'Approved' : 'Pending'}
                            </span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="schools">
            <Card>
              <CardHeader>
                <div className="flex justify-between items-center">
                  <CardTitle>School Management</CardTitle>
                  <Button className="bg-blue-600 hover:bg-blue-700" data-testid="add-school-btn">Add New School</Button>
                </div>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600">School CRUD operations: Create, Read, Update, Delete schools, manage officials, and update school data.</p>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="approvals">
            <Card>
              <CardHeader>
                <CardTitle>Pending Approvals ({stats?.pending_approvals || 0})</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {users.filter(u => !u.approved && u.role === 'alumni').map((user) => (
                    <div key={user.id} className="flex justify-between items-center p-4 bg-yellow-50 rounded-lg" data-testid={`approval-${user.id}`}>
                      <div>
                        <p className="font-medium text-gray-900">{user.name}</p>
                        <p className="text-sm text-gray-600">{user.email} - {user.role}</p>
                      </div>
                      <Button
                        onClick={() => approveUser(user.id)}
                        className="bg-green-600 hover:bg-green-700"
                        data-testid={`approve-btn-${user.id}`}
                      >
                        Approve
                      </Button>
                    </div>
                  ))}
                  {users.filter(u => !u.approved && u.role === 'alumni').length === 0 && (
                    <p className="text-gray-600 text-center py-8">No pending approvals.</p>
                  )}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="uploads">
            <Card>
              <CardHeader>
                <CardTitle>Bulk Data Upload</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="p-6 bg-gradient-to-r from-blue-50 to-white rounded-xl">
                    <h3 className="font-bold text-gray-900 mb-2">Upload Schools CSV</h3>
                    <p className="text-sm text-gray-600 mb-4">Bulk upload school data with CSV file</p>
                    <Button className="bg-blue-600 hover:bg-blue-700" data-testid="upload-schools-btn">Upload CSV</Button>
                  </div>
                  <div className="p-6 bg-gradient-to-r from-green-50 to-white rounded-xl">
                    <h3 className="font-bold text-gray-900 mb-2">Upload Staff Data</h3>
                    <p className="text-sm text-gray-600 mb-4">Bulk upload staff information</p>
                    <Button className="bg-green-600 hover:bg-green-700" data-testid="upload-staff-btn">Upload CSV</Button>
                  </div>
                  <div className="p-6 bg-gradient-to-r from-purple-50 to-white rounded-xl">
                    <h3 className="font-bold text-gray-900 mb-2">Upload Donors</h3>
                    <p className="text-sm text-gray-600 mb-4">Bulk upload donor information</p>
                    <Button className="bg-purple-600 hover:bg-purple-700" data-testid="upload-donors-btn">Upload CSV</Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="notifications">
            <Card>
              <CardHeader>
                <CardTitle>Notification System</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="p-6 bg-gradient-to-r from-blue-50 to-white rounded-xl">
                    <h3 className="font-bold text-gray-900 mb-2">Send Bulk Notification</h3>
                    <p className="text-sm text-gray-600 mb-4">Send in-app, email, or SMS notifications to users</p>
                    <Button className="bg-blue-600 hover:bg-blue-700" data-testid="send-notification-btn">Create Notification</Button>
                  </div>
                  <div className="p-6 bg-gradient-to-r from-orange-50 to-white rounded-xl">
                    <h3 className="font-bold text-gray-900 mb-2">Email Campaigns</h3>
                    <p className="text-sm text-gray-600 mb-4">Manage email templates and campaigns</p>
                    <Button className="bg-orange-600 hover:bg-orange-700" data-testid="email-campaign-btn">Email Tools</Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="analytics">
            <Card>
              <CardHeader>
                <CardTitle>Analytics Dashboard</CardTitle>
              </CardHeader>
              <CardContent>
                <img
                  src="https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=800"
                  alt="Analytics"
                  className="w-full h-64 object-cover rounded-xl mb-4"
                />
                <p className="text-gray-600">Comprehensive analytics: User statistics, school overviews, donation trends, engagement metrics, and more.</p>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default AdminDashboard;
