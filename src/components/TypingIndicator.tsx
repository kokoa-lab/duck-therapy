const TypingIndicator = () => {
  return (
    <div className="flex justify-start animate-float-bubble">
      <div className="max-w-[80%] px-4 py-3 rounded-2xl rounded-bl-md bg-card text-card-foreground border border-border shadow-sm flex items-center gap-1.5">
        <span className="text-duck-orange mr-1">🦆</span>
        <span className="text-sm text-muted-foreground italic mr-2">타이핑 중</span>
        <span className="w-2 h-2 rounded-full bg-muted-foreground/60 animate-bounce" style={{ animationDelay: "0ms" }} />
        <span className="w-2 h-2 rounded-full bg-muted-foreground/60 animate-bounce" style={{ animationDelay: "150ms" }} />
        <span className="w-2 h-2 rounded-full bg-muted-foreground/60 animate-bounce" style={{ animationDelay: "300ms" }} />
      </div>
    </div>
  );
};

export default TypingIndicator;
