import { IStream, StreamController, fromEvents } from 'sjs-stream';

export class DraggableEvent{

}

export class EventManager {

    private element: HTMLElement;

    constructor(element: HTMLElement){
        this.element = element;
        this.installStart();
    }

    installStart(){
        this.element
    }
}

export _MouseManager extends EventManager {
    installStart(){
        fromEvents(this.element).subscribe(event => {

        });
    }
}

export class MouseManager extends EventManager {

}

export class DragInfo {

}

export class Draggable {

    private _onDragStart: StreamController<DraggableEvent> | null = null;
    private _onDrag: StreamController<DraggableEvent> | null = null;
    private _onDragEnd: StreamController<DraggableEvent> | null = null;
    private _eventManagers: Set<EventManager> = new Set();
    private _currentDrag: DragInfo;

    constructor(){
        this._eventManagers.add(new MouseManager(this));
    }
    get onDragStart(): IStream<DraggableEvent> {
        if (this._onDragStart === null) {
            this._onDragStart = new StreamController<DraggableEvent>({
                onCancel: () => this._onDragStart = null
            });
        }
        return this._onDragStart.stream;
    }

    get onDrag(): IStream<DraggableEvent> {
        if (this._onDrag === null) {
            this._onDrag = new StreamController<DraggableEvent>({
                onCancel: () => this._onDrag = null
            });
        }
        return this._onDrag.stream;
    }

    get onDragEnd(): IStream<DraggableEvent> {
        if (this._onDragEnd === null) {
            this._onDragEnd = new StreamController<DraggableEvent>({
                onCancel: () => this._onDragEnd = null
            });
        }
        return this._onDragEnd.stream;
    }
    _handleDragStart(event: UIEvent) {
        this._currentDrag.started = true;
    }
}
