import React, { useState, useRef, useEffect } from 'react';
import { Bot, Search } from '../components/Icons';
import { chatWithTutor } from '../services/gemini';
import { ChatMessage } from '../types';

const AiTutor: React.FC = () => {
  const [messages, setMessages] = useState<ChatMessage[]>([
    { role: 'model', text: 'أهلاً بك! أنا "مدرستي"، مساعدك الذكي. كيف يمكنني مساعدتك في دروسك اليوم؟' }
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSend = async () => {
    if (!input.trim()) return;

    const userMsg: ChatMessage = { role: 'user', text: input };
    setMessages(prev => [...prev, userMsg]);
    setInput('');
    setIsLoading(true);

    const historyText = messages.map(m => `${m.role === 'user' ? 'الطالب' : 'المساعد'}: ${m.text}`);
    const response = await chatWithTutor(userMsg.text, historyText);

    setMessages(prev => [...prev, { role: 'model', text: response || 'حدث خطأ، حاول مرة أخرى.' }]);
    setIsLoading(false);
  };

  return (
    <div className="flex flex-col h-[calc(100vh-80px)] bg-gray-50">
      <div className="p-4 bg-white border-b border-gray-100 shadow-sm sticky top-0 z-10">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-emerald-100 rounded-full flex items-center justify-center">
            <Bot className="text-emerald-600" size={24} />
          </div>
          <div>
            <h2 className="font-bold text-gray-800">المساعد الذكي</h2>
            <p className="text-xs text-emerald-600 flex items-center gap-1">
              <span className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-pulse"></span>
              متصل الآن
            </p>
          </div>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.map((msg, idx) => (
          <div key={idx} className={`flex ${msg.role === 'user' ? 'justify-start' : 'justify-end'}`}>
            <div 
              className={`max-w-[80%] p-4 rounded-2xl text-sm leading-relaxed shadow-sm ${
                msg.role === 'user' 
                  ? 'bg-white text-black rounded-tr-none border border-gray-100' 
                  : 'bg-emerald-500 text-white rounded-tl-none'
              }`}
            >
              {msg.text}
            </div>
          </div>
        ))}
        {isLoading && (
          <div className="flex justify-end">
            <div className="bg-emerald-500 text-white p-4 rounded-2xl rounded-tl-none shadow-sm max-w-[80%] flex items-center gap-2">
              <div className="w-2 h-2 bg-white rounded-full animate-bounce"></div>
              <div className="w-2 h-2 bg-white rounded-full animate-bounce delay-75"></div>
              <div className="w-2 h-2 bg-white rounded-full animate-bounce delay-150"></div>
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      <div className="p-4 bg-white border-t border-gray-100 mb-20">
        <div className="relative flex items-center">
          <input 
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleSend()}
            placeholder="اكتب سؤالك هنا..."
            className="w-full bg-gray-50 border border-gray-200 rounded-full py-3.5 pr-4 pl-12 outline-none focus:border-emerald-500 transition-colors text-sm text-black placeholder-gray-400"
          />
          <button 
            onClick={handleSend}
            disabled={isLoading || !input.trim()}
            className="absolute left-2 w-9 h-9 bg-emerald-500 rounded-full flex items-center justify-center text-white shadow-md disabled:opacity-50 disabled:shadow-none hover:scale-105 transition-all"
          >
            <Search size={18} className="rotate-90" /> {/* Looks like send icon when rotated */}
          </button>
        </div>
      </div>
    </div>
  );
};

export default AiTutor;