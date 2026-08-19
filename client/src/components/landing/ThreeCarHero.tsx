import React, { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';
import { Eye, RefreshDouble, ShieldCheck, DashboardSpeed } from 'iconoir-react';

interface ThreeCarHeroProps {
  isMobile?: boolean;
}

export const ThreeCarHero: React.FC<ThreeCarHeroProps> = ({ isMobile = false }) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [wireframeMode, setWireframeMode] = useState(false);
  const [activeView, setActiveView] = useState<'3D' | 'X-RAY'>('3D');
  const [rpm] = useState(2400);

  // References to communicate with Three.js render loop
  const carGroupRef = useRef<THREE.Group | null>(null);
  const wheelsRef = useRef<THREE.Mesh[]>([]);
  const materialsRef = useRef<THREE.Material[]>([]);
  const isDraggingRef = useRef(false);
  const previousMousePositionRef = useRef({ x: 0, y: 0 });
  const targetRotationY = useRef(0.4);
  const targetRotationX = useRef(0.15);

  useEffect(() => {
    if (!containerRef.current) return;
    const container = containerRef.current;
    const width = container.clientWidth || (isMobile ? 320 : 480);
    const height = isMobile ? 300 : 400;

    // 1. Scene
    const scene = new THREE.Scene();

    // 2. Camera
    const camera = new THREE.PerspectiveCamera(45, width / height, 0.1, 100);
    camera.position.set(0, 2.2, 5.5);

    // 3. Renderer
    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    container.replaceChildren(renderer.domElement);

    // 4. Lighting (Strict Palette)
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.9);
    scene.add(ambientLight);

    const dirLight1 = new THREE.DirectionalLight(0x90e0ef, 1.2);
    dirLight1.position.set(5, 8, 5);
    dirLight1.castShadow = true;
    scene.add(dirLight1);

    const dirLight2 = new THREE.DirectionalLight(0x0077b6, 0.8);
    dirLight2.position.set(-5, 4, -3);
    scene.add(dirLight2);

    const bottomLight = new THREE.DirectionalLight(0x00b4d8, 0.4);
    bottomLight.position.set(0, -3, 2);
    scene.add(bottomLight);

    // 5. Build Procedural 3D Car Model (Strict Palette: #03045e, #0077b6, #00b4d8, #90e0ef, #caf0f8)
    const carGroup = new THREE.Group();
    carGroupRef.current = carGroup;
    wheelsRef.current = [];
    materialsRef.current = [];

    // Colors
    const COLOR_TWILIGHT = 0x03045e;
    const COLOR_TEAL = 0x0077b6;
    const COLOR_TURQUOISE = 0x00b4d8;
    const COLOR_CYAN = 0xcaf0f8;

    // Materials
    const bodyMat = new THREE.MeshStandardMaterial({
      color: COLOR_TEAL,
      metalness: 0.7,
      roughness: 0.25,
    });
    const cabinMat = new THREE.MeshStandardMaterial({
      color: COLOR_TWILIGHT,
      metalness: 0.9,
      roughness: 0.1,
      transparent: true,
      opacity: 0.88,
    });
    const trimMat = new THREE.MeshStandardMaterial({
      color: COLOR_TURQUOISE,
      metalness: 0.8,
      roughness: 0.2,
    });
    const wheelMat = new THREE.MeshStandardMaterial({
      color: COLOR_TWILIGHT,
      roughness: 0.7,
    });
    const rimMat = new THREE.MeshStandardMaterial({
      color: COLOR_CYAN,
      metalness: 0.85,
      roughness: 0.15,
    });
    const lightMat = new THREE.MeshBasicMaterial({
      color: COLOR_CYAN,
    });
    const tailLightMat = new THREE.MeshBasicMaterial({
      color: COLOR_TURQUOISE,
    });

    materialsRef.current.push(bodyMat, cabinMat, trimMat, wheelMat, rimMat, lightMat, tailLightMat);

    // Main Chassis Lower Body
    const lowerBodyGeo = new THREE.BoxGeometry(2.6, 0.45, 1.2);
    const lowerBody = new THREE.Mesh(lowerBodyGeo, bodyMat);
    lowerBody.position.y = 0.45;
    lowerBody.castShadow = true;
    lowerBody.receiveShadow = true;
    carGroup.add(lowerBody);

    // Front Bumper Nose Aero
    const noseGeo = new THREE.BoxGeometry(0.7, 0.35, 1.16);
    const nose = new THREE.Mesh(noseGeo, bodyMat);
    nose.position.set(1.4, 0.4, 0);
    nose.rotation.z = -0.1;
    nose.castShadow = true;
    carGroup.add(nose);

    // Upper Cabin (Glass & Roof)
    const cabinGeo = new THREE.BoxGeometry(1.45, 0.48, 1.05);
    const cabin = new THREE.Mesh(cabinGeo, cabinMat);
    cabin.position.set(-0.15, 0.82, 0);
    cabin.castShadow = true;
    carGroup.add(cabin);

    // Roof Top Shell
    const roofGeo = new THREE.BoxGeometry(1.3, 0.05, 1.0);
    const roof = new THREE.Mesh(roofGeo, bodyMat);
    roof.position.set(-0.15, 1.08, 0);
    carGroup.add(roof);

    // Aero Side Skirts / Accents (Turquoise Surf)
    const skirtGeo = new THREE.BoxGeometry(2.4, 0.06, 1.25);
    const skirt = new THREE.Mesh(skirtGeo, trimMat);
    skirt.position.set(0.1, 0.25, 0);
    carGroup.add(skirt);

    // Front Headlights
    const lightGeo = new THREE.BoxGeometry(0.08, 0.12, 0.28);
    const leftLight = new THREE.Mesh(lightGeo, lightMat);
    leftLight.position.set(1.72, 0.46, 0.4);
    carGroup.add(leftLight);

    const rightLight = new THREE.Mesh(lightGeo, lightMat);
    rightLight.position.set(1.72, 0.46, -0.4);
    carGroup.add(rightLight);

    // Rear Taillights
    const tailLightGeo = new THREE.BoxGeometry(0.08, 0.1, 0.32);
    const leftTail = new THREE.Mesh(tailLightGeo, tailLightMat);
    leftTail.position.set(-1.31, 0.52, 0.4);
    carGroup.add(leftTail);

    const rightTail = new THREE.Mesh(tailLightGeo, tailLightMat);
    rightTail.position.set(-1.31, 0.52, -0.4);
    carGroup.add(rightTail);

    // 4 Wheels
    const wheelPositions = [
      { x: 0.95, y: 0.28, z: 0.65 },
      { x: 0.95, y: 0.28, z: -0.65 },
      { x: -0.85, y: 0.28, z: 0.65 },
      { x: -0.85, y: 0.28, z: -0.65 },
    ];

    const wheelGeo = new THREE.CylinderGeometry(0.28, 0.28, 0.18, 24);
    const rimGeo = new THREE.CylinderGeometry(0.18, 0.18, 0.19, 16);

    wheelPositions.forEach((pos) => {
      const wheelHub = new THREE.Group();
      wheelHub.position.set(pos.x, pos.y, pos.z);

      const tire = new THREE.Mesh(wheelGeo, wheelMat);
      tire.rotation.x = Math.PI / 2;
      tire.castShadow = true;
      wheelHub.add(tire);

      const rim = new THREE.Mesh(rimGeo, rimMat);
      rim.rotation.x = Math.PI / 2;
      wheelHub.add(rim);

      carGroup.add(wheelHub);
      wheelsRef.current.push(tire);
    });

    // Circular Holographic Scanner Ring under the car
    const ringGeo = new THREE.RingGeometry(1.6, 1.66, 48);
    const ringMat = new THREE.MeshBasicMaterial({
      color: COLOR_TURQUOISE,
      side: THREE.DoubleSide,
      transparent: true,
      opacity: 0.5,
    });
    materialsRef.current.push(ringMat);
    const scannerRing = new THREE.Mesh(ringGeo, ringMat);
    scannerRing.rotation.x = -Math.PI / 2;
    scannerRing.position.y = 0.02;
    scene.add(scannerRing);

    // Ground Shadow Plane
    const groundGeo = new THREE.PlaneGeometry(8, 8);
    const groundMat = new THREE.ShadowMaterial({ opacity: 0.18 });
    const ground = new THREE.Mesh(groundGeo, groundMat);
    ground.rotation.x = -Math.PI / 2;
    ground.position.y = 0;
    ground.receiveShadow = true;
    scene.add(ground);

    // Add Car to Scene
    scene.add(carGroup);
    carGroup.position.set(0, 0, 0);

    // 6. Interactive Mouse Drag Controls
    const handleMouseDown = (e: MouseEvent) => {
      isDraggingRef.current = true;
      previousMousePositionRef.current = { x: e.clientX, y: e.clientY };
    };

    const handleMouseMove = (e: MouseEvent) => {
      if (!isDraggingRef.current) return;
      const deltaX = e.clientX - previousMousePositionRef.current.x;
      const deltaY = e.clientY - previousMousePositionRef.current.y;

      targetRotationY.current += deltaX * 0.012;
      targetRotationX.current = Math.max(-0.2, Math.min(0.6, targetRotationX.current + deltaY * 0.008));

      previousMousePositionRef.current = { x: e.clientX, y: e.clientY };
    };

    const handleMouseUp = () => {
      isDraggingRef.current = false;
    };

    // Touch Support for Mobile
    const handleTouchStart = (e: TouchEvent) => {
      if (e.touches.length === 1) {
        isDraggingRef.current = true;
        previousMousePositionRef.current = { x: e.touches[0].clientX, y: e.touches[0].clientY };
      }
    };

    const handleTouchMove = (e: TouchEvent) => {
      if (!isDraggingRef.current || e.touches.length !== 1) return;
      const deltaX = e.touches[0].clientX - previousMousePositionRef.current.x;
      const deltaY = e.touches[0].clientY - previousMousePositionRef.current.y;

      targetRotationY.current += deltaX * 0.015;
      targetRotationX.current = Math.max(-0.2, Math.min(0.6, targetRotationX.current + deltaY * 0.01));

      previousMousePositionRef.current = { x: e.touches[0].clientX, y: e.touches[0].clientY };
    };

    const handleTouchEnd = () => {
      isDraggingRef.current = false;
    };

    const domElem = renderer.domElement;
    domElem.addEventListener('mousedown', handleMouseDown);
    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('mouseup', handleMouseUp);

    domElem.addEventListener('touchstart', handleTouchStart, { passive: true });
    window.addEventListener('touchmove', handleTouchMove, { passive: true });
    window.addEventListener('touchend', handleTouchEnd);

    // 7. Animation Loop
    let animationFrameId: number;
    const clock = new THREE.Clock();

    const animate = () => {
      animationFrameId = requestAnimationFrame(animate);
      const elapsedTime = clock.getElapsedTime();

      // Smooth Rotation LERP
      if (!isDraggingRef.current) {
        targetRotationY.current += 0.008; // Idle auto spin
      }

      carGroup.rotation.y += (targetRotationY.current - carGroup.rotation.y) * 0.08;
      carGroup.rotation.x += (targetRotationX.current - carGroup.rotation.x) * 0.08;

      // Subtle suspension bounce
      carGroup.position.y = Math.sin(elapsedTime * 3) * 0.03 + 0.02;

      // Rotate Scanner Ring
      scannerRing.rotation.z -= 0.015;

      // Wheel rotation
      wheelsRef.current.forEach((w) => {
        w.rotation.x += 0.06;
      });

      renderer.render(scene, camera);
    };

    animate();

    // 8. Resize Handler
    const handleResize = () => {
      if (!containerRef.current) return;
      const newWidth = containerRef.current.clientWidth;
      const newHeight = isMobile ? 300 : 400;
      camera.aspect = newWidth / newHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(newWidth, newHeight);
    };

    window.addEventListener('resize', handleResize);

    // Cleanup
    return () => {
      cancelAnimationFrame(animationFrameId);
      window.removeEventListener('resize', handleResize);
      domElem.removeEventListener('mousedown', handleMouseDown);
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseup', handleMouseUp);
      domElem.removeEventListener('touchstart', handleTouchStart);
      window.removeEventListener('touchmove', handleTouchMove);
      window.removeEventListener('touchend', handleTouchEnd);

      materialsRef.current.forEach((m) => m.dispose());
      scene.clear();
      renderer.dispose();
    };
  }, [isMobile]);

  // Toggle Wireframe Diagnostic View
  const toggleWireframe = () => {
    const next = !wireframeMode;
    setWireframeMode(next);
    setActiveView(next ? 'X-RAY' : '3D');
    materialsRef.current.forEach((mat) => {
      if (mat instanceof THREE.MeshStandardMaterial || mat instanceof THREE.MeshBasicMaterial) {
        mat.wireframe = next;
      }
    });
  };

  const handleResetAngle = () => {
    targetRotationY.current = 0.4;
    targetRotationX.current = 0.15;
  };

  return (
    <div className="relative w-full rounded-3xl bg-white border border-[#90e0ef] shadow-[0_1px_3px_rgba(3,4,94,0.06),0_16px_36px_-8px_rgba(3,4,94,0.12)] p-4 sm:p-5 flex flex-col justify-between overflow-hidden group select-none">
      {/* Top Bar: Vehicle Telemetry Status */}
      <div className="flex items-center justify-between pb-3 border-b border-[#90e0ef]/40 z-10">
        <div className="flex items-center gap-2.5">
          <div className="w-9 h-9 rounded-xl bg-[#caf0f8] text-[#0077b6] flex items-center justify-center font-bold">
            <DashboardSpeed className="w-5 h-5" />
          </div>
          <div>
            <h3 className="font-extrabold text-xs sm:text-sm text-[#03045e] tracking-tight">
              FixGarasi 3D Studio Live
            </h3>
            <p className="text-[10px] text-[#0077b6] font-mono">Realtime Telemetry &bull; Drag to Rotate</p>
          </div>
        </div>

        {/* Status Pill */}
        <div className="flex items-center gap-1.5 bg-[#caf0f8] text-[#0077b6] border border-[#00b4d8] text-[10px] font-extrabold px-2.5 py-1 rounded-full">
          <ShieldCheck className="w-3.5 h-3.5" />
          <span>Sistem Prima</span>
        </div>
      </div>

      {/* 3D WebGL Canvas Viewport */}
      <div
        ref={containerRef}
        className="w-full h-[260px] sm:h-[320px] flex items-center justify-center cursor-grab active:cursor-grabbing relative"
      />

      {/* Floating Interactive Controls & HUD Badges */}
      <div className="pt-3 border-t border-[#90e0ef]/40 flex flex-wrap items-center justify-between gap-2 z-10">
        {/* View Mode Switcher */}
        <div className="flex items-center gap-1 bg-[#caf0f8]/40 p-1 rounded-xl border border-[#90e0ef]/60">
          <button
            onClick={() => { if (wireframeMode) toggleWireframe(); }}
            className={`px-3 py-1 text-[10px] font-extrabold rounded-lg transition-colors duration-150 cursor-pointer ${
              activeView === '3D' ? 'bg-[#0077b6] text-white' : 'text-[#03045e] hover:bg-[#caf0f8]'
            }`}
          >
            3D Studio
          </button>
          <button
            onClick={() => { if (!wireframeMode) toggleWireframe(); }}
            className={`px-3 py-1 text-[10px] font-extrabold rounded-lg transition-colors duration-150 cursor-pointer flex items-center gap-1 ${
              activeView === 'X-RAY' ? 'bg-[#0077b6] text-white' : 'text-[#03045e] hover:bg-[#caf0f8]'
            }`}
          >
            <Eye className="w-3 h-3" />
            <span>X-Ray Wireframe</span>
          </button>
        </div>

        {/* Telemetry Quick Chips */}
        <div className="flex items-center gap-2 text-[10px] font-mono">
          <span className="bg-[#caf0f8] text-[#03045e] px-2 py-1 rounded-lg border border-[#90e0ef]">
            RPM: <strong className="text-[#0077b6] tabular-nums">{rpm}</strong>
          </span>
          <button
            onClick={handleResetAngle}
            className="p-1.5 rounded-lg bg-white border border-[#90e0ef] hover:border-[#0077b6] text-[#03045e] active:scale-95 transition-transform cursor-pointer"
            title="Reset Sudut Pandang"
          >
            <RefreshDouble className="w-3.5 h-3.5 text-[#0077b6]" />
          </button>
        </div>
      </div>
    </div>
  );
};
