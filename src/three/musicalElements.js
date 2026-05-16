import * as THREE from 'three'

/**
 * 音乐元素类
 * 创建从圣诞树中飘出的音符、爱心和星星
 */
export class MusicalElements {
    /**
     * @param {THREE.Scene} scene - Three.js场景
     * @param {Object} treeParams - 圣诞树参数
     */
    constructor(scene, treeParams) {
        this.scene = scene
        this.treeParams = treeParams
        this.elements = []
        this.time = 0
        this.lastSpawnTime = 0
        this.spawnInterval = 0.15 // 从0.3秒改为0.15秒，进一步增加频率
    }

    /**
     * 创建音符形状
     */
    createMusicNote() {
        const group = new THREE.Group()

        // 音符头（实心圆）
        const headGeometry = new THREE.SphereGeometry(0.08, 16, 16)
        const material = new THREE.MeshStandardMaterial({
            color: 0x9966ff,
            emissive: 0x6633cc,
            emissiveIntensity: 0.5,
            metalness: 0.3,
            roughness: 0.4
        })
        const head = new THREE.Mesh(headGeometry, material)
        head.position.y = -0.05
        group.add(head)

        // 音符杆
        const stemGeometry = new THREE.CylinderGeometry(0.015, 0.015, 0.25, 8)
        const stem = new THREE.Mesh(stemGeometry, material)
        stem.position.set(0.07, 0.08, 0)
        group.add(stem)

        // 音符旗
        const flagGeometry = new THREE.BoxGeometry(0.12, 0.08, 0.02)
        const flag = new THREE.Mesh(flagGeometry, material)
        flag.position.set(0.13, 0.17, 0)
        flag.rotation.z = -0.3
        group.add(flag)

        return group
    }

    /**
     * 创建爱心形状
     */
    createHeart() {
        const heartShape = new THREE.Shape()

        const x = 0, y = 0
        heartShape.moveTo(x + 0, y + 0)
        heartShape.bezierCurveTo(x + 0, y - 0.03, x - 0.05, y - 0.06, x - 0.05, y - 0.06)
        heartShape.bezierCurveTo(x - 0.05, y - 0.09, x - 0.05, y - 0.12, x - 0.03, y - 0.12)
        heartShape.bezierCurveTo(x + 0, y - 0.12, x + 0, y - 0.09, x + 0, y - 0.06)
        heartShape.bezierCurveTo(x + 0, y - 0.09, x + 0, y - 0.12, x + 0.03, y - 0.12)
        heartShape.bezierCurveTo(x + 0.05, y - 0.12, x + 0.05, y - 0.09, x + 0.05, y - 0.06)
        heartShape.bezierCurveTo(x + 0.05, y - 0.06, x + 0, y - 0.03, x + 0, y + 0)

        const extrudeSettings = {
            depth: 0.03,
            bevelEnabled: true,
            bevelThickness: 0.01,
            bevelSize: 0.01,
            bevelSegments: 3
        }

        const geometry = new THREE.ExtrudeGeometry(heartShape, extrudeSettings)
        const material = new THREE.MeshStandardMaterial({
            color: 0xff3366,
            emissive: 0xff0033,
            emissiveIntensity: 0.4,
            metalness: 0.2,
            roughness: 0.5
        })

        const heart = new THREE.Mesh(geometry, material)
        heart.rotation.z = Math.PI
        heart.scale.set(1.5, 1.5, 1.5)

        return heart
    }

    /**
     * 创建星星形状
     */
    createStar() {
        const starShape = new THREE.Shape()
        const outerRadius = 0.1
        const innerRadius = 0.04
        const points = 5

        for (let i = 0; i < points * 2; i++) {
            const radius = i % 2 === 0 ? outerRadius : innerRadius
            const angle = (i * Math.PI) / points
            const x = Math.cos(angle) * radius
            const y = Math.sin(angle) * radius

            if (i === 0) {
                starShape.moveTo(x, y)
            } else {
                starShape.lineTo(x, y)
            }
        }
        starShape.closePath()

        const extrudeSettings = {
            depth: 0.02,
            bevelEnabled: true,
            bevelThickness: 0.01,
            bevelSize: 0.005,
            bevelSegments: 2
        }

        const geometry = new THREE.ExtrudeGeometry(starShape, extrudeSettings)
        const material = new THREE.MeshStandardMaterial({
            color: 0xffdd00,
            emissive: 0xffaa00,
            emissiveIntensity: 0.6,
            metalness: 0.7,
            roughness: 0.2
        })

        const star = new THREE.Mesh(geometry, material)
        return star
    }

    /**
     * 在树上随机位置生成元素
     */
    spawnElement() {
        const types = ['note', 'heart', 'star']
        const type = types[Math.floor(Math.random() * types.length)]

        let element
        switch (type) {
            case 'note':
                element = this.createMusicNote()
                break
            case 'heart':
                element = this.createHeart()
                break
            case 'star':
                element = this.createStar()
                break
        }

        // 在树的表面随机位置生成 - 调整到树的外表面
        const heightRatio = 0.2 + Math.random() * 0.6 // 在树的20%-80%高度之间
        const height = heightRatio * this.treeParams.树高
        const maxRadius = (1 - heightRatio) * this.treeParams.树宽
        const angle = Math.random() * Math.PI * 2
        const radius = maxRadius * 1.1 // 从树的外表面开始（1.1倍半径）

        element.position.set(
            Math.cos(angle) * radius,
            height,
            Math.sin(angle) * radius
        )

        // 随机初始旋转
        element.rotation.set(
            Math.random() * Math.PI,
            Math.random() * Math.PI,
            Math.random() * Math.PI
        )

        // 计算向外的方向
        const outwardDirection = new THREE.Vector3(
            Math.cos(angle),
            0,
            Math.sin(angle)
        ).normalize()

        // 存储元素数据 - 添加向外的速度分量
        element.userData = {
            type: type,
            birthTime: this.time,
            velocity: new THREE.Vector3(
                outwardDirection.x * 0.4 + (Math.random() - 0.5) * 0.2, // 向外 + 随机
                0.6 + Math.random() * 0.3, // 向上
                outwardDirection.z * 0.4 + (Math.random() - 0.5) * 0.2  // 向外 + 随机
            ),
            rotationSpeed: new THREE.Vector3(
                (Math.random() - 0.5) * 2,
                (Math.random() - 0.5) * 2,
                (Math.random() - 0.5) * 2
            ),
            maxLifetime: 4.0
        }

        this.elements.push(element)
        this.scene.add(element)
    }

    /**
     * 更新所有音乐元素
     */
    update(deltaTime = 0.016) {
        this.time += deltaTime

        // 定期生成新元素
        if (this.time - this.lastSpawnTime > this.spawnInterval) {
            this.spawnElement()
            this.lastSpawnTime = this.time
        }

        // 更新现有元素
        this.elements = this.elements.filter(element => {
            const lifetime = this.time - element.userData.birthTime

            // 移除超过生命周期的元素
            if (lifetime > element.userData.maxLifetime) {
                this.scene.remove(element)
                element.traverse(child => {
                    if (child.isMesh) {
                        child.geometry.dispose()
                        child.material.dispose()
                    }
                })
                return false
            }

            // 更新位置
            element.position.add(element.userData.velocity.clone().multiplyScalar(deltaTime))

            // 更新旋转
            element.rotation.x += element.userData.rotationSpeed.x * deltaTime
            element.rotation.y += element.userData.rotationSpeed.y * deltaTime
            element.rotation.z += element.userData.rotationSpeed.z * deltaTime

            // 淡出效果
            const fadeStart = element.userData.maxLifetime * 0.6
            if (lifetime > fadeStart) {
                const fadeProgress = (lifetime - fadeStart) / (element.userData.maxLifetime - fadeStart)
                element.traverse(child => {
                    if (child.isMesh && child.material) {
                        child.material.opacity = 1 - fadeProgress
                        child.material.transparent = true
                    }
                })
            }

            return true
        })
    }

    /**
     * 销毁所有元素
     */
    dispose() {
        this.elements.forEach(element => {
            this.scene.remove(element)
            element.traverse(child => {
                if (child.isMesh) {
                    child.geometry.dispose()
                    child.material.dispose()
                }
            })
        })
        this.elements = []
    }
}
