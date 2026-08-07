import { useRef, useMemo, useEffect } from 'react';
import { Canvas, useFrame, extend } from '@react-three/fiber';
import { OrbitControls, Effects } from '@react-three/drei';
import { UnrealBloomPass } from 'three-stdlib';
import * as THREE from 'three';

extend({ UnrealBloomPass });

function hashFloat(seed) {
  return ((Math.sin(seed * 127.1) * 43758.5453123) % 1 + 1) % 1;
}

function createScatterPositions(count, spread) {
  const pos = [];
  for (let i = 0; i < count; i++) {
    const x = (hashFloat(i + 0.11) - 0.5) * spread;
    const y = (hashFloat(i + 0.37) - 0.5) * spread;
    const z = (hashFloat(i + 0.73) - 0.5) * spread;
    pos.push(new THREE.Vector3(x, y, z));
  }
  return pos;
}

function QuasarSwarm({ stateRef, amplRef, bloomRef, hueBiasRef }) {
  const meshRef = useRef();
  const count = 20000;
  const dummy = useMemo(() => new THREE.Object3D(), []);
  const pColor = useMemo(() => new THREE.Color(), []);
  const positions = useMemo(() => createScatterPositions(count, 200), []);
  const geometry = useMemo(() => new THREE.TetrahedronGeometry(0.25), []);
  const material = useMemo(() => new THREE.MeshBasicMaterial({ color: 0xffffff }), []);

  useFrame((frameState) => {
    if (!meshRef.current) return;

    const time = frameState.clock.getElapsedTime();
    const amplitude = amplRef.current || 0;
    const state = stateRef.current;
    const targetPosition = new THREE.Vector3();
    const hueBias = hueBiasRef?.current || 0;
    const diskRadius = state === 'speaking' ? 60 + amplitude * 18 : 54;
    const bloom = state === 'speaking' ? 2.2 : 1.8;

    if (bloomRef.current) {
      bloomRef.current.strength += (bloom - bloomRef.current.strength) * 0.05;
    }

    for (let i = 0; i < count; i++) {
      const norm = i / count;
      const phi = norm * Math.PI * 2 * 137.508;
      const radius = 2 + Math.pow((i * 0.6180339887) % 1, 0.55) * diskRadius;
      const theta = phi + time * 0.55;
      targetPosition.set(
        Math.cos(theta) * radius,
        Math.sin(norm * Math.PI * 6 + time * 0.9) * 2.2,
        Math.sin(theta) * radius
      );

      pColor.setHSL((0.57 - norm * 0.3 + hueBias + time * 0.02) % 1, 0.88, 0.48 + (1 - norm) * 0.2);
      positions[i].lerp(targetPosition, 0.1);
      dummy.position.copy(positions[i]);
      dummy.updateMatrix();
      meshRef.current.setMatrixAt(i, dummy.matrix);
      meshRef.current.setColorAt(i, pColor);
    }

    meshRef.current.instanceMatrix.needsUpdate = true;
    if (meshRef.current.instanceColor) meshRef.current.instanceColor.needsUpdate = true;
  });

  return <instancedMesh ref={meshRef} args={[geometry, material, count]} />;
}

function GoldenRatioSwarm({ stateRef, amplRef, bloomRef, hueBiasRef }) {
  const meshRef = useRef();
  const count = 20000;
  const dummy = useMemo(() => new THREE.Object3D(), []);
  const pColor = useMemo(() => new THREE.Color(), []);
  const positions = useMemo(() => createScatterPositions(count, 180), []);
  const geometry = useMemo(() => new THREE.TetrahedronGeometry(0.21), []);
  const material = useMemo(() => new THREE.MeshBasicMaterial({ color: 0xffffff }), []);

  useFrame((frameState) => {
    if (!meshRef.current) return;

    const time = frameState.clock.getElapsedTime();
    const amplitude = amplRef.current || 0;
    const goldenAngle = Math.PI * (3 - Math.sqrt(5));
    const scale = stateRef.current === 'speaking' ? 44 + amplitude * 6 : 40;
    const bloom = stateRef.current === 'speaking' ? 2.1 : 1.75;

    if (bloomRef.current) {
      bloomRef.current.strength += (bloom - bloomRef.current.strength) * 0.05;
    }

    const targetPosition = new THREE.Vector3();

    for (let i = 0; i < count; i++) {
      const y = 1 - (i / (count - 1)) * 2;
      const radiusAtY = Math.sqrt(1 - y * y);
      const theta = i * goldenAngle + time * 0.35;

      targetPosition.set(
        Math.cos(theta) * radiusAtY * scale,
        y * scale,
        Math.sin(theta) * radiusAtY * scale
      );

      pColor.setHSL((0.54 + (hueBiasRef?.current || 0) + i * 0.01) % 1, 0.55, 0.54);
      positions[i].lerp(targetPosition, 0.09);
      dummy.position.copy(positions[i]);
      dummy.updateMatrix();
      meshRef.current.setMatrixAt(i, dummy.matrix);
      meshRef.current.setColorAt(i, pColor);
    }

    meshRef.current.instanceMatrix.needsUpdate = true;
    if (meshRef.current.instanceColor) meshRef.current.instanceColor.needsUpdate = true;
  });

  return <instancedMesh ref={meshRef} args={[geometry, material, count]} />;
}

function SphereSwarm({ stateRef, amplRef, bloomRef, hueBiasRef }) {
  const meshRef = useRef();
  const count = 20000;
  const dummy = useMemo(() => new THREE.Object3D(), []);
  const pColor = useMemo(() => new THREE.Color(), []);
  const positions = useMemo(() => createScatterPositions(count, 150), []);
  const geometry = useMemo(() => new THREE.TetrahedronGeometry(0.23), []);
  const material = useMemo(() => new THREE.MeshBasicMaterial({ color: 0xffffff }), []);

  useFrame((frameState) => {
    if (!meshRef.current) return;

    const time = frameState.clock.getElapsedTime();
    const amplitude = amplRef.current || 0;
    const state = stateRef.current;
    const radius = state === 'speaking' ? 34 + amplitude * 8 : 30;
    const lerpSpeed = state === 'speaking' ? 0.13 : 0.1;
    const bloom = state === 'speaking' ? 2.35 : 1.95;
    const hueBias = hueBiasRef?.current || 0;
    const targetPosition = new THREE.Vector3();

    if (bloomRef.current) {
      bloomRef.current.strength += (bloom - bloomRef.current.strength) * 0.05;
    }

    for (let i = 0; i < count; i++) {
      const phi = Math.acos(-1 + (2 * i) / count);
      const theta = Math.sqrt(count * Math.PI) * phi + time * 0.18;
      const pulse = 1 + Math.sin(time * 1.2 + i * 0.015) * 0.035;

      targetPosition.set(
        radius * Math.cos(theta) * Math.sin(phi) * pulse,
        radius * Math.sin(theta) * Math.sin(phi) * pulse,
        radius * Math.cos(phi) * pulse
      );

      pColor.setHSL((0.43 + hueBias + i * 0.0008 + time * 0.015) % 1, 0.7, 0.56);
      positions[i].lerp(targetPosition, lerpSpeed);
      dummy.position.copy(positions[i]);
      dummy.rotation.set(phi * 0.08, theta * 0.02, 0);
      dummy.updateMatrix();
      meshRef.current.setMatrixAt(i, dummy.matrix);
      meshRef.current.setColorAt(i, pColor);
    }

    meshRef.current.instanceMatrix.needsUpdate = true;
    if (meshRef.current.instanceColor) meshRef.current.instanceColor.needsUpdate = true;
  });

  return <instancedMesh ref={meshRef} args={[geometry, material, count]} />;
}

function BloomEffects({ bloomRef }) {
  const passRef = useRef();

  useEffect(() => {
    bloomRef.current = passRef.current;
  }, [bloomRef]);

  return (
    <Effects disableGamma>
      <unrealBloomPass ref={passRef} threshold={0} strength={1.8} radius={0.4} />
    </Effects>
  );
}

export default function ParticleSphere({ state = 'idle', audioAmplitude = 0, variant = 'quasar', botHue = 0 }) {
  const stateRef = useRef(state);
  const amplRef = useRef(audioAmplitude);
  const bloomRef = useRef();
  const hueBiasRef = useRef(botHue);

  useEffect(() => {
    stateRef.current = state;
  }, [state]);

  useEffect(() => {
    amplRef.current = audioAmplitude;
  }, [audioAmplitude]);

  useEffect(() => {
    hueBiasRef.current = botHue;
  }, [botHue]);

  return (
    <div style={{ width: '100%', height: '100%', position: 'relative' }}>
      <Canvas camera={{ position: [0, 0, 110], fov: 60 }} gl={{ alpha: true, antialias: false }} style={{ background: 'transparent' }}>
        <fog attach="fog" args={['#02060b', 0.012]} />
        {variant === 'golden_ratio' ? (
          <GoldenRatioSwarm stateRef={stateRef} amplRef={amplRef} bloomRef={bloomRef} hueBiasRef={hueBiasRef} />
        ) : variant === 'sphere' ? (
          <SphereSwarm stateRef={stateRef} amplRef={amplRef} bloomRef={bloomRef} hueBiasRef={hueBiasRef} />
        ) : (
          <QuasarSwarm stateRef={stateRef} amplRef={amplRef} bloomRef={bloomRef} hueBiasRef={hueBiasRef} />
        )}
        <OrbitControls autoRotate autoRotateSpeed={0.35} enableZoom={false} enablePan={false} />
        <BloomEffects bloomRef={bloomRef} />
      </Canvas>
    </div>
  );
}
