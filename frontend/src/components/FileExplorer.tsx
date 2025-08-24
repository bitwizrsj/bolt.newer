import React, { useState } from 'react';
import { FolderTree, File, ChevronRight, ChevronDown, Folder, FileCode } from 'lucide-react';
import { FileItem } from '../types';

interface FileExplorerProps {
  files: FileItem[];
  onFileSelect: (file: FileItem) => void;
}

interface FileNodeProps {
  item: FileItem;
  depth: number;
  onFileClick: (file: FileItem) => void;
}

function FileNode({ item, depth, onFileClick }: FileNodeProps) {
  const [isExpanded, setIsExpanded] = useState(depth === 0);

  const handleClick = () => {
    if (item.type === 'folder') {
      setIsExpanded(!isExpanded);
    } else {
      onFileClick(item);
    }
  };

  const getFileIcon = (fileName: string) => {
    const ext = fileName.split('.').pop()?.toLowerCase();
    switch (ext) {
      case 'js':
      case 'jsx':
      case 'ts':
      case 'tsx':
        return <FileCode className="w-4 h-4 text-yellow-400" />;
      case 'json':
        return <FileCode className="w-4 h-4 text-green-400" />;
      case 'css':
        return <FileCode className="w-4 h-4 text-blue-400" />;
      case 'html':
        return <FileCode className="w-4 h-4 text-orange-400" />;
      case 'md':
        return <FileCode className="w-4 h-4 text-gray-400" />;
      default:
        return <File className="w-4 h-4 text-gray-400" />;
    }
  };

  return (
    <div className="select-none">
      <div
        className={`flex items-center gap-2 p-2 hover:bg-gray-800/50 rounded-md cursor-pointer transition-colors ${
          item.type === 'file' ? 'hover:bg-gray-700/50' : ''
        }`}
        style={{ paddingLeft: `${depth * 1.2 + 0.5}rem` }}
        onClick={handleClick}
      >
        {item.type === 'folder' && (
          <span className="text-gray-500">
            {isExpanded ? (
              <ChevronDown className="w-4 h-4" />
            ) : (
              <ChevronRight className="w-4 h-4" />
            )}
          </span>
        )}
        {item.type === 'folder' ? (
          <Folder className="w-4 h-4 text-blue-400" />
        ) : (
          getFileIcon(item.name)
        )}
        <span className={`text-sm ${
          item.type === 'folder' ? 'text-gray-200 font-medium' : 'text-gray-300'
        }`}>
          {item.name}
        </span>
      </div>
      {item.type === 'folder' && isExpanded && item.children && (
        <div>
          {item.children.map((child, index) => (
            <FileNode
              key={`${child.path}-${index}`}
              item={child}
              depth={depth + 1}
              onFileClick={onFileClick}
            />
          ))}
        </div>
      )}
    </div>
  );
}

export function FileExplorer({ files, onFileSelect }: FileExplorerProps) {
  return (
    <div className="h-full">
      {files.length === 0 ? (
        <div className="flex items-center justify-center h-32 text-gray-500">
          <div className="text-center">
            <FolderTree className="w-8 h-8 mx-auto mb-2 opacity-50" />
            <p className="text-sm">No files yet</p>
          </div>
        </div>
      ) : (
        <div className="p-2 space-y-1">
          {files.map((file, index) => (
            <FileNode
              key={`${file.path}-${index}`}
              item={file}
              depth={0}
              onFileClick={onFileSelect}
            />
          ))}
        </div>
      )}
    </div>
  );
}