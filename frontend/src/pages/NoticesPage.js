import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import NavBar from '../components/NavBar';

const NoticesPage = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-orange-50">
      <NavBar />
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-4xl font-bold text-gray-900 mb-8">Notice Board</h1>
          <Card>
            <CardHeader>
              <CardTitle>Bulletin Board - Coming Soon</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-600 mb-4">The notice board feature is under development.</p>
              <p className="text-sm text-gray-500">Important announcements and updates will be posted here.</p>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default NoticesPage;
