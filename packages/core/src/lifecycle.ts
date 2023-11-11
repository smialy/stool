export interface IDisposable {
    dispose(): void;
}

export function isDisposable<T extends object>(obj: T): boolean {
    return typeof (<IDisposable>obj)?.dispose === 'function';
}
