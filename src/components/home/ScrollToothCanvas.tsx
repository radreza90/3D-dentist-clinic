"use client";

import { useEffect, useRef } from "react";
import * as THREE from "three";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader.js";

interface ScrollToothCanvasProps {
  className?: string;
}

export function ScrollToothCanvas({ className = "" }: ScrollToothCanvasProps) {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    let destroyed = false;
    let animId: number;

    // Safety: ensure no duplicate canvas elements on re-mount
    while (container.firstChild) {
      container.removeChild(container.firstChild);
    }

    // Measure container bounds
    const rect = container.getBoundingClientRect();
    const w = Math.max(Math.floor(rect.width || 560), 300);
    const h = Math.max(Math.floor(rect.height || 560), 300);

    // 1. Initialize WebGL Renderer
    let renderer: THREE.WebGLRenderer;
    try {
      renderer = new THREE.WebGLRenderer({
        antialias: true,
        alpha: true,
        powerPreference: "high-performance",
      });
      renderer.setClearColor(0x000000, 0); // Transparent background
      renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2));
      renderer.setSize(w, h, true);
      renderer.toneMapping = THREE.ACESFilmicToneMapping;
      renderer.toneMappingExposure = 1.35;
    } catch (e) {
      console.error("WebGL Renderer initialization error:", e);
      return;
    }

    const canvas = renderer.domElement;
    canvas.className = "relative z-10 w-full h-full block bg-transparent cursor-grab active:cursor-grabbing transition-opacity duration-300";
    canvas.setAttribute("aria-label", "مدل سه‌بعدی دندان کلینیک");
    container.appendChild(canvas);

    // Prevent default context lost handler
    const onContextLost = (e: Event) => {
      e.preventDefault();
    };
    canvas.addEventListener("webglcontextlost", onContextLost);

    // 2. Scene & Camera Setup
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(36, w / h, 0.1, 100);
    camera.position.set(0, 0, 7.2);

    const rootGroup = new THREE.Group();
    scene.add(rootGroup);

    const toothGroup = new THREE.Group();
    rootGroup.add(toothGroup);


    // Initial natural anatomical orientation
    toothGroup.rotation.x = 0.12;
    toothGroup.rotation.y = -0.25;

    // 3. Studio Multi-Light Rig (Opaque Ceramic Enamel with Sculpted 3D Depth)
    const ambientLight = new THREE.AmbientLight(0xfff8ee, 1.8);
    scene.add(ambientLight);

    // Front-Key Light - bright studio illumination
    const keyLight = new THREE.DirectionalLight(0xfffaf0, 3.6);
    keyLight.position.set(4, 5, 4.5);
    scene.add(keyLight);

    // Fill Light - soft operatory fill
    const fillLight = new THREE.DirectionalLight(0xe8f0f8, 2.2);
    fillLight.position.set(-4, 2, 3.5);
    scene.add(fillLight);

    // Frontal Direct Fill - ensures front geometry is crisp and bright
    const frontLight = new THREE.DirectionalLight(0xfffdfa, 2.0);
    frontLight.position.set(0, 0, 6);
    scene.add(frontLight);

    // Rim Light - rose gold / bronze luminous edge outline
    const rimLight = new THREE.DirectionalLight(0xd8ae98, 4.2);
    rimLight.position.set(1.5, -2, -5);
    scene.add(rimLight);

    // Top Crown Highlight - highlights anatomical occlusal cusps and grooves
    const topAccent = new THREE.PointLight(0xffffff, 2.4, 14);
    topAccent.position.set(0, 4.5, 1.5);
    scene.add(topAccent);

    // Bottom Root Highlight
    const bottomAccent = new THREE.DirectionalLight(0xf2e8dc, 1.5);
    bottomAccent.position.set(0, -4, 2);
    scene.add(bottomAccent);

    // 4. Solid Ceramic Enamel Materials (Opaque, high-gloss clearcoat glaze)
    const crownMaterial = new THREE.MeshPhysicalMaterial({
      color: new THREE.Color(0xfcfaf5),
      roughness: 0.14,
      metalness: 0.02,
      clearcoat: 1.0,
      clearcoatRoughness: 0.06,
      reflectivity: 0.95,
    });

    const cervicalMaterial = new THREE.MeshStandardMaterial({
      color: new THREE.Color(0xf5ede0),
      roughness: 0.25,
      metalness: 0.02,
    });

    const rootMaterial = new THREE.MeshStandardMaterial({
      color: new THREE.Color(0xf0e4d2),
      roughness: 0.32,
      metalness: 0.01,
    });

    const saddleMaterial = new THREE.MeshStandardMaterial({
      color: new THREE.Color(0xebdcc7),
      roughness: 0.3,
      metalness: 0.01,
    });

    // 5. Instant 3D Procedural Stand-in (Zero blank flash while GLB parses)
    const proceduralStandin = new THREE.Group();
    toothGroup.add(proceduralStandin);

    const protoCrownGeo = new THREE.CylinderGeometry(1.2, 0.95, 1.2, 32);
    const protoCrown = new THREE.Mesh(protoCrownGeo, crownMaterial);
    protoCrown.position.y = 0.6;
    proceduralStandin.add(protoCrown);

    const cuspGeo = new THREE.SphereGeometry(0.42, 16, 16);
    const cusp1 = new THREE.Mesh(cuspGeo, crownMaterial);
    cusp1.position.set(0.48, 1.25, 0.48);
    proceduralStandin.add(cusp1);

    const cusp2 = new THREE.Mesh(cuspGeo, crownMaterial);
    cusp2.position.set(-0.48, 1.25, 0.48);
    proceduralStandin.add(cusp2);

    const cusp3 = new THREE.Mesh(cuspGeo, crownMaterial);
    cusp3.position.set(0.48, 1.25, -0.48);
    proceduralStandin.add(cusp3);

    const cusp4 = new THREE.Mesh(cuspGeo, crownMaterial);
    cusp4.position.set(-0.48, 1.25, -0.48);
    proceduralStandin.add(cusp4);

    const rootGeo1 = new THREE.ConeGeometry(0.42, 1.6, 20);
    const protoRoot1 = new THREE.Mesh(rootGeo1, rootMaterial);
    protoRoot1.rotation.z = Math.PI;
    protoRoot1.rotation.x = 0.14;
    protoRoot1.position.set(0.42, -0.75, 0);
    proceduralStandin.add(protoRoot1);

    const protoRoot2 = new THREE.Mesh(rootGeo1, rootMaterial);
    protoRoot2.rotation.z = Math.PI;
    protoRoot2.rotation.x = -0.14;
    protoRoot2.position.set(-0.42, -0.75, 0);
    proceduralStandin.add(protoRoot2);

    // 6. Robust GLB Fetch & Parse (/models/molar-tooth.glb)
    const loader = new GLTFLoader();
    const modelFullUrl = typeof window !== "undefined" 
      ? new URL("/models/molar-tooth.glb", window.location.href).href 
      : "/models/molar-tooth.glb";

    fetch(modelFullUrl)
      .then((res) => {
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        return res.arrayBuffer();
      })
      .then((buffer) => {
        if (destroyed) return;
        loader.parse(
          buffer,
          "",
          (gltf) => {
            if (destroyed) return;
            const gltfModel = gltf.scene;

            // Bounding box normalization
            const box = new THREE.Box3().setFromObject(gltfModel);
            const size = new THREE.Vector3();
            box.getSize(size);
            const center = new THREE.Vector3();
            box.getCenter(center);

            const maxDim = Math.max(size.x, size.y, size.z) || 1;
            const targetHeight = 4.2;
            const scale = targetHeight / maxDim;
            gltfModel.scale.setScalar(scale);

            // Center pivot
            gltfModel.position.x = -center.x * scale;
            gltfModel.position.y = -center.y * scale;
            gltfModel.position.z = -center.z * scale;

            // Apply ceramic materials to each anatomical segment
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

            // Swap procedural stand-in with real GLB model
            toothGroup.remove(proceduralStandin);
            toothGroup.add(gltfModel);
          },
          (err) => {
            console.warn("GLTF parse error:", err);
          }
        );
      })
      .catch((err) => {
        console.warn("GLB fetch error, using procedural standin:", err);
      });

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

      const r = container.getBoundingClientRect();
      mouseParallaxX = ((clientX - r.left) / r.width - 0.5) * 0.35;
      mouseParallaxY = ((clientY - r.top) / r.height - 0.5) * 0.25;

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

    // 8. Resize Handler
    const handleResize = () => {
      if (destroyed || !renderer) return;
      const r = container.getBoundingClientRect();
      const nw = Math.max(Math.floor(r.width), 300);
      const nh = Math.max(Math.floor(r.height), 300);
      camera.aspect = nw / nh;
      camera.updateProjectionMatrix();
      renderer.setSize(nw, nh, true);
    };

    window.addEventListener("resize", handleResize);

    // Initial render
    renderer.render(scene, camera);

    // 9. Animation Loop: Auto-Rotation, Floating, and Scroll Kinematics
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
          return; // pause GPU draw calls outside hero
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
      canvas.removeEventListener("webglcontextlost", onContextLost);

      crownMaterial.dispose();
      cervicalMaterial.dispose();
      rootMaterial.dispose();
      saddleMaterial.dispose();

      protoCrownGeo.dispose();
      cuspGeo.dispose();
      rootGeo1.dispose();

      toothGroup.traverse((obj) => {
        if ((obj as THREE.Mesh).isMesh) {
          const mesh = obj as THREE.Mesh;
          mesh.geometry?.dispose();
        }
      });

      renderer.dispose();
      if (container.contains(canvas)) {
        container.removeChild(canvas);
      }
    };
  }, []);

  return (
    <div 
      ref={containerRef}
      className={`relative w-full h-full flex items-center justify-center select-none bg-transparent overflow-visible pointer-events-auto ${className}`}
    />
  );
}
