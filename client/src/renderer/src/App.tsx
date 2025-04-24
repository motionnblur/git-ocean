import { Box, Stack } from '@mui/material'
import { useState } from 'react'
import MenuBar from './components/MenuBar/MenuBar'
import Popup from './components/Popup'
import ToolBar from './components/ToolBar'
import MainWindow from './components/MainWindow/MainWindow'
import BottomBar from './components/BottomBar'

function App(): React.JSX.Element {
  const [open, setOpen] = useState<boolean>(true)
  const handleClose = (): void => {
    setOpen(false)
  }

  return (
    <>
      <Box sx={{ width: '100%', height: '100%' }}>
        <Stack direction="column" width={'100%'} height={'100%'}>
          <MenuBar />
          <ToolBar />
          <MainWindow />
          <BottomBar />
        </Stack>
      </Box>
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
