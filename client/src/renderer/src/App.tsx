import { AppBar, IconButton, Toolbar } from '@mui/material'
import FolderIcon from '@mui/icons-material/Folder'

function App(): React.JSX.Element {
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
    </>
  )
}

export default App
