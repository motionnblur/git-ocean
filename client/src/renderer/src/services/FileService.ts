import { eventManager } from '@renderer/class/EventManager'

export class FileService {
  openFileDialog = (): void => {
    const input = document.createElement('input')
    input.type = 'file'
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    input.onchange = (_) => {
      if (input.files) {
        const files = Array.from(input.files)
        console.log(files)
      }
    }
    input.click()
  }
  constructor() {
    eventManager.on('open-file', this.openFileDialog)
  }
}

export const fileService = new FileService()
