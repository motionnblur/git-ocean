export interface ICustomCommandAPI {
  sendCommand: (command: string) => void
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  changeGitCommitName: (commitData: any) => void
  onCommandOutput: (callback: (data: string) => void) => () => void // Returns cleanup function
  onCommandExit: (callback: (code: number | null) => void) => () => void // Returns cleanup function
  onCommandExit: (callback: (code: number | null) => void) => () => void
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  onRepoViewOpen: (callback: (data: any) => void) => () => void
  systemInfo: {
    username: string
    hostname: string
    homeDir: string
    cwd: string
  }
}

// Combine the toolkit types and your custom types using an intersection type
export type CombinedElectronAPI = ToolkitElectronAPI & ICustomCommandAPI

declare global {
  interface Window {
    electron: CombinedElectronAPI
    api: unknown
  }
}
