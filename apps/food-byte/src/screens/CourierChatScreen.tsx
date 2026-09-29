import React, { useEffect, useRef, useState } from 'react';
import { useTheme } from '../context/ThemeContext';
import { useCart } from '../context/CartContext';
import { createOrderSocket, ChatMessage } from '@repo/api-client';

interface CourierChatScreenProps {
  onBack: () => void;
}

export const CourierChatScreen: React.FC<CourierChatScreenProps> = ({ onBack }) => {
  const { theme } = useTheme();
  const { activeOrder } = useCart();
  const isDark = theme === 'dark';

  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      orderId: activeOrder?.id || 'ord_sample_101',
      senderId: 'driver_rajesh_01',
      senderRole: 'DRIVER',
      message: 'Hello! I have picked up your order from Tony\'s Artisan Pizza and I am on the way.',
      timestamp: Date.now() - 6 * 60 * 1000,
    },
    {
      orderId: activeOrder?.id || 'ord_sample_101',
      senderId: 'u0000001-0000-0000-0000-000000000001',
      senderRole: 'CUSTOMER',
      message: 'Thank you Rajesh! Please leave it with the front desk security at Penthouse 4B.',
      timestamp: Date.now() - 4 * 60 * 1000,
    },
    {
      orderId: activeOrder?.id || 'ord_sample_101',
      senderId: 'driver_rajesh_01',
      senderRole: 'DRIVER',
      message: 'Got it, arriving in approximately 8 minutes.',
      timestamp: Date.now() - 2 * 60 * 1000,
    },
  ]);

  const [inputMessage, setInputMessage] = useState('');
  const socketRef = useRef<any>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const quickReplies = [
    "I'm at the lobby",
    'Please leave at door',
    'Ring doorbell twice',
    'Call when outside',
  ];

  useEffect(() => {
    const socket = createOrderSocket();
    socketRef.current = socket;

    const orderId = activeOrder?.id || 'ord_sample_101';
    socket.emit('join_order', { orderId });

    socket.on('courier:message_sent', (data: ChatMessage) => {
      setMessages(prev => [...prev, data]);
    });

    return () => {
      socket.disconnect();
    };
  }, [activeOrder?.id]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSend = (textToSend?: string) => {
    const text = textToSend || inputMessage;
    if (!text.trim()) return;

    const orderId = activeOrder?.id || 'ord_sample_101';
    const payload: ChatMessage = {
      orderId,
      senderId: 'u0000001-0000-0000-0000-000000000001',
      senderRole: 'CUSTOMER',
      message: text.trim(),
      timestamp: Date.now(),
    };

    if (socketRef.current) {
      socketRef.current.emit('courier:send_message', payload);
    } else {
      setMessages(prev => [...prev, payload]);
    }

    setInputMessage('');
  };

  return (
    <div className={`flex flex-col h-full ${isDark ? 'bg-[#131315]' : 'bg-[#fcf9f8]'}`}>
      {/* Chat Header */}
      <header
        className={`sticky top-0 z-30 px-4 py-3 flex items-center justify-between backdrop-blur-xl border-b ${
          isDark ? 'bg-[#131315]/90 border-white/[0.08]' : 'bg-[#fcf9f8]/90 border-black/[0.04]'
        }`}
      >
        <div className="flex items-center gap-3">
          <button
            onClick={onBack}
            className="w-8 h-8 rounded-full flex items-center justify-center hover:bg-black/5 dark:hover:bg-white/10"
          >
            <span className="material-symbols-outlined text-[20px]">arrow_back</span>
          </button>
          <div className="relative">
            <img
              src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&auto=format&fit=crop&q=80"
              alt="Rajesh Kumar"
              className="w-10 h-10 rounded-full object-cover ring-2 ring-[#bb0021] dark:ring-[#ff1e38]"
            />
            <div className="absolute -bottom-0.5 -right-0.5 w-3 h-3 rounded-full bg-emerald-500 ring-2 ring-white" />
          </div>
          <div>
            <h2 className="font-extrabold text-sm leading-tight">Rajesh Kumar</h2>
            <span className="text-[11px] text-emerald-500 font-bold flex items-center gap-1">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
              Assigned Courier • EV Scooter
            </span>
          </div>
        </div>

        <a
          href="tel:+919876543210"
          className="w-9 h-9 rounded-full bg-emerald-600 text-white flex items-center justify-center shadow-md active:scale-95"
        >
          <span className="material-symbols-outlined text-[18px]">call</span>
        </a>
      </header>

      {/* Message History List */}
      <div className="flex-1 p-4 overflow-y-auto no-scrollbar flex flex-col gap-3">
        <div className="text-center my-2">
          <span className="text-[10px] font-bold uppercase tracking-wider px-3 py-1 rounded-full bg-black/5 dark:bg-white/10 opacity-70">
            Order Live Chat • Confidential
          </span>
        </div>

        {messages.map((m, idx) => {
          const isMe = m.senderRole === 'CUSTOMER';
          return (
            <div
              key={idx}
              className={`flex flex-col max-w-[80%] ${isMe ? 'self-end items-end' : 'self-start items-start'}`}
            >
              <div
                className={`p-3 rounded-2xl text-xs font-medium leading-relaxed shadow-sm ${
                  isMe
                    ? isDark
                      ? 'bg-[#ff1e38] text-white rounded-br-xs'
                      : 'bg-[#bb0021] text-white rounded-br-xs'
                    : isDark
                    ? 'bg-[#201f21] border border-white/10 text-white rounded-bl-xs'
                    : 'bg-white border border-black/5 text-[#1c1b1b] rounded-bl-xs'
                }`}
              >
                {m.message}
              </div>
              <span className="text-[9px] opacity-50 px-1 mt-0.5 font-bold">
                {new Date(m.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
              </span>
            </div>
          );
        })}
        <div ref={messagesEndRef} />
      </div>

      {/* Quick Reply Pills */}
      <div className="px-4 py-1.5 flex gap-2 overflow-x-auto no-scrollbar border-t border-black/5 dark:border-white/5">
        {quickReplies.map((qr, idx) => (
          <button
            key={idx}
            onClick={() => handleSend(qr)}
            className={`px-3 py-1 rounded-full text-xs font-semibold whitespace-nowrap transition-all border active:scale-95 ${
              isDark
                ? 'bg-[#1b1b1d] border-white/10 text-white hover:bg-[#252528]'
                : 'bg-white border-black/10 text-black hover:bg-[#f6f3f2]'
            }`}
          >
            {qr}
          </button>
        ))}
      </div>

      {/* Input Bar */}
      <div
        className={`p-3 border-t flex items-center gap-2 ${
          isDark ? 'bg-[#131315] border-white/10' : 'bg-white border-black/10'
        }`}
      >
        <input
          type="text"
          value={inputMessage}
          onChange={e => setInputMessage(e.target.value)}
          onKeyDown={e => e.key === 'Enter' && handleSend()}
          placeholder="Message courier..."
          className={`flex-1 px-4 py-2.5 rounded-full text-xs font-medium outline-none border ${
            isDark ? 'bg-[#201f21] border-white/10 text-white' : 'bg-[#f6f3f2] border-black/10 text-black'
          }`}
        />
        <button
          onClick={() => handleSend()}
          className={`w-10 h-10 rounded-full flex items-center justify-center text-white shadow-md active:scale-95 transition-all ${
            isDark ? 'bg-[#ff1e38]' : 'bg-[#bb0021]'
          }`}
        >
          <span className="material-symbols-outlined text-[18px]">send</span>
        </button>
      </div>
    </div>
  );
};
