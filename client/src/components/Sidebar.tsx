'use client';

import React from 'react';
import { MapPin, Filter, Search } from 'lucide-react';

interface SidebarProps {
    events: any[];
    onEventClick: (event: any) => void;
}

const Sidebar = ({ events, onEventClick }: SidebarProps) => {
    // INLINE STYLES
    const sidebarStyle: React.CSSProperties = {
        width: '340px',
        backgroundColor: '#0c0c0e',
        borderRight: '1px solid rgba(255, 255, 255, 0.1)',
        display: 'flex',
        flexDirection: 'column',
        zIndex: 1000,
        height: '100%',
        boxSizing: 'border-box',
        fontFamily: "'Inter', sans-serif"
    };

    const headerStyle: React.CSSProperties = {
        padding: '30px',
        borderBottom: '1px solid rgba(255, 255, 255, 0.05)',
        backgroundColor: 'rgba(255, 255, 255, 0.01)'
    };

    const scrollAreaStyle: React.CSSProperties = {
        flex: 1,
        overflowY: 'auto',
        padding: '24px',
        display: 'flex',
        flexDirection: 'column',
        gap: '16px'
    };

    const cardStyle: React.CSSProperties = {
        padding: '20px',
        backgroundColor: '#18181b',
        border: '1px solid rgba(255, 255, 255, 0.05)',
        borderRadius: '24px',
        cursor: 'pointer',
        transition: 'all 0.2s ease',
        position: 'relative',
        display: 'block'
    };

    const getCategoryBadgeStyle = (category: string): React.CSSProperties => {
        let color = '#a1a1aa';
        let bg = 'rgba(255, 255, 255, 0.05)';
        
        if (category === 'party') { color = '#f43f5e'; bg = 'rgba(244, 63, 94, 0.1)'; }
        else if (category === 'social') { color = '#10b981'; bg = 'rgba(16, 185, 129, 0.1)'; }
        else if (category === 'tech') { color = '#3b82f6'; bg = 'rgba(59, 130, 246, 0.1)'; }
        else if (category === 'workshop') { color = '#f59e0b'; bg = 'rgba(245, 158, 11, 0.1)'; }

        return {
            fontSize: '9px',
            fontWeight: 900,
            textTransform: 'uppercase',
            letterSpacing: '0.1em',
            padding: '4px 10px',
            borderRadius: '6px',
            color,
            backgroundColor: bg,
            border: `1px solid ${color}33`,
            display: 'inline-block'
        };
    };

    return (
        <aside style={sidebarStyle}>
            <div style={headerStyle}>
                <h1 style={{ margin: 0, fontSize: '24px', fontWeight: 900, color: 'white', letterSpacing: '-0.04em', fontStyle: 'italic' }}>
                    EventLive
                </h1>
                <p style={{ margin: '4px 0 0', fontSize: '11px', color: '#52525b', fontWeight: 700 }}>Pulse of Bengaluru</p>
            </div>

            <div style={{ ...scrollAreaStyle, flex: 1 }} className="no-scrollbar">
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '0 8px 8px' }}>
                    <span style={{ fontSize: '10px', fontWeight: 900, color: '#3f3f46', letterSpacing: '0.15em' }}>
                        NEARBY EXPERIENCES ({events.length})
                    </span>
                    <Filter size={14} color="#3f3f46" />
                </div>

                {events.map((event) => (
                    <div 
                        key={event.id}
                        onClick={() => onEventClick(event)}
                        style={cardStyle}
                        onMouseEnter={(e) => {
                            e.currentTarget.style.borderColor = 'rgba(255,255,255,0.2)';
                            e.currentTarget.style.backgroundColor = '#1c1c20';
                        }}
                        onMouseLeave={(e) => {
                            e.currentTarget.style.borderColor = 'rgba(255,255,255,0.05)';
                            e.currentTarget.style.backgroundColor = '#18181b';
                        }}
                    >
                        <span style={getCategoryBadgeStyle(event.category)}>{event.category || 'General'}</span>
                        <h3 style={{ margin: '12px 0 8px', fontSize: '16px', fontWeight: 800, color: 'white', lineHeight: 1.3 }}>
                            {event.title}
                        </h3>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#52525b', fontSize: '11px', fontWeight: 700 }}>
                            <MapPin size={12} />
                            <span>{Math.round(event.distance / 100) / 10} km away</span>
                        </div>
                    </div>
                ))}
            </div>

            {/* Auth Footer */}
            <div style={{ padding: '24px', borderTop: '1px solid rgba(255, 255, 255, 0.05)' }}>
                <button 
                    onClick={() => window.location.href = '/auth/login'}
                    style={{
                        width: '100%',
                        padding: '14px',
                        backgroundColor: 'rgba(255, 255, 255, 0.03)',
                        border: '1px solid rgba(255, 255, 255, 0.05)',
                        borderRadius: '16px',
                        color: 'white',
                        fontSize: '13px',
                        fontWeight: 900,
                        cursor: 'pointer'
                    }}
                >
                    SIGN IN TO HOST
                </button>
            </div>
        </aside>
    );
};

export default Sidebar;
