"use client";
import { useState, useRef, useEffect, useCallback } from "react";
import { type Message, SUGGESTED_QUESTIONS, SUGGESTED_QUESTIONS_JA } from "@/lib/ijccKnowledge";
import MessageBubble from "./MessageBubble";
import { useTranslation } from "@/hooks/use-translation";

const WELCOME_EN: Message = {
  id: "welcome",
  role: "assistant",
  content: "Namaste! 🇮🇳🤝🇯🇵 Welcome to **Indo-Japan Chamber of Commerce**!\n\nI can help you with:\n- Membership information\n- Upcoming events & seminars\n- India-Japan trade opportunities\n- Business networking & partnerships\n\nHow can I assist you today?",
  timestamp: new Date(),
};

const WELCOME_JA: Message = {
  id: "welcome",
  role: "assistant",
  content: "こんにちは！🇮🇳🤝🇯🇵 **印日商工会議所（IJCC）**へようこそ！\n\n以下についてご案内できます：\n- 会員・メンバーシップ情報\n- 今後のイベント＆セミナー\n- 日印間の貿易・ビジネス機会\n- ネットワーキング＆事業提携\n\nどのようなご用件でしょうか？",
  timestamp: new Date(),
};

export default function ChatWidget() {
  const { language } = useTranslation();
  const isJa = language === "ja";

  const [isOpen, setIsOpen] = useState(false);
  const [isMinimized, setIsMinimized] = useState(false);
  const [messages, setMessages] = useState<Message[]>([isJa ? WELCOME_JA : WELCOME_EN]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [showSuggestions, setShowSuggestions] = useState(true);
  const [hasNew, setHasNew] = useState(false);
  
  const bottomRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const widgetRef = useRef<HTMLDivElement>(null);

  // Dynamically update initial welcome message when language toggles in the header
  useEffect(() => {
    setMessages((prev) => {
      if (prev.length === 1 && prev[0].id === "welcome") {
        return [isJa ? WELCOME_JA : WELCOME_EN];
      }
      return prev;
    });
  }, [isJa]);

  // Auto-minimize when clicking outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (isOpen && !isMinimized && widgetRef.current && !widgetRef.current.contains(event.target as Node)) {
        setIsMinimized(true);
      }
    }

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isOpen, isMinimized]);

  useEffect(() => {
    if (isOpen) { 
      bottomRef.current?.scrollIntoView({ behavior:"smooth" }); 
      setHasNew(false); 
      if (!isMinimized) {
        setTimeout(() => inputRef.current?.focus(), 300); 
      }
    }
  }, [isOpen, messages, isMinimized]);

  const send = useCallback(async (text: string) => {
    if (!text.trim() || isLoading) return;

    const userMsg: Message = { 
      id: Date.now().toString(), 
      role: "user", 
      content: text.trim(), 
      timestamp: new Date() 
    };

    setMessages(p => [...p, userMsg]);
    setInput("");
    setIsLoading(true);
    setShowSuggestions(false);

    const aId = (Date.now() + 1).toString();
    setMessages(p => [...p, { 
      id: aId, 
      role: "assistant", 
      content: "", 
      timestamp: new Date() 
    }]);

    const allMsgs = [...messages, userMsg].map(m => ({ 
      role: m.role, 
      content: m.content 
    }));

    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 30000);

      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ messages: allMsgs, language }),
        signal: controller.signal,
      });

      clearTimeout(timeoutId);

      let data: { text?: string; error?: string };

      try {
        data = await res.json();
      } catch {
        data = { 
          text: isJa 
            ? "現在一時的な問題が発生しています。詳細については ijcc.in をご覧ください。"
            : "I am having trouble right now. Please visit ijcc.in for assistance." 
        };
      }

      const responseText = data.text || data.error || (
        isJa 
          ? "現在一時的な問題が発生しています。詳細については ijcc.in をご覧ください。"
          : "I am having trouble right now. Please visit ijcc.in for assistance."
      );

      setMessages(p =>
        p.map(m => m.id === aId ? { ...m, content: responseText } : m)
      );

      if (!isOpen) setHasNew(true);

    } catch (error) {
      const msg = error instanceof Error && error.name === "AbortError"
        ? (isJa ? "リクエストがタイムアウトしました。もう一度お試しください。" : "Request timed out. Please try again.")
        : (isJa ? "現在一時的な問題が発生しています。詳細については ijcc.in をご覧ください。" : "I am having trouble right now. Please visit ijcc.in for assistance.");

      setMessages(p =>
        p.map(m => m.id === aId ? { ...m, content: msg } : m)
      );
    } finally {
      setIsLoading(false);
    }
  }, [isLoading, messages, isOpen, language, isJa]);

  const reset = () => { 
    setMessages([isJa ? WELCOME_JA : WELCOME_EN]); 
    setShowSuggestions(true); 
    setInput(""); 
  };

  const currentSuggestions = isJa ? SUGGESTED_QUESTIONS_JA : SUGGESTED_QUESTIONS;

  return (
    <>
      <style>{`
        @keyframes bounce { 0%,60%,100%{transform:translateY(0);opacity:0.6} 30%{transform:translateY(-6px);opacity:1} }
        @keyframes fadeIn { from{opacity:0;transform:translateY(8px)} to{opacity:1;transform:translateY(0)} }
        @keyframes pulse { 0%,100%{box-shadow:0 0 0 0 rgba(200,16,46,0.4)} 50%{box-shadow:0 0 0 10px rgba(200,16,46,0)} }
        .ijcc-msg{animation:fadeIn 0.25s ease-out}
        .ijcc-suggest:hover{background:#fff0f3!important;border-color:#C8102E!important}
        .ijcc-hbtn:hover{background:rgba(255,255,255,0.2)!important}
        .ijcc-scroll::-webkit-scrollbar{width:3px} .ijcc-scroll::-webkit-scrollbar-thumb{background:#C8102E44;border-radius:4px}
      `}</style>

      {!isOpen && (
        <button
          className="fixed z-[9999] bottom-4 right-4 sm:bottom-6 sm:right-6 w-12 h-12 sm:w-14 sm:h-14 rounded-full flex items-center justify-center cursor-pointer shadow-xl border-none transition-transform active:scale-95"
          style={{
            background: "linear-gradient(135deg, #C8102E, #8B0A1F)",
            boxShadow: "0 8px 32px rgba(200,16,46,0.4)",
            animation: "pulse 2s ease-in-out infinite"
          }}
          onClick={() => setIsOpen(true)}
          aria-label={isJa ? "チャットを開く" : "Open chat"}
        >
          <svg className="w-5 h-5 sm:w-6 sm:h-6" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/>
          </svg>
          {hasNew && (
            <span className="absolute top-1 right-1 w-3 h-3 bg-amber-400 rounded-full border-2 border-white" />
          )}
        </button>
      )}

      {isOpen && (
        <div
          ref={widgetRef}
          className={`fixed z-[9999] bottom-3 right-3 sm:bottom-6 sm:right-6 w-[calc(100vw-24px)] sm:w-[380px] max-w-[390px] rounded-2xl overflow-hidden flex flex-col bg-white border border-gray-200 shadow-2xl transition-all duration-300 ${
            isMinimized ? "h-[54px] sm:h-[60px]" : "h-[82vh] sm:h-[590px] max-h-[620px]"
          }`}
          style={{
            boxShadow: "0 20px 60px rgba(0,0,0,0.2)"
          }}
        >
          {/* Header */}
          <div
            className="px-3 py-2.5 sm:px-4 sm:py-3 flex items-center justify-between cursor-pointer shrink-0 select-none"
            style={{ background: "linear-gradient(135deg,#C8102E,#8B0A1F)" }}
            onClick={() => setIsMinimized(!isMinimized)}
          >
            <div className="flex items-center gap-2.5 min-w-0">
              <div className="w-8 h-8 sm:w-9 sm:h-9 rounded-full bg-white flex items-center justify-center shrink-0 shadow-xs">
                <span className="text-[#C8102E] font-black text-sm sm:text-base">I</span>
              </div>
              <div className="min-w-0">
                <div className="text-white font-bold text-xs sm:text-sm leading-tight truncate">
                  {isJa ? "IJCC アシスタント" : "IJCC Assistant"}
                </div>
                <div className="text-white/80 text-[10px] sm:text-[11px] flex items-center gap-1.5 leading-tight truncate">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 inline-block shrink-0" />
                  <span className="truncate">{isJa ? "印日商工会議所" : "Indo-Japan Chamber"}</span>
                </div>
              </div>
            </div>

            <div className="flex items-center gap-1 shrink-0 ml-2" onClick={e => e.stopPropagation()}>
              <button
                className="ijcc-hbtn text-white/80 hover:text-white p-1 sm:p-1.5 rounded-md hover:bg-white/20 transition-colors"
                onClick={reset}
                title={isJa ? "会話をリセット" : "Reset"}
              >
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="1 4 1 10 7 10"/><path d="M3.51 15a9 9 0 1 0 .49-3.75"/></svg>
              </button>
              <button
                className="ijcc-hbtn text-white/80 hover:text-white p-1 sm:p-1.5 rounded-md hover:bg-white/20 transition-colors"
                onClick={() => setIsMinimized(!isMinimized)}
                title={isJa ? "最小化" : "Minimize"}
              >
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points={isMinimized?"18 15 12 9 6 15":"18 9 12 15 6 9"}/></svg>
              </button>
              <button
                className="ijcc-hbtn text-white/80 hover:text-white p-1 sm:p-1.5 rounded-md hover:bg-white/20 transition-colors"
                onClick={() => { setIsOpen(false); setIsMinimized(false); }}
                title={isJa ? "閉じる" : "Close"}
              >
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
              </button>
            </div>
          </div>

          {!isMinimized && (
            <div style={{ height:"3px", background:"linear-gradient(90deg,#FF9933 33%,#fff 33%,#fff 66%,#138808 66%)", flexShrink:0 }} />
          )}

          {!isMinimized && (
            <div className="ijcc-scroll flex-1 overflow-y-auto p-3 bg-gray-50/60">
              {messages.map((m, i) => (
                <div key={m.id} className="ijcc-msg">
                  <MessageBubble message={m} isLatest={i === messages.length - 1} />
                </div>
              ))}
              {showSuggestions && messages.length === 1 && (
                <div className="mt-2">
                  <p className="text-[11px] text-gray-500 mb-1.5 pl-1 font-medium">
                    {isJa ? "よくある質問：" : "Suggested questions:"}
                  </p>
                  {currentSuggestions.slice(0, 4).map(q => (
                    <button
                      key={q}
                      className="ijcc-suggest w-full text-left text-xs p-2 sm:p-2.5 mb-1.5 rounded-xl bg-white border border-gray-200 text-gray-700 leading-snug cursor-pointer shadow-2xs hover:bg-[#fff0f3] hover:border-[#C8102E] transition-all block break-words"
                      onClick={() => send(q)}
                    >
                      {q}
                    </button>
                  ))}
                </div>
              )}
              <div ref={bottomRef} />
            </div>
          )}

          {!isMinimized && (
            <div className="shrink-0 p-2.5 sm:p-3 border-t border-gray-200 bg-white">
              <div className="flex gap-2 items-center bg-gray-100 rounded-xl px-3 py-1.5 sm:py-2">
                <input
                  ref={inputRef}
                  type="text"
                  value={input}
                  onChange={e => setInput(e.target.value)}
                  onKeyDown={e => { if (e.key === "Enter" && !e.shiftKey) { e.preventDefault(); send(input); }}}
                  placeholder={isJa ? "日印貿易やIJCCについて質問する..." : "Ask about India-Japan trade..."}
                  disabled={isLoading}
                  className="flex-1 bg-transparent border-none outline-none text-xs sm:text-sm text-gray-800 placeholder-gray-400"
                />
                <button
                  className="w-8 h-8 rounded-lg bg-[#C8102E] text-white flex items-center justify-center shrink-0 cursor-pointer transition-opacity active:scale-95 disabled:opacity-40"
                  disabled={!input.trim() || isLoading}
                  onClick={() => send(input)}
                  aria-label="Send message"
                >
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2"><line x1="22" y1="2" x2="11" y2="13"/><polygon points="22 2 15 22 11 13 2 9 22 2"/></svg>
                </button>
              </div>
              <p className="text-center text-[10px] text-gray-400 mt-1.5">
                {isJa ? `Gemini AI 搭載 • IJCC © ${new Date().getFullYear()}` : `Powered by Gemini AI • IJCC © ${new Date().getFullYear()}`}
              </p>
            </div>
          )}
        </div>
      )}
    </>
  );
}
