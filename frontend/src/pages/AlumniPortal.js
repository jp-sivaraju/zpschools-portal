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

  // Mock data
  const MOCK_ALUMNI = [
    { id: 'a1', batch_year: 2005, current_profession: 'Software Engineer', willing_to_mentor: true },
    { id: 'a2', batch_year: 1998, current_profession: 'Doctor', willing_to_mentor: false },
    { id: 'a3', batch_year: 2010, current_profession: 'Teacher', willing_to_mentor: true },
  ];

  const MOCK_FORUM_POSTS = [
    { id: 'p1', title: 'Mentoring Juniors', content: 'Share tips and opportunities.', category: 'Mentoring', replies_count: 5 },
    { id: 'p2', title: 'Career Guidance', content: 'Paths after intermediate.', category: 'Career', replies_count: 8 },
  ];

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      // Use mock data
      setAlumni(MOCK_ALUMNI);
      setForumPosts(MOCK_FORUM_POSTS);
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  };

  return (
    <div className="min-h-screen" style={{backgroundColor: 'var(--charcoal)'}}>
      <div className="gradient-mesh"></div>
      <NavBar />
      
      <div className="container mx-auto px-6 py-16 relative">
        <div className="max-w-7xl mx-auto">
          {/* Hero */}
          <div className="glass-card rounded-3xl p-16 mb-16 relative overflow-hidden">
            <div className="absolute inset-0 opacity-10" style={{background: 'linear-gradient(135deg, var(--crimson), var(--maroon))'}}></div>
            <div className="relative text-center">
              <div className="inline-block px-4 py-2 rounded-full mb-6" style={{
                background: 'rgba(197, 165, 114, 0.15)',
                border: '1px solid var(--gold)'
              }}>
                <span style={{color: 'var(--gold)'}} className="text-sm font-semibold">
                  🎓 Join Our Legacy
                </span>
              </div>
              <h1 className="text-6xl font-bold mb-6" style={{fontFamily: 'Libre Baskerville', color: 'var(--ivory)'}}>
                Alumni Network
              </h1>
              <p className="text-2xl max-w-3xl mx-auto" style={{color: 'var(--ivory)', opacity: 0.8}}>
                Connect, collaborate, and give back to your alma mater
              </p>
            </div>
          </div>

          <Tabs defaultValue="network" className="space-y-8">
            <TabsList className="glass-card p-2 rounded-2xl border-0" style={{background: 'rgba(255, 255, 255, 0.05)'}} data-testid="alumni-tabs">
              <TabsTrigger value="network" className="data-[state=active]:bg-crimson data-[state=active]:text-white rounded-xl">Network</TabsTrigger>
              <TabsTrigger value="forum" className="data-[state=active]:bg-crimson data-[state=active]:text-white rounded-xl">Forum</TabsTrigger>
              <TabsTrigger value="mentoring" className="data-[state=active]:bg-crimson data-[state=active]:text-white rounded-xl">Mentoring</TabsTrigger>
              <TabsTrigger value="offers" className="data-[state=active]:bg-crimson data-[state=active]:text-white rounded-xl">Opportunities</TabsTrigger>
              <TabsTrigger value="bulletin" className="data-[state=active]:bg-crimson data-[state=active]:text-white rounded-xl">Bulletin</TabsTrigger>
            </TabsList>

            <TabsContent value="network">
              <div className="glass-card p-12 rounded-3xl">
                <h2 className="text-3xl font-bold mb-8" style={{fontFamily: 'Libre Baskerville', color: 'var(--ivory)'}}>
                  Alumni Directory ({alumni.length})
                </h2>
                {alumni.length > 0 ? (
                  <div className="grid md:grid-cols-3 gap-6">
                    {alumni.map((alum) => (
                      <div key={alum.id} className="glass-card p-8 rounded-2xl hover:scale-105 transition-all text-center" data-testid={`alumni-card-${alum.id}`}>
                        <div className="w-20 h-20 rounded-full mx-auto mb-4 flex items-center justify-center" style={{
                          background: 'linear-gradient(135deg, var(--crimson), var(--maroon))',
                          border: '3px solid var(--gold)'
                        }}>
                          <span className="text-white text-3xl font-bold" style={{fontFamily: 'Libre Baskerville'}}>
                            {alum.batch_year?.toString().slice(-2)}
                          </span>
                        </div>
                        <p className="font-bold text-xl mb-2" style={{color: 'var(--ivory)'}}>Batch {alum.batch_year}</p>
                        <p className="mb-3" style={{color: 'var(--gold)'}}>{alum.current_profession || 'Professional'}</p>
                        {alum.willing_to_mentor && (
                          <span className="inline-block px-4 py-2 rounded-full text-xs font-semibold" style={{
                            background: 'rgba(16, 185, 129, 0.2)',
                            color: '#10b981'
                          }}>
                            Available for Mentoring
                          </span>
                        )}
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-12">
                    <div className="text-6xl mb-6">🎓</div>
                    <p className="text-xl mb-6" style={{color: 'var(--ivory)', opacity: 0.7}}>No alumni profiles yet.</p>
                    {user && (
                      <Button className="text-white px-8 py-4 rounded-xl font-semibold" style={{
                        background: 'linear-gradient(135deg, var(--crimson), var(--maroon))'
                      }} data-testid="register-alumni-btn">
                        Register as Alumni
                      </Button>
                    )}
                  </div>
                )}
              </div>
            </TabsContent>

            <TabsContent value="forum">
              <div className="glass-card p-12 rounded-3xl">
                <div className="flex justify-between items-center mb-8">
                  <h2 className="text-3xl font-bold" style={{fontFamily: 'Libre Baskerville', color: 'var(--ivory)'}}>
                    Discussion Forum
                  </h2>
                  {user && (
                    <Button className="text-white px-6 py-3 rounded-xl font-semibold" style={{
                      background: 'linear-gradient(135deg, var(--crimson), var(--maroon))'
                    }} data-testid="new-post-btn">
                      Create New Post
                    </Button>
                  )}
                </div>
                {forumPosts.length > 0 ? (
                  <div className="space-y-6">
                    {forumPosts.map((post) => (
                      <div key={post.id} className="p-8 rounded-2xl hover:scale-[1.02] transition-all cursor-pointer" style={{
                        background: 'rgba(197, 165, 114, 0.1)',
                        border: '1px solid rgba(197, 165, 114, 0.2)'
                      }} data-testid={`forum-post-${post.id}`}>
                        <h3 className="text-2xl font-bold mb-3" style={{fontFamily: 'Libre Baskerville', color: 'var(--ivory)'}}>
                          {post.title}
                        </h3>
                        <p className="mb-4 text-lg" style={{color: 'var(--ivory)', opacity: 0.8}}>{post.content}</p>
                        <div className="flex gap-4">
                          <span className="px-4 py-2 rounded-full text-sm" style={{background: 'var(--crimson)', color: 'white'}}>
                            {post.category}
                          </span>
                          <span style={{color: 'var(--gold)'}}>{post.replies_count} replies</span>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-12">
                    <p style={{color: 'var(--ivory)', opacity: 0.7}}>No forum posts yet. Start a discussion!</p>
                  </div>
                )}
              </div>
            </TabsContent>

            <TabsContent value="mentoring">
              <div className="glass-card p-12 rounded-3xl text-center">
                <div className="achievement-badge mx-auto mb-8 text-5xl">🎯</div>
                <h2 className="text-4xl font-bold mb-6" style={{fontFamily: 'Libre Baskerville', color: 'var(--ivory)'}}>
                  Mentoring Program
                </h2>
                <p className="text-xl mb-12 max-w-3xl mx-auto" style={{color: 'var(--ivory)', opacity: 0.8}}>
                  Connect with experienced alumni who can guide students and recent graduates in their career paths.
                  Mentors share knowledge, provide advice, and help shape the next generation.
                </p>
                <div className="flex justify-center gap-6">
                  <Button className="text-white px-8 py-4 text-lg rounded-xl font-semibold" style={{
                    background: 'linear-gradient(135deg, var(--crimson), var(--maroon))'
                  }} data-testid="become-mentor-btn">
                    Become a Mentor
                  </Button>
                  <Button className="px-8 py-4 text-lg rounded-xl font-semibold" style={{
                    border: '2px solid var(--gold)',
                    color: 'var(--gold)',
                    background: 'rgba(197, 165, 114, 0.1)'
                  }} data-testid="find-mentor-btn">
                    Find a Mentor
                  </Button>
                </div>
              </div>
            </TabsContent>

            <TabsContent value="offers">
              <div className="glass-card p-12 rounded-3xl">
                <h2 className="text-3xl font-bold mb-8" style={{fontFamily: 'Libre Baskerville', color: 'var(--ivory)'}}>
                  Career Opportunities
                </h2>
                <div className="grid md:grid-cols-2 gap-6">
                  <div className="p-8 rounded-2xl" style={{background: 'linear-gradient(135deg, rgba(16, 185, 129, 0.1), rgba(59, 130, 246, 0.1))'}}>
                    <div className="text-4xl mb-4">💼</div>
                    <h3 className="text-2xl font-bold mb-3" style={{fontFamily: 'Libre Baskerville', color: 'var(--ivory)'}}>
                      Job Postings
                    </h3>
                    <p className="mb-6" style={{color: 'var(--ivory)', opacity: 0.8}}>
                      Help fellow alumni and students find career opportunities.
                    </p>
                    <Button className="text-white px-6 py-3 rounded-xl font-semibold" style={{
                      background: 'linear-gradient(135deg, var(--crimson), var(--maroon))'
                    }} data-testid="post-job-btn">
                      Post a Job
                    </Button>
                  </div>
                  <div className="p-8 rounded-2xl" style={{background: 'linear-gradient(135deg, rgba(139, 92, 246, 0.1), rgba(236, 72, 153, 0.1))'}}>
                    <div className="text-4xl mb-4">🎤</div>
                    <h3 className="text-2xl font-bold mb-3" style={{fontFamily: 'Libre Baskerville', color: 'var(--ivory)'}}>
                      Guest Lectures
                    </h3>
                    <p className="mb-6" style={{color: 'var(--ivory)', opacity: 0.8}}>
                      Share your experiences and insights with current students.
                    </p>
                    <Button className="text-white px-6 py-3 rounded-xl font-semibold" style={{
                      background: 'linear-gradient(135deg, var(--crimson), var(--maroon))'
                    }} data-testid="schedule-lecture-btn">
                      Schedule a Lecture
                    </Button>
                  </div>
                </div>
              </div>
            </TabsContent>

            <TabsContent value="bulletin">
              <div className="glass-card p-12 rounded-3xl text-center">
                <h2 className="text-3xl font-bold mb-4" style={{fontFamily: 'Libre Baskerville', color: 'var(--ivory)'}}>
                  Bulletin Board
                </h2>
                <p style={{color: 'var(--ivory)', opacity: 0.7}}>Announcements and updates will appear here.</p>
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  );
};

export default AlumniPortal;
