import React from 'react';
import Editor from '@monaco-editor/react';
import { FileItem } from '../types';
import { FileText } from 'lucide-react';

interface CodeEditorProps {
  file: FileItem | null;
}

export function CodeEditor({ file }: CodeEditorProps) {
  if (!file) {
    return (
      <div className="h-full flex items-center justify-center text-gray-400 bg-gray-950">
        <div className="text-center">
          <FileText className="w-12 h-12 mx-auto mb-4 opacity-50" />
          <p className="text-lg font-medium mb-2">No file selected</p>
          <p className="text-sm">Choose a file from the explorer to view its contents</p>
        </div>
      </div>
    );
  }

  const getLanguage = (fileName: string) => {
    const ext = fileName.split('.').pop()?.toLowerCase();
    switch (ext) {
      case 'js':
      case 'jsx':
        return 'javascript';
      case 'ts':
      case 'tsx':
        return 'typescript';
      case 'css':
        return 'css';
      case 'html':
        return 'html';
      case 'json':
        return 'json';
      case 'md':
        return 'markdown';
      default:
        return 'plaintext';
    }
  };

  return (
    <div className="h-full bg-gray-950">
      <div className="h-12 bg-gray-900 border-b border-gray-800 flex items-center px-4">
        <span className="text-sm text-gray-300 font-mono">{file.path}</span>
      </div>
      <div className="h-[calc(100%-3rem)]">
        <Editor
          height="100%"
          language={getLanguage(file.name)}
          theme="vs-dark"
          value={file.content || ''}
          options={{
            readOnly: true,
            minimap: { enabled: false },
            fontSize: 14,
            fontFamily: 'JetBrains Mono, Consolas, Monaco, monospace',
            wordWrap: 'on',
            scrollBeyondLastLine: false,
            automaticLayout: true,
            padding: { top: 16, bottom: 16 },
            lineNumbers: 'on',
            renderWhitespace: 'selection',
            smoothScrolling: true,
          }}
        />
      </div>
    </div>
  );
}