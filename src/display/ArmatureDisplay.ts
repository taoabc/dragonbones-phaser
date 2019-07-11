import Phaser from 'phaser';
import * as dragonBones from 'libdragonbones';
import { DisplayContainer } from './DisplayContainer';

export class ArmatureDisplay extends DisplayContainer implements dragonBones.IArmatureProxy {
    public debugDraw = false;
    private _armature: dragonBones.Armature;

    constructor(scene: Phaser.Scene) {
        super(scene);
    }

    public dbInit(armature: dragonBones.Armature): void {
        this._armature = armature;
    }

    public dbClear(): void {
        this.removeAllListeners();
        if (this._armature) {
            this._armature.dispose();
        }
        this._armature = null;
    }

    public dbUpdate(): void {
        // TODO: draw debug graphics
        if (this.debugDraw) {
        }
    }

    public dispose(disposeProxy: boolean): void {
        this.dbClear();
        if (disposeProxy === true) {
            super.destroy();
        }
    }

    public destroy(): void {
        this.dispose(true);
    }

    public dispatchDBEvent(type: dragonBones.EventStringType, eventObject: dragonBones.EventObject): void {
        this.emit(type, eventObject);
    }

    public hasDBEventListener(type: dragonBones.EventStringType): boolean {
        return this.listenerCount(type) > 0;
    }

    public addDBEventListener(type: dragonBones.EventStringType, listener: (event: dragonBones.EventObject) => void, scope?: any): void {
        this.on(type, listener, scope);
    }

    public removeDBEventListener(type: dragonBones.EventStringType, listener: (event: dragonBones.EventObject) => void, scope?: any): void {
        this.off(type, listener, scope);
    }

    get armature(): dragonBones.Armature {
        return this._armature;
    }

    get animation(): Animation {
        return this._armature.animation;
    }
}
