-- Create sessions table for tracking user chat sessions
CREATE TABLE IF NOT EXISTS sessions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID,
  started_at TIMESTAMPTZ DEFAULT now()
);

-- Create messages table for storing chat history
CREATE TABLE IF NOT EXISTS messages (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  session_id UUID REFERENCES sessions(id) ON DELETE CASCADE,
  sender TEXT CHECK (sender IN ('user', 'bot')),
  content TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- Create FAQs table for predefined question-answer pairs
CREATE TABLE IF NOT EXISTS faqs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  question TEXT NOT NULL,
  answer TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- Create escalations table for tracking unresolved queries
CREATE TABLE IF NOT EXISTS escalations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  session_id UUID REFERENCES sessions(id) ON DELETE CASCADE,
  user_message TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT now(),
  resolved BOOLEAN DEFAULT false
);

-- Enable Row Level Security
ALTER TABLE sessions ENABLE ROW LEVEL SECURITY;
ALTER TABLE messages ENABLE ROW LEVEL SECURITY;
ALTER TABLE faqs ENABLE ROW LEVEL SECURITY;
ALTER TABLE escalations ENABLE ROW LEVEL SECURITY;

-- RLS Policies for sessions (public access for demo)
CREATE POLICY "Enable read access for all users" ON sessions FOR SELECT USING (true);
CREATE POLICY "Enable insert access for all users" ON sessions FOR INSERT WITH CHECK (true);

-- RLS Policies for messages (public access for demo)
CREATE POLICY "Enable read access for all users" ON messages FOR SELECT USING (true);
CREATE POLICY "Enable insert access for all users" ON messages FOR INSERT WITH CHECK (true);

-- RLS Policies for faqs (read-only for users)
CREATE POLICY "Enable read access for all users" ON faqs FOR SELECT USING (true);

-- RLS Policies for escalations (public access for demo)
CREATE POLICY "Enable read access for all users" ON escalations FOR SELECT USING (true);
CREATE POLICY "Enable insert access for all users" ON escalations FOR INSERT WITH CHECK (true);

-- Insert sample FAQs
INSERT INTO faqs (question, answer) VALUES
  ('What are your business hours?', 'We are open Monday to Friday, 9 AM to 6 PM EST. Our support team is available during these hours to assist you.'),
  ('How do I reset my password?', 'Click on "Forgot Password" on the login page, enter your email, and follow the instructions sent to your inbox.'),
  ('What payment methods do you accept?', 'We accept all major credit cards (Visa, Mastercard, Amex), PayPal, and bank transfers for enterprise customers.'),
  ('How long does shipping take?', 'Standard shipping takes 5-7 business days. Express shipping (2-3 days) is available for an additional fee.'),
  ('What is your refund policy?', 'We offer a 30-day money-back guarantee on all products. Contact support to initiate a return.');

-- Create index for faster session lookups
CREATE INDEX idx_messages_session_id ON messages(session_id);
CREATE INDEX idx_escalations_session_id ON escalations(session_id);