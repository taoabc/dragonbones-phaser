// Extends phaser declaration
import p from 'phaser';
import { ArmatureDisplay } from '../src/display/ArmatureDisplay';
import { DragonBonesData } from 'libdragonbones';

declare namespace Phaser {
  namespace Loader {
    interface LoaderPlugin {
      dragonbone: (dragonbonesName: string | object,
        textureURL?: string,
        atlasURL?: string,
        boneURL?: string,
        textureXhrSettings?: p.Types.Loader.XHRSettingsObject,
        atlasXhrSettings?: p.Types.Loader.XHRSettingsObject,
        boneXhrSettings?: p.Types.Loader.XHRSettingsObject) => Phaser.Loader.LoaderPlugin;
    }
  }

  namespace GameObjects {
    interface GameObjectFactory {
      armature: (armature: string, dragonBones?: string, skinName?: string, atlasTextureName?: string)
        => ArmatureDisplay;
      dragonBones: (dragonBonesName: string, textureScale?: number) => DragonBonesData;
    }
  }
}
