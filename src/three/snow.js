import * as THREE from 'three'

/**
 * 雪花粒子系统类
 * 创建飘落的雪花效果
 */
export class Snow {
    /**
     * @param {THREE.Scene} scene - Three.js场景
     * @param {Object} params - 雪花参数配置
     */
    constructor(scene, params = {}) {
        this.scene = scene
        this.params = {
            count: params.count || 2000,
            size: params.size || 0.05,
            area: params.area || 15,
            height: params.height || 10,
            speed: params.speed || 0.02,
            ...params
        }
        this.time = 0
        this.snowParticles = null

        this.createSnow()
    }

    /**
     * 创建雪花粒子系统
     */
    createSnow() {
        const geometry = new THREE.BufferGeometry()
        const positions = new Float32Array(this.params.count * 3)
        const scales = new Float32Array(this.params.count)
        const velocities = new Float32Array(this.params.count * 3)

        // 创建雪花粒子
        for (let i = 0; i < this.params.count; i++) {
            const i3 = i * 3

            // 随机位置分布在整个区域
            positions[i3] = (Math.random() - 0.5) * this.params.area
            positions[i3 + 1] = Math.random() * this.params.height
            positions[i3 + 2] = (Math.random() - 0.5) * this.params.area

            // 随机大小
            scales[i] = Math.random() * 0.5 + 0.5

            // 下落速度（带轻微水平漂移）
            velocities[i3] = (Math.random() - 0.5) * 0.02 // x方向漂移
            velocities[i3 + 1] = -(Math.random() * 0.5 + 0.3) * this.params.speed // y方向下落
            velocities[i3 + 2] = (Math.random() - 0.5) * 0.02 // z方向漂移
        }

        geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3))
        geometry.setAttribute('scale', new THREE.BufferAttribute(scales, 1))
        geometry.setAttribute('velocity', new THREE.BufferAttribute(velocities, 3))

        // 创建雪花材质
        const material = new THREE.PointsMaterial({
            size: this.params.size,
            color: 0xffffff,
            transparent: true,
            opacity: 0.8,
            blending: THREE.AdditiveBlending,
            depthWrite: false,
            sizeAttenuation: true,
            map: this.createSnowflakeTexture()
        })

        this.snowParticles = new THREE.Points(geometry, material)
        this.snowParticles.name = 'snowParticles'
        this.scene.add(this.snowParticles)
    }

    /**
     * 创建雪花纹理
     */
    createSnowflakeTexture() {
        const canvas = document.createElement('canvas')
        canvas.width = 64
        canvas.height = 64

        const context = canvas.getContext('2d')
        const centerX = canvas.width / 2
        const centerY = canvas.height / 2
        const radius = canvas.width / 3

        // 创建径向渐变
        const gradient = context.createRadialGradient(centerX, centerY, 0, centerX, centerY, radius)
        gradient.addColorStop(0, 'rgba(255, 255, 255, 1)')
        gradient.addColorStop(0.3, 'rgba(255, 255, 255, 0.8)')
        gradient.addColorStop(0.7, 'rgba(255, 255, 255, 0.3)')
        gradient.addColorStop(1, 'rgba(255, 255, 255, 0)')

        // 绘制圆形
        context.fillStyle = gradient
        context.beginPath()
        context.arc(centerX, centerY, radius, 0, Math.PI * 2)
        context.fill()

        return new THREE.CanvasTexture(canvas)
    }

    /**
     * 更新雪花动画
     */
    update(deltaTime = 0.016) {
        this.time += deltaTime

        if (!this.snowParticles) return

        const positions = this.snowParticles.geometry.attributes.position.array
        const velocities = this.snowParticles.geometry.attributes.velocity.array

        for (let i = 0; i < this.params.count; i++) {
            const i3 = i * 3

            // 更新位置
            positions[i3] += velocities[i3] + Math.sin(this.time + i) * 0.001 // 添加飘动效果
            positions[i3 + 1] += velocities[i3 + 1]
            positions[i3 + 2] += velocities[i3 + 2] + Math.cos(this.time + i) * 0.001

            // 重置超出边界的雪花
            if (positions[i3 + 1] < -0.5) {
                positions[i3 + 1] = this.params.height
                positions[i3] = (Math.random() - 0.5) * this.params.area
                positions[i3 + 2] = (Math.random() - 0.5) * this.params.area
            }

            // 水平边界循环
            if (Math.abs(positions[i3]) > this.params.area / 2) {
                positions[i3] = -positions[i3]
            }
            if (Math.abs(positions[i3 + 2]) > this.params.area / 2) {
                positions[i3 + 2] = -positions[i3 + 2]
            }
        }

        this.snowParticles.geometry.attributes.position.needsUpdate = true
    }

    /**
     * 销毁雪花系统
     */
    dispose() {
        if (this.snowParticles) {
            this.scene.remove(this.snowParticles)
            this.snowParticles.geometry.dispose()
            this.snowParticles.material.dispose()
        }
    }
}
