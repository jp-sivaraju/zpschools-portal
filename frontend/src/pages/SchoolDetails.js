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
  const [galleries, setGalleries] = useState([]);
  const [needs, setNeeds] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchSchoolData();
  }, [id]);

  const fetchSchoolData = async () => {
    try {
      const [schoolRes, alumniRes, newsRes, galleriesRes, needsRes] = await Promise.all([
        axios.get(`${API}/schools/${id}`),
        axios.get(`${API}/alumni?school_id=${id}`),
        axios.get(`${API}/news?school_id=${id}`),
        axios.get(`${API}/galleries?school_id=${id}`),
        axios.get(`${API}/school-needs?school_id=${id}`)
      ]);
      setSchool(schoolRes.data);
      setAlumni(alumniRes.data);
      setNews(newsRes.data);
      setGalleries(galleriesRes.data);
      setNeeds(needsRes.data);
    } catch (error) {
      toast.error('Error loading school data');
    } finally {
      setLoading(false);
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

  if (!school) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-orange-50">
        <NavBar />
        <div className="container mx-auto px-4 py-8 text-center">
          <h1 className="text-3xl font-bold text-gray-900 mb-4">School Not Found</h1>
          <p className="text-gray-600">The requested school could not be found.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-orange-50">
      <NavBar />
      <div className="container mx-auto px-4 py-8">
        {/* Hero Section */}
        <div className="bg-gradient-to-r from-blue-600 to-orange-500 rounded-3xl p-8 md:p-12 text-white mb-8">
          <h1 className="text-4xl md:text-5xl font-bold mb-4" data-testid="school-name">{school.name}</h1>
          <p className="text-blue-100 text-lg">{school.address || 'Konaseema District, Andhra Pradesh'}</p>
          <div className="mt-6 flex flex-wrap gap-4">
            <div className="bg-white/20 backdrop-blur-sm px-6 py-3 rounded-full">
              <p className="text-sm">Contact: {school.contact_phone || 'N/A'}</p>
            </div>
            <div className="bg-white/20 backdrop-blur-sm px-6 py-3 rounded-full">
              <p className="text-sm">Email: {school.contact_email || 'N/A'}</p>
            </div>
          </div>
        </div>

        {/* Tabs */}
        <Tabs defaultValue="about" className="space-y-6">
          <TabsList className="grid grid-cols-3 md:grid-cols-7 w-full" data-testid="school-tabs">
            <TabsTrigger value="about">About</TabsTrigger>
            <TabsTrigger value="hm-note">HM Note</TabsTrigger>
            <TabsTrigger value="facilities">Facilities</TabsTrigger>
            <TabsTrigger value="alumni">Alumni</TabsTrigger>
            <TabsTrigger value="news">News</TabsTrigger>
            <TabsTrigger value="gallery">Gallery</TabsTrigger>
            <TabsTrigger value="needs">Support Needs</TabsTrigger>
          </TabsList>

          <TabsContent value="about">
            <Card>
              <CardHeader>
                <CardTitle>About {school.name}</CardTitle>
              </CardHeader>
              <CardContent>
                <img
                  src="https://images.unsplash.com/photo-1639910232134-8cc7505c4e64?w=800"
                  alt="School building"
                  className="w-full h-64 object-cover rounded-xl mb-6"
                />
                <p className="text-gray-600 leading-relaxed">
                  {school.name} is a proud member of the Zilla Parishad school network in Konaseema District, Andhra Pradesh. 
                  We are committed to providing quality education and fostering holistic development of our students.
                </p>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="hm-note">
            <Card>
              <CardHeader>
                <CardTitle>Headmaster's Note</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600 leading-relaxed whitespace-pre-wrap">
                  {school.hm_note || 'Welcome to our school! We are dedicated to nurturing young minds and building a strong foundation for their future. Our faculty is committed to excellence in education, and we continuously strive to create an environment that encourages learning, creativity, and personal growth.'}
                </p>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="facilities">
            <Card>
              <CardHeader>
                <CardTitle>School Facilities</CardTitle>
              </CardHeader>
              <CardContent>
                {school.facilities && school.facilities.length > 0 ? (
                  <div className="grid md:grid-cols-2 gap-4">
                    {school.facilities.map((facility, idx) => (
                      <div key={idx} className="flex items-center space-x-3 p-4 bg-blue-50 rounded-lg">
                        <div className="w-10 h-10 bg-blue-600 rounded-full flex items-center justify-center text-white">✓</div>
                        <span className="text-gray-800 font-medium">{facility}</span>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="grid md:grid-cols-2 gap-4">
                    {['Library', 'Computer Lab', 'Playground', 'Science Lab', 'Sports Equipment', 'Clean Drinking Water'].map((facility, idx) => (
                      <div key={idx} className="flex items-center space-x-3 p-4 bg-blue-50 rounded-lg">
                        <div className="w-10 h-10 bg-blue-600 rounded-full flex items-center justify-center text-white">✓</div>
                        <span className="text-gray-800 font-medium">{facility}</span>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="alumni">
            <Card>
              <CardHeader>
                <CardTitle>Alumni Network ({alumni.length})</CardTitle>
              </CardHeader>
              <CardContent>
                {alumni.length > 0 ? (
                  <div className="grid md:grid-cols-2 gap-4">
                    {alumni.map((alum) => (
                      <div key={alum.id} className="p-4 bg-gray-50 rounded-lg">
                        <p className="font-medium text-gray-900">Batch {alum.batch_year}</p>
                        <p className="text-sm text-gray-600">{alum.current_profession || 'Professional'}</p>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-gray-600">No alumni profiles yet. Join the alumni network!</p>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="news">
            <Card>
              <CardHeader>
                <CardTitle>Latest News & Updates</CardTitle>
              </CardHeader>
              <CardContent>
                {news.length > 0 ? (
                  <div className="space-y-4">
                    {news.map((item) => (
                      <div key={item.id} className="p-4 bg-gray-50 rounded-lg">
                        <h3 className="font-bold text-gray-900 mb-2">{item.title}</h3>
                        <p className="text-gray-600 text-sm">{item.content}</p>
                        <p className="text-xs text-gray-500 mt-2">{new Date(item.created_at).toLocaleDateString()}</p>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-gray-600">No news updates available.</p>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="gallery">
            <Card>
              <CardHeader>
                <CardTitle>Photo Gallery</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid md:grid-cols-3 gap-4">
                  {['https://images.unsplash.com/flagged/photo-1574097656146-0b43b7660cb6?w=400',
                    'https://images.unsplash.com/photo-1731662262743-d4ed80b88672?w=400',
                    'https://images.unsplash.com/photo-1572847748080-bac263fae977?w=400',
                    'https://images.unsplash.com/photo-1600712300016-b47905e7aa39?w=400',
                    'https://images.unsplash.com/photo-1629273229664-11fabc0becc0?w=400',
                    'https://images.unsplash.com/photo-1571969878627-d5c8f8d15c78?w=400'
                  ].map((img, idx) => (
                    <img key={idx} src={img} alt={`Gallery ${idx + 1}`} className="w-full h-48 object-cover rounded-lg card-hover" />
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="needs">
            <Card>
              <CardHeader>
                <CardTitle>School Support Needs</CardTitle>
              </CardHeader>
              <CardContent>
                {needs.length > 0 ? (
                  <div className="space-y-4">
                    {needs.map((need) => (
                      <div key={need.id} className="p-6 bg-gradient-to-r from-blue-50 to-orange-50 rounded-lg">
                        <h3 className="font-bold text-gray-900 mb-2">{need.title}</h3>
                        <p className="text-gray-600 mb-3">{need.description}</p>
                        <div className="flex justify-between items-center">
                          <span className="text-sm text-gray-500">Category: {need.category}</span>
                          {need.target_amount && (
                            <span className="font-medium text-blue-600">Target: ₹{need.target_amount.toLocaleString()}</span>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-gray-600">No support needs posted at this time.</p>
                )}
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default SchoolDetails;
