import Phaser from 'phaser';
import * as dragonBones from 'libdragonbones';

export class TextureAtlasData extends dragonBones.TextureAtlasData {

  get renderTexture(): Phaser.Textures.Texture {
    return this._renderTexture;
  }

  // TODO: test set value runtime
  set renderTexture(value: Phaser.Textures.Texture) {
    if (!value || this._renderTexture === value) {
      return;
    }

    if (this._renderTexture) {
      this._renderTexture.destroy();
    }

    this._renderTexture = value;

    for (const k in this.textures) {
      const data = this.textures[k] as TextureData;
      const frame = this._renderTexture.add(
        k,
        0,   // all textures were added through `textures.addImage`, so their sourceIndex are all 0
        data.region.x, data.region.y,
        data.region.width, data.region.height,
      );
      if (data.rotated) {
        frame.rotated = true;
        frame.updateUVsInverted();
      }
      data.renderTexture = frame;
    }
  }
  public static toString(): string {
    return '[class dragonBones.PhaserTextureAtlasData]';
  }

  private _renderTexture: Phaser.Textures.Texture = null;

  public createTexture(): TextureData {
    return dragonBones.BaseObject.borrowObject(TextureData);
  }

  protected _onClear(): void {
    super._onClear();

    if (this._renderTexture !== null) {
      this._renderTexture.destroy();
    }

    this._renderTexture = null;
  }
}

export class TextureData extends dragonBones.TextureData {
  public static toString(): string {
    return '[class dragonBones.PhaserTextureData]';
  }

  public renderTexture: Phaser.Textures.Frame = null; // Initial value.

  protected _onClear(): void {
    super._onClear();

    if (this.renderTexture !== null) {
      this.renderTexture.destroy();
    }

    this.renderTexture = null;
  }
}
