const WaterBackground = () => {
  return (
    <>
      {/* Blob 1 - top left */}
      <div
        className="watercolor-blob"
        style={{
          top: '-10%',
          left: '-15%',
          width: '500px',
          height: '500px',
          background: 'radial-gradient(ellipse, rgba(42,143,173,0.25) 0%, transparent 70%)',
          opacity: 0.18,
        }}
      />
      {/* Blob 2 - bottom right */}
      <div
        className="watercolor-blob watercolor-blob-2"
        style={{
          bottom: '-5%',
          right: '-10%',
          width: '600px',
          height: '500px',
          background: 'radial-gradient(ellipse, rgba(26,107,154,0.3) 0%, transparent 70%)',
          opacity: 0.18,
        }}
      />
      {/* Blob 3 - center left */}
      <div
        className="watercolor-blob watercolor-blob-3"
        style={{
          top: '40%',
          left: '-5%',
          width: '450px',
          height: '400px',
          background: 'radial-gradient(ellipse, rgba(59,109,17,0.2) 0%, transparent 70%)',
          opacity: 0.15,
        }}
      />
      {/* Floating water particles */}
      {[...Array(6)].map((_, i) => (
        <div
          key={i}
          className="absolute rounded-full"
          style={{
            width: `${6 + i * 2}px`,
            height: `${6 + i * 2}px`,
            background: 'rgba(133,193,212,0.3)',
            left: `${15 + i * 14}%`,
            bottom: `${5 + i * 3}%`,
            animation: `particle-float ${6 + i * 1.5}s ease-in-out infinite`,
            animationDelay: `${i * 1.2}s`,
            pointerEvents: 'none',
            zIndex: 0,
          }}
        />
      ))}
    </>
  );
};

export default WaterBackground;
