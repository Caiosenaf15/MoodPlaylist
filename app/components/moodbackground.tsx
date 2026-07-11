interface MoodBackgroundProps {
  cores: string[];
}

export default function MoodBackground({ cores }: MoodBackgroundProps) {
  const [c1, c2, c3] = [
    cores[0] ?? '#3b82f6',
    cores[1] ?? cores[0] ?? '#8b5cf6',
    cores[2] ?? cores[0] ?? '#ec4899',
  ];

  return (
    <div className="fixed inset-0 -z-10 overflow-hidden bg-slate-950">
      <div
        className="mood-orb mood-orb-1"
        style={{ backgroundColor: c1 }}
      />
      <div
        className="mood-orb mood-orb-2"
        style={{ backgroundColor: c2 }}
      />
      <div
        className="mood-orb mood-orb-3"
        style={{ backgroundColor: c3 }}
      />

      <div className="absolute inset-0 bg-slate-950/30" />

      <style jsx>{`
        .mood-orb {
          position: absolute;
          width: 62vw;
          height: 62vw;
          max-width: 780px;
          max-height: 780px;
          border-radius: 9999px;
          filter: blur(100px);
          opacity: 0.4;
          will-change: transform;
        }

        .mood-orb-1 {
          top: -10%;
          left: -5%;
          animation: drift1 28s ease-in-out infinite;
        }

        .mood-orb-2 {
          top: 25%;
          right: -10%;
          animation: drift2 34s ease-in-out infinite;
        }

        .mood-orb-3 {
          bottom: -15%;
          left: 15%;
          animation: drift3 40s ease-in-out infinite;
        }

        @keyframes drift1 {
          0%, 100% { transform: translate(0, 0) scale(1); }
          33% { transform: translate(6vw, 4vw) scale(1.1); }
          66% { transform: translate(-4vw, 6vw) scale(0.95); }
        }

        @keyframes drift2 {
          0%, 100% { transform: translate(0, 0) scale(1); }
          33% { transform: translate(-5vw, 5vw) scale(0.92); }
          66% { transform: translate(3vw, -4vw) scale(1.12); }
        }

        @keyframes drift3 {
          0%, 100% { transform: translate(0, 0) scale(1); }
          33% { transform: translate(4vw, -5vw) scale(1.08); }
          66% { transform: translate(-6vw, -2vw) scale(0.94); }
        }

        @media (max-width: 640px) {
          .mood-orb {
            width: 95vw;
            height: 95vw;
            filter: blur(70px);
          }
        }
      `}</style>
    </div>
  );
}