import { Stack } from '@mui/material'
import { useState } from 'react'
import StartupDialog from './components/StartupDialog'
import MenuBar from './components/MenuBar'

function App(): React.JSX.Element {
  const [open, setOpen] = useState<boolean>(true)
  const handleClose = (): void => {
    setOpen(false)
  }

  return (
    <>
      <Stack direction="column">
        <MenuBar />
      </Stack>
      <StartupDialog open={open} onClose={handleClose} />
    </>
  )
}

export default App
