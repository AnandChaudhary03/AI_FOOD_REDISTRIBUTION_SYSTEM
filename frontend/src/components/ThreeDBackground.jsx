import React, { useEffect, useRef } from 'react'

export default function ThreeDBackground() {
  const canvasRef = useRef(null)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    let animationFrameId

    let width = (canvas.width = window.innerWidth)
    let height = (canvas.height = window.innerHeight)

    const handleResize = () => {
      if (!canvas) return
      width = canvas.width = window.innerWidth
      height = canvas.height = window.innerHeight
    }

    window.addEventListener('resize', handleResize)

    // Food Salvage Symbols & Nodes matching reference image palette
    const foodSymbols = ['🌾', '🍎', '📦', '🍲', '🥑', '🍞', '💛']
    const nodeCount = Math.min(Math.floor(width / 30), 38)
    const nodes = []

    const colorPalettes = [
      { r: 124, g: 58, b: 237 },  // Deep Purple
      { r: 249, g: 115, b: 22 },  // Saffron Orange
      { r: 245, g: 158, b: 11 },  // Gold Amber
      { r: 236, g: 72, b: 153 }   // Pink Coral
    ]

    // Create 3D Floating Food Nodes
    for (let i = 0; i < nodeCount; i++) {
      const col = colorPalettes[i % colorPalettes.length]
      nodes.push({
        x: Math.random() * width,
        y: Math.random() * height,
        z: Math.random() * 600 + 100,
        symbol: foodSymbols[i % foodSymbols.length],
        color: col,
        vx: (Math.random() - 0.5) * 0.45,
        vy: (Math.random() - 0.5) * 0.45,
        vz: (Math.random() - 0.5) * 0.4,
        pulse: Math.random() * Math.PI * 2,
        rotation: Math.random() * Math.PI * 2,
        rotSpeed: (Math.random() - 0.5) * 0.02
      })
    }

    // Render loop
    const render = () => {
      ctx.clearRect(0, 0, width, height)

      // 1. Draw 3D Food Network Bridge Mesh Lines
      for (let i = 0; i < nodes.length; i++) {
        for (let j = i + 1; j < nodes.length; j++) {
          const dx = nodes[i].x - nodes[j].x
          const dy = nodes[i].y - nodes[j].y
          const dist = Math.sqrt(dx * dx + dy * dy)

          if (dist < 190) {
            const alpha = (1 - dist / 190) * 0.28
            const grad = ctx.createLinearGradient(nodes[i].x, nodes[i].y, nodes[j].x, nodes[j].y)
            grad.addColorStop(0, `rgba(${nodes[i].color.r}, ${nodes[i].color.g}, ${nodes[i].color.b}, ${alpha})`)
            grad.addColorStop(1, `rgba(${nodes[j].color.r}, ${nodes[j].color.g}, ${nodes[j].color.b}, ${alpha})`)
            ctx.beginPath()
            ctx.moveTo(nodes[i].x, nodes[i].y)
            ctx.lineTo(nodes[j].x, nodes[j].y)
            ctx.strokeStyle = grad
            ctx.lineWidth = 1.2
            ctx.stroke()
          }
        }
      }

      // 2. Draw 3D Food Salvage Nodes & Floating Icons
      nodes.forEach((node) => {
        node.x += node.vx
        node.y += node.vy
        node.z += node.vz
        node.pulse += 0.02
        node.rotation += node.rotSpeed

        if (node.x < -20 || node.x > width + 20) node.vx *= -1
        if (node.y < -20 || node.y > height + 20) node.vy *= -1
        if (node.z < 50 || node.z > 700) node.vz *= -1

        const perspective = 400 / (node.z || 1)
        const size = Math.max(12, 24 * perspective)

        // 3D Glow Aura
        const glowRad = size * 1.8
        const radGrad = ctx.createRadialGradient(
          node.x, node.y, size * 0.2,
          node.x, node.y, glowRad
        )
        radGrad.addColorStop(0, `rgba(${node.color.r}, ${node.color.g}, ${node.color.b}, 0.35)`)
        radGrad.addColorStop(1, `rgba(${node.color.r}, ${node.color.g}, ${node.color.b}, 0)`)

        ctx.beginPath()
        ctx.arc(node.x, node.y, glowRad, 0, Math.PI * 2)
        ctx.fillStyle = radGrad
        ctx.fill()

        // 3D Floating Food Symbol
        ctx.save()
        ctx.translate(node.x, node.y)
        ctx.rotate(node.rotation)
        ctx.font = `${size}px sans-serif`
        ctx.textAlign = 'center'
        ctx.textBaseline = 'middle'
        ctx.globalAlpha = Math.min(0.85, perspective * 0.8)
        ctx.fillText(node.symbol, 0, 0)
        ctx.restore()
      })

      animationFrameId = requestAnimationFrame(render)
    }

    render()

    return () => {
      window.removeEventListener('resize', handleResize)
      cancelAnimationFrame(animationFrameId)
    }
  }, [])

  return (
    <div style={{ position: 'fixed', inset: 0, pointerEvents: 'none', zIndex: 0, overflow: 'hidden' }}>
      {/* Exact Reference Ambient Gradient Orbs (Purple Top-Left to Coral Saffron Bottom-Right) */}
      <div
        style={{
          position: 'absolute',
          top: '-20%',
          left: '-15%',
          width: '65vw',
          height: '65vw',
          borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(124,58,237,0.35) 0%, rgba(124,58,237,0) 70%)',
          filter: 'blur(80px)',
          animation: 'float-3d-slow 20s ease-in-out infinite alternate'
        }}
      />
      <div
        style={{
          position: 'absolute',
          bottom: '-20%',
          right: '-15%',
          width: '70vw',
          height: '70vw',
          borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(249,115,22,0.35) 0%, rgba(249,115,22,0) 70%)',
          filter: 'blur(90px)',
          animation: 'float-3d-slow 24s ease-in-out infinite alternate-reverse'
        }}
      />

      {/* 3D Food Salvage Canvas Mesh */}
      <canvas ref={canvasRef} style={{ display: 'block', width: '100%', height: '100%' }} />
    </div>
  )
}
