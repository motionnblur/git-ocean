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
          const gitRepoData = await ipcRenderer.invoke('get-repo-data', folderPath)
          eventManager.trigger('on-git-data-update', gitRepoData)
          this.gitFolderPath = folderPath
          eventManager.trigger('open-git-folder', folderPath)
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
    eventManager.on('open-folder', this.openFileDialog)
  }
}

export const fileService = new FileService()
