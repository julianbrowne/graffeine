import { useState, useEffect } from 'react'
import { io } from 'socket.io-client'

let _socket = null

function getSocket() {
  if (!_socket) {
    _socket = io({ transports: ['websocket', 'polling'] })
  }
  return _socket
}

export default function useSocket() {
  const [connected, setConnected] = useState(false)
  const socket = getSocket()

  useEffect(() => {
    const onConnect = () => setConnected(true)
    const onDisconnect = () => setConnected(false)

    socket.on('connect', onConnect)
    socket.on('disconnect', onDisconnect)

    if (socket.connected) setConnected(true)

    return () => {
      socket.off('connect', onConnect)
      socket.off('disconnect', onDisconnect)
    }
  }, [socket])

  return { socket, connected }
}
