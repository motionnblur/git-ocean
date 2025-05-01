import { ipcMain } from 'electron'
import { IRepoItem, ISquash, memory } from '../memory/Memory'
import {
  changeGitCommitName,
  dropLastCommit,
  getGitCommitData,
  squashCommits
} from '../git/gitFunctions'
import * as pty from 'node-pty'

let ptyProcess: pty.IPty | null = null

ipcMain.on('start-shell', (event) => {
  ptyProcess = pty.spawn('/bin/bash', [], {
    name: 'xterm-256color',
    cwd: memory.currentGitDirectory,
    env: process.env
  })

  ptyProcess.on('data', (data) => {
    event.sender.send('command-output', data)
  })

  ptyProcess.on('exit', (code) => {
    event.sender.send('command-exit', code)
    ptyProcess = null
  })

  ptyProcess.on('error', (err) => {
    event.sender.send('command-output', `Error: ${err.message}`)
  })
})
ipcMain.on('send-shell-input', (_event, input: string) => {
  ptyProcess?.write(input)
})

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const eventReceiver = (data: any): void => {
  const { mainWindow, ipcMain, dialog, execPromise, os } = data

  ipcMain.handle('select-folder', async () => {
    if (memory.isFileDialogOpen) return null
    memory.isFileDialogOpen = true

    const result = await dialog.showOpenDialog({
      properties: ['openDirectory']
    })

    memory.isFileDialogOpen = false
    if (result.canceled || result.filePaths.length === 0) {
      return null
    }

    memory.currentGitDirectory = result.filePaths[0]
    return result.filePaths[0]
  })
  ipcMain.handle('check-git-repo', async (_event, folderPath: string) => {
    try {
      const { stdout } = await execPromise('git rev-parse --is-inside-work-tree', {
        cwd: folderPath
      })
      return stdout.trim() === 'true'
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
    } catch (error) {
      return false
    }
  })
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  ipcMain.handle('get-repo-data', async () => {
    const commitData = await getGitCommitData(execPromise, memory.currentGitDirectory)
    return commitData
  })
  ipcMain.on('execute-command', (event, command) => {
    if (!command || typeof command !== 'string') {
      event.sender.send('command-output', 'Error: Invalid command received.')
      event.sender.send('command-exit', 1)
      return
    }

    const args = command.split(' ')
    const primaryCommand = args[0]
    const commandArgs = args.slice(1)

    // Create a PTY for interactive commands like 'nano'
    const ptyProcess = pty.spawn(primaryCommand, commandArgs, {
      name: 'xterm-256color',
      cwd: os.homedir(), // Set working directory, or change this as needed
      env: process.env // Set the environment for the process
    })

    // Listen for data from the PTY (i.e., command output)
    ptyProcess.on('data', (data) => {
      event.sender.send('command-output', data)
    })

    // Listen for the process exit
    ptyProcess.on('exit', (code) => {
      event.sender.send('command-exit', code)
    })

    // Optionally handle other errors
    ptyProcess.on('error', (error) => {
      event.sender.send('command-output', `Error: ${error.message}`)
      event.sender.send('command-exit', 1)
    })
  })

  ipcMain.handle('change-git-commit-name', async (event, data) => {
    try {
      await changeGitCommitName(execPromise, data.commitData, data.commitName)
      memory.repoData = await getGitCommitData(execPromise, memory.currentGitDirectory)

      return true
    } catch (err) {
      console.error('Failed to change commit message:', err)
      // Optionally notify the renderer process:
      throw err
    }
  })
  ipcMain.on('drop-last-commit', async (event) => {
    try {
      await dropLastCommit(execPromise)
      // You can optionally send back a success message:
      event.reply('remove-last-commit-success', 'Last commit has been dropped.')
    } catch (err) {
      console.error('Failed to drop last commit:', err)
      // Optionally notify the renderer process:
      event.reply('remove-last-commit-error', err.message || 'Unknown error') //
    }
  })

  ipcMain.handle('squash-commits', async (event, numberToSquash, newCommitMessage) => {
    // eslint-disable-next-line no-useless-catch
    try {
      await squashCommits(execPromise, numberToSquash, newCommitMessage)
      //memory.repoData = await getGitCommitData(execPromise, memory.currentGitDirectory)
      memory.squash.numberToSquash = numberToSquash
      memory.squash.newCommitMessage = newCommitMessage
      return true
    } catch (err) {
      console.error('Failed to squash commits:', err)
      throw err
    }
  })
  ipcMain.handle('save-repo-data-to-memory', async (event, data): Promise<boolean> => {
    memory.repoData = data
    if (memory.repoData) {
      return true
    } else {
      return false
    }
  })
  ipcMain.handle('get-repo-data-from-memory', async (): Promise<IRepoItem[]> => {
    return memory.repoData
  })
  ipcMain.handle('get-squash-data-from-memory', async (): Promise<ISquash> => {
    return memory.squash
  })
}
