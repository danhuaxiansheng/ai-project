type EventCallback = (data: any) => void;

export class EventBus {
  private static instance: EventBus;
  private listeners: Map<string, EventCallback[]>;

  private constructor() {
    this.listeners = new Map();
  }

  public static getInstance(): EventBus {
    if (!EventBus.instance) {
      EventBus.instance = new EventBus();
    }
    return EventBus.instance;
  }

  public subscribe(event: string, callback: EventCallback) {
    if (!this.listeners.has(event)) {
      this.listeners.set(event, []);
    }
    this.listeners.get(event)!.push(callback);
  }

  public unsubscribe(event: string, callback: EventCallback) {
    if (!this.listeners.has(event)) return;
    const callbacks = this.listeners.get(event)!;
    this.listeners.set(
      event,
      callbacks.filter(cb => cb !== callback)
    );
  }

  public emit(event: string, data: any) {
    if (!this.listeners.has(event)) return;
    this.listeners.get(event)!.forEach(callback => callback(data));
  }
} 