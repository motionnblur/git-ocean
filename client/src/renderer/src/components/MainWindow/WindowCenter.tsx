import { Box } from '@mui/material'
import { JSX, useEffect, useState } from 'react'
import Terminal, { ColorMode, TerminalOutput } from 'react-terminal-ui'

//let homeDir: string
export default function WindowCenter(): JSX.Element {
  const [terminalLineData, setTerminalLineData] = useState([
    // eslint-disable-next-line react/jsx-key
    <TerminalOutput>-- Git Ocean terminal --</TerminalOutput>
  ])
  const [cwd, setCwd] = useState<string>(window.electron.systemInfo.cwd)

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
    const handleCwdUpdated = (newCwd: string): void => {
      setCwd(newCwd) // Update the cwd state when the event is received
    }

    window.electron.onCommandOutput(handleOutput)
    window.electron.onCommandExit(handleExit)
    window.electron.onCwdUpdated(handleCwdUpdated)
    //homeDir = window.electron.systemInfo.homeDir
  }, [])

  return (
    <Box sx={{ flexGrow: 1, backgroundColor: '#dbd8e3' }}>
      <Terminal
        name="Terminal"
        colorMode={ColorMode.Dark}
        onInput={(terminalInput) => {
          if (terminalInput.toLocaleLowerCase() === 'clear') {
            setTerminalLineData([])
          } else {
            window.electron.sendCommand(terminalInput)
          }
        }}
        prompt={`${cwd + ':'}`}
      >
        {terminalLineData}
      </Terminal>
    </Box>
  )
}
