import { app, shell, BrowserWindow, ipcMain, dialog } from 'electron'
import { join } from 'path'
import { electronApp, optimizer, is } from '@electron-toolkit/utils'
import icon from '../../resources/icon.png?asset'
import { exec, spawn } from 'child_process'
import util from 'util'
import { memory } from '../classes/Memory'
// eslint-disable-next-line @typescript-eslint/no-require-imports
const os = require('os')
const execPromise = util.promisify(exec)

function createWindow(): void {
  // Create the browser window.
  const mainWindow = new BrowserWindow({
    width: 1366,
    height: 820,
    show: false,
    autoHideMenuBar: true,
    ...(process.platform === 'linux' ? { icon } : {}),
    webPreferences: {
      preload: join(__dirname, '../preload/index.js'),
      sandbox: false
    }
  })

  mainWindow.on('ready-to-show', () => {
    mainWindow.show()
  })

  mainWindow.webContents.setWindowOpenHandler((details) => {
    shell.openExternal(details.url)
    return { action: 'deny' }
  })

  // HMR for renderer base on electron-vite cli.
  // Load the remote URL for development or the local html file for production.
  if (is.dev && process.env['ELECTRON_RENDERER_URL']) {
    mainWindow.loadURL(process.env['ELECTRON_RENDERER_URL'])
  } else {
    mainWindow.loadFile(join(__dirname, '../renderer/index.html'))
  }
}

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.whenReady().then(() => {
  // Set app user model id for windows
  electronApp.setAppUserModelId('com.electron')

  // Default open or close DevTools by F12 in development
  // and ignore CommandOrControl + R in production.
  // see https://github.com/alex8088/electron-toolkit/tree/master/packages/utils
  app.on('browser-window-created', (_, window) => {
    optimizer.watchWindowShortcuts(window)
  })

  // IPC test
  ipcMain.on('ping', () => console.log('pong'))

  eventReceiver()

  createWindow()

  app.on('activate', function () {
    // On macOS it's common to re-create a window in the app when the
    // dock icon is clicked and there are no other windows open.
    if (BrowserWindow.getAllWindows().length === 0) createWindow()
  })
})

// Quit when all windows are closed, except on macOS. There, it's common
// for applications and their menu bar to stay active until the user quits
// explicitly with Cmd + Q.
app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit()
  }
})

// In this file you can include the rest of your app's specific main process
// code. You can also put them in separate files and require them here.

const eventReceiver = (): void => {
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
  ipcMain.on('execute-command', (event, command) => {
    if (!command || typeof command !== 'string') {
      event.sender.send('command-output', 'Error: Invalid command received.')
      event.sender.send('command-exit', 1) // Signal error exit code
      return
    }

    console.log(`Executing command: ${command}`) // Log in main process console

    // Determine shell and arguments based on OS
    const isWindows = process.platform === 'win32'
    const shell = isWindows ? 'cmd.exe' : '/bin/sh' // Or use 'bash', 'zsh' etc. if known
    const args = isWindows ? ['/c', command] : ['-c', command]

    // Spawn the command in the system's shell
    // Use user's home directory as default working directory
    const child = spawn(shell, args, { cwd: os.homedir(), stdio: 'pipe' })

    // Stream stdout back to the renderer
    child.stdout.on('data', (data) => {
      event.sender.send('command-output', data.toString())
    })

    // Stream stderr back to the renderer
    child.stderr.on('data', (data) => {
      // Prefix stderr output for clarity in the console (optional)
      event.sender.send('command-output', `stderr: ${data.toString()}`)
    })

    // Handle errors during spawning (e.g., command not found)
    child.on('error', (error) => {
      event.sender.send('command-output', `Spawn Error: ${error.message}`)
      event.sender.send('command-exit', 1) // Signal error exit code
    })

    // Signal when the command finishes
    child.on('close', (code) => {
      console.log(`Command exited with code: ${code}`)
      event.sender.send('command-exit', code)
    })
  })
}
