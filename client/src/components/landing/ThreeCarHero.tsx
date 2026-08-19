import React, { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';

interface ThreeCarHeroProps {
  isMobile?: boolean;
}

// 1. Procedural Texture Generators
function createCarbonFiberTexture(): THREE.CanvasTexture {
  const canvas = document.createElement('canvas');
  canvas.width = 128;
  canvas.height = 128;
  const ctx = canvas.getContext('2d')!;

  ctx.fillStyle = '#15171c';
  ctx.fillRect(0, 0, 128, 128);

  ctx.fillStyle = '#262930';
  for (let i = 0; i < 128; i += 8) {
    for (let j = 0; j < 128; j += 8) {
      if ((i / 8 + j / 8) % 2 === 0) {
        ctx.fillRect(i, j, 8, 8);
      }
    }
  }

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

  ctx.strokeStyle = '#050608';
  ctx.lineWidth = 4;
  for (let x = 0; x < 512; x += 16) {
    ctx.beginPath();
    ctx.moveTo(x, 10);
    ctx.lineTo(x + 12, 64);
    ctx.lineTo(x, 118);
    ctx.stroke();

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

  ctx.strokeStyle = '#cbd5e1';
  ctx.lineWidth = 1;
  for (let r = 20; r < 120; r += 4) {
    ctx.beginPath();
    ctx.arc(128, 128, r, 0, Math.PI * 2);
    ctx.stroke();
  }

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
  const [hintVisible, setHintVisible] = useState(true);

  // Door & Hood Hinged Animation State References
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

    // 3. Renderer with transparent background
    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    container.replaceChildren(renderer.domElement);

    // 4. Studio Lighting Rig
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.95);
    scene.add(ambientLight);

    const keyLight = new THREE.DirectionalLight(0xffffff, 1.5);
    keyLight.position.set(6, 9, 6);
    keyLight.castShadow = true;
    scene.add(keyLight);

    const rimLight = new THREE.DirectionalLight(0x90e0ef, 1.2);
    rimLight.position.set(-6, 5, -5);
    scene.add(rimLight);

    const frontLight = new THREE.DirectionalLight(0xffffff, 0.9);
    frontLight.position.set(2, 2, 5);
    scene.add(frontLight);

    // 5. Materials with Procedural Textures
    const carbonTexture = createCarbonFiberTexture();
    const tireTexture = createTireTreadTexture();
    const brakeTexture = createBrakeRotorTexture();

    const lamboRedPaintMat = new THREE.MeshStandardMaterial({
      color: 0xd90429,
      metalness: 0.85,
      roughness: 0.14,
    });

    const carbonAeroMat = new THREE.MeshStandardMaterial({
      map: carbonTexture,
      color: 0x22242a,
      metalness: 0.8,
      roughness: 0.25,
    });

    const cockpitGlassMat = new THREE.MeshStandardMaterial({
      color: 0x0a0d14,
      metalness: 0.95,
      roughness: 0.05,
      transparent: true,
      opacity: 0.85,
    });

    const interiorMat = new THREE.MeshStandardMaterial({
      color: 0x181a20,
      metalness: 0.3,
      roughness: 0.7,
    });

    const interiorAccentMat = new THREE.MeshStandardMaterial({
      color: 0xd90429,
      metalness: 0.5,
      roughness: 0.4,
    });

    const tireTreadMat = new THREE.MeshStandardMaterial({
      map: tireTexture,
      color: 0x181a1f,
      roughness: 0.85,
      metalness: 0.1,
    });

    const supercarRimMat = new THREE.MeshStandardMaterial({
      color: 0xe2e8f0,
      metalness: 0.9,
      roughness: 0.15,
    });

    const brakeDiscMat = new THREE.MeshStandardMaterial({
      map: brakeTexture,
      metalness: 0.9,
      roughness: 0.2,
    });

    const redBrakeCaliperMat = new THREE.MeshStandardMaterial({
      color: 0xef233c,
      metalness: 0.7,
      roughness: 0.2,
    });

    const yHeadlightMat = new THREE.MeshBasicMaterial({ color: 0xffffff });
    const yTaillightMat = new THREE.MeshBasicMaterial({ color: 0xff002b });
    const exhaustMat = new THREE.MeshStandardMaterial({ color: 0x64748b, metalness: 0.95, roughness: 0.1 });

    materialsRef.current.push(
      lamboRedPaintMat,
      carbonAeroMat,
      cockpitGlassMat,
      interiorMat,
      interiorAccentMat,
      tireTreadMat,
      supercarRimMat,
      brakeDiscMat,
      redBrakeCaliperMat,
      yHeadlightMat,
      yTaillightMat,
      exhaustMat
    );

    // --- 6. BUILD INTERACTIVE LAMBORGHINI SUPERCAR ---
    const carGroup = new THREE.Group();
    carGroupRef.current = carGroup;
    rotatingWheelsRef.current = [];
    clickableMeshesRef.current = [];

    // A. Main Wedge Chassis Lower Body
    const lowerHullGeo = new THREE.BoxGeometry(2.9, 0.28, 1.36);
    const lowerHull = new THREE.Mesh(lowerHullGeo, lamboRedPaintMat);
    lowerHull.position.set(0, 0.32, 0);
    lowerHull.castShadow = true;
    lowerHull.receiveShadow = true;
    carGroup.add(lowerHull);

    // Cockpit Interior Tub (Visible when Scissor Doors Open)
    const cockpitTubGeo = new THREE.BoxGeometry(1.2, 0.25, 0.96);
    const cockpitTub = new THREE.Mesh(cockpitTubGeo, interiorMat);
    cockpitTub.position.set(-0.05, 0.44, 0);
    carGroup.add(cockpitTub);

    // Sport Bucket Seats (Red Trim)
    const seatGeo = new THREE.BoxGeometry(0.35, 0.38, 0.32);
    const leftSeat = new THREE.Mesh(seatGeo, interiorAccentMat);
    leftSeat.position.set(-0.18, 0.56, 0.22);
    carGroup.add(leftSeat);

    const rightSeat = new THREE.Mesh(seatGeo, interiorAccentMat);
    rightSeat.position.set(-0.18, 0.56, -0.22);
    carGroup.add(rightSeat);

    // F1 Steering Wheel & Dashboard
    const dashGeo = new THREE.BoxGeometry(0.28, 0.16, 0.8);
    const dash = new THREE.Mesh(dashGeo, interiorMat);
    dash.position.set(0.32, 0.58, 0);
    carGroup.add(dash);

    // B. INTERACTIVE HINGED FRONT HOOD (Kap Mesin Depan)
    const hoodPivot = new THREE.Group();
    hoodPivot.position.set(0.92, 0.42, 0); // Windshield base hinge
    hoodPivotRef.current = hoodPivot;

    const hoodMeshGroup = new THREE.Group();
    const hoodGeo = new THREE.BoxGeometry(0.96, 0.12, 1.26);
    const hoodMesh = new THREE.Mesh(hoodGeo, lamboRedPaintMat);
    hoodMesh.position.set(0.48, -0.06, 0);
    hoodMesh.rotation.z = -0.14;
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
    const frontTrunkGeo = new THREE.BoxGeometry(0.7, 0.2, 0.9);
    const frontTrunk = new THREE.Mesh(frontTrunkGeo, carbonAeroMat);
    frontTrunk.position.set(1.4, 0.3, 0);
    carGroup.add(frontTrunk);

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

    // C. INTERACTIVE ICONIC SCISSOR DOORS (Pintu Scissor Kiri & Kanan)

    // --- LEFT SCISSOR DOOR ---
    const leftDoorPivot = new THREE.Group();
    leftDoorPivot.position.set(0.45, 0.48, 0.58); // A-Pillar Hinge
    leftDoorPivotRef.current = leftDoorPivot;

    const leftDoorMeshGroup = new THREE.Group();
    const doorBodyGeo = new THREE.BoxGeometry(0.85, 0.34, 0.1);
    const leftDoorBody = new THREE.Mesh(doorBodyGeo, lamboRedPaintMat);
    leftDoorBody.position.set(-0.42, 0, 0);
    leftDoorBody.castShadow = true;
    leftDoorMeshGroup.add(leftDoorBody);

    const doorWindowGeo = new THREE.BoxGeometry(0.72, 0.24, 0.04);
    const leftDoorWindow = new THREE.Mesh(doorWindowGeo, cockpitGlassMat);
    leftDoorWindow.position.set(-0.4, 0.24, 0);
    leftDoorMeshGroup.add(leftDoorWindow);

    // Carbon Aero Mirror on Door
    const leftMirror = new THREE.Mesh(new THREE.BoxGeometry(0.12, 0.06, 0.14), carbonAeroMat);
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
    rightDoorPivot.position.set(0.45, 0.48, -0.58); // A-Pillar Hinge
    rightDoorPivotRef.current = rightDoorPivot;

    const rightDoorMeshGroup = new THREE.Group();
    const rightDoorBody = new THREE.Mesh(doorBodyGeo, lamboRedPaintMat);
    rightDoorBody.position.set(-0.42, 0, 0);
    rightDoorBody.castShadow = true;
    rightDoorMeshGroup.add(rightDoorBody);

    const rightDoorWindow = new THREE.Mesh(doorWindowGeo, cockpitGlassMat);
    rightDoorWindow.position.set(-0.4, 0.24, 0);
    rightDoorMeshGroup.add(rightDoorWindow);

    const rightMirror = new THREE.Mesh(new THREE.BoxGeometry(0.12, 0.06, 0.14), carbonAeroMat);
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

    // Fixed Cockpit Windshield & Roof Center Spine
    const windshieldGeo = new THREE.BoxGeometry(0.65, 0.32, 1.0);
    const windshield = new THREE.Mesh(windshieldGeo, cockpitGlassMat);
    windshield.position.set(0.32, 0.68, 0);
    windshield.rotation.z = -0.32;
    carGroup.add(windshield);

    const roofSpineGeo = new THREE.BoxGeometry(0.9, 0.03, 0.86);
    const roofSpine = new THREE.Mesh(roofSpineGeo, lamboRedPaintMat);
    roofSpine.position.set(-0.08, 0.81, 0);
    carGroup.add(roofSpine);

    // D. INTERACTIVE HINGED REAR V12 ENGINE COVER
    const engineCoverPivot = new THREE.Group();
    engineCoverPivot.position.set(-0.45, 0.72, 0);
    engineCoverPivotRef.current = engineCoverPivot;

    const engineCoverGroup = new THREE.Group();
    const engineCoverGeo = new THREE.BoxGeometry(0.9, 0.08, 1.04);
    const engineCover = new THREE.Mesh(engineCoverGeo, carbonAeroMat);
    engineCover.position.set(-0.45, -0.04, 0);
    engineCover.castShadow = true;
    engineCoverGroup.add(engineCover);

    // Engine Slats / Louvers
    for (let i = 0; i < 4; i++) {
      const slatGeo = new THREE.BoxGeometry(0.04, 0.02, 0.88);
      const slat = new THREE.Mesh(slatGeo, lamboRedPaintMat);
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

    // V12 Engine Block & Manifolds under Engine Cover
    const engineBlockGeo = new THREE.BoxGeometry(0.65, 0.22, 0.6);
    const engineBlock = new THREE.Mesh(engineBlockGeo, carbonAeroMat);
    engineBlock.position.set(-0.9, 0.44, 0);
    carGroup.add(engineBlock);

    // Golden V12 Intake Plenums
    const plenumMat = new THREE.MeshStandardMaterial({ color: 0xe2a829, metalness: 0.85, roughness: 0.2 });
    const plenumGeo = new THREE.CylinderGeometry(0.06, 0.06, 0.55, 16);
    plenumGeo.rotateZ(Math.PI / 2);
    const leftPlenum = new THREE.Mesh(plenumGeo, plenumMat);
    leftPlenum.position.set(-0.9, 0.55, 0.16);
    carGroup.add(leftPlenum);

    const rightPlenum = new THREE.Mesh(plenumGeo, plenumMat);
    rightPlenum.position.set(-0.9, 0.55, -0.16);
    carGroup.add(rightPlenum);

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

    const wingStrutGeo = new THREE.BoxGeometry(0.04, 0.22, 0.03);
    const leftStrut = new THREE.Mesh(wingStrutGeo, carbonAeroMat);
    leftStrut.position.set(-1.62, 0.54, 0.42);
    carGroup.add(leftStrut);

    const rightStrut = new THREE.Mesh(wingStrutGeo, carbonAeroMat);
    rightStrut.position.set(-1.62, 0.54, -0.42);
    carGroup.add(rightStrut);

    // Quad Central Exhausts
    for (let i = -1.5; i <= 1.5; i += 1.0) {
      const exhaustGeo = new THREE.CylinderGeometry(0.045, 0.045, 0.12, 16);
      exhaustGeo.rotateZ(Math.PI / 2);
      const exhaust = new THREE.Mesh(exhaustGeo, exhaustMat);
      exhaust.position.set(-1.76, 0.32, i * 0.1);
      carGroup.add(exhaust);
    }

    // F. Side NACA Ducts & Skirts
    const sideSkirtGeo = new THREE.BoxGeometry(1.6, 0.06, 0.08);
    const leftSkirt = new THREE.Mesh(sideSkirtGeo, carbonAeroMat);
    leftSkirt.position.set(0, 0.16, 0.69);
    carGroup.add(leftSkirt);

    const rightSkirt = new THREE.Mesh(sideSkirtGeo, carbonAeroMat);
    rightSkirt.position.set(0, 0.16, -0.69);
    carGroup.add(rightSkirt);

    // G. Iconic Y-Shaped LED Headlights & Taillight
    const headlightGeo = new THREE.BoxGeometry(0.08, 0.06, 0.28);
    const leftHeadlight = new THREE.Mesh(headlightGeo, yHeadlightMat);
    leftHeadlight.position.set(1.88, 0.38, 0.44);
    leftHeadlight.rotation.y = 0.2;
    carGroup.add(leftHeadlight);

    const rightHeadlight = new THREE.Mesh(headlightGeo, yHeadlightMat);
    rightHeadlight.position.set(1.88, 0.38, -0.44);
    rightHeadlight.rotation.y = -0.2;
    carGroup.add(rightHeadlight);

    const taillightGeo = new THREE.BoxGeometry(0.06, 0.05, 1.24);
    const rearTaillight = new THREE.Mesh(taillightGeo, yTaillightMat);
    rearTaillight.position.set(-1.72, 0.44, 0);
    carGroup.add(rearTaillight);

    // --- 7. HIGH-PERFORMANCE WHEELS WITH TEXTURED BRAKES & TIRES ---
    const wheelPositions = [
      { x: 1.08, y: 0.29, z: 0.66, isLeft: true },
      { x: 1.08, y: 0.29, z: -0.66, isLeft: false },
      { x: -1.06, y: 0.29, z: 0.68, isLeft: true },
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

      const rotatingHub = new THREE.Group();

      const tireMesh = new THREE.Mesh(tireGeo, tireTreadMat);
      tireMesh.castShadow = true;
      rotatingHub.add(tireMesh);

      const rimLip = new THREE.Mesh(rimLipGeo, supercarRimMat);
      rimLip.position.z = pos.isLeft ? 0.11 : -0.11;
      rotatingHub.add(rimLip);

      const hubCap = new THREE.Mesh(rimCenterGeo, supercarRimMat);
      rotatingHub.add(hubCap);

      for (let i = 0; i < 5; i++) {
        const angle = (i * Math.PI * 2) / 5;
        const spokeGeo = new THREE.BoxGeometry(0.16, 0.024, 0.02);
        const spoke = new THREE.Mesh(spokeGeo, supercarRimMat);
        spoke.position.set(Math.cos(angle) * 0.1, Math.sin(angle) * 0.1, pos.isLeft ? 0.1 : -0.1);
        spoke.rotation.z = angle;
        rotatingHub.add(spoke);
      }

      wheelAssembly.add(rotatingHub);

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

    // 8. Ground Contact Shadow & Glow Ring
    const groundGeo = new THREE.PlaneGeometry(8, 8);
    const groundMat = new THREE.ShadowMaterial({ opacity: 0.22 });
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

    // --- 9. RAYCASTING & INTERACTION FOR DOORS / HOOD ---
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

      // If displacement is less than 6px, treat as a direct CLICK / TAP on the car
      if (dist < 6 && containerRef.current) {
        const rect = containerRef.current.getBoundingClientRect();
        mouseVector.x = ((clientX - rect.left) / rect.width) * 2 - 1;
        mouseVector.y = -((clientY - rect.top) / rect.height) * 2 + 1;

        raycaster.setFromCamera(mouseVector, camera);
        const clickableTargets = clickableMeshesRef.current.map((item) => item.mesh);
        const intersects = raycaster.intersectObjects(clickableTargets, true);

        if (intersects.length > 0) {
          const hit = intersects[0];
          // Find corresponding registered action
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

    // --- 10. POLISHED RENDER LOOP WITH SLOW ROTATION & HINGE INTERPOLATION ---
    let animationFrameId: number;
    const clock = new THREE.Clock();

    const animate = () => {
      animationFrameId = requestAnimationFrame(animate);
      const elapsedTime = clock.getElapsedTime();

      // Slower, elegant showroom auto-rotation (0.002 instead of 0.007)
      if (!isDraggingRef.current) {
        targetRotationY.current += 0.0022;
      }

      carGroup.rotation.y += (targetRotationY.current - carGroup.rotation.y) * 0.06;
      carGroup.rotation.x += (targetRotationX.current - carGroup.rotation.x) * 0.06;

      // Subtle suspension breath
      carGroup.position.y = Math.sin(elapsedTime * 2.0) * 0.02 + 0.02;

      // Ground ring slow rotation
      groundRing.rotation.z -= 0.004;

      // Slow wheel rolling rotation
      rotatingWheelsRef.current.forEach((wheelHub) => {
        wheelHub.rotation.z -= 0.02;
      });

      // --- SMOOTH HINGE INTERPOLATION FOR SCISSOR DOORS & HOOD ---
      // Left Scissor Door (Opens Upwards ~55° and slightly outward)
      if (leftDoorPivotRef.current) {
        const targetZ = leftDoorOpenRef.current ? 0.88 : 0.0;
        const targetX = leftDoorOpenRef.current ? -0.14 : 0.0;
        leftDoorPivotRef.current.rotation.z += (targetZ - leftDoorPivotRef.current.rotation.z) * 0.08;
        leftDoorPivotRef.current.rotation.x += (targetX - leftDoorPivotRef.current.rotation.x) * 0.08;
      }

      // Right Scissor Door
      if (rightDoorPivotRef.current) {
        const targetZ = rightDoorOpenRef.current ? 0.88 : 0.0;
        const targetX = rightDoorOpenRef.current ? 0.14 : 0.0;
        rightDoorPivotRef.current.rotation.z += (targetZ - rightDoorPivotRef.current.rotation.z) * 0.08;
        rightDoorPivotRef.current.rotation.x += (targetX - rightDoorPivotRef.current.rotation.x) * 0.08;
      }

      // Front Hood (Opens Upwards ~38°)
      if (hoodPivotRef.current) {
        const targetZ = hoodOpenRef.current ? -0.62 : 0.0;
        hoodPivotRef.current.rotation.z += (targetZ - hoodPivotRef.current.rotation.z) * 0.08;
      }

      // Rear Engine Bay Cover (Opens Upwards ~32°)
      if (engineCoverPivotRef.current) {
        const targetZ = engineCoverOpenRef.current ? 0.54 : 0.0;
        engineCoverPivotRef.current.rotation.z += (targetZ - engineCoverPivotRef.current.rotation.z) * 0.08;
      }

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
      domElem.removeEventListener('mousedown', onMouseDown);
      window.removeEventListener('mousemove', onMouseMove);
      window.removeEventListener('mouseup', onMouseUp);
      domElem.removeEventListener('touchstart', onTouchStart);
      window.removeEventListener('touchmove', onTouchMove);
      window.removeEventListener('touchend', onTouchEnd);

      carbonTexture.dispose();
      tireTexture.dispose();
      brakeTexture.dispose();
      materialsRef.current.forEach((m) => m.dispose());
      scene.clear();
      renderer.dispose();
    };
  }, [isMobile]);

  // Quick Action Buttons for Users
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
      {/* 3D WebGL Canvas Viewport for Red Lamborghini */}
      <div
        ref={containerRef}
        className="w-full h-[320px] sm:h-[440px] flex items-center justify-center cursor-grab active:cursor-grabbing"
      />

      {/* Interactive Floating Micro-Buttons & Click Hint */}
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

      {/* Subtle First-Time User Interaction Hint */}
      {hintVisible && (
        <div className="absolute top-2 bg-[#03045e]/80 text-[#caf0f8] px-3 py-1 rounded-full text-[10px] font-mono border border-[#90e0ef]/30 pointer-events-none animate-pulse">
          💡 Klik bodi / pintu / kap untuk buka-tutup
        </div>
      )}
    </div>
  );
};
