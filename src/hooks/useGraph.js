import { useState, useEffect, useCallback, useRef } from 'react'

const MAX_MESSAGES = 5

function parseGraphPayload(payload) {
  const raw = payload.nodes || []
  const nodes = raw
    .filter(n => n.node === 'n')
    .map(n => ({ id: n.id, labels: n.labels || [], data: n.data || {} }))
  const links = raw
    .filter(n => n.node === 'r')
    .map(r => ({ id: r.id, source: r.start, target: r.end, type: r.type || '', data: r.data || {} }))
  return { nodes, links }
}

export default function useGraph(socket) {
  const [nodes, setNodes] = useState([])
  const [links, setLinks] = useState([])
  const [gists, setGists] = useState([])
  const [pathTypes, setPathTypes] = useState([])
  const [messages, setMessages] = useState([])
  const msgId = useRef(0)

  const pushMessage = useCallback((msg) => {
    const id = ++msgId.current
    setMessages(prev => [...prev.slice(-(MAX_MESSAGES - 1)), { ...msg, id }])
    setTimeout(() => setMessages(prev => prev.filter(m => m.id !== id)), 8000)
  }, [])

  useEffect(() => {
    if (!socket) return

    const onConnect = () => {
      socket.emit('graph:init')
      socket.emit('graph:gists')
    }

    const onGraphNodes = (payload) => {
      const { nodes: newNodes, links: newLinks } = parseGraphPayload(payload)

      if (payload.root !== undefined) {
        // Partial fetch — merge into existing graph
        setNodes(prev => {
          const map = new Map(prev.map(n => [n.id, n]))
          newNodes.forEach(n => map.set(n.id, n))
          return [...map.values()]
        })
        setLinks(prev => {
          const existing = new Set(prev.map(l => l.id))
          return [...prev, ...newLinks.filter(l => !existing.has(l.id))]
        })
      } else {
        // Full replacement
        setNodes(newNodes)
        setLinks(newLinks)
      }
    }

    const onGraphRemove = () => {
      setNodes([])
      setLinks([])
    }

    const onGraphPaths = (payload) => {
      setPathTypes(payload.data || [])
    }

    const onGraphGists = (payload) => {
      setGists(payload.names || [])
    }

    const onServerInfo = (payload) => {
      pushMessage(payload)
    }

    const onNodesAdd = (payload) => {
      const items = Array.isArray(payload.node) ? payload.node : [payload.node]
      const newNodes = items
        .filter(n => n && n.node === 'n')
        .map(n => ({ id: n.id, labels: n.labels || [], data: n.data || {} }))
      if (newNodes.length) {
        setNodes(prev => {
          const map = new Map(prev.map(n => [n.id, n]))
          newNodes.forEach(n => map.set(n.id, n))
          return [...map.values()]
        })
      }
    }

    const onNodesUpdate = (payload) => {
      if (!payload || !payload.id) return
      const updated = payload.properties || payload
      setNodes(prev =>
        prev.map(n =>
          n.id === (payload.id ?? updated.id)
            ? { ...n, data: updated.data || n.data, labels: updated.labels || n.labels }
            : n
        )
      )
    }

    const onNodesRemove = (payload) => {
      setNodes(prev => prev.filter(n => n.id !== payload.id))
      setLinks(prev => prev.filter(l => l.source !== payload.id && l.target !== payload.id))
    }

    const onPathsAdd = (payload) => {
      setLinks(prev => {
        const id = `${payload.source}-${payload.target}-${payload.name}`
        if (prev.some(l => l.id === id)) return prev
        return [...prev, { id, source: payload.source, target: payload.target, type: payload.name, data: {} }]
      })
      if (payload.name && !pathTypes.includes(payload.name)) {
        setPathTypes(prev => [...prev, payload.name])
      }
    }

    const onPathsRemove = (payload) => {
      setLinks(prev =>
        prev.filter(l => !(l.source === payload.source && l.target === payload.target && l.type === payload.name))
      )
    }

    socket.on('connect', onConnect)
    socket.on('graph:nodes', onGraphNodes)
    socket.on('graph:remove', onGraphRemove)
    socket.on('graph:paths', onGraphPaths)
    socket.on('graph:gists', onGraphGists)
    socket.on('server:info', onServerInfo)
    socket.on('nodes:add', onNodesAdd)
    socket.on('nodes:update', onNodesUpdate)
    socket.on('nodes:remove', onNodesRemove)
    socket.on('paths:add', onPathsAdd)
    socket.on('paths:remove', onPathsRemove)

    if (socket.connected) onConnect()

    return () => {
      socket.off('connect', onConnect)
      socket.off('graph:nodes', onGraphNodes)
      socket.off('graph:remove', onGraphRemove)
      socket.off('graph:paths', onGraphPaths)
      socket.off('graph:gists', onGraphGists)
      socket.off('server:info', onServerInfo)
      socket.off('nodes:add', onNodesAdd)
      socket.off('nodes:update', onNodesUpdate)
      socket.off('nodes:remove', onNodesRemove)
      socket.off('paths:add', onPathsAdd)
      socket.off('paths:remove', onPathsRemove)
    }
  }, [socket, pushMessage, pathTypes])

  const actions = {
    refreshGraph: () => socket?.emit('graph:init'),
    clearGraph: () => socket?.emit('graph:remove'),
    loadGist: (name) => { socket?.emit('graph:load', { name }); setNodes([]); setLinks([]) },
    loadStats: () => { socket?.emit('graph:stats'); socket?.emit('graph:paths') },
    findOrphans: () => socket?.emit('nodes:orphans'),
    addNode: (data) => socket?.emit('nodes:add', { data }),
    updateNode: (id, data) => socket?.emit('nodes:update', { id, data }),
    removeNode: (id) => socket?.emit('nodes:remove', { id }),
    addPath: (source, target, name) => socket?.emit('paths:add', { source, target, name }),
    removePath: (source, target, name) => socket?.emit('paths:remove', { source, target, name }),
    findNodes: (name, type) => socket?.emit('nodes:find', { name, type }),
  }

  return { nodes, links, gists, pathTypes, messages, actions }
}
