import Phaser from 'phaser';

import * as dragonBones from 'libdragonbones';

import { Factory } from '../Factory';
import { TextureTintPipeline } from '../pipeline/TextureTintPipeline';
import { EventDispatcher } from '../util/EventDispatcher';
import { SlotImage } from '../display/SlotImage';
import { SlotSprite } from '../display/SlotSprite';
import { ArmatureDisplay } from '../display/ArmatureDisplay';
import { DragonBonesFile } from './DragonBonesFile';

export class DragonBonesScenePlugin extends Phaser.Plugins.ScenePlugin {

  get factory(): Factory {  // lazy instancing
    if (!this._factory) {
      this._dbInst = new dragonBones.DragonBones(new EventDispatcher());
      this._factory = new Factory(this._dbInst, this.scene);
    }

    return this._factory;
  }

  protected _dbInst?: dragonBones.DragonBones;
  protected _factory?: Factory;

  constructor(scene: Phaser.Scene, pluginManager: Phaser.Plugins.PluginManager) {
    super(scene, pluginManager);

    const game = this.game;

    // bone data store
    game.cache.addCustom('dragonbone');

    if (this.game.config.renderType === Phaser.WEBGL) {
      const renderer = this.game.renderer as Phaser.Renderer.WebGL.WebGLRenderer;
      if (!renderer.hasPipeline('PhaserTextureTintPipeline')) {
        renderer.addPipeline('PhaserTextureTintPipeline', new TextureTintPipeline({ game, renderer }));
      }
    }
    /**
         * Add dragonbone alone
         * add.dragonbone('dragonboneName');
         */
    pluginManager.registerGameObject('dragonbone', CreateDragonBoneRegisterHandler);
    /**
         * Add armature, this will add dragonBones when not exist
         * add.armature('armatureName', 'dragonbonesName');
         */
    pluginManager.registerGameObject('armature', CreateArmatureRegisterHandler);
    /**
         * load.dragonbone('xx', 'texImage', 'texJson', 'skeJson');
         */
    pluginManager.registerFileType('dragonbone', DragonBoneFileRegisterHandler, scene);
  }

  public createArmature(armature: string, dragonBones?: string, skinName?: string, atlasTextureName?: string, textureScale = 1.0): ArmatureDisplay {
    const display = this.factory.buildArmatureDisplay(armature, dragonBones, skinName, atlasTextureName, textureScale);
    this.systems.displayList.add(display);
    // use db.clock instead, if here we just use this.systems.updateList.add(display), that will cause the db event is dispatched with 1 or more frames delay
    if (this._dbInst) {
      this._dbInst.clock.add(display.armature);
    }

    return display;
  }

  public createDragonBones(dragonBonesName: string, textureScale = 1.0): DragonBonesData {
    return this.factory.buildDragonBoneData(dragonBonesName, textureScale);
  }

  /*
    * Slot has a default display, usually it is a transparent image, here you could create a display whatever you want as the default one which -
    * has both skewX / skewY attributes and use "PhaserTextureTintPipeline" to render itself, or simply just use SlotImage or SlotSprite.
    */
  public createSlotDisplayPlaceholder(): SlotImage | SlotSprite {
    return new SlotImage(this.scene, 0, 0);
  }

  public boot(): void {
    this.systems.events.once('destroy', this.destroy, this);
    this.start();
  }

  public start(): void {
    const ee = this.systems.events;

    ee.on('update', this.update, this);
    ee.once('shutdown', this.shutdown, this);
  }

  public shutdown(): void {
    const ee = this.systems.events;

    ee.off('update', this.update, this);
    ee.off('shutdown', this.shutdown, this);
  }

  public destroy(): void {
    this.shutdown();

    this._factory =
            this._dbInst = null;

    this.pluginManager =
            this.game =
            this.scene =
            this.systems = null;
  }

  private update(time: number, delta: number): void {
    this._dbInst && this._dbInst.advanceTime(delta * 0.001);
  }
}

const CreateArmatureRegisterHandler = function (armature: string, dragonBones?: string, skinName?: string, atlasTextureName?: string): ArmatureDisplay {
  return this.scene.dragonbone.createArmature(armature, dragonBones, skinName, atlasTextureName);
};

const CreateDragonBoneRegisterHandler = function(dragonBonesName: string, textureScale = 1.0): DragonBonesData {
  return this.scene.dragonbone.createDragonBones(dragonBonesName, textureScale);
};

const DragonBoneFileRegisterHandler = function (dragonbonesName: string | object,
  textureURL?: string,
  atlasURL?: string,
  boneURL?: string,
  textureXhrSettings?: Phaser.Types.Loader.XHRSettingsObject,
  atlasXhrSettings?: Phaser.Types.Loader.XHRSettingsObject,
  boneXhrSettings?: Phaser.Types.Loader.XHRSettingsObject) {
  const multifile = new DragonBonesFile(this, dragonbonesName, textureURL, atlasURL, boneURL, textureXhrSettings, atlasXhrSettings, boneXhrSettings);
  this.addFile(multifile.files);

  return this;
};
