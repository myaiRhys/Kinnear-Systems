"use client";

import { useEffect, useRef } from "react";
import * as THREE from "three";

const PARTICLE_COUNT = 120;
const GRID_SIZE = 40;
const GRID_DIVISIONS = 40;
const CUBE_SIZE = 2.5;

export default function ThreeScene() {
  const containerRef = useRef<HTMLDivElement>(null);
  const mouseRef = useRef({ x: 0, y: 0 });
  const frameRef = useRef<number>(0);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    // ─── Scene setup ───
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(
      60,
      container.clientWidth / container.clientHeight,
      0.1,
      100
    );
    camera.position.set(0, 5, 12);
    camera.lookAt(0, 0, 0);

    const renderer = new THREE.WebGLRenderer({
      antialias: false,
      alpha: true,
      powerPreference: "high-performance",
    });
    renderer.setSize(container.clientWidth, container.clientHeight);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.setClearColor(0x000000, 0);
    container.appendChild(renderer.domElement);

    // ─── Animated grid ───
    const gridGroup = new THREE.Group();
    const gridMaterial = new THREE.LineBasicMaterial({
      color: 0x00ffff,
      transparent: true,
      opacity: 0.06,
    });

    const halfSize = GRID_SIZE / 2;
    const step = GRID_SIZE / GRID_DIVISIONS;

    // Horizontal lines
    for (let i = 0; i <= GRID_DIVISIONS; i++) {
      const z = -halfSize + i * step;
      const geometry = new THREE.BufferGeometry().setFromPoints([
        new THREE.Vector3(-halfSize, 0, z),
        new THREE.Vector3(halfSize, 0, z),
      ]);
      gridGroup.add(new THREE.Line(geometry, gridMaterial));
    }

    // Vertical lines
    for (let i = 0; i <= GRID_DIVISIONS; i++) {
      const x = -halfSize + i * step;
      const geometry = new THREE.BufferGeometry().setFromPoints([
        new THREE.Vector3(x, 0, -halfSize),
        new THREE.Vector3(x, 0, halfSize),
      ]);
      gridGroup.add(new THREE.Line(geometry, gridMaterial));
    }

    gridGroup.position.y = -3;
    scene.add(gridGroup);

    // ─── Floating particles ───
    const particleGeometry = new THREE.BufferGeometry();
    const positions = new Float32Array(PARTICLE_COUNT * 3);
    const velocities = new Float32Array(PARTICLE_COUNT * 3);
    const basePositions = new Float32Array(PARTICLE_COUNT * 3);

    for (let i = 0; i < PARTICLE_COUNT; i++) {
      const i3 = i * 3;
      positions[i3] = (Math.random() - 0.5) * 20;
      positions[i3 + 1] = (Math.random() - 0.5) * 14;
      positions[i3 + 2] = (Math.random() - 0.5) * 10;

      basePositions[i3] = positions[i3];
      basePositions[i3 + 1] = positions[i3 + 1];
      basePositions[i3 + 2] = positions[i3 + 2];

      velocities[i3] = (Math.random() - 0.5) * 0.005;
      velocities[i3 + 1] = (Math.random() - 0.5) * 0.005;
      velocities[i3 + 2] = (Math.random() - 0.5) * 0.003;
    }

    particleGeometry.setAttribute(
      "position",
      new THREE.BufferAttribute(positions, 3)
    );

    const particleMaterial = new THREE.PointsMaterial({
      color: 0x00ffff,
      size: 0.04,
      transparent: true,
      opacity: 0.6,
      sizeAttenuation: true,
    });

    const particles = new THREE.Points(particleGeometry, particleMaterial);
    scene.add(particles);

    // ─── Wireframe cube ───
    const cubeGeometry = new THREE.BoxGeometry(
      CUBE_SIZE,
      CUBE_SIZE,
      CUBE_SIZE
    );
    const edgesGeometry = new THREE.EdgesGeometry(cubeGeometry);
    const cubeMaterial = new THREE.LineBasicMaterial({
      color: 0x00ffff,
      transparent: true,
      opacity: 0.2,
    });
    const wireframeCube = new THREE.LineSegments(edgesGeometry, cubeMaterial);
    wireframeCube.position.set(6, 1, -2);
    scene.add(wireframeCube);

    // Inner cube for depth
    const innerCubeGeometry = new THREE.BoxGeometry(
      CUBE_SIZE * 0.5,
      CUBE_SIZE * 0.5,
      CUBE_SIZE * 0.5
    );
    const innerEdgesGeometry = new THREE.EdgesGeometry(innerCubeGeometry);
    const innerCubeMaterial = new THREE.LineBasicMaterial({
      color: 0x00ffff,
      transparent: true,
      opacity: 0.1,
    });
    const innerCube = new THREE.LineSegments(
      innerEdgesGeometry,
      innerCubeMaterial
    );
    wireframeCube.add(innerCube);

    // ─── Mouse tracking ───
    const handleMouseMove = (e: MouseEvent) => {
      mouseRef.current.x = (e.clientX / window.innerWidth) * 2 - 1;
      mouseRef.current.y = -(e.clientY / window.innerHeight) * 2 + 1;
    };
    window.addEventListener("mousemove", handleMouseMove, { passive: true });

    // ─── Resize handler ───
    const handleResize = () => {
      if (!container) return;
      const w = container.clientWidth;
      const h = container.clientHeight;
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
      renderer.setSize(w, h);
    };
    window.addEventListener("resize", handleResize, { passive: true });

    // ─── Animation loop ───
    const clock = new THREE.Clock();

    const animate = () => {
      frameRef.current = requestAnimationFrame(animate);
      const elapsed = clock.getElapsedTime();
      const mouse = mouseRef.current;

      // Rotate wireframe cube slowly
      wireframeCube.rotation.x = elapsed * 0.15;
      wireframeCube.rotation.y = elapsed * 0.2;

      // Counter-rotate inner cube
      innerCube.rotation.x = -elapsed * 0.3;
      innerCube.rotation.y = -elapsed * 0.25;

      // Pulse cube opacity
      cubeMaterial.opacity = 0.15 + Math.sin(elapsed * 0.8) * 0.08;

      // Animate grid (subtle wave)
      gridGroup.children.forEach((line, i) => {
        const offset = i * 0.1;
        (line as THREE.Line).position.y =
          Math.sin(elapsed * 0.5 + offset) * 0.1;
      });

      // Animate particles with mouse influence
      const posAttr = particleGeometry.getAttribute(
        "position"
      ) as THREE.BufferAttribute;
      const posArray = posAttr.array as Float32Array;

      for (let i = 0; i < PARTICLE_COUNT; i++) {
        const i3 = i * 3;

        // Base drift
        posArray[i3] += velocities[i3];
        posArray[i3 + 1] += velocities[i3 + 1];
        posArray[i3 + 2] += velocities[i3 + 2];

        // Mouse influence — push particles away gently
        const dx = posArray[i3] - mouse.x * 8;
        const dy = posArray[i3 + 1] - mouse.y * 5;
        const dist = Math.sqrt(dx * dx + dy * dy);

        if (dist < 4) {
          const force = (4 - dist) * 0.002;
          posArray[i3] += dx * force;
          posArray[i3 + 1] += dy * force;
        }

        // Soft return to base position
        posArray[i3] += (basePositions[i3] - posArray[i3]) * 0.002;
        posArray[i3 + 1] += (basePositions[i3 + 1] - posArray[i3 + 1]) * 0.002;
        posArray[i3 + 2] += (basePositions[i3 + 2] - posArray[i3 + 2]) * 0.002;

        // Boundary wrap
        if (posArray[i3] > 12) posArray[i3] = -12;
        if (posArray[i3] < -12) posArray[i3] = 12;
        if (posArray[i3 + 1] > 8) posArray[i3 + 1] = -8;
        if (posArray[i3 + 1] < -8) posArray[i3 + 1] = 8;
      }

      posAttr.needsUpdate = true;

      // Subtle camera sway based on mouse
      camera.position.x += (mouse.x * 1.5 - camera.position.x) * 0.02;
      camera.position.y += (5 + mouse.y * 0.8 - camera.position.y) * 0.02;

      renderer.render(scene, camera);
    };

    animate();

    // ─── Cleanup ───
    return () => {
      cancelAnimationFrame(frameRef.current);
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("resize", handleResize);
      renderer.dispose();
      scene.clear();
      if (container.contains(renderer.domElement)) {
        container.removeChild(renderer.domElement);
      }
    };
  }, []);

  return (
    <div
      ref={containerRef}
      className="absolute inset-0 z-0"
      aria-hidden="true"
    />
  );
}
