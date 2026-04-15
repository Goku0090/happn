'use client';

import React from 'react';
import { PartyPopper, Flame, Music, BookOpen, Heart, Briefcase } from 'lucide-react';

const categories = [
    { id: 'all', label: 'All Events', icon: Flame },
    { id: 'party', label: 'Parties', icon: PartyPopper },
    { id: 'music', label: 'Concerts', icon: Music },
    { id: 'workshop', label: 'Workshops', icon: BookOpen },
    { id: 'volunteering', label: 'Volunteers', icon: Heart },
    { id: 'networking', label: 'Networking', icon: Briefcase },
];

interface CategoryFilterProps {
    activeCategory: string;
    onCategoryChange: (id: string) => void;
}

const CategoryFilter: React.FC<CategoryFilterProps> = ({ activeCategory, onCategoryChange }) => {
    // INLINE STYLES
    const containerStyle: React.CSSProperties = {
        padding: '16px 30px',
        backgroundColor: 'rgba(12, 12, 14, 0.9)',
        backdropFilter: 'blur(20px)',
        borderBottom: '1px solid rgba(255, 255, 255, 0.05)',
        display: 'flex',
        gap: '12px',
        overflowX: 'auto',
        zIndex: 1000,
        position: 'sticky',
        top: 0,
        fontFamily: "'Inter', sans-serif"
    };

    const getButtonStyle = (id: string): React.CSSProperties => {
        const isActive = activeCategory === id;
        return {
            display: 'flex',
            alignItems: 'center',
            gap: '10px',
            padding: '10px 20px',
            borderRadius: '16px',
            border: isActive ? '1px solid #3b82f6' : '1px solid rgba(255, 255, 255, 0.1)',
            backgroundColor: isActive ? 'rgba(59, 130, 246, 0.1)' : 'rgba(255, 255, 255, 0.03)',
            color: isActive ? '#60a5fa' : '#a1a1aa',
            cursor: 'pointer',
            whiteSpace: 'nowrap',
            fontSize: '13px',
            fontWeight: 800,
            transition: 'all 0.2s ease'
        };
    };

    return (
        <div style={containerStyle} className="no-scrollbar">
            {categories.map((cat) => (
                <button
                    key={cat.id}
                    onClick={() => onCategoryChange(cat.id)}
                    style={getButtonStyle(cat.id)}
                    onMouseEnter={(e) => {
                        if (activeCategory !== cat.id) {
                            e.currentTarget.style.backgroundColor = 'rgba(255, 255, 255, 0.06)';
                            e.currentTarget.style.color = 'white';
                        }
                    }}
                    onMouseLeave={(e) => {
                        if (activeCategory !== cat.id) {
                            e.currentTarget.style.backgroundColor = 'rgba(255, 255, 255, 0.03)';
                            e.currentTarget.style.color = '#a1a1aa';
                        }
                    }}
                >
                    <cat.icon size={16} />
                    <span>{cat.label}</span>
                </button>
            ))}
        </div>
    );
};

export default CategoryFilter;
