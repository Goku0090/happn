'use client';

import React, { useEffect, useRef, useState } from 'react';
import mapboxgl from 'mapbox-gl';
import 'mapbox-gl/dist/mapbox-gl.css';

interface MapProps {
    events: any[];
    onMarkerClick: (event: any) => void;
    onMapClick: (coords: { lng: number, lat: number }) => void;
}

const Map = ({ events, onMarkerClick, onMapClick }: MapProps) => {
    const mapContainerRef = useRef<HTMLDivElement>(null);
    const mapRef = useRef<mapboxgl.Map | null>(null);
    const markersRef = useRef<mapboxgl.Marker[]>([]);

    const categoryEmojis: { [key: string]: string } = {
        party: '🎉',
        social: '🌱',
        tech: '💻',
        workshop: '🛠️',
        volunteering: '🤝',
        networking: '💼',
        music: '🎵',
        community: '🏘️'
    };

    const getEmoji = (category: string) => categoryEmojis[category.toLowerCase()] || '📍';
    const getCategoryColor = (category: string) => {
        switch (category.toLowerCase()) {
            case 'party': return '#f43f5e';
            case 'social': return '#10b981';
            case 'tech': return '#3b82f6';
            case 'volunteering': return '#10b981';
            case 'workshop': return '#f59e0b';
            case 'music': return '#8b5cf6';
            default: return '#3b82f6';
        }
    };

    useEffect(() => {
        mapboxgl.accessToken = process.env.NEXT_PUBLIC_MAPBOX_TOKEN || 'YOUR_MAPBOX_PUBLIC_TOKEN';

        if (mapContainerRef.current) {
            const map = new mapboxgl.Map({
                container: mapContainerRef.current,
                style: 'mapbox://styles/mapbox/dark-v11',
                center: [77.5946, 12.9716],
                zoom: 12,
            });

            mapRef.current = map;

            map.addControl(new mapboxgl.GeolocateControl({
                positionOptions: { enableHighAccuracy: true },
                trackUserLocation: true,
                showUserHeading: true
            }));

            map.on('click', (e) => {
                // Ignore clicks on markers (handled by markers)
                if ((e.originalEvent.target as HTMLElement).closest('.marker-pulse')) return;
                onMapClick({ lng: e.lngLat.lng, lat: e.lngLat.lat });
            });

            return () => map.remove();
        }
    }, []);

    useEffect(() => {
        if (!mapRef.current) return;

        // Clear existing markers properly
        markersRef.current.forEach(m => m.remove());
        markersRef.current = [];

        events.forEach(event => {
            const el = document.createElement('div');
            el.className = 'marker-pulse';
            el.innerHTML = `<span>${getEmoji(event.category)}</span>`;
            el.style.borderColor = getCategoryColor(event.category);

            const marker = new mapboxgl.Marker(el)
                .setLngLat([event.longitude, event.latitude])
                .addTo(mapRef.current!)
                .getElement().addEventListener('click', () => {
                    onMarkerClick(event);
                });
            
            // @ts-ignore - manual tracking since the event listener doesn't return the marker
            markersRef.current.push(new mapboxgl.Marker(el).setLngLat([event.longitude, event.latitude]).addTo(mapRef.current!));
        });
    }, [events]);

    return <div ref={mapContainerRef} style={{ width: '100%', height: '100%' }} />;
};

export default Map;
