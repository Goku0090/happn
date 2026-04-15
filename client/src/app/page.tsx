'use client';

import React, { useState, useEffect } from 'react';
import Map from '@/components/Map';
import Sidebar from '@/components/Sidebar';
import EventCard from '@/components/EventCard';
import ChatOverlay from '@/components/ChatOverlay';
import AddEventModal from '@/components/AddEventModal';
import { Plus } from 'lucide-react';
import CategoryFilter from '@/components/CategoryFilter';
import io from 'socket.io-client';
import axios from 'axios';
import { AnimatePresence } from 'framer-motion';
import { useRouter } from 'next/navigation';

const socket = io(process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000');

export default function Home() {
    const [events, setEvents] = useState<any[]>([]);
    const [filteredEvents, setFilteredEvents] = useState<any[]>([]);
    const [activeCategory, setActiveCategory] = useState('all');
    const [selectedEvent, setSelectedEvent] = useState<any>(null);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [chatEvent, setChatEvent] = useState<any>(null);
    const [isCheckingAuth, setIsCheckingAuth] = useState(true);
    const router = useRouter();

    useEffect(() => {
        const token = localStorage.getItem('token');
        if (!token) {
            router.push('/auth/login');
        } else {
            setIsCheckingAuth(false);
        }
    }, [router]);

    useEffect(() => {
        const token = localStorage.getItem('token');
        if (!token) return;

        const fetchEvents = async () => {
            try {
                const res = await axios.get('http://localhost:5000/api/events?lat=12.9716&lng=77.5946&radius=50000');
                setEvents(res.data);
            } catch (err) {
                console.error('Error fetching events:', err);
            }
        };

        fetchEvents();

        socket.on('new_event', (newEvent) => {
            setEvents((prev) => [...prev, newEvent]);
        });

        return () => {
            socket.off('new_event');
        };
    }, []);

    useEffect(() => {
        if (activeCategory === 'all') {
            setFilteredEvents(events);
        } else {
            setFilteredEvents(events.filter(ev => ev.category === (activeCategory === 'community' ? 'volunteering' : activeCategory)));
        }
    }, [activeCategory, events]);

    if (isCheckingAuth) {
        return <div style={{ height: '100vh', width: '100vw', backgroundColor: '#000', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <div style={{ color: '#52525b', fontWeight: 900, fontSize: '12px', letterSpacing: '0.2em' }}>AUTHENTICATING...</div>
        </div>;
    }

    return (
        <main style={{ display: 'flex', flexDirection: 'column', height: '100vh', width: '100vw', overflow: 'hidden', backgroundColor: '#000', color: 'white' }}>
            
            <CategoryFilter activeCategory={activeCategory} onCategoryChange={setActiveCategory} />
            
            <div style={{ flex: 1, display: 'flex', overflow: 'hidden', position: 'relative' }}>
                <Sidebar events={filteredEvents} onEventClick={setSelectedEvent} />
                
                <div style={{ flex: 1, position: 'relative' }}>
                    <Map 
                        events={filteredEvents} 
                        onMarkerClick={setSelectedEvent} 
                        onMapClick={(coords) => {
                            setSelectedEvent(null);
                            setIsModalOpen(true);
                            setChatEvent(null);
                            // Pass coordinates to the modal state
                            (window as any).__pickedCoords = { lat: coords.lat, lng: coords.lng };
                        }}
                    />

                    {/* ADD EVENT BUTTON - FORCED VISIBILITY */}
                    <button 
                        onClick={() => setIsModalOpen(true)}
                        style={{
                            position: 'absolute',
                            bottom: '40px',
                            right: '40px',
                            width: '64px',
                            height: '64px',
                            backgroundColor: '#ffffff',
                            borderRadius: '50%',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            zIndex: 2000,
                            border: 'none',
                            boxShadow: '0 10px 40px rgba(0,0,0,0.5)',
                            cursor: 'pointer',
                            transition: 'transform 0.2s ease'
                        }}
                        onMouseEnter={(e) => e.currentTarget.style.transform = 'scale(1.1) rotate(90deg)'}
                        onMouseLeave={(e) => e.currentTarget.style.transform = 'scale(1) rotate(0deg)'}
                    >
                        <Plus size={32} color="#000000" />
                    </button>
                </div>
            </div>

            {/* ROOT LEVEL OVERLAYS - STABLE RENDERING */}
            <AnimatePresence>
                {selectedEvent && (
                    <EventCard 
                        event={selectedEvent} 
                        onClose={() => setSelectedEvent(null)} 
                        onOpenChat={(ev) => {
                            setSelectedEvent(null);
                            setChatEvent(ev);
                        }}
                    />
                )}
            </AnimatePresence>

            <AnimatePresence>
                {chatEvent && (
                    <ChatOverlay 
                        event={chatEvent} 
                        onClose={() => setChatEvent(null)} 
                    />
                )}
            </AnimatePresence>

            {isModalOpen && (
                <AddEventModal 
                    initialCoords={(window as any).__pickedCoords}
                    onClose={() => {
                        setIsModalOpen(false);
                        (window as any).__pickedCoords = null;
                    }} 
                />
            )}
        </main>
    );
}
