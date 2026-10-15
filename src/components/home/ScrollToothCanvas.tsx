"use client";

import { useEffect, useRef, useState } from "react";
import * as THREE from "three";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader.js";
import { Sparkles, Scan, Layers } from "lucide-react";

interface ScrollToothCanvasProps {
  /** If true, the canvas is anchored fixed to the viewport and driven by scroll progress */
  isGlobalScrollTrigger?: boolean;
}

export function ScrollToothCanvas({ isGlobalScrollTrigger = true }: ScrollToothCanvasProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [isLoaded, setIsLoaded] = useState(false);
  const [activeStage, setActiveStage] = useState<"hero" | "tech" | "services" | "hidden">("hero");

  useEffect(() => {
    const canvas = canvasRef.current;
    const container = containerRef.current;
    if (!canvas || !container) return;

    let destroyed = false;
    let animId: number;

    const isDesktop = window.innerWidth >= 1024;
    // On mobile, if isGlobalScrollTrigger is true, we don't render a fixed overlay to keep performance light
    if (isGlobalScrollTrigger && !isDesktop) {
      return;
    }

    const getDims = () => {
      if (isGlobalScrollTrigger) {
        return { w: window.innerWidth, h: window.innerHeight };
      }
      const rect = container.getBoundingClientRect();
      const w = Math.max(Math.floor(rect.width || 540), 280);
      const h = Math.max(Math.floor(rect.height || 580), 360);
      return { w, h };
    };

    const { w, h } = getDims();

    // 1. Safely query WebGL context
    let gl: WebGLRenderingContext | WebGL2RenderingContext | null = null;
    try {
      gl = (canvas.getContext("webgl2") || canvas.getContext("webgl")) as WebGLRenderingContext | null;
    } catch {
      gl = null;
    }

    if (!gl) {
      // 2D Canvas Fallback
      const ctx = canvas.getContext("2d");
      if (ctx) {
        canvas.width = w;
        canvas.height = h;
        ctx.clearRect(0, 0, w, h);
        const cx = w / 2;
        const cy = h / 2;
        const rad = ctx.createRadialGradient(cx, cy, 10, cx, cy, 140);
        rad.addColorStop(0, "rgba(216, 174, 152, 0.35)");
        rad.addColorStop(0.6, "rgba(160, 155, 124, 0.12)");
        rad.addColorStop(1, "rgba(247, 244, 238, 0)");
        ctx.fillStyle = rad;
        ctx.beginPath();
        ctx.arc(cx, cy, 160, 0, Math.PI * 2);
        ctx.fill();
        setIsLoaded(true);
      }
      return;
    }

    // 2. Transparent WebGL Renderer
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
      renderer.toneMappingExposure = 1.3;
    } catch {
      return;
    }

    // 3. Scene & Camera Setup
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(38, w / h, 0.1, 100);
    camera.position.set(0, 0, 7.5);

    // Root Group for Scroll Transformations & Parallax
    const rootGroup = new THREE.Group();
    scene.add(rootGroup);

    // Tooth Centered Sub-Group
    const toothGroup = new THREE.Group();
    rootGroup.add(toothGroup);

    // Lighting Rig (Warm Ivory Luxury)
    const ambientLight = new THREE.AmbientLight(0xfffbf5, 2.2);
    scene.add(ambientLight);

    const keyLight = new THREE.DirectionalLight(0xfff5e6, 2.6);
    keyLight.position.set(5, 7, 5);
    scene.add(keyLight);

    const fillLight = new THREE.DirectionalLight(0xe8f0fe, 1.6);
    fillLight.position.set(-5, 3, 3);
    scene.add(fillLight);

    const rimLight = new THREE.DirectionalLight(0xd8ae98, 2.6);
    rimLight.position.set(0, -3, -6);
    scene.add(rimLight);

    const topLight = new THREE.PointLight(0xffffff, 1.5, 12);
    topLight.position.set(0, 4, 2);
    scene.add(topLight);

    // =========================================================
    // 4. Luxurious 3D Orbit Rings & Digital Hologram Elements
    // =========================================================
    const ringGroup = new THREE.Group();
    rootGroup.add(ringGroup);

    // Ring 1: Metallic Rose Gold
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

    // Ring 2: Metallic Khaki / Olive Gold
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
      emissiveIntensity: 0.4,
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
      emissiveIntensity: 0.35,
    });
    const sat2Mesh = new THREE.Mesh(sat2Geo, sat2Mat);
    ring2Mesh.add(sat2Mesh);
    sat2Mesh.position.set(2.72, 0, 0);

    // Subtle Digital Scanner Grid Arc (Visible during Tech Scroll Trigger)
    const scanRingGeo = new THREE.RingGeometry(1.8, 1.83, 64);
    const scanRingMat = new THREE.MeshBasicMaterial({
      color: 0xd8ae98,
      side: THREE.DoubleSide,
      transparent: true,
      opacity: 0.45,
    });
    const scanRing = new THREE.Mesh(scanRingGeo, scanRingMat);
    scanRing.rotation.x = Math.PI / 2;
    rootGroup.add(scanRing);

    // Ambient Luminous Particles
    const particleCount = 38;
    const particleGeo = new THREE.BufferGeometry();
    const particlePositions = new Float32Array(particleCount * 3);
    const particleSeeds: { radius: number; speed: number; angle: number; y: number }[] = [];

    for (let i = 0; i < particleCount; i++) {
      const radius = 1.7 + Math.random() * 1.9;
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
      size: 0.07,
      transparent: true,
      opacity: 0.75,
      blending: THREE.AdditiveBlending,
    });
    const particles = new THREE.Points(particleGeo, particleMat);
    rootGroup.add(particles);

    // =========================================================
    // 5. Load Molar Tooth (molar-tooth.glb)
    // =========================================================
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
          }
        });

        toothGroup.add(tooth);
        toothGroup.rotation.x = 0.12;
        toothGroup.rotation.y = -0.28;

        setIsLoaded(true);
      },
      undefined,
      (err) => {
        console.error("Error loading molar-tooth.glb:", err);
      }
    );

    // =========================================================
    // 6. Scroll Trigger Kinematics & Interpolation
    // =========================================================
    let targetX = -1.35;
    let targetY = 0.0;
    let targetZ = 0.0;
    let targetRotX = 0.12;
    let targetRotY = -0.28;
    let targetRotZ = 0.0;
    let targetScale = 1.0;
    let targetOpacity = 1.0;

    let currentX = targetX;
    let currentY = targetY;
    let currentZ = targetZ;
    let currentRotX = targetRotX;
    let currentRotY = targetRotY;
    let currentRotZ = targetRotZ;
    let currentScale = targetScale;
    let currentOpacity = targetOpacity;

    let mouseParallaxX = 0;
    let mouseParallaxY = 0;
    let isDragging = false;
    let prevMouseX = 0;
    let prevMouseY = 0;
    let dragVelocityX = 0;
    let dragVelocityY = 0;

    const handleScroll = () => {
      if (!isGlobalScrollTrigger || !isDesktop) return;

      const scrollY = window.scrollY;
      const heroHeight = window.innerHeight;
      const totalDocHeight = document.documentElement.scrollHeight - window.innerHeight;
      const scrollRatio = Math.max(0, Math.min(scrollY / (heroHeight * 2.8), 1)); // 0 to 1 across Hero, Tech, Services

      // Detect current narrative section based on scrollY
      if (scrollY < heroHeight * 0.7) {
        // --- STAGE 1: HERO (Hero Section) ---
        // Tooth on the left side (RTL layout) with gentle presence
        setActiveStage("hero");
        targetX = -1.35;
        targetY = 0.05;
        targetZ = 0.0;
        targetRotX = 0.12;
        targetRotY = -0.28;
        targetRotZ = 0.0;
        targetScale = 1.0;
        targetOpacity = 1.0;
        scanRing.visible = false;
      } else if (scrollY < heroHeight * 1.7) {
        // --- STAGE 2: 3D PRECISION & SCANNING TECHNOLOGY ---
        // Tooth glides smoothly to the right, tilts forward to show occlusal grooves and enamel precision
        setActiveStage("tech");
        const stageProgress = (scrollY - heroHeight * 0.7) / (heroHeight * 1.0);
        targetX = 1.25 - stageProgress * 0.3; // Glide to right side beside technology cards
        targetY = -0.15 + Math.sin(stageProgress * Math.PI) * 0.2;
        targetZ = 0.3;
        targetRotX = 0.55; // Tilt down to inspect crown
        targetRotY = 1.6 + stageProgress * 0.8; // Rotate to show facets
        targetRotZ = 0.1;
        targetScale = 1.15;
        targetOpacity = 1.0;
        scanRing.visible = true;
      } else if (scrollY < heroHeight * 2.7) {
        // --- STAGE 3: SPECIALIZED SERVICES ---
        // Tooth drifts into the artistic backdrop area of the services section
        setActiveStage("services");
        const stageProgress = (scrollY - heroHeight * 1.7) / (heroHeight * 1.0);
        targetX = -1.8 + stageProgress * 0.4;
        targetY = 0.15;
        targetZ = -0.4;
        targetRotX = -0.15;
        targetRotY = 3.1 + stageProgress * 0.5; // Rotate to inspect root structure
        targetRotZ = -0.15;
        targetScale = 0.85;
        targetOpacity = 0.88;
        scanRing.visible = false;
      } else {
        // --- STAGE 4: PAST SERVICES (Doctors, Portfolio, Booking) ---
        // Smoothly fade out so user can focus cleanly on portfolio and booking
        setActiveStage("hidden");
        targetOpacity = 0.0;
        targetScale = 0.7;
      }
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    handleScroll();

    // Mouse & Touch Parallax
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

      mouseParallaxX = (clientX / window.innerWidth - 0.5) * 0.4;
      mouseParallaxY = (clientY / window.innerHeight - 0.5) * 0.3;

      if (!isDragging) return;
      const deltaX = clientX - prevMouseX;
      const deltaY = clientY - prevMouseY;
      prevMouseX = clientX;
      prevMouseY = clientY;

      dragVelocityX = deltaX * 0.006;
      dragVelocityY = deltaY * 0.006;

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
      const { w: nw, h: nh } = getDims();
      camera.aspect = nw / nh;
      camera.updateProjectionMatrix();
      renderer.setSize(nw, nh, false);
    };

    window.addEventListener("resize", handleResize);

    // Animation Loop with Smooth Lerping
    const startTime = performance.now();

    const animate = () => {
      if (destroyed) return;
      animId = requestAnimationFrame(animate);

      const elapsedTime = (performance.now() - startTime) / 1000;

      // Lerp rootGroup transforms toward scroll targets
      currentX += (targetX - currentX) * 0.07;
      currentY += (targetY - currentY) * 0.07;
      currentZ += (targetZ - currentZ) * 0.07;
      currentRotX += (targetRotX - currentRotX) * 0.06;
      currentRotY += (targetRotY - currentRotY) * 0.06;
      currentRotZ += (targetRotZ - currentRotZ) * 0.06;
      currentScale += (targetScale - currentScale) * 0.08;
      currentOpacity += (targetOpacity - currentOpacity) * 0.09;

      rootGroup.position.set(currentX, currentY, currentZ);
      rootGroup.scale.setScalar(currentScale);

      // Continuous gentle auto-spin + drag velocity damping
      if (!isDragging) {
        dragVelocityX *= 0.93;
        dragVelocityY *= 0.93;
        toothGroup.rotation.y += dragVelocityX + 0.006;
        toothGroup.rotation.x += dragVelocityY;
      }

      // Smooth floating oscillation (Breathing effect)
      toothGroup.position.y = Math.sin(elapsedTime * 1.3) * 0.08;

      // Rotate Orbit Rings
      ring1Mesh.rotation.z = elapsedTime * 0.22;
      ring2Mesh.rotation.y = -elapsedTime * 0.18;

      // Animate Scan Ring when in Tech mode
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
        pArr[i * 3 + 1] = seed.y + Math.sin(elapsedTime * 1.5 + i) * 0.12;
        pArr[i * 3 + 2] = Math.sin(curAngle) * seed.radius;
      }
      particles.geometry.attributes.position.needsUpdate = true;

      // Mouse Parallax
      rootGroup.rotation.y = currentRotY + (mouseParallaxX - rootGroup.rotation.y) * 0.05;
      rootGroup.rotation.x = currentRotX + (-mouseParallaxY - rootGroup.rotation.x) * 0.05;
      rootGroup.rotation.z = currentRotZ;

      // Only render if opacity is above threshold
      if (currentOpacity > 0.02 && renderer) {
        canvas.style.opacity = String(Math.max(0, Math.min(currentOpacity, 1)));
        canvas.style.display = "block";
        renderer.render(scene, camera);
      } else {
        canvas.style.opacity = "0";
        canvas.style.display = "none";
      }
    };

    animate();

    return () => {
      destroyed = true;
      cancelAnimationFrame(animId);
      window.removeEventListener("scroll", handleScroll);
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

      toothGroup.traverse((obj) => {
        if ((obj as THREE.Mesh).isMesh) {
          const mesh = obj as THREE.Mesh;
          mesh.geometry?.dispose();
          if (Array.isArray(mesh.material)) {
            mesh.material.forEach((m) => m.dispose());
          } else {
            mesh.material?.dispose();
          }
        }
      });

      renderer?.dispose();
      renderer?.forceContextLoss();
    };
  }, [isGlobalScrollTrigger]);

  if (isGlobalScrollTrigger) {
    return (
      <div 
        ref={containerRef}
        className="fixed inset-0 pointer-events-none z-15 hidden lg:block overflow-hidden"
        style={{ pointerEvents: "none" }}
      >
        <canvas
          ref={canvasRef}
          className="w-full h-full block bg-transparent transition-opacity duration-300 pointer-events-auto cursor-grab active:cursor-grabbing"
          style={{ opacity: 0 }}
          aria-label="مدل سه‌بعدی متحرک دندان متصل به اسکرول"
        />

        {/* Ambient Stage Tag Indicator when active in 3D Tech stage */}
        {activeStage === "tech" && isLoaded && (
          <div className="absolute top-28 left-12 pointer-events-none hidden xl:flex items-center gap-2.5 px-4 py-2 rounded-full bg-[#FCFAF6]/80 backdrop-blur-md border border-[#E8E2D5] text-xs font-medium text-[#625D45] animate-fade-in shadow-sm">
            <Scan className="w-4 h-4 text-[#A09B7C] animate-pulse" />
            <span>اسکن دیجیتال ۳D · تحلیل میکرونی آناتومی دندان</span>
          </div>
        )}
      </div>
    );
  }

  // Mobile / Local fallback container
  return (
    <div 
      ref={containerRef}
      className="relative w-full h-[320px] sm:h-[400px] flex items-center justify-center select-none bg-transparent overflow-visible"
    >
      <div 
        className="absolute inset-0 pointer-events-none rounded-full blur-[100px] opacity-30"
        style={{
          background: "radial-gradient(circle at center, #D8AE98 0%, #A09B7C 40%, transparent 70%)"
        }}
      />
      <canvas
        ref={canvasRef}
        className="relative w-full h-full max-w-[360px] max-h-[360px] cursor-grab active:cursor-grabbing z-10 block bg-transparent"
        aria-label="مدل سه‌بعدی تعاملی دندان آسیاب در موبایل"
      />
    </div>
  );
}
