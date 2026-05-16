import * as THREE from 'three'

/**
 * 圣诞树装饰类
 * 创建铃铛、蝴蝶结等装饰物
 */
export class TreeDecorations {
    /**
     * @param {THREE.Scene} scene - Three.js场景
     * @param {Object} treeParams - 圣诞树参数
     */
    constructor(scene, treeParams) {
        this.scene = scene
        this.treeParams = treeParams
        this.decorations = []
        this.time = 0

        this.createDecorations()
    }

    /**
   * 创建铃铛装饰
   */
    createBell(size, color, position) {
        const group = new THREE.Group()

        // 铃铛主体（使用球体和圆锥组合）- 增大尺寸
        const bellBodyGeometry = new THREE.SphereGeometry(size, 32, 32, 0, Math.PI * 2, 0, Math.PI * 0.7)
        const bellMaterial = new THREE.MeshStandardMaterial({
            color: color,
            metalness: 0.95,
            roughness: 0.05,
            emissive: color,
            emissiveIntensity: 0.05 // 大幅降低发光强度
        })
        const bellBody = new THREE.Mesh(bellBodyGeometry, bellMaterial)
        bellBody.rotation.x = Math.PI
        group.add(bellBody)

        // 铃铛底部边缘 - 更明显
        const rimGeometry = new THREE.TorusGeometry(size * 0.75, size * 0.12, 16, 32)
        const rim = new THREE.Mesh(rimGeometry, bellMaterial)
        rim.position.y = -size * 0.5
        rim.rotation.x = Math.PI / 2
        group.add(rim)

        // 铃铛顶部挂钩 - 更大更明显
        const hookGeometry = new THREE.TorusGeometry(size * 0.25, size * 0.08, 12, 24)
        const hook = new THREE.Mesh(hookGeometry, bellMaterial)
        hook.position.y = size * 0.9
        hook.rotation.z = Math.PI / 2
        group.add(hook)

        // 铃铛内部的小球 - 更大
        const clapperGeometry = new THREE.SphereGeometry(size * 0.2, 16, 16)
        const clapperMaterial = new THREE.MeshStandardMaterial({
            color: 0xffdd00,
            metalness: 0.9,
            roughness: 0.1
        })
        const clapper = new THREE.Mesh(clapperGeometry, clapperMaterial)
        clapper.position.y = -size * 0.4
        group.add(clapper)

        // 添加装饰条纹
        const stripeGeometry = new THREE.TorusGeometry(size * 0.5, size * 0.05, 8, 32)
        const stripeMaterial = new THREE.MeshStandardMaterial({
            color: new THREE.Color(color).multiplyScalar(1.3),
            metalness: 0.95,
            roughness: 0.05
        })
        const stripe = new THREE.Mesh(stripeGeometry, stripeMaterial)
        stripe.position.y = -size * 0.2
        stripe.rotation.x = Math.PI / 2
        group.add(stripe)

        group.position.copy(position)

        // 添加投影
        group.traverse((child) => {
            if (child.isMesh) {
                child.castShadow = true
                child.receiveShadow = true
            }
        })

        return group
    }

    /**
   * 创建蝴蝶结装饰
   */
    createBow(size, color, position) {
        const group = new THREE.Group()

        const bowMaterial = new THREE.MeshStandardMaterial({
            color: color,
            metalness: 0.1,
            roughness: 0.7,
            emissive: color,
            emissiveIntensity: 0.03 // 大幅降低发光
        })

        // 中心结 - 更大
        const centerGeometry = new THREE.SphereGeometry(size * 0.35, 16, 16)
        centerGeometry.scale(1, 0.8, 1)
        const center = new THREE.Mesh(centerGeometry, bowMaterial)
        group.add(center)

        // 左右两个环 - 更大更明显
        const loopGeometry = new THREE.TorusGeometry(size * 0.5, size * 0.2, 16, 32)

        const leftLoop = new THREE.Mesh(loopGeometry, bowMaterial)
        leftLoop.position.x = -size * 0.6
        leftLoop.rotation.y = Math.PI / 2
        leftLoop.rotation.z = Math.PI / 8
        leftLoop.scale.set(1, 0.8, 0.6)
        group.add(leftLoop)

        const rightLoop = new THREE.Mesh(loopGeometry, bowMaterial)
        rightLoop.position.x = size * 0.6
        rightLoop.rotation.y = Math.PI / 2
        rightLoop.rotation.z = -Math.PI / 8
        rightLoop.scale.set(1, 0.8, 0.6)
        group.add(rightLoop)

        // 下垂的飘带 - 更长更明显
        const ribbonGeometry = new THREE.BoxGeometry(size * 0.25, size * 1.0, size * 0.08)

        const ribbon1 = new THREE.Mesh(ribbonGeometry, bowMaterial)
        ribbon1.position.set(-size * 0.35, -size * 0.7, 0)
        ribbon1.rotation.z = Math.PI / 10
        group.add(ribbon1)

        const ribbon2 = new THREE.Mesh(ribbonGeometry, bowMaterial)
        ribbon2.position.set(size * 0.35, -size * 0.7, 0)
        ribbon2.rotation.z = -Math.PI / 10
        group.add(ribbon2)

        // 飘带末端的V形切口
        const vCutGeometry = new THREE.ConeGeometry(size * 0.12, size * 0.15, 3)
        const vCut1 = new THREE.Mesh(vCutGeometry, bowMaterial)
        vCut1.position.set(-size * 0.35, -size * 1.25, 0)
        vCut1.rotation.z = Math.PI
        group.add(vCut1)

        const vCut2 = new THREE.Mesh(vCutGeometry, bowMaterial)
        vCut2.position.set(size * 0.35, -size * 1.25, 0)
        vCut2.rotation.z = Math.PI
        group.add(vCut2)

        group.position.copy(position)

        // 添加投影
        group.traverse((child) => {
            if (child.isMesh) {
                child.castShadow = true
                child.receiveShadow = true
            }
        })

        return group
    }

    /**
     * 在树上随机放置装饰物
     */
    createDecorations() {
        const decorationCount = 12 // 装饰物数量
        const treeHeight = this.treeParams.树高
        const treeWidth = this.treeParams.树宽

        // 铃铛颜色
        const bellColors = [0xffdd00, 0xff6666, 0x66ff66, 0x6666ff, 0xff66ff]

        // 蝴蝶结颜色
        const bowColors = [0xff3333, 0x3366ff, 0xff9933, 0xff66cc, 0x33ff99]

        for (let i = 0; i < decorationCount; i++) {
            const heightRatio = (i + 1) / (decorationCount + 1)
            const height = heightRatio * treeHeight
            const maxRadius = (1 - heightRatio) * treeWidth

            // 随机角度
            const angle = (i / decorationCount) * Math.PI * 2 + Math.random() * Math.PI * 0.5
            const radius = maxRadius * 1.05 // 改为1.05，让装饰品在树的外表面

            const position = new THREE.Vector3(
                Math.cos(angle) * radius,
                height,
                Math.sin(angle) * radius
            )

            let decoration
            if (i % 2 === 0) {
                // 创建铃铛 - 增大尺寸
                const color = bellColors[Math.floor(Math.random() * bellColors.length)]
                decoration = this.createBell(0.18, color, position) // 从0.08增大到0.18
                decoration.userData.type = 'bell'
                decoration.userData.swingPhase = Math.random() * Math.PI * 2
            } else {
                // 创建蝴蝶结 - 增大尺寸
                const color = bowColors[Math.floor(Math.random() * bowColors.length)]
                decoration = this.createBow(0.22, color, position) // 从0.12增大到0.22
                decoration.userData.type = 'bow'
                decoration.userData.rotationPhase = Math.random() * Math.PI * 2
            }

            this.decorations.push(decoration)
            this.scene.add(decoration)
        }
    }

    /**
     * 更新装饰物动画
     */
    update(deltaTime = 0.016) {
        this.time += deltaTime

        this.decorations.forEach((decoration, index) => {
            if (decoration.userData.type === 'bell') {
                // 铃铛轻微摆动
                const swingAmount = Math.sin(this.time * 2 + decoration.userData.swingPhase) * 0.1
                decoration.rotation.z = swingAmount

                // 轻微旋转
                decoration.rotation.y += 0.005
            } else if (decoration.userData.type === 'bow') {
                // 蝴蝶结缓慢旋转
                decoration.rotation.y += 0.008

                // 轻微上下浮动
                const originalY = decoration.position.y
                decoration.position.y = originalY + Math.sin(this.time + decoration.userData.rotationPhase) * 0.01
            }
        })
    }

    /**
     * 销毁装饰物
     */
    dispose() {
        this.decorations.forEach(decoration => {
            this.scene.remove(decoration)
            decoration.traverse((child) => {
                if (child.isMesh) {
                    child.geometry.dispose()
                    child.material.dispose()
                }
            })
        })
        this.decorations = []
    }
}
