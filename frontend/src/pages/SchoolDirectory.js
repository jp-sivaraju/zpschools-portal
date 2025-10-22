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
    <div className="min-h-screen" style={{backgroundColor: 'var(--charcoal)'}}>
      <div className="gradient-mesh"></div>
      <NavBar />
      
      <div className="container mx-auto px-6 py-16 relative">
        <div className="max-w-7xl mx-auto">
          {/* Header */}
          <div className="text-center mb-16">
            <div className="inline-block px-4 py-2 rounded-full mb-6" style={{
              background: 'rgba(197, 165, 114, 0.15)',
              border: '1px solid var(--gold)'
            }}>
              <span style={{color: 'var(--gold)'}} className="text-sm font-semibold">
                📚 300+ Schools
              </span>
            </div>
            <h1 className="text-5xl md:text-6xl font-bold mb-6" style={{
              fontFamily: 'Libre Baskerville',
              color: 'var(--ivory)'
            }}>
              School Directory
            </h1>
            <p className="text-xl" style={{color: 'var(--ivory)', opacity: 0.7}}>
              Explore Zilla Parishad schools across Konaseema District
            </p>
          </div>

          {/* Search */}
          <div className="max-w-2xl mx-auto mb-16">
            <Input
              type="text"
              placeholder="Search schools by name..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full newsletter-input text-lg py-6"
              style={{
                background: 'rgba(255, 255, 255, 0.05)',
                border: '1px solid rgba(197, 165, 114, 0.2)',
                color: 'var(--ivory)'
              }}
              data-testid="school-search-input"
            />
          </div>

          {loading ? (
            <div className="grid md:grid-cols-3 gap-8">
              {[...Array(6)].map((_, i) => (
                <div key={i} className="skeleton-premium h-80 rounded-2xl"></div>
              ))}
            </div>
          ) : filteredSchools.length > 0 ? (
            <div className="grid md:grid-cols-3 gap-8">
              {filteredSchools.map((school) => (
                <Link to={`/schools/${school.id}`} key={school.id}>
                  <div className="glass-card p-8 rounded-2xl hover:scale-105 transition-all duration-300 h-full" data-testid={`school-card-${school.id}`}>
                    {/* School Icon */}
                    <div className="w-20 h-20 rounded-full mx-auto mb-6 flex items-center justify-center" style={{
                      background: 'linear-gradient(135deg, var(--crimson), var(--maroon))',
                      border: '3px solid var(--gold)'
                    }}>
                      <span className="text-3xl">🏫</span>
                    </div>
                    
                    <h3 className="text-2xl font-bold text-center mb-4" style={{
                      fontFamily: 'Libre Baskerville',
                      color: 'var(--ivory)'
                    }}>
                      {school.name}
                    </h3>
                    
                    <p className="text-center mb-4" style={{color: 'var(--gold)', fontSize: '14px'}}>
                      {school.address || 'Konaseema District, AP'}
                    </p>
                    
                    <div className="text-center">
                      <span className="inline-block px-4 py-2 rounded-full text-sm font-semibold" style={{
                        background: 'rgba(197, 165, 114, 0.15)',
                        color: 'var(--gold)'
                      }}>
                        View Details →
                      </span>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          ) : (
            <div className="text-center py-20">
              <div className="glass-card p-16 rounded-3xl max-w-2xl mx-auto">
                <div className="text-6xl mb-6">🏫</div>
                <h3 className="text-3xl font-bold mb-4" style={{fontFamily: 'Libre Baskerville', color: 'var(--ivory)'}}>
                  {search ? 'No schools found' : 'Schools Coming Soon'}
                </h3>
                <p style={{color: 'var(--ivory)', opacity: 0.7}}>
                  {search ? 'Try a different search term' : 'Our database is being updated with 300+ schools.'}
                </p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default SchoolDirectory;
