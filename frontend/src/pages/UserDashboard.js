import React, { useContext } from 'react';
import { Link } from 'react-router-dom';
import { AuthContext } from '../App';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import NavBar from '../components/NavBar';

const UserDashboard = () => {
  const { user } = useContext(AuthContext);

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-orange-50">
      <NavBar />
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-6xl mx-auto">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">Welcome, {user?.name}!</h1>
          <p className="text-lg text-gray-600 mb-8">Your personalized dashboard</p>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            <Link to="/profile">
              <Card className="card-hover h-full" data-testid="dashboard-profile-card">
                <CardHeader>
                  <CardTitle>My Profile</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-600">View and edit your profile information</p>
                </CardContent>
              </Card>
            </Link>

            <Link to="/schools">
              <Card className="card-hover h-full" data-testid="dashboard-schools-card">
                <CardHeader>
                  <CardTitle>Browse Schools</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-600">Explore 300+ schools in Konaseema</p>
                </CardContent>
              </Card>
            </Link>

            <Link to="/events">
              <Card className="card-hover h-full" data-testid="dashboard-events-card">
                <CardHeader>
                  <CardTitle>Upcoming Events</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-600">Check out upcoming school events</p>
                </CardContent>
              </Card>
            </Link>

            <Link to="/alumni">
              <Card className="card-hover h-full" data-testid="dashboard-alumni-card">
                <CardHeader>
                  <CardTitle>Alumni Network</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-600">Connect with fellow alumni</p>
                </CardContent>
              </Card>
            </Link>

            <Link to="/donations">
              <Card className="card-hover h-full" data-testid="dashboard-donate-card">
                <CardHeader>
                  <CardTitle>Make a Donation</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-600">Support schools and students</p>
                </CardContent>
              </Card>
            </Link>

            <Link to="/chat">
              <Card className="card-hover h-full" data-testid="dashboard-chat-card">
                <CardHeader>
                  <CardTitle>Messages</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-600">Chat with members (Coming soon)</p>
                </CardContent>
              </Card>
            </Link>
          </div>

          {(user?.role === 'admin' || user?.role === 'meo') && (
            <div className="mt-8">
              <Link to="/admin">
                <Card className="bg-gradient-to-r from-blue-600 to-orange-500 text-white card-hover" data-testid="dashboard-admin-card">
                  <CardHeader>
                    <CardTitle>Admin Dashboard</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-blue-100">Access administrative tools and management features</p>
                    <Button className="mt-4 bg-white text-blue-600 hover:bg-gray-100">Go to Admin</Button>
                  </CardContent>
                </Card>
              </Link>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default UserDashboard;
