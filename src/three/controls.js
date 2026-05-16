import GUI from 'lil-gui'

/**
 * 控制器类 - 分页式控制面板
 * 不使用folder，直接控制控制器的显示/隐藏
 */
export class Controls {
  constructor(params, renderer, scene, callbacks) {
    this.renderer = renderer
    this.scene = scene
    this.params = params
    this.callbacks = callbacks
    this.isOpen = true // 默认展开
    this.currentPage = 0
    this.pages = []

    // 创建主GUI容器
    this.gui = new GUI({ title: '控制面板', autoPlace: false })
    this.gui.domElement.classList.add('paginated-gui')
    document.body.appendChild(this.gui.domElement)

    // 设置所有页面的控制器
    this.setupPages()

    // 设置UI结构
    this.setupUI()

    // 设置切换按钮
    this.setupToggleButton()

    // 显示第一页
    this.showPage(0)
  }

  setupPages() {
    const { params, callbacks } = this
    const { onTreeUpdate, onStarUpdate, onParticleSize, onOpacityChange, onSnowUpdate, onBalloonUpdate } = callbacks

    // 页面1: 圣诞树
    this.pages.push({ name: '🎄 圣诞树', controllers: [] })
    const p1 = this.pages[0]
    p1.controllers.push(this.gui.add(params, '树高', 2, 10, 0.5).name('高度').onChange(() => { onTreeUpdate(); onStarUpdate() }))
    p1.controllers.push(this.gui.add(params, '树宽', 1, 5, 0.2).name('宽度').onChange(onTreeUpdate))
    p1.controllers.push(this.gui.add(params, '粒子数量', 1000, 15000, 100).name('粒子数量').onChange(onTreeUpdate))
    p1.controllers.push(this.gui.add(params, '粒子大小', 0.01, 0.2, 0.01).name('粒子大小').onChange(onParticleSize))
    p1.controllers.push(this.gui.add(params, '透明度', 0, 1, 0.1).name('透明度').onChange(onOpacityChange))
    p1.controllers.push(this.gui.add(params, '旋转速度', 0, 0.01, 0.001).name('旋转速度'))
    p1.controllers.push(this.gui.add(params, '闪耀大小', 0.1, 1.0, 0.1).name('闪耀大小').onChange((value) => {
      const tree = this.scene.scene.children.find((child) => child.name === 'treeParticles')
      if (tree) tree.material.uniforms.glowSize.value = value
    }))

    // 页面2: 星星
    this.pages.push({ name: '⭐ 星星', controllers: [] })
    this.pages[1].controllers.push(this.gui.add(params, '星星大小', 0.1, 1, 0.1).name('大小').onFinishChange(onStarUpdate))

    // 页面3: 雪花
    if (!params.雪花) params.雪花 = { 密度: 2000, 速度: 0.5 }
    this.pages.push({ name: '❄️ 雪花', controllers: [] })
    const p3 = this.pages[2]
    p3.controllers.push(this.gui.add(params.雪花, '密度', 500, 5000, 100).name('雪花数量').onChange(() => { if (onSnowUpdate) onSnowUpdate() }))
    p3.controllers.push(this.gui.add(params.雪花, '速度', 0.1, 0.5, 0.1).name('下落速度').onChange(() => { if (onSnowUpdate) onSnowUpdate() }))

    // 页面4: 气球
    if (!params.气球) params.气球 = { 数量: 10, 大小: 0.15 }
    this.pages.push({ name: '🎈 气球', controllers: [] })
    this.pages[3].controllers.push(this.gui.add(params.气球, '数量', 5, 20, 1).name('气球数量').onChange(() => { if (onBalloonUpdate) onBalloonUpdate() }))

    // 页面5: 发光效果
    this.pages.push({ name: '✨ 发光效果', controllers: [] })
    const p5 = this.pages[4]
    p5.controllers.push(this.gui.add(params.后期处理, '发光强度', 0, 3, 0.1).name('强度').onChange((v) => (this.renderer.bloomPass.strength = v)))
    p5.controllers.push(this.gui.add(params.后期处理, '发光半径', 0, 1, 0.01).name('半径').onChange((v) => (this.renderer.bloomPass.radius = v)))
    p5.controllers.push(this.gui.add(params.后期处理, '发光阈值', 0, 1, 0.01).name('阈值').onChange((v) => (this.renderer.bloomPass.threshold = v)))
    p5.controllers.push(this.gui.add(params.后期处理, '曝光度', 0, 2, 0.1).name('曝光度').onChange((v) => (this.renderer.renderer.toneMappingExposure = v)))

    // 初始隐藏所有控制器
    this.pages.forEach(page => {
      page.controllers.forEach(ctrl => { ctrl.domElement.style.display = 'none' })
    })
  }

  setupUI() {
    // 创建页面标题
    const pageTitle = document.createElement('div')
    pageTitle.className = 'gui-page-title'
    this.pageTitle = pageTitle

    // 创建固定高度的内容包装器
    const contentWrapper = document.createElement('div')
    contentWrapper.className = 'gui-content-wrapper'

    // 包装children容器
    const childrenContainer = this.gui.domElement.querySelector('.children')
    childrenContainer.parentNode.insertBefore(contentWrapper, childrenContainer)
    contentWrapper.appendChild(childrenContainer)

    // 插入标题
    const guiTitle = this.gui.domElement.querySelector('.title')
    guiTitle.parentNode.insertBefore(pageTitle, guiTitle.nextSibling)

    // 创建分页控制
    const paginationDiv = document.createElement('div')
    paginationDiv.className = 'gui-pagination'

    const prevBtn = document.createElement('button')
    prevBtn.className = 'gui-page-btn'
    prevBtn.innerHTML = '◀'
    prevBtn.addEventListener('click', () => this.prevPage())

    const pageIndicator = document.createElement('div')
    pageIndicator.className = 'gui-page-indicator'
    this.pageIndicator = pageIndicator

    const nextBtn = document.createElement('button')
    nextBtn.className = 'gui-page-btn'
    nextBtn.innerHTML = '▶'
    nextBtn.addEventListener('click', () => this.nextPage())

    paginationDiv.appendChild(prevBtn)
    paginationDiv.appendChild(pageIndicator)
    paginationDiv.appendChild(nextBtn)
    this.gui.domElement.appendChild(paginationDiv)

    this.prevBtn = prevBtn
    this.nextBtn = nextBtn
  }

  showPage(index) {
    if (index < 0 || index >= this.pages.length) return

    // 隐藏所有控制器
    this.pages.forEach(page => {
      page.controllers.forEach(ctrl => { ctrl.domElement.style.display = 'none' })
    })

    // 显示当前页控制器
    this.currentPage = index
    this.pages[index].controllers.forEach(ctrl => { ctrl.domElement.style.display = '' })

    // 更新UI
    this.pageTitle.textContent = this.pages[index].name
    this.pageIndicator.textContent = `${index + 1} / ${this.pages.length}`
    this.prevBtn.disabled = index === 0
    this.nextBtn.disabled = index === this.pages.length - 1
  }

  prevPage() {
    if (this.currentPage > 0) this.showPage(this.currentPage - 1)
  }

  nextPage() {
    if (this.currentPage < this.pages.length - 1) this.showPage(this.currentPage + 1)
  }

  setupToggleButton() {
    // 创建关闭按钮，添加到标题栏
    const closeBtn = document.createElement('button')
    closeBtn.className = 'gui-close-btn'
    closeBtn.innerHTML = '×'
    closeBtn.title = '收起控制面板'

    closeBtn.addEventListener('click', (e) => {
      e.stopPropagation()
      this.isOpen = false
      this.gui.domElement.classList.add('collapsed')
      this.expandBtn.style.display = 'block'
    })

    const guiTitle = this.gui.domElement.querySelector('.title')
    guiTitle.appendChild(closeBtn)

    // 创建展开按钮（当面板收起时显示）
    const expandBtn = document.createElement('div')
    expandBtn.className = 'gui-expand-btn'
    expandBtn.innerHTML = '❮'
    expandBtn.title = '展开控制面板'
    expandBtn.style.display = 'none' // 初始隐藏

    expandBtn.addEventListener('click', () => {
      this.isOpen = true
      this.gui.domElement.classList.remove('collapsed')
      expandBtn.style.display = 'none'
    })

    document.body.appendChild(expandBtn)
    this.expandBtn = expandBtn
  }
}
