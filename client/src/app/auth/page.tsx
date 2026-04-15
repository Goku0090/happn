'use client';

import React, { useState } from 'react';
import axios from 'axios';
import { useRouter } from 'next/navigation';
import { Mail, Lock, User, MapPin } from 'lucide-react';

export default function AuthPage() {
    const [isLogin, setIsLogin] = useState(true);
    const [formData, setFormData] = useState({ name: '', email: '', password: '' });
    const router = useRouter();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        const url = isLogin ? '/api/auth/login' : '/api/auth/signup';
        const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';
        try {
            const res = await axios.post(`${API_URL}${url}`, formData);
            localStorage.setItem('token', res.data.token);
            localStorage.setItem('user', JSON.stringify(res.data.user));
            router.push('/');
        } catch (err: any) {
            console.error('Auth error:', err);
            alert('Authentication failed. Check console for details.');
        }
    };

    return (
        <div className="min-h-screen bg-black flex items-center justify-center p-4">
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,#1e3a8a,transparent_70%)] opacity-30"></div>
            
            <div className="w-full max-w-md bg-gray-900/50 backdrop-blur-xl border border-gray-800 rounded-3xl p-8 z-10 shadow-2xl">
                <div className="text-center mb-10">
                    <h1 className="text-4xl font-black bg-gradient-to-r from-blue-400 to-purple-500 bg-clip-text text-transparent italic">
                        EVENTLIVE
                    </h1>
                    <p className="text-gray-400 text-sm mt-2">
                        {isLogin ? 'Welcome back to the pulse.' : 'Join the heartbeat of your city.'}
                    </p>
                </div>

                <form onSubmit={handleSubmit} className="space-y-4">
                    {!isLogin && (
                        <div className="relative">
                            <User className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
                            <input 
                                required
                                placeholder="Full Name"
                                value={formData.name}
                                onChange={(e) => setFormData({...formData, name: e.target.value})}
                                className="w-full bg-gray-950/50 border border-gray-800 rounded-xl py-3.5 pl-12 pr-4 text-sm focus:border-blue-500 outline-none transition-all"
                            />
                        </div>
                    )}

                    <div className="relative">
                        <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
                        <input 
                            required
                            type="email"
                            placeholder="Email Address"
                            value={formData.email}
                            onChange={(e) => setFormData({...formData, email: e.target.value})}
                            className="w-full bg-gray-950/50 border border-gray-800 rounded-xl py-3.5 pl-12 pr-4 text-sm focus:border-blue-500 outline-none transition-all"
                        />
                    </div>

                    <div className="relative">
                        <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
                        <input 
                            required
                            type="password"
                            placeholder="Password"
                            value={formData.password}
                            onChange={(e) => setFormData({...formData, password: e.target.value})}
                            className="w-full bg-gray-950/50 border border-gray-800 rounded-xl py-3.5 pl-12 pr-4 text-sm focus:border-blue-500 outline-none transition-all"
                        />
                    </div>

                    <button 
                        type="submit"
                        className="w-full bg-blue-600 hover:bg-blue-700 py-4 rounded-xl font-bold mt-4 shadow-lg shadow-blue-500/20 transition-all active:scale-[0.98]"
                    >
                        {isLogin ? 'Enter App' : 'Create Account'}
                    </button>
                </form>

                <div className="mt-8 text-center text-sm text-gray-500">
                    {isLogin ? "Don't have an account? " : "Already a member? "}
                    <button 
                        onClick={() => setIsLogin(!isLogin)}
                        className="text-blue-400 font-semibold hover:underline"
                    >
                        {isLogin ? 'Sign up' : 'Login'}
                    </button>
                </div>
            </div>
        </div>
    );
}
