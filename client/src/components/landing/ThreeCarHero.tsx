import React, { useEffect, useRef } from 'react';
import * as THREE from 'three';

interface ThreeCarHeroProps {
  isMobile?: boolean;
}

// 1. Procedural Texture Generators for Ultra-Realistic Materials
function createCarbonFiberTexture(): THREE.CanvasTexture {
  const canvas = document.createElement('canvas');
  canvas.width = 128;
  canvas.height = 128;
  const ctx = canvas.getContext('2d')!;

  ctx.fillStyle = '#15171c';
  ctx.fillRect(0, 0, 128, 128);

  // Twill Weave Pattern
  ctx.fillStyle = '#262930';
  for (let i = 0; i < 128; i += 8) {
    for (let j = 0; j < 128; j += 8) {
      if ((i / 8 + j / 8) % 2 === 0) {
        ctx.fillRect(i, j, 8, 8);
      }
    }
  }

  // Cross Weave Highlights
  ctx.fillStyle = '#3a3e47';
  for (let i = 0; i < 128; i += 16) {
    for (let j = 0; j < 128; j += 16) {
      ctx.fillRect(i + 2, j + 2, 4, 4);
    }
  }

  const texture = new THREE.CanvasTexture(canvas);
  texture.wrapS = THREE.RepeatWrapping;
  texture.wrapT = THREE.RepeatWrapping;
  texture.repeat.set(4, 4);
  return texture;
}

function createTireTreadTexture(): THREE.CanvasTexture {
  const canvas = document.createElement('canvas');
  canvas.width = 512;
  canvas.height = 128;
  const ctx = canvas.getContext('2d')!;

  ctx.fillStyle = '#111317';
  ctx.fillRect(0, 0, 512, 128);

  // Directional V-Groove Tread Blocks
  ctx.strokeStyle = '#050608';
  ctx.lineWidth = 4;
  for (let x = 0; x < 512; x += 16) {
    // Left V channel
    ctx.beginPath();
    ctx.moveTo(x, 10);
    ctx.lineTo(x + 12, 64);
    ctx.lineTo(x, 118);
    ctx.stroke();

    // Secondary micro sipes
    ctx.strokeStyle = '#1e2129';
    ctx.lineWidth = 1.5;
    ctx.beginPath();
    ctx.moveTo(x + 6, 20);
    ctx.lineTo(x + 14, 50);
    ctx.stroke();
    ctx.strokeStyle = '#050608';
    ctx.lineWidth = 4;
  }

  const texture = new THREE.CanvasTexture(canvas);
  texture.wrapS = THREE.RepeatWrapping;
  texture.wrapT = THREE.RepeatWrapping;
  texture.repeat.set(6, 1);
  return texture;
}

function createBrakeRotorTexture(): THREE.CanvasTexture {
  const canvas = document.createElement('canvas');
  canvas.width = 256;
  canvas.height = 256;
  const ctx = canvas.getContext('2d')!;

  ctx.fillStyle = '#94a3b8';
  ctx.fillRect(0, 0, 256, 256);

  // Concentric machining grooves
  ctx.strokeStyle = '#cbd5e1';
  ctx.lineWidth = 1;
  for (let r = 20; r < 120; r += 4) {
    ctx.beginPath();
    ctx.arc(128, 128, r, 0, Math.PI * 2);
    ctx.stroke();
  }

  // Cross-drilled cooling ventilation holes
  ctx.fillStyle = '#1e293b';
  for (let i = 0; i < 24; i++) {
    const angle = (i * Math.PI * 2) / 24;
    for (let d = 40; d < 110; d += 22) {
      const hx = 128 + Math.cos(angle + d * 0.01) * d;
      const hy = 128 + Math.sin(angle + d * 0.01) * d;
      ctx.beginPath();
      ctx.arc(hx, hy, 2.5, 0, Math.PI * 2);
      ctx.fill();
    }
  }

  const texture = new THREE.CanvasTexture(canvas);
  return texture;
}

export const ThreeCarHero: React.FC<ThreeCarHeroProps> = ({ isMobile = false }) => {
  const containerRef = useRef<HTMLDivElement>(null);

  // References for animation and interaction
  const carGroupRef = useRef<THREE.Group | null>(null);
  const rotatingWheelsRef = useRef<THREE.Group[]>([]);
  const materialsRef = useRef<THREE.Material[]>([]);
  const isDraggingRef = useRef(false);
  const previousMousePositionRef = useRef({ x: 0, y: 0 });
  const targetRotationY = useRef(0.55);
  const targetRotationX = useRef(0.12);

  useEffect(() => {
    if (!containerRef.current) return;
    const container = containerRef.current;
    const width = container.clientWidth || (isMobile ? 320 : 560);
    const height = isMobile ? 320 : 440;

    // 1. Scene
    const scene = new THREE.Scene();

    // 2. Camera
    const camera = new THREE.PerspectiveCamera(38, width / height, 0.1, 100);
    camera.position.set(0, 1.7, 6.2);

    // 3. Renderer with transparent background
    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    container.replaceChildren(renderer.domElement);

    // 4. Studio Lighting Rig
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.9);
    scene.add(ambientLight);

    // Key Light (Sharp White Studio Flood)
    const keyLight = new THREE.DirectionalLight(0xffffff, 1.5);
    keyLight.position.set(6, 9, 6);
    keyLight.castShadow = true;
    scene.add(keyLight);

    // Rim Contour Light (Cool Highlight)
    const rimLight = new THREE.DirectionalLight(0x90e0ef, 1.2);
    rimLight.position.set(-6, 5, -5);
    scene.add(rimLight);

    // Front Supercar Under-Glow Fill
    const frontLight = new THREE.DirectionalLight(0xffffff, 0.9);
    frontLight.position.set(2, 2, 5);
    scene.add(frontLight);

    // 5. Materials with Procedural Textures
    const carbonTexture = createCarbonFiberTexture();
    const tireTexture = createTireTreadTexture();
    const brakeTexture = createBrakeRotorTexture();

    // Iconic Lamborghini Rosso Mars Red Body Paint (High gloss clearcoat)
    const lamboRedPaintMat = new THREE.MeshStandardMaterial({
      color: 0xd90429, // Vibrant Iconic Supercar Red
      metalness: 0.85,
      roughness: 0.14,
    });

    // Dark Carbon Fiber Aero Trim
    const carbonAeroMat = new THREE.MeshStandardMaterial({
      map: carbonTexture,
      color: 0x22242a,
      metalness: 0.8,
      roughness: 0.25,
    });

    // Tinted Cockpit Glass
    const cockpitGlassMat = new THREE.MeshStandardMaterial({
      color: 0x0a0d14,
      metalness: 0.95,
      roughness: 0.05,
      transparent: true,
      opacity: 0.85,
    });

    // Textured Supercar Tire
    const tireTreadMat = new THREE.MeshStandardMaterial({
      map: tireTexture,
      color: 0x181a1f,
      roughness: 0.85,
      metalness: 0.1,
    });

    // Matte Gunmetal/Silver Rims
    const supercarRimMat = new THREE.MeshStandardMaterial({
      color: 0xe2e8f0,
      metalness: 0.9,
      roughness: 0.15,
    });

    // Textured Cross-Drilled Brake Rotor
    const brakeDiscMat = new THREE.MeshStandardMaterial({
      map: brakeTexture,
      metalness: 0.9,
      roughness: 0.2,
    });

    // Red Brembo Brake Caliper
    const redBrakeCaliperMat = new THREE.MeshStandardMaterial({
      color: 0xef233c,
      metalness: 0.7,
      roughness: 0.2,
    });

    // Lamborghini Y-Shaped LED Headlights & Taillights
    const yHeadlightMat = new THREE.MeshBasicMaterial({
      color: 0xffffff,
    });
    const yTaillightMat = new THREE.MeshBasicMaterial({
      color: 0xff002b,
    });
    const exhaustMat = new THREE.MeshStandardMaterial({
      color: 0x64748b,
      metalness: 0.95,
      roughness: 0.1,
    });

    materialsRef.current.push(
      lamboRedPaintMat,
      carbonAeroMat,
      cockpitGlassMat,
      tireTreadMat,
      supercarRimMat,
      brakeDiscMat,
      redBrakeCaliperMat,
      yHeadlightMat,
      yTaillightMat,
      exhaustMat
    );

    // --- 6. BUILD ICONIC LAMBORGHINI SUPERCAR WEDGE GEOMETRY ---
    const carGroup = new THREE.Group();
    carGroupRef.current = carGroup;
    rotatingWheelsRef.current = [];

    // A. Main Wedge Chassis (Low-slung, sharp tapered stance)
    const lowerHullGeo = new THREE.BoxGeometry(2.9, 0.28, 1.36);
    const lowerHull = new THREE.Mesh(lowerHullGeo, lamboRedPaintMat);
    lowerHull.position.set(0, 0.32, 0);
    lowerHull.castShadow = true;
    lowerHull.receiveShadow = true;
    carGroup.add(lowerHull);

    // B. Sharp Sloping Front Hood with Dual Angular Vents
    const frontHoodGeo = new THREE.BoxGeometry(1.0, 0.18, 1.28);
    const frontHood = new THREE.Mesh(frontHoodGeo, lamboRedPaintMat);
    frontHood.position.set(1.42, 0.32, 0);
    frontHood.rotation.z = -0.16; // Aggressive down-slope
    frontHood.castShadow = true;
    carGroup.add(frontHood);

    // Front Splitter / Carbon Fiber Bumper
    const frontSplitterGeo = new THREE.BoxGeometry(0.35, 0.05, 1.38);
    const frontSplitter = new THREE.Mesh(frontSplitterGeo, carbonAeroMat);
    frontSplitter.position.set(1.88, 0.16, 0);
    carGroup.add(frontSplitter);

    // Front Dual Hexagonal Air Intakes
    const intakeGeo = new THREE.BoxGeometry(0.08, 0.14, 0.5);
    const leftIntake = new THREE.Mesh(intakeGeo, carbonAeroMat);
    leftIntake.position.set(1.92, 0.24, 0.38);
    leftIntake.rotation.y = 0.15;
    carGroup.add(leftIntake);

    const rightIntake = new THREE.Mesh(intakeGeo, carbonAeroMat);
    rightIntake.position.set(1.92, 0.24, -0.38);
    rightIntake.rotation.y = -0.15;
    carGroup.add(rightIntake);

    // C. Low-Profile Aerodynamic Cockpit Greenhouse (Windshield & Roof)
    const cockpitGeo = new THREE.BoxGeometry(1.45, 0.36, 1.04);
    const cockpit = new THREE.Mesh(cockpitGeo, cockpitGlassMat);
    cockpit.position.set(-0.12, 0.62, 0);
    cockpit.castShadow = true;
    carGroup.add(cockpit);

    // Roof Center Spine (Red)
    const roofSpineGeo = new THREE.BoxGeometry(1.25, 0.03, 0.94);
    const roofSpine = new THREE.Mesh(roofSpineGeo, lamboRedPaintMat);
    roofSpine.position.set(-0.12, 0.81, 0);
    carGroup.add(roofSpine);

    // D. Rear V12 Engine Bay Cover with Stepped Louvers / Slats
    const engineCoverGeo = new THREE.BoxGeometry(0.85, 0.12, 1.08);
    const engineCover = new THREE.Mesh(engineCoverGeo, carbonAeroMat);
    engineCover.position.set(-0.95, 0.54, 0);
    engineCover.rotation.z = 0.12;
    carGroup.add(engineCover);

    // Engine Slats / Vents
    for (let i = 0; i < 4; i++) {
      const slatGeo = new THREE.BoxGeometry(0.04, 0.02, 0.9);
      const slat = new THREE.Mesh(slatGeo, lamboRedPaintMat);
      slat.position.set(-0.65 - i * 0.18, 0.58 - i * 0.03, 0);
      carGroup.add(slat);
    }

    // E. Aggressive Rear Carbon Fiber Aerodynamic Diffuser & Wing
    const rearDiffuserGeo = new THREE.BoxGeometry(0.45, 0.14, 1.36);
    const rearDiffuser = new THREE.Mesh(rearDiffuserGeo, carbonAeroMat);
    rearDiffuser.position.set(-1.62, 0.24, 0);
    rearDiffuser.rotation.z = -0.1;
    carGroup.add(rearDiffuser);

    // Carbon Fiber GT Wing / Rear Spoiler
    const wingBladeGeo = new THREE.BoxGeometry(0.24, 0.03, 1.48);
    const wingBlade = new THREE.Mesh(wingBladeGeo, carbonAeroMat);
    wingBlade.position.set(-1.68, 0.68, 0);
    carGroup.add(wingBlade);

    // Wing Struts (Supports)
    const wingStrutGeo = new THREE.BoxGeometry(0.04, 0.22, 0.03);
    const leftStrut = new THREE.Mesh(wingStrutGeo, carbonAeroMat);
    leftStrut.position.set(-1.62, 0.54, 0.42);
    carGroup.add(leftStrut);

    const rightStrut = new THREE.Mesh(wingStrutGeo, carbonAeroMat);
    rightStrut.position.set(-1.62, 0.54, -0.42);
    carGroup.add(rightStrut);

    // Quad Central Exhausts (Supercar Performance)
    for (let i = -1.5; i <= 1.5; i += 1.0) {
      const exhaustGeo = new THREE.CylinderGeometry(0.045, 0.045, 0.12, 16);
      exhaustGeo.rotateZ(Math.PI / 2);
      const exhaust = new THREE.Mesh(exhaustGeo, exhaustMat);
      exhaust.position.set(-1.76, 0.32, i * 0.1);
      carGroup.add(exhaust);
    }

    // F. Side NACA Ducts & Aero Skirts
    const sideSkirtGeo = new THREE.BoxGeometry(1.6, 0.06, 0.08);
    const leftSkirt = new THREE.Mesh(sideSkirtGeo, carbonAeroMat);
    leftSkirt.position.set(0, 0.16, 0.69);
    carGroup.add(leftSkirt);

    const rightSkirt = new THREE.Mesh(sideSkirtGeo, carbonAeroMat);
    rightSkirt.position.set(0, 0.16, -0.69);
    carGroup.add(rightSkirt);

    // Side Air Intakes (Feeding V12)
    const sideIntakeGeo = new THREE.BoxGeometry(0.35, 0.18, 0.1);
    const leftSideIntake = new THREE.Mesh(sideIntakeGeo, carbonAeroMat);
    leftSideIntake.position.set(-0.6, 0.42, 0.65);
    carGroup.add(leftSideIntake);

    const rightSideIntake = new THREE.Mesh(sideIntakeGeo, carbonAeroMat);
    rightSideIntake.position.set(-0.6, 0.42, -0.65);
    carGroup.add(rightSideIntake);

    // Carbon Fiber Aero Mirrors
    const mirrorGeo = new THREE.BoxGeometry(0.14, 0.06, 0.16);
    const leftMirror = new THREE.Mesh(mirrorGeo, carbonAeroMat);
    leftMirror.position.set(0.42, 0.58, 0.62);
    carGroup.add(leftMirror);

    const rightMirror = new THREE.Mesh(mirrorGeo, carbonAeroMat);
    rightMirror.position.set(0.42, 0.58, -0.62);
    carGroup.add(rightMirror);

    // G. Iconic Y-Shaped LED Headlights
    const headlightGeo = new THREE.BoxGeometry(0.08, 0.06, 0.28);
    const leftHeadlight = new THREE.Mesh(headlightGeo, yHeadlightMat);
    leftHeadlight.position.set(1.88, 0.38, 0.44);
    leftHeadlight.rotation.y = 0.2;
    carGroup.add(leftHeadlight);

    const rightHeadlight = new THREE.Mesh(headlightGeo, yHeadlightMat);
    rightHeadlight.position.set(1.88, 0.38, -0.44);
    rightHeadlight.rotation.y = -0.2;
    carGroup.add(rightHeadlight);

    // Rear Y-Shaped Taillight Bar
    const taillightGeo = new THREE.BoxGeometry(0.06, 0.05, 1.24);
    const rearTaillight = new THREE.Mesh(taillightGeo, yTaillightMat);
    rearTaillight.position.set(-1.72, 0.44, 0);
    carGroup.add(rearTaillight);

    // --- 7. HIGH-PERFORMANCE SUPERCAR WHEELS WITH TEXTURED BRAKES & TIRES ---
    const wheelPositions = [
      { x: 1.08, y: 0.29, z: 0.66, isLeft: true },
      { x: 1.08, y: 0.29, z: -0.66, isLeft: false },
      { x: -1.06, y: 0.29, z: 0.68, isLeft: true }, // Staggered wider rear track
      { x: -1.06, y: 0.29, z: -0.68, isLeft: false },
    ];

    const tireGeo = new THREE.CylinderGeometry(0.29, 0.29, 0.24, 32);
    tireGeo.rotateX(Math.PI / 2);

    const rimLipGeo = new THREE.TorusGeometry(0.2, 0.018, 16, 32);
    const rimCenterGeo = new THREE.CylinderGeometry(0.07, 0.07, 0.26, 16);
    rimCenterGeo.rotateX(Math.PI / 2);

    const rotorGeo = new THREE.CylinderGeometry(0.18, 0.18, 0.025, 24);
    rotorGeo.rotateX(Math.PI / 2);

    const caliperGeo = new THREE.BoxGeometry(0.07, 0.11, 0.08);

    wheelPositions.forEach((pos) => {
      const wheelAssembly = new THREE.Group();
      wheelAssembly.position.set(pos.x, pos.y, pos.z);

      // 1. ROTATING WHEEL HUB
      const rotatingHub = new THREE.Group();

      // Tread-Patterned High-Performance Tire
      const tireMesh = new THREE.Mesh(tireGeo, tireTreadMat);
      tireMesh.castShadow = true;
      rotatingHub.add(tireMesh);

      // Outer Polished Rim Lip
      const rimLip = new THREE.Mesh(rimLipGeo, supercarRimMat);
      rimLip.position.z = pos.isLeft ? 0.11 : -0.11;
      rotatingHub.add(rimLip);

      // Center Hub Cap
      const hubCap = new THREE.Mesh(rimCenterGeo, supercarRimMat);
      rotatingHub.add(hubCap);

      // Lamborghini Y-Spoke Sport Rims (5 Double-Spokes)
      for (let i = 0; i < 5; i++) {
        const angle = (i * Math.PI * 2) / 5;
        const spokeGeo = new THREE.BoxGeometry(0.16, 0.024, 0.02);
        const spoke = new THREE.Mesh(spokeGeo, supercarRimMat);
        spoke.position.set(Math.cos(angle) * 0.1, Math.sin(angle) * 0.1, pos.isLeft ? 0.1 : -0.1);
        spoke.rotation.z = angle;
        rotatingHub.add(spoke);
      }

      wheelAssembly.add(rotatingHub);

      // 2. STATIC BRAKE SYSTEM WITH CROSS-DRILLED ROTOR & RED BREMBO CALIPER
      const brakeRotor = new THREE.Mesh(rotorGeo, brakeDiscMat);
      brakeRotor.position.z = pos.isLeft ? -0.04 : 0.04;
      wheelAssembly.add(brakeRotor);

      const caliper = new THREE.Mesh(caliperGeo, redBrakeCaliperMat);
      caliper.position.set(-0.06, 0.09, pos.isLeft ? -0.04 : 0.04);
      caliper.rotation.z = 0.35;
      wheelAssembly.add(caliper);

      carGroup.add(wheelAssembly);
      rotatingWheelsRef.current.push(rotatingHub);
    });

    // 8. Ground Contact Shadow
    const groundGeo = new THREE.PlaneGeometry(8, 8);
    const groundMat = new THREE.ShadowMaterial({ opacity: 0.22 });
    const ground = new THREE.Mesh(groundGeo, groundMat);
    ground.rotation.x = -Math.PI / 2;
    ground.position.y = 0;
    ground.receiveShadow = true;
    scene.add(ground);

    // Subtle Ground Glow Ring
    const ringGeo = new THREE.RingGeometry(1.8, 1.86, 64);
    const ringMat = new THREE.MeshBasicMaterial({
      color: 0xd90429,
      side: THREE.DoubleSide,
      transparent: true,
      opacity: 0.35,
    });
    materialsRef.current.push(ringMat);
    const groundRing = new THREE.Mesh(ringGeo, ringMat);
    groundRing.rotation.x = -Math.PI / 2;
    groundRing.position.y = 0.01;
    scene.add(groundRing);

    // Add Car to Scene
    scene.add(carGroup);
    carGroup.position.set(0, 0, 0);

    // 9. Interactive Mouse & Touch Drag Controls
    const handleMouseDown = (e: MouseEvent) => {
      isDraggingRef.current = true;
      previousMousePositionRef.current = { x: e.clientX, y: e.clientY };
    };

    const handleMouseMove = (e: MouseEvent) => {
      if (!isDraggingRef.current) return;
      const deltaX = e.clientX - previousMousePositionRef.current.x;
      const deltaY = e.clientY - previousMousePositionRef.current.y;

      targetRotationY.current += deltaX * 0.012;
      targetRotationX.current = Math.max(-0.12, Math.min(0.45, targetRotationX.current + deltaY * 0.008));

      previousMousePositionRef.current = { x: e.clientX, y: e.clientY };
    };

    const handleMouseUp = () => {
      isDraggingRef.current = false;
    };

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

      targetRotationY.current += deltaX * 0.014;
      targetRotationX.current = Math.max(-0.12, Math.min(0.45, targetRotationX.current + deltaY * 0.01));

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

    // 10. Polished Supercar Animation Loop
    let animationFrameId: number;
    const clock = new THREE.Clock();

    const animate = () => {
      animationFrameId = requestAnimationFrame(animate);
      const elapsedTime = clock.getElapsedTime();

      // Smooth Auto-Drift
      if (!isDraggingRef.current) {
        targetRotationY.current += 0.007;
      }

      carGroup.rotation.y += (targetRotationY.current - carGroup.rotation.y) * 0.06;
      carGroup.rotation.x += (targetRotationX.current - carGroup.rotation.x) * 0.06;

      // Supercar Suspended Hover Dynamic
      carGroup.position.y = Math.sin(elapsedTime * 2.5) * 0.025 + 0.02;

      // Rotate ground ring
      groundRing.rotation.z -= 0.01;

      // Wheels Roll Forward along Z-axis
      rotatingWheelsRef.current.forEach((wheelHub) => {
        wheelHub.rotation.z -= 0.06;
      });

      renderer.render(scene, camera);
    };

    animate();

    // 11. Responsive Resize
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
      domElem.removeEventListener('mousedown', handleMouseDown);
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseup', handleMouseUp);
      domElem.removeEventListener('touchstart', handleTouchStart);
      window.removeEventListener('touchmove', handleTouchMove);
      window.removeEventListener('touchend', handleTouchEnd);

      carbonTexture.dispose();
      tireTexture.dispose();
      brakeTexture.dispose();
      materialsRef.current.forEach((m) => m.dispose());
      scene.clear();
      renderer.dispose();
    };
  }, [isMobile]);

  return (
    <div className="relative w-full flex items-center justify-center select-none overflow-visible">
      {/* 3D WebGL Canvas Viewport for Red Lamborghini */}
      <div
        ref={containerRef}
        className="w-full h-[320px] sm:h-[440px] flex items-center justify-center cursor-grab active:cursor-grabbing"
      />
    </div>
  );
};
