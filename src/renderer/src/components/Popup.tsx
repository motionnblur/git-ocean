import { Dialog, DialogContent, DialogContentText, DialogTitle } from '@mui/material'
import { JSX } from 'react'

export default function Popup({
  open,
  onClose,
  title,
  dialogText
}: {
  open: boolean
  onClose: () => void
  title: string
  dialogText: string
}): JSX.Element {
  return (
    <Dialog
      open={open}
      onClose={onClose}
      aria-labelledby="alert-dialog-title"
      aria-describedby="alert-dialog-description"
    >
      <DialogTitle id="alert-dialog-title">{title}</DialogTitle>
      <DialogContent>
        <DialogContentText id="alert-dialog-description">{dialogText}</DialogContentText>
      </DialogContent>
    </Dialog>
  )
}
