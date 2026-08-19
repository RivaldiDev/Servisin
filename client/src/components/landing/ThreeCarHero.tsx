import React, { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';

interface ThreeCarHeroProps {
  isMobile?: boolean;
}

// 1. Procedural Studio HDRI Environment Map Generator (Creates realistic metallic/clearcoat reflections)
function createStudioEnvironment(renderer: THREE.WebGLRenderer): THREE.WebGLRenderTarget {
  const pmremGenerator = new THREE.PMREMGenerator(renderer);
  pmremGenerator.compileEquirectangularShader();

  const envScene = new THREE.Scene();
  envScene.background = new THREE.Color(0x0a0d14);

  // Overhead Studio Softbox (Key reflection)
  const softboxGeo = new THREE.PlaneGeometry(12, 6);
  const softboxMat = new THREE.MeshBasicMaterial({ color: 0xffffff, side: THREE.DoubleSide });
  const softbox = new THREE.Mesh(softboxGeo, softboxMat);
  softbox.position.set(0, 7, 0);
  softbox.rotation.x = Math.PI / 2;
  envScene.add(softbox);

  // Side Softbox Left (Frosted Blue Rim)
  const sideSoftbox1 = new THREE.Mesh(
    new THREE.PlaneGeometry(10, 4),
    new THREE.MeshBasicMaterial({ color: 0x90e0ef, side: THREE.DoubleSide })
  );
  sideSoftbox1.position.set(6, 4, 0);
  sideSoftbox1.rotation.y = -Math.PI / 2;
  envScene.add(sideSoftbox1);

  // Side Softbox Right (Warm Horizon Fill)
  const sideSoftbox2 = new THREE.Mesh(
    new THREE.PlaneGeometry(10, 4),
    new THREE.MeshBasicMaterial({ color: 0xffe5d9, side: THREE.DoubleSide })
  );
  sideSoftbox2.position.set(-6, 4, 0);
  sideSoftbox2.rotation.y = Math.PI / 2;
  envScene.add(sideSoftbox2);

  // Front Horizon Light Strip
  const frontStrip = new THREE.Mesh(
    new THREE.PlaneGeometry(12, 1.5),
    new THREE.MeshBasicMaterial({ color: 0xffffff, side: THREE.DoubleSide })
  );
  frontStrip.position.set(0, 2, 8);
  frontStrip.rotation.x = Math.PI;
  envScene.add(frontStrip);

  const envRenderTarget = pmremGenerator.fromScene(envScene, 0.04);
  pmremGenerator.dispose();
  return envRenderTarget;
}

// 2. High-Resolution Carbon Fiber Weave Texture & Normal Map
function createCarbonFiberMaps(): { map: THREE.CanvasTexture; normalMap: THREE.CanvasTexture } {
  const size = 256;
  const canvas = document.createElement('canvas');
  canvas.width = size;
  canvas.height = size;
  const ctx = canvas.getContext('2d')!;

  // Diffuse Base
  ctx.fillStyle = '#0f1115';
  ctx.fillRect(0, 0, size, size);

  const normalCanvas = document.createElement('canvas');
  normalCanvas.width = size;
  normalCanvas.height = size;
  const nCtx = normalCanvas.getContext('2d')!;
  nCtx.fillStyle = 'rgb(128,128,255)';
  nCtx.fillRect(0, 0, size, size);

  const step = 8;
  for (let x = 0; x < size; x += step) {
    for (let y = 0; y < size; y += step) {
      const isPattern = ((x / step) + (y / step)) % 2 === 0;

      // Diffuse Color Pattern
      ctx.fillStyle = isPattern ? '#242830' : '#14161a';
      ctx.fillRect(x, y, step, step);

      // Micro Strand Highlights
      ctx.fillStyle = isPattern ? '#3a404c' : '#1a1d24';
      ctx.fillRect(x + 1, y + 1, step - 2, step - 2);

      // Normal Map Perturbation
      nCtx.fillStyle = isPattern ? 'rgb(150,110,255)' : 'rgb(105,145,255)';
      nCtx.fillRect(x, y, step, step);
    }
  }

  const map = new THREE.CanvasTexture(canvas);
  map.wrapS = THREE.RepeatWrapping;
  map.wrapT = THREE.RepeatWrapping;
  map.repeat.set(6, 6);

  const normalMap = new THREE.CanvasTexture(normalCanvas);
  normalMap.wrapS = THREE.RepeatWrapping;
  normalMap.wrapT = THREE.RepeatWrapping;
  normalMap.repeat.set(6, 6);

  return { map, normalMap };
}

// 3. High-Definition Tire Tread & Sidewall Normal Map
function createTireMaps(): { map: THREE.CanvasTexture; normalMap: THREE.CanvasTexture } {
  const width = 512;
  const height = 128;

  const canvas = document.createElement('canvas');
  canvas.width = width;
  canvas.height = height;
  const ctx = canvas.getContext('2d')!;

  const normalCanvas = document.createElement('canvas');
  normalCanvas.width = width;
  normalCanvas.height = height;
  const nCtx = normalCanvas.getContext('2d')!;

  ctx.fillStyle = '#14161a';
  ctx.fillRect(0, 0, width, height);

  nCtx.fillStyle = 'rgb(128,128,255)';
  nCtx.fillRect(0, 0, width, height);

  // Directional High-Performance Tread Channels
  ctx.strokeStyle = '#050608';
  ctx.lineWidth = 5;
  nCtx.strokeStyle = 'rgb(80,80,255)';
  nCtx.lineWidth = 5;

  for (let x = 0; x < width; x += 20) {
    // V-Channel Sipes
    ctx.beginPath();
    ctx.moveTo(x, 8);
    ctx.lineTo(x + 16, 64);
    ctx.lineTo(x, 120);
    ctx.stroke();

    nCtx.beginPath();
    nCtx.moveTo(x, 8);
    nCtx.lineTo(x + 16, 64);
    nCtx.lineTo(x, 120);
    nCtx.stroke();

    // Lateral Drainage Ribs
    ctx.fillStyle = '#20242b';
    ctx.fillRect(x + 4, 25, 4, 35);
    ctx.fillRect(x + 4, 68, 4, 35);
  }

  // Longitudinal Center Grooves
  ctx.fillStyle = '#060709';
  ctx.fillRect(0, 38, width, 6);
  ctx.fillRect(0, 84, width, 6);

  nCtx.fillStyle = 'rgb(60,60,255)';
  nCtx.fillRect(0, 38, width, 6);
  nCtx.fillRect(0, 84, width, 6);

  const map = new THREE.CanvasTexture(canvas);
  map.wrapS = THREE.RepeatWrapping;
  map.wrapT = THREE.RepeatWrapping;
  map.repeat.set(6, 1);

  const normalMap = new THREE.CanvasTexture(normalCanvas);
  normalMap.wrapS = THREE.RepeatWrapping;
  normalMap.wrapT = THREE.RepeatWrapping;
  normalMap.repeat.set(6, 1);

  return { map, normalMap };
}

// 4. Cross-Drilled Carbon-Ceramic Brake Rotor Texture & Normal Map
function createBrakeRotorMaps(): { map: THREE.CanvasTexture; normalMap: THREE.CanvasTexture } {
  const size = 512;
  const canvas = document.createElement('canvas');
  canvas.width = size;
  canvas.height = size;
  const ctx = canvas.getContext('2d')!;

  const normalCanvas = document.createElement('canvas');
  normalCanvas.width = size;
  normalCanvas.height = size;
  const nCtx = normalCanvas.getContext('2d')!;

  ctx.fillStyle = '#a1a1aa';
  ctx.fillRect(0, 0, size, size);

  nCtx.fillStyle = 'rgb(128,128,255)';
  nCtx.fillRect(0, 0, size, size);

  // Concentric CNC Machining Lathe Rings
  for (let r = 50; r < 240; r += 3) {
    ctx.strokeStyle = r % 6 === 0 ? '#71717a' : '#d4d4d8';
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.arc(256, 256, r, 0, Math.PI * 2);
    ctx.stroke();

    nCtx.strokeStyle = 'rgb(140,128,255)';
    nCtx.lineWidth = 1;
    nCtx.beginPath();
    nCtx.arc(256, 256, r, 0, Math.PI * 2);
    nCtx.stroke();
  }

  // Cross-Drilled Curved Ventilation Holes with Chamfered Edges
  for (let i = 0; i < 28; i++) {
    const baseAngle = (i * Math.PI * 2) / 28;
    for (let d = 80; d < 230; d += 35) {
      const angle = baseAngle + d * 0.005; // Curved spiral drill path
      const hx = 256 + Math.cos(angle) * d;
      const hy = 256 + Math.sin(angle) * d;

      // Dark Hole Core
      ctx.fillStyle = '#18181b';
      ctx.beginPath();
      ctx.arc(hx, hy, 4, 0, Math.PI * 2);
      ctx.fill();

      // Chamfer Highlight Ring
      ctx.strokeStyle = '#f4f4f5';
      ctx.lineWidth = 1;
      ctx.stroke();

      nCtx.fillStyle = 'rgb(50,50,255)';
      nCtx.beginPath();
      nCtx.arc(hx, hy, 4, 0, Math.PI * 2);
      nCtx.fill();
    }
  }

  const map = new THREE.CanvasTexture(canvas);
  const normalMap = new THREE.CanvasTexture(normalCanvas);
  return { map, normalMap };
}

export const ThreeCarHero: React.FC<ThreeCarHeroProps> = ({ isMobile = false }) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [hintVisible, setHintVisible] = useState(true);

  // Door & Hood State References
  const leftDoorOpenRef = useRef(false);
  const rightDoorOpenRef = useRef(false);
  const hoodOpenRef = useRef(false);
  const engineCoverOpenRef = useRef(false);

  // Pivot Groups for Smooth Interpolation
  const leftDoorPivotRef = useRef<THREE.Group | null>(null);
  const rightDoorPivotRef = useRef<THREE.Group | null>(null);
  const hoodPivotRef = useRef<THREE.Group | null>(null);
  const engineCoverPivotRef = useRef<THREE.Group | null>(null);

  // References for render loop & interaction
  const carGroupRef = useRef<THREE.Group | null>(null);
  const rotatingWheelsRef = useRef<THREE.Group[]>([]);
  const materialsRef = useRef<THREE.Material[]>([]);
  const texturesRef = useRef<THREE.Texture[]>([]);
  const clickableMeshesRef = useRef<{ mesh: THREE.Object3D; action: () => void }[]>([]);

  const isDraggingRef = useRef(false);
  const pointerDownPosRef = useRef({ x: 0, y: 0 });
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

    // 3. WebGL Renderer with Tone Mapping & Physical Precision
    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true, powerPreference: 'high-performance' });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.1;
    container.replaceChildren(renderer.domElement);

    // 4. Generate Studio HDRI Environment Map for Realistic Clearcoat & Reflections
    const envRenderTarget = createStudioEnvironment(renderer);
    scene.environment = envRenderTarget.texture;

    // 5. Studio Key & Rim Lighting Rig
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.8);
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

    const underGlow = new THREE.DirectionalLight(0xffe5d9, 0.6);
    underGlow.position.set(0, -2, 4);
    scene.add(underGlow);

    // 6. Realistic Procedural Textures & PBR Materials
    const carbonMaps = createCarbonFiberMaps();
    const tireMaps = createTireMaps();
    const brakeMaps = createBrakeRotorMaps();

    texturesRef.current.push(
      carbonMaps.map,
      carbonMaps.normalMap,
      tireMaps.map,
      tireMaps.normalMap,
      brakeMaps.map,
      brakeMaps.normalMap
    );

    // --- REALISTIC PHYSICAL AUTOMOTIVE MATERIALS ---

    // A. Lamborghini Rosso Mars Multi-Stage Car Paint (Clearcoat + Flake Depth)
    const lamboPaintMat = new THREE.MeshPhysicalMaterial({
      color: 0xd90429,
      emissive: 0x200104,
      metalness: 0.85,
      roughness: 0.12,
      clearcoat: 1.0,
      clearcoatRoughness: 0.04,
      reflectivity: 1.0,
    });

    // B. Authentic Twill Weave Carbon Fiber with Normal Map
    const carbonFiberMat = new THREE.MeshStandardMaterial({
      map: carbonMaps.map,
      normalMap: carbonMaps.normalMap,
      normalScale: new THREE.Vector2(0.8, 0.8),
      roughness: 0.28,
      metalness: 0.7,
    });

    // C. Automotive Solar Tinted Safety Glass with Optical Transmission
    const glassMat = new THREE.MeshPhysicalMaterial({
      color: 0x080c14,
      metalness: 0.1,
      roughness: 0.02,
      transmission: 0.75,
      thickness: 0.4,
      transparent: true,
      opacity: 0.92,
      ior: 1.52,
    });

    // D. Alcantara / Leather Cockpit Interior
    const interiorMat = new THREE.MeshStandardMaterial({
      color: 0x16181d,
      roughness: 0.85,
      metalness: 0.1,
    });

    const interiorRedMat = new THREE.MeshStandardMaterial({
      color: 0xc1121f,
      roughness: 0.6,
      metalness: 0.2,
    });

    // E. High-Grip Tread Rubber Tire with Bump Texture
    const tireMat = new THREE.MeshStandardMaterial({
      map: tireMaps.map,
      normalMap: tireMaps.normalMap,
      normalScale: new THREE.Vector2(1.2, 1.2),
      roughness: 0.85,
      metalness: 0.05,
    });

    // F. Forged Diamond-Cut Gunmetal Supercar Alloy Rim
    const rimMat = new THREE.MeshStandardMaterial({
      color: 0x1e293b,
      metalness: 0.92,
      roughness: 0.15,
    });

    const rimPolishedLipMat = new THREE.MeshStandardMaterial({
      color: 0xf1f5f9,
      metalness: 0.98,
      roughness: 0.06,
    });

    // G. Carbon-Ceramic Ventilated Brake Disc with Anisotropic Lathe Grooves
    const brakeDiscMat = new THREE.MeshStandardMaterial({
      map: brakeMaps.map,
      normalMap: brakeMaps.normalMap,
      normalScale: new THREE.Vector2(0.6, 0.6),
      metalness: 0.88,
      roughness: 0.22,
    });

    // H. Gloss Red Brembo 6-Piston Brake Caliper
    const caliperMat = new THREE.MeshPhysicalMaterial({
      color: 0xef233c,
      metalness: 0.6,
      roughness: 0.18,
      clearcoat: 0.9,
    });

    // I. High-Intensity LED Projector & Y-Shaped Laser Lights
    const ledHeadlightMat = new THREE.MeshBasicMaterial({ color: 0xffffff });
    const ledTaillightMat = new THREE.MeshBasicMaterial({ color: 0xff002b });

    // J. Burnt Titanium Quad Exhaust Tips
    const exhaustMat = new THREE.MeshStandardMaterial({
      color: 0x475569,
      metalness: 0.96,
      roughness: 0.12,
    });

    materialsRef.current.push(
      lamboPaintMat,
      carbonFiberMat,
      glassMat,
      interiorMat,
      interiorRedMat,
      tireMat,
      rimMat,
      rimPolishedLipMat,
      brakeDiscMat,
      caliperMat,
      ledHeadlightMat,
      ledTaillightMat,
      exhaustMat
    );

    // --- 7. ASSEMBLE PHOTOREALISTIC LAMBORGHINI SUPERCAR MODEL ---
    const carGroup = new THREE.Group();
    carGroupRef.current = carGroup;
    rotatingWheelsRef.current = [];
    clickableMeshesRef.current = [];

    // A. Main Sculpted Low-Wedge Monocoque Chassis
    const lowerHullGeo = new THREE.BoxGeometry(2.95, 0.28, 1.38);
    const lowerHull = new THREE.Mesh(lowerHullGeo, lamboPaintMat);
    lowerHull.position.set(0, 0.32, 0);
    lowerHull.castShadow = true;
    lowerHull.receiveShadow = true;
    carGroup.add(lowerHull);

    // Cockpit Interior Tub & Ergonomic Sport Bucket Seats
    const cockpitTub = new THREE.Mesh(new THREE.BoxGeometry(1.25, 0.24, 0.98), interiorMat);
    cockpitTub.position.set(-0.05, 0.44, 0);
    carGroup.add(cockpitTub);

    const seatGeo = new THREE.BoxGeometry(0.35, 0.38, 0.32);
    const leftSeat = new THREE.Mesh(seatGeo, interiorRedMat);
    leftSeat.position.set(-0.18, 0.56, 0.22);
    carGroup.add(leftSeat);

    const rightSeat = new THREE.Mesh(seatGeo, interiorRedMat);
    rightSeat.position.set(-0.18, 0.56, -0.22);
    carGroup.add(rightSeat);

    const dash = new THREE.Mesh(new THREE.BoxGeometry(0.28, 0.16, 0.8), interiorMat);
    dash.position.set(0.32, 0.58, 0);
    carGroup.add(dash);

    // B. INTERACTIVE HINGED FRONT HOOD (Kap Mesin Depan)
    const hoodPivot = new THREE.Group();
    hoodPivot.position.set(0.92, 0.42, 0);
    hoodPivotRef.current = hoodPivot;

    const hoodMeshGroup = new THREE.Group();
    const hoodGeo = new THREE.BoxGeometry(0.96, 0.12, 1.28);
    const hoodMesh = new THREE.Mesh(hoodGeo, lamboPaintMat);
    hoodMesh.position.set(0.48, -0.06, 0);
    hoodMesh.rotation.z = -0.15;
    hoodMesh.castShadow = true;
    hoodMeshGroup.add(hoodMesh);

    hoodPivot.add(hoodMeshGroup);
    carGroup.add(hoodPivot);

    clickableMeshesRef.current.push({
      mesh: hoodMesh,
      action: () => {
        hoodOpenRef.current = !hoodOpenRef.current;
        setHintVisible(false);
      },
    });

    // Front Luggage Tub under Hood
    const frontTrunk = new THREE.Mesh(new THREE.BoxGeometry(0.72, 0.2, 0.92), carbonFiberMat);
    frontTrunk.position.set(1.4, 0.3, 0);
    carGroup.add(frontTrunk);

    // Front Splitter / Carbon Fiber Aero Bumper
    const frontSplitter = new THREE.Mesh(new THREE.BoxGeometry(0.36, 0.05, 1.4), carbonFiberMat);
    frontSplitter.position.set(1.9, 0.16, 0);
    carGroup.add(frontSplitter);

    // Front Dual Hexagonal Air Intakes
    const intakeGeo = new THREE.BoxGeometry(0.08, 0.15, 0.52);
    const leftIntake = new THREE.Mesh(intakeGeo, carbonFiberMat);
    leftIntake.position.set(1.94, 0.24, 0.38);
    leftIntake.rotation.y = 0.15;
    carGroup.add(leftIntake);

    const rightIntake = new THREE.Mesh(intakeGeo, carbonFiberMat);
    rightIntake.position.set(1.94, 0.24, -0.38);
    rightIntake.rotation.y = -0.15;
    carGroup.add(rightIntake);

    // C. INTERACTIVE ICONIC SCISSOR DOORS (Pintu Scissor Kiri & Kanan)

    // --- LEFT SCISSOR DOOR ---
    const leftDoorPivot = new THREE.Group();
    leftDoorPivot.position.set(0.45, 0.48, 0.59);
    leftDoorPivotRef.current = leftDoorPivot;

    const leftDoorMeshGroup = new THREE.Group();
    const doorBodyGeo = new THREE.BoxGeometry(0.86, 0.35, 0.1);
    const leftDoorBody = new THREE.Mesh(doorBodyGeo, lamboPaintMat);
    leftDoorBody.position.set(-0.42, 0, 0);
    leftDoorBody.castShadow = true;
    leftDoorMeshGroup.add(leftDoorBody);

    const leftDoorWindow = new THREE.Mesh(new THREE.BoxGeometry(0.74, 0.25, 0.04), glassMat);
    leftDoorWindow.position.set(-0.4, 0.24, 0);
    leftDoorMeshGroup.add(leftDoorWindow);

    const leftMirror = new THREE.Mesh(new THREE.BoxGeometry(0.12, 0.06, 0.14), carbonFiberMat);
    leftMirror.position.set(0.05, 0.16, 0.06);
    leftDoorMeshGroup.add(leftMirror);

    leftDoorPivot.add(leftDoorMeshGroup);
    carGroup.add(leftDoorPivot);

    clickableMeshesRef.current.push({
      mesh: leftDoorBody,
      action: () => {
        leftDoorOpenRef.current = !leftDoorOpenRef.current;
        setHintVisible(false);
      },
    });

    // --- RIGHT SCISSOR DOOR ---
    const rightDoorPivot = new THREE.Group();
    rightDoorPivot.position.set(0.45, 0.48, -0.59);
    rightDoorPivotRef.current = rightDoorPivot;

    const rightDoorMeshGroup = new THREE.Group();
    const rightDoorBody = new THREE.Mesh(doorBodyGeo, lamboPaintMat);
    rightDoorBody.position.set(-0.42, 0, 0);
    rightDoorBody.castShadow = true;
    rightDoorMeshGroup.add(rightDoorBody);

    const rightDoorWindow = new THREE.Mesh(new THREE.BoxGeometry(0.74, 0.25, 0.04), glassMat);
    rightDoorWindow.position.set(-0.4, 0.24, 0);
    rightDoorMeshGroup.add(rightDoorWindow);

    const rightMirror = new THREE.Mesh(new THREE.BoxGeometry(0.12, 0.06, 0.14), carbonFiberMat);
    rightMirror.position.set(0.05, 0.16, -0.06);
    rightDoorMeshGroup.add(rightMirror);

    rightDoorPivot.add(rightDoorMeshGroup);
    carGroup.add(rightDoorPivot);

    clickableMeshesRef.current.push({
      mesh: rightDoorBody,
      action: () => {
        rightDoorOpenRef.current = !rightDoorOpenRef.current;
        setHintVisible(false);
      },
    });

    // Fixed Cockpit Windshield & Roof Spine
    const windshield = new THREE.Mesh(new THREE.BoxGeometry(0.66, 0.32, 1.02), glassMat);
    windshield.position.set(0.32, 0.68, 0);
    windshield.rotation.z = -0.32;
    carGroup.add(windshield);

    const roofSpine = new THREE.Mesh(new THREE.BoxGeometry(0.92, 0.03, 0.88), lamboPaintMat);
    roofSpine.position.set(-0.08, 0.81, 0);
    carGroup.add(roofSpine);

    // D. INTERACTIVE HINGED REAR V12 ENGINE COVER (Carbon Fiber Louvers)
    const engineCoverPivot = new THREE.Group();
    engineCoverPivot.position.set(-0.45, 0.72, 0);
    engineCoverPivotRef.current = engineCoverPivot;

    const engineCoverGroup = new THREE.Group();
    const engineCover = new THREE.Mesh(new THREE.BoxGeometry(0.92, 0.08, 1.06), carbonFiberMat);
    engineCover.position.set(-0.45, -0.04, 0);
    engineCover.castShadow = true;
    engineCoverGroup.add(engineCover);

    // Stepped Engine Louvers
    for (let i = 0; i < 4; i++) {
      const slat = new THREE.Mesh(new THREE.BoxGeometry(0.04, 0.02, 0.9), lamboPaintMat);
      slat.position.set(-0.15 - i * 0.18, 0.02 - i * 0.02, 0);
      engineCoverGroup.add(slat);
    }

    engineCoverPivot.add(engineCoverGroup);
    carGroup.add(engineCoverPivot);

    clickableMeshesRef.current.push({
      mesh: engineCover,
      action: () => {
        engineCoverOpenRef.current = !engineCoverOpenRef.current;
        setHintVisible(false);
      },
    });

    // V12 Engine Block with Gold Anodized Intake Manifolds
    const engineBlock = new THREE.Mesh(new THREE.BoxGeometry(0.68, 0.22, 0.62), carbonFiberMat);
    engineBlock.position.set(-0.9, 0.44, 0);
    carGroup.add(engineBlock);

    const goldPlenumMat = new THREE.MeshPhysicalMaterial({ color: 0xeca72c, metalness: 0.95, roughness: 0.15 });
    const plenumGeo = new THREE.CylinderGeometry(0.06, 0.06, 0.58, 16);
    plenumGeo.rotateZ(Math.PI / 2);

    const leftPlenum = new THREE.Mesh(plenumGeo, goldPlenumMat);
    leftPlenum.position.set(-0.9, 0.55, 0.16);
    carGroup.add(leftPlenum);

    const rightPlenum = new THREE.Mesh(plenumGeo, goldPlenumMat);
    rightPlenum.position.set(-0.9, 0.55, -0.16);
    carGroup.add(rightPlenum);

    // E. Aggressive Rear Carbon Fiber Aerodynamic Diffuser & GT Wing
    const rearDiffuser = new THREE.Mesh(new THREE.BoxGeometry(0.48, 0.15, 1.38), carbonFiberMat);
    rearDiffuser.position.set(-1.64, 0.24, 0);
    rearDiffuser.rotation.z = -0.1;
    carGroup.add(rearDiffuser);

    const wingBlade = new THREE.Mesh(new THREE.BoxGeometry(0.25, 0.035, 1.5), carbonFiberMat);
    wingBlade.position.set(-1.7, 0.68, 0);
    carGroup.add(wingBlade);

    const wingStrutGeo = new THREE.BoxGeometry(0.04, 0.22, 0.03);
    const leftStrut = new THREE.Mesh(wingStrutGeo, carbonFiberMat);
    leftStrut.position.set(-1.64, 0.54, 0.44);
    carGroup.add(leftStrut);

    const rightStrut = new THREE.Mesh(wingStrutGeo, carbonFiberMat);
    rightStrut.position.set(-1.64, 0.54, -0.44);
    carGroup.add(rightStrut);

    // Quad Exhausts
    for (let i = -1.5; i <= 1.5; i += 1.0) {
      const exhaustGeo = new THREE.CylinderGeometry(0.045, 0.045, 0.14, 16);
      exhaustGeo.rotateZ(Math.PI / 2);
      const exhaust = new THREE.Mesh(exhaustGeo, exhaustMat);
      exhaust.position.set(-1.78, 0.32, i * 0.1);
      carGroup.add(exhaust);
    }

    // F. Side NACA Ducts & Aero Skirts
    const sideSkirtGeo = new THREE.BoxGeometry(1.65, 0.06, 0.08);
    const leftSkirt = new THREE.Mesh(sideSkirtGeo, carbonFiberMat);
    leftSkirt.position.set(0, 0.16, 0.7);
    carGroup.add(leftSkirt);

    const rightSkirt = new THREE.Mesh(sideSkirtGeo, carbonFiberMat);
    rightSkirt.position.set(0, 0.16, -0.7);
    carGroup.add(rightSkirt);

    // G. Lamborghini Y-Shaped LED Headlights & Laser Taillight
    const headlightGeo = new THREE.BoxGeometry(0.08, 0.06, 0.28);
    const leftHeadlight = new THREE.Mesh(headlightGeo, ledHeadlightMat);
    leftHeadlight.position.set(1.9, 0.38, 0.44);
    leftHeadlight.rotation.y = 0.2;
    carGroup.add(leftHeadlight);

    const rightHeadlight = new THREE.Mesh(headlightGeo, ledHeadlightMat);
    rightHeadlight.position.set(1.9, 0.38, -0.44);
    rightHeadlight.rotation.y = -0.2;
    carGroup.add(rightHeadlight);

    const taillightGeo = new THREE.BoxGeometry(0.06, 0.05, 1.26);
    const rearTaillight = new THREE.Mesh(taillightGeo, ledTaillightMat);
    rearTaillight.position.set(-1.74, 0.44, 0);
    carGroup.add(rearTaillight);

    // --- 8. HIGH-PRECISION SUPERCAR WHEEL & TIRE ASSEMBLIES ---
    const wheelPositions = [
      { x: 1.08, y: 0.29, z: 0.66, isLeft: true },
      { x: 1.08, y: 0.29, z: -0.66, isLeft: false },
      { x: -1.06, y: 0.29, z: 0.68, isLeft: true },
      { x: -1.06, y: 0.29, z: -0.68, isLeft: false },
    ];

    const tireGeo = new THREE.CylinderGeometry(0.29, 0.29, 0.24, 36);
    tireGeo.rotateX(Math.PI / 2);

    const rimLipGeo = new THREE.TorusGeometry(0.2, 0.018, 16, 32);
    const rimCenterGeo = new THREE.CylinderGeometry(0.07, 0.07, 0.26, 16);
    rimCenterGeo.rotateX(Math.PI / 2);

    const rotorGeo = new THREE.CylinderGeometry(0.18, 0.18, 0.025, 28);
    rotorGeo.rotateX(Math.PI / 2);

    const caliperGeo = new THREE.BoxGeometry(0.07, 0.11, 0.08);

    wheelPositions.forEach((pos) => {
      const wheelAssembly = new THREE.Group();
      wheelAssembly.position.set(pos.x, pos.y, pos.z);

      const rotatingHub = new THREE.Group();

      // Textured Rubber Tire
      const tireMesh = new THREE.Mesh(tireGeo, tireMat);
      tireMesh.castShadow = true;
      rotatingHub.add(tireMesh);

      // Polished Outer Lip
      const rimLip = new THREE.Mesh(rimLipGeo, rimPolishedLipMat);
      rimLip.position.z = pos.isLeft ? 0.11 : -0.11;
      rotatingHub.add(rimLip);

      // Gunmetal Inner Hub Cap
      const hubCap = new THREE.Mesh(rimCenterGeo, rimMat);
      rotatingHub.add(hubCap);

      // 5-Double-Spoke Sport Rims
      for (let i = 0; i < 5; i++) {
        const angle = (i * Math.PI * 2) / 5;
        const spokeGeo = new THREE.BoxGeometry(0.16, 0.024, 0.02);
        const spoke = new THREE.Mesh(spokeGeo, rimMat);
        spoke.position.set(Math.cos(angle) * 0.1, Math.sin(angle) * 0.1, pos.isLeft ? 0.1 : -0.1);
        spoke.rotation.z = angle;
        rotatingHub.add(spoke);
      }

      wheelAssembly.add(rotatingHub);

      // Static Cross-Drilled Brake Rotor & Red Brembo Caliper
      const brakeRotor = new THREE.Mesh(rotorGeo, brakeDiscMat);
      brakeRotor.position.z = pos.isLeft ? -0.04 : 0.04;
      wheelAssembly.add(brakeRotor);

      const caliper = new THREE.Mesh(caliperGeo, caliperMat);
      caliper.position.set(-0.06, 0.09, pos.isLeft ? -0.04 : 0.04);
      caliper.rotation.z = 0.35;
      wheelAssembly.add(caliper);

      carGroup.add(wheelAssembly);
      rotatingWheelsRef.current.push(rotatingHub);
    });

    // 9. Ground Contact Shadow & Studio Glow Ring
    const groundGeo = new THREE.PlaneGeometry(8, 8);
    const groundMat = new THREE.ShadowMaterial({ opacity: 0.28 });
    const ground = new THREE.Mesh(groundGeo, groundMat);
    ground.rotation.x = -Math.PI / 2;
    ground.position.y = 0;
    ground.receiveShadow = true;
    scene.add(ground);

    const ringGeo = new THREE.RingGeometry(1.8, 1.86, 64);
    const ringMat = new THREE.MeshBasicMaterial({
      color: 0xd90429,
      side: THREE.DoubleSide,
      transparent: true,
      opacity: 0.3,
    });
    materialsRef.current.push(ringMat);
    const groundRing = new THREE.Mesh(ringGeo, ringMat);
    groundRing.rotation.x = -Math.PI / 2;
    groundRing.position.y = 0.01;
    scene.add(groundRing);

    scene.add(carGroup);
    carGroup.position.set(0, 0, 0);

    // --- 10. RAYCASTING & INTERACTION ---
    const raycaster = new THREE.Raycaster();
    const mouseVector = new THREE.Vector2();

    const handlePointerDown = (clientX: number, clientY: number) => {
      isDraggingRef.current = true;
      pointerDownPosRef.current = { x: clientX, y: clientY };
      previousMousePositionRef.current = { x: clientX, y: clientY };
    };

    const handlePointerMove = (clientX: number, clientY: number) => {
      if (!isDraggingRef.current) return;
      const deltaX = clientX - previousMousePositionRef.current.x;
      const deltaY = clientY - previousMousePositionRef.current.y;

      targetRotationY.current += deltaX * 0.012;
      targetRotationX.current = Math.max(-0.12, Math.min(0.45, targetRotationX.current + deltaY * 0.008));

      previousMousePositionRef.current = { x: clientX, y: clientY };
    };

    const handlePointerUp = (clientX: number, clientY: number) => {
      isDraggingRef.current = false;
      const dist = Math.hypot(clientX - pointerDownPosRef.current.x, clientY - pointerDownPosRef.current.y);

      if (dist < 6 && containerRef.current) {
        const rect = containerRef.current.getBoundingClientRect();
        mouseVector.x = ((clientX - rect.left) / rect.width) * 2 - 1;
        mouseVector.y = -((clientY - rect.top) / rect.height) * 2 + 1;

        raycaster.setFromCamera(mouseVector, camera);
        const clickableTargets = clickableMeshesRef.current.map((item) => item.mesh);
        const intersects = raycaster.intersectObjects(clickableTargets, true);

        if (intersects.length > 0) {
          const hit = intersects[0];
          const matched = clickableMeshesRef.current.find(
            (item) => item.mesh === hit.object || item.mesh.children.includes(hit.object)
          );
          if (matched) {
            matched.action();
          }
        }
      }
    };

    const onMouseDown = (e: MouseEvent) => handlePointerDown(e.clientX, e.clientY);
    const onMouseMove = (e: MouseEvent) => handlePointerMove(e.clientX, e.clientY);
    const onMouseUp = (e: MouseEvent) => handlePointerUp(e.clientX, e.clientY);

    const onTouchStart = (e: TouchEvent) => {
      if (e.touches.length === 1) handlePointerDown(e.touches[0].clientX, e.touches[0].clientY);
    };
    const onTouchMove = (e: TouchEvent) => {
      if (e.touches.length === 1) handlePointerMove(e.touches[0].clientX, e.touches[0].clientY);
    };
    const onTouchEnd = (e: TouchEvent) => {
      if (e.changedTouches.length === 1) handlePointerUp(e.changedTouches[0].clientX, e.changedTouches[0].clientY);
    };

    const domElem = renderer.domElement;
    domElem.addEventListener('mousedown', onMouseDown);
    window.addEventListener('mousemove', onMouseMove);
    window.addEventListener('mouseup', onMouseUp);

    domElem.addEventListener('touchstart', onTouchStart, { passive: true });
    window.addEventListener('touchmove', onTouchMove, { passive: true });
    window.addEventListener('touchend', onTouchEnd);

    // --- 11. POLISHED RENDER LOOP ---
    let animationFrameId: number;
    const clock = new THREE.Clock();

    const animate = () => {
      animationFrameId = requestAnimationFrame(animate);
      const elapsedTime = clock.getElapsedTime();

      // Slow showroom auto-rotation
      if (!isDraggingRef.current) {
        targetRotationY.current += 0.0022;
      }

      carGroup.rotation.y += (targetRotationY.current - carGroup.rotation.y) * 0.06;
      carGroup.rotation.x += (targetRotationX.current - carGroup.rotation.x) * 0.06;

      // Subtle suspension breath
      carGroup.position.y = Math.sin(elapsedTime * 2.0) * 0.02 + 0.02;

      groundRing.rotation.z -= 0.004;

      rotatingWheelsRef.current.forEach((wheelHub) => {
        wheelHub.rotation.z -= 0.02;
      });

      // Hinge Interpolation
      if (leftDoorPivotRef.current) {
        const targetZ = leftDoorOpenRef.current ? 0.88 : 0.0;
        const targetX = leftDoorOpenRef.current ? -0.14 : 0.0;
        leftDoorPivotRef.current.rotation.z += (targetZ - leftDoorPivotRef.current.rotation.z) * 0.08;
        leftDoorPivotRef.current.rotation.x += (targetX - leftDoorPivotRef.current.rotation.x) * 0.08;
      }

      if (rightDoorPivotRef.current) {
        const targetZ = rightDoorOpenRef.current ? 0.88 : 0.0;
        const targetX = rightDoorOpenRef.current ? 0.14 : 0.0;
        rightDoorPivotRef.current.rotation.z += (targetZ - rightDoorPivotRef.current.rotation.z) * 0.08;
        rightDoorPivotRef.current.rotation.x += (targetX - rightDoorPivotRef.current.rotation.x) * 0.08;
      }

      if (hoodPivotRef.current) {
        const targetZ = hoodOpenRef.current ? -0.62 : 0.0;
        hoodPivotRef.current.rotation.z += (targetZ - hoodPivotRef.current.rotation.z) * 0.08;
      }

      if (engineCoverPivotRef.current) {
        const targetZ = engineCoverOpenRef.current ? 0.54 : 0.0;
        engineCoverPivotRef.current.rotation.z += (targetZ - engineCoverPivotRef.current.rotation.z) * 0.08;
      }

      renderer.render(scene, camera);
    };

    animate();

    // 12. Responsive Resize
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
      texturesRef.current.forEach((t) => t.dispose());
      materialsRef.current.forEach((m) => m.dispose());
      scene.clear();
      renderer.dispose();
    };
  }, [isMobile]);

  // Quick Action Buttons
  const toggleAllDoors = () => {
    const next = !leftDoorOpenRef.current;
    leftDoorOpenRef.current = next;
    rightDoorOpenRef.current = next;
    setHintVisible(false);
  };

  const toggleHoods = () => {
    const next = !hoodOpenRef.current;
    hoodOpenRef.current = next;
    engineCoverOpenRef.current = next;
    setHintVisible(false);
  };

  return (
    <div className="relative w-full flex flex-col items-center justify-center select-none overflow-visible">
      {/* 3D WebGL Canvas Viewport for Photorealistic Red Lamborghini */}
      <div
        ref={containerRef}
        className="w-full h-[320px] sm:h-[440px] flex items-center justify-center cursor-grab active:cursor-grabbing"
      />

      {/* Interactive Floating Micro-Buttons */}
      <div className="absolute bottom-2 flex items-center gap-2 z-10">
        <button
          onClick={toggleAllDoors}
          className="px-3 py-1.5 bg-[#03045e]/90 hover:bg-[#0077b6] text-white text-[11px] font-bold rounded-xl border border-[#90e0ef]/40 shadow-md backdrop-blur-xs transition-colors duration-150 cursor-pointer active:scale-95"
        >
          🚪 Pintu Scissor
        </button>
        <button
          onClick={toggleHoods}
          className="px-3 py-1.5 bg-[#03045e]/90 hover:bg-[#0077b6] text-white text-[11px] font-bold rounded-xl border border-[#90e0ef]/40 shadow-md backdrop-blur-xs transition-colors duration-150 cursor-pointer active:scale-95"
        >
          ⚡ Kap &amp; Mesin V12
        </button>
      </div>

      {/* First-Time User Interaction Hint */}
      {hintVisible && (
        <div className="absolute top-2 bg-[#03045e]/80 text-[#caf0f8] px-3 py-1 rounded-full text-[10px] font-mono border border-[#90e0ef]/30 pointer-events-none animate-pulse">
          💡 Klik bodi / pintu / kap untuk buka-tutup
        </div>
      )}
    </div>
  );
};
