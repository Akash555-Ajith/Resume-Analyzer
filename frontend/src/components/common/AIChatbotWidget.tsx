import React, { useState, useRef, useEffect } from 'react';
import { Bot, Sparkles, Send, X, Trash2, MessageSquare, ChevronDown } from 'lucide-react';
import { ResumeData } from '../../types/resume';
import { apiService } from '../../services/api';

interface AIChatbotWidgetProps {
  currentResume?: ResumeData;
}

interface Message {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: string;
}

export const AIChatbotWidget: React.FC<AIChatbotWidgetProps> = ({ currentResume }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [inputMessage, setInputMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    {
      id: 'welcome',
      role: 'assistant',
      content: "Hello! I'm your AI Career Assistant. Ask me anything about resume writing, interview tips, keyword optimization, or selecting the best template for your target role!",
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    }
  ]);

  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    if (isOpen) {
      scrollToBottom();
    }
  }, [messages, isOpen]);

  const handleSendMessage = async (textToSend?: string) => {
    const text = textToSend || inputMessage;
    if (!text.trim() || isLoading) return;

    const userMsg: Message = {
      id: `user-${Date.now()}`,
      role: 'user',
      content: text,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    setMessages((prev) => [...prev, userMsg]);
    if (!textToSend) setInputMessage('');
    setIsLoading(true);

    try {
      const history = [...messages, userMsg].map((m) => ({ role: m.role, content: m.content }));
      const res = await apiService.sendChatAssistantMessage(history, currentResume);

      const aiMsg: Message = {
        id: `ai-${Date.now()}`,
        role: 'assistant',
        content: res.reply || "I'm here to help! How else can I assist with your resume?",
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      };
      setMessages((prev) => [...prev, aiMsg]);
    } catch (err) {
      console.error(err);
      // Smart Fallback answer if API or network error occurs
      const msgLower = text.toLowerCase();
      let fallbackReply = `Great question regarding '${text}'! Focus on tailoring your technical skills to the job description and quantifying your achievements with metrics.`;
      
      if (msgLower.includes('hello') || msgLower.includes('hi') || msgLower.includes('hey')) {
        fallbackReply = "Hello! 👋 I'm your AI Career Assistant. How can I help optimize your resume or select the best template today?";
      }

      const errorMsg: Message = {
        id: `err-${Date.now()}`,
        role: 'assistant',
        content: fallbackReply,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      };
      setMessages((prev) => [...prev, errorMsg]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleClearChat = () => {
    setMessages([
      {
        id: 'welcome',
        role: 'assistant',
        content: "Chat history cleared. How can I assist you with your resume today?",
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      }
    ]);
  };

  const quickPrompts = [
    "How do I write a punchy summary?",
    "Best template for freshers?",
    "How to quantify achievements?",
    "Tips for 6-month employment gap?"
  ];

  return (
    <div className="fixed bottom-6 right-6 z-50 font-sans">
      {/* Floating Toggle Button */}
      {!isOpen && (
        <button
          onClick={() => setIsOpen(true)}
          className="relative group bg-brand-orange hover:bg-brand-orange-hover text-white p-3.5 rounded-full shadow-2xl flex items-center gap-2.5 transition-all duration-300 transform hover:scale-105"
        >
          <div className="w-6 h-6 flex items-center justify-center">
            <Bot className="w-5 h-5 text-white animate-pulse" />
          </div>
          <span className="font-bold text-xs pr-1 hidden sm:inline">AI Career Assistant</span>
          <span className="absolute -top-1 -right-1 w-3.5 h-3.5 bg-emerald-500 border-2 border-white rounded-full" />
        </button>
      )}

      {/* Expanded Chatbot Drawer */}
      {isOpen && (
        <div className="w-[360px] sm:w-[400px] h-[520px] bg-white rounded-2xl border border-slate-200 shadow-2xl flex flex-col justify-between overflow-hidden animate-fade-in border-slate-300">
          
          {/* Header */}
          <div className="bg-[#0F172A] text-white p-3.5 flex items-center justify-between border-b border-slate-800">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-lg bg-brand-orange flex items-center justify-center text-white">
                <Sparkles className="w-4 h-4 fill-current" />
              </div>
              <div>
                <h3 className="text-xs font-bold text-white leading-none">AI Career Assistant</h3>
                <span className="text-[10px] font-mono text-emerald-400 font-semibold block mt-0.5">
                  ● Gemini 2.5 Pro Active
                </span>
              </div>
            </div>

            <div className="flex items-center gap-1">
              <button
                onClick={handleClearChat}
                title="Clear Chat"
                className="p-1.5 text-slate-400 hover:text-white rounded hover:bg-slate-800 transition-colors"
              >
                <Trash2 className="w-4 h-4" />
              </button>
              <button
                onClick={() => setIsOpen(false)}
                className="p-1.5 text-slate-400 hover:text-white rounded hover:bg-slate-800 transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Message Stream */}
          <div className="flex-1 p-4 overflow-y-auto space-y-3 bg-[#F8F9FC]">
            {messages.map((msg) => (
              <div
                key={msg.id}
                className={`flex flex-col ${msg.role === 'user' ? 'items-end' : 'items-start'}`}
              >
                <div
                  className={`max-w-[85%] p-3 rounded-2xl text-xs leading-relaxed ${
                    msg.role === 'user'
                      ? 'bg-brand-orange text-white rounded-br-2xs shadow-xs'
                      : 'bg-white text-slate-800 border border-slate-200/80 rounded-bl-2xs shadow-2xs font-medium'
                  }`}
                >
                  {msg.content}
                </div>
                <span className="text-[9px] font-mono text-slate-400 mt-1 px-1">
                  {msg.timestamp}
                </span>
              </div>
            ))}

            {isLoading && (
              <div className="flex items-center gap-2 p-2 bg-white rounded-xl border border-slate-200 w-24">
                <span className="w-2 h-2 rounded-full bg-brand-orange animate-bounce" />
                <span className="w-2 h-2 rounded-full bg-brand-orange animate-bounce [animation-delay:0.2s]" />
                <span className="w-2 h-2 rounded-full bg-brand-orange animate-bounce [animation-delay:0.4s]" />
              </div>
            )}

            <div ref={messagesEndRef} />
          </div>

          {/* Quick Prompts Chips */}
          <div className="px-3 pt-2 pb-1 bg-white border-t border-slate-100 flex flex-wrap gap-1.5 overflow-x-auto">
            {quickPrompts.map((qp, idx) => (
              <button
                key={idx}
                onClick={() => handleSendMessage(qp)}
                className="text-[10px] font-medium bg-slate-100 hover:bg-orange-50 hover:text-brand-orange text-slate-700 px-2 py-1 rounded-md border border-slate-200 shrink-0 transition-colors"
              >
                {qp}
              </button>
            ))}
          </div>

          {/* Input Box */}
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleSendMessage();
            }}
            className="p-3 bg-white border-t border-slate-200 flex items-center gap-2"
          >
            <input
              type="text"
              value={inputMessage}
              onChange={(e) => setInputMessage(e.target.value)}
              placeholder="Ask career or resume question..."
              className="flex-1 px-3 py-2 border border-slate-300 rounded-xl text-xs font-medium focus:ring-2 focus:ring-brand-orange outline-none bg-slate-50"
            />
            <button
              type="submit"
              disabled={isLoading || !inputMessage.trim()}
              className="p-2 bg-brand-orange hover:bg-brand-orange-hover text-white rounded-xl shadow-xs transition-colors disabled:opacity-50 shrink-0"
            >
              <Send className="w-4 h-4" />
            </button>
          </form>

        </div>
      )}
    </div>
  );
};
