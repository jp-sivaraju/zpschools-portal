import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { API } from '../App';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import NavBar from '../components/NavBar';
import { Calendar } from '@/components/ui/calendar';

const EventsPage = () => {
  const [events, setEvents] = useState([]);
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [loading, setLoading] = useState(true);

  // Mock events
  const MOCK_EVENTS = [
    {
      id: 'e1',
      title: 'Alumni Reunion',
      description: 'Meet and network with fellow alumni.',
      event_date: '2025-01-15T10:00:00Z',
      location: 'ZPHS Amalapuram',
      rsvp_count: 42,
    },
    {
      id: 'e2',
      title: 'Career Fair',
      description: 'Companies hiring fresh graduates.',
      event_date: '2025-01-20T09:30:00Z',
      location: 'ZPHS Ravulapalem',
      rsvp_count: 30,
    },
    {
      id: 'e3',
      title: 'Sports Day',
      description: 'District-level athletic competitions.',
      event_date: '2025-02-05T08:00:00Z',
      location: 'ZPHS Mummidivaram',
      rsvp_count: 60,
    },
  ];

  useEffect(() => {
    fetchEvents();
  }, []);

  const fetchEvents = async () => {
    try {
      // Mock instead of API
      setEvents(MOCK_EVENTS);
    } catch (error) {
      console.error('Error fetching events:', error);
    } finally {
      setLoading(false);
    }
  };

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
                📅 Community Events
              </span>
            </div>
            <h1 className="text-5xl md:text-6xl font-bold mb-6" style={{
              fontFamily: 'Libre Baskerville',
              color: 'var(--ivory)'
            }}>
              Events & Programs
            </h1>
            <p className="text-xl" style={{color: 'var(--ivory)', opacity: 0.7}}>
              Stay connected with alumni gatherings, school celebrations, and educational programs
            </p>
          </div>

          <div className="grid lg:grid-cols-3 gap-8">
            {/* Calendar Card */}
            <div className="lg:col-span-1">
              <div className="glass-card p-8 rounded-3xl sticky top-24">
                <h2 className="text-2xl font-bold mb-6" style={{fontFamily: 'Libre Baskerville', color: 'var(--ivory)'}}>Calendar</h2>
                <Calendar
                  mode="single"
                  selected={selectedDate}
                  onSelect={setSelectedDate}
                  className="rounded-2xl"
                  style={{color: 'var(--ivory)'}}
                />
                <div className="mt-8 p-6 rounded-2xl text-center" style={{background: 'rgba(197, 165, 114, 0.1)'}}>
                  <div className="text-4xl mb-3">🎓</div>
                  <p className="font-semibold mb-2" style={{color: 'var(--ivory)'}}>Upcoming</p>
                  <p className="text-3xl font-bold" style={{color: 'var(--gold)'}}>{events.length}</p>
                  <p className="text-sm" style={{color: 'var(--ivory)', opacity: 0.7}}>Events This Month</p>
                </div>
              </div>
            </div>

            {/* Events List */}
            <div className="lg:col-span-2 space-y-6">
              <div className="flex justify-between items-center mb-8">
                <h2 className="text-3xl font-bold" style={{fontFamily: 'Libre Baskerville', color: 'var(--ivory)'}}>Upcoming Events</h2>
                <Button className="text-white px-6 py-3 rounded-xl font-semibold" style={{
                  background: 'linear-gradient(135deg, var(--crimson), var(--maroon))'
                }} data-testid="create-event-btn">
                  Create Event
                </Button>
              </div>

              {loading ? (
                <div className="space-y-6">
                  {[...Array(3)].map((_, i) => (
                    <div key={i} className="skeleton-premium h-48 rounded-2xl"></div>
                  ))}
                </div>
              ) : events.length > 0 ? (
                <div className="space-y-6">
                  {events.map((event) => (
                    <div key={event.id} className="glass-card p-8 rounded-3xl hover:scale-[1.02] transition-all" data-testid={`event-${event.id}`}>
                      <div className="flex items-start gap-6">
                        {/* Date Badge */}
                        <div className="shrink-0 text-center p-4 rounded-2xl" style={{
                          background: 'linear-gradient(135deg, var(--crimson), var(--maroon))',
                          width: '100px'
                        }}>
                          <p className="text-3xl font-bold text-white mb-1">
                            {new Date(event.event_date).getDate()}
                          </p>
                          <p className="text-sm text-white opacity-80">
                            {new Date(event.event_date).toLocaleDateString('en-US', { month: 'short', year: 'numeric' })}
                          </p>
                        </div>

                        {/* Event Details */}
                        <div className="flex-1">
                          <h3 className="text-2xl font-bold mb-3" style={{fontFamily: 'Libre Baskerville', color: 'var(--ivory)'}}>{
                            event.title}
                          </h3>
                          <p className="text-lg mb-4" style={{color: 'var(--ivory)', opacity: 0.8}}>{event.description}</p>
                          
                          {event.location && (
                            <p className="mb-4 flex items-center gap-2" style={{color: 'var(--gold)'}}>  
                              <span>📍</span> {event.location}
                            </p>
                          )}

                          <div className="flex items-center gap-4">
                            <Button className="px-6 py-2 rounded-xl font-semibold" style={{
                              border: '2px solid var(--gold)',
                              color: 'var(--gold)',
                              background: 'rgba(197, 165, 114, 0.1)'
                            }} data-testid={`rsvp-btn-${event.id}`}>
                              RSVP
                            </Button>
                            <span className="flex items-center gap-2" style={{color: 'var(--ivory)', opacity: 0.7}}>
                              <span className="text-xl">👥</span>
                              <span className="font-semibold" style={{color: 'var(--gold)'}}>{event.rsvp_count}</span> attending
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="glass-card p-16 rounded-3xl text-center">
                  <div className="text-6xl mb-6">📅</div>
                  <h3 className="text-3xl font-bold mb-4" style={{fontFamily: 'Libre Baskerville', color: 'var(--ivory)'}}>No Upcoming Events</h3>
                  <p className="text-lg mb-8" style={{color: 'var(--ivory)', opacity: 0.7}}>Check back soon for exciting alumni gatherings and school programs!</p>
                  <Button className="text-white px-8 py-4 rounded-xl font-semibold" style={{
                    background: 'linear-gradient(135deg, var(--crimson), var(--maroon))'
                  }} data-testid="create-first-event-btn">
                    Create First Event
                  </Button>
                </div>
              )}
            </div>
          </div>

          {/* Event Categories */}
          <div className="mt-20">
            <h2 className="text-4xl font-bold text-center mb-12" style={{fontFamily: 'Libre Baskerville', color: 'var(--ivory)'}}>Event Categories</h2>
            <div className="grid md:grid-cols-4 gap-6">
              {[
                { icon: '🎓', title: 'Reunions', desc: 'Alumni batch reunions' },
                { icon: '💼', title: 'Career Fairs', desc: 'Job & networking events' },
                { icon: '🎭', title: 'Cultural', desc: 'Festivals & celebrations' },
                { icon: '🏆', title: 'Sports', desc: 'Athletic competitions' }
              ].map((category, idx) => (
                <div key={idx} className="glass-card p-8 rounded-2xl text-center hover:scale-105 transition-all cursor-pointer">
                  <div className="text-5xl mb-4">{category.icon}</div>
                  <h3 className="text-xl font-bold mb-2" style={{fontFamily: 'Libre Baskerville', color: 'var(--ivory)'}}>{
                    category.title}
                  </h3>
                  <p className="text-sm" style={{color: 'var(--ivory)', opacity: 0.7}}>{category.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EventsPage;
