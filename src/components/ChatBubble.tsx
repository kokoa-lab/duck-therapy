interface ChatBubbleProps {
  message: string;
  isUser: boolean;
  index: number;
}

const ChatBubble = ({ message, isUser, index }: ChatBubbleProps) => {
  return (
    <div
      className={`flex ${isUser ? "justify-end" : "justify-start"} animate-float-bubble`}
      style={{ animationDelay: `${index * 0.05}s` }}
    >
      <div
        className={`max-w-[80%] px-4 py-3 rounded-2xl text-sm md:text-base leading-relaxed ${
          isUser
            ? "bg-primary text-primary-foreground rounded-br-md"
            : "bg-card text-card-foreground rounded-bl-md border border-border shadow-sm"
        }`}
      >
        {!isUser && <span className="text-duck-orange mr-1">🦆</span>}
        {message}
      </div>
    </div>
  );
};

export default ChatBubble;
