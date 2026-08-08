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

    // Create 3D Nodes representing Donors, Logistics, and NGO hubs
    const nodeCount = Math.min(Math.floor(width / 25), 45)
    const nodes = []

    const colors = [
      { r: 249, g: 115, b: 22, name: 'saffron' }, // Warm Saffron
      { r: 37, g: 99, b: 235, name: 'blue' },     // Ocean Blue
      { r: 245, g: 158, b: 11, name: 'amber' }    // Gold Amber
    ]

    for (let i = 0; i < nodeCount; i++) {
      const color = colors[i % colors.length]
      nodes.push({
        x: Math.random() * width,
        y: Math.random() * height,
        z: Math.random() * 500 + 100, // 3D depth
        radius: Math.random() * 4 + 2,
        color: color,
        vx: (Math.random() - 0.5) * 0.4,
        vy: (Math.random() - 0.5) * 0.4,
        vz: (Math.random() - 0.5) * 0.5,
        pulse: Math.random() * Math.PI * 2
      })
    }

    // Animation Loop
    const render = () => {
      ctx.clearRect(0, 0, width, height)

      // 1. Draw subtle 3D Mesh Connections
      for (let i = 0; i < nodes.length; i++) {
        for (let j = i + 1; j < nodes.length; j++) {
          const dx = nodes[i].x - nodes[j].x
          const dy = nodes[i].y - nodes[j].y
          const dist = Math.sqrt(dx * dx + dy * dy)

          if (dist < 180) {
            const alpha = (1 - dist / 180) * 0.18
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

      // 2. Draw 3D Floating Sphere Nodes with Depth Glow
      nodes.forEach((node) => {
        // Move in 3D
        node.x += node.vx
        node.y += node.vy
        node.z += node.vz
        node.pulse += 0.02

        // Bounce at boundaries
        if (node.x < 0 || node.x > width) node.vx *= -1
        if (node.y < 0 || node.y > height) node.vy *= -1
        if (node.z < 50 || node.z > 600) node.vz *= -1

        // Perspective projection formula
        const perspective = 400 / (node.z || 1)
        const currentRadius = Math.max(1, node.radius * perspective + Math.sin(node.pulse) * 0.8)

        // Outer 3D Glow Radial Gradient
        const glowRad = currentRadius * 4.5
        const radGrad = ctx.createRadialGradient(
          node.x, node.y, currentRadius * 0.5,
          node.x, node.y, glowRad
        )
        radGrad.addColorStop(0, `rgba(${node.color.r}, ${node.color.g}, ${node.color.b}, 0.6)`)
        radGrad.addColorStop(0.5, `rgba(${node.color.r}, ${node.color.g}, ${node.color.b}, 0.15)`)
        radGrad.addColorStop(1, `rgba(${node.color.r}, ${node.color.g}, ${node.color.b}, 0)`)

        ctx.beginPath()
        ctx.arc(node.x, node.y, glowRad, 0, Math.PI * 2)
        ctx.fillStyle = radGrad
        ctx.fill()

        // Core Solid Node
        ctx.beginPath()
        ctx.arc(node.x, node.y, currentRadius, 0, Math.PI * 2)
        ctx.fillStyle = `rgb(${node.color.r}, ${node.color.g}, ${node.color.b})`
        ctx.fill()
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
      {/* 3D Multi-Layered Soft Ambient Gradient Orbs */}
      <div
        style={{
          position: 'absolute',
          top: '-15%',
          left: '-10%',
          width: '55vw',
          height: '55vw',
          borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(249,115,22,0.14) 0%, rgba(249,115,22,0) 70%)',
          filter: 'blur(70px)',
          animation: 'float-3d-slow 18s ease-in-out infinite alternate'
        }}
      />
      <div
        style={{
          position: 'absolute',
          bottom: '-15%',
          right: '-10%',
          width: '60vw',
          height: '60vw',
          borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(37,99,235,0.12) 0%, rgba(37,99,235,0) 70%)',
          filter: 'blur(80px)',
          animation: 'float-3d-slow 22s ease-in-out infinite alternate-reverse'
        }}
      />
      <div
        style={{
          position: 'absolute',
          top: '35%',
          right: '25%',
          width: '40vw',
          height: '40vw',
          borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(245,158,11,0.08) 0%, rgba(245,158,11,0) 70%)',
          filter: 'blur(60px)',
          animation: 'float-3d-slow 15s ease-in-out infinite alternate'
        }}
      />

      {/* Interactive 3D Canvas Particle Mesh */}
      <canvas ref={canvasRef} style={{ display: 'block', width: '100%', height: '100%' }} />
    </div>
  )
}
