import { eventManager } from '@renderer/class/EventManager'
const ipcRenderer = window.electron.ipcRenderer

export class FileService {
  gitFolderPath!: string
  openFileDialog = async (): Promise<void> => {
    try {
      const folderPath = await ipcRenderer.invoke('select-folder')
      if (folderPath) {
        console.log('Selected folder:', folderPath)
        const isGitRepo = await ipcRenderer.invoke('check-git-repo', folderPath)
        if (isGitRepo) {
          this.gitFolderPath = folderPath
          eventManager.trigger('git-folder', folderPath)
        } else {
          alert('This is NOT a Git repository.')
          console.warn('This is NOT a Git repository.')
        }
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
