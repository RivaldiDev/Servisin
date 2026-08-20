import React, { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';
import { DRACOLoader } from 'three/examples/jsm/loaders/DRACOLoader.js';

interface ThreeCarHeroProps {
  isMobile?: boolean;
}

// 1. Procedural Studio HDRI Environment Map Generator
function createStudioEnvironment(renderer: THREE.WebGLRenderer): THREE.WebGLRenderTarget {
  const pmremGenerator = new THREE.PMREMGenerator(renderer);
  pmremGenerator.compileEquirectangularShader();

  const envScene = new THREE.Scene();
  envScene.background = new THREE.Color(0x0a0e17);

  // Overhead Key Softbox
  const softboxGeo = new THREE.PlaneGeometry(18, 10);
  const softboxMat = new THREE.MeshBasicMaterial({ color: 0xffffff, side: THREE.DoubleSide });
  const softbox = new THREE.Mesh(softboxGeo, softboxMat);
  softbox.position.set(0, 8, 0);
  softbox.rotation.x = Math.PI / 2;
  envScene.add(softbox);

  // Left Softbox Fill (Frosted Cyan-Blue Highlight)
  const sideSoftbox1 = new THREE.Mesh(
    new THREE.PlaneGeometry(14, 6),
    new THREE.MeshBasicMaterial({ color: 0x90e0ef, side: THREE.DoubleSide })
  );
  sideSoftbox1.position.set(7, 4, 0);
  sideSoftbox1.rotation.y = -Math.PI / 2;
  envScene.add(sideSoftbox1);

  // Right Softbox (Warm Horizon Glow)
  const sideSoftbox2 = new THREE.Mesh(
    new THREE.PlaneGeometry(14, 6),
    new THREE.MeshBasicMaterial({ color: 0xffedd5, side: THREE.DoubleSide })
  );
  sideSoftbox2.position.set(-7, 4, 0);
  sideSoftbox2.rotation.y = Math.PI / 2;
  envScene.add(sideSoftbox2);

  // Front Light Bar
  const frontStrip = new THREE.Mesh(
    new THREE.PlaneGeometry(16, 2.5),
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

  ctx.fillStyle = '#242830';
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
  texture.repeat.set(16, 16);
  return texture;
}

export const ThreeCarHero: React.FC<ThreeCarHeroProps> = ({ isMobile = false }) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [loading, setLoading] = useState(true);
  const [activeColor, setActiveColor] = useState<'red' | 'blue' | 'black'>('red');

  // References
  const carRootGroupRef = useRef<THREE.Group | null>(null);
  const wheelsRef = useRef<THREE.Object3D[]>([]);
  const bodyMaterialRef = useRef<THREE.MeshPhysicalMaterial | null>(null);

  const isDraggingRef = useRef(false);
  const pointerDownPosRef = useRef({ x: 0, y: 0 });
  const previousMousePositionRef = useRef({ x: 0, y: 0 });
  const targetRotationY = useRef(0.65);
  const targetRotationX = useRef(0.08);

  // Minimalist Color Swatches
  const colorOptions = [
    { id: 'red' as const, name: 'Merah', hex: 0xd90429, swatchBg: 'bg-[#d90429]' },
    { id: 'blue' as const, name: 'Biru', hex: 0x0077b6, swatchBg: 'bg-[#0077b6]' },
    { id: 'black' as const, name: 'Hitam', hex: 0x14161d, swatchBg: 'bg-[#14161d]' },
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
    const rect = container.getBoundingClientRect();
    const initialWidth = rect.width || (isMobile ? 380 : 720);
    const initialHeight = rect.height || (isMobile ? 420 : 540);

    // 1. Scene
    const scene = new THREE.Scene();

    // 2. Camera: Sweet spot FOV 42° & balanced distance for optimal size
    const camera = new THREE.PerspectiveCamera(42, initialWidth / initialHeight, 0.1, 100);
    camera.position.set(0, 1.0, isMobile ? 6.0 : 5.1);
    camera.lookAt(0, 0.32, 0);

    // 3. WebGL Renderer
    const renderer = new THREE.WebGLRenderer({
      antialias: true,
      alpha: true,
      powerPreference: 'high-performance',
    });
    renderer.setSize(initialWidth, initialHeight, false);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.25;
    container.replaceChildren(renderer.domElement);

    // 4. Studio Environment Lighting
    const envRenderTarget = createStudioEnvironment(renderer);
    scene.environment = envRenderTarget.texture;

    // Studio Directional Lights
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.85);
    scene.add(ambientLight);

    const keyLight = new THREE.DirectionalLight(0xffffff, 1.8);
    keyLight.position.set(6, 10, 6);
    keyLight.castShadow = true;
    keyLight.shadow.mapSize.width = 1024;
    keyLight.shadow.mapSize.height = 1024;
    keyLight.shadow.bias = -0.001;
    scene.add(keyLight);

    const rimLight = new THREE.DirectionalLight(0x90e0ef, 1.3);
    rimLight.position.set(-6, 5, -5);
    scene.add(rimLight);

    const frontFill = new THREE.DirectionalLight(0xffffff, 0.9);
    frontFill.position.set(0, 2, 6);
    scene.add(frontFill);

    const underGlow = new THREE.DirectionalLight(0x90e0ef, 0.6);
    underGlow.position.set(0, -3, 0);
    scene.add(underGlow);

    // 5. Materials
    const carbonTexture = createCarbonFiberTexture();

    const bodyMaterial = new THREE.MeshPhysicalMaterial({
      color: 0xd90429,
      metalness: 0.9,
      roughness: 0.12,
      clearcoat: 1.0,
      clearcoatRoughness: 0.03,
      reflectivity: 1.0,
    });
    bodyMaterialRef.current = bodyMaterial;

    const glassMaterial = new THREE.MeshPhysicalMaterial({
      color: 0x0a0f1d,
      metalness: 0.1,
      roughness: 0.01,
      transmission: 0.85,
      thickness: 0.5,
      transparent: true,
      opacity: 0.92,
      ior: 1.52,
    });

    const carbonMaterial = new THREE.MeshStandardMaterial({
      map: carbonTexture,
      roughness: 0.25,
      metalness: 0.8,
    });

    const rimMaterial = new THREE.MeshStandardMaterial({
      color: 0xe2e8f0,
      metalness: 0.98,
      roughness: 0.08,
    });

    const tireMaterial = new THREE.MeshStandardMaterial({
      color: 0x14161a,
      roughness: 0.88,
      metalness: 0.05,
    });

    const brakeMaterial = new THREE.MeshStandardMaterial({
      color: 0xa1a1aa,
      metalness: 0.88,
      roughness: 0.2,
    });

    const caliperMaterial = new THREE.MeshPhysicalMaterial({
      color: 0xef233c,
      metalness: 0.6,
      roughness: 0.15,
      clearcoat: 0.95,
    });

    // 6. 3D Car Root Group (Elevated High in Scene)
    const carRootGroup = new THREE.Group();
    scene.add(carRootGroup);
    carRootGroupRef.current = carRootGroup;
    wheelsRef.current = [];

    const dracoLoader = new DRACOLoader();
    dracoLoader.setDecoderPath('/draco/gltf/');

    const gltfLoader = new GLTFLoader();
    gltfLoader.setDRACOLoader(dracoLoader);

    gltfLoader.load(
      '/models/ferrari.glb',
      (gltf) => {
        const model = gltf.scene;

        model.traverse((child) => {
          if (child instanceof THREE.Mesh) {
            child.castShadow = true;
            child.receiveShadow = true;

            const name = (child.name || '').toLowerCase();
            if (name.includes('body')) {
              child.material = bodyMaterial;
            } else if (name.includes('glass')) {
              child.material = glassMaterial;
            } else if (name.includes('carbon')) {
              child.material = carbonMaterial;
            } else if (name.includes('rim') || name.includes('centre') || name.includes('nuts')) {
              child.material = rimMaterial;
            } else if (name.includes('tire')) {
              child.material = tireMaterial;
            } else if (name.includes('brake') || name.includes('caliper')) {
              child.material = name.includes('caliper') ? caliperMaterial : brakeMaterial;
            }
          }

          const nodeName = (child.name || '').toLowerCase();
          if (nodeName.startsWith('wheel_')) {
            wheelsRef.current.push(child);
          }
        });

        // Center model geometry & RAISE IT HIGH (+0.42 in Y)
        const box = new THREE.Box3().setFromObject(model);
        const center = box.getCenter(new THREE.Vector3());

        model.position.x = -center.x;
        model.position.y = -center.y + 0.42; // Floating high and proud
        model.position.z = -center.z;

        // SWEET SPOT 0.68x SCALE: Bold, prominent, high visual impact & 100% ZERO-CLIPPING
        model.scale.set(0.68, 0.68, 0.68);

        carRootGroup.add(model);
        setLoading(false);
      },
      undefined,
      (err) => {
        console.error('Error loading supercar GLTF model:', err);
        setLoading(false);
      }
    );

    // 7. Interactive Mouse & Touch Drag Controls
    const handlePointerDown = (clientX: number, clientY: number) => {
      isDraggingRef.current = true;
      pointerDownPosRef.current = { x: clientX, y: clientY };
      previousMousePositionRef.current = { x: clientX, y: clientY };
    };

    const handlePointerMove = (clientX: number, clientY: number) => {
      if (!isDraggingRef.current) return;
      const deltaX = clientX - previousMousePositionRef.current.x;
      const deltaY = clientY - previousMousePositionRef.current.y;

      targetRotationY.current += deltaX * 0.01;
      targetRotationX.current = Math.max(-0.1, Math.min(0.35, targetRotationX.current + deltaY * 0.007));

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

    // 8. Gentle Floating Hover & Ultra-Slow Auto-Rotation Loop
    let animationFrameId: number;
    const clock = new THREE.Clock();

    const animate = () => {
      animationFrameId = requestAnimationFrame(animate);
      const elapsedTime = clock.getElapsedTime();

      // Ultra-slow showroom drift (0.0008)
      if (!isDraggingRef.current) {
        targetRotationY.current += 0.0008;
      }

      if (carRootGroup) {
        carRootGroup.rotation.y += (targetRotationY.current - carRootGroup.rotation.y) * 0.05;
        carRootGroup.rotation.x += (targetRotationX.current - carRootGroup.rotation.x) * 0.05;

        // Elegant Zero-Gravity Floating Wave
        carRootGroup.position.y = Math.sin(elapsedTime * 1.5) * 0.05 + 0.10;
        carRootGroup.rotation.z = Math.sin(elapsedTime * 1.2) * 0.01;
      }

      wheelsRef.current.forEach((wheel) => {
        wheel.rotation.x += 0.008;
      });

      camera.lookAt(0, 0.32, 0);
      renderer.render(scene, camera);
    };

    animate();

    // 9. Dynamic ResizeObserver
    const resizeObserver = new ResizeObserver((entries) => {
      for (const entry of entries) {
        const { width, height } = entry.contentRect;
        if (width > 0 && height > 0) {
          camera.aspect = width / height;
          camera.updateProjectionMatrix();
          renderer.setSize(width, height, false);
          renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
        }
      }
    });

    resizeObserver.observe(container);

    // Cleanup
    return () => {
      cancelAnimationFrame(animationFrameId);
      resizeObserver.disconnect();
      domElem.removeEventListener('mousedown', onMouseDown);
      window.removeEventListener('mousemove', onMouseMove);
      window.removeEventListener('mouseup', onMouseUp);
      domElem.removeEventListener('touchstart', onTouchStart);
      window.removeEventListener('touchmove', onTouchMove);
      window.removeEventListener('touchend', onTouchEnd);

      dracoLoader.dispose();
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
    <div className="relative w-full flex flex-col items-center select-none isolate">
      {/* 3D WebGL Canvas Stage - Generous Viewport */}
      <div
        ref={containerRef}
        className="w-full h-[420px] sm:h-[500px] lg:h-[560px] flex items-center justify-center cursor-grab active:cursor-grabbing overflow-hidden"
      />

      {/* Loading Skeleton */}
      {loading && (
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
          <div className="flex items-center gap-2 bg-[#03045e]/90 text-[#caf0f8] px-4 py-2 rounded-2xl text-xs font-bold border border-[#90e0ef]/30 backdrop-blur-md shadow-xl">
            <div className="w-3.5 h-3.5 border-2 border-[#00b4d8] border-t-transparent rounded-full animate-spin" />
            <span>Memuat 3D Supercar...</span>
          </div>
        </div>
      )}

      {/* Minimalist Color-Only Swatch Buttons */}
      <div className="mt-2 flex items-center gap-3 z-10 bg-[#03045e]/80 p-2 rounded-full border border-[#90e0ef]/30 backdrop-blur-md shadow-lg">
        {colorOptions.map((opt) => (
          <button
            key={opt.id}
            onClick={() => handleColorChange(opt.id)}
            title={opt.name}
            aria-label={opt.name}
            className={`w-6 h-6 rounded-full ${opt.swatchBg} transition-all duration-150 cursor-pointer border-2 ${
              activeColor === opt.id
                ? 'border-white scale-125 shadow-md ring-2 ring-[#00b4d8]'
                : 'border-white/30 hover:scale-110 opacity-75 hover:opacity-100'
            }`}
          />
        ))}
      </div>
    </div>
  );
};
