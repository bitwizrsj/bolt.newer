import React, { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { StepsList } from '../components/StepsList';
import { FileExplorer } from '../components/FileExplorer';
import { TabView } from '../components/TabView';
import { CodeEditor } from '../components/CodeEditor';
import { PreviewFrame } from '../components/PreviewFrame';
import { ChatInterface } from '../components/ChatInterface';
import { Step, FileItem, StepType } from '../types';
import axios from 'axios';
import { BACKEND_URL } from '../config';
import { parseXml } from '../steps';
import { useWebContainer } from '../hooks/useWebContainer';
import { Sparkles, ArrowLeft, Settings, Share } from 'lucide-react';
import { Loader } from '../components/Loader';

export function Builder() {
  const location = useLocation();
  const navigate = useNavigate();
  const { prompt } = location.state as { prompt: string };
  const [llmMessages, setLlmMessages] = useState<{role: "user" | "assistant", content: string;}[]>([]);
  const [loading, setLoading] = useState(false);
  const [templateSet, setTemplateSet] = useState(false);
  const { webcontainer, loading: webContainerLoading } = useWebContainer();

  const [currentStep, setCurrentStep] = useState(1);
  const [activeTab, setActiveTab] = useState<'code' | 'preview'>('preview');
  const [selectedFile, setSelectedFile] = useState<FileItem | null>(null);
  const [showChat, setShowChat] = useState(false);
  
  const [steps, setSteps] = useState<Step[]>([]);
  const [files, setFiles] = useState<FileItem[]>([]);

  useEffect(() => {
    let originalFiles = [...files];
    let updateHappened = false;
    steps.filter(({status}) => status === "pending").forEach(step => {
      updateHappened = true;
      if (step?.type === StepType.CreateFile) {
        let parsedPath = step.path?.split("/") ?? [];
        let currentFileStructure = [...originalFiles];
        let finalAnswerRef = currentFileStructure;
  
        let currentFolder = ""
        while(parsedPath.length) {
          currentFolder =  `${currentFolder}/${parsedPath[0]}`;
          let currentFolderName = parsedPath[0];
          parsedPath = parsedPath.slice(1);
  
          if (!parsedPath.length) {
            let file = currentFileStructure.find(x => x.path === currentFolder)
            if (!file) {
              currentFileStructure.push({
                name: currentFolderName,
                type: 'file',
                path: currentFolder,
                content: step.code
              })
            } else {
              file.content = step.code;
            }
          } else {
            let folder = currentFileStructure.find(x => x.path === currentFolder)
            if (!folder) {
              currentFileStructure.push({
                name: currentFolderName,
                type: 'folder',
                path: currentFolder,
                children: []
              })
            }
  
            currentFileStructure = currentFileStructure.find(x => x.path === currentFolder)!.children!;
          }
        }
        originalFiles = finalAnswerRef;
      }
    });

    if (updateHappened) {
      setFiles(originalFiles)
      setSteps(steps => steps.map((s: Step) => {
        return {
          ...s,
          status: "completed"
        }
      }))
    }
  }, [steps]);

  useEffect(() => {
    const createMountStructure = (files: FileItem[]): Record<string, any> => {
      const mountStructure: Record<string, any> = {};
  
      const processFile = (file: FileItem, isRootFolder: boolean) => {  
        if (file.type === 'folder') {
          mountStructure[file.name] = {
            directory: file.children ? 
              Object.fromEntries(
                file.children.map(child => [child.name, processFile(child, false)])
              ) 
              : {}
          };
        } else if (file.type === 'file') {
          if (isRootFolder) {
            mountStructure[file.name] = {
              file: {
                contents: file.content || ''
              }
            };
          } else {
            return {
              file: {
                contents: file.content || ''
              }
            };
          }
        }
  
        return mountStructure[file.name];
      };
  
      files.forEach(file => processFile(file, true));
      return mountStructure;
    };
  
    const mountStructure = createMountStructure(files);
  
    if (webcontainer && Object.keys(mountStructure).length > 0) {
      console.log("Mounting files to WebContainer...");
      webcontainer.mount(mountStructure);
    }
  }, [files, webcontainer]);

  async function init() {
    console.log("Starting initialization with prompt:", prompt);
    
    const response = await axios.post(`${BACKEND_URL}/template`, {
      prompt: prompt.trim()
    });
    
    console.log("Template response:", response.data);
    setTemplateSet(true);
    
    const {prompts, uiPrompts} = response.data;

    setSteps(parseXml(uiPrompts[0]).map((x: Step) => ({
      ...x,
      status: "pending"
    })));

    console.log("Sending chat request...");
    setLoading(true);
    
    try {
      const stepsResponse = await axios.post(`${BACKEND_URL}/chat`, {
        messages: [...prompts, prompt].map(content => ({
          role: "user",
          content
        }))
      });
      
      console.log("Chat response received:", stepsResponse.data);

      setSteps(s => [...s, ...parseXml(stepsResponse.data.response).map(x => ({
        ...x,
        status: "pending" as "pending"
      }))]);

      setLlmMessages([...prompts, prompt].map(content => ({
        role: "user",
        content
      })));

      setLlmMessages(x => [...x, {role: "assistant", content: stepsResponse.data.response}]);
    } catch (error) {
      console.error("Error in chat request:", error);
    } finally {
      setLoading(false);
    }
  }

  const handleSendMessage = async (message: string) => {
    const newMessage = {
      role: "user" as "user",
      content: message
    };

    setLoading(true);
    try {
      const stepsResponse = await axios.post(`${BACKEND_URL}/chat`, {
        messages: [...llmMessages, newMessage]
      });

      setLlmMessages(x => [...x, newMessage]);
      setLlmMessages(x => [...x, {
        role: "assistant",
        content: stepsResponse.data.response
      }]);
      
      setSteps(s => [...s, ...parseXml(stepsResponse.data.response).map(x => ({
        ...x,
        status: "pending" as "pending"
      }))]);
    } catch (error) {
      console.error("Error sending message:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (prompt) {
      init();
    }
  }, [])

  return (
    <div className="min-h-screen bg-gray-950 flex flex-col">
      {/* Header */}
      <header className="bg-gray-900/50 backdrop-blur-sm border-b border-gray-800 px-6 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <button
              onClick={() => navigate('/')}
              className="flex items-center space-x-2 text-gray-400 hover:text-white transition-colors"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Back</span>
            </button>
            <div className="flex items-center space-x-2">
              <div className="w-6 h-6 bg-gradient-to-r from-blue-500 to-purple-600 rounded-md flex items-center justify-center">
                <Sparkles className="w-4 h-4 text-white" />
              </div>
              <h1 className="text-lg font-semibold text-white">BuilderAI</h1>
            </div>
          </div>
          
          <div className="flex items-center space-x-3">
            <button
              onClick={() => setShowChat(!showChat)}
              className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                showChat 
                  ? 'bg-blue-600 text-white' 
                  : 'bg-gray-800 text-gray-300 hover:bg-gray-700'
              }`}
            >
              Chat
            </button>
            <button className="p-2 text-gray-400 hover:text-white transition-colors">
              <Settings className="w-5 h-5" />
            </button>
            <button className="p-2 text-gray-400 hover:text-white transition-colors">
              <Share className="w-5 h-5" />
            </button>
          </div>
        </div>
        
        <div className="mt-2">
          <p className="text-sm text-gray-400 truncate">
            Building: <span className="text-gray-300">{prompt}</span>
          </p>
        </div>
      </header>
      
      <div className="flex-1 overflow-hidden">
        <div className="h-full flex">
          {/* Left Sidebar - Steps */}
          <div className="w-80 bg-gray-900/30 border-r border-gray-800 flex flex-col">
            <div className="p-4 border-b border-gray-800">
              <h2 className="text-lg font-semibold text-white">Build Progress</h2>
            </div>
            <div className="flex-1 overflow-auto">
              <StepsList
                steps={steps}
                currentStep={currentStep}
                onStepClick={setCurrentStep}
              />
              {(loading || !templateSet) && (
                <div className="p-4">
                  <Loader />
                </div>
              )}
            </div>
          </div>

          {/* Center - File Explorer */}
          <div className="w-80 bg-gray-900/20 border-r border-gray-800">
            <div className="p-4 border-b border-gray-800">
              <h2 className="text-lg font-semibold text-white">Files</h2>
            </div>
            <div className="h-[calc(100%-4rem)] overflow-auto">
              <FileExplorer 
                files={files} 
                onFileSelect={setSelectedFile}
              />
            </div>
          </div>

          {/* Main Content Area */}
          <div className="flex-1 flex flex-col">
            <div className="p-4 border-b border-gray-800">
              <TabView activeTab={activeTab} onTabChange={setActiveTab} />
            </div>
            <div className="flex-1 overflow-hidden">
              {activeTab === 'code' ? (
                <CodeEditor file={selectedFile} />
              ) : (
                <PreviewFrame webContainer={webcontainer!} files={files} />
              )}
            </div>
          </div>

          {/* Right Sidebar - Chat */}
          {showChat && (
            <div className="w-96 bg-gray-900/30 border-l border-gray-800">
              <ChatInterface
                messages={llmMessages}
                onSendMessage={handleSendMessage}
                loading={loading}
              />
            </div>
          )}
        </div>
      </div>
    </div>
  );
}