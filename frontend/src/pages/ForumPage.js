import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import NavBar from '../components/NavBar';

const ForumPage = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-orange-50">
      <NavBar />
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-4xl font-bold text-gray-900 mb-8">Discussion Forum</h1>
          <Card>
            <CardHeader>
              <CardTitle>Forum - Coming Soon</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-600 mb-4">The discussion forum feature is under development.</p>
              <p className="text-sm text-gray-500">Alumni and students will be able to participate in discussions, share experiences, and collaborate.</p>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default ForumPage;
