import React from 'react';

interface AdUnitProps {
  id: string;
  keyStr: string;
  format: 'iframe';
  height: number;
  width: number;
}

export default function AdUnit({ id, keyStr, format, height, width }: AdUnitProps) {
  // We use an iframe with srcDoc. This isolates the global 'atOptions' scope
  // and captures any cross-origin script errors so they never crash or trigger
  // errors in the parent app window.
  const srcDocHtml = `
    <!DOCTYPE html>
    <html>
      <head>
        <meta charset="utf-8">
        <style>
          body {
            margin: 0;
            padding: 0;
            background: transparent;
            overflow: hidden;
            display: flex;
            justify-content: center;
            align-items: center;
            height: 100vh;
          }
        </style>
        <script>
          // Silence any errors inside the iframe so they never bubble up
          window.onerror = function() { return true; };
          window.addEventListener('error', function(e) {
            e.preventDefault();
            e.stopPropagation();
          }, true);
          window.addEventListener('unhandledrejection', function(e) {
            e.preventDefault();
            e.stopPropagation();
          }, true);
        </script>
      </head>
      <body>
        <div id="ad-container"></div>
        <script type="text/javascript">
          try {
            window.atOptions = {
              'key' : '${keyStr}',
              'format' : '${format}',
              'height' : ${height},
              'width' : ${width},
              'params' : {}
            };
            
            var script = document.createElement('script');
            script.type = 'text/javascript';
            script.src = 'https://endedstrung.com/${keyStr}/invoke.js';
            script.onerror = function(e) {
              console.warn("Ad script failed to load gracefully:", e);
            };
            document.getElementById('ad-container').appendChild(script);
          } catch (err) {
            console.warn("Failed to initialize ad unit:", err);
          }
        </script>
      </body>
    </html>
  `;

  return (
    <iframe
      id={id}
      title={`ad-unit-${keyStr}`}
      srcDoc={srcDocHtml}
      width={width}
      height={height}
      style={{ border: 'none', overflow: 'hidden', background: 'transparent' }}
      className="mx-auto block"
      sandbox="allow-scripts allow-same-origin allow-popups"
    />
  );
}

