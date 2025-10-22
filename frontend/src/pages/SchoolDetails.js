import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import { API } from '../App';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import NavBar from '../components/NavBar';
import { toast } from 'sonner';

const SchoolDetails = () => {
  const { id } = useParams();
  const [school, setSchool] = useState(null);
  const [alumni, setAlumni] = useState([]);
  const [news, setNews] = useState([]);
  const [needs, setNeeds] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchSchoolData();
  }, [id]);

  const fetchSchoolData = async () => {
    try {
      const [schoolRes, alumniRes, newsRes, needsRes] = await Promise.all([
        axios.get(`${API}/schools/${id}`),
        axios.get(`${API}/alumni?school_id=${id}`),
        axios.get(`${API}/news?school_id=${id}`),
        axios.get(`${API}/school-needs?school_id=${id}`)
      ]);
      setSchool(schoolRes.data);
      setAlumni(alumniRes.data);
      setNews(newsRes.data);
      setNeeds(needsRes.data);
    } catch (error) {
      toast.error('Error loading school data');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen" style={{backgroundColor: 'var(--charcoal)'}}>
        <div className="gradient-mesh"></div>
        <NavBar />
        <div className="container mx-auto px-6 py-16">
          <div className="skeleton-premium h-96 rounded-3xl"></div>
        </div>
      </div>
    );
  }

  if (!school) {
    return (
      <div className="min-h-screen" style={{backgroundColor: 'var(--charcoal)'}}>
        <div className="gradient-mesh"></div>
        <NavBar />
        <div className="container mx-auto px-6 py-16 text-center">
          <h1 className="text-4xl font-bold mb-4" style={{fontFamily: 'Libre Baskerville', color: 'var(--ivory)'}}>School Not Found</h1>
          <p style={{color: 'var(--ivory)', opacity: 0.7}}>The requested school could not be found.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen" style={{backgroundColor: 'var(--charcoal)'}}>
      <div className="gradient-mesh"></div>
      <NavBar />
      
      <div className="container mx-auto px-6 py-16 relative">
        {/* Hero Section */}
        <div className="glass-card rounded-3xl p-12 mb-12 relative overflow-hidden">
          <div className="absolute inset-0 opacity-10" style={{background: 'linear-gradient(135deg, var(--crimson), var(--maroon))'}}></div>
          <div className="relative">
            <div className="flex items-start gap-8">
              <div className="w-24 h-24 rounded-full flex items-center justify-center shrink-0" style={{
                background: 'linear-gradient(135deg, var(--crimson), var(--maroon))',
                border: '4px solid var(--gold)'
              }}>
                <span className="text-5xl">🏫</span>
              </div>
              <div className="flex-1">
                <h1 className="text-5xl font-bold mb-4" style={{fontFamily: 'Libre Baskerville', color: 'var(--ivory)'}} data-testid="school-name">
                  {school.name}
                </h1>
                <p className="text-xl mb-6" style={{color: 'var(--gold)'}}>
                  {school.address || 'Konaseema District, Andhra Pradesh'}
                </p>
                <div className="flex flex-wrap gap-4">
                  <div className="glass-card px-6 py-3 rounded-xl">
                    <p className="text-sm" style={{color: 'var(--ivory)', opacity: 0.7}}>Contact: {school.contact_phone || 'N/A'}</p>
                  </div>
                  <div className="glass-card px-6 py-3 rounded-xl">
                    <p className="text-sm" style={{color: 'var(--ivory)', opacity: 0.7}}>Email: {school.contact_email || 'N/A'}</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Tabs */}
        <Tabs defaultValue="about" className="space-y-8">
          <TabsList className="glass-card p-2 rounded-2xl border-0" style={{background: 'rgba(255, 255, 255, 0.05)'}} data-testid="school-tabs">
            <TabsTrigger value="about" className="data-[state=active]:bg-crimson data-[state=active]:text-white rounded-xl">About</TabsTrigger>
            <TabsTrigger value="hm-note" className="data-[state=active]:bg-crimson data-[state=active]:text-white rounded-xl">HM Note</TabsTrigger>
            <TabsTrigger value="facilities" className="data-[state=active]:bg-crimson data-[state=active]:text-white rounded-xl">Facilities</TabsTrigger>
            <TabsTrigger value="alumni" className="data-[state=active]:bg-crimson data-[state=active]:text-white rounded-xl">Alumni ({alumni.length})</TabsTrigger>
            <TabsTrigger value="news" className="data-[state=active]:bg-crimson data-[state=active]:text-white rounded-xl">News</TabsTrigger>
            <TabsTrigger value="needs" className="data-[state=active]:bg-crimson data-[state=active]:text-white rounded-xl">Support Needs</TabsTrigger>
          </TabsList>

          <TabsContent value="about">
            <div className="glass-card p-12 rounded-3xl">
              <h2 className="text-3xl font-bold mb-6" style={{fontFamily: 'Libre Baskerville', color: 'var(--ivory)'}}>About {school.name}</h2>
              <p className="text-lg leading-relaxed" style={{color: 'var(--ivory)', opacity: 0.8}}>
                {school.name} is a proud member of the Zilla Parishad school network in Konaseema District, Andhra Pradesh. 
                We are committed to providing quality education and fostering holistic development of our students.
              </p>
            </div>
          </TabsContent>

          <TabsContent value="hm-note">
            <div className="glass-card p-12 rounded-3xl">
              <h2 className="text-3xl font-bold mb-8" style={{fontFamily: 'Libre Baskerville', color: 'var(--ivory)'}}>Headmaster's Message</h2>
              <div className="testimonial-quote">
                <p className="text-xl leading-relaxed italic" style={{fontFamily: 'Crimson Text', color: 'var(--ivory)', opacity: 0.9}}>
                  {school.hm_note || 'Welcome to our school! We are dedicated to nurturing young minds and building a strong foundation for their future. Our faculty is committed to excellence in education, and we continuously strive to create an environment that encourages learning, creativity, and personal growth.'}
                </p>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="facilities">
            <div className="glass-card p-12 rounded-3xl">
              <h2 className="text-3xl font-bold mb-8" style={{fontFamily: 'Libre Baskerville', color: 'var(--ivory)'}}>School Facilities</h2>
              <div className="grid md:grid-cols-2 gap-6">
                {(school.facilities && school.facilities.length > 0 ? school.facilities : 
                  ['Library', 'Computer Lab', 'Playground', 'Science Lab', 'Sports Equipment', 'Clean Drinking Water']
                ).map((facility, idx) => (
                  <div key={idx} className="flex items-center gap-4 p-6 rounded-xl" style={{background: 'rgba(197, 165, 114, 0.1)'}}>
                    <div className="w-12 h-12 rounded-full flex items-center justify-center" style={{background: 'var(--crimson)'}}>
                      <span className="text-white text-xl">✓</span>
                    </div>
                    <span className="text-lg font-medium" style={{color: 'var(--ivory)'}}>{facility}</span>
                  </div>
                ))}
              </div>
            </div>
          </TabsContent>

          <TabsContent value="alumni">
            <div className="glass-card p-12 rounded-3xl">
              <h2 className="text-3xl font-bold mb-8" style={{fontFamily: 'Libre Baskerville', color: 'var(--ivory)'}}>Alumni Network ({alumni.length})</h2>
              {alumni.length > 0 ? (
                <div className="grid md:grid-cols-3 gap-6">
                  {alumni.map((alum) => (
                    <div key={alum.id} className="glass-card p-6 rounded-2xl text-center">
                      <div className="w-16 h-16 rounded-full mx-auto mb-4 flex items-center justify-center" style={{background: 'linear-gradient(135deg, var(--crimson), var(--maroon))'}}>
                        <span className="text-white text-2xl font-bold">{alum.batch_year?.toString().slice(-2)}</span>
                      </div>
                      <p className="font-bold mb-2" style={{color: 'var(--ivory)'}}>Batch {alum.batch_year}</p>
                      <p className="text-sm" style={{color: 'var(--gold)'}}>{alum.current_profession || 'Professional'}</p>
                    </div>
                  ))}
                </div>
              ) : (
                <p style={{color: 'var(--ivory)', opacity: 0.7}}>No alumni profiles yet. Join the alumni network!</p>
              )}
            </div>
          </TabsContent>

          <TabsContent value="news">
            <div className="glass-card p-12 rounded-3xl">
              <h2 className="text-3xl font-bold mb-8" style={{fontFamily: 'Libre Baskerville', color: 'var(--ivory)'}}>Latest News & Updates</h2>
              {news.length > 0 ? (
                <div className="space-y-6">
                  {news.map((item) => (
                    <div key={item.id} className="p-6 rounded-2xl" style={{background: 'rgba(197, 165, 114, 0.1)'}}>
                      <h3 className="text-xl font-bold mb-3" style={{color: 'var(--ivory)'}}>{
                        item.title}</h3>
                      <p className="mb-3" style={{color: 'var(--ivory)', opacity: 0.8}}>{item.content}</p>
                      <p className="text-sm" style={{color: 'var(--gold)'}}>{new Date(item.created_at).toLocaleDateString()}</p>
                    </div>
                  ))}
                </div>
              ) : (
                <p style={{color: 'var(--ivory)', opacity: 0.7}}>No news updates available.</p>
              )}
            </div>
          </TabsContent>

          <TabsContent value="needs">
            <div className="glass-card p-12 rounded-3xl">
              <h2 className="text-3xl font-bold mb-8" style={{fontFamily: 'Libre Baskerville', color: 'var(--ivory)'}}>Support Our School</h2>
              {needs.length > 0 ? (
                <div className="space-y-6">
                  {needs.map((need) => (
                    <div key={need.id} className="p-8 rounded-2xl" style={{background: 'linear-gradient(135deg, rgba(165, 28, 48, 0.1), rgba(197, 165, 114, 0.1))'}}>
                      <h3 className="text-2xl font-bold mb-3" style={{fontFamily: 'Libre Baskerville', color: 'var(--ivory)'}}>{
                        need.title}</h3>
                      <p className="mb-4 text-lg" style={{color: 'var(--ivory)', opacity: 0.8}}>{need.description}</p>
                      <div className="flex justify-between items-center">
                        <span className="px-4 py-2 rounded-full" style={{background: 'var(--crimson)', color: 'white'}}>{need.category}</span>
                        {need.target_amount && (
                          <span className="text-2xl font-bold" style={{color: 'var(--gold)'}}>Target: ₹{need.target_amount.toLocaleString()}</span>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <p style={{color: 'var(--ivory)', opacity: 0.7}}>No support needs posted at this time.</p>
              )}
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default SchoolDetails;
