export default class Queue<T> {
  constructor(private items: T[] = []) {}

  public enqueue(...items: T[]): void {
    this.items.push(...items);
  }

  public dequeue(): T {
    return this.items.shift();
  }

  public isEmpty(): boolean {
    return this.size === 0;
  }

  public get size(): number {
    return this.items.length;
  }
}
