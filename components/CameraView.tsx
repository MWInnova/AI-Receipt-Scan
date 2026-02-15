
import React, { useRef, useEffect, useState } from 'react';

interface Props {
  onCapture: (base64: string) => void;
  onCancel: () => void;
}

const CameraView: React.FC<Props> = ({ onCapture, onCancel }) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [isInitializing, setIsInitializing] = useState(true);

  useEffect(() => {
    let stream: MediaStream;
    async function setupCamera() {
      try {
        stream = await navigator.mediaDevices.getUserMedia({
          video: { facingMode: 'environment', width: { ideal: 1920 }, height: { ideal: 1080 } },
          audio: false
        });
        if (videoRef.current) {
          videoRef.current.srcObject = stream;
          setIsInitializing(false);
        }
      } catch (err) {
        alert("Camera access denied.");
        onCancel();
      }
    }
    setupCamera();
    return () => {
      stream?.getTracks().forEach(t => t.stop());
    };
  }, []);

  const capture = () => {
    if (videoRef.current && canvasRef.current) {
      const video = videoRef.current;
      const canvas = canvasRef.current;
      canvas.width = video.videoWidth;
      canvas.height = video.videoHeight;
      const ctx = canvas.getContext('2d');
      if (ctx) {
        ctx.drawImage(video, 0, 0);
        onCapture(canvas.toDataURL('image/jpeg', 0.8));
      }
    }
  };

  return (
    <div className="fixed inset-0 bg-black z-[60] flex flex-col">
      <div className="flex-1 relative overflow-hidden flex items-center justify-center">
        {isInitializing && (
          <div className="text-white flex flex-col items-center">
            <div className="w-8 h-8 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
            <p className="mt-4 text-sm font-medium">Opening Camera...</p>
          </div>
        )}
        <video 
          ref={videoRef} 
          autoPlay 
          playsInline 
          className="w-full h-full object-cover"
        />
        
        {/* Scanning Guide Overlay */}
        <div className="absolute inset-0 pointer-events-none flex items-center justify-center p-12">
          <div className="w-full aspect-[2/3] border-2 border-white/30 rounded-3xl relative">
            <div className="absolute top-0 left-0 w-8 h-8 border-t-4 border-l-4 border-blue-500 rounded-tl-lg -mt-1 -ml-1"></div>
            <div className="absolute top-0 right-0 w-8 h-8 border-t-4 border-r-4 border-blue-500 rounded-tr-lg -mt-1 -mr-1"></div>
            <div className="absolute bottom-0 left-0 w-8 h-8 border-b-4 border-l-4 border-blue-500 rounded-bl-lg -mb-1 -ml-1"></div>
            <div className="absolute bottom-0 right-0 w-8 h-8 border-b-4 border-r-4 border-blue-500 rounded-br-lg -mb-1 -mr-1"></div>
          </div>
        </div>
      </div>

      <div className="h-44 bg-black flex flex-col items-center justify-center safe-area-bottom px-8">
        <div className="w-full flex items-center justify-between">
          <button onClick={onCancel} className="text-white font-semibold text-lg">Cancel</button>
          <button 
            onClick={capture}
            className="w-20 h-20 bg-white rounded-full border-[6px] border-white/30 active:scale-90 transition-transform flex items-center justify-center"
          >
            <div className="w-16 h-16 rounded-full border-2 border-black/10"></div>
          </button>
          <div className="w-14"></div> {/* Spacer */}
        </div>
        <p className="text-white/60 text-xs font-medium mt-4 tracking-wide uppercase">Center receipt in frame</p>
      </div>
      <canvas ref={canvasRef} className="hidden" />
    </div>
  );
};

export default CameraView;
