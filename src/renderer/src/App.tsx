import { Box, Stack } from '@mui/material'
import { useEffect, useState } from 'react'
import MenuBar from './components/MenuBar/MenuBar'
import Popup from './components/Popup'
import MainWindow from './components/MainWindow/MainWindow'
import BottomBar from './components/BottomBar'
// eslint-disable-next-line @typescript-eslint/no-unused-vars
import { fileService } from '@renderer/services/FileService'

function App(): React.JSX.Element {
  const [open, setOpen] = useState<boolean>(true)
  const handleClose = (): void => {
    setOpen(false)
  }

  useEffect(() => {}, [fileService])

  return (
    <>
      <Box sx={{ width: '100%', height: '100%' }}>
        <Stack direction="column" width={'100%'} height={'100%'}>
          <MenuBar />
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
