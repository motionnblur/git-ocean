import { AppBar, IconButton, Toolbar } from '@mui/material'
import FolderIcon from '@mui/icons-material/Folder'
import { useState } from 'react'
import StartupDialog from './components/StartupDialog'

function App(): React.JSX.Element {
  const [open, setOpen] = useState<boolean>(true)
  const handleClose = (): void => {
    setOpen(false)
  }

  return (
    <>
      <div style={{ width: '100%' }}>
        <AppBar position="static">
          <Toolbar variant="dense">
            <IconButton edge="start" color="inherit" aria-label="menu" sx={{ mr: 2 }}>
              <FolderIcon />
            </IconButton>
          </Toolbar>
        </AppBar>
      </div>
      <StartupDialog open={open} onClose={handleClose} />
    </>
  )
}

export default App
