import { contextBridge, ipcRenderer } from 'electron'
import { electronAPI } from '@electron-toolkit/preload'
import os from 'os'

const customCommandAPI = {
  // Function to send a command to the main process
  sendCommand: (command) => ipcRenderer.send('execute-command', command),
  dropLastCommit: () => ipcRenderer.send('drop-last-commit'),
  squashCommits: (numberToSquash: number, newCommitMessage) =>
    ipcRenderer.invoke('squash-commits', numberToSquash, newCommitMessage),

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
  onCwdUpdated: (callback: (newCwd: string) => void) => {
    // Add this
    if (typeof callback !== 'function') {
      console.error('onCwdUpdated: Provided callback is not a function.')
      return () => {}
    }
    const subscription = (_event, newCwd): void => callback(newCwd)
    ipcRenderer.on('cwd-updated', subscription)
    return () => ipcRenderer.removeListener('cwd-updated', subscription)
  },
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  onRepoViewOpen: (callback: (data: any) => void) => {
    if (typeof callback !== 'function') {
      console.error('onRepoViewOpen: Provided callback is not a function.')
      return () => {}
    }
    const subscription = (_event, data): void => callback(data)
    ipcRenderer.on('repo-view-open', subscription)
    return () => ipcRenderer.removeListener('terminal-open', subscription)
  },
  systemInfo: {
    username: os.userInfo().username,
    hostname: os.hostname(),
    homeDir: os.homedir(),
    cwd: os.homedir()
  },
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  handleGetRepoData: async () => {
    return await ipcRenderer.invoke('get-repo-data')
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
    /* contextBridge.exposeInMainWorld('electron', {
      ipcRenderer: {
        invoke: ipcRenderer.invoke.bind(ipcRenderer),
        send: ipcRenderer.send.bind(ipcRenderer),
        on: ipcRenderer.on.bind(ipcRenderer)
      }
    }) */
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
