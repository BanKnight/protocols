export type ReadHandler = (context: Context, scope?: any) => any
export type WriteHandler = (context: Context, value: any, scope?: any) => void

export interface TypeOp {
    len: number;
    read: ReadHandler;
    write: WriteHandler;
}

export type Condition = (context: Context, scope: any) => boolean

export class Context {

    buffer: Buffer;
    offset: number;
    bitOffset: number;

    constructor(buffer: Buffer, offset: number, bitOffset?: number) {
        this.buffer = buffer;
        this.offset = offset;
        this.bitOffset = bitOffset || 0;
    }

    set bit(value: number) {
        this.bitOffset = value;
        this.offset += Math.floor(value / 8);
        this.bitOffset %= 8;
    }

    get bit() {
        return this.bitOffset;
    }
}