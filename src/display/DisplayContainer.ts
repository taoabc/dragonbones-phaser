// this class will be refactored due to official Container will be removed soon.
import Phaser from 'phaser';
import { TransformMatrix } from '../util/TransformMatrix';

export class DisplayContainer extends Phaser.GameObjects.Container {
  private _skewX = 0;
  private _skewY = 0;
  private tempTransformMatrix: TransformMatrix;

  public constructor(scene: Phaser.Scene, x?: number, y?: number, children?: Phaser.GameObjects.GameObject[]) {
    super(scene, x, y, children);
    this.tempTransformMatrix = new TransformMatrix();
  }

  public pointToContainer(source: Phaser.Math.Vector2 | Phaser.Geom.Point | { x?: number; y?: number },
    output?: Phaser.Math.Vector2 | Phaser.Geom.Point | { x?: number; y?: number }): Phaser.Math.Vector2 | Phaser.Geom.Point | { x?: number; y?: number } {
    if (output === undefined) {
      output = new Phaser.Math.Vector2();
    }

    if (this.parentContainer) {
      return this.parentContainer.pointToContainer(source, output);
    }

    const tempMatrix = this.tempTransformMatrix;

    //  No need to loadIdentity because applyITRSC overwrites every value anyway
    tempMatrix.applyITRSC(this.x, this.y, this.rotation, this.scaleX, this.scaleY, this._skewX, this._skewY);

    tempMatrix.invert();

    tempMatrix.transformPoint(source.x, source.y, output);

    return output;
  }

  public get skewX(): number {
    return this._skewX;
  }

  public set skewX(v: number) {
    this._skewX = v;
  }

  public get skewY(): number {
    return this._skewY;
  }

  public set skewY(v: number) {
    this._skewY = v;
  }

  public setSkew(sx: number, sy?: number): this {
    sy = sy === void 0 ? sx : sy;
    this.skewX = sx;
    this.skewY = sy;

    return this;
  }
}
