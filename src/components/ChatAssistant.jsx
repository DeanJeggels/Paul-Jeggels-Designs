import React, { useState, useRef, useEffect } from 'react';
import { Search, Send, X, Loader, User, Bot } from 'lucide-react';
import { supabase } from '../lib/supabase';

const CHAT_ENDPOINT = `${import.meta.env.VITE_SUPABASE_URL || 'https://dplbfhwqbmnzmrncxain.supabase.co'}/functions/v1/chat`;
const ANON_KEY = import.meta.env.VITE_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImRwbGJmaHdxYm1uem1ybmN4YWluIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDUyNjIxNjgsImV4cCI6MjA2MDgzODE2OH0.e1SJPplUC8izzANfVYT1VNNBAZT2Ki6kivDt6lYjxIY';

const MAX_MESSAGES_PER_SESSION = 30;

const ChatAssistant = ({ onOpenQuiz }) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const [input, setInput] = useState('');
  const [messages, setMessages] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [messageCount, setMessageCount] = useState(0);
  const messagesContainerRef = useRef(null);
  const inputRef = useRef(null);

  useEffect(() => {
    const container = messagesContainerRef.current;
    if (container) {
      container.scrollTop = container.scrollHeight;
    }
  }, [messages]);

  const sendMessage = async (e) => {
    e.preventDefault();
    const text = input.trim();
    if (!text || isLoading) return;

    if (messageCount >= MAX_MESSAGES_PER_SESSION) {
      setMessages((prev) => [...prev, {
        role: 'assistant',
        content: "You've reached the message limit for this session. Contact Paul directly at +27 82 960 9353 or try the board quiz!",
      }]);
      return;
    }

    // If not expanded yet, expand on first message
    if (!isExpanded) {
      setIsExpanded(true);
    }

    const userMsg = { role: 'user', content: text };
    setMessages((prev) => [...prev, userMsg]);
    setInput('');
    setIsLoading(true);
    setMessageCount((c) => c + 1);

    try {
      const response = await fetch(CHAT_ENDPOINT, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${ANON_KEY}`,
        },
        body: JSON.stringify({
          message: text,
          history: messages.slice(-10),
        }),
      });

      const data = await response.json();
      setMessages((prev) => [...prev, { role: 'assistant', content: data.reply || "I'm not sure about that. Try the board quiz or contact Paul directly." }]);
    } catch {
      setMessages((prev) => [...prev, {
        role: 'assistant',
        content: "I'm having trouble connecting right now. You can reach Paul at +27 82 960 9353 or try the board quiz.",
      }]);
    } finally {
      setIsLoading(false);
      inputRef.current?.focus();
    }
  };

  // Collapsed state — just the search input
  if (!isExpanded) {
    return (
      <form onSubmit={sendMessage} className="max-w-xl">
        <div className="relative">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-white/30" />
          <input
            ref={inputRef}
            type="text"
            placeholder="Ask anything about custom boards..."
            value={input}
            onChange={(e) => setInput(e.target.value)}
            className="w-full bg-white/10 backdrop-blur-md border border-white/20 text-white placeholder-white/35 pl-12 pr-4 py-4 text-base rounded-lg focus:outline-none focus:border-pjd-gold focus:bg-white/15 transition-all font-body"
          />
        </div>
      </form>
    );
  }

  // Expanded chat panel
  return (
    <div className="max-w-xl w-full bg-pjd-blue/80 backdrop-blur-xl border border-white/15 rounded-lg shadow-2xl overflow-hidden">
      {/* Chat header */}
      <div className="flex items-center justify-between px-4 py-3 border-b border-white/10">
        <div className="flex items-center gap-2">
          <div className="w-2 h-2 bg-emerald-400 rounded-full animate-pulse" />
          <span className="text-white/70 text-xs font-bold tracking-widest uppercase font-body">PJD Assistant</span>
        </div>
        <button
          onClick={() => { setIsExpanded(false); setMessages([]); }}
          className="p-1 hover:bg-white/10 rounded transition-colors cursor-pointer"
          aria-label="Close chat"
        >
          <X className="w-4 h-4 text-white/40" />
        </button>
      </div>

      {/* Messages */}
      <div ref={messagesContainerRef} className="h-64 overflow-y-auto px-4 py-3 flex flex-col gap-3">
        {messages.length === 0 && (
          <div className="text-center py-6">
            <p className="text-white/30 text-sm font-body">Ask me anything about Paul's boards, pricing, or the process.</p>
            <button
              onClick={onOpenQuiz}
              className="text-pjd-gold text-xs font-bold tracking-widest uppercase mt-3 hover:text-white transition-colors cursor-pointer font-body"
            >
              Or take the board quiz →
            </button>
          </div>
        )}

        {messages.map((msg, i) => (
          <div key={i} className={`flex gap-2 ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
            {msg.role === 'assistant' && (
              <div className="w-6 h-6 bg-pjd-gold/20 rounded-full flex items-center justify-center shrink-0 mt-1">
                <Bot className="w-3 h-3 text-pjd-gold" />
              </div>
            )}
            <div
              className={`max-w-[80%] px-3 py-2 rounded-lg text-sm font-body ${
                msg.role === 'user'
                  ? 'bg-pjd-gold/20 text-white'
                  : 'bg-white/5 text-white/80'
              }`}
            >
              {msg.content}
            </div>
            {msg.role === 'user' && (
              <div className="w-6 h-6 bg-white/10 rounded-full flex items-center justify-center shrink-0 mt-1">
                <User className="w-3 h-3 text-white/50" />
              </div>
            )}
          </div>
        ))}

        {isLoading && (
          <div className="flex gap-2 items-start">
            <div className="w-6 h-6 bg-pjd-gold/20 rounded-full flex items-center justify-center shrink-0">
              <Bot className="w-3 h-3 text-pjd-gold" />
            </div>
            <div className="bg-white/5 px-3 py-2 rounded-lg">
              <Loader className="w-4 h-4 text-pjd-gold animate-spin" />
            </div>
          </div>
        )}

      </div>

      {/* Input */}
      <form onSubmit={sendMessage} className="border-t border-white/10 px-3 py-2">
        <div className="flex gap-2">
          <input
            ref={inputRef}
            type="text"
            placeholder="Type a message..."
            value={input}
            onChange={(e) => setInput(e.target.value)}
            disabled={isLoading}
            className="flex-1 bg-white/5 border border-white/10 text-white placeholder-white/25 px-3 py-2.5 text-sm rounded-lg focus:outline-none focus:border-pjd-gold transition-colors font-body"
          />
          <button
            type="submit"
            disabled={isLoading || !input.trim()}
            className="bg-pjd-gold text-pjd-blue p-2.5 rounded-lg hover:bg-white transition-colors disabled:opacity-30 cursor-pointer"
            aria-label="Send message"
          >
            <Send className="w-4 h-4" />
          </button>
        </div>
      </form>
      <p className="text-white/20 text-[10px] text-center px-3 pb-1.5 font-body">
        AI assistant — responses may not always be accurate. Contact Paul directly for confirmed details.
      </p>
    </div>
  );
};

export default ChatAssistant;
