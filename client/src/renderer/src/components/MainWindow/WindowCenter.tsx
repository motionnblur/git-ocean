import { Box } from '@mui/material'
import { JSX, useEffect, useState } from 'react'
import Terminal, { ColorMode, TerminalOutput } from 'react-terminal-ui'

export default function WindowCenter(): JSX.Element {
  const [terminalLineData, setTerminalLineData] = useState([
    // eslint-disable-next-line react/jsx-key
    <TerminalOutput>Output test</TerminalOutput>
  ])

  useEffect(() => {
    const handleOutput = (data: string): void => {
      setTerminalLineData((prev) => [
        ...prev,
        <TerminalOutput key={prev.length}>{data}</TerminalOutput>
      ])
    }

    const handleExit = (code: number): void => {
      setTerminalLineData((prev) => [
        ...prev,
        <TerminalOutput key={prev.length}>{`Process exited with code ${code}`}</TerminalOutput>
      ])
    }

    window.electron.onCommandOutput(handleOutput)
    window.electron.onCommandExit(handleExit)

    // Optional cleanup
    return () => {
      // You may want to implement "off" methods in preload for proper cleanup
    }
  }, [])

  return (
    <Box sx={{ flexGrow: 1, backgroundColor: '#dbd8e3' }}>
      <Terminal
        name="Terminal"
        colorMode={ColorMode.Dark}
        onInput={(terminalInput) => {
          window.electron.sendCommand(terminalInput)
        }}
      >
        {terminalLineData}
      </Terminal>
    </Box>
  )
}
