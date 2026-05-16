<script setup>
import { onMounted, ref } from 'vue'
import { Scene } from '../three/scene'
import { Renderer } from '../three/renderer'
import { ChristmasTree } from '../three/christmasTree'
import { Controls } from '../three/controls'
import { Snow } from '../three/snow'
import { GiftBoxes } from '../three/giftBoxes'
import { MusicalElements } from '../three/musicalElements'
import { Balloons } from '../three/balloons'
// 用于存储Three.js渲染容器的引用
const container = ref(null)

onMounted(() => {
  // 定义场景参数配置对象
  const params = {
    粒子数量: 5000,      // 控制圣诞树粒子的数量
    粒子大小: 0.05,      // 控制单个粒子的大小
    闪耀大小: 0.7,       // 控制粒子的闪耀效果大小
    树高: 5,            // 控制圣诞树的高度
    树宽: 2,            // 控制圣诞树的宽度
    旋转速度: 0.002,     // 控制圣诞树的旋转速度
    透明度: 0.8,        // 控制粒子的透明度
    星星大小: 0.2,       // 控制顶部星星的大小
    星星颜色: '#ffff00', // 控制顶部星星的颜色
    后期处理: {
      发光强度: 0.5,     // 控制泛光效果的强度
      发光半径: 0.4,     // 控制泛光效果的扩散范围
      发光阈值: 0,       // 控制泛光效果的阈值
      曝光度: 1.0        // 控制整体场景的曝光程度
    },
    雪花: {
      密度: 2000,          // 雪花数量
      速度: 0.5            // 雪花下落速度
    },
    气球: {
      数量: 10,            // 气球数量
      大小: 0.15           // 气球大小
    }
  }

  // 创建场景管理器实例
  const sceneManager = new Scene(container.value)
  // 创建渲染器实例
  const renderer = new Renderer(container.value)

  // 设置后期处理效果
  renderer.setupPostProcessing(sceneManager.scene, sceneManager.camera, params)

  // 创建圣诞树实例
  const christmasTree = new ChristmasTree(sceneManager.scene, params)

  // 创建雪花效果
  let snow = new Snow(sceneManager.scene, {
    count: params.雪花.密度,
    size: 0.05,
    area: 15,
    height: 10,
    speed: params.雪花.速度
  })

  // 创建礼物盒
  const giftBoxes = new GiftBoxes(sceneManager.scene)

  // 创建音乐元素（音符、爱心、星星）
  const musicalElements = new MusicalElements(sceneManager.scene, params)

  // 创建气球装饰
  let balloons = new Balloons(sceneManager.scene, params)

  // 创建控制面板，并设置各种参数变化时的回调函数
  new Controls(params, renderer, sceneManager, {
    onTreeUpdate: () => christmasTree.createTree(),        // 树参数变化时重新创建树
    onStarUpdate: () => christmasTree.loadStar(),         // 星星参数变化时重新加载星星
    onParticleSize: () => (christmasTree.points.material.size = params.粒子大小),  // 更新粒子大小
    onOpacityChange: () => (christmasTree.points.material.opacity = params.透明度),  // 更新透明度
    onSnowUpdate: () => {
      // 雪花参数变化时重新创建雪花
      snow.dispose()
      snow = new Snow(sceneManager.scene, {
        count: params.雪花.密度,
        size: 0.05,
        area: 15,
        height: 10,
        speed: params.雪花.速度
      })
    },
    onBalloonUpdate: () => {
      // 气球参数变化时重新创建气球
      balloons.dispose()
      balloons = new Balloons(sceneManager.scene, params)
    }
  })

  // 定义动画循环函数
  const animate = () => {
    requestAnimationFrame(animate)  // 请求下一帧动画
    christmasTree.update()         // 更新圣诞树状态
    snow.update()                  // 更新雪花动画
    giftBoxes.update(christmasTree.time)  // 更新礼物盒动画
    musicalElements.update()       // 更新音乐元素动画
    balloons.update()              // 更新气球动画
    sceneManager.update()          // 更新场景状态
    renderer.render(sceneManager.scene, sceneManager.camera)  // 渲染场景
  }

  // 启动动画循环
  animate()

  // 监听窗口大小变化，更新渲染尺寸
  window.addEventListener('resize', () => {
    sceneManager.handleResize()
    renderer.handleResize()
  })
})
</script>

<template>
  <div
    class="canvas-container"
    ref="container"
  ></div>
</template>

<style scoped>
.canvas-container {
  width: 100vw;
  height: 100vh;
  position: fixed;
  top: 0;
  left: 0;
  background: radial-gradient(ellipse at bottom, #1b2735 0%, #090a0f 100%);
}
</style>
