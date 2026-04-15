-- Seed script for Bengaluru events
-- Bengaluru Center: 12.9716, 77.5946

-- Ensure at least one user exists
INSERT INTO users (name, email, password) 
VALUES ('System Admin', 'admin@eventlive.com', '$2y$10$PlaceholderHash') -- bcrypt hash for 'password'
ON CONFLICT (email) DO NOTHING;

-- Dummy Events
INSERT INTO events (title, description, category, latitude, longitude, location, start_time, end_time, created_by)
VALUES 
('Cubbon Park Clean-up Drive', 'Join us for our monthly clean-up drive at Cubbon Park. Let''s keep our lung space green!', 'social', 12.9733, 77.5913, ST_SetSRID(ST_Point(77.5913, 12.9733), 4326)::geography, NOW() + INTERVAL '1 day', NOW() + INTERVAL '1 day 4 hours', 1),
('Indiranagar Rooftop Party', 'A night of music and dance under the stars. Bring your friends!', 'party', 12.9784, 77.6408, ST_SetSRID(ST_Point(77.6408, 12.9784), 4326)::geography, NOW() + INTERVAL '2 days', NOW() + INTERVAL '2 days 6 hours', 1),
('Feeding Stray Dogs - Koramangala', 'Volunteer group meeting to distribute food and water to strays in the area.', 'social', 12.9279, 77.6271, ST_SetSRID(ST_Point(77.6271, 12.9279), 4326)::geography, NOW() + INTERVAL '5 hours', NOW() + INTERVAL '8 hours', 1),
('Tech Meetup: Web3 & AI', 'Discussion on the future of decentralised AI at 100ft road.', 'tech', 12.9719, 77.6412, ST_SetSRID(ST_Point(77.6412, 12.9719), 4326)::geography, NOW() + INTERVAL '3 days', NOW() + INTERVAL '3 days 3 hours', 1),
('Open Mic Night - Church Street', 'Express yourself! Poetry, music, and comedy welcome.', 'open_mic', 12.9745, 77.6009, ST_SetSRID(ST_Point(77.6009, 12.9745), 4326)::geography, NOW() + INTERVAL '1 day 6 hours', NOW() + INTERVAL '1 day 10 hours', 1);
