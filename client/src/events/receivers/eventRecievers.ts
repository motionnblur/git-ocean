import { memory } from '../../classes/Memory'
import {
  changeGitCommitName,
  dropLastCommit,
  getGitCommitData,
  squashCommits
} from '../../git/gitFunctions'

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const eventReceiver = (data: any): void => {
  const { mainWindow, ipcMain, dialog, execPromise, os, fs, path, spawn } = data
  let { currentWorkingDirectory } = data

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

    //mainWindow.webContents.send('alert')

    return result.filePaths[0]
  })
  ipcMain.handle('check-git-repo', async (_event, folderPath: string) => {
    try {
      const { stdout } = await execPromise('git rev-parse --is-inside-work-tree', {
        cwd: folderPath
      })
      const commitData = await getGitCommitData(execPromise)
      //console.log(commitData)
      _event.sender.send('repo-view-open', commitData)
      return stdout.trim() === 'true'
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
    } catch (error) {
      return false
    }
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

    if (primaryCommand === 'cd') {
      let targetDirectory: string | null = null
      if (commandArgs.length > 0) {
        targetDirectory = commandArgs[0]
      }

      let newWorkingDirectory: string

      if (!targetDirectory) {
        newWorkingDirectory = os.homedir()
      } else if (targetDirectory === '..') {
        newWorkingDirectory = path.dirname(currentWorkingDirectory)
        if (newWorkingDirectory.length < path.parse(currentWorkingDirectory).root.length) {
          newWorkingDirectory = path.parse(currentWorkingDirectory).root
        }
      } else {
        newWorkingDirectory = path.resolve(currentWorkingDirectory, targetDirectory)

        if (
          !fs.existsSync(newWorkingDirectory) ||
          !fs.statSync(newWorkingDirectory).isDirectory()
        ) {
          event.sender.send('command-output', `cd: no such file or directory: ${targetDirectory}`)
          event.sender.send('command-exit', 1)
          return
        }
      }

      console.log(`CD command: Changing directory to ${newWorkingDirectory}`)
      currentWorkingDirectory = newWorkingDirectory
      event.sender.send('command-output', `Changed directory to ${currentWorkingDirectory}`)
      event.sender.send('cwd-updated', currentWorkingDirectory)
      event.sender.send('command-exit', 0)
      return // Important: Exit here to prevent spawning a 'cd' process
    }

    // For other commands, proceed with spawning the child process
    console.log(`Executing command: ${command} in directory: ${currentWorkingDirectory}`)
    const isWindows = process.platform === 'win32'
    const shell = isWindows ? 'cmd.exe' : '/bin/sh'
    const spawnArgs = isWindows ? ['/c', command] : ['-c', command]

    const child = spawn(shell, spawnArgs, { cwd: currentWorkingDirectory, stdio: 'pipe' })

    child.stdout.on('data', (data) => {
      event.sender.send('command-output', data.toString())
    })

    child.stderr.on('data', (data) => {
      event.sender.send('command-output', `stderr: ${data.toString()}`)
    })

    child.on('error', (error) => {
      event.sender.send('command-output', `Spawn Error: ${error.message}`)
      event.sender.send('command-exit', 1)
    })

    child.on('close', (code) => {
      console.log(`Command exited with code: ${code}`)
      event.sender.send('command-exit', code)
    })
  })

  ipcMain.on('change-git-commit-name', async (event, data) => {
    try {
      await changeGitCommitName(execPromise, data.commitData, data.commitName)
      // You can optionally send back a success message:
      event.reply('change-git-commit-name-success', 'Commit message changed.')
    } catch (err) {
      console.error('Failed to change commit message:', err)
      // Optionally notify the renderer process:
      event.reply('change-git-commit-name-error', err.message || 'Unknown error')
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
      event.reply('remove-last-commit-error', err.message || 'Unknown error')
    }
  })

  ipcMain.on('squash-commits', async (event, numberToSquash, newCommitMessage) => {
    try {
      await squashCommits(execPromise, numberToSquash, newCommitMessage)
      // You can optionally send back a success message:
      event.reply('squash-commits-success', 'Commits have been squashed.')
    } catch (err) {
      console.error('Failed to squash commits:', err)
      // Optionally notify the renderer process:
      event.reply('squash-commits-error', err.message || 'Unknown error')
    }
  })
}
