import React, { useState, useEffect, useContext } from 'react';
import axios from 'axios';
import { AuthContext, API } from '../App';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import NavBar from '../components/NavBar';
import { toast } from 'sonner';

const AlumniPortal = () => {
  const { user } = useContext(AuthContext);
  const [alumni, setAlumni] = useState([]);
  const [forumPosts, setForumPosts] = useState([]);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const [alumniRes, forumRes] = await Promise.all([
        axios.get(`${API}/alumni`),
        axios.get(`${API}/forums/posts`)
      ]);
      setAlumni(alumniRes.data);
      setForumPosts(forumRes.data);
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-orange-50">
      <NavBar />
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-6xl mx-auto">
          {/* Hero */}
          <div className="bg-gradient-to-r from-blue-600 to-orange-500 rounded-3xl p-12 text-white mb-8">
            <h1 className="text-5xl font-bold mb-4">Alumni Portal</h1>
            <p className="text-blue-100 text-lg mb-6">Connect, collaborate, and give back to your alma mater</p>
            <img
              src="https://images.unsplash.com/photo-1714194821788-6fd3634f01f1?w=800"
              alt="Alumni graduation"
              className="w-full h-64 object-cover rounded-2xl"
            />
          </div>

          <Tabs defaultValue="network" className="space-y-6">
            <TabsList className="grid grid-cols-2 md:grid-cols-5 w-full" data-testid="alumni-tabs">
              <TabsTrigger value="network">Alumni Network</TabsTrigger>
              <TabsTrigger value="forum">Discussion Forum</TabsTrigger>
              <TabsTrigger value="mentoring">Mentoring</TabsTrigger>
              <TabsTrigger value="offers">Job Offers</TabsTrigger>
              <TabsTrigger value="bulletin">Bulletin Board</TabsTrigger>
            </TabsList>

            <TabsContent value="network">
              <Card>
                <CardHeader>
                  <CardTitle>Alumni Network ({alumni.length})</CardTitle>
                </CardHeader>
                <CardContent>
                  {alumni.length > 0 ? (
                    <div className="grid md:grid-cols-3 gap-4">
                      {alumni.map((alum) => (
                        <div key={alum.id} className="p-6 bg-gradient-to-br from-blue-50 to-white rounded-xl card-hover" data-testid={`alumni-card-${alum.id}`}>
                          <div className="w-16 h-16 bg-gradient-to-br from-blue-600 to-orange-500 rounded-full mx-auto mb-4 flex items-center justify-center text-white text-2xl font-bold">
                            {alum.batch_year?.toString().slice(-2)}
                          </div>
                          <p className="font-bold text-center text-gray-900">Batch {alum.batch_year}</p>
                          <p className="text-sm text-gray-600 text-center">{alum.current_profession || 'Professional'}</p>
                          {alum.willing_to_mentor && (
                            <div className="mt-3 text-center">
                              <span className="inline-block bg-green-100 text-green-800 text-xs px-3 py-1 rounded-full">Available for Mentoring</span>
                            </div>
                          )}
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="text-center py-12">
                      <p className="text-gray-600 mb-4">No alumni profiles yet.</p>
                      {user && (
                        <Button className="bg-blue-600 hover:bg-blue-700" data-testid="register-alumni-btn">
                          Register as Alumni
                        </Button>
                      )}
                    </div>
                  )}
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="forum">
              <Card>
                <CardHeader>
                  <CardTitle>Discussion Forum</CardTitle>
                </CardHeader>
                <CardContent>
                  {user && (
                    <Button className="mb-6 bg-blue-600 hover:bg-blue-700" data-testid="new-post-btn">
                      Create New Post
                    </Button>
                  )}
                  {forumPosts.length > 0 ? (
                    <div className="space-y-4">
                      {forumPosts.map((post) => (
                        <div key={post.id} className="p-6 bg-white rounded-xl border border-gray-200 card-hover" data-testid={`forum-post-${post.id}`}>
                          <h3 className="font-bold text-gray-900 mb-2">{post.title}</h3>
                          <p className="text-gray-600 mb-3">{post.content}</p>
                          <div className="flex justify-between items-center text-sm text-gray-500">
                            <span>Category: {post.category}</span>
                            <span>{post.replies_count} replies</span>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p className="text-gray-600 text-center py-8">No forum posts yet. Start a discussion!</p>
                  )}
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="mentoring">
              <Card>
                <CardHeader>
                  <CardTitle>Mentoring Program</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-center py-12">
                    <img
                      src="https://images.unsplash.com/photo-1758685733940-b1c11d04f553?w=600"
                      alt="Mentoring"
                      className="w-full max-w-md h-64 object-cover rounded-xl mx-auto mb-6"
                    />
                    <h3 className="text-xl font-bold text-gray-900 mb-3">Mentoring Program</h3>
                    <p className="text-gray-600 mb-6 max-w-2xl mx-auto">
                      Connect with experienced alumni who can guide students and recent graduates in their career paths.
                      Mentors share knowledge, provide advice, and help shape the next generation.
                    </p>
                    <div className="flex justify-center space-x-4">
                      <Button className="bg-blue-600 hover:bg-blue-700" data-testid="become-mentor-btn">Become a Mentor</Button>
                      <Button variant="outline" className="border-blue-600 text-blue-600" data-testid="find-mentor-btn">Find a Mentor</Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="offers">
              <Card>
                <CardHeader>
                  <CardTitle>Job Offers & Guest Lectures</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="p-6 bg-gradient-to-r from-green-50 to-blue-50 rounded-xl">
                      <h3 className="font-bold text-gray-900 mb-2">Guest Lecture Opportunity</h3>
                      <p className="text-gray-600 mb-3">Alumni are invited to share their experiences and insights with current students.</p>
                      <Button className="bg-blue-600 hover:bg-blue-700" data-testid="schedule-lecture-btn">Schedule a Lecture</Button>
                    </div>
                    <div className="p-6 bg-gradient-to-r from-purple-50 to-pink-50 rounded-xl">
                      <h3 className="font-bold text-gray-900 mb-2">Job Postings</h3>
                      <p className="text-gray-600 mb-3">Help fellow alumni and students find career opportunities.</p>
                      <Button className="bg-blue-600 hover:bg-blue-700" data-testid="post-job-btn">Post a Job</Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="bulletin">
              <Card>
                <CardHeader>
                  <CardTitle>Bulletin Board</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-600 text-center py-8">Announcements and updates will appear here.</p>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  );
};

export default AlumniPortal;
