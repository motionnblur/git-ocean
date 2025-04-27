import { Box, Stack, Typography } from '@mui/material'
import { JSX, useEffect, useState } from 'react'
import UploadButton from './UploadButton'
import { eventManager } from '@renderer/class/EventManager'

export default function MenuBar(): JSX.Element {
  const [folderName, setFolderName] = useState<string>('')

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const onGitFolderEvent = (data: any): void => {
    const gitFoldePath: string = data

    const parts = gitFoldePath.split('/') // Split the path by the forward slash
    const gitFolderName: string = parts[parts.length - 1]

    setFolderName(gitFolderName)
  }
  useEffect(() => {
    eventManager.on('git-folder', onGitFolderEvent)
  }, [])
  return (
    <Box sx={{ width: '100%', backgroundColor: '#0b305d' }}>
      <Stack direction="row">
        <UploadButton />
        <Typography sx={{ flexGrow: 1, marginLeft: '14px' }}>{folderName}</Typography>
      </Stack>
    </Box>
  )
}
