import { eventManager } from '@renderer/class/EventManager'
const ipcRenderer = window.electron.ipcRenderer

export class FileService {
  gitFolderPath!: string
  openFileDialog = async (): Promise<void> => {
    try {
      const folderPath = await ipcRenderer.invoke('select-folder')
      if (folderPath) {
        console.log('Selected folder:', folderPath)
        this.gitFolderPath = folderPath
      } else {
        console.log('Folder selection cancelled.')
      }
    } catch (error) {
      console.error('Error selecting folder:', error)
    }
  }
  constructor() {
    eventManager.on('open-file', this.openFileDialog)
  }
}

export const fileService = new FileService()
