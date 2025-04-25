import { Box, TextField } from '@mui/material'
import { eventManager } from '@renderer/class/EventManager'
import { useEffect, useState } from 'react'

let textDisabled: boolean = true
export default function CommitWindow(): JSX.Element {
  const [value, setValue] = useState('')

  const commitMessageHandler = (message: string): void => {
    textDisabled = false
    setValue(message)
  }

  useEffect(() => {
    eventManager.on('commit-message', commitMessageHandler)
    return () => {
      eventManager.off('commit-message', commitMessageHandler)
    }
  }, [])

  return (
    <Box
      component="form"
      sx={{ '& > :not(style)': { m: 1, width: '25ch' }, display: 'flex', justifyContent: 'center' }}
      noValidate
      autoComplete="off"
    >
      <TextField
        id="outlined-basic"
        hiddenLabel
        variant="filled"
        sx={{ backgroundColor: 'white' }}
        multiline
        rows={1}
        maxRows={1}
        defaultValue={value}
        disabled={textDisabled}
      />
    </Box>
  )
}
