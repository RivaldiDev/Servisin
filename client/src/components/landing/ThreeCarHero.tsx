import React, { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';

interface ThreeCarHeroProps {
  isMobile?: boolean;
}

// 1. Procedural Studio HDRI Environment Map Generator
function createStudioEnvironment(renderer: THREE.WebGLRenderer): THREE.WebGLRenderTarget {
  const pmremGenerator = new THREE.PMREMGenerator(renderer);
  pmremGenerator.compileEquirectangularShader();

  const envScene = new THREE.Scene();
  envScene.background = new THREE.Color(0x0a0d14);

  // Overhead Key Softbox
  const softboxGeo = new THREE.PlaneGeometry(16, 8);
  const softboxMat = new THREE.MeshBasicMaterial({ color: 0xffffff, side: THREE.DoubleSide });
  const softbox = new THREE.Mesh(softboxGeo, softboxMat);
  softbox.position.set(0, 8, 0);
  softbox.rotation.x = Math.PI / 2;
  envScene.add(softbox);

  // Side Fill Softbox (Frosted Blue)
  const sideSoftbox1 = new THREE.Mesh(
    new THREE.PlaneGeometry(12, 5),
    new THREE.MeshBasicMaterial({ color: 0x90e0ef, side: THREE.DoubleSide })
  );
  sideSoftbox1.position.set(7, 4, 0);
  sideSoftbox1.rotation.y = -Math.PI / 2;
  envScene.add(sideSoftbox1);

  // Rim Horizon Softbox
  const sideSoftbox2 = new THREE.Mesh(
    new THREE.PlaneGeometry(12, 5),
    new THREE.MeshBasicMaterial({ color: 0xffe5d9, side: THREE.DoubleSide })
  );
  sideSoftbox2.position.set(-7, 4, 0);
  sideSoftbox2.rotation.y = Math.PI / 2;
  envScene.add(sideSoftbox2);

  // Front Horizontal Light Bar
  const frontStrip = new THREE.Mesh(
    new THREE.PlaneGeometry(14, 2),
    new THREE.MeshBasicMaterial({ color: 0xffffff, side: THREE.DoubleSide })
  );
  frontStrip.position.set(0, 2, 9);
  frontStrip.rotation.x = Math.PI;
  envScene.add(frontStrip);

  const envRenderTarget = pmremGenerator.fromScene(envScene, 0.04);
  pmremGenerator.dispose();
  return envRenderTarget;
}

// 2. Procedural Carbon Fiber Texture
function createCarbonFiberTexture(): THREE.CanvasTexture {
  const size = 128;
  const canvas = document.createElement('canvas');
  canvas.width = size;
  canvas.height = size;
  const ctx = canvas.getContext('2d')!;

  ctx.fillStyle = '#111317';
  ctx.fillRect(0, 0, size, size);

  ctx.fillStyle = '#22252c';
  for (let i = 0; i < size; i += 8) {
    for (let j = 0; j < size; j += 8) {
      if ((i / 8 + j / 8) % 2 === 0) {
        ctx.fillRect(i, j, 8, 8);
      }
    }
  }

  const texture = new THREE.CanvasTexture(canvas);
  texture.wrapS = THREE.RepeatWrapping;
  texture.wrapT = THREE.RepeatWrapping;
  texture.repeat.set(12, 12);
  return texture;
}

export const ThreeCarHero: React.FC<ThreeCarHeroProps> = ({ isMobile = false }) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [loading, setLoading] = useState(true);
  const [activeColor, setActiveColor] = useState<'red' | 'blue' | 'black'>('red');

  // References for render loop & interaction
  const carModelRef = useRef<THREE.Group | null>(null);
  const wheelsRef = useRef<THREE.Object3D[]>([]);
  const bodyMaterialRef = useRef<THREE.MeshPhysicalMaterial | null>(null);

  const isDraggingRef = useRef(false);
  const pointerDownPosRef = useRef({ x: 0, y: 0 });
  const previousMousePositionRef = useRef({ x: 0, y: 0 });
  const targetRotationY = useRef(0.55);
  const targetRotationX = useRef(0.12);

  // Available Supercar Color Options
  const colorOptions = [
    { id: 'red' as const, name: 'Rosso Mars', hex: 0xd90429, labelBg: 'bg-[#d90429]' },
    { id: 'blue' as const, name: 'Blu Cepheus', hex: 0x0077b6, labelBg: 'bg-[#0077b6]' },
    { id: 'black' as const, name: 'Nero Nemesis', hex: 0x111318, labelBg: 'bg-[#111318]' },
  ];

  const handleColorChange = (colorId: 'red' | 'blue' | 'black') => {
    setActiveColor(colorId);
    const selected = colorOptions.find((c) => c.id === colorId);
    if (selected && bodyMaterialRef.current) {
      bodyMaterialRef.current.color.setHex(selected.hex);
    }
  };

  useEffect(() => {
    if (!containerRef.current) return;
    const container = containerRef.current;
    const width = container.clientWidth || (isMobile ? 320 : 560);
    const height = isMobile ? 320 : 440;

    // 1. Scene
    const scene = new THREE.Scene();

    // 2. Camera (Slightly elevated cinematic 3/4 angle)
    const camera = new THREE.PerspectiveCamera(40, width / height, 0.1, 100);
    camera.position.set(0, 1.4, 5.5);

    // 3. WebGL Renderer with High-End Tonemapping
    const renderer = new THREE.WebGLRenderer({
      antialias: true,
      alpha: true,
      powerPreference: 'high-performance',
    });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.15;
    container.replaceChildren(renderer.domElement);

    // 4. Studio Environment Lighting for Real Clearcoat Reflections
    const envRenderTarget = createStudioEnvironment(renderer);
    scene.environment = envRenderTarget.texture;

    // Studio Lights
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.7);
    scene.add(ambientLight);

    const keyLight = new THREE.DirectionalLight(0xffffff, 1.6);
    keyLight.position.set(6, 10, 6);
    keyLight.castShadow = true;
    keyLight.shadow.mapSize.width = 1024;
    keyLight.shadow.mapSize.height = 1024;
    keyLight.shadow.bias = -0.001;
    scene.add(keyLight);

    const rimLight = new THREE.DirectionalLight(0x90e0ef, 1.2);
    rimLight.position.set(-6, 5, -5);
    scene.add(rimLight);

    // 5. High-End PBR Supercar Materials
    const carbonTexture = createCarbonFiberTexture();

    // Multi-stage clearcoat car paint
    const bodyMaterial = new THREE.MeshPhysicalMaterial({
      color: 0xd90429,
      metalness: 0.88,
      roughness: 0.12,
      clearcoat: 1.0,
      clearcoatRoughness: 0.03,
      reflectivity: 1.0,
    });
    bodyMaterialRef.current = bodyMaterial;

    const glassMaterial = new THREE.MeshPhysicalMaterial({
      color: 0x0a0f1d,
      metalness: 0.1,
      roughness: 0.02,
      transmission: 0.8,
      thickness: 0.4,
      transparent: true,
      opacity: 0.95,
      ior: 1.52,
    });

    const carbonMaterial = new THREE.MeshStandardMaterial({
      map: carbonTexture,
      roughness: 0.25,
      metalness: 0.75,
    });

    const rimMaterial = new THREE.MeshStandardMaterial({
      color: 0xe2e8f0,
      metalness: 0.95,
      roughness: 0.1,
    });

    const tireMaterial = new THREE.MeshStandardMaterial({
      color: 0x16181d,
      roughness: 0.85,
      metalness: 0.05,
    });

    const brakeMaterial = new THREE.MeshStandardMaterial({
      color: 0x94a3b8,
      metalness: 0.85,
      roughness: 0.25,
    });

    const caliperMaterial = new THREE.MeshPhysicalMaterial({
      color: 0xef233c,
      metalness: 0.6,
      roughness: 0.15,
      clearcoat: 0.9,
    });

    // 6. Ground Mirror Shadow & Floor Grid
    const groundGeo = new THREE.PlaneGeometry(9, 9);
    const groundMat = new THREE.ShadowMaterial({ opacity: 0.28 });
    const ground = new THREE.Mesh(groundGeo, groundMat);
    ground.rotation.x = -Math.PI / 2;
    ground.position.y = 0;
    ground.receiveShadow = true;
    scene.add(ground);

    const ringGeo = new THREE.RingGeometry(1.9, 1.96, 64);
    const ringMat = new THREE.MeshBasicMaterial({
      color: 0xd90429,
      side: THREE.DoubleSide,
      transparent: true,
      opacity: 0.35,
    });
    const groundRing = new THREE.Mesh(ringGeo, ringMat);
    groundRing.rotation.x = -Math.PI / 2;
    groundRing.position.y = 0.01;
    scene.add(groundRing);

    // 7. Load Real Photorealistic Supercar GLTF Model
    const carRootGroup = new THREE.Group();
    scene.add(carRootGroup);
    carModelRef.current = carRootGroup;
    wheelsRef.current = [];

    const loader = new GLTFLoader();
    loader.load(
      '/models/ferrari.glb',
      (gltf) => {
        const model = gltf.scene;

        // Traverse and assign photorealistic materials
        model.traverse((child) => {
          if (child instanceof THREE.Mesh) {
            child.castShadow = true;
            child.receiveShadow = true;

            const name = child.name.toLowerCase();
            if (name.includes('body')) {
              child.material = bodyMaterial;
            } else if (name.includes('glass')) {
              child.material = glassMaterial;
            } else if (name.includes('carbon')) {
              child.material = carbonMaterial;
            } else if (name.includes('rim')) {
              child.material = rimMaterial;
            } else if (name.includes('tire')) {
              child.material = tireMaterial;
            } else if (name.includes('brake') || name.includes('caliper')) {
              child.material = name.includes('caliper') ? caliperMaterial : brakeMaterial;
            }
          }

          // Register animated wheel groups
          const nodeName = child.name.toLowerCase();
          if (nodeName.startsWith('wheel_')) {
            wheelsRef.current.push(child);
          }
        });

        // Scale & Position model precisely
        model.scale.set(0.95, 0.95, 0.95);
        model.position.set(0, 0, 0);

        carRootGroup.add(model);
        setLoading(false);
      },
      undefined,
      (err) => {
        console.error('Error loading car model:', err);
        setLoading(false);
      }
    );

    // 8. Interactive Mouse & Touch Drag Controls
    const handlePointerDown = (clientX: number, clientY: number) => {
      isDraggingRef.current = true;
      pointerDownPosRef.current = { x: clientX, y: clientY };
      previousMousePositionRef.current = { x: clientX, y: clientY };
    };

    const handlePointerMove = (clientX: number, clientY: number) => {
      if (!isDraggingRef.current) return;
      const deltaX = clientX - previousMousePositionRef.current.x;
      const deltaY = clientY - previousMousePositionRef.current.y;

      targetRotationY.current += deltaX * 0.011;
      targetRotationX.current = Math.max(-0.08, Math.min(0.42, targetRotationX.current + deltaY * 0.007));

      previousMousePositionRef.current = { x: clientX, y: clientY };
    };

    const handlePointerUp = () => {
      isDraggingRef.current = false;
    };

    const onMouseDown = (e: MouseEvent) => handlePointerDown(e.clientX, e.clientY);
    const onMouseMove = (e: MouseEvent) => handlePointerMove(e.clientX, e.clientY);
    const onMouseUp = () => handlePointerUp();

    const onTouchStart = (e: TouchEvent) => {
      if (e.touches.length === 1) handlePointerDown(e.touches[0].clientX, e.touches[0].clientY);
    };
    const onTouchMove = (e: TouchEvent) => {
      if (e.touches.length === 1) handlePointerMove(e.touches[0].clientX, e.touches[0].clientY);
    };
    const onTouchEnd = () => handlePointerUp();

    const domElem = renderer.domElement;
    domElem.addEventListener('mousedown', onMouseDown);
    window.addEventListener('mousemove', onMouseMove);
    window.addEventListener('mouseup', onMouseUp);

    domElem.addEventListener('touchstart', onTouchStart, { passive: true });
    window.addEventListener('touchmove', onTouchMove, { passive: true });
    window.addEventListener('touchend', onTouchEnd);

    // 9. Showroom Render Loop
    let animationFrameId: number;
    const clock = new THREE.Clock();

    const animate = () => {
      animationFrameId = requestAnimationFrame(animate);
      const elapsedTime = clock.getElapsedTime();

      // Slow, majestic showroom rotation
      if (!isDraggingRef.current) {
        targetRotationY.current += 0.0022;
      }

      if (carRootGroup) {
        carRootGroup.rotation.y += (targetRotationY.current - carRootGroup.rotation.y) * 0.06;
        carRootGroup.rotation.x += (targetRotationX.current - carRootGroup.rotation.x) * 0.06;

        // Subtle floating suspension breath
        carRootGroup.position.y = Math.sin(elapsedTime * 2.0) * 0.015;
      }

      groundRing.rotation.z -= 0.004;

      // Realistic wheel rolling animation
      wheelsRef.current.forEach((wheel) => {
        wheel.rotation.x += 0.02;
      });

      renderer.render(scene, camera);
    };

    animate();

    // 10. Responsive Resize Handler
    const handleResize = () => {
      if (!containerRef.current) return;
      const newWidth = containerRef.current.clientWidth;
      const newHeight = isMobile ? 320 : 440;
      camera.aspect = newWidth / newHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(newWidth, newHeight);
    };

    window.addEventListener('resize', handleResize);

    // Cleanup
    return () => {
      cancelAnimationFrame(animationFrameId);
      window.removeEventListener('resize', handleResize);
      domElem.removeEventListener('mousedown', onMouseDown);
      window.removeEventListener('mousemove', onMouseMove);
      window.removeEventListener('mouseup', onMouseUp);
      domElem.removeEventListener('touchstart', onTouchStart);
      window.removeEventListener('touchmove', onTouchMove);
      window.removeEventListener('touchend', onTouchEnd);

      envRenderTarget.dispose();
      carbonTexture.dispose();
      bodyMaterial.dispose();
      glassMaterial.dispose();
      carbonMaterial.dispose();
      rimMaterial.dispose();
      tireMaterial.dispose();
      brakeMaterial.dispose();
      caliperMaterial.dispose();
      scene.clear();
      renderer.dispose();
    };
  }, [isMobile]);

  return (
    <div className="relative w-full flex flex-col items-center justify-center select-none overflow-visible">
      {/* 3D WebGL Canvas Viewport for Real Supercar Model */}
      <div
        ref={containerRef}
        className="w-full h-[320px] sm:h-[440px] flex items-center justify-center cursor-grab active:cursor-grabbing"
      />

      {/* Loading Skeleton */}
      {loading && (
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
          <div className="flex items-center gap-2 bg-[#03045e]/80 text-[#caf0f8] px-4 py-2 rounded-2xl text-xs font-bold border border-[#90e0ef]/30 backdrop-blur-xs">
            <div className="w-3.5 h-3.5 border-2 border-[#00b4d8] border-t-transparent rounded-full animate-spin" />
            <span>Memuat Model 3D Supercar...</span>
          </div>
        </div>
      )}

      {/* Color Customizer Chips */}
      <div className="absolute bottom-2 flex items-center gap-2 z-10 bg-[#03045e]/80 p-1.5 rounded-2xl border border-[#90e0ef]/30 backdrop-blur-xs shadow-lg">
        {colorOptions.map((opt) => (
          <button
            key={opt.id}
            onClick={() => handleColorChange(opt.id)}
            className={`flex items-center gap-1.5 px-3 py-1 rounded-xl text-[11px] font-extrabold transition-all duration-150 cursor-pointer ${
              activeColor === opt.id
                ? 'bg-white text-[#03045e] shadow-xs scale-105'
                : 'text-[#caf0f8] hover:bg-white/10'
            }`}
          >
            <span className={`w-2.5 h-2.5 rounded-full ${opt.labelBg} border border-white/40`} />
            <span>{opt.name}</span>
          </button>
        ))}
      </div>
    </div>
  );
};
