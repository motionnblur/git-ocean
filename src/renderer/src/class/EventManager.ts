export class EventManager {
  private events: {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    [eventName: string]: ((data: any) => void)[]
  } = {}

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  public on(eventName: string, callback: (data: any) => void): void {
    if (!this.events[eventName]) {
      this.events[eventName] = []
    }
    this.events[eventName].push(callback)
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  public off(eventName: string, callback: (data: any) => void): void {
    if (this.events[eventName]) {
      const index = this.events[eventName].indexOf(callback)
      if (index > -1) {
        this.events[eventName].splice(index, 1)
      }
    }
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  public trigger(eventName: string, data?: any): void {
    if (this.events[eventName]) {
      this.events[eventName].forEach((callback) => callback(data))
    }
  }
}

export const eventManager = new EventManager()
