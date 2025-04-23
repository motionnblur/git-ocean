import { Dialog, DialogContent, DialogContentText, DialogTitle } from '@mui/material'
import { JSX } from 'react'

export default function StartupDialog({
  open,
  onClose
}: {
  open: boolean
  onClose: () => void
}): JSX.Element {
  return (
    <Dialog
      open={open}
      onClose={onClose}
      aria-labelledby="alert-dialog-title"
      aria-describedby="alert-dialog-description"
    >
      <DialogTitle id="alert-dialog-title">{'Welcome to Git Ocean !'}</DialogTitle>
      <DialogContent>
        <DialogContentText id="alert-dialog-description">
          To start, please select the folder you want to track
        </DialogContentText>
      </DialogContent>
    </Dialog>
  )
}
