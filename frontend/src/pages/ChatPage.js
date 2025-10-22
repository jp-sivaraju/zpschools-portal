import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import NavBar from '../components/NavBar';

const ChatPage = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-orange-50">
      <NavBar />
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-4xl font-bold text-gray-900 mb-8">Chat & Messaging</h1>
          <Card>
            <CardHeader>
              <CardTitle>Messaging - Coming Soon</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-600 mb-4">Real-time chat and messaging feature is under development.</p>
              <p className="text-sm text-gray-500">Features will include: Group chats per batch/school, Direct messaging, File attachments, and Message history.</p>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default ChatPage;
