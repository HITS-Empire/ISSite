import React, { useState, useEffect } from 'react';

const MousePointField = () => {
  const [points, setPoints] = useState([]);
  const [windowSize, setWindowSize] = useState({ width: window.innerWidth, height: window.innerHeight });

  const handleMouseClick = (e) => {
    const rect = e.target.getBoundingClientRect();
    const offsetX = e.clientX - rect.left;
    const offsetY = e.clientY - rect.top;
    setPoints([...points, { x: offsetX, y: offsetY }]);
  };

  useEffect(() => {
    const handleResize = () => {
      setWindowSize({ width: window.innerWidth, height: window.innerHeight });
    };

    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  return (
    <div style={{ width: windowSize.width * 0.8, height: windowSize.height * 0.8, position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', backgroundColor: 'black' }} onClick={handleMouseClick}>
      {points.map((point, index) => (
        <div key={index} style={{ position: 'absolute', left: point.x, top: point.y, color: 'white' }}>
          &#9679; {/* Unicode for a white circle */}
        </div>
      ))}
    </div>
  );
};

export default MousePointField;