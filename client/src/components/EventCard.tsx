'use client';

import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { X, Users, Share2, Info, User, AlarmClock, MessageCircle, ArrowUpRight } from 'lucide-react';

interface EventCardProps {
    event: any;
    onClose: () => void;
    onOpenChat: (event: any) => void;
}

const EventCard: React.FC<EventCardProps> = ({ event, onClose, onOpenChat }) => {
    const [isClient, setIsClient] = useState(false);

    useEffect(() => {
        setIsClient(true);
    }, []);

    if (!event || !isClient) return null;

    const startTime = new Date(event.start_time);

    // INLINE STYLES FOR ABSOLUTE STABILITY
    const cardStyle: React.CSSProperties = {
        position: 'fixed',
        top: '50%',
        left: '50%',
        transform: 'translate(-50%, -50%)',
        width: '380px',
        backgroundColor: '#0c0c0e',
        color: '#ffffff',
        borderRadius: '40px',
        border: '1px solid rgba(255, 255, 255, 0.1)',
        boxShadow: '0 40px 100px rgba(0, 0, 0, 0.9)',
        zIndex: 999999,
        fontFamily: "'Inter', 'Segoe UI', Roboto, sans-serif",
        overflow: 'hidden',
        pointerEvents: 'auto',
        display: 'block'
    };

    const headerStyle: React.CSSProperties = {
        height: '160px',
        background: 'linear-gradient(135deg, #1e1e20 0%, #0c0c0e 100%)',
        padding: '30px',
        position: 'relative',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'flex-end',
        borderBottom: '1px solid rgba(255, 255, 255, 0.05)'
    };

    const gradientOverlay: React.CSSProperties = {
        position: 'absolute',
        inset: 0,
        background: 'linear-gradient(to top, #0c0c0e, transparent)',
        zIndex: 1
    };

    const categoryBadge: React.CSSProperties = {
        background: 'rgba(59, 130, 246, 0.15)',
        color: '#60a5fa',
        fontSize: '10px',
        fontWeight: 900,
        textTransform: 'uppercase',
        letterSpacing: '0.15em',
        padding: '4px 12px',
        borderRadius: '8px',
        marginBottom: '12px',
        display: 'inline-block',
        border: '1px solid rgba(59, 130, 246, 0.2)',
        position: 'relative',
        zIndex: 2
    };

    const titleStyle: React.CSSProperties = {
        fontSize: '28px',
        fontWeight: 900,
        lineHeight: 1.1,
        margin: 0,
        letterSpacing: '-0.02em',
        position: 'relative',
        zIndex: 2
    };

    const contentStyle: React.CSSProperties = {
        padding: '30px',
        display: 'flex',
        flexDirection: 'column',
        gap: '24px'
    };

    const statsGrid: React.CSSProperties = {
        display: 'grid',
        gridTemplateColumns: '1fr 1fr',
        gap: '12px'
    };

    const statBox: React.CSSProperties = {
        background: 'rgba(255, 255, 255, 0.03)',
        border: '1px solid rgba(255, 255, 255, 0.05)',
        padding: '16px',
        borderRadius: '24px',
        display: 'flex',
        flexDirection: 'column',
        gap: '4px'
    };

    const hostRow: React.CSSProperties = {
        display: 'flex',
        alignItems: 'center',
        gap: '16px',
        background: 'rgba(255, 255, 255, 0.02)',
        padding: '12px',
        borderRadius: '20px',
        border: '1px solid rgba(255, 255, 255, 0.05)'
    };

    const primaryButtonStyle: React.CSSProperties = {
        flex: 2,
        height: '56px',
        background: '#ffffff',
        color: '#000000',
        border: 'none',
        borderRadius: '20px',
        fontWeight: 900,
        fontSize: '13px',
        cursor: 'pointer',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        gap: '8px',
        boxShadow: '0 10px 30px rgba(255, 255, 255, 0.1)'
    };

    return (
        <div style={cardStyle}>
            {/* Header */}
            <div style={headerStyle}>
                <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(45deg, rgba(37, 99, 235, 0.15), rgba(139, 92, 246, 0.15))' }} />
                <div style={gradientOverlay} />
                
                <button 
                    onClick={onClose}
                    style={{
                        position: 'absolute',
                        top: '20px',
                        right: '20px',
                        width: '40px',
                        height: '40px',
                        borderRadius: '50%',
                        backgroundColor: 'rgba(255, 255, 255, 0.05)',
                        border: '1px solid rgba(255, 255, 255, 0.1)',
                        color: 'white',
                        cursor: 'pointer',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        zIndex: 10
                    }}
                >
                    <X size={20} />
                </button>

                <span style={categoryBadge}>{event.category || 'EVENT'}</span>
                <h2 style={titleStyle}>{event.title}</h2>
            </div>

            {/* Content */}
            <div style={contentStyle}>
                <div style={{ display: 'flex', gap: '8px', marginBottom: '20px' }}>
                    <div style={{ flex: 1, backgroundColor: 'rgba(255,255,255,0.03)', padding: '12px', borderRadius: '16px', border: '1px solid rgba(255,255,255,0.05)' }}>
                        <div style={{ fontSize: '10px', color: '#52525b', fontWeight: 900, marginBottom: '4px' }}>ATTENDING</div>
                        <div style={{ fontSize: '18px', fontWeight: 900 }}>{event.attendees || '15'}</div>
                    </div>
                    <div style={{ flex: 1, backgroundColor: 'rgba(255,255,255,0.03)', padding: '12px', borderRadius: '16px', border: '1px solid rgba(255,255,255,0.05)' }}>
                        <div style={{ fontSize: '10px', color: '#52525b', fontWeight: 900, marginBottom: '4px' }}>CAPACITY</div>
                        <div style={{ fontSize: '18px', fontWeight: 900 }}>50+</div>
                    </div>
                </div>

                <button 
                    onClick={async () => {
                        try {
                            const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';
                            const token = localStorage.getItem('token');
                            await axios.post(`${API_URL}/api/events/${event.id}/join`, {}, {
                                headers: { Authorization: `Bearer ${token}` }
                            });
                            alert('You have joined this experience! 🎉');
                        } catch (err) {
                            alert('Failed to join event.');
                        }
                    }}
                    style={{
                        width: '100%',
                        padding: '16px',
                        backgroundColor: '#ffffff',
                        color: '#000000',
                        borderRadius: '16px',
                        border: 'none',
                        fontWeight: 900,
                        fontSize: '14px',
                        cursor: 'pointer',
                        marginBottom: '12px',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        gap: '8px'
                    }}
                >
                    JOIN EXPERIENCE
                </button>

                <div style={hostRow}>
                    <div style={{ width: '44px', height: '44px', background: '#18181b', borderRadius: '16px', display: 'flex', alignItems: 'center', justifyContent: 'center', border: '1px solid rgba(255, 255, 255, 0.1)' }}>
                        <User size={20} color="#a1a1aa" />
                    </div>
                    <div style={{ flex: 1 }}>
                        <p style={{ margin: 0, fontSize: '9px', fontWeight: 900, color: '#52525b', textTransform: 'uppercase' }}>Organizer</p>
                        <p style={{ margin: 0, fontSize: '13px', fontWeight: 700 }}>Gautam Nair</p>
                    </div>
                    <button 
                        onClick={() => onOpenChat(event)}
                        style={{ width: '44px', height: '44px', background: '#2563eb', border: 'none', borderRadius: '16px', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer' }}
                    >
                        <MessageCircle size={20} color="white" />
                    </button>
                </div>

                <div style={{ minHeight: '60px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#52525b', marginBottom: '8px' }}>
                        <Info size={12} />
                        <span style={{ fontSize: '10px', fontWeight: 900, textTransform: 'uppercase', letterSpacing: '0.1em' }}>The Vibe</span>
                    </div>
                    <p style={{ margin: 0, fontSize: '14px', color: '#a1a1aa', lineHeight: 1.6, fontStyle: 'italic' }}>
                        "{event.description || 'Join us for an unforgettable moment in the city.'}"
                    </p>
                </div>

                <div style={{ display: 'flex', gap: '12px' }}>
                    <button 
                        onClick={() => {
                            window.open(`https://www.google.com/maps/dir/?api=1&destination=${event.latitude},${event.longitude}`, '_blank');
                        }}
                        style={primaryButtonStyle}
                    >
                        GET DIRECTIONS <ArrowUpRight size={16} />
                    </button>
                    <button style={{ flex: 1, height: '56px', background: '#18181b', border: '1px solid rgba(255,255,255,0.05)', borderRadius: '20px', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer' }}>
                        <Share2 size={20} color="#52525b" />
                    </button>
                </div>
            </div>
        </div>
    );
};

export default EventCard;
