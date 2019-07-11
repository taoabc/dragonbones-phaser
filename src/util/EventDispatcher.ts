import Phaser from 'phaser';
import * as dragonBones from 'libdragonbones';

export class EventDispatcher extends Phaser.Events.EventEmitter implements dragonBones.IEventDispatcher {
    public hasDBEventListener(type: dragonBones.EventStringType): boolean {
        return this.listenerCount(type) > 0;
    }

    public dispatchDBEvent(type: dragonBones.EventStringType, eventObject: dragonBones.EventObject): void {
        this.emit(type, eventObject);
    }

    public addDBEventListener(type: dragonBones.EventStringType, listener: (e: dragonBones.EventObject) => void, thisObject?: any): void {
        this.on(type, listener, thisObject);
    }

    public removeDBEventListener(type: dragonBones.EventStringType, listener: (e: dragonBones.EventObject) => void, thisObject?: any): void {
        this.off(type, listener, thisObject);
    }
}
