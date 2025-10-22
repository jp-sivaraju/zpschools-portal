import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { API } from '../App';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import NavBar from '../components/NavBar';

const SchoolDirectory = () => {
  const [schools, setSchools] = useState([]);
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchSchools();
  }, []);

  const fetchSchools = async () => {
    try {
      const res = await axios.get(`${API}/schools`);
      setSchools(res.data);
    } catch (error) {
      console.error('Error fetching schools:', error);
    } finally {
      setLoading(false);
    }
  };

  const filteredSchools = schools.filter(school =>
    school.name.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-orange-50">
      <NavBar />
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-6xl mx-auto">
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">School Directory</h1>
          <p className="text-lg text-gray-600 mb-8">Explore 300+ Zilla Parishad schools across Konaseema District</p>

          <div className="mb-8">
            <Input
              type="text"
              placeholder="Search schools by name..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="max-w-md"
              data-testid="school-search-input"
            />
          </div>

          {loading ? (
            <div className="grid md:grid-cols-3 gap-6">
              {[...Array(6)].map((_, i) => (
                <div key={i} className="skeleton h-64 rounded-xl"></div>
              ))}
            </div>
          ) : filteredSchools.length > 0 ? (
            <div className="grid md:grid-cols-3 gap-6">
              {filteredSchools.map((school) => (
                <Link to={`/schools/${school.id}`} key={school.id}>
                  <Card className="card-hover h-full" data-testid={`school-card-${school.id}`}>
                    <div className="h-40 bg-gradient-to-br from-blue-500 to-orange-400 rounded-t-xl"></div>
                    <CardHeader>
                      <CardTitle className="text-xl">{school.name}</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <p className="text-gray-600 text-sm mb-2">{school.address || 'Konaseema District'}</p>
                      <p className="text-blue-600 font-medium">View Details →</p>
                    </CardContent>
                  </Card>
                </Link>
              ))}
            </div>
          ) : (
            <Card className="text-center py-12">
              <CardContent>
                <p className="text-gray-600 text-lg">No schools found. Check back soon!</p>
                <p className="text-sm text-gray-500 mt-2">Our database is being updated with 300+ schools.</p>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
};

export default SchoolDirectory;
