import Phaser from 'phaser';
import { extendSkew } from '../util/SkewComponent';

export class SlotImage extends Phaser.GameObjects.Image {
  constructor(scene: Phaser.Scene, x: number, y: number, texture?: string, frame?: string | number) {
    super(scene, x, y, texture, frame);
    this.setPipeline('PhaserTextureTintPipeline');  // use customized pipeline
  }
}

extendSkew(SlotImage);  // skew mixin
