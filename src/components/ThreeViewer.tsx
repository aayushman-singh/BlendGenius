import { useEffect, useRef } from 'react';
import * as THREE from 'three';
import { Model3D } from '../types/model';

interface ThreeViewerProps {
  model: Model3D | null;
  width?: number;
  height?: number;
}

export const ThreeViewer: React.FC<ThreeViewerProps> = ({ 
  model, 
  width = 400, 
  height = 400 
}) => {
  const mountRef = useRef<HTMLDivElement>(null);
  const sceneRef = useRef<THREE.Scene>();
  const rendererRef = useRef<THREE.WebGLRenderer>();
  const cameraRef = useRef<THREE.PerspectiveCamera>();
  const meshRef = useRef<THREE.Mesh>();
  const frameRef = useRef<number>();

  useEffect(() => {
    if (!mountRef.current) return;

    // Scene setup
    const scene = new THREE.Scene();
    scene.background = new THREE.Color(0x1a1a1a);
    sceneRef.current = scene;

    // Camera setup
    const camera = new THREE.PerspectiveCamera(75, width / height, 0.1, 1000);
    camera.position.set(0, 0, 5);
    cameraRef.current = camera;

    // Renderer setup
    const renderer = new THREE.WebGLRenderer({ antialias: true });
    renderer.setSize(width, height);
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    rendererRef.current = renderer;

    // Lighting
    const ambientLight = new THREE.AmbientLight(0x404040, 0.6);
    scene.add(ambientLight);

    const directionalLight = new THREE.DirectionalLight(0xffffff, 0.8);
    directionalLight.position.set(10, 10, 5);
    directionalLight.castShadow = true;
    scene.add(directionalLight);

    const pointLight = new THREE.PointLight(0x4ecdc4, 0.5);
    pointLight.position.set(-10, -10, -5);
    scene.add(pointLight);

    mountRef.current.appendChild(renderer.domElement);

    // Mouse interaction
    let mouseX = 0;
    let mouseY = 0;
    let targetRotationX = 0;
    let targetRotationY = 0;

    const handleMouseMove = (event: MouseEvent) => {
      const rect = renderer.domElement.getBoundingClientRect();
      mouseX = ((event.clientX - rect.left) / rect.width) * 2 - 1;
      mouseY = -((event.clientY - rect.top) / rect.height) * 2 + 1;
      targetRotationX = mouseY * 0.5;
      targetRotationY = mouseX * 0.5;
    };

    renderer.domElement.addEventListener('mousemove', handleMouseMove);

    // Animation loop
    const animate = () => {
      frameRef.current = requestAnimationFrame(animate);

      if (meshRef.current) {
        meshRef.current.rotation.x += (targetRotationX - meshRef.current.rotation.x) * 0.05;
        meshRef.current.rotation.y += (targetRotationY - meshRef.current.rotation.y) * 0.05;
        meshRef.current.rotation.z += 0.005;
      }

      renderer.render(scene, camera);
    };

    animate();

    return () => {
      if (frameRef.current) {
        cancelAnimationFrame(frameRef.current);
      }
      renderer.domElement.removeEventListener('mousemove', handleMouseMove);
      if (mountRef.current && renderer.domElement) {
        mountRef.current.removeChild(renderer.domElement);
      }
      renderer.dispose();
    };
  }, [width, height]);

  useEffect(() => {
    if (!model || !sceneRef.current) return;

    // Remove existing mesh
    if (meshRef.current) {
      sceneRef.current.remove(meshRef.current);
    }

    try {
      // Parse geometry and create mesh
      const geometryData = JSON.parse(model.geometry);
      let geometry: THREE.BufferGeometry;

      switch (geometryData.type) {
        case 'BoxGeometry':
          geometry = new THREE.BoxGeometry(...geometryData.parameters);
          break;
        case 'SphereGeometry':
          geometry = new THREE.SphereGeometry(...geometryData.parameters);
          break;
        case 'CylinderGeometry':
          geometry = new THREE.CylinderGeometry(...geometryData.parameters);
          break;
        case 'ConeGeometry':
          geometry = new THREE.ConeGeometry(...geometryData.parameters);
          break;
        case 'TorusGeometry':
          geometry = new THREE.TorusGeometry(...geometryData.parameters);
          break;
        case 'OctahedronGeometry':
          geometry = new THREE.OctahedronGeometry(...geometryData.parameters);
          break;
        case 'DodecahedronGeometry':
          geometry = new THREE.DodecahedronGeometry(...geometryData.parameters);
          break;
        default:
          geometry = new THREE.SphereGeometry(1, 32, 24);
      }

      const material = new THREE.MeshPhongMaterial({ 
        color: model.color,
        shininess: 30 
      });

      const mesh = new THREE.Mesh(geometry, material);
      mesh.castShadow = true;
      mesh.receiveShadow = true;
      meshRef.current = mesh;

      sceneRef.current.add(mesh);
    } catch (error) {
      console.error('Error creating 3D model:', error);
    }
  }, [model]);

  return (
    <div 
      ref={mountRef} 
      className="border border-gray-600 rounded-lg overflow-hidden bg-gray-900"
      style={{ width, height }}
    />
  );
};
