import * as THREE from 'three'

/**
 * 礼物盒类
 * 创建精致的礼物盒模型
 */
export class GiftBoxes {
    /**
     * @param {THREE.Scene} scene - Three.js场景
     */
    constructor(scene) {
        this.scene = scene
        this.gifts = []

        this.createGiftBoxes()
    }

    /**
     * 创建单个礼物盒
     */
    createGiftBox(size, boxColor, ribbonColor, position) {
        const group = new THREE.Group()

        // 主礼物盒 - 改进材质让它看起来更像包装纸
        const boxGeometry = new THREE.BoxGeometry(size, size, size)
        const boxMaterial = new THREE.MeshStandardMaterial({
            color: boxColor,
            metalness: 0.05, // 降低金属度，包装纸不是金属
            roughness: 0.8,  // 提高粗糙度，包装纸是粗糙的
            emissive: boxColor,
            emissiveIntensity: 0.02 // 大幅降低发光
        })
        const box = new THREE.Mesh(boxGeometry, boxMaterial)
        group.add(box)

        // 丝带 - 垂直方向，更有光泽
        const ribbonWidth = size * 0.15
        const ribbonGeometry = new THREE.BoxGeometry(ribbonWidth, size * 1.02, ribbonWidth)
        const ribbonMaterial = new THREE.MeshStandardMaterial({
            color: ribbonColor,
            metalness: 0.4,  // 丝带有一定光泽
            roughness: 0.4,
            emissive: ribbonColor,
            emissiveIntensity: 0.05 // 降低发光
        })

        const ribbon1 = new THREE.Mesh(ribbonGeometry, ribbonMaterial)
        group.add(ribbon1)

        const ribbon2 = new THREE.Mesh(ribbonGeometry, ribbonMaterial)
        ribbon2.rotation.y = Math.PI / 2
        group.add(ribbon2)

        // 蝴蝶结 - 中心球
        const bowCenterGeometry = new THREE.SphereGeometry(size * 0.12, 16, 16)
        const bowMaterial = new THREE.MeshStandardMaterial({
            color: ribbonColor,
            metalness: 0.5,
            roughness: 0.3,
            emissive: ribbonColor,
            emissiveIntensity: 0.1 // 降低发光
        })
        const bowCenter = new THREE.Mesh(bowCenterGeometry, bowMaterial)
        bowCenter.position.y = size * 0.5
        group.add(bowCenter)

        // 蝴蝶结 - 左右两个环
        const bowLoopGeometry = new THREE.TorusGeometry(size * 0.15, size * 0.05, 8, 16)

        const bowLeft = new THREE.Mesh(bowLoopGeometry, bowMaterial)
        bowLeft.position.set(-size * 0.2, size * 0.5, 0)
        bowLeft.rotation.y = Math.PI / 2
        bowLeft.rotation.z = Math.PI / 6
        group.add(bowLeft)

        const bowRight = new THREE.Mesh(bowLoopGeometry, bowMaterial)
        bowRight.position.set(size * 0.2, size * 0.5, 0)
        bowRight.rotation.y = Math.PI / 2
        bowRight.rotation.z = -Math.PI / 6
        group.add(bowRight)

        // 蝴蝶结 - 飘带
        const ribbonTailGeometry = new THREE.BoxGeometry(size * 0.08, size * 0.25, size * 0.04)

        const ribbonTail1 = new THREE.Mesh(ribbonTailGeometry, bowMaterial)
        ribbonTail1.position.set(-size * 0.15, size * 0.3, 0)
        ribbonTail1.rotation.z = Math.PI / 8
        group.add(ribbonTail1)

        const ribbonTail2 = new THREE.Mesh(ribbonTailGeometry, bowMaterial)
        ribbonTail2.position.set(size * 0.15, size * 0.3, 0)
        ribbonTail2.rotation.z = -Math.PI / 8
        group.add(ribbonTail2)

        // 设置位置
        group.position.copy(position)
        group.position.y = size / 2 // 放在地面上

        // 添加随机旋转
        group.rotation.y = Math.random() * Math.PI * 2

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
     * 创建多个礼物盒
     */
    createGiftBoxes() {
        // 定义礼物盒配置
        const giftConfigs = [
            {
                size: 0.4,
                boxColor: 0xff3333,
                ribbonColor: 0xffdd00,
                position: new THREE.Vector3(1.2, 0, 0.8)
            },
            {
                size: 0.35,
                boxColor: 0x3366ff,
                ribbonColor: 0xffffff,
                position: new THREE.Vector3(-1.0, 0, 1.0)
            },
            {
                size: 0.45,
                boxColor: 0x33ff66,
                ribbonColor: 0xff3366,
                position: new THREE.Vector3(0.5, 0, -1.2)
            },
            {
                size: 0.3,
                boxColor: 0xff9933,
                ribbonColor: 0x9933ff,
                position: new THREE.Vector3(-1.3, 0, -0.7)
            },
            {
                size: 0.38,
                boxColor: 0xff66cc,
                ribbonColor: 0x33ffff,
                position: new THREE.Vector3(0.2, 0, 1.5)
            }
        ]

        // 创建所有礼物盒
        giftConfigs.forEach(config => {
            const gift = this.createGiftBox(
                config.size,
                config.boxColor,
                config.ribbonColor,
                config.position
            )
            this.gifts.push(gift)
            this.scene.add(gift)
        })
    }

    /**
     * 更新礼物盒动画（轻微浮动效果）
     */
    update(time) {
        this.gifts.forEach((gift, index) => {
            // 轻微的上下浮动
            const baseY = gift.children[0].geometry.parameters.width / 2
            gift.position.y = baseY + Math.sin(time * 0.5 + index) * 0.02

            // 轻微的旋转
            gift.rotation.y += 0.001
        })
    }

    /**
     * 销毁礼物盒
     */
    dispose() {
        this.gifts.forEach(gift => {
            this.scene.remove(gift)
            gift.traverse((child) => {
                if (child.isMesh) {
                    child.geometry.dispose()
                    child.material.dispose()
                }
            })
        })
        this.gifts = []
    }
}
