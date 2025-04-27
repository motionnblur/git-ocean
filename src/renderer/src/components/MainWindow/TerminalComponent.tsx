import React, { useEffect, useRef } from 'react'
import { Terminal } from '@xterm/xterm'
import '../../assets/xterm.css'
const ipcRenderer = window.electron.ipcRenderer

let terminalText = ''

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

    const handleCwdUpdated = (newCwd: string): void => {
      console.log('New CWD:', newCwd)
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
        //terminalText += data
        //term.current?.write(data) // Echo typed characters
        ipcRenderer.send('send-shell-input', data)
      })

      window.electron.onCommandOutput(handleOutput)
      window.electron.onCommandExit(handleExit)
      window.electron.onCwdUpdated(handleCwdUpdated)

      return () => {
        window.electron.offCommandOutput(handleOutput)
        window.electron.offCommandExit(handleExit)
        window.electron.offCwdUpdated(handleCwdUpdated)
        term.current?.dispose()
      }
    }
  }, [])

  return <div ref={terminalRef} style={{ height: '400px', width: '740px' }} />
}

export default TerminalComponent
