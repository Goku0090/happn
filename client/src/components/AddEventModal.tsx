'use client';

import React, { useState } from 'react';
import { X, Calendar, Clock, MapPin, Type, AlignLeft, Tag, User } from 'lucide-react';
import axios from 'axios';

const AddEventModal = ({ onClose, initialCoords }: { onClose: () => void, initialCoords?: { lat: number, lng: number } }) => {
    const [formData, setFormData] = useState({
        title: '',
        description: '',
        category: 'social',
        start_time: '',
        end_time: '',
        latitude: initialCoords?.lat || 0,
        longitude: initialCoords?.lng || 0,
        organizer_name: '' 
    });

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            let finalLat = formData.latitude;
            let finalLng = formData.longitude;

            if (finalLat === 0) {
                const pos: any = await new Promise((resolve, reject) => {
                    navigator.geolocation.getCurrentPosition(resolve, reject);
                });
                finalLat = pos.coords.latitude;
                finalLng = pos.coords.longitude;
            }

            const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';
            const token = localStorage.getItem('token');
            const res = await axios.post(`${API_URL}/api/events`, {
                ...formData,
                latitude: finalLat,
                longitude: finalLng,
                start_time: formData.start_time || new Date().toISOString(),
                end_time: formData.end_time || new Date(Date.now() + 4 * 60 * 60 * 1000).toISOString()
            }, {
                headers: { Authorization: `Bearer ${token}` }
            });

            onClose();
            window.location.reload(); 
        } catch (err: any) {
            console.error('Error creating event:', err);
            const msg = err.response?.data?.message || 'Error creating event. Ensure all fields are valid.';
            alert(msg);
        }
    };

    // INLINE STYLES FOR STABILITY
    const backdropStyle: React.CSSProperties = {
        position: 'fixed',
        inset: 0,
        backgroundColor: 'rgba(0,0,0,0.85)',
        backdropFilter: 'blur(10px)',
        zIndex: 2000000,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '20px'
    };

    const modalStyle: React.CSSProperties = {
        width: '100%',
        maxW: '500px',
        backgroundColor: '#0c0c0e',
        borderRadius: '32px',
        border: '1px solid rgba(255,255,255,0.1)',
        overflow: 'hidden',
        boxShadow: '0 40px 100px rgba(0,0,0,0.9)',
        fontFamily: "'Inter', sans-serif"
    } as any; // MaxW handling

    const headerStyle: React.CSSProperties = {
        padding: '24px 30px',
        borderBottom: '1px solid rgba(255,255,255,0.05)',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center'
    };

    const inputStyle: React.CSSProperties = {
        width: '100%',
        backgroundColor: '#18181b',
        border: '1px solid rgba(255,255,255,0.05)',
        borderRadius: '16px',
        padding: '12px 16px 12px 44px',
        color: 'white',
        fontSize: '14px',
        outline: 'none',
        boxSizing: 'border-box'
    };

    const labelStyle: React.CSSProperties = {
        fontSize: '10px',
        fontWeight: 900,
        color: '#52525b',
        textTransform: 'uppercase',
        letterSpacing: '0.1em',
        marginBottom: '6px',
        display: 'block'
    };

    return (
        <div style={backdropStyle}>
            <div style={{ ...modalStyle, maxWidth: '500px' }}>
                <div style={headerStyle}>
                    <h2 style={{ margin: 0, fontSize: '20px', fontWeight: 900, color: 'white' }}>Host New Experience</h2>
                    <button onClick={onClose} style={{ background: 'none', border: 'none', color: '#52525b', cursor: 'pointer' }}>
                        <X size={24} />
                    </button>
                </div>

                <form onSubmit={handleSubmit} style={{ padding: '30px', display: 'flex', flexDirection: 'column', gap: '20px' }}>
                    
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                        
                        {/* Title */}
                        <div style={{ position: 'relative' }}>
                            <span style={labelStyle}>Experience Title</span>
                            <div style={{ position: 'relative' }}>
                                <Type size={16} style={{ position: 'absolute', left: '16px', top: '50%', transform: 'translateY(-50%)', color: '#3f3f46' }} />
                                <input 
                                    required
                                    value={formData.title}
                                    onChange={(e) => setFormData({...formData, title: e.target.value})}
                                    placeholder="e.g. Secret Rooftop Session"
                                    style={inputStyle}
                                />
                            </div>
                        </div>

                        {/* Description */}
                        <div>
                            <span style={labelStyle}>Manifesto / Details</span>
                            <div style={{ position: 'relative' }}>
                                <AlignLeft size={16} style={{ position: 'absolute', left: '16px', top: '16px', color: '#3f3f46' }} />
                                <textarea 
                                    value={formData.description}
                                    onChange={(e) => setFormData({...formData, description: e.target.value})}
                                    placeholder="Describe the energy of this event..."
                                    rows={3}
                                    style={{ ...inputStyle, paddingLeft: '44px', paddingTop: '14px', height: '100px', resize: 'none' }}
                                />
                            </div>
                        </div>

                        {/* Organizer Name */}
                        <div style={{ position: 'relative' }}>
                            <span style={labelStyle}>Host Name</span>
                            <div style={{ position: 'relative' }}>
                                <User size={16} style={{ position: 'absolute', left: '16px', top: '50%', transform: 'translateY(-50%)', color: '#3f3f46' }} />
                                <input 
                                    required
                                    value={formData.organizer_name}
                                    onChange={(e) => setFormData({...formData, organizer_name: e.target.value})}
                                    placeholder="Your Public Name"
                                    style={inputStyle}
                                />
                            </div>
                        </div>

                        {/* Category & Time Grid */}
                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                            <div>
                                <span style={labelStyle}>Category</span>
                                <div style={{ position: 'relative' }}>
                                    <Tag size={16} style={{ position: 'absolute', left: '16px', top: '50%', transform: 'translateY(-50%)', color: '#3f3f46', pointerEvents: 'none' }} />
                                    <select 
                                        value={formData.category}
                                        onChange={(e) => setFormData({...formData, category: e.target.value})}
                                        style={{ ...inputStyle, appearance: 'none', cursor: 'pointer' }}
                                    >
                                        <option value="social">🌱 Social</option>
                                        <option value="party">🎉 Party</option>
                                        <option value="workshop">🛠️ Workshop</option>
                                        <option value="volunteering">🤝 Volunteering</option>
                                    </select>
                                </div>
                            </div>
                            <div>
                                <span style={labelStyle}>Startup Time</span>
                                <div style={{ position: 'relative' }}>
                                    <Clock size={16} style={{ position: 'absolute', left: '16px', top: '50%', transform: 'translateY(-50%)', color: '#3f3f46' }} />
                                    <input 
                                        type="datetime-local"
                                        required
                                        value={formData.start_time}
                                        onChange={(e) => setFormData({...formData, start_time: e.target.value})}
                                        style={{ ...inputStyle, fontSize: '11px' }}
                                    />
                                </div>
                            </div>
                        </div>

                    </div>

                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#52525b', fontSize: '10px', fontWeight: 700 }}>
                        <MapPin size={12} />
                        {formData.latitude !== 0 ? `PINNED AT ${formData.latitude.toFixed(4)}, ${formData.longitude.toFixed(4)}` : 'USING CURRENT COORDINATES'}
                    </div>

                    <button 
                        type="submit"
                        style={{
                            background: 'white',
                            color: 'black',
                            border: 'none',
                            borderRadius: '16px',
                            padding: '16px',
                            fontWeight: 900,
                            fontSize: '14px',
                            cursor: 'pointer',
                            marginTop: '10px',
                            boxShadow: '0 20px 40px rgba(255,255,255,0.05)'
                        }}
                    >
                        PUBLISH EXPERIENCE
                    </button>
                    
                </form>
            </div>
        </div>
    );
};

export default AddEventModal;
