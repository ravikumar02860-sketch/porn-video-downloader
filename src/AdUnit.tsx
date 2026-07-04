import React, { useEffect, useRef } from 'react';

interface AdUnitProps {
  id: string;
  keyStr: string;
  format: 'iframe';
  height: number;
  width: number;
}

export default function AdUnit({ id, keyStr, format, height, width }: AdUnitProps) {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!containerRef.current) return;
    
    // Clear any previous content
    containerRef.current.innerHTML = '';

    // Create unique ID wrapper for this specific banner instance
    const adWrapper = document.createElement('div');
    adWrapper.id = `container-${keyStr}-${Math.random().toString(36).substr(2, 9)}`;
    containerRef.current.appendChild(adWrapper);

    // Inject configuration
    const configScript = document.createElement('script');
    configScript.type = 'text/javascript';
    configScript.text = `
      atOptions = {
        'key' : '${keyStr}',
        'format' : '${format}',
        'height' : ${height},
        'width' : ${width},
        'params' : {}
      };
    `;
    adWrapper.appendChild(configScript);

    // Inject invoker script
    const loaderScript = document.createElement('script');
    loaderScript.type = 'text/javascript';
    loaderScript.src = `https://endedstrung.com/${keyStr}/invoke.js`;
    adWrapper.appendChild(loaderScript);

    return () => {
      if (containerRef.current) {
        containerRef.current.innerHTML = '';
      }
    };
  }, [keyStr, format, height, width]);

  return (
    <div 
      ref={containerRef} 
      className="flex justify-center items-center my-4 mx-auto overflow-hidden bg-transparent"
      style={{ minHeight: `${height}px`, minWidth: `${width}px` }}
      id={id}
    />
  );
}
