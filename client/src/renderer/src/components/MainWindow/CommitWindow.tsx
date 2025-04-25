import { Box, TextField } from '@mui/material'
import { useState } from 'react'

export default function CommitWindow(): JSX.Element {
  const [value, setValue] = useState('')
  return (
    <Box
      component="form"
      sx={{ '& > :not(style)': { m: 1, width: '25ch' }, display: 'flex', justifyContent: 'center' }}
      noValidate
      autoComplete="off"
    >
      <TextField
        id="outlined-basic"
        label="Commit Message"
        variant="filled"
        sx={{ backgroundColor: 'white' }}
        multiline
        rows={1}
        maxRows={1}
        defaultValue={value}
      />
    </Box>
  )
}
