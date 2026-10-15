"use client";

import { useEffect, useRef, useState } from "react";
import * as THREE from "three";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader.js";
import { Sparkles, Scan } from "lucide-react";

interface ScrollToothCanvasProps {
  variant?: "hero" | "tech";
}

export function ScrollToothCanvas({ variant = "hero" }: ScrollToothCanvasProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [isLoaded, setIsLoaded] = useState(false);
  const [webglError, setWebglError] = useState(false);

  useEffect(() => {
    const canvas = canvasRef.current;
    const container = containerRef.current;
    if (!canvas || !container) return;

    // Safety: ensure container has non-zero dimensions
    const rect = container.getBoundingClientRect();
    const w = Math.max(Math.floor(rect.width || (variant === "hero" ? 480 : 380)), 260);
    const h = Math.max(Math.floor(rect.height || (variant === "hero" ? 440 : 360)), 260);

    let destroyed = false;
    let animId: number;

    // 1. Safe WebGL Context check
    let gl: WebGLRenderingContext | WebGL2RenderingContext | null = null;
    try {
      gl = (canvas.getContext("webgl2") || canvas.getContext("webgl")) as WebGLRenderingContext | null;
      if (!gl) {
        setWebglError(true);
        setIsLoaded(true);
        return;
      }
      // Check shader precision format to prevent null precision crash
      const vPrec = gl.getShaderPrecisionFormat(gl.VERTEX_SHADER, gl.HIGH_FLOAT);
      if (!vPrec || typeof vPrec.precision !== "number") {
        setWebglError(true);
        setIsLoaded(true);
        return;
      }
    } catch {
      setWebglError(true);
      setIsLoaded(true);
      return;
    }

    // 2. WebGL Renderer with native transparency
    let renderer: THREE.WebGLRenderer | null = null;
    try {
      renderer = new THREE.WebGLRenderer({
        canvas,
        context: gl,
        antialias: true,
        alpha: true,
        powerPreference: "high-performance",
      });
      renderer.setClearColor(0x000000, 0); // 100% transparent
      renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2));
      renderer.setSize(w, h, false);
      renderer.toneMapping = THREE.ACESFilmicToneMapping;
      renderer.toneMappingExposure = 1.35;
    } catch {
      setWebglError(true);
      setIsLoaded(true);
      return;
    }

    // 3. Scene & Camera Setup
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(38, w / h, 0.1, 100);
    camera.position.set(0, 0, 7.2);

    const rootGroup = new THREE.Group();
    scene.add(rootGroup);

    const toothGroup = new THREE.Group();
    rootGroup.add(toothGroup);

    // Warm Ivory Luxury Lighting Rig
    const ambientLight = new THREE.AmbientLight(0xfffbf5, 2.5);
    scene.add(ambientLight);

    const keyLight = new THREE.DirectionalLight(0xfff7ed, 2.8);
    keyLight.position.set(5, 7, 5);
    scene.add(keyLight);

    const fillLight = new THREE.DirectionalLight(0xf2efe9, 1.8);
    fillLight.position.set(-5, 3, 3);
    scene.add(fillLight);

    const rimLight = new THREE.DirectionalLight(0xd8ae98, 3.2);
    rimLight.position.set(0, -3, -6);
    scene.add(rimLight);

    const topLight = new THREE.PointLight(0xffffff, 2.0, 14);
    topLight.position.set(0, 4, 2);
    scene.add(topLight);

    // Enamel Physical Material
    const enamelMaterial = new THREE.MeshPhysicalMaterial({
      color: 0xfdfbf7,
      roughness: 0.16,
      metalness: 0.04,
      clearcoat: 0.98,
      clearcoatRoughness: 0.08,
      reflectivity: 0.92,
      transmission: 0.06,
      thickness: 0.6,
      ior: 1.54,
    });

    // 4. Procedural 3D Molar Model (Instant Display)
    const proceduralGroup = new THREE.Group();
    toothGroup.add(proceduralGroup);

    // Crown Base
    const crownGeo = new THREE.CylinderGeometry(1.2, 0.95, 1.1, 32);
    const crownMesh = new THREE.Mesh(crownGeo, enamelMaterial);
    crownMesh.position.y = 0.55;
    proceduralGroup.add(crownMesh);

    // 4 Rounded Anatomical Cusps
    const cuspPositions = [
      [0.45, 1.15, 0.45],
      [-0.45, 1.15, 0.45],
      [0.45, 1.15, -0.45],
      [-0.45, 1.15, -0.45],
    ];
    cuspPositions.forEach(([cx, cy, cz]) => {
      const cuspGeo = new THREE.SphereGeometry(0.38, 20, 20);
      const cuspMesh = new THREE.Mesh(cuspGeo, enamelMaterial);
      cuspMesh.position.set(cx, cy, cz);
      cuspMesh.scale.set(1, 0.8, 1);
      proceduralGroup.add(cuspMesh);
    });

    // Dual Anatomical Roots
    const root1Geo = new THREE.ConeGeometry(0.42, 1.5, 24);
    const root1Mesh = new THREE.Mesh(root1Geo, enamelMaterial);
    root1Mesh.rotation.z = Math.PI;
    root1Mesh.rotation.x = 0.12;
    root1Mesh.position.set(0.4, -0.7, 0);
    proceduralGroup.add(root1Mesh);

    const root2Geo = new THREE.ConeGeometry(0.42, 1.5, 24);
    const root2Mesh = new THREE.Mesh(root2Geo, enamelMaterial);
    root2Mesh.rotation.z = Math.PI;
    root2Mesh.rotation.x = -0.12;
    root2Mesh.position.set(-0.4, -0.7, 0);
    proceduralGroup.add(root2Mesh);

    // 5. Orbit Rings & Satellites
    const ringGroup = new THREE.Group();
    rootGroup.add(ringGroup);

    // Rose Gold Ring
    const ring1Geo = new THREE.TorusGeometry(2.35, 0.024, 20, 128);
    const ring1Mat = new THREE.MeshStandardMaterial({
      color: 0xd8ae98,
      metalness: 0.88,
      roughness: 0.22,
    });
    const ring1Mesh = new THREE.Mesh(ring1Geo, ring1Mat);
    ring1Mesh.rotation.x = Math.PI / 3.8;
    ring1Mesh.rotation.y = Math.PI / 5;
    ringGroup.add(ring1Mesh);

    // Olive Gold Ring
    const ring2Geo = new THREE.TorusGeometry(2.72, 0.020, 20, 128);
    const ring2Mat = new THREE.MeshStandardMaterial({
      color: 0xa09b7c,
      metalness: 0.84,
      roughness: 0.28,
    });
    const ring2Mesh = new THREE.Mesh(ring2Geo, ring2Mat);
    ring2Mesh.rotation.x = -Math.PI / 3.2;
    ring2Mesh.rotation.z = Math.PI / 4.2;
    ringGroup.add(ring2Mesh);

    // Satellite Spheres
    const satGeo = new THREE.SphereGeometry(0.065, 16, 16);
    const satMat = new THREE.MeshStandardMaterial({
      color: 0xd8ae98,
      metalness: 0.95,
      roughness: 0.15,
      emissive: 0xd8ae98,
      emissiveIntensity: 0.5,
    });
    const satMesh = new THREE.Mesh(satGeo, satMat);
    ring1Mesh.add(satMesh);
    satMesh.position.set(2.35, 0, 0);

    const sat2Geo = new THREE.SphereGeometry(0.055, 16, 16);
    const sat2Mat = new THREE.MeshStandardMaterial({
      color: 0xa09b7c,
      metalness: 0.95,
      roughness: 0.15,
      emissive: 0xa09b7c,
      emissiveIntensity: 0.45,
    });
    const sat2Mesh = new THREE.Mesh(sat2Geo, sat2Mat);
    ring2Mesh.add(sat2Mesh);
    sat2Mesh.position.set(2.72, 0, 0);

    // Scanning Laser Ring
    const scanRingGeo = new THREE.RingGeometry(1.85, 1.88, 64);
    const scanRingMat = new THREE.MeshBasicMaterial({
      color: 0xd8ae98,
      side: THREE.DoubleSide,
      transparent: true,
      opacity: 0.7,
    });
    const scanRing = new THREE.Mesh(scanRingGeo, scanRingMat);
    scanRing.rotation.x = Math.PI / 2;
    scanRing.visible = variant === "tech";
    rootGroup.add(scanRing);

    // Floating Particles
    const particleCount = 38;
    const particleGeo = new THREE.BufferGeometry();
    const particlePositions = new Float32Array(particleCount * 3);
    const particleSeeds: { radius: number; speed: number; angle: number; y: number }[] = [];

    for (let i = 0; i < particleCount; i++) {
      const radius = 1.8 + Math.random() * 1.8;
      const angle = (i / particleCount) * Math.PI * 2 + Math.random() * 0.5;
      const py = (Math.random() - 0.5) * 3.4;
      const speed = (0.2 + Math.random() * 0.35) * (Math.random() > 0.5 ? 1 : -1);

      particlePositions[i * 3] = Math.cos(angle) * radius;
      particlePositions[i * 3 + 1] = py;
      particlePositions[i * 3 + 2] = Math.sin(angle) * radius;

      particleSeeds.push({ radius, speed, angle, y: py });
    }

    particleGeo.setAttribute("position", new THREE.BufferAttribute(particlePositions, 3));
    const particleMat = new THREE.PointsMaterial({
      color: 0xd8ae98,
      size: 0.08,
      transparent: true,
      opacity: 0.8,
      blending: THREE.AdditiveBlending,
    });
    const particles = new THREE.Points(particleGeo, particleMat);
    rootGroup.add(particles);

    // 6. Seamless GLTF Model Loading
    const loader = new GLTFLoader();
    loader.load(
      "/models/molar-tooth.glb",
      (gltf) => {
        if (destroyed) return;
        const tooth = gltf.scene;

        const box = new THREE.Box3().setFromObject(tooth);
        const size = box.getSize(new THREE.Vector3());
        const center = box.getCenter(new THREE.Vector3());

        const maxDim = Math.max(size.x, size.y, size.z) || 1;
        const targetSize = 3.35;
        const scale = targetSize / maxDim;
        tooth.scale.setScalar(scale);

        tooth.position.x = -center.x * scale;
        tooth.position.y = -center.y * scale;
        tooth.position.z = -center.z * scale;

        tooth.traverse((child) => {
          if ((child as THREE.Mesh).isMesh) {
            const mesh = child as THREE.Mesh;
            mesh.castShadow = true;
            mesh.receiveShadow = true;
            mesh.material = enamelMaterial;
          }
        });

        toothGroup.remove(proceduralGroup);
        toothGroup.add(tooth);
        setIsLoaded(true);
      },
      undefined,
      () => {
        setIsLoaded(true);
      }
    );

    // Initial orientation depending on variant
    if (variant === "tech") {
      toothGroup.rotation.x = 0.55; // Tilt forward to inspect occlusal crown
      toothGroup.rotation.y = 1.4;
    } else {
      toothGroup.rotation.x = 0.12;
      toothGroup.rotation.y = -0.25;
    }

    // 7. Interactive Mouse & Touch Drag Controls
    let isDragging = false;
    let prevMouseX = 0;
    let prevMouseY = 0;
    let dragVelocityX = 0;
    let dragVelocityY = 0;
    let mouseParallaxX = 0;
    let mouseParallaxY = 0;

    const onPointerDown = (e: MouseEvent | TouchEvent) => {
      isDragging = true;
      const clientX = "touches" in e ? e.touches[0].clientX : e.clientX;
      const clientY = "touches" in e ? e.touches[0].clientY : e.clientY;
      prevMouseX = clientX;
      prevMouseY = clientY;
      dragVelocityX = 0;
      dragVelocityY = 0;
    };

    const onPointerMove = (e: MouseEvent | TouchEvent) => {
      const clientX = "touches" in e ? e.touches[0].clientX : e.clientX;
      const clientY = "touches" in e ? e.touches[0].clientY : e.clientY;

      const rect = container.getBoundingClientRect();
      mouseParallaxX = ((clientX - rect.left) / rect.width - 0.5) * 0.4;
      mouseParallaxY = ((clientY - rect.top) / rect.height - 0.5) * 0.3;

      if (!isDragging) return;
      const deltaX = clientX - prevMouseX;
      const deltaY = clientY - prevMouseY;
      prevMouseX = clientX;
      prevMouseY = clientY;

      dragVelocityX = deltaX * 0.007;
      dragVelocityY = deltaY * 0.007;

      toothGroup.rotation.y += dragVelocityX;
      toothGroup.rotation.x += dragVelocityY;
    };

    const onPointerUp = () => {
      isDragging = false;
    };

    window.addEventListener("mousemove", onPointerMove, { passive: true });
    canvas.addEventListener("mousedown", onPointerDown, { passive: true });
    window.addEventListener("mouseup", onPointerUp, { passive: true });
    canvas.addEventListener("touchstart", onPointerDown, { passive: true });
    window.addEventListener("touchmove", onPointerMove, { passive: true });
    window.addEventListener("touchend", onPointerUp, { passive: true });

    // Resize Handler
    const handleResize = () => {
      if (destroyed || !renderer) return;
      const r = container.getBoundingClientRect();
      const nw = Math.max(Math.floor(r.width), 260);
      const nh = Math.max(Math.floor(r.height), 260);
      camera.aspect = nw / nh;
      camera.updateProjectionMatrix();
      renderer.setSize(nw, nh, false);
    };

    window.addEventListener("resize", handleResize);

    // Initial frame render
    renderer.render(scene, camera);

    // Animation Loop with Continuous Scroll Kinematics
    const startTime = performance.now();

    const animate = () => {
      if (destroyed) return;
      animId = requestAnimationFrame(animate);

      const elapsedTime = (performance.now() - startTime) / 1000;
      const scrollY = typeof window !== "undefined" ? window.scrollY : 0;

      // Scroll Trigger Influence: subtle dynamic rotation with scroll
      const scrollRot = scrollY * 0.0018;

      if (!isDragging) {
        dragVelocityX *= 0.93;
        dragVelocityY *= 0.93;
        toothGroup.rotation.y += dragVelocityX + 0.006;
        toothGroup.rotation.x += dragVelocityY;
      }

      // Smooth floating oscillation
      toothGroup.position.y = Math.sin(elapsedTime * 1.5) * 0.08;

      // Orbit rings rotation
      ring1Mesh.rotation.z = elapsedTime * 0.22;
      ring2Mesh.rotation.y = -elapsedTime * 0.18;

      // Scan laser animation
      if (scanRing.visible) {
        scanRing.position.y = Math.sin(elapsedTime * 2.2) * 1.2;
        scanRing.rotation.z = elapsedTime * 0.6;
      }

      // Animate Particles
      const pArr = particles.geometry.attributes.position.array as Float32Array;
      for (let i = 0; i < particleCount; i++) {
        const seed = particleSeeds[i];
        const curAngle = seed.angle + elapsedTime * seed.speed;
        pArr[i * 3] = Math.cos(curAngle) * seed.radius;
        pArr[i * 3 + 1] = seed.y + Math.sin(elapsedTime * 1.6 + i) * 0.12;
        pArr[i * 3 + 2] = Math.sin(curAngle) * seed.radius;
      }
      particles.geometry.attributes.position.needsUpdate = true;

      // Mouse Parallax & Scroll Rotations
      rootGroup.rotation.y = (mouseParallaxX) * 0.3 + scrollRot;
      rootGroup.rotation.x = (-mouseParallaxY) * 0.3;

      renderer.render(scene, camera);
    };

    animate();

    return () => {
      destroyed = true;
      cancelAnimationFrame(animId);
      window.removeEventListener("mousemove", onPointerMove);
      window.removeEventListener("resize", handleResize);
      window.removeEventListener("mouseup", onPointerUp);
      window.removeEventListener("touchmove", onPointerMove);
      window.removeEventListener("touchend", onPointerUp);

      ring1Geo.dispose();
      ring1Mat.dispose();
      ring2Geo.dispose();
      ring2Mat.dispose();
      satGeo.dispose();
      satMat.dispose();
      sat2Geo.dispose();
      sat2Mat.dispose();
      scanRingGeo.dispose();
      scanRingMat.dispose();
      particleGeo.dispose();
      particleMat.dispose();
      enamelMaterial.dispose();
      crownGeo.dispose();
      root1Geo.dispose();
      root2Geo.dispose();

      toothGroup.traverse((obj) => {
        if ((obj as THREE.Mesh).isMesh) {
          const mesh = obj as THREE.Mesh;
          mesh.geometry?.dispose();
        }
      });

      renderer?.dispose();
      renderer?.forceContextLoss();
    };
  }, [variant]);

  // Fallback: If WebGL is unavailable, render artistic SVG 3D Molar with CSS animations
  if (webglError) {
    return (
      <div 
        ref={containerRef}
        className="relative w-full h-full flex flex-col items-center justify-center p-6 text-center select-none"
      >
        <div 
          className="absolute inset-0 rounded-full blur-[70px] opacity-30 pointer-events-none"
          style={{ background: "radial-gradient(circle, #D8AE98 0%, #A09B7C 40%, transparent 70%)" }}
        />
        
        {/* Stylized SVG 3D Molar */}
        <div className="relative z-10 animate-float flex flex-col items-center">
          <svg viewBox="0 0 200 240" fill="none" className="w-48 h-56 text-[#F7F4EE] drop-shadow-[0_15px_30px_rgba(216,174,152,0.35)]">
            {/* Crown */}
            <path
              d="M100 25 C60 25 35 45 35 80 C35 120 50 145 60 170 C65 185 70 215 80 215 C88 215 90 185 100 160 C110 185 112 215 120 215 C130 215 135 185 140 170 C150 145 165 120 165 80 C165 45 140 25 100 25 Z"
              fill="url(#enamelGrad)"
              stroke="#D8AE98"
              strokeWidth="2.5"
            />
            {/* Occlusal Grooves */}
            <path d="M70 70 Q100 95 130 70" stroke="#A09B7C" strokeWidth="2.5" strokeLinecap="round" opacity="0.6" />
            <path d="M100 70 V120" stroke="#A09B7C" strokeWidth="2.5" strokeLinecap="round" opacity="0.5" />
            
            {/* Light Sheen */}
            <path d="M60 50 Q75 40 95 42" stroke="white" strokeWidth="3" strokeLinecap="round" opacity="0.8" />
            
            <defs>
              <linearGradient id="enamelGrad" x1="0" y1="0" x2="1" y2="1">
                <stop offset="0%" stopColor="#FFFFFF" />
                <stop offset="50%" stopColor="#F7F4EE" />
                <stop offset="100%" stopColor="#E8E2D5" />
              </linearGradient>
            </defs>
          </svg>

          {/* Luminous Ring */}
          <div className="w-56 h-8 rounded-full border border-[#D8AE98]/60 blur-[1px] -mt-10" />
        </div>
      </div>
    );
  }

  return (
    <div 
      ref={containerRef}
      className="relative w-full h-full flex items-center justify-center select-none bg-transparent overflow-visible"
    >
      {/* Ambient Radial Glow */}
      <div 
        className="absolute inset-0 pointer-events-none rounded-full blur-[80px] opacity-35"
        style={{
          background: "radial-gradient(circle at center, #D8AE98 0%, #A09B7C 40%, transparent 70%)"
        }}
      />
      <canvas
        ref={canvasRef}
        className="relative w-full h-full block bg-transparent cursor-grab active:cursor-grabbing z-10 transition-opacity duration-300"
        style={{ opacity: 1 }}
        aria-label="مدل سه‌بعدی تعاملی دندان آسیاب با چرخش و اسکرول"
      />
    </div>
  );
}
