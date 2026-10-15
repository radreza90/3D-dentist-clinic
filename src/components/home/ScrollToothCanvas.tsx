"use client";

import { useEffect, useRef } from "react";
import * as THREE from "three";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader.js";

interface ScrollToothCanvasProps {
  className?: string;
}

export function ScrollToothCanvas({ className = "" }: ScrollToothCanvasProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const container = containerRef.current;
    if (!canvas || !container) return;

    let destroyed = false;
    let animId: number;

    // Dimensions helper
    const getDims = () => {
      const rect = container.getBoundingClientRect();
      const w = Math.max(Math.floor(rect.width || 520), 280);
      const h = Math.max(Math.floor(rect.height || 520), 280);
      return { w, h };
    };

    const { w, h } = getDims();

    // 1. WebGL Context Query
    let gl: WebGLRenderingContext | WebGL2RenderingContext | null = null;
    try {
      gl = (canvas.getContext("webgl2", { alpha: true, antialias: true }) ||
            canvas.getContext("webgl", { alpha: true, antialias: true })) as WebGLRenderingContext | null;
    } catch {
      gl = null;
    }

    if (!gl) {
      return;
    }

    // 2. High-performance Transparent WebGL Renderer
    let renderer: THREE.WebGLRenderer | null = null;
    try {
      renderer = new THREE.WebGLRenderer({
        canvas,
        context: gl,
        antialias: true,
        alpha: true,
        powerPreference: "high-performance",
      });
      renderer.setClearColor(0x000000, 0); // 100% transparent background
      renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2));
      renderer.setSize(w, h, false);
      renderer.toneMapping = THREE.ACESFilmicToneMapping;
      renderer.toneMappingExposure = 1.3;
    } catch {
      return;
    }

    // 3. Scene & Camera Setup
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(35, w / h, 0.1, 100);
    camera.position.set(0, 0, 7.5);

    const rootGroup = new THREE.Group();
    scene.add(rootGroup);

    const toothGroup = new THREE.Group();
    rootGroup.add(toothGroup);

    // Initial anatomical pose: slight natural tilt
    toothGroup.rotation.x = 0.14;
    toothGroup.rotation.y = -0.3;

    // 4. Studio Multi-Light Rig for Maximum 3D Depth & Ceramic Sheen
    // Gentle warm ambient light (keeps deep form without washing out geometry)
    const ambientLight = new THREE.AmbientLight(0xfff8ee, 0.75);
    scene.add(ambientLight);

    // Primary Key Light (bright studio light casting specular highlights on crown cusps)
    const keyLight = new THREE.DirectionalLight(0xfffaf0, 3.2);
    keyLight.position.set(4.5, 6, 4.5);
    scene.add(keyLight);

    // Secondary Fill Light (subtle cool dental operatory fill from the left)
    const fillLight = new THREE.DirectionalLight(0xe8f0f8, 1.4);
    fillLight.position.set(-4.5, 1.5, 3);
    scene.add(fillLight);

    // Luminous Rose Gold Rim Light (sculpts the silhouette of roots and crown against dark background)
    const rimLight = new THREE.DirectionalLight(0xd8ae98, 3.8);
    rimLight.position.set(1.5, -2.5, -4.5);
    scene.add(rimLight);

    // Top Crown Specular Accent
    const topAccent = new THREE.PointLight(0xffffff, 2.0, 10);
    topAccent.position.set(0, 4.5, 1.5);
    scene.add(topAccent);

    // Bottom Root Accent
    const bottomAccent = new THREE.DirectionalLight(0xf2e8dc, 1.2);
    bottomAccent.position.set(0, -5, 2);
    scene.add(bottomAccent);

    // 5. Ceramic Enamel Physical Materials (Physical depth, translucency, ceramic glaze)
    const crownMaterial = new THREE.MeshPhysicalMaterial({
      color: new THREE.Color(0xfcfaf5),
      roughness: 0.12,
      metalness: 0.02,
      clearcoat: 1.0,
      clearcoatRoughness: 0.05,
      transmission: 0.08,
      thickness: 0.8,
      ior: 1.52,
      reflectivity: 0.95,
    });

    const cervicalMaterial = new THREE.MeshPhysicalMaterial({
      color: new THREE.Color(0xf6efe2),
      roughness: 0.22,
      metalness: 0.02,
      clearcoat: 0.7,
      clearcoatRoughness: 0.12,
    });

    const rootMaterial = new THREE.MeshPhysicalMaterial({
      color: new THREE.Color(0xf2e7d5),
      roughness: 0.28,
      metalness: 0.01,
      clearcoat: 0.4,
      clearcoatRoughness: 0.18,
    });

    const saddleMaterial = new THREE.MeshPhysicalMaterial({
      color: new THREE.Color(0xeee3ce),
      roughness: 0.26,
      metalness: 0.01,
      clearcoat: 0.45,
    });

    // 6. Instant 3D Procedural Stand-in (Zero blank flash while GLB parses)
    const proceduralStandin = new THREE.Group();
    toothGroup.add(proceduralStandin);

    const protoCrownGeo = new THREE.CylinderGeometry(1.2, 0.95, 1.2, 32);
    const protoCrown = new THREE.Mesh(protoCrownGeo, crownMaterial);
    protoCrown.position.y = 0.6;
    proceduralStandin.add(protoCrown);

    const protoCusp1 = new THREE.Mesh(new THREE.SphereGeometry(0.42, 16, 16), crownMaterial);
    protoCusp1.position.set(0.48, 1.25, 0.48);
    proceduralStandin.add(protoCusp1);

    const protoCusp2 = new THREE.Mesh(new THREE.SphereGeometry(0.42, 16, 16), crownMaterial);
    protoCusp2.position.set(-0.48, 1.25, 0.48);
    proceduralStandin.add(protoCusp2);

    const protoCusp3 = new THREE.Mesh(new THREE.SphereGeometry(0.42, 16, 16), crownMaterial);
    protoCusp3.position.set(0.48, 1.25, -0.48);
    proceduralStandin.add(protoCusp3);

    const protoCusp4 = new THREE.Mesh(new THREE.SphereGeometry(0.42, 16, 16), crownMaterial);
    protoCusp4.position.set(-0.48, 1.25, -0.48);
    proceduralStandin.add(protoCusp4);

    const protoRoot1 = new THREE.Mesh(new THREE.ConeGeometry(0.42, 1.6, 20), rootMaterial);
    protoRoot1.rotation.z = Math.PI;
    protoRoot1.rotation.x = 0.14;
    protoRoot1.position.set(0.42, -0.75, 0);
    proceduralStandin.add(protoRoot1);

    const protoRoot2 = new THREE.Mesh(new THREE.ConeGeometry(0.42, 1.6, 20), rootMaterial);
    protoRoot2.rotation.z = Math.PI;
    protoRoot2.rotation.x = -0.14;
    protoRoot2.position.set(-0.42, -0.75, 0);
    proceduralStandin.add(protoRoot2);

    // 7. Load GLB Model (/models/molar-tooth.glb)
    let gltfModel: THREE.Group | null = null;
    const loader = new GLTFLoader();

    loader.load(
      "/models/molar-tooth.glb",
      (gltf) => {
        if (destroyed) return;
        gltfModel = gltf.scene;

        // Calculate bounding box and scale to fill hero viewport
        const box = new THREE.Box3().setFromObject(gltfModel);
        const size = new THREE.Vector3();
        box.getSize(size);
        const center = new THREE.Vector3();
        box.getCenter(center);

        const maxDim = Math.max(size.x, size.y, size.z) || 1;
        const targetHeight = 4.0;
        const scale = targetHeight / maxDim;
        gltfModel.scale.setScalar(scale);

        // Center the tooth model pivot
        gltfModel.position.x = -center.x * scale;
        gltfModel.position.y = -center.y * scale;
        gltfModel.position.z = -center.z * scale;

        // Apply physical ceramic materials to each anatomical segment
        gltfModel.traverse((child) => {
          if ((child as THREE.Mesh).isMesh) {
            const mesh = child as THREE.Mesh;
            mesh.castShadow = true;
            mesh.receiveShadow = true;

            const name = mesh.name.toLowerCase();
            if (name.includes("crown") || name.includes("enamel")) {
              mesh.material = crownMaterial;
            } else if (name.includes("cervical") || name.includes("collar")) {
              mesh.material = cervicalMaterial;
            } else if (name.includes("furcation") || name.includes("saddle")) {
              mesh.material = saddleMaterial;
            } else if (name.includes("root")) {
              mesh.material = rootMaterial;
            } else {
              mesh.material = crownMaterial;
            }
          }
        });

        // Swap procedural stand-in with the real GLB model
        toothGroup.remove(proceduralStandin);
        toothGroup.add(gltfModel);
      },
      undefined,
      (err) => {
        console.warn("Using procedural 3D molar fallback:", err);
      }
    );

    // 8. Interactive Mouse & Touch Drag Controls
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
      mouseParallaxX = ((clientX - rect.left) / rect.width - 0.5) * 0.35;
      mouseParallaxY = ((clientY - rect.top) / rect.height - 0.5) * 0.25;

      if (!isDragging) return;
      const deltaX = clientX - prevMouseX;
      const deltaY = clientY - prevMouseY;
      prevMouseX = clientX;
      prevMouseY = clientY;

      dragVelocityX = deltaX * 0.0075;
      dragVelocityY = deltaY * 0.0075;

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

    // 9. Resize Handler
    const handleResize = () => {
      if (destroyed || !renderer) return;
      const { w: nw, h: nh } = getDims();
      camera.aspect = nw / nh;
      camera.updateProjectionMatrix();
      renderer.setSize(nw, nh, false);
    };

    window.addEventListener("resize", handleResize);

    // Initial render
    renderer.render(scene, camera);

    // 10. Animation Loop: Auto-Rotation, Floating, and Scroll Kinematics
    const startTime = performance.now();

    const animate = () => {
      if (destroyed) return;
      animId = requestAnimationFrame(animate);

      const elapsedTime = (performance.now() - startTime) / 1000;
      const scrollY = typeof window !== "undefined" ? window.scrollY : 0;
      const heroHeight = typeof window !== "undefined" ? window.innerHeight : 800;

      // Scroll progress relative to hero
      const scrollFraction = scrollY / Math.max(heroHeight, 1);

      // Smooth Exit Behavior: Fade out when leaving the Hero section
      if (canvas) {
        if (scrollFraction <= 0.35) {
          canvas.style.opacity = "1";
          canvas.style.visibility = "visible";
        } else if (scrollFraction < 1.0) {
          const fade = 1 - (scrollFraction - 0.35) / 0.65;
          canvas.style.opacity = Math.max(0, fade).toFixed(3);
          canvas.style.visibility = "visible";
        } else {
          canvas.style.opacity = "0";
          canvas.style.visibility = "hidden";
          // When completely past Hero, pause GPU draw calls
          return;
        }
      }

      // Smooth idle auto-rotation & inertia damping
      if (!isDragging) {
        dragVelocityX *= 0.92;
        dragVelocityY *= 0.92;
        toothGroup.rotation.y += dragVelocityX + 0.007; // Continuous auto-rotation
        toothGroup.rotation.x += dragVelocityY;
      }

      // Subtle breathing float in 3D space
      toothGroup.position.y = Math.sin(elapsedTime * 1.4) * 0.07;

      // Dynamic scroll trigger rotation: turns and tilts subtly with scroll
      const scrollRotY = scrollY * 0.0016;
      const scrollTiltX = Math.sin(scrollY * 0.002) * 0.15;

      rootGroup.rotation.y = mouseParallaxX + scrollRotY;
      rootGroup.rotation.x = -mouseParallaxY + scrollTiltX;

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

      crownMaterial.dispose();
      cervicalMaterial.dispose();
      rootMaterial.dispose();
      saddleMaterial.dispose();

      protoCrownGeo.dispose();

      toothGroup.traverse((obj) => {
        if ((obj as THREE.Mesh).isMesh) {
          const mesh = obj as THREE.Mesh;
          mesh.geometry?.dispose();
        }
      });

      renderer?.dispose();
      renderer?.forceContextLoss();
    };
  }, []);

  return (
    <div 
      ref={containerRef}
      className={`relative w-full h-full flex items-center justify-center select-none bg-transparent overflow-visible pointer-events-auto ${className}`}
    >
      {/* Delicate warm radial aura seamlessly matching hero luxury atmosphere */}
      <div 
        className="absolute inset-0 pointer-events-none rounded-full blur-[90px] opacity-25"
        style={{
          background: "radial-gradient(circle at center, #D8AE98 0%, #A09B7C 35%, transparent 70%)"
        }}
      />
      <canvas
        ref={canvasRef}
        className="relative w-full h-full block bg-transparent cursor-grab active:cursor-grabbing z-10 transition-opacity duration-300"
        style={{ opacity: 1 }}
        aria-label="مدل سه‌بعدی دندان در هیرو"
      />
    </div>
  );
}
