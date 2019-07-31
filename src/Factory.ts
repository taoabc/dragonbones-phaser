import Phaser from 'phaser';
import * as dragonBones from 'libdragonbones';

import { TextureAtlasData } from './display/TextureAtlasData';
import { ArmatureDisplay } from './display/ArmatureDisplay';
import { Slot } from './display/Slot';
export class Factory extends dragonBones.BaseFactory {
    protected _scene: Phaser.Scene;
    protected _dragonBones: dragonBones.DragonBones;

    constructor(dragonBones: dragonBones.DragonBones, scene: Phaser.Scene, dataParser?: dragonBones.DataParser) {
        super(dataParser);
        this._scene = scene;
        this._dragonBones = dragonBones;
    }

    // dragonBonesName must be assigned, or can't find in cache inside
    public buildArmatureDisplay(armatureName: string, dragonBonesName: string, skinName: string = '', textureAtlasName: string = '', textureScale = 1.0): ArmatureDisplay {
        let armature: dragonBones.Armature;

        if (this.buildDragonBonesData(dragonBonesName, textureScale)) {
            armature = this.buildArmature(armatureName, dragonBonesName, skinName, textureAtlasName);
        }

        return armature.display as ArmatureDisplay;
    }

    protected _isSupportMesh(): boolean {
        console.warn('Mesh is not supported yet');

        return false;
    }

    protected _buildTextureAtlasData(textureAtlasData: TextureAtlasData, textureAtlas: Phaser.Textures.Texture): dragonBones.TextureAtlasData {
        if (textureAtlasData) {
            textureAtlasData.renderTexture = textureAtlas;
        } else {
            textureAtlasData = dragonBones.BaseObject.borrowObject(TextureAtlasData);
        }

        return textureAtlasData;
    }

    protected _buildArmature(dataPackage: dragonBones.BuildArmaturePackage): dragonBones.Armature {
        const armature = dragonBones.BaseObject.borrowObject(dragonBones.Armature);
        const armatureDisplay = new ArmatureDisplay(this._scene);

        armature.init(
            dataPackage.armature,
            armatureDisplay, armatureDisplay, this._dragonBones,
        );

        return armature;
    }

    protected _buildSlot(dataPackage: dragonBones.BuildArmaturePackage, slotData: dragonBones.SlotData, armature: dragonBones.Armature): Slot {
        const slot = dragonBones.BaseObject.borrowObject(Slot);
        const rawDisplay = this._scene.dragonbone.createSlotDisplayPlaceholder();
        const meshDisplay = rawDisplay;  // TODO: meshDisplay is not supported yet
        slot.init(slotData, armature, rawDisplay, meshDisplay);

        return slot;
    }

    private buildDragonBonesData(dragonBonesName: string, textureScale = 1.0): dragonBones.DragonBonesData {
        let data = this._dragonBonesDataMap[dragonBonesName];
        if (!data) {
            const cache = this._scene.cache;
            const boneRawData: any = cache.custom.dragonbone.get(dragonBonesName);
            if (boneRawData) {
                // parse raw data and add to cache map
                data = this.parseDragonBonesData(boneRawData, dragonBonesName, textureScale);

                const texture = this._scene.textures.get(dragonBonesName);
                const json = cache.json.get(`${dragonBonesName}_atlasjson`);

                this.parseTextureAtlasData(json, texture, texture.key, textureScale);
            }
        }
        return data;
    }
}
