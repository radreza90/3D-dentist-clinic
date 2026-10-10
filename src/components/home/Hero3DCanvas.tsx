"use client";

import { useEffect, useRef } from "react";
import * as THREE from "three";
import { Sparkles } from "lucide-react";

export function Hero3DCanvas() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    let destroyed = false;
    let animId: number;

    // Check dimensions safely
    const getDims = () => {
      const rect = canvas.getBoundingClientRect();
      const w = Math.max(Math.floor(rect.width || canvas.clientWidth || 520), 300);
      const h = Math.max(Math.floor(rect.height || canvas.clientHeight || 560), 380);
      return { w, h };
    };

    // Shared interaction variables
    let mouseX = 0;
    let mouseY = 0;
    let targetRotX = 0;
    let targetRotY = 0;
    let scrollY = 0;

    const onMouseMove = (e: MouseEvent) => {
      if (destroyed || !canvas) return;
      const rect = canvas.getBoundingClientRect();
      if (!rect.width || !rect.height) return;
      const rawX = (e.clientX - rect.left) / rect.width - 0.5;
      const rawY = (e.clientY - rect.top) / rect.height - 0.5;
      if (!Number.isNaN(rawX) && !Number.isNaN(rawY)) {
        mouseX = Math.max(-1.5, Math.min(1.5, rawX * 2.2));
        mouseY = Math.max(-1.5, Math.min(1.5, rawY * 2.2));
      }
    };

    const onScroll = () => {
      if (destroyed) return;
      const sy = window.scrollY || document.documentElement.scrollTop || 0;
      scrollY = Number.isNaN(sy) ? 0 : sy;
    };

    window.addEventListener("mousemove", onMouseMove, { passive: true });
    window.addEventListener("scroll", onScroll, { passive: true });

    // =========================================================
    // Attempt 1: True Hardware-Accelerated Three.js WebGL
    // =========================================================
    let renderer: THREE.WebGLRenderer | null = null;
    let scene: THREE.Scene | null = null;
    let camera: THREE.PerspectiveCamera | null = null;
    const geometriesToDispose: THREE.BufferGeometry[] = [];
    const materialsToDispose: THREE.Material[] = [];

    try {
      renderer = new THREE.WebGLRenderer({
        canvas,
        antialias: true,
        alpha: true,
        powerPreference: "default",
      });
      renderer.setPixelRatio(Math.min(typeof window !== "undefined" ? window.devicePixelRatio : 1, 2));
      renderer.toneMapping = THREE.ACESFilmicToneMapping;
      renderer.toneMappingExposure = 1.15;
      
      const { w, h } = getDims();
      renderer.setSize(w, h, false);

      scene = new THREE.Scene();
      camera = new THREE.PerspectiveCamera(40, w / h, 0.1, 100);
      camera.position.set(0, 0, 7.4);

      // Root Group
      const mainGroup = new THREE.Group();
      scene.add(mainGroup);

      // Tooth Group
      const toothGroup = new THREE.Group();
      mainGroup.add(toothGroup);

      // 1. Sculpted Molar Crown Geometry with anatomical cusps
      const crownGeo = new THREE.CylinderGeometry(1.35, 1.05, 1.45, 48, 24, false);
      const pos = crownGeo.attributes.position;
      const v = new THREE.Vector3();

      for (let i = 0; i < pos.count; i++) {
        v.fromBufferAttribute(pos, i);
        const y = v.y;
        const angle = Math.atan2(v.z, v.x);
        const radius = Math.sqrt(v.x * v.x + v.z * v.z);

        if (y > 0.3) {
          const topFactor = (y - 0.3) / 0.42;
          const cuspWave = Math.sin(angle * 2) * 0.26 * topFactor;
          const fissure = Math.exp(-radius * radius * 3.8) * 0.3 * topFactor;
          v.y += cuspWave - fissure;
          v.x *= 1.0 + Math.sin(angle * 4) * 0.04;
          v.z *= 1.0 + Math.cos(angle * 4) * 0.04;
        } else if (y < -0.2) {
          const neckFactor = (-y - 0.2) / 0.52;
          v.x *= 1.0 - neckFactor * 0.24;
          v.z *= 1.0 - neckFactor * 0.24;
        }
        pos.setXYZ(i, v.x, v.y, v.z);
      }
      crownGeo.computeVertexNormals();
      geometriesToDispose.push(crownGeo);

      // Luxury Dental Porcelain Enamel Material with rich depth & contrast
      const enamelMaterial = new THREE.MeshStandardMaterial({
        color: 0xf5f0e8,
        roughness: 0.22,
        metalness: 0.12,
      });
      materialsToDispose.push(enamelMaterial);

      const crownMesh = new THREE.Mesh(crownGeo, enamelMaterial);
      crownMesh.position.y = 0.5;
      toothGroup.add(crownMesh);

      // Gold / Rose-Gold Cervical Ring (Digital implant luxury abutment collar)
      const collarGeo = new THREE.TorusGeometry(1.02, 0.045, 16, 48);
      geometriesToDispose.push(collarGeo);
      const collarMaterial = new THREE.MeshStandardMaterial({
        color: 0xd8ae98,
        metalness: 0.92,
        roughness: 0.2,
      });
      materialsToDispose.push(collarMaterial);
      const collarMesh = new THREE.Mesh(collarGeo, collarMaterial);
      collarMesh.rotation.x = Math.PI / 2;
      collarMesh.position.y = -0.22;
      toothGroup.add(collarMesh);

      // Anatomical Dual Roots
      const root1Geo = new THREE.ConeGeometry(0.52, 1.65, 32, 16);
      const r1Pos = root1Geo.attributes.position;
      for (let i = 0; i < r1Pos.count; i++) {
        v.fromBufferAttribute(r1Pos, i);
        v.x += (v.y - 0.8) * 0.14;
        r1Pos.setXYZ(i, v.x, v.y, v.z);
      }
      root1Geo.computeVertexNormals();
      geometriesToDispose.push(root1Geo);
      const root1Mesh = new THREE.Mesh(root1Geo, enamelMaterial);
      root1Mesh.rotation.z = Math.PI;
      root1Mesh.position.set(-0.52, -0.75, 0.08);
      root1Mesh.rotation.y = 0.25;
      toothGroup.add(root1Mesh);

      const root2Geo = new THREE.ConeGeometry(0.5, 1.55, 32, 16);
      const r2Pos = root2Geo.attributes.position;
      for (let i = 0; i < r2Pos.count; i++) {
        v.fromBufferAttribute(r2Pos, i);
        v.x -= (v.y - 0.8) * 0.12;
        r2Pos.setXYZ(i, v.x, v.y, v.z);
      }
      root2Geo.computeVertexNormals();
      geometriesToDispose.push(root2Geo);
      const root2Mesh = new THREE.Mesh(root2Geo, enamelMaterial);
      root2Mesh.rotation.z = Math.PI;
      root2Mesh.position.set(0.52, -0.7, -0.08);
      root2Mesh.rotation.y = -0.25;
      toothGroup.add(root2Mesh);

      // 2. High-End Metallic Orbital Rings
      const ring1Geo = new THREE.TorusGeometry(2.35, 0.026, 16, 96);
      geometriesToDispose.push(ring1Geo);
      const ring1Material = new THREE.MeshStandardMaterial({
        color: 0xd8ae98,
        metalness: 0.95,
        roughness: 0.18,
      });
      materialsToDispose.push(ring1Material);
      const ring1 = new THREE.Mesh(ring1Geo, ring1Material);
      ring1.rotation.x = Math.PI / 3;
      ring1.rotation.y = Math.PI / 6;
      mainGroup.add(ring1);

      const ring2Geo = new THREE.TorusGeometry(2.75, 0.02, 16, 96);
      geometriesToDispose.push(ring2Geo);
      const ring2Material = new THREE.MeshStandardMaterial({
        color: 0xa09b7c,
        metalness: 0.9,
        roughness: 0.22,
      });
      materialsToDispose.push(ring2Material);
      const ring2 = new THREE.Mesh(ring2Geo, ring2Material);
      ring2.rotation.x = -Math.PI / 4;
      ring2.rotation.z = Math.PI / 5;
      mainGroup.add(ring2);

      // 3. Ethereal Warm Luminous Particle Field
      const particleCount = 200;
      const particleGeo = new THREE.BufferGeometry();
      const particleCoords = new Float32Array(particleCount * 3);
      const particleColors = new Float32Array(particleCount * 3);
      const c1 = new THREE.Color("#A09B7C");
      const c2 = new THREE.Color("#D8AE98");

      for (let i = 0; i < particleCount; i++) {
        const theta = Math.random() * Math.PI * 2;
        const phi = Math.acos(Math.random() * 2 - 1);
        const rad = 2.2 + Math.random() * 2.6;

        particleCoords[i * 3] = rad * Math.sin(phi) * Math.cos(theta);
        particleCoords[i * 3 + 1] = rad * Math.sin(phi) * Math.sin(theta);
        particleCoords[i * 3 + 2] = rad * Math.cos(phi);

        const mixed = Math.random() > 0.5 ? c1 : c2;
        particleColors[i * 3] = mixed.r;
        particleColors[i * 3 + 1] = mixed.g;
        particleColors[i * 3 + 2] = mixed.b;
      }

      particleGeo.setAttribute("position", new THREE.BufferAttribute(particleCoords, 3));
      particleGeo.setAttribute("color", new THREE.BufferAttribute(particleColors, 3));
      geometriesToDispose.push(particleGeo);

      const particleMat = new THREE.PointsMaterial({
        size: 0.07,
        vertexColors: true,
        transparent: true,
        opacity: 0.8,
      });
      materialsToDispose.push(particleMat);

      const particles = new THREE.Points(particleGeo, particleMat);
      mainGroup.add(particles);

      // 4. Studio Lighting Rig for Rich Contrast
      const keyLight = new THREE.DirectionalLight(0xfff5ea, 3.2);
      keyLight.position.set(4, 5, 4.5);
      scene.add(keyLight);

      const fillLight = new THREE.DirectionalLight(0xf4e2d4, 2.0);
      fillLight.position.set(-4, -2, 3);
      scene.add(fillLight);

      const rimLight = new THREE.DirectionalLight(0xa09b7c, 3.6);
      rimLight.position.set(0, 4, -4);
      scene.add(rimLight);

      const bottomLight = new THREE.DirectionalLight(0xd8ae98, 1.4);
      bottomLight.position.set(0, -4, 2);
      scene.add(bottomLight);

      const ambientLight = new THREE.AmbientLight(0x504838, 1.4);
      scene.add(ambientLight);

      // Handle Resizing
      const onResize = () => {
        if (destroyed || !renderer || !camera || !canvas) return;
        const { w, h } = getDims();
        camera.aspect = w / h;
        camera.updateProjectionMatrix();
        renderer.setSize(w, h, false);
      };

      window.addEventListener("resize", onResize);

      // Animation Loop for Three.js
      const clock = new THREE.Clock();

      const animateWebGL = () => {
        if (destroyed || !renderer || !scene || !camera) return;
        animId = requestAnimationFrame(animateWebGL);

        const elapsedTime = clock.getElapsedTime();

        // Mouse tracking interpolation with NaN protection
        const validMouseX = Number.isNaN(mouseX) ? 0 : mouseX;
        const validMouseY = Number.isNaN(mouseY) ? 0 : mouseY;
        targetRotY += (validMouseX * 0.7 - targetRotY) * 0.05;
        targetRotX += (validMouseY * 0.45 - targetRotX) * 0.05;

        // Scroll progression: rotates 3D model gracefully with mouse scroll
        const validScroll = Number.isNaN(scrollY) ? 0 : scrollY;
        const scrollRotation = validScroll * 0.0032;
        const scrollOffsetY = Math.min(validScroll * 0.0028, 2.2);

        // Model movement
        toothGroup.rotation.y = elapsedTime * 0.28 + targetRotY + scrollRotation;
        toothGroup.rotation.x = Math.sin(elapsedTime * 0.5) * 0.07 + targetRotX;
        toothGroup.position.y = Math.sin(elapsedTime * 0.85) * 0.1 - scrollOffsetY;

        ring1.rotation.z = elapsedTime * 0.16 + scrollRotation * 0.5;
        ring2.rotation.z = -elapsedTime * 0.14 - scrollRotation * 0.3;
        particles.rotation.y = elapsedTime * 0.05 + scrollRotation * 0.2;

        renderer.render(scene, camera);
      };

      animateWebGL();

      return () => {
        destroyed = true;
        cancelAnimationFrame(animId);
        window.removeEventListener("mousemove", onMouseMove);
        window.removeEventListener("scroll", onScroll);
        window.removeEventListener("resize", onResize);

        geometriesToDispose.forEach((g) => g.dispose());
        materialsToDispose.forEach((m) => m.dispose());
        renderer?.dispose();
      };

    } catch {
      // If WebGL fails to create context, proceed seamlessly to fallback
      renderer = null;
    }

    // =========================================================
    // Attempt 2: High-Fidelity Procedural 2.5D Canvas Engine
    // (Active if WebGL is disabled or restricted in iframe)
    // =========================================================
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let t = 0;

    const render2D = () => {
      if (destroyed) return;
      animId = requestAnimationFrame(render2D);
      t += 0.025;

      const { w, h } = getDims();
      if (canvas.width !== w || canvas.height !== h) {
        canvas.width = w;
        canvas.height = h;
      }

      ctx.clearRect(0, 0, w, h);

      const validMouseX = Number.isNaN(mouseX) ? 0 : mouseX;
      const validMouseY = Number.isNaN(mouseY) ? 0 : mouseY;
      const validScroll = Number.isNaN(scrollY) ? 0 : scrollY;

      const cx = w / 2 + validMouseX * 28;
      const cy = h / 2 + Math.sin(t * 0.8) * 12 + validMouseY * 20 - Math.min(validScroll * 0.15, 60);

      // 1. Soft Ambient Radial Glow
      const ambientGrad = ctx.createRadialGradient(cx, cy, 20, cx, cy, 210);
      ambientGrad.addColorStop(0, "rgba(216, 174, 152, 0.45)");
      ambientGrad.addColorStop(0.45, "rgba(160, 155, 124, 0.22)");
      ambientGrad.addColorStop(1, "rgba(160, 155, 124, 0)");
      ctx.fillStyle = ambientGrad;
      ctx.beginPath();
      ctx.arc(cx, cy, 210, 0, Math.PI * 2);
      ctx.fill();

      // 2. Metallic Orbit Ring 1 (Rose Gold)
      ctx.save();
      ctx.translate(cx, cy);
      ctx.rotate(t * 0.18 + validScroll * 0.002);
      ctx.beginPath();
      ctx.ellipse(0, 0, 160, 52, Math.PI / 4, 0, Math.PI * 2);
      ctx.strokeStyle = "rgba(216, 174, 152, 0.85)";
      ctx.lineWidth = 3;
      ctx.stroke();
      ctx.restore();

      // 3. Metallic Orbit Ring 2 (Olive Khaki)
      ctx.save();
      ctx.translate(cx, cy);
      ctx.rotate(-t * 0.14 - validScroll * 0.0015);
      ctx.beginPath();
      ctx.ellipse(0, 0, 185, 44, -Math.PI / 3, 0, Math.PI * 2);
      ctx.strokeStyle = "rgba(160, 155, 124, 0.75)";
      ctx.lineWidth = 2.5;
      ctx.stroke();
      ctx.restore();

      // 4. Floating Warm Luminous Particles
      for (let i = 0; i < 24; i++) {
        const pAngle = t * 0.35 + (i * Math.PI * 2) / 24;
        const pRad = 120 + Math.sin(t * 1.2 + i) * 32;
        const px = cx + Math.cos(pAngle) * pRad;
        const py = cy + Math.sin(pAngle) * (pRad * 0.55);

        ctx.fillStyle = i % 2 === 0 ? "rgba(216, 174, 152, 0.9)" : "rgba(160, 155, 124, 0.9)";
        ctx.beginPath();
        ctx.arc(px, py, 2.5 + Math.sin(t * 2 + i) * 1.2, 0, Math.PI * 2);
        ctx.fill();
      }

      // 5. 3D-Shaded Anatomical Tooth Sculpture
      ctx.save();
      ctx.translate(cx, cy);

      // Floor Drop Shadow
      ctx.fillStyle = "rgba(48, 42, 33, 0.1)";
      ctx.beginPath();
      ctx.ellipse(0, 105, 75, 18, 0, 0, Math.PI * 2);
      ctx.fill();

      // Tooth Roots
      const rootGrad = ctx.createLinearGradient(0, 0, 0, 95);
      rootGrad.addColorStop(0, "#FCFAF6");
      rootGrad.addColorStop(1, "#D6CFBD");
      ctx.fillStyle = rootGrad;

      // Mesial Root
      ctx.beginPath();
      ctx.moveTo(-36, 12);
      ctx.quadraticCurveTo(-48, 65, -24, 92);
      ctx.quadraticCurveTo(-15, 65, -10, 16);
      ctx.closePath();
      ctx.fill();

      // Distal Root
      ctx.beginPath();
      ctx.moveTo(36, 12);
      ctx.quadraticCurveTo(48, 65, 24, 92);
      ctx.quadraticCurveTo(15, 65, 10, 16);
      ctx.closePath();
      ctx.fill();

      // Gold Abutment Collar Accent
      ctx.strokeStyle = "rgba(216, 174, 152, 0.95)";
      ctx.lineWidth = 4;
      ctx.beginPath();
      ctx.ellipse(0, 16, 42, 10, 0, 0, Math.PI * 2);
      ctx.stroke();

      // Tooth Crown
      const crownGrad = ctx.createLinearGradient(-45, -75, 55, 25);
      crownGrad.addColorStop(0, "#FFFFFF");
      crownGrad.addColorStop(0.35, "#FAF7F0");
      crownGrad.addColorStop(0.75, "#E8E2D5");
      crownGrad.addColorStop(1, "#CCC5B2");
      ctx.fillStyle = crownGrad;

      ctx.beginPath();
      ctx.moveTo(-54, -20);
      // Left cusp
      ctx.bezierCurveTo(-62, -70, -28, -80, -16, -65);
      // Central fissure
      ctx.bezierCurveTo(-6, -55, 6, -55, 16, -65);
      // Right cusp
      ctx.bezierCurveTo(28, -80, 62, -70, 54, -20);
      // Bottom contour
      ctx.bezierCurveTo(52, 22, 26, 28, 0, 22);
      ctx.bezierCurveTo(-26, 28, -52, 22, -54, -20);
      ctx.closePath();
      ctx.fill();

      // Enamel Specular Highlights
      ctx.strokeStyle = "rgba(255, 255, 255, 0.95)";
      ctx.lineWidth = 3.5;
      ctx.beginPath();
      ctx.arc(-22, -48, 16, 0.2, Math.PI * 0.9);
      ctx.stroke();

      ctx.lineWidth = 2.5;
      ctx.beginPath();
      ctx.arc(22, -48, 14, 0.2, Math.PI * 0.9);
      ctx.stroke();

      ctx.restore();
    };

    render2D();

    return () => {
      destroyed = true;
      cancelAnimationFrame(animId);
      window.removeEventListener("mousemove", onMouseMove);
      window.removeEventListener("scroll", onScroll);
    };
  }, []);

  return (
    <div className="relative w-full h-[460px] sm:h-[540px] lg:h-[620px] flex items-center justify-center select-none">
      
      {/* Warm Ambient Backdrop Glow */}
      <div 
        className="absolute inset-0 pointer-events-none rounded-full blur-[120px] opacity-40"
        style={{
          background: "radial-gradient(circle at center, #D8AE98 0%, #A09B7C 45%, transparent 70%)"
        }}
      />
      
      {/* 3D Canvas Element */}
      <canvas
        ref={canvasRef}
        className="relative w-full h-full max-w-[580px] max-h-[580px] cursor-grab active:cursor-grabbing z-10 block"
        aria-label="مجسمه سه‌بعدی تعاملی دندانپزشکی دیجیتال"
      />

      {/* Floating 3D Interaction Cue */}
      <div className="absolute bottom-3 sm:bottom-6 z-20 pointer-events-none">
        <div className="px-4 py-2 rounded-full bg-[#FCFAF6]/90 backdrop-blur-md shadow-[0_4px_24px_rgba(48,42,33,0.08)] text-[11px] sm:text-xs font-medium text-[#817C70] flex items-center gap-2 border border-[#E8E2D5]/60">
          <Sparkles className="w-3.5 h-3.5 text-[#A09B7C] animate-pulse" />
          <span>مدل سه‌بعدی تعاملی · با ماوس یا اسکرول حرکت دهید</span>
        </div>
      </div>

    </div>
  );
}
