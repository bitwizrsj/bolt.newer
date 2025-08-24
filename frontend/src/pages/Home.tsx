import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Sparkles, Code, Zap, Globe, ArrowRight, Github, Twitter } from 'lucide-react';

export function Home() {
  const [prompt, setPrompt] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (prompt.trim()) {
      setIsLoading(true);
      // Add a small delay for better UX
      setTimeout(() => {
        navigate('/builder', { state: { prompt } });
      }, 500);
    }
  };

  const examples = [
    "Build a modern portfolio website with dark theme",
    "Create a landing page for a SaaS product",
    "Design a blog with clean typography",
    "Make a dashboard with charts and analytics"
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-950 via-gray-900 to-gray-800">
      {/* Header */}
      <header className="relative z-10 px-6 py-4">
        <nav className="flex items-center justify-between max-w-7xl mx-auto">
          <div className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-purple-600 rounded-lg flex items-center justify-center">
              <Sparkles className="w-5 h-5 text-white" />
            </div>
            <span className="text-xl font-bold text-white">BuilderAI</span>
          </div>
          <div className="flex items-center space-x-4">
            <button className="text-gray-300 hover:text-white transition-colors">
              <Github className="w-5 h-5" />
            </button>
            <button className="text-gray-300 hover:text-white transition-colors">
              <Twitter className="w-5 h-5" />
            </button>
          </div>
        </nav>
      </header>

      {/* Hero Section */}
      <main className="relative z-10 px-6 py-20">
        <div className="max-w-4xl mx-auto text-center">
          {/* Badge */}
          <div className="inline-flex items-center px-4 py-2 bg-gray-800/50 border border-gray-700 rounded-full text-sm text-gray-300 mb-8">
            <Zap className="w-4 h-4 mr-2 text-yellow-400" />
            Powered by AI • Build anything in seconds
          </div>

          {/* Main Heading */}
          <h1 className="text-5xl md:text-7xl font-bold text-white mb-6 leading-tight">
            Build websites with
            <span className="bg-gradient-to-r from-blue-400 via-purple-500 to-pink-500 bg-clip-text text-transparent">
              {' '}AI magic
            </span>
          </h1>

          <p className="text-xl text-gray-300 mb-12 max-w-2xl mx-auto leading-relaxed">
            Describe your vision and watch as our AI creates a fully functional website with modern design, 
            clean code, and responsive layouts.
          </p>

          {/* Prompt Input */}
          <form onSubmit={handleSubmit} className="max-w-2xl mx-auto mb-12">
            <div className="relative">
              <textarea
                value={prompt}
                onChange={(e) => setPrompt(e.target.value)}
                placeholder="Describe the website you want to build..."
                className="w-full h-32 p-6 bg-gray-900/50 backdrop-blur-sm text-white border border-gray-700 rounded-2xl focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none placeholder-gray-400 text-lg"
                disabled={isLoading}
              />
              <button
                type="submit"
                disabled={!prompt.trim() || isLoading}
                className="absolute bottom-4 right-4 bg-gradient-to-r from-blue-500 to-purple-600 text-white px-6 py-3 rounded-xl font-medium hover:from-blue-600 hover:to-purple-700 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center space-x-2"
              >
                {isLoading ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    <span>Creating...</span>
                  </>
                ) : (
                  <>
                    <span>Build Now</span>
                    <ArrowRight className="w-4 h-4" />
                  </>
                )}
              </button>
            </div>
          </form>

          {/* Example Prompts */}
          <div className="mb-16">
            <p className="text-gray-400 mb-4">Try these examples:</p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 max-w-3xl mx-auto">
              {examples.map((example, index) => (
                <button
                  key={index}
                  onClick={() => setPrompt(example)}
                  className="text-left p-4 bg-gray-800/30 border border-gray-700 rounded-xl hover:bg-gray-800/50 hover:border-gray-600 transition-all duration-200 text-gray-300 hover:text-white"
                >
                  "{example}"
                </button>
              ))}
            </div>
          </div>

          {/* Features */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-4xl mx-auto">
            <div className="text-center p-6">
              <div className="w-12 h-12 bg-blue-500/20 rounded-xl flex items-center justify-center mx-auto mb-4">
                <Code className="w-6 h-6 text-blue-400" />
              </div>
              <h3 className="text-xl font-semibold text-white mb-2">Clean Code</h3>
              <p className="text-gray-400">Production-ready code with best practices and modern frameworks</p>
            </div>
            <div className="text-center p-6">
              <div className="w-12 h-12 bg-purple-500/20 rounded-xl flex items-center justify-center mx-auto mb-4">
                <Sparkles className="w-6 h-6 text-purple-400" />
              </div>
              <h3 className="text-xl font-semibold text-white mb-2">AI-Powered</h3>
              <p className="text-gray-400">Advanced AI understands your requirements and builds accordingly</p>
            </div>
            <div className="text-center p-6">
              <div className="w-12 h-12 bg-green-500/20 rounded-xl flex items-center justify-center mx-auto mb-4">
                <Globe className="w-6 h-6 text-green-400" />
              </div>
              <h3 className="text-xl font-semibold text-white mb-2">Live Preview</h3>
              <p className="text-gray-400">See your website come to life with real-time preview</p>
            </div>
          </div>
        </div>
      </main>

      {/* Background Effects */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-purple-500/20 rounded-full blur-3xl" />
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-blue-500/20 rounded-full blur-3xl" />
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-gradient-to-r from-blue-500/10 to-purple-500/10 rounded-full blur-3xl" />
      </div>
    </div>
  );
}