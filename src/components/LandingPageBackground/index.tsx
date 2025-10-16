import { Canvas, useFrame, useThree } from '@react-three/fiber'
import { useMemo, useRef, CSSProperties, useState, useEffect } from 'react'
import { ShaderMaterial, Vector2, Texture, Mesh } from 'three'
import styles from './styles.module.css';
import fragmentShader from '!!raw-loader!./fragment-shader.glsl';
import vertexShader from '!!raw-loader!./vertex-shader.glsl';

function GradientMesh({ isDarkMode, onRenderStart }: { isDarkMode: boolean; onRenderStart: () => void }) {
    const materialRef = useRef<ShaderMaterial>()
    const meshRef = useRef<Mesh>(null)
    const hasStartedRef = useRef(false)

    const { size, viewport } = useThree()

    const uniforms = useMemo(
        () => ({
            u_time: { value: 0 },
            u_resolution: { value: new Vector2(size.width, size.height) },
            uTexture: { value: new Texture() },
            u_isDarkMode: { value: isDarkMode ? 1.0 : 0.0 },
        }),
        []
    )

    useEffect(() => {
        if (materialRef.current) {
            materialRef.current.uniforms.u_isDarkMode.value = isDarkMode ? 1.0 : 0.0
        }
    }, [isDarkMode])

    useFrame((state) => {
        if (!hasStartedRef.current) {
            hasStartedRef.current = true
            onRenderStart()
        }
        if (materialRef.current) {
            materialRef.current.uniforms.u_time.value = state.clock.getElapsedTime()
            materialRef.current.uniforms.u_resolution.value.set(size.width, size.height)
        }
        if (meshRef.current) {
            meshRef.current.scale.set(viewport.width, viewport.height, 1)
        }
    })

    return (
        <mesh ref={meshRef}>
            <planeGeometry args={[1, 1]} />
            <shaderMaterial
                ref={materialRef}
                vertexShader={vertexShader}
                fragmentShader={fragmentShader}
                uniforms={uniforms}
                transparent={true}
            />
        </mesh>
    )
}


export default function LandingPageGradient({ style }: { style: CSSProperties }) {
    const [isDarkMode, setIsDarkMode] = useState(false)
    const [isVisible, setIsVisible] = useState(false)

    useEffect(() => {
        const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)')
        setIsDarkMode(mediaQuery.matches)

        const handler = (e: MediaQueryListEvent) => setIsDarkMode(e.matches)
        mediaQuery.addEventListener('change', handler)

        return () => mediaQuery.removeEventListener('change', handler)
    }, [])

    const handleRenderStart = () => {
        setIsVisible(true)
    }

    return (
        <div
            className={styles.gradient}
            style={{
                ...style,
                opacity: isVisible ? 1 : 0,
                transition: 'opacity 1s ease-out'
            }}
        >
            <Canvas>
                <GradientMesh isDarkMode={isDarkMode} onRenderStart={handleRenderStart} />
            </Canvas>
        </div>
    )
}

