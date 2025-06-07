import { useState } from 'react';
import { Grid3X3, Trash2, Eye } from 'lucide-react';
import { Model3D } from '../types/model';

interface ModelGalleryProps {
  models: Model3D[];
  onSelectModel: (model: Model3D) => void;
  onDeleteModel: (id: string) => void;
  selectedModel: Model3D | null;
}

export const ModelGallery: React.FC<ModelGalleryProps> = ({
  models,
  onSelectModel,
  onDeleteModel,
  selectedModel
}) => {
  const [hoveredModel, setHoveredModel] = useState<string | null>(null);

  return (
    <div className="bg-gray-800 rounded-xl p-6 border border-gray-700">
      <div className="flex items-center gap-3 mb-6">
        <div className="p-2 bg-blue-600 rounded-lg">
          <Grid3X3 className="w-6 h-6 text-white" />
        </div>
        <h2 className="text-2xl font-bold text-white">Gallery</h2>
        <span className="text-sm text-gray-400">({models.length} models)</span>
      </div>

      {models.length === 0 ? (
        <div className="text-center py-12">
          <Grid3X3 className="w-16 h-16 text-gray-600 mx-auto mb-4" />
          <p className="text-gray-400">No models created yet</p>
          <p className="text-sm text-gray-500 mt-2">Generate your first 3D model to see it here!</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 max-h-96 overflow-y-auto">
          {models.map((model) => (
            <div
              key={model.id}
              className={`relative group bg-gray-700 rounded-lg p-4 cursor-pointer transition-all duration-200 border-2 ${
                selectedModel?.id === model.id 
                  ? 'border-purple-500 bg-gray-600' 
                  : 'border-transparent hover:border-gray-500'
              }`}
              onMouseEnter={() => setHoveredModel(model.id)}
              onMouseLeave={() => setHoveredModel(null)}
              onClick={() => onSelectModel(model)}
            >
              {/* Model Preview */}
              <div className="aspect-square bg-gray-900 rounded-lg mb-3 flex items-center justify-center border border-gray-600">
                <div 
                  className="w-12 h-12 rounded-full"
                  style={{ backgroundColor: model.color }}
                />
              </div>

              {/* Model Info */}
              <div className="space-y-1">
                <h3 className="font-semibold text-white text-sm truncate">
                  {model.name}
                </h3>
                <p className="text-xs text-gray-400 line-clamp-2">
                  {model.description}
                </p>
                <p className="text-xs text-gray-500">
                  {model.createdAt.toLocaleDateString()}
                </p>
              </div>

              {/* Hover Actions */}
              {hoveredModel === model.id && (
                <div className="absolute inset-0 bg-black bg-opacity-50 rounded-lg flex items-center justify-center gap-2">
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      onSelectModel(model);
                    }}
                    className="p-2 bg-blue-600 hover:bg-blue-700 rounded-lg text-white transition-colors"
                    title="View Model"
                  >
                    <Eye className="w-4 h-4" />
                  </button>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      onDeleteModel(model.id);
                    }}
                    className="p-2 bg-red-600 hover:bg-red-700 rounded-lg text-white transition-colors"
                    title="Delete Model"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              )}

              {/* Selected Indicator */}
              {selectedModel?.id === model.id && (
                <div className="absolute top-2 right-2 w-3 h-3 bg-purple-500 rounded-full"></div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
