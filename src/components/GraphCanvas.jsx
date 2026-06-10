import { useRef, useEffect } from 'react'
import * as d3 from 'd3'

const R = 22          // node radius
const DRAGLET_Y = 38  // draglet offset below node centre

const PALETTE = [
  '#22d3ee', // cyan-400
  '#a78bfa', // violet-400
  '#fb923c', // orange-400
  '#4ade80', // green-400
  '#f472b6', // pink-400
  '#60a5fa', // blue-400
  '#facc15', // yellow-400
  '#34d399', // emerald-400
]

function nodeColor(labels) {
  if (!labels?.length) return PALETTE[0]
  const hash = [...labels[0]].reduce((h, c) => h + c.charCodeAt(0), 0)
  return PALETTE[hash % PALETTE.length]
}

function nodeName(node) {
  const candidates = ['name', 'title', 'label', 'qualifier', 'number']
  for (const k of candidates) {
    if (node.data?.[k] != null) return String(node.data[k])
  }
  const first = Object.values(node.data || {})[0]
  return first != null ? String(first).slice(0, 20) : `#${node.id}`
}

function linkPath(d) {
  const sx = d.source.x ?? 0, sy = d.source.y ?? 0
  const tx = d.target.x ?? 0, ty = d.target.y ?? 0
  if (d.source === d.target || d.source.id === d.target.id) {
    return `M${sx},${sy} C${sx + 70},${sy - 70} ${sx + 70},${sy + 70} ${sx},${sy}`
  }
  const dx = tx - sx, dy = ty - sy
  const dr = Math.sqrt(dx * dx + dy * dy) * 1.4
  return `M${sx},${sy} A${dr},${dr} 0 0,1 ${tx},${ty}`
}

export default function GraphCanvas({
  nodes, links, selectedId,
  onNodeSelect, onNodeRightClick, onDragletDrop, onNodeHover, onBackground,
}) {
  const svgRef = useRef(null)
  const simRef = useRef(null)
  const layersRef = useRef({})
  const sizeRef = useRef({ w: 800, h: 600 })
  const cbRef = useRef({})
  const connRef = useRef(null) // connector line during draglet drag

  // Keep callbacks current without re-triggering effects
  cbRef.current = { onNodeSelect, onNodeRightClick, onDragletDrop, onNodeHover, onBackground }

  // ── Initialise D3 once ──────────────────────────────────
  useEffect(() => {
    const el = svgRef.current
    const { width: w, height: h } = el.getBoundingClientRect()
    sizeRef.current = { w, h }

    const svg = d3.select(el)
      .attr('width', w).attr('height', h)

    svg.on('click', (e) => { if (e.target === el) cbRef.current.onBackground?.() })

    // Defs: arrow marker + glow filter
    const defs = svg.append('defs')

    defs.append('marker')
      .attr('id', 'arrow')
      .attr('viewBox', '0 -5 10 10')
      .attr('refX', R + 14)
      .attr('refY', 0)
      .attr('markerWidth', 7)
      .attr('markerHeight', 7)
      .attr('orient', 'auto')
      .append('path')
      .attr('d', 'M0,-5L10,0L0,5')
      .attr('fill', '#f97316')

    const glow = defs.append('filter').attr('id', 'glow')
    glow.append('feGaussianBlur').attr('stdDeviation', '3').attr('result', 'blur')
    const merge = glow.append('feMerge')
    merge.append('feMergeNode').attr('in', 'blur')
    merge.append('feMergeNode').attr('in', 'SourceGraphic')

    // Layer order: links → link-labels → nodes → labels → draglets
    const layers = {}
    for (const cls of ['g-links', 'g-link-labels', 'g-nodes', 'g-node-labels', 'g-draglets']) {
      layers[cls] = svg.append('g').attr('class', cls)
    }

    // Persistent connector line for draglet drag preview
    connRef.current = svg.append('line')
      .attr('class', 'connector')
      .attr('stroke', '#22d3ee')
      .attr('stroke-width', 2)
      .attr('stroke-dasharray', '6 4')
      .attr('pointer-events', 'none')
      .attr('opacity', 0)

    layersRef.current = layers

    // Force simulation
    simRef.current = d3.forceSimulation()
      .force('link', d3.forceLink().id(d => d.id).distance(160).strength(0.4))
      .force('charge', d3.forceManyBody().strength(-600))
      .force('center', d3.forceCenter(w / 2, h / 2))
      .force('collision', d3.forceCollide(R + 12))
      .alphaDecay(0.025)
      .on('tick', () => {
        const { w: W, h: H } = sizeRef.current

        layers['g-links'].selectAll('path')
          .attr('d', linkPath)

        layers['g-link-labels'].selectAll('text')
          .attr('x', d => ((d.source.x ?? 0) + (d.target.x ?? 0)) / 2)
          .attr('y', d => ((d.source.y ?? 0) + (d.target.y ?? 0)) / 2 - 6)

        layers['g-nodes'].selectAll('circle')
          .attr('cx', d => { d.x = Math.max(R, Math.min(W - R, d.x)); return d.x })
          .attr('cy', d => { d.y = Math.max(R, Math.min(H - R, d.y)); return d.y })

        layers['g-node-labels'].selectAll('text')
          .attr('x', d => d.x ?? W / 2)
          .attr('y', d => (d.y ?? H / 2) + R + 14)

        layers['g-draglets'].selectAll('circle')
          .attr('cx', d => d.x ?? W / 2)
          .attr('cy', d => (d.y ?? H / 2) + DRAGLET_Y)
      })

    // Resize observer
    const ro = new ResizeObserver(([entry]) => {
      const { width, height } = entry.contentRect
      sizeRef.current = { w: width, h: height }
      svg.attr('width', width).attr('height', height)
      simRef.current?.force('center', d3.forceCenter(width / 2, height / 2))
      simRef.current?.alpha(0.1).restart()
    })
    ro.observe(el)

    return () => {
      simRef.current?.stop()
      ro.disconnect()
    }
  }, [])

  // ── Update graph data ───────────────────────────────────
  useEffect(() => {
    const sim = simRef.current
    const layers = layersRef.current
    if (!sim || !Object.keys(layers).length) return

    const { w, h } = sizeRef.current

    // Preserve existing node positions
    const posMap = new Map(sim.nodes().map(n => [n.id, { x: n.x, y: n.y, vx: n.vx, vy: n.vy, fx: n.fx, fy: n.fy }]))

    const simNodes = nodes.map(n => ({
      ...n,
      ...(posMap.get(n.id) ?? {
        x: w / 2 + (Math.random() - 0.5) * 200,
        y: h / 2 + (Math.random() - 0.5) * 200,
      }),
    }))

    const simLinks = links.map(l => ({
      ...l,
      source: typeof l.source === 'object' ? l.source.id : l.source,
      target: typeof l.target === 'object' ? l.target.id : l.target,
    }))

    sim.nodes(simNodes)
    sim.force('link').links(simLinks)

    // ── Links ──
    const linkSel = layers['g-links'].selectAll('path')
      .data(simLinks, d => d.id)
    linkSel.exit().remove()
    linkSel.enter().append('path')
      .attr('fill', 'none')
      .attr('stroke', '#475569')
      .attr('stroke-width', 2)
      .attr('marker-end', 'url(#arrow)')

    // ── Link labels ──
    const llSel = layers['g-link-labels'].selectAll('text')
      .data(simLinks, d => d.id)
    llSel.exit().remove()
    llSel.enter().append('text')
      .attr('text-anchor', 'middle')
      .text(d => d.type)

    // ── Nodes ──
    const nodeSel = layers['g-nodes'].selectAll('circle')
      .data(simNodes, d => d.id)

    nodeSel.exit().remove()

    const nodeEnter = nodeSel.enter().append('circle')
      .attr('r', R)
      .attr('stroke-width', 3)
      .attr('filter', 'url(#glow)')
      .on('click', (e, d) => { e.stopPropagation(); cbRef.current.onNodeSelect?.(d.id) })
      .on('contextmenu', (e, d) => { e.preventDefault(); e.stopPropagation(); cbRef.current.onNodeRightClick?.(d, e.clientX, e.clientY) })
      .on('mouseover', (e, d) => {
        d3.select(e.currentTarget).attr('r', R + 5).attr('stroke', '#22d3ee').raise()
        cbRef.current.onNodeHover?.(d, e.clientX, e.clientY)
      })
      .on('mouseout', (e, d) => {
        d3.select(e.currentTarget).attr('r', R).attr('stroke', d.fx != null ? '#f97316' : '#1e293b')
        cbRef.current.onNodeHover?.(null)
      })
      .on('dblclick', (e, d) => {
        d.fx = null; d.fy = null
        d3.select(e.currentTarget).attr('stroke', '#1e293b')
        sim.alpha(0.1).restart()
      })
      .call(
        d3.drag()
          .on('start', (e, d) => {
            e.sourceEvent.stopPropagation()
            if (!e.active) sim.alphaTarget(0.3).restart()
            d.fx = d.x; d.fy = d.y
          })
          .on('drag', (e, d) => { d.fx = e.x; d.fy = e.y })
          .on('end', (e, d) => {
            if (!e.active) sim.alphaTarget(0)
            d3.select(e.sourceEvent.target).attr('stroke', '#f97316')
          })
      )

    nodeEnter.merge(nodeSel)
      .attr('fill', d => nodeColor(d.labels))
      .attr('stroke', d => d.id === selectedId ? '#f43f5e' : (d.fx != null ? '#f97316' : '#1e293b'))

    // ── Node labels ──
    const labelSel = layers['g-node-labels'].selectAll('text')
      .data(simNodes, d => d.id)
    labelSel.exit().remove()
    labelSel.enter().append('text')
      .attr('text-anchor', 'middle')
      .merge(labelSel)
      .text(d => nodeName(d))

    // ── Draglets ──
    const dragletSel = layers['g-draglets'].selectAll('circle')
      .data(simNodes, d => d.id)
    dragletSel.exit().remove()
    dragletSel.enter().append('circle')
      .attr('r', 7)
      .attr('fill', '#0f172a')
      .attr('stroke', '#22d3ee')
      .attr('stroke-width', 2)
      .call(
        d3.drag()
          .on('start', (e, d) => {
            e.sourceEvent.stopPropagation()
            connRef.current
              .attr('x1', d.x).attr('y1', d.y)
              .attr('x2', d.x).attr('y2', d.y)
              .attr('opacity', 1)
          })
          .on('drag', (e, d) => {
            connRef.current.attr('x1', d.x).attr('y1', d.y).attr('x2', e.x).attr('y2', e.y)
          })
          .on('end', (e, srcNode) => {
            connRef.current.attr('opacity', 0)
            const tgt = sim.nodes().find(n => {
              if (n.id === srcNode.id) return false
              const dx = (n.x ?? 0) - e.x, dy = (n.y ?? 0) - e.y
              return Math.sqrt(dx * dx + dy * dy) < R * 2.5
            })
            if (tgt) cbRef.current.onDragletDrop?.(srcNode, tgt)
          })
      )

    sim.alpha(simNodes.length ? 0.3 : 0).restart()
  }, [nodes, links])

  // ── Selection highlight ─────────────────────────────────
  useEffect(() => {
    layersRef.current['g-nodes']?.selectAll('circle')
      .attr('stroke', d => d.id === selectedId ? '#f43f5e' : (d.fx != null ? '#f97316' : '#1e293b'))
      .attr('stroke-width', d => d.id === selectedId ? 4 : 3)
  }, [selectedId])

  return (
    <svg
      ref={svgRef}
      className="w-full h-full"
      style={{
        background: 'radial-gradient(ellipse at 50% 40%, #1e293b 0%, #0f172a 70%)',
      }}
    />
  )
}
