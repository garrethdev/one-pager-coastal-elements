import React, { useState, useEffect, useRef } from 'react';

export function AnimatedGrid() {
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
  const containerRef = useRef<HTMLDivElement>(null);

  // Track mouse movement
  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (containerRef.current) {
        const rect = containerRef.current.getBoundingClientRect();
        setMousePos({
          x: ((e.clientX - rect.left) / rect.width) * 100,
          y: ((e.clientY - rect.top) / rect.height) * 100,
        });
      }
    };

    const container = containerRef.current;
    if (container) {
      container.addEventListener('mousemove', handleMouseMove);
      return () => container.removeEventListener('mousemove', handleMouseMove);
    }
  }, []);

  // Calculate repelling offset for data points
  const getRepellingOffset = (pointX: number, pointY: number) => {
    const distance = Math.sqrt(
      Math.pow(mousePos.x - pointX, 2) + Math.pow(mousePos.y - pointY, 2)
    );
    
    // Repelling radius in percentage
    const repelRadius = 12;
    const maxOffset = 35; // Maximum offset in pixels
    
    if (distance < repelRadius && distance > 0) {
      const force = (repelRadius - distance) / repelRadius;
      const angle = Math.atan2(pointY - mousePos.y, pointX - mousePos.x);
      const offsetX = Math.cos(angle) * force * maxOffset;
      const offsetY = Math.sin(angle) * force * maxOffset;
      
      return { x: offsetX, y: offsetY };
    }
    
    return { x: 0, y: 0 };
  };

  // Sample real estate data points
  const dataPoints = [
    { value: '$547.8K', x: 15, y: 12, type: 'price' },
    { value: '2,450 sq ft', x: 85, y: 25, type: 'sqft' },
    { value: '$183.96', x: 92, y: 8, type: 'price' },
    { value: '3.2%', x: 25, y: 55, type: 'rate' },
    { value: '$425K', x: 65, y: 40, type: 'price' },
    { value: '1,850', x: 45, y: 75, type: 'sqft' },
    { value: '$91.22', x: 30, y: 85, type: 'price' },
    { value: '4.1%', x: 75, y: 65, type: 'rate' },
    { value: '$166.5K', x: 88, y: 78, type: 'price' },
    { value: '2,100', x: 12, y: 45, type: 'sqft' },
    { value: '$75.54', x: 8, y: 95, type: 'price' },
    { value: '3.8%', x: 55, y: 25, type: 'rate' },
    { value: '$234.7K', x: 35, y: 35, type: 'price' },
    { value: '1,680', x: 78, y: 15, type: 'sqft' },
    { value: '$123.5K', x: 58, y: 82, type: 'price' },
    { value: '2.9%', x: 85, y: 55, type: 'rate' },
    { value: '$389K', x: 22, y: 68, type: 'price' },
    { value: '3,200', x: 48, y: 18, type: 'sqft' },
    { value: '$99.8K', x: 72, y: 88, type: 'price' },
    { value: '4.5%', x: 38, y: 52, type: 'rate' },
  ];

  // Mini chart data points
  const chartPoints = [
    { x: 20, y: 20, width: 80, height: 30, points: [0.2, 0.8, 0.3, 0.9, 0.1, 0.6, 0.4] },
    { x: 60, y: 50, width: 60, height: 25, points: [0.5, 0.2, 0.8, 0.3, 0.7, 0.1, 0.9] },
    { x: 15, y: 70, width: 70, height: 20, points: [0.1, 0.4, 0.2, 0.7, 0.9, 0.3, 0.6] },
    { x: 75, y: 30, width: 50, height: 35, points: [0.8, 0.1, 0.5, 0.2, 0.6, 0.9, 0.4] },
    { x: 40, y: 80, width: 65, height: 28, points: [0.3, 0.7, 0.1, 0.8, 0.2, 0.5, 0.9] },
  ];

  // Connection dots
  const connectionDots = [
    { x: 25, y: 30 }, { x: 45, y: 22 }, { x: 65, y: 35 }, { x: 80, y: 28 },
    { x: 15, y: 60 }, { x: 35, y: 70 }, { x: 55, y: 58 }, { x: 75, y: 72 },
    { x: 90, y: 45 }, { x: 10, y: 85 }, { x: 50, y: 90 }, { x: 85, y: 82 },
  ];

  const generateMiniChart = (chart: any, index: number) => {
    const pathData = chart.points.map((point: number, i: number) => {
      const x = (i / (chart.points.length - 1)) * chart.width;
      const y = chart.height - (point * chart.height);
      return i === 0 ? `M ${x} ${y}` : `L ${x} ${y}`;
    }).join(' ');

    return (
      <g key={`chart-${index}`} transform={`translate(${chart.x}, ${chart.y})`}>
        <path
          d={pathData}
          fill="none"
          stroke="#d1d5db"
          strokeWidth="1"
          opacity="0.4"
          className="animate-pulse"
        />
        {chart.points.map((point: number, i: number) => (
          <circle
            key={i}
            cx={(i / (chart.points.length - 1)) * chart.width}
            cy={chart.height - (point * chart.height)}
            r="1"
            fill="#9ca3af"
            opacity="0.5"
          />
        ))}
      </g>
    );
  };

  return (
    <div 
      ref={containerRef}
      className="fixed inset-0 w-full h-full overflow-hidden" 
      style={{ zIndex: 3 }}
    >
      {/* White background */}
      <div className="absolute inset-0 bg-white" />
      
      {/* NYPictogram background image */}
      <div
        className="absolute inset-0 bg-center bg-no-repeat"
        style={{
          backgroundImage: `url('/images/NYPictogram.png')`,
          backgroundSize: 'cover',
          backgroundPosition: 'center bottom',
          opacity: 0.3,
          zIndex: 2
        }}
      />
      
              {/* Main animated container with zoom out effect - BOTTOM LAYER */}
        <div 
          className="absolute inset-0 w-full h-full"
          style={{
            animation: 'zoomOut 25s ease-in-out infinite',
            zIndex: 3
          }}
        >
        {/* Grid lines */}
        <div 
          className="absolute top-0 left-0 w-full h-full opacity-25"
          style={{
            backgroundImage: `
              repeating-linear-gradient(
                90deg,
                transparent,
                transparent calc(100vw / 20 - 1px),
                #d1d5db calc(100vw / 20 - 1px),
                #d1d5db calc(100vw / 20)
              ),
              repeating-linear-gradient(
                0deg,
                transparent,
                transparent calc(100vh / 15 - 1px),
                #d1d5db calc(100vh / 15 - 1px),
                #d1d5db calc(100vh / 15)
              )
            `,
            animation: 'gridMove 30s linear infinite',
            zIndex: 3
          }}
        />

        {/* SVG overlay for charts, dots, and connections */}
        <svg className="absolute inset-0 w-full h-full" style={{ zIndex: 4 }}>
          {/* Grid dots at intersections */}
          {Array.from({ length: 20 }, (_, i) => 
            Array.from({ length: 15 }, (_, j) => (
              <circle
                key={`dot-${i}-${j}`}
                cx={`${(i + 1) * 5}%`}
                cy={`${(j + 1) * 6.67}%`}
                r="1"
                fill="#d1d5db"
                opacity="0.25"
              />
            ))
          )}

          {/* Mini charts */}
          {chartPoints.map((chart, index) => 
            generateMiniChart({ ...chart, x: `${chart.x}%`, y: `${chart.y}%` }, index)
          )}

          {/* Connection dots */}
          {connectionDots.map((dot, index) => (
            <circle
              key={`connection-${index}`}
              cx={`${dot.x}%`}
              cy={`${dot.y}%`}
              r="2"
              fill="#6b7280"
              opacity="0.4"
              className="animate-pulse"
            />
          ))}

          {/* Connection lines */}
          {connectionDots.slice(0, -1).map((dot, index) => {
            const nextDot = connectionDots[index + 1];
            return (
              <line
                key={`line-${index}`}
                x1={`${dot.x}%`}
                y1={`${dot.y}%`}
                x2={`${nextDot.x}%`}
                y2={`${nextDot.y}%`}
                stroke="#d1d5db"
                strokeWidth="0.5"
                opacity="0.25"
                strokeDasharray="2,2"
              />
            );
          })}
        </svg>

        {/* Floating data points */}
        {dataPoints.map((point, index) => {
          const repelOffset = getRepellingOffset(point.x, point.y);
          
          return (
            <div
              key={`data-${index}`}
              className="absolute text-[10px] sm:text-xs font-medium text-gray-500 select-none"
              style={{
                left: `${point.x}%`,
                top: `${point.y}%`,
                transform: `translate(-50%, -50%) translate(${repelOffset.x}px, ${repelOffset.y}px)`,
                animation: `float ${8 + (index % 3) * 2}s ease-in-out infinite`,
                animationDelay: `${index * 0.5}s`,
                opacity: 0.5,
                transition: 'transform 0.15s ease-out',
                cursor: 'default',
                pointerEvents: 'auto',
                zIndex: 5
              }}
            >
              {point.value}
            </div>
          );
        })}

        {/* Additional scattered elements */}
        {Array.from({ length: 15 }, (_, i) => (
          <div
            key={`scatter-${i}`}
            className="absolute w-1 h-1 bg-gray-400 rounded-full opacity-30"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              animation: `scatter ${10 + i}s linear infinite`,
              animationDelay: `${i * 0.3}s`,
              zIndex: 5
            }}
          />
        ))}
      </div>

      {/* CSS animations */}
      <style dangerouslySetInnerHTML={{
        __html: `
          @keyframes zoomOut {
            0% { transform: scale(1); }
            50% { transform: scale(1.1); }
            100% { transform: scale(1); }
          }
          
          @keyframes gridMove {
            0% { transform: translate(0, 0); }
            100% { transform: translate(100px, 100px); }
          }
          
          @keyframes float {
            0%, 100% { transform: translate(-50%, -50%) translateY(0px); }
            50% { transform: translate(-50%, -50%) translateY(-10px); }
          }
          
          @keyframes scatter {
            0% { transform: translate(0, 0) rotate(0deg); }
            25% { transform: translate(10px, -5px) rotate(90deg); }
            50% { transform: translate(-5px, 10px) rotate(180deg); }
            75% { transform: translate(-10px, -5px) rotate(270deg); }
            100% { transform: translate(0, 0) rotate(360deg); }
          }
        `
      }} />
    </div>
  );
} 