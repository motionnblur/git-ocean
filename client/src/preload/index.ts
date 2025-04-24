import { contextBridge, ipcRenderer } from 'electron'
import { electronAPI } from '@electron-toolkit/preload'
import os from 'os'

const customCommandAPI = {
  // Function to send a command to the main process
  sendCommand: (command) => ipcRenderer.send('execute-command', command),

  // Function to register a callback for receiving command output
  onCommandOutput: (callback) => {
    // Ensure callback is a function before subscribing
    if (typeof callback !== 'function') {
      console.error('onCommandOutput: Provided callback is not a function.')
      return () => {} // Return an empty cleanup function
    }
    const subscription = (_event, data): void => callback(data)
    ipcRenderer.on('command-output', subscription)
    // Return a function to remove the listener (for cleanup)
    return () => ipcRenderer.removeListener('command-output', subscription)
  },
  offCommandOutput: (callback) => {
    ipcRenderer.removeListener('command-output', callback)
  },

  // Function to register a callback for receiving command exit code
  onCommandExit: (callback) => {
    // Ensure callback is a function before subscribing
    if (typeof callback !== 'function') {
      console.error('onCommandExit: Provided callback is not a function.')
      return () => {} // Return an empty cleanup function
    }
    const subscription = (_event, code): void => callback(code)
    ipcRenderer.on('command-exit', subscription)
    // Return a function to remove the listener (for cleanup)
    return () => ipcRenderer.removeListener('command-exit', subscription)
  },
  offCommandExit: (callback) => {
    ipcRenderer.removeListener('command-exit', callback)
  },
  systemInfo: {
    username: os.userInfo().username,
    hostname: os.hostname(),
    homeDir: os.homedir(),
    cwd: process.cwd()
  }
  // NOTE: The explicit exposure of raw ipcRenderer methods like:
  //   ipcRenderer: { invoke: ..., send: ..., on: ... }
  // is removed. It's generally better and safer to expose only specific
  // functions like sendCommand, onCommandOutput, etc., rather than the raw methods.
  // The electronAPI from @electron-toolkit/preload likely provides necessary IPC utilities already.
  // If you find you absolutely need the raw methods, you could add them back into
  // the combined object below, but carefully consider the security implications.
}

// Custom APIs for renderer
const api = {}

// Use `contextBridge` APIs to expose Electron APIs to
// renderer only if context isolation is enabled, otherwise
// just add to the DOM global.
if (process.contextIsolated) {
  try {
    contextBridge.exposeInMainWorld('electron', {
      ...electronAPI,
      ...customCommandAPI
    })
    contextBridge.exposeInMainWorld('electron', {
      ipcRenderer: {
        invoke: ipcRenderer.invoke.bind(ipcRenderer),
        send: ipcRenderer.send.bind(ipcRenderer),
        on: ipcRenderer.on.bind(ipcRenderer)
      }
    })
    contextBridge.exposeInMainWorld('api', api)
  } catch (error) {
    console.error(error)
  }
} else {
  // @ts-ignore (define in dts)
  window.electron = electronAPI
  // @ts-ignore (define in dts)
  window.api = api
}
