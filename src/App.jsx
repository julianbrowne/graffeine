import { useState, useCallback } from 'react'
import useSocket from './hooks/useSocket.js'
import useGraph from './hooks/useGraph.js'
import Toolbar from './components/Toolbar.jsx'
import GraphCanvas from './components/GraphCanvas.jsx'
import StatusBar from './components/StatusBar.jsx'
import NodeContextMenu from './components/NodeContextMenu.jsx'
import NodeTooltip from './components/NodeTooltip.jsx'
import NodeEditModal from './components/modals/NodeEditModal.jsx'
import NodeViewModal from './components/modals/NodeViewModal.jsx'
import PathEditModal from './components/modals/PathEditModal.jsx'
import StatsModal from './components/modals/StatsModal.jsx'
import FindNodeModal from './components/modals/FindNodeModal.jsx'

export default function App() {
  const { socket, connected } = useSocket()
  const { nodes, links, gists, pathTypes, messages, actions } = useGraph(socket)

  const [modal, setModal] = useState(null)   // { name, data }
  const [ctxMenu, setCtxMenu] = useState(null) // { node, x, y }
  const [tooltip, setTooltip] = useState(null) // { node, x, y }
  const [selectedId, setSelectedId] = useState(null)

  const openModal = useCallback((name, data = {}) => {
    setModal({ name, data })
    setCtxMenu(null)
  }, [])

  const closeModal = useCallback(() => setModal(null), [])

  const handleNodeSelect = useCallback((id) => {
    setSelectedId(prev => prev === id ? null : id)
    setCtxMenu(null)
  }, [])

  const handleBackground = useCallback(() => {
    setSelectedId(null)
    setCtxMenu(null)
  }, [])

  return (
    <div className="flex flex-col h-screen bg-slate-950 text-slate-100 overflow-hidden select-none">
      <Toolbar
        connected={connected}
        gists={gists}
        nodeCount={nodes.length}
        linkCount={links.length}
        onRefresh={actions.refreshGraph}
        onClear={actions.clearGraph}
        onLoadGist={actions.loadGist}
        onOrphans={actions.findOrphans}
        onStats={() => { actions.loadStats(); openModal('stats') }}
        onNewNode={() => openModal('nodeEdit', {})}
        onFindNode={() => openModal('find')}
      />

      <div className="flex-1 relative overflow-hidden">
        <GraphCanvas
          nodes={nodes}
          links={links}
          selectedId={selectedId}
          onNodeSelect={handleNodeSelect}
          onNodeRightClick={(node, x, y) => { setCtxMenu({ node, x, y }); setSelectedId(node.id) }}
          onDragletDrop={(src, tgt) => openModal('pathEdit', { source: src, target: tgt })}
          onNodeHover={(node, x, y) => setTooltip(node ? { node, x, y } : null)}
          onBackground={handleBackground}
        />

        {ctxMenu && (
          <NodeContextMenu
            node={ctxMenu.node}
            x={ctxMenu.x}
            y={ctxMenu.y}
            onView={() => openModal('nodeView', { node: ctxMenu.node })}
            onEdit={() => openModal('nodeEdit', { node: ctxMenu.node })}
            onDelete={() => { actions.removeNode(ctxMenu.node.id); setCtxMenu(null) }}
            onClose={() => setCtxMenu(null)}
          />
        )}

        {tooltip && !ctxMenu && (
          <NodeTooltip node={tooltip.node} x={tooltip.x} y={tooltip.y} />
        )}
      </div>

      <StatusBar connected={connected} messages={messages} nodeCount={nodes.length} linkCount={links.length} />

      {modal?.name === 'nodeEdit' && (
        <NodeEditModal
          node={modal.data.node}
          onSave={(data) => {
            modal.data.node ? actions.updateNode(modal.data.node.id, data) : actions.addNode(data)
            closeModal()
          }}
          onClose={closeModal}
        />
      )}
      {modal?.name === 'nodeView' && (
        <NodeViewModal node={modal.data.node} onClose={closeModal} />
      )}
      {modal?.name === 'pathEdit' && (
        <PathEditModal
          source={modal.data.source}
          target={modal.data.target}
          pathTypes={pathTypes}
          onSave={(name) => { actions.addPath(modal.data.source.id, modal.data.target.id, name); closeModal() }}
          onClose={closeModal}
        />
      )}
      {modal?.name === 'stats' && (
        <StatsModal
          nodes={nodes}
          links={links}
          pathTypes={pathTypes}
          onClose={closeModal}
        />
      )}
      {modal?.name === 'find' && (
        <FindNodeModal
          onFind={actions.findNodes}
          onClose={closeModal}
        />
      )}
    </div>
  )
}
