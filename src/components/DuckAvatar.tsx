import { useState, useEffect } from "react";
import duckImage from "@/assets/duck-therapist.png";

interface DuckAvatarProps {
  isNodding: boolean;
  isQuacking: boolean;
}

const DuckAvatar = ({ isNodding, isQuacking }: DuckAvatarProps) => {
  const [animClass, setAnimClass] = useState("animate-duck-idle");

  useEffect(() => {
    if (isQuacking) {
      setAnimClass("animate-duck-quack");
      const timer = setTimeout(() => setAnimClass("animate-duck-idle"), 500);
      return () => clearTimeout(timer);
    } else if (isNodding) {
      setAnimClass("animate-duck-nod");
      const timer = setTimeout(() => setAnimClass("animate-duck-idle"), 800);
      return () => clearTimeout(timer);
    }
  }, [isNodding, isQuacking]);

  return (
    <div className="relative flex flex-col items-center">
      <div className={`transition-all duration-200 ${animClass}`}>
        <img
          src={duckImage}
          alt="오리 상담사"
          className="w-32 h-32 md:w-48 md:h-48 drop-shadow-lg"
        />
      </div>
      <div className="mt-2 px-3 py-1 rounded-full bg-primary/20 text-sm font-display text-foreground">
        Dr. 꽥꽥 🎓
      </div>
    </div>
  );
};

export default DuckAvatar;
