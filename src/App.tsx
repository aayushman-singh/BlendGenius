import { useState, useEffect } from 'react';
import { Sparkles, Download, Share2 } from 'lucide-react';
import { ModelGenerator } from './components/ModelGenerator';
import { ThreeViewer } from './components/ThreeViewer';
import { ModelGallery } from './components/ModelGallery';
import { Model3D } from './types/model';

function App() {
  const [models, setModels] = useState<Model3D[]>([]);
  const [selectedModel, setSelectedModel] = useState<Model3D | null>(null);

  // Load models from localStorage on mount
  useEffect(() => {
    const savedModels = localStorage.getItem('ai-3d-models');
    if (savedModels) {
      try {
        const parsedModels = JSON.parse(savedModels).map((model: any) => ({
          ...model,
          createdAt: new Date(model.createdAt)
        }));
        setModels(parsedModels);
      } catch (error) {
        console.error('Error loading saved models:', error);
      }
    }
  }, []);

  // Save models to localStorage whenever models change
  useEffect(() => {
    localStorage.setItem('ai-3d-models', JSON.stringify(models));
  }, [models]);

  const handleModelGenerated = (model: Model3D) => {
    setModels(prev => [model, ...prev]);
    setSelectedModel(model);
  };

  const handleSelectModel = (model: Model3D) => {
    setSelectedModel(model);
  };

  const handleDeleteModel = (id: string) => {
    setModels(prev => prev.filter(model => model.id !== id));
    if (selectedModel?.id === id) {
      setSelectedModel(null);
    }
  };

  const handleExportModel = () => {
    if (!selectedModel) return;
    
    const dataStr = JSON.stringify(selectedModel, null, 2);
    const dataBlob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(dataBlob);
    
    const link = document.createElement('a');
    link.href = url;
    link.download = `${selectedModel.name.replace(/\s+/g, '_')}.json`;
    link.click();
    
    URL.revokeObjectURL(url);
  };

  const handleShareModel = async () => {
    if (!selectedModel) return;
    
    if (navigator.share) {
      try {
        await navigator.share({
          title: `3D Model: ${selectedModel.name}`,
          text: `Check out this AI-generated 3D model: ${selectedModel.description}`,
          url: window.location.href
        });
      } catch (error) {
        console.log('Error sharing:', error);
      }
    } else {
      // Fallback: copy to clipboard
      const shareText = `Check out this AI-generated 3D model: ${selectedModel.name} - ${selectedModel.description}`;
      navigator.clipboard.writeText(shareText);
      alert('Model details copied to clipboard!');
    }
  };

  return (
    <div className="min-h-screen bg-gray-900 text-white">
      {/* Header */}
      <header className="bg-gray-800 border-b border-gray-700">
        <div className="max-w-7xl mx-auto px-4 py-6">
          <div className="flex items-center gap-3">
            <div className="p-3 bg-gradient-to-r from-purple-600 to-pink-600 rounded-xl">
              <Sparkles className="w-8 h-8 text-white" />
            </div>
            <div>
              <h1 className="text-3xl font-bold bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
                AI 3D Model Generator
              </h1>
              <p className="text-gray-400 mt-1">
                Describe your dreams and watch them come to life in 3D
              </p>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column - Generator */}
          <div className="lg:col-span-1">
            <ModelGenerator onModelGenerated={handleModelGenerated} />
          </div>

          {/* Middle Column - 3D Viewer */}
          <div className="lg:col-span-1">
            <div className="bg-gray-800 rounded-xl p-6 border border-gray-700">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-bold text-white">3D Preview</h2>
                {selectedModel && (
                  <div className="flex gap-2">
                    <button
                      onClick={handleExportModel}
                      className="p-2 bg-green-600 hover:bg-green-700 rounded-lg text-white transition-colors"
                      title="Export Model"
                    >
                      <Download className="w-4 h-4" />
                    </button>
                    <button
                      onClick={handleShareModel}
                      className="p-2 bg-blue-600 hover:bg-blue-700 rounded-lg text-white transition-colors"
                      title="Share Model"
                    >
                      <Share2 className="w-4 h-4" />
                    </button>
                  </div>
                )}
              </div>

              {selectedModel ? (
                <div className="space-y-4">
                  <ThreeViewer model={selectedModel} width={400} height={400} />
                  <div className="bg-gray-700 rounded-lg p-4">
                    <h3 className="font-semibold text-white mb-2">{selectedModel.name}</h3>
                    <p className="text-sm text-gray-300 mb-2">{selectedModel.description}</p>
                    <div className="flex items-center gap-4 text-xs text-gray-400">
                      <span>Color: {selectedModel.color}</span>
                      <span>Created: {selectedModel.createdAt.toLocaleDateString()}</span>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="flex items-center justify-center h-96 bg-gray-900 rounded-lg border border-gray-600">
                  <div className="text-center">
                    <Sparkles className="w-16 h-16 text-gray-600 mx-auto mb-4" />
                    <p className="text-gray-400">Generate a model to see it here</p>
                    <p className="text-sm text-gray-500 mt-2">Your 3D creation will appear in this magical viewer</p>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Right Column - Gallery */}
          <div className="lg:col-span-1">
            <ModelGallery
              models={models}
              onSelectModel={handleSelectModel}
              onDeleteModel={handleDeleteModel}
              selectedModel={selectedModel}
            />
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-gray-800 border-t border-gray-700 mt-16">
        <div className="max-w-7xl mx-auto px-4 py-6">
          <div className="text-center text-gray-400">
            <p>✨ Powered by AI Magic & Three.js ✨</p>
            <p className="text-sm mt-2">Hover and drag to rotate your 3D models</p>
          </div>
        </div>
      </footer>
    </div>
  );
}

export default App;
