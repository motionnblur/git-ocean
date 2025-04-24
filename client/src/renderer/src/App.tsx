import { Stack } from '@mui/material'
import { useState } from 'react'
import MenuBar from './components/MenuBar'
import Popup from './components/Popup'
import ToolBar from './components/ToolBar'
import MainWindow from './components/MainWindow/MainWindow'

function App(): React.JSX.Element {
  const [open, setOpen] = useState<boolean>(true)
  const handleClose = (): void => {
    setOpen(false)
  }

  return (
    <>
      <Stack direction="column">
        <MenuBar />
        <ToolBar />
        <MainWindow />
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
