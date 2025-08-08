import { WebContainer } from '@webcontainer/api';
import React, { useEffect, useState } from 'react';

interface PreviewFrameProps {
  files: any[];
  webContainer: WebContainer;
}

export function PreviewFrame({ files, webContainer }: PreviewFrameProps) {
  // In a real implementation, this would compile and render the preview
  const [url, setUrl] = useState("");

  async function main() {
    if (!webContainer) return;
    
    console.log("Starting preview setup...");
    
    const installProcess = await webContainer.spawn('npm', ['install']);

    installProcess.output.pipeTo(new WritableStream({
      write(data) {
        console.log(data);
      }
    }));

    const exitCode = await installProcess.exit;
    
    if (exitCode !== 0) {
      console.error('Failed to install dependencies');
      return;
    }
    
    console.log("Dependencies installed, starting dev server...");
    
    const devProcess = await webContainer.spawn('npm', ['run', 'dev']);
    
    devProcess.output.pipeTo(new WritableStream({
      write(data) {
        console.log('Dev server:', data);
      }
    }));

    // Wait for `server-ready` event
    webContainer.on('server-ready', (port, url) => {
      console.log('Server ready on port:', port, 'URL:', url);
      setUrl(url);
    });
  }

  useEffect(() => {
    if (webContainer && files.length > 0) {
      main();
    }
  }, [webContainer, files])
  return (
    <div className="h-full flex items-center justify-center text-gray-400">
      {!url && <div className="text-center">
        <p className="mb-2">Loading...</p>
      </div>}
      {url && <iframe width={"100%"} height={"100%"} src={url} />}
    </div>
  );
}