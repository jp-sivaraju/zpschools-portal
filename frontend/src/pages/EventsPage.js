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

  useEffect(() => {
    fetchEvents();
  }, []);

  const fetchEvents = async () => {
    try {
      const res = await axios.get(`${API}/events`);
      setEvents(res.data);
    } catch (error) {
      console.error('Error fetching events:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-orange-50">
      <NavBar />
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-6xl mx-auto">
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">Events Calendar</h1>
          <p className="text-lg text-gray-600 mb-8">Stay updated with upcoming school events, cultural activities, and programs</p>

          <div className="grid md:grid-cols-3 gap-8">
            {/* Calendar */}
            <Card className="md:col-span-1">
              <CardHeader>
                <CardTitle>Calendar</CardTitle>
              </CardHeader>
              <CardContent>
                <Calendar
                  mode="single"
                  selected={selectedDate}
                  onSelect={setSelectedDate}
                  className="rounded-md border"
                />
              </CardContent>
            </Card>

            {/* Events List */}
            <div className="md:col-span-2 space-y-4">
              <Card>
                <CardHeader>
                  <div className="flex justify-between items-center">
                    <CardTitle>Upcoming Events</CardTitle>
                    <Button className="bg-blue-600 hover:bg-blue-700" data-testid="create-event-btn">Create Event</Button>
                  </div>
                </CardHeader>
                <CardContent>
                  {loading ? (
                    <div className="space-y-4">
                      {[...Array(3)].map((_, i) => (
                        <div key={i} className="skeleton h-32 rounded-xl"></div>
                      ))}
                    </div>
                  ) : events.length > 0 ? (
                    <div className="space-y-4">
                      {events.map((event) => (
                        <div key={event.id} className="p-6 bg-gradient-to-r from-blue-50 to-white rounded-xl border border-gray-200 card-hover" data-testid={`event-${event.id}`}>
                          <h3 className="text-xl font-bold text-gray-900 mb-2">{event.title}</h3>
                          <p className="text-gray-600 mb-3">{event.description}</p>
                          <div className="flex justify-between items-center text-sm">
                            <span className="text-gray-500">
                              {new Date(event.event_date).toLocaleDateString('en-IN', {
                                year: 'numeric',
                                month: 'long',
                                day: 'numeric'
                              })}
                            </span>
                            <div className="flex space-x-2">
                              <Button variant="outline" size="sm" data-testid={`rsvp-btn-${event.id}`}>RSVP</Button>
                              <span className="text-green-600 font-medium">{event.rsvp_count} attending</span>
                            </div>
                          </div>
                          {event.location && (
                            <p className="text-sm text-gray-500 mt-2">Location: {event.location}</p>
                          )}
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="text-center py-12">
                      <img
                        src="https://images.unsplash.com/photo-1731662262743-d4ed80b88672?w=600"
                        alt="Cultural activities"
                        className="w-full max-w-md h-48 object-cover rounded-xl mx-auto mb-6"
                      />
                      <p className="text-gray-600 mb-4">No upcoming events scheduled.</p>
                      <Button className="bg-blue-600 hover:bg-blue-700" data-testid="create-first-event-btn">Create First Event</Button>
                    </div>
                  )}
                </CardContent>
              </Card>

              {/* Event Gallery */}
              <Card>
                <CardHeader>
                  <CardTitle>Event Gallery</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                    {[
                      'https://images.unsplash.com/photo-1731662262743-d4ed80b88672?w=400',
                      'https://images.unsplash.com/photo-1600712300016-b47905e7aa39?w=400',
                      'https://images.unsplash.com/flagged/photo-1574097656146-0b43b7660cb6?w=400',
                      'https://images.unsplash.com/photo-1572847748080-bac263fae977?w=400',
                      'https://images.unsplash.com/photo-1714194821788-6fd3634f01f1?w=400',
                      'https://images.unsplash.com/photo-1629273229664-11fabc0becc0?w=400'
                    ].map((img, idx) => (
                      <img
                        key={idx}
                        src={img}
                        alt={`Event ${idx + 1}`}
                        className="w-full h-32 object-cover rounded-lg card-hover"
                      />
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EventsPage;
