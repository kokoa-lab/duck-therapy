import { useRef, useState } from "react";
import { toPng } from "html-to-image";
import { getRandomPrescription, generateSessionId } from "@/lib/duckEngine";
import duckImage from "@/assets/duck-therapist.png";
import { Download } from "lucide-react";

interface CertificateProps {
  messageCount: number;
  onClose: () => void;
}

const Certificate = ({ messageCount, onClose }: CertificateProps) => {
  const certificateRef = useRef<HTMLDivElement>(null);
  const [isDownloading, setIsDownloading] = useState(false);
  const prescription = getRandomPrescription();
  const sessionId = generateSessionId();
  const date = new Date().toLocaleDateString("ko-KR", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  const handleDownload = async () => {
    if (!certificateRef.current) return;
    setIsDownloading(true);
    try {
      const dataUrl = await toPng(certificateRef.current, {
        cacheBust: true,
        pixelRatio: 2,
      });
      const link = document.createElement("a");
      link.download = `duck-therapy-certificate-${sessionId}.png`;
      link.href = dataUrl;
      link.click();
    } catch (e) {
      console.error("Failed to download certificate:", e);
    } finally {
      setIsDownloading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-foreground/40 backdrop-blur-sm p-4">
      <div
        ref={certificateRef}
        className="bg-duck-cream border-4 border-certificate-gold rounded-2xl p-6 md:p-10 max-w-md w-full shadow-2xl relative"
      >
        {/* Decorative corners */}
        <div className="absolute top-2 left-2 w-6 h-6 border-t-2 border-l-2 border-certificate-gold rounded-tl-lg" />
        <div className="absolute top-2 right-2 w-6 h-6 border-t-2 border-r-2 border-certificate-gold rounded-tr-lg" />
        <div className="absolute bottom-2 left-2 w-6 h-6 border-b-2 border-l-2 border-certificate-gold rounded-bl-lg" />
        <div className="absolute bottom-2 right-2 w-6 h-6 border-b-2 border-r-2 border-certificate-gold rounded-br-lg" />

        <div className="text-center space-y-4">
          <h2 className="font-display text-3xl md:text-4xl text-foreground">
            🏆 디버깅 상담 완료증
          </h2>

          <div className="w-16 h-0.5 bg-certificate-gold mx-auto" />

          <p className="text-muted-foreground text-sm">
            본 증서는 아래의 개발자가 용감하게<br />
            버그와 마주하였음을 증명합니다
          </p>

          <div className="py-3">
            <p className="text-muted-foreground text-xs">상담 일시</p>
            <p className="font-body font-medium text-foreground">{date}</p>
          </div>

          <div className="py-3">
            <p className="text-muted-foreground text-xs">상담 횟수</p>
            <p className="font-display text-2xl text-foreground">{messageCount}회</p>
          </div>

          <div className="bg-background/60 rounded-xl p-4 border border-border">
            <p className="text-muted-foreground text-xs mb-1">🩺 오리의 처방전</p>
            <p className="font-display text-lg text-foreground">{prescription}</p>
          </div>

          <div className="flex items-center justify-center gap-2 pt-2">
            <img src={duckImage} alt="Dr. 꽥꽥" className="w-12 h-12" />
            <div className="text-left">
              <p className="font-display text-sm text-foreground">Dr. 꽥꽥</p>
              <p className="text-xs text-muted-foreground">러버덕 디버깅 전문의</p>
            </div>
          </div>

          {/* Stamp */}
          <div className="absolute top-8 right-8 animate-stamp">
            <div className="w-16 h-16 rounded-full border-4 border-accent/60 flex items-center justify-center rotate-12">
              <span className="text-accent/60 font-display text-xs text-center leading-tight">
                상담<br />완료
              </span>
            </div>
          </div>

          <p className="text-xs text-muted-foreground">Session: {sessionId}</p>

          <div className="flex gap-3 justify-center mt-4">
            <button
              onClick={handleDownload}
              disabled={isDownloading}
              className="px-4 py-2 bg-muted text-foreground rounded-full font-body text-sm hover:bg-muted/80 transition-opacity flex items-center gap-2 disabled:opacity-50"
            >
              <Download className="w-4 h-4" />
              {isDownloading ? "저장 중..." : "이미지 저장"}
            </button>
            <button
              onClick={onClose}
              className="px-6 py-2 bg-primary text-primary-foreground rounded-full font-display text-lg hover:opacity-90 transition-opacity"
            >
              꽥! 감사합니다 🦆
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Certificate;
