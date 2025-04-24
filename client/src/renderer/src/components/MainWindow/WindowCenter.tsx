import { Box } from '@mui/material'
import { JSX, useState } from 'react'
import Terminal, { ColorMode, TerminalOutput } from 'react-terminal-ui'

export default function WindowCenter(): JSX.Element {
  const [terminalLineData, setTerminalLineData] = useState([
    // eslint-disable-next-line react/jsx-key
    <TerminalOutput>Output test</TerminalOutput>
  ])
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
