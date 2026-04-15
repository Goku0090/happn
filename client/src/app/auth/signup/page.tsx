'use client';

import React, { useState } from 'react';
import axios from 'axios';
import { User, Mail, Lock, ArrowRight, Flame } from 'lucide-react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

export default function SignupPage() {
    const [formData, setFormData] = useState({ name: '', email: '', password: '' });
    const [loading, setLoading] = useState(false);
    const router = useRouter();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        try {
            const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';
            const res = await axios.post(`${API_URL}/api/auth/signup`, formData);
            localStorage.setItem('token', res.data.token);
            localStorage.setItem('user', JSON.stringify(res.data.user));
            router.push('/');
        } catch (err) {
            alert('Error creating account');
        } finally {
            setLoading(false);
        }
    };

    // INLINE STYLES (MATCHING LOGIN)
    const containerStyle: React.CSSProperties = {
        minHeight: '100vh',
        backgroundColor: '#0c0c0e',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        overflow: 'hidden',
        position: 'relative',
        fontFamily: "'Inter', sans-serif"
    };

    const glassStyle: React.CSSProperties = {
        width: '440px',
        padding: '50px',
        backgroundColor: 'rgba(255, 255, 255, 0.01)',
        borderRadius: '32px',
        border: '1px solid rgba(255, 255, 255, 0.05)',
        backdropFilter: 'blur(20px)',
        boxShadow: '0 40px 100px rgba(0,0,0,0.5)',
        zIndex: 10,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center'
    };

    const inputContainerStyle: React.CSSProperties = {
        width: '100%',
        position: 'relative',
        marginBottom: '20px'
    };

    const inputStyle: React.CSSProperties = {
        width: '100%',
        backgroundColor: '#18181b',
        border: '1px solid rgba(255, 255, 255, 0.05)',
        borderRadius: '16px',
        padding: '16px 20px 16px 50px',
        color: 'white',
        fontSize: '14px',
        outline: 'none',
        boxSizing: 'border-box'
    };

    const buttonStyle: React.CSSProperties = {
        width: '100%',
        padding: '16px',
        backgroundColor: '#ffffff',
        color: '#000000',
        borderRadius: '16px',
        border: 'none',
        fontWeight: 900,
        fontSize: '14px',
        cursor: 'pointer',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        gap: '10px'
    };

    return (
        <div style={containerStyle}>
            <div style={{ position: 'absolute', top: '-100px', left: '-100px', width: '400px', height: '400px', background: 'radial-gradient(circle, rgba(16,185,129,0.1) 0%, transparent 70%)' }}></div>
            
            <div style={glassStyle}>
                <div style={{ width: '60px', height: '60px', backgroundColor: '#ffffff', borderRadius: '18px', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '30px', boxShadow: '0 10px 30px rgba(0,0,0,0.5)' }}>
                    <Flame size={32} color="#000000" />
                </div>
                
                <h1 style={{ margin: '0 0 10px', fontSize: '28px', fontWeight: 900, color: 'white', letterSpacing: '-0.02em' }}>Join EventLive</h1>
                <p style={{ margin: '0 0 40px', fontSize: '14px', color: '#52525b', fontWeight: 500 }}>Create your profile to start hosting experiences.</p>

                <form onSubmit={handleSubmit} style={{ width: '100%' }}>
                    <div style={inputContainerStyle}>
                        <User size={18} style={{ position: 'absolute', left: '18px', top: '50%', transform: 'translateY(-50%)', color: '#3f3f46' }} />
                        <input 
                            type="text" 
                            placeholder="Full Name" 
                            required
                            style={inputStyle}
                            value={formData.name}
                            onChange={(e) => setFormData({...formData, name: e.target.value})}
                        />
                    </div>

                    <div style={inputContainerStyle}>
                        <Mail size={18} style={{ position: 'absolute', left: '18px', top: '50%', transform: 'translateY(-50%)', color: '#3f3f46' }} />
                        <input 
                            type="email" 
                            placeholder="Email Address" 
                            required
                            style={inputStyle}
                            value={formData.email}
                            onChange={(e) => setFormData({...formData, email: e.target.value})}
                        />
                    </div>

                    <div style={inputContainerStyle}>
                        <Lock size={18} style={{ position: 'absolute', left: '18px', top: '50%', transform: 'translateY(-50%)', color: '#3f3f46' }} />
                        <input 
                            type="password" 
                            placeholder="Password" 
                            required
                            style={inputStyle}
                            value={formData.password}
                            onChange={(e) => setFormData({...formData, password: e.target.value})}
                        />
                    </div>

                    <button type="submit" style={buttonStyle} disabled={loading}>
                        {loading ? 'CREATING...' : 'CREATE ACCOUNT'} <ArrowRight size={18} />
                    </button>
                </form>

                <div style={{ marginTop: '30px', borderTop: '1px solid rgba(255, 255, 255, 0.05)', paddingTop: '30px', width: '100%', textAlign: 'center' }}>
                    <p style={{ fontSize: '14px', color: '#52525b' }}>
                        Already with us? {' '}
                        <Link href="/auth/login" style={{ color: '#ffffff', fontWeight: 900, textDecoration: 'none' }}>Sign In</Link>
                    </p>
                </div>
            </div>
        </div>
    );
}
