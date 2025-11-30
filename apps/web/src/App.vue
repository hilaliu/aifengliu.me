<script setup lang="ts">
const canvasRef = ref<HTMLCanvasElement | null>(null)

type Snowflake = {
  x: number
  y: number
  radius: number
  speedY: number
  baseSpeedX: number
  angle: number
  spin: number
  baseAlpha: number
  twinklePhase: number
}

const flakes: Snowflake[] = []
let ctx: CanvasRenderingContext2D | null = null
let animationId = 0
let dpr = 1
let width = 0
let height = 0

function pick<T>(arr: T[]): T {
  return arr[Math.floor(Math.random() * arr.length)]
}

function createFlake(): Snowflake {
  // 半径 [0.8, 3.2]，大一些的雪花下落更快，细致的小雪花数量更多
  const radius = (Math.random() ** 1.2) * 2.4 + 0.8
  const speedY = 0.6 + radius * 0.35 + Math.random() * 0.4
  return {
    x: Math.random() * width,
    y: Math.random() * height,
    radius,
    speedY,
    baseSpeedX: (Math.random() - 0.5) * 0.6, // 基础水平漂移
    angle: Math.random() * Math.PI * 2,
    spin: (Math.random() - 0.5) * 0.02, // 水平摆动速度
    baseAlpha: 0.55 + Math.random() * 0.45,
    twinklePhase: Math.random() * Math.PI * 2,
  }
}

function sizeCanvas() {
  const canvas = canvasRef.value
  if (!canvas)
    return
  dpr = Math.max(1, Math.min(2, window.devicePixelRatio || 1))
  width = window.innerWidth
  height = window.innerHeight
  canvas.width = Math.floor(width * dpr)
  canvas.height = Math.floor(height * dpr)
  canvas.style.width = `${width}px`
  canvas.style.height = `${height}px`
  ctx = canvas.getContext('2d')
  if (ctx) {
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0)
  }
}

function initFlakes() {
  // 按面积设定密度，保证不同分辨率观感一致；并做上限保护
  const density = 0.00012 // 每像素密度
  const target = Math.min(450, Math.max(120, Math.floor(width * height * density)))
  if (flakes.length > target) {
    flakes.length = target
  }
  else {
    while (flakes.length < target)
      flakes.push(createFlake())
  }
}

function draw() {
  if (!ctx)
    return

  // 主题检测（每帧读取，确保切换后即时生效）
  const isDark = document.documentElement.classList.contains('dark')
  const fillLight = 'rgba(185, 192, 210, 1)' // 亮色主题更偏灰蓝，避免“白底白雪”不明显
  const fillDark = 'rgba(255, 255, 255, 1)'
  const shadowLight = 'rgba(90, 100, 120, 0.35)'
  const shadowDark = 'rgba(255, 255, 255, 0.28)'

  ctx.clearRect(0, 0, width, height)

  for (const f of flakes) {
    // 水平轻微摆动 + 基础风向
    f.angle += f.spin
    const drift = Math.sin(f.angle) * (0.4 + f.radius * 0.08)
    const vx = f.baseSpeedX + drift
    const vy = f.speedY
    f.x += vx
    f.y += vy

    // 闪烁（twinkle）
    const alpha = f.baseAlpha * (0.78 + 0.22 * Math.sin(f.angle + f.twinklePhase))

    // 出界回收
    if (f.y - f.radius > height) {
      // 从顶部随机重新进入
      f.y = -f.radius - Math.random() * 20
      f.x = Math.random() * width
      f.baseSpeedX = (Math.random() - 0.5) * 0.6
    }
    if (f.x + f.radius < 0)
      f.x = width + f.radius
    else if (f.x - f.radius > width)
      f.x = -f.radius

    // 绘制雪花（圆形 + 轻微阴影以增强立体感）
    ctx.save()
    ctx.globalAlpha = alpha
    ctx.fillStyle = isDark ? fillDark : fillLight
    ctx.shadowBlur = Math.max(0, Math.min(16, f.radius * 2.2))
    ctx.shadowColor = isDark ? shadowDark : shadowLight
    ctx.beginPath()
    ctx.arc(f.x, f.y, f.radius, 0, Math.PI * 2)
    ctx.fill()
    ctx.restore()

    // 偶发的细节笔触（雪花尖角效果，低频率，开销可控）
    if (f.radius > 2.2 && Math.random() < 0.03) {
      ctx.save()
      ctx.globalAlpha = alpha * 0.6
      ctx.strokeStyle = isDark ? 'rgba(255,255,255,0.45)' : 'rgba(120,130,150,0.55)'
      ctx.lineWidth = 0.6
      const spokes = pick([4, 6])
      const len = f.radius * 1.6
      for (let i = 0; i < spokes; i++) {
        const t = (Math.PI * 2 * i) / spokes + f.angle * 0.5
        ctx.beginPath()
        ctx.moveTo(f.x + Math.cos(t) * (f.radius * 0.3), f.y + Math.sin(t) * (f.radius * 0.3))
        ctx.lineTo(f.x + Math.cos(t) * len, f.y + Math.sin(t) * len)
        ctx.stroke()
      }
      ctx.restore()
    }
  }

  animationId = requestAnimationFrame(draw)
}

function start() {
  sizeCanvas()
  initFlakes()
  cancelAnimationFrame(animationId)
  animationId = requestAnimationFrame(draw)
}

function handleResize() {
  sizeCanvas()
  initFlakes()
}

function handleVisibility() {
  if (document.hidden) {
    cancelAnimationFrame(animationId)
  }
  else {
    cancelAnimationFrame(animationId)
    animationId = requestAnimationFrame(draw)
  }
}

onMounted(() => {
  start()
  window.addEventListener('resize', handleResize, { passive: true })
  document.addEventListener('visibilitychange', handleVisibility)
})

onUnmounted(() => {
  window.removeEventListener('resize', handleResize)
  document.removeEventListener('visibilitychange', handleVisibility)
  cancelAnimationFrame(animationId)
})
</script>

<template>
  <canvas ref="canvasRef" class="app-bg" />
  <div class="app-content">
    <router-view />
  </div>
</template>

<style scoped>
.app-bg {
  position: fixed;
  inset: 0;
  width: 100%;
  height: 100%;
  pointer-events: none;
  z-index: 0;
}
.app-content {
  position: relative;
  z-index: 1;
}
</style>
