import Phaser from 'phaser';

interface DecomposedMatrix {
    rotation: number;
    skewX: number;
    skewY: number;
    scaleX: number;
    scaleY: number;
    translateX: number;
    translateY: number;
}

export class TransformMatrix extends Phaser.GameObjects.Components.TransformMatrix {
    private tempDecomposedMatrix = this.decomposedMatrix as DecomposedMatrix;

    constructor(a?: number, b?: number, c?: number, d?: number, tx?: number, ty?: number) {
        super(a, b, c, d, tx, ty);
        this.tempDecomposedMatrix.skewX = 0;
        this.tempDecomposedMatrix.skewY = 0;
    }

    public decomposeMatrix(): DecomposedMatrix {
        // sort out rotation / skew..
        const a = this.a;
        const b = this.b;
        const c = this.c;
        const d = this.d;

        const skewX = -Math.atan2(-c, d);
        const skewY = Math.atan2(b, a);

        const delta = Math.abs(skewX + skewY);

        if (delta < 0.00001 || Math.abs(Phaser.Math.PI2 - delta) < 0.00001) {
            this.tempDecomposedMatrix.rotation = skewY;
            if (a < 0 && d >= 0) {
                this.tempDecomposedMatrix.rotation += (this.tempDecomposedMatrix.rotation <= 0) ? Math.PI : -Math.PI;
            }

            this.tempDecomposedMatrix.skewX = this.tempDecomposedMatrix.skewY = 0;
        } else {
            this.tempDecomposedMatrix.rotation = 0;
            this.tempDecomposedMatrix.skewX = skewX;
            this.tempDecomposedMatrix.skewY = skewY;
        }

        // next set scale
        this.tempDecomposedMatrix.scaleX = Math.sqrt((a * a) + (b * b));
        this.tempDecomposedMatrix.scaleY = Math.sqrt((c * c) + (d * d));

        // next set position
        this.tempDecomposedMatrix.translateX = this.tx;
        this.tempDecomposedMatrix.translateY = this.ty;

        return this.tempDecomposedMatrix;
    }

    public applyITRSC(x: number, y: number, rotation: number, scaleX: number, scaleY: number, skewX: number, skewY: number): this {
        this.a = Math.cos(rotation - skewY) * scaleX;
        this.b = Math.sin(rotation - skewY) * scaleX;
        this.c = -Math.sin(rotation + skewX) * scaleY;
        this.d = Math.cos(rotation + skewX) * scaleY;

        this.tx = x;
        this.ty = y;

        return this;
    }

    get skewX(): number {
        return -Math.atan2(-this.c, this.d);
    }

    get skewY(): number {
        return Math.atan2(this.b, this.a);
    }
}
