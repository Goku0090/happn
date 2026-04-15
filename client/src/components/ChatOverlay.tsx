'use client';

import React, { useState, useEffect, useRef } from 'react';
import { X, Send, User, MessageCircle } from 'lucide-react';
import io from 'socket.io-client';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';
const socket = io(API_URL);

interface ChatOverlayProps {
    event: any;
    onClose: () => void;
}

const ChatOverlay: React.FC<ChatOverlayProps> = ({ event, onClose }) => {
    const [messages, setMessages] = useState<any[]>([]);
    const [inputValue, setInputValue] = useState('');
    const scrollRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const handleNewMessage = (msg: any) => {
            if (msg.event_id === event.id) {
                setMessages(prev => [...prev, msg]);
            }
        };
        socket.on('chat_message', handleNewMessage);
        return () => { socket.off('chat_message', handleNewMessage); };
    }, [event.id]);

    useEffect(() => {
        if (scrollRef.current) {
            scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
        }
    }, [messages]);

    const handleSend = () => {
        if (!inputValue.trim()) return;
        const newMsg = {
            id: Date.now(),
            content: inputValue,
            sender: 'You',
            event_id: event.id,
            created_at: new Date().toISOString()
        };
        setMessages(prev => [...prev, newMsg]);
        setInputValue('');
    };

    // INLINE STYLES
    const overlayStyle: React.CSSProperties = {
        position: 'fixed',
        top: 0,
        right: 0,
        height: '100vh',
        width: '400px',
        backgroundColor: '#0c0c0e',
        borderLeft: '1px solid rgba(255, 255, 255, 0.1)',
        zIndex: 1000000,
        display: 'flex',
        flexDirection: 'column',
        fontFamily: "'Inter', sans-serif",
        boxShadow: '-20px 0 50px rgba(0, 0, 0, 0.5)',
        pointerEvents: 'auto'
    };

    const headerStyle: React.CSSProperties = {
        padding: '30px',
        borderBottom: '1px solid rgba(255, 255, 255, 0.05)',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center'
    };

    const messagesAreaStyle: React.CSSProperties = {
        flex: 1,
        overflowY: 'auto',
        padding: '30px',
        display: 'flex',
        flexDirection: 'column',
        gap: '20px'
    };

    const inputAreaStyle: React.CSSProperties = {
        padding: '30px',
        borderTop: '1px solid rgba(255, 255, 255, 0.05)',
        backgroundColor: 'rgba(255, 255, 255, 0.01)'
    };

    return (
        <div style={overlayStyle}>
            {/* Header */}
            <div style={headerStyle}>
                <div>
                    <h3 style={{ margin: 0, fontSize: '20px', fontWeight: 900, color: 'white', letterSpacing: '-0.02em' }}>
                        Live Chat
                    </h3>
                    <p style={{ margin: '4px 0 0', fontSize: '10px', fontWeight: 700, color: '#52525b', textTransform: 'uppercase', letterSpacing: '0.1em' }}>
                        Event: {event.title}
                    </p>
                </div>
                <button 
                    onClick={onClose}
                    style={{ background: 'none', border: 'none', color: '#52525b', cursor: 'pointer', padding: '8px' }}
                >
                    <X size={24} />
                </button>
            </div>

            {/* Messages */}
            <div style={messagesAreaStyle} ref={scrollRef} className="no-scrollbar">
                {messages.length === 0 && (
                    <div style={{ height: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', opacity: 0.2, textAlign: 'center' }}>
                        <MessageCircle size={48} />
                        <p style={{ fontSize: '12px', fontWeight: 700, textTransform: 'uppercase', marginTop: '16px' }}>
                            Ask the organizer<br/>anything about this event.
                        </p>
                    </div>
                )}
                {messages.map((msg) => (
                    <div 
                        key={msg.id} 
                        style={{ alignSelf: msg.sender === 'You' ? 'flex-end' : 'flex-start', maxWidth: '85%' }}
                    >
                        <div style={{
                            padding: '16px',
                            borderRadius: msg.sender === 'You' ? '20px 20px 4px 20px' : '20px 20px 20px 4px',
                            backgroundColor: msg.sender === 'You' ? '#2563eb' : '#18181b',
                            color: 'white',
                            fontSize: '14px',
                            lineHeight: 1.5,
                            border: msg.sender === 'You' ? 'none' : '1px solid rgba(255, 255, 255, 0.05)'
                        }}>
                            {msg.content}
                        </div>
                        <p style={{ margin: '6px 0 0', fontSize: '9px', fontWeight: 900, color: '#3f3f46', textAlign: msg.sender === 'You' ? 'right' : 'left' }}>
                            {new Date(msg.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                        </p>
                    </div>
                ))}
            </div>

            {/* Input */}
            <div style={inputAreaStyle}>
                <div style={{ position: 'relative' }}>
                    <input 
                        value={inputValue}
                        onChange={(e) => setInputValue(e.target.value)}
                        onKeyDown={(e) => e.key === 'Enter' && handleSend()}
                        placeholder="Type your message..."
                        style={{
                            width: '100%',
                            backgroundColor: '#18181b',
                            border: '1px solid rgba(255, 255, 255, 0.1)',
                            borderRadius: '16px',
                            padding: '16px 50px 16px 20px',
                            color: 'white',
                            fontSize: '14px',
                            outline: 'none',
                            boxSizing: 'border-box'
                        }}
                    />
                    <button 
                        onClick={handleSend}
                        style={{
                            position: 'absolute',
                            right: '8px',
                            top: '50%',
                            transform: 'translateY(-50%)',
                            width: '40px',
                            height: '40px',
                            backgroundColor: '#2563eb',
                            border: 'none',
                            borderRadius: '12px',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            cursor: 'pointer'
                        }}
                    >
                        <Send size={18} color="white" />
                    </button>
                </div>
            </div>
        </div>
    );
};

export default ChatOverlay;
