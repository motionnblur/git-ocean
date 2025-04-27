import React, { useEffect, useRef } from 'react'
import { Terminal } from '@xterm/xterm'
import '../../assets/xterm.css'
const ipcRenderer = window.electron.ipcRenderer

const TerminalComponent: React.FC = () => {
  const terminalRef = useRef<HTMLDivElement | null>(null)
  const term = useRef<Terminal | null>(null)

  useEffect(() => {
    const handleOutput = (data: string): void => {
      console.log('Output:', data)
      term.current?.write(data) // ✅ Write output to terminal
    }

    const handleExit = (code: number): void => {
      term.current?.writeln(`\r\nProcess exited with code ${code}`)
    }

    if (terminalRef.current) {
      term.current = new Terminal({
        cols: 80,
        rows: 24,
        cursorBlink: true
      })

      term.current.open(terminalRef.current)
      ipcRenderer.send('start-shell')

      term.current.onData((data) => {
        ipcRenderer.send('send-shell-input', data)
      })

      window.electron.onCommandOutput(handleOutput)
      window.electron.onCommandExit(handleExit)

      return () => {
        //window.electron.offCommandOutput(handleOutput)
        //window.electron.offCommandExit(handleExit)
        term.current?.dispose()
      }
    }
  }, [])

  return <div ref={terminalRef} style={{ height: '400px', width: '728px' }} />
}

export default TerminalComponent
