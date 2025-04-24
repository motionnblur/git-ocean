import { Stack } from '@mui/material'
import { useState } from 'react'
import MenuBar from './components/MenuBar'
import Popup from './components/Popup'

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
      <Popup
        open={open}
        onClose={handleClose}
        title="Welcome to Git Ocean !"
        dialogText="To start, please select the folder you want to track"
      />
    </>
  )
}

export default App
