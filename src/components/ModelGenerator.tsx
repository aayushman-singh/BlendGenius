import { useState } from 'react';
import { Wand2, Sparkles } from 'lucide-react';
import { AIModelGenerator } from '../utils/aiModelGenerator';
import { Model3D } from '../types/model';

interface ModelGeneratorProps {
  onModelGenerated: (model: Model3D) => void;
}

export const ModelGenerator: React.FC<ModelGeneratorProps> = ({ onModelGenerated }) => {
  const [description, setDescription] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);

  const generateModel = async () => {
    if (!description.trim()) return;

    setIsGenerating(true);

    // Simulate AI processing time
    await new Promise(resolve => setTimeout(resolve, 1500));

    try {
      const params = AIModelGenerator.generateModel(description);
      const geometry = AIModelGenerator.createGeometry(params);
      
      // Serialize geometry parameters for storage
      const geometryData = {
        type: geometry.type,
        parameters: getGeometryParameters(geometry, params)
      };

      const model: Model3D = {
        id: Date.now().toString(),
        name: generateModelName(description),
        description,
        geometry: JSON.stringify(geometryData),
        color: params.color,
        createdAt: new Date(),
      };

      onModelGenerated(model);
    } catch (error) {
      console.error('Error generating model:', error);
    } finally {
      setIsGenerating(false);
    }
  };

  const getGeometryParameters = (geometry: any, params: any): number[] => {
    const { shape, size, complexity } = params;
    const scale = size;

    switch (shape) {
      case 'cube':
        return [scale, scale, scale, Math.floor(complexity * 4), Math.floor(complexity * 4), Math.floor(complexity * 4)];
      case 'cylinder':
        return [scale * 0.5, scale * 0.5, scale * 1.5, Math.floor(8 + complexity * 16)];
      case 'cone':
        return [scale * 0.7, scale * 1.5, Math.floor(8 + complexity * 16)];
      case 'torus':
        return [scale * 0.7, scale * 0.3, Math.floor(8 + complexity * 8), Math.floor(16 + complexity * 16)];
      case 'octahedron':
        return [scale, Math.floor(complexity * 3)];
      case 'dodecahedron':
        return [scale, Math.floor(complexity * 2)];
      default: // sphere
        return [scale * 0.8, Math.floor(16 + complexity * 16), Math.floor(12 + complexity * 12)];
    }
  };

  const generateModelName = (desc: string): string => {
    const words = desc.split(' ').slice(0, 3);
    return words.map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' ');
  };

  const examplePrompts = [
    "A crystalline blue diamond with sharp edges",
    "A smooth golden sphere with metallic finish",
    "A large red cube with geometric patterns",
    "A small green organic flowing shape",
    "A futuristic purple cylinder with glowing effects"
  ];

  return (
    <div className="bg-gray-800 rounded-xl p-6 border border-gray-700">
      <div className="flex items-center gap-3 mb-6">
        <div className="p-2 bg-purple-600 rounded-lg">
          <Wand2 className="w-6 h-6 text-white" />
        </div>
        <h2 className="text-2xl font-bold text-white">AI Model Generator</h2>
      </div>

      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-300 mb-2">
            Describe your dream creation
          </label>
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Describe what you want to create... (e.g., 'a crystalline blue diamond with sharp edges')"
            className="w-full h-24 px-4 py-3 bg-gray-700 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent resize-none"
          />
        </div>

        <button
          onClick={generateModel}
          disabled={!description.trim() || isGenerating}
          className="w-full bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 disabled:from-gray-600 disabled:to-gray-600 text-white font-semibold py-3 px-6 rounded-lg transition-all duration-200 flex items-center justify-center gap-2"
        >
          {isGenerating ? (
            <>
              <Sparkles className="w-5 h-5 animate-spin" />
              Generating Magic...
            </>
          ) : (
            <>
              <Wand2 className="w-5 h-5" />
              Generate 3D Model
            </>
          )}
        </button>

        <div className="mt-6">
          <h3 className="text-sm font-medium text-gray-300 mb-3">Try these examples:</h3>
          <div className="grid grid-cols-1 gap-2">
            {examplePrompts.map((prompt, index) => (
              <button
                key={index}
                onClick={() => setDescription(prompt)}
                className="text-left text-sm text-gray-400 hover:text-purple-400 p-2 rounded hover:bg-gray-700 transition-colors"
              >
                "{prompt}"
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
