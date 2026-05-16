import * as THREE from 'three'

/**
 * 气球装饰类
 * 创建挂在圣诞树上的彩色气球
 */
export class Balloons {
    /**
     * @param {THREE.Scene} scene - Three.js场景
     * @param {Object} treeParams - 圣诞树参数
     */
    constructor(scene, treeParams) {
        this.scene = scene
        this.treeParams = treeParams
        this.balloons = []
        this.time = 0

        this.createBalloons()
    }

    /**
     * 创建单个气球
     */
    createBalloon(color, position, size = 0.15) {
        const group = new THREE.Group()

        // 气球主体（稍微拉长的球体）
        const balloonGeometry = new THREE.SphereGeometry(size, 32, 32)
        // 在Y轴上拉伸，使其看起来像气球
        balloonGeometry.scale(1, 1.3, 1)

        const balloonMaterial = new THREE.MeshStandardMaterial({
            color: color,
            metalness: 0.1,
            roughness: 0.2,
            emissive: color,
            emissiveIntensity: 0.2,
            transparent: true,
            opacity: 0.9
        })

        const balloon = new THREE.Mesh(balloonGeometry, balloonMaterial)
        balloon.position.y = size * 1.3
        group.add(balloon)

        // 气球底部的结
        const knotGeometry = new THREE.SphereGeometry(size * 0.15, 8, 8)
        knotGeometry.scale(1, 0.6, 1)
        const knotMaterial = new THREE.MeshStandardMaterial({
            color: new THREE.Color(color).multiplyScalar(0.7),
            metalness: 0.1,
            roughness: 0.8
        })
        const knot = new THREE.Mesh(knotGeometry, knotMaterial)
        knot.position.y = size * 0.05
        group.add(knot)

        // 气球绳子（使用曲线）
        const stringLength = 0.4 + Math.random() * 0.3
        const stringPoints = []
        const segments = 20

        for (let i = 0; i <= segments; i++) {
            const t = i / segments
            const y = -t * stringLength
            // 添加轻微的曲线效果
            const x = Math.sin(t * Math.PI * 2) * 0.02
            const z = Math.cos(t * Math.PI * 3) * 0.02
            stringPoints.push(new THREE.Vector3(x, y, z))
        }

        const stringCurve = new THREE.CatmullRomCurve3(stringPoints)
        const stringGeometry = new THREE.TubeGeometry(stringCurve, segments, 0.003, 8, false)
        const stringMaterial = new THREE.MeshStandardMaterial({
            color: 0xffffff,
            metalness: 0.1,
            roughness: 0.9
        })
        const string = new THREE.Mesh(stringGeometry, stringMaterial)
        group.add(string)

        // 设置位置
        group.position.copy(position)

        // 存储动画数据
        group.userData = {
            originalY: position.y,
            floatPhase: Math.random() * Math.PI * 2,
            floatSpeed: 0.5 + Math.random() * 0.3,
            floatAmount: 0.05 + Math.random() * 0.03,
            swayPhase: Math.random() * Math.PI * 2,
            swaySpeed: 0.3 + Math.random() * 0.2
        }

        // 添加投影
        group.traverse(child => {
            if (child.isMesh) {
                child.castShadow = true
                child.receiveShadow = true
            }
        })

        return group
    }

    /**
     * 创建多个气球并分布在树上
     */
    createBalloons() {
        const balloonCount = this.treeParams.气球?.数量 || 10
        const balloonSize = this.treeParams.气球?.大小 || 0.15
        const colors = [
            0xff3333, // 红色
            0x3366ff, // 蓝色
            0x33ff66, // 绿色
            0xffdd00, // 黄色
            0xff66ff, // 紫色
            0xff9933, // 橙色
            0x33ffff, // 青色
            0xff3399  // 粉色
        ]

        const treeHeight = this.treeParams.树高
        const treeWidth = this.treeParams.树宽

        for (let i = 0; i < balloonCount; i++) {
            // 在树的不同高度分布
            const heightRatio = 0.3 + (i / balloonCount) * 0.5
            const height = heightRatio * treeHeight
            const maxRadius = (1 - heightRatio) * treeWidth * 0.85

            // 随机角度，确保分布均匀
            const angle = (i / balloonCount) * Math.PI * 2 + Math.random() * 0.5
            const radius = maxRadius * 1.15 // 改为1.15，让气球在树的外面

            const position = new THREE.Vector3(
                Math.cos(angle) * radius,
                height,
                Math.sin(angle) * radius
            )

            const color = colors[i % colors.length]
            const size = balloonSize * (0.8 + Math.random() * 0.4) // 使用参数大小，带随机变化

            const balloon = this.createBalloon(color, position, size)
            this.balloons.push(balloon)
            this.scene.add(balloon)
        }
    }

    /**
     * 更新气球动画
     */
    update(deltaTime = 0.016) {
        this.time += deltaTime

        this.balloons.forEach(balloon => {
            const userData = balloon.userData

            // 上下浮动
            const floatOffset = Math.sin(this.time * userData.floatSpeed + userData.floatPhase) * userData.floatAmount
            balloon.position.y = userData.originalY + floatOffset

            // 轻微摇摆
            const swayAmount = Math.sin(this.time * userData.swaySpeed + userData.swayPhase) * 0.05
            balloon.rotation.z = swayAmount
        })
    }

    /**
     * 销毁所有气球
     */
    dispose() {
        this.balloons.forEach(balloon => {
            this.scene.remove(balloon)
            balloon.traverse(child => {
                if (child.isMesh) {
                    child.geometry.dispose()
                    child.material.dispose()
                }
            })
        })
        this.balloons = []
    }
}
