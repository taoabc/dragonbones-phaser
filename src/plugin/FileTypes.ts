import Phaser from 'phaser';

type FileTypeClass = new (...args: any[]) => Phaser.Loader.File;

interface Map {
    [key: string]: any;
}

export const FileTypes = {
    IMAGE: "imageFile",
    JSON: 'jsonFile',
    BINARY: 'binaryFile',

    map: {
        imageFile: Phaser.Loader.FileTypes.ImageFile,
        jsonFile: Phaser.Loader.FileTypes.JSONFile,
        binaryFile: Phaser.Loader.FileTypes.BinaryFile,
    } as Map,

    setType: (type: string, clazz: FileTypeClass): void => {
        FileTypes.map[type] = clazz;
    },

    getType: (type: string): FileTypeClass => {
        return FileTypes.map[type];
    },
};
