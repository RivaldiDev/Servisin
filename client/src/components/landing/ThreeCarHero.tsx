import React, { useEffect, useRef } from 'react';
import * as THREE from 'three';

interface ThreeCarHeroProps {
  isMobile?: boolean;
}

export const ThreeCarHero: React.FC<ThreeCarHeroProps> = ({ isMobile = false }) => {
  const containerRef = useRef<HTMLDivElement>(null);

  // References for animation and interaction
  const carGroupRef = useRef<THREE.Group | null>(null);
  const wheelsRef = useRef<THREE.Group[]>([]);
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
    const camera = new THREE.PerspectiveCamera(40, width / height, 0.1, 100);
    camera.position.set(0, 1.8, 6.2);

    // 3. Renderer with transparent background (no box)
    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    container.replaceChildren(renderer.domElement);

    // 4. Lighting Rig (Strict Palette Highlight Reflection)
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.95);
    scene.add(ambientLight);

    // Key Light (Frosted Blue Tint)
    const keyLight = new THREE.DirectionalLight(0x90e0ef, 1.4);
    keyLight.position.set(5, 8, 5);
    keyLight.castShadow = true;
    scene.add(keyLight);

    // Rim / Contour Light (Bright Teal Blue)
    const rimLight = new THREE.DirectionalLight(0x0077b6, 1.1);
    rimLight.position.set(-6, 4, -4);
    scene.add(rimLight);

    // Front Accent Light (Turquoise Surf)
    const frontLight = new THREE.DirectionalLight(0x00b4d8, 0.8);
    frontLight.position.set(2, 2, 4);
    scene.add(frontLight);

    // 5. Build Refined Sleek 3D Sports Sedan
    const carGroup = new THREE.Group();
    carGroupRef.current = carGroup;
    wheelsRef.current = [];
    materialsRef.current = [];

    // Strict 5-Color Palette:
    // #03045e (Deep Twilight), #0077b6 (Bright Teal Blue), #00b4d8 (Turquoise Surf), #90e0ef (Frosted Blue), #caf0f8 (Light Cyan)
    const COLOR_TWILIGHT = 0x03045e;
    const COLOR_TEAL = 0x0077b6;
    const COLOR_TURQUOISE = 0x00b4d8;
    const COLOR_FROSTED = 0x90e0ef;
    const COLOR_CYAN = 0xcaf0f8;

    // Materials
    const bodyPaintMat = new THREE.MeshStandardMaterial({
      color: COLOR_TEAL,
      metalness: 0.8,
      roughness: 0.18,
    });
    const bodyAccentMat = new THREE.MeshStandardMaterial({
      color: COLOR_TURQUOISE,
      metalness: 0.85,
      roughness: 0.15,
    });
    const glassMat = new THREE.MeshStandardMaterial({
      color: COLOR_TWILIGHT,
      metalness: 0.95,
      roughness: 0.05,
      transparent: true,
      opacity: 0.88,
    });
    const darkChassisMat = new THREE.MeshStandardMaterial({
      color: COLOR_TWILIGHT,
      metalness: 0.5,
      roughness: 0.6,
    });
    const tireMat = new THREE.MeshStandardMaterial({
      color: COLOR_TWILIGHT,
      roughness: 0.8,
    });
    const rimMat = new THREE.MeshStandardMaterial({
      color: COLOR_CYAN,
      metalness: 0.9,
      roughness: 0.1,
    });
    const brakeCalipMat = new THREE.MeshStandardMaterial({
      color: COLOR_TURQUOISE,
      metalness: 0.7,
      roughness: 0.3,
    });
    const headlightMat = new THREE.MeshBasicMaterial({
      color: COLOR_CYAN,
    });
    const taillightMat = new THREE.MeshBasicMaterial({
      color: COLOR_TURQUOISE,
    });

    materialsRef.current.push(
      bodyPaintMat,
      bodyAccentMat,
      glassMat,
      darkChassisMat,
      tireMat,
      rimMat,
      brakeCalipMat,
      headlightMat,
      taillightMat
    );

    // --- CAR BODY STRUCTURE ---

    // A. Main Center Hull
    const mainHullGeo = new THREE.BoxGeometry(2.8, 0.42, 1.28);
    const mainHull = new THREE.Mesh(mainHullGeo, bodyPaintMat);
    mainHull.position.set(0, 0.44, 0);
    mainHull.castShadow = true;
    mainHull.receiveShadow = true;
    carGroup.add(mainHull);

    // B. Sloping Hood / Bonnet (Front Aerodynamics)
    const hoodGeo = new THREE.BoxGeometry(0.85, 0.28, 1.24);
    const hood = new THREE.Mesh(hoodGeo, bodyPaintMat);
    hood.position.set(1.4, 0.38, 0);
    hood.rotation.z = -0.12;
    hood.castShadow = true;
    carGroup.add(hood);

    // Front Bumper Lower Lip (Turquoise Accent)
    const lipGeo = new THREE.BoxGeometry(0.4, 0.1, 1.28);
    const lip = new THREE.Mesh(lipGeo, bodyAccentMat);
    lip.position.set(1.72, 0.24, 0);
    carGroup.add(lip);

    // Front Radiator Air Intake Grill
    const grillGeo = new THREE.BoxGeometry(0.08, 0.16, 0.8);
    const grill = new THREE.Mesh(grillGeo, darkChassisMat);
    grill.position.set(1.83, 0.34, 0);
    carGroup.add(grill);

    // C. Tapered Greenhouse / Cabin (Windshield + Roof + Rear Window)
    const cabinGeo = new THREE.BoxGeometry(1.55, 0.48, 1.08);
    const cabin = new THREE.Mesh(cabinGeo, glassMat);
    cabin.position.set(-0.1, 0.82, 0);
    cabin.castShadow = true;
    carGroup.add(cabin);

    // Roof Top Cap
    const roofCapGeo = new THREE.BoxGeometry(1.35, 0.04, 1.02);
    const roofCap = new THREE.Mesh(roofCapGeo, bodyPaintMat);
    roofCap.position.set(-0.1, 1.07, 0);
    carGroup.add(roofCap);

    // D. Rear Fastback Trunk & Spoiler
    const trunkGeo = new THREE.BoxGeometry(0.65, 0.36, 1.24);
    const trunk = new THREE.Mesh(trunkGeo, bodyPaintMat);
    trunk.position.set(-1.42, 0.46, 0);
    trunk.rotation.z = 0.08;
    trunk.castShadow = true;
    carGroup.add(trunk);

    const spoilerGeo = new THREE.BoxGeometry(0.2, 0.04, 1.26);
    const spoiler = new THREE.Mesh(spoilerGeo, bodyAccentMat);
    spoiler.position.set(-1.72, 0.66, 0);
    carGroup.add(spoiler);

    // E. Side Aero Skirts (Turquoise Surf)
    const leftSkirtGeo = new THREE.BoxGeometry(2.6, 0.06, 0.08);
    const leftSkirt = new THREE.Mesh(leftSkirtGeo, bodyAccentMat);
    leftSkirt.position.set(0, 0.24, 0.65);
    carGroup.add(leftSkirt);

    const rightSkirt = new THREE.Mesh(leftSkirtGeo, bodyAccentMat);
    rightSkirt.position.set(0, 0.24, -0.65);
    carGroup.add(rightSkirt);

    // F. Sleek Side Mirrors
    const mirrorGeo = new THREE.BoxGeometry(0.12, 0.08, 0.16);
    const leftMirror = new THREE.Mesh(mirrorGeo, bodyPaintMat);
    leftMirror.position.set(0.48, 0.72, 0.62);
    carGroup.add(leftMirror);

    const rightMirror = new THREE.Mesh(mirrorGeo, bodyPaintMat);
    rightMirror.position.set(0.48, 0.72, -0.62);
    carGroup.add(rightMirror);

    // G. Crisp LED Headlights (Light Cyan Projectors)
    const headlightGeo = new THREE.BoxGeometry(0.06, 0.1, 0.28);
    const leftHeadlight = new THREE.Mesh(headlightGeo, headlightMat);
    leftHeadlight.position.set(1.82, 0.46, 0.44);
    carGroup.add(leftHeadlight);

    const rightHeadlight = new THREE.Mesh(headlightGeo, headlightMat);
    rightHeadlight.position.set(1.82, 0.46, -0.44);
    carGroup.add(rightHeadlight);

    // H. Continuous Rear LED Lightbar (Turquoise Surf)
    const lightbarGeo = new THREE.BoxGeometry(0.06, 0.08, 1.18);
    const lightbar = new THREE.Mesh(lightbarGeo, taillightMat);
    lightbar.position.set(-1.74, 0.52, 0);
    carGroup.add(lightbar);

    // I. 4 Detailed Sport Wheels with Rims & Brake Calipers
    const wheelPositions = [
      { x: 1.05, y: 0.28, z: 0.68 },
      { x: 1.05, y: 0.28, z: -0.68 },
      { x: -1.02, y: 0.28, z: 0.68 },
      { x: -1.02, y: 0.28, z: -0.68 },
    ];

    const tireGeo = new THREE.CylinderGeometry(0.28, 0.28, 0.2, 28);
    const rimCenterGeo = new THREE.CylinderGeometry(0.18, 0.18, 0.21, 18);
    const spokeGeo = new THREE.BoxGeometry(0.32, 0.03, 0.22);
    const brakeDiscGeo = new THREE.CylinderGeometry(0.15, 0.15, 0.04, 16);
    const caliperGeo = new THREE.BoxGeometry(0.06, 0.08, 0.06);

    wheelPositions.forEach((pos) => {
      const wheelAssembly = new THREE.Group();
      wheelAssembly.position.set(pos.x, pos.y, pos.z);

      // Rotating Wheel Hub
      const rotatingHub = new THREE.Group();

      const tire = new THREE.Mesh(tireGeo, tireMat);
      tire.rotation.x = Math.PI / 2;
      tire.castShadow = true;
      rotatingHub.add(tire);

      const rimCenter = new THREE.Mesh(rimCenterGeo, rimMat);
      rimCenter.rotation.x = Math.PI / 2;
      rotatingHub.add(rimCenter);

      // 5-spoke sports rim detail
      for (let i = 0; i < 3; i++) {
        const spoke = new THREE.Mesh(spokeGeo, rimMat);
        spoke.rotation.y = (i * Math.PI) / 3;
        rotatingHub.add(spoke);
      }

      wheelAssembly.add(rotatingHub);

      // Static Brake Disc & Caliper
      const brakeDisc = new THREE.Mesh(brakeDiscGeo, darkChassisMat);
      brakeDisc.rotation.x = Math.PI / 2;
      brakeDisc.position.z = pos.z > 0 ? -0.06 : 0.06;
      wheelAssembly.add(brakeDisc);

      const caliper = new THREE.Mesh(caliperGeo, brakeCalipMat);
      caliper.position.set(0, 0.08, pos.z > 0 ? -0.06 : 0.06);
      wheelAssembly.add(caliper);

      carGroup.add(wheelAssembly);
      wheelsRef.current.push(rotatingHub);
    });

    // J. Futuristic Floating Hologram Platform Rings (Frosted & Turquoise)
    const ringGeo1 = new THREE.RingGeometry(1.85, 1.9, 64);
    const ringMat1 = new THREE.MeshBasicMaterial({
      color: COLOR_TURQUOISE,
      side: THREE.DoubleSide,
      transparent: true,
      opacity: 0.45,
    });
    const outerRing = new THREE.Mesh(ringGeo1, ringMat1);
    outerRing.rotation.x = -Math.PI / 2;
    outerRing.position.y = 0.02;
    scene.add(outerRing);

    const ringGeo2 = new THREE.RingGeometry(1.4, 1.44, 48);
    const ringMat2 = new THREE.MeshBasicMaterial({
      color: COLOR_FROSTED,
      side: THREE.DoubleSide,
      transparent: true,
      opacity: 0.35,
    });
    const innerRing = new THREE.Mesh(ringGeo2, ringMat2);
    innerRing.rotation.x = -Math.PI / 2;
    innerRing.position.y = 0.03;
    scene.add(innerRing);

    materialsRef.current.push(ringMat1, ringMat2);

    // K. Soft Ground Shadow Plane
    const groundGeo = new THREE.PlaneGeometry(7, 7);
    const groundMat = new THREE.ShadowMaterial({ opacity: 0.16 });
    const ground = new THREE.Mesh(groundGeo, groundMat);
    ground.rotation.x = -Math.PI / 2;
    ground.position.y = 0;
    ground.receiveShadow = true;
    scene.add(ground);

    // Add Car to Scene
    scene.add(carGroup);
    carGroup.position.set(0, 0, 0);

    // 6. Interactive Mouse & Touch Drag Handler
    const handleMouseDown = (e: MouseEvent) => {
      isDraggingRef.current = true;
      previousMousePositionRef.current = { x: e.clientX, y: e.clientY };
    };

    const handleMouseMove = (e: MouseEvent) => {
      if (!isDraggingRef.current) return;
      const deltaX = e.clientX - previousMousePositionRef.current.x;
      const deltaY = e.clientY - previousMousePositionRef.current.y;

      targetRotationY.current += deltaX * 0.012;
      targetRotationX.current = Math.max(-0.15, Math.min(0.45, targetRotationX.current + deltaY * 0.008));

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
      targetRotationX.current = Math.max(-0.15, Math.min(0.45, targetRotationX.current + deltaY * 0.01));

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

    // 7. Polished Render Loop
    let animationFrameId: number;
    const clock = new THREE.Clock();

    const animate = () => {
      animationFrameId = requestAnimationFrame(animate);
      const elapsedTime = clock.getElapsedTime();

      // Smooth Auto-Drift
      if (!isDraggingRef.current) {
        targetRotationY.current += 0.006;
      }

      // Damped interpolation for ultra-smooth rotation
      carGroup.rotation.y += (targetRotationY.current - carGroup.rotation.y) * 0.06;
      carGroup.rotation.x += (targetRotationX.current - carGroup.rotation.x) * 0.06;

      // Gentle floating suspension wave
      carGroup.position.y = Math.sin(elapsedTime * 2.2) * 0.035 + 0.03;

      // Rotate concentric hologram rings in opposite directions
      outerRing.rotation.z -= 0.008;
      innerRing.rotation.z += 0.012;

      // Wheel rotation
      wheelsRef.current.forEach((w) => {
        w.rotation.x += 0.05;
      });

      renderer.render(scene, camera);
    };

    animate();

    // 8. Responsive Resize
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

      materialsRef.current.forEach((m) => m.dispose());
      scene.clear();
      renderer.dispose();
    };
  }, [isMobile]);

  return (
    <div className="relative w-full flex items-center justify-center select-none overflow-visible">
      {/* 3D WebGL Canvas Viewport directly rendered with zero box/borders */}
      <div
        ref={containerRef}
        className="w-full h-[320px] sm:h-[440px] flex items-center justify-center cursor-grab active:cursor-grabbing"
      />
    </div>
  );
};
