import * as THREE from 'three';
import { ModelGenerationParams } from '../types/model';

export class AIModelGenerator {
  static generateModel(description: string): ModelGenerationParams {
    const words = description.toLowerCase().split(' ');
    
    // AI-like analysis of description
    const shapes = ['sphere', 'cube', 'cylinder', 'cone', 'torus', 'dodecahedron', 'octahedron'];
    const colors = ['#ff6b6b', '#4ecdc4', '#45b7d1', '#96ceb4', '#ffeaa7', '#dda0dd', '#98d8c8'];
    const styles = ['smooth', 'crystalline', 'organic', 'geometric', 'futuristic'];
    
    // Simple keyword matching for shape
    let shape = 'sphere';
    if (words.some(w => ['cube', 'box', 'square'].includes(w))) shape = 'cube';
    else if (words.some(w => ['cylinder', 'tube', 'pipe'].includes(w))) shape = 'cylinder';
    else if (words.some(w => ['cone', 'pyramid', 'triangle'].includes(w))) shape = 'cone';
    else if (words.some(w => ['ring', 'donut', 'torus'].includes(w))) shape = 'torus';
    else if (words.some(w => ['crystal', 'gem', 'diamond'].includes(w))) shape = 'octahedron';
    else if (words.some(w => ['complex', 'detailed', 'intricate'].includes(w))) shape = 'dodecahedron';
    
    // Color detection
    let color = colors[Math.floor(Math.random() * colors.length)];
    if (words.some(w => ['red', 'crimson', 'scarlet'].includes(w))) color = '#ff6b6b';
    else if (words.some(w => ['blue', 'azure', 'cyan'].includes(w))) color = '#45b7d1';
    else if (words.some(w => ['green', 'emerald', 'jade'].includes(w))) color = '#96ceb4';
    else if (words.some(w => ['yellow', 'gold', 'amber'].includes(w))) color = '#ffeaa7';
    else if (words.some(w => ['purple', 'violet', 'magenta'].includes(w))) color = '#dda0dd';
    else if (words.some(w => ['pink', 'rose', 'coral'].includes(w))) color = '#ff9ff3';
    
    // Size based on descriptors
    let size = 1;
    if (words.some(w => ['tiny', 'small', 'mini'].includes(w))) size = 0.5;
    else if (words.some(w => ['large', 'big', 'huge', 'giant'].includes(w))) size = 2;
    else if (words.some(w => ['massive', 'enormous', 'colossal'].includes(w))) size = 3;
    
    // Complexity
    let complexity = 1;
    if (words.some(w => ['simple', 'basic', 'plain'].includes(w))) complexity = 0.5;
    else if (words.some(w => ['complex', 'detailed', 'intricate', 'elaborate'].includes(w))) complexity = 2;
    
    // Style
    let style = 'smooth';
    if (words.some(w => ['crystal', 'sharp', 'angular'].includes(w))) style = 'crystalline';
    else if (words.some(w => ['organic', 'natural', 'flowing'].includes(w))) style = 'organic';
    else if (words.some(w => ['geometric', 'precise', 'mathematical'].includes(w))) style = 'geometric';
    else if (words.some(w => ['futuristic', 'sci-fi', 'tech'].includes(w))) style = 'futuristic';
    
    return { shape, size, color, complexity, style };
  }
  
  static createGeometry(params: ModelGenerationParams): THREE.BufferGeometry {
    const { shape, size, complexity } = params;
    const scale = size;
    
    switch (shape) {
      case 'cube':
        return new THREE.BoxGeometry(scale, scale, scale, 
          Math.floor(complexity * 4), Math.floor(complexity * 4), Math.floor(complexity * 4));
      
      case 'cylinder':
        return new THREE.CylinderGeometry(scale * 0.5, scale * 0.5, scale * 1.5, 
          Math.floor(8 + complexity * 16));
      
      case 'cone':
        return new THREE.ConeGeometry(scale * 0.7, scale * 1.5, 
          Math.floor(8 + complexity * 16));
      
      case 'torus':
        return new THREE.TorusGeometry(scale * 0.7, scale * 0.3, 
          Math.floor(8 + complexity * 8), Math.floor(16 + complexity * 16));
      
      case 'octahedron':
        return new THREE.OctahedronGeometry(scale, Math.floor(complexity * 3));
      
      case 'dodecahedron':
        return new THREE.DodecahedronGeometry(scale, Math.floor(complexity * 2));
      
      default: // sphere
        return new THREE.SphereGeometry(scale * 0.8, 
          Math.floor(16 + complexity * 16), Math.floor(12 + complexity * 12));
    }
  }
  
  static createMaterial(params: ModelGenerationParams): THREE.Material {
    const { color, style } = params;
    
    switch (style) {
      case 'crystalline':
        return new THREE.MeshPhysicalMaterial({
          color,
          metalness: 0.1,
          roughness: 0.1,
          transmission: 0.9,
          thickness: 0.5,
        });
      
      case 'organic':
        return new THREE.MeshLambertMaterial({
          color,
          flatShading: true,
        });
      
      case 'geometric':
        return new THREE.MeshPhongMaterial({
          color,
          shininess: 100,
          flatShading: true,
        });
      
      case 'futuristic':
        return new THREE.MeshPhysicalMaterial({
          color,
          metalness: 0.8,
          roughness: 0.2,
          emissive: color,
          emissiveIntensity: 0.1,
        });
      
      default: // smooth
        return new THREE.MeshPhongMaterial({
          color,
          shininess: 30,
        });
    }
  }
}
