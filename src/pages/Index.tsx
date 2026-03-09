import { useState, useRef, useEffect } from "react";
import DuckAvatar from "@/components/DuckAvatar";
import ChatBubble from "@/components/ChatBubble";
import TypingIndicator from "@/components/TypingIndicator";
import Certificate from "@/components/Certificate";
import { generateDuckResponse } from "@/lib/duckEngine";
import { playQuack, primeAudio } from "@/lib/quackSound";
import { Send } from "lucide-react";

interface Message {
  text: string;
  isUser: boolean;
}

const INITIAL_MESSAGE =
  "안녕하세요! 저는 Dr. 꽥꽥, 러버덕 디버깅 상담사입니다 🦆\n\n오늘 어떤 버그가 당신을 괴롭히고 있나요? 편하게 말씀해 주세요. 끄덕끄덕...";

const Index = () => {
  const [messages, setMessages] = useState<Message[]>([
    { text: INITIAL_MESSAGE, isUser: false },
  ]);
  const [input, setInput] = useState("");
  const [isNodding, setIsNodding] = useState(false);
  const [isQuacking, setIsQuacking] = useState(false);
  const [isTyping, setIsTyping] = useState(false);
  const [showCertificate, setShowCertificate] = useState(false);
  const [userMessageCount, setUserMessageCount] = useState(0);
  const chatEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const isComposingRef = useRef(false);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleSend = async () => {
    const trimmed = input.trim();
    if (!trimmed) return;

    // Prime AudioContext in user gesture so playQuack works later in setTimeout
    await primeAudio();

    const newCount = userMessageCount + 1;
    setUserMessageCount(newCount);
    setMessages((prev) => [...prev, { text: trimmed, isUser: true }]);
    setInput("");

    // Show typing indicator
    setIsTyping(true);

    // Duck thinks...
    const thinkTime = 800 + Math.random() * 600;
    setTimeout(() => {
      const { response, isNodding: nod, shouldQuack } = generateDuckResponse(trimmed, newCount);

      if (shouldQuack) {
        setIsQuacking(true);
        playQuack();
        setTimeout(() => setIsQuacking(false), 500);
      }

      if (nod) {
        setIsNodding(true);
        setTimeout(() => setIsNodding(false), 800);
      }

      setIsTyping(false);
      setMessages((prev) => [...prev, { text: response, isUser: false }]);

      // Check if solved
      const solvedKeywords = ["찾았", "알겠", "해결", "됐다", "고쳤", "fixed", "solved", "got it", "감사"];
      if (solvedKeywords.some((k) => trimmed.toLowerCase().includes(k))) {
        setTimeout(() => setShowCertificate(true), 1500);
      }
    }, thinkTime);

    inputRef.current?.focus();
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey && !isComposingRef.current) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <div className="flex flex-col h-screen max-w-2xl mx-auto">
      {/* Header */}
      <header className="flex items-center justify-between px-4 py-3 border-b border-border bg-card/50 backdrop-blur-sm">
        <div className="flex items-center gap-2">
          <span className="text-2xl">🛁</span>
          <h1 className="font-display text-xl md:text-2xl text-foreground">DuckTherapy</h1>
        </div>
        <button
          onClick={() => {
            if (userMessageCount >= 1) setShowCertificate(true);
          }}
          className="text-xs px-3 py-1.5 rounded-full bg-muted text-muted-foreground hover:bg-primary/20 transition-colors font-body"
          disabled={userMessageCount < 1}
        >
          📜 완료증 발급
        </button>
      </header>

      {/* Duck avatar */}
      <div className="flex justify-center py-4 bg-duck-cream/30">
        <DuckAvatar isNodding={isNodding} isQuacking={isQuacking} />
      </div>

      {/* Chat area */}
      <div className="flex-1 overflow-y-auto px-4 py-4 space-y-3">
        {messages.map((msg, i) => (
          <ChatBubble key={i} message={msg.text} isUser={msg.isUser} index={i} />
        ))}
        {isTyping && <TypingIndicator />}
        <div ref={chatEndRef} />
      </div>

      {/* Input */}
      <div className="px-4 py-3 border-t border-border bg-card/50 backdrop-blur-sm">
        <div className="flex gap-2 items-center">
          <input
            ref={inputRef}
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            onCompositionStart={() => { isComposingRef.current = true; }}
            onCompositionEnd={() => { isComposingRef.current = false; }}
            placeholder="버그 상황을 설명해 주세요... 🐛"
            className="flex-1 px-4 py-3 rounded-full bg-background border border-input text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring text-sm"
          />
          <button
            onClick={handleSend}
            disabled={!input.trim()}
            className="w-10 h-10 rounded-full bg-primary text-primary-foreground flex items-center justify-center hover:opacity-90 transition-opacity disabled:opacity-40"
          >
            <Send className="w-4 h-4" />
          </button>
        </div>
        <p className="text-center text-xs text-muted-foreground mt-2 font-body">
          오리에게 버그를 설명하면, 답이 보입니다 🦆
        </p>
      </div>

      {/* Certificate modal */}
      {showCertificate && (
        <Certificate
          messageCount={userMessageCount}
          onClose={() => setShowCertificate(false)}
        />
      )}
    </div>
  );
};

export default Index;
