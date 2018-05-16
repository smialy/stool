import { IStream } from './index';
export declare class DraggableEvent {
}
export declare class EventManager {
    constructor(draggable: Draggable);
}
export declare class MouseManager extends EventManager {
}
export declare class DragInfo {
}
export declare class Draggable {
    private _onDragStart;
    private _onDrag;
    private _onDragEnd;
    private _eventManagers;
    private _currentDrag;
    constructor();
    readonly onDragStart: IStream<DraggableEvent>;
    readonly onDrag: IStream<DraggableEvent>;
    readonly onDragEnd: IStream<DraggableEvent>;
    _handleDragStart(event: UIEvent): void;
}
