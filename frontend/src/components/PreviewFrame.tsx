import React, { useEffect, useState } from 'react';
import { WebContainer } from '@webcontainer/api';
import { Monitor, AlertCircle, RefreshCw, ExternalLink } from 'lucide-react';

interface PreviewFrameProps {
  files: any[];
  webContainer?: WebContainer;
}

export function PreviewFrame({ files, webContainer }: PreviewFrameProps) {
  const [url, setUrl] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function startPreview() {
    if (!webContainer) {
      console.log("WebContainer not available");
      return;
    }
    
    if (files.length === 0) {
      console.log("No files to preview");
      return;
    }

    try {
      setLoading(true);
      setError("");
      console.log("Starting preview setup...");
      
      const hasPackageJson = files.some(file => 
        file.name === 'package.json' || 
        (file.children && file.children.some((child: any) => child.name === 'package.json'))
      );

      if (!hasPackageJson) {
        setError("No package.json found in project files");
        setLoading(false);
        return;
      }

      console.log("Installing dependencies...");
      const installProcess = await webContainer.spawn('npm', ['install']);

      let installOutput = "";
      installProcess.output.pipeTo(new WritableStream({
        write(data) {
          installOutput += data;
          console.log("Install:", data);
        }
      }));

      const installExitCode = await installProcess.exit;
      
      if (installExitCode !== 0) {
        console.error('Failed to install dependencies. Exit code:', installExitCode);
        setError(`Failed to install dependencies (exit code: ${installExitCode})`);
        setLoading(false);
        return;
      }
      
      console.log("Dependencies installed successfully, starting dev server...");
      
      const devProcess = await webContainer.spawn('npm', ['run', 'dev']);
      
      devProcess.output.pipeTo(new WritableStream({
        write(data) {
          console.log('Dev server output:', data);
        }
      }));

      webContainer.on('server-ready', (port, url) => {
        console.log('Server ready on port:', port, 'URL:', url);
        setUrl(url);
        setLoading(false);
      });

      setTimeout(() => {
        if (!url && loading) {
          console.log("Timeout waiting for server, trying default URL");
          setUrl("http://localhost:5173");
          setLoading(false);
        }
      }, 10000);

    } catch (err) {
      console.error('Error starting preview:', err);
      setError(`Error starting preview: ${err instanceof Error ? err.message : 'Unknown error'}`);
      setLoading(false);
    }
  }

  useEffect(() => {
    if (webContainer && files.length > 0) {
      startPreview();
    }
  }, [webContainer, files.length]);

  if (!webContainer) {
    return (
      <div className="h-full flex items-center justify-center bg-gray-950 text-gray-400">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-gray-700 border-t-blue-500 rounded-full animate-spin mx-auto mb-4" />
          <p className="text-lg font-medium mb-2">Initializing WebContainer</p>
          <p className="text-sm">Setting up the development environment...</p>
        </div>
      </div>
    );
  }

  if (files.length === 0) {
    return (
      <div className="h-full flex items-center justify-center bg-gray-950 text-gray-400">
        <div className="text-center">
          <Monitor className="w-12 h-12 mx-auto mb-4 opacity-50" />
          <p className="text-lg font-medium mb-2">No preview available</p>
          <p className="text-sm">Generate some code first to see the preview</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="h-full flex items-center justify-center bg-gray-950 text-red-400">
        <div className="text-center max-w-md">
          <AlertCircle className="w-12 h-12 mx-auto mb-4" />
          <p className="text-lg font-medium mb-2">Preview Error</p>
          <p className="text-sm mb-4 text-gray-400">{error}</p>
          <button 
            onClick={startPreview}
            className="flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors mx-auto"
          >
            <RefreshCw className="w-4 h-4" />
            <span>Retry</span>
          </button>
        </div>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="h-full flex items-center justify-center bg-gray-950 text-gray-400">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-gray-700 border-t-blue-500 rounded-full animate-spin mx-auto mb-4" />
          <p className="text-lg font-medium mb-2">Setting up preview</p>
          <p className="text-sm">Installing dependencies and starting dev server...</p>
        </div>
      </div>
    );
  }

  if (!url) {
    return (
      <div className="h-full flex items-center justify-center bg-gray-950 text-gray-400">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-gray-700 border-t-blue-500 rounded-full animate-spin mx-auto mb-4" />
          <p className="text-lg font-medium mb-2">Starting dev server</p>
          <p className="text-sm">Please wait...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="h-full bg-gray-950">
      <div className="h-12 bg-gray-900 border-b border-gray-800 flex items-center justify-between px-4">
        <div className="flex items-center space-x-2">
          <Monitor className="w-4 h-4 text-gray-400" />
          <span className="text-sm text-gray-300 font-mono">{url}</span>
        </div>
        <button
          onClick={() => window.open(url, '_blank')}
          className="flex items-center space-x-1 px-3 py-1 text-xs bg-gray-800 text-gray-300 rounded hover:bg-gray-700 transition-colors"
        >
          <ExternalLink className="w-3 h-3" />
          <span>Open</span>
        </button>
      </div>
      <div className="h-[calc(100%-3rem)]">
        <iframe 
          src={url} 
          className="w-full h-full border-0"
          title="Preview"
          onError={() => setError("Failed to load preview")}
        />
      </div>
    </div>
  );
}