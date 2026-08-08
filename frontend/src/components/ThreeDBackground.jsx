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

    // Food & AI Network Symbols
    const foodSymbols = ['🌾', '🍎', '📦', '🍲', '🥑', '⚡', '🤖', '✨']
    const nodeCount = Math.min(Math.floor(width / 32), 36)
    const nodes = []

    const colorPalettes = [
      { r: 180, g: 43, b: 114 },  // Magenta #B42B72
      { r: 255, g: 107, b: 82 },  // Coral #FF6B52
      { r: 255, g: 135, b: 95 },  // Orange #FF875F
      { r: 75, g: 23, b: 111 }    // Deep Purple #4B176F
    ]

    // Create 3D Nodes
    for (let i = 0; i < nodeCount; i++) {
      const col = colorPalettes[i % colorPalettes.length]
      nodes.push({
        x: Math.random() * width,
        y: Math.random() * height,
        z: Math.random() * 600 + 100,
        symbol: foodSymbols[i % foodSymbols.length],
        color: col,
        vx: (Math.random() - 0.5) * 0.4,
        vy: (Math.random() - 0.5) * 0.4,
        vz: (Math.random() - 0.5) * 0.35,
        pulse: Math.random() * Math.PI * 2,
        rotation: Math.random() * Math.PI * 2,
        rotSpeed: (Math.random() - 0.5) * 0.015
      })
    }

    // Render loop
    const render = () => {
      ctx.clearRect(0, 0, width, height)

      // 1. Draw Network Connections
      for (let i = 0; i < nodes.length; i++) {
        for (let j = i + 1; j < nodes.length; j++) {
          const dx = nodes[i].x - nodes[j].x
          const dy = nodes[i].y - nodes[j].y
          const dist = Math.sqrt(dx * dx + dy * dy)

          if (dist < 180) {
            const alpha = (1 - dist / 180) * 0.22
            const grad = ctx.createLinearGradient(nodes[i].x, nodes[i].y, nodes[j].x, nodes[j].y)
            grad.addColorStop(0, `rgba(${nodes[i].color.r}, ${nodes[i].color.g}, ${nodes[i].color.b}, ${alpha})`)
            grad.addColorStop(1, `rgba(${nodes[j].color.r}, ${nodes[j].color.g}, ${nodes[j].color.b}, ${alpha})`)
            ctx.beginPath()
            ctx.moveTo(nodes[i].x, nodes[i].y)
            ctx.lineTo(nodes[j].x, nodes[j].y)
            ctx.strokeStyle = grad
            ctx.lineWidth = 1
            ctx.stroke()
          }
        }
      }

      // 2. Draw Floating Nodes
      nodes.forEach((node) => {
        node.x += node.vx
        node.y += node.vy
        node.z += node.vz
        node.pulse += 0.018
        node.rotation += node.rotSpeed

        if (node.x < -20 || node.x > width + 20) node.vx *= -1
        if (node.y < -20 || node.y > height + 20) node.vy *= -1
        if (node.z < 50 || node.z > 700) node.vz *= -1

        const perspective = 400 / (node.z || 1)
        const size = Math.max(10, 22 * perspective)

        // Radial Glow Aura
        const glowRad = size * 1.8
        const radGrad = ctx.createRadialGradient(
          node.x, node.y, size * 0.2,
          node.x, node.y, glowRad
        )
        radGrad.addColorStop(0, `rgba(${node.color.r}, ${node.color.g}, ${node.color.b}, 0.3)`)
        radGrad.addColorStop(1, `rgba(${node.color.r}, ${node.color.g}, ${node.color.b}, 0)`)

        ctx.beginPath()
        ctx.arc(node.x, node.y, glowRad, 0, Math.PI * 2)
        ctx.fillStyle = radGrad
        ctx.fill()

        // Core Floating Symbol
        ctx.save()
        ctx.translate(node.x, node.y)
        ctx.rotate(node.rotation)
        ctx.font = `${size}px sans-serif`
        ctx.textAlign = 'center'
        ctx.textBaseline = 'middle'
        ctx.globalAlpha = Math.min(0.8, perspective * 0.75)
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
      {/* Blurred Ambient Glow Orbs matching reference image */}
      <div
        style={{
          position: 'absolute',
          top: '-15%',
          left: '-10%',
          width: '50vw',
          height: '50vw',
          borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(75,23,111,0.45) 0%, rgba(53,19,95,0) 70%)',
          filter: 'blur(90px)',
          animation: 'float-3d-slow 22s ease-in-out infinite alternate'
        }}
      />
      <div
        style={{
          position: 'absolute',
          bottom: '-15%',
          right: '-10%',
          width: '55vw',
          height: '55vw',
          borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(255,107,82,0.4) 0%, rgba(255,135,95,0) 70%)',
          filter: 'blur(100px)',
          animation: 'float-3d-slow 25s ease-in-out infinite alternate-reverse'
        }}
      />
      <div
        style={{
          position: 'absolute',
          top: '35%',
          right: '15%',
          width: '40vw',
          height: '40vw',
          borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(180,43,114,0.3) 0%, rgba(180,43,114,0) 70%)',
          filter: 'blur(80px)',
          animation: 'float-3d-slow 18s ease-in-out infinite alternate'
        }}
      />

      <canvas ref={canvasRef} style={{ display: 'block', width: '100%', height: '100%' }} />
    </div>
  )
}
