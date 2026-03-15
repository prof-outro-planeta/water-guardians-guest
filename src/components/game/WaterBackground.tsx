import waterBg from '@/assets/water-bg.jpg';

const WaterBackground = () => {
  return (
    <>
      <div className="game-bg" />
      <div className="game-bg-image" style={{ backgroundImage: `url(${waterBg})` }} />
      <div className="game-bg-overlay" />

      {/* Animated blobs */}
      <div
        className="watercolor-blob"
        style={{
          top: '-15%', left: '-20%',
          width: '60vw', height: '50vh',
          background: 'radial-gradient(ellipse, rgba(42,143,173,0.20) 0%, transparent 65%)',
          animation: 'drift 16s ease-in-out infinite',
        }}
      />
      <div
        className="watercolor-blob"
        style={{
          bottom: '-10%', right: '-15%',
          width: '55vw', height: '45vh',
          background: 'radial-gradient(ellipse, rgba(26,107,154,0.22) 0%, transparent 60%)',
          animation: 'drift2 20s ease-in-out infinite',
        }}
      />
      <div
        className="watercolor-blob"
        style={{
          top: '30%', left: '10%',
          width: '40vw', height: '35vh',
          background: 'radial-gradient(ellipse, rgba(59,109,17,0.12) 0%, transparent 55%)',
          animation: 'drift3 22s ease-in-out infinite',
        }}
      />

      {/* Glow spot */}
      <div
        className="absolute"
        style={{
          top: '15%', left: '50%', transform: 'translateX(-50%)',
          width: '300px', height: '300px',
          background: 'radial-gradient(circle, rgba(133,193,212,0.08) 0%, transparent 70%)',
          animation: 'glow-pulse 6s ease-in-out infinite',
          pointerEvents: 'none', zIndex: 3,
        }}
      />

      {/* Floating particles */}
      {[...Array(10)].map((_, i) => (
        <div
          key={i}
          className="absolute rounded-full"
          style={{
            width: `${3 + (i % 4) * 2}px`,
            height: `${3 + (i % 4) * 2}px`,
            background: `rgba(133,193,212,${0.3 + (i % 3) * 0.15})`,
            left: `${8 + i * 9}%`,
            bottom: `${2 + (i % 5) * 4}%`,
            animation: `particle-rise ${7 + i * 1.3}s ease-in-out infinite`,
            animationDelay: `${i * 0.8}s`,
            pointerEvents: 'none',
            zIndex: 3,
          }}
        />
      ))}

      {/* Bottom waves */}
      <div className="absolute bottom-0 left-0 right-0 overflow-hidden" style={{ height: '80px', zIndex: 4, pointerEvents: 'none', opacity: 0.15 }}>
        <svg width="200%" height="80" viewBox="0 0 2000 80" preserveAspectRatio="none" style={{ animation: 'wave-slow 12s linear infinite' }}>
          <path d="M0 40 Q50 20 100 40 T200 40 T300 40 T400 40 T500 40 T600 40 T700 40 T800 40 T900 40 T1000 40 T1100 40 T1200 40 T1300 40 T1400 40 T1500 40 T1600 40 T1700 40 T1800 40 T1900 40 T2000 40 V80 H0 Z" fill="#2A8FAD"/>
        </svg>
      </div>
      <div className="absolute bottom-0 left-0 right-0 overflow-hidden" style={{ height: '60px', zIndex: 4, pointerEvents: 'none', opacity: 0.08 }}>
        <svg width="200%" height="60" viewBox="0 0 2000 60" preserveAspectRatio="none" style={{ animation: 'wave 8s linear infinite' }}>
          <path d="M0 30 Q75 10 150 30 T300 30 T450 30 T600 30 T750 30 T900 30 T1050 30 T1200 30 T1350 30 T1500 30 T1650 30 T1800 30 T1950 30 V60 H0 Z" fill="#85C1D4"/>
        </svg>
      </div>
    </>
  );
};

export default WaterBackground;
