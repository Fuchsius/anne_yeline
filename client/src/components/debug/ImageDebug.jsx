import React, { useState, useEffect } from 'react';

export const ImageDebug = ({ url, width = 100, height = 100 }) => {
  const [status, setStatus] = useState('checking...');
  const [error, setError] = useState(null);
  
  useEffect(() => {
    if (!url) {
      setStatus('No URL provided');
      return;
    }
    
    fetch(url, { method: 'HEAD' })
      .then(response => {
        if (response.ok) {
          setStatus(`✅ Status: ${response.status}`);
        } else {
          setStatus(`❌ Status: ${response.status}`);
        }
      })
      .catch(err => {
        setStatus('❌ Error');
        setError(err.message);
      });
  }, [url]);
  
  return (
    <div className="border p-2 mb-2 rounded bg-gray-50">
      <div className="text-xs text-gray-500 mb-1">Debug Image: {url}</div>
      <div className="flex">
        <div className="border mr-2" style={{ width, height }}>
          <img 
            src={url} 
            alt="Debug" 
            style={{ width: '100%', height: '100%', objectFit: 'cover' }}
            onError={() => setStatus('❌ Load failed')}
            onLoad={() => setStatus(prev => prev.startsWith('✅') ? prev : '✅ Loaded')}
          />
        </div>
        <div className="text-xs">
          <div className={status.startsWith('✅') ? 'text-green-600' : 'text-red-600'}>
            {status}
          </div>
          {error && <div className="text-red-600 mt-1">{error}</div>}
        </div>
      </div>
    </div>
  );
}; 