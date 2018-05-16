import { StreamController } from 'sjs-stream';


export class DraggableEvent {
}
export class EventManager {
    constructor(draggable) {
    }
}
export class MouseManager extends EventManager {
}
export class DragInfo {
}
export class Draggable {
    constructor() {
        this._onDragStart = null;
        this._onDrag = null;
        this._onDragEnd = null;
        this._eventManagers = new Set();
        this._eventManagers.add(new MouseManager(this));
    }
    start(){
        if(this._onDragStart){
            this._onDragStart.add({type:'start'});
        }
        let next = () => {
            if(this._onDrag){
                this._onDrag.add({type:'drag'});
            }
            setTimeout(next, 2000);
        }
        next();
    }
    get onDragStart() {
        if (this._onDragStart === null) {
            this._onDragStart = new StreamController({
                onCancel: () => this._onDragStart = null
            });
        }
        return this._onDragStart.stream;
    }
    get onDrag() {
        if (this._onDrag === null) {
            this._onDrag = new StreamController({
                onCancel: () => this._onDrag = null
            });
        }
        return this._onDrag.stream;
    }
    get onDragEnd() {
        if (this._onDragEnd === null) {
            this._onDragEnd = new StreamController({
                onCancel: () => this._onDragEnd = null
            });
        }
        return this._onDragEnd.stream;
    }
    _handleDragStart(event) {
        this._currentDrag.started = true;
    }
}
