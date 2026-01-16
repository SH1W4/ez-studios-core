import React, { useState } from 'react';
import { Link2, Sparkles, RefreshCw } from 'lucide-react';

interface ArtifactIngestorProps {
  onIngest: (content: string) => void;
  isProcessing: boolean;
}

export const ArtifactIngestor: React.FC<ArtifactIngestorProps> = ({ onIngest, isProcessing }) => {
  const [content, setContent] = useState('');
  const [url, setUrl] = useState('');

  const handleMirror = () => {
    if (content.trim()) {
      onIngest(content);
    }
  };

  return (
    <div className={`glass rounded-xl p-6 neural-scanner ${isProcessing ? 'opacity-80' : ''}`}>
      <div className="flex items-center gap-3 mb-6">
        <div className="p-2 bg-core-green/10 rounded-lg">
          <Sparkles className="w-5 h-5 text-core-green" />
        </div>
        <div>
          <h3 className="text-lg font-bold text-white tracking-tight">Artifact Ingestor</h3>
          <p className="text-sm text-white/50">Mirror external logic into your sovereign core</p>
        </div>
      </div>

      <div className="space-y-4">
        <div className="relative">
          <Link2 className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-white/30" />
          <input
            type="text"
            placeholder="External Reference URL (e.g., GitHub Gist)"
            className="w-full bg-white/5 border border-white/10 rounded-lg py-2 pl-10 pr-4 text-sm text-white focus:outline-none focus:border-core-green/50 transition-colors"
            value={url}
            onChange={(e) => setUrl(e.target.value)}
          />
        </div>

        <div className="relative group">
          <textarea
            placeholder="Paste Your Artifact Code Snippet..."
            className="w-full h-40 bg-white/5 border border-white/10 rounded-lg p-4 text-sm text-white font-mono focus:outline-none focus:border-core-green/50 transition-colors resize-none"
            value={content}
            onChange={(e) => setContent(e.target.value)}
          />
          {isProcessing && (
            <div className="absolute inset-0 bg-black/40 backdrop-blur-sm flex flex-col items-center justify-center rounded-lg">
              <RefreshCw className="w-8 h-8 text-core-green animate-spin mb-2" />
              <span className="text-core-green text-xs font-bold tracking-widest uppercase">Distilling...</span>
            </div>
          )}
        </div>

        <button
          onClick={handleMirror}
          disabled={isProcessing || !content.trim()}
          className="w-full py-3 bg-core-green text-void-blue font-bold rounded-lg hover:bg-core-green/90 transition-all flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed group shadow-[0_0_20px_rgba(0,255,157,0.2)]"
        >
          <RefreshCw className={`w-4 h-4 ${isProcessing ? 'animate-spin' : 'group-hover:rotate-180 transition-transform duration-500'}`} />
          MIRROR ARTIFACT
        </button>
      </div>
    </div>
  );
};
