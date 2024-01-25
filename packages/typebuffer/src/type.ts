export type Scope = Record<string, any>; // 用于存储变量的作用域

/**
 * 将buffer中的数据转换
 */
export interface Pipe {
    /**
     * from buffer value to scope value
     * @param context 
     * @param scope 
     * @param value 
     * @returns 
     */
    toScope: (scope: Scope, value: any, context: Context) => void;
    /**
     * from object value to buffer value
     * @param context 
     * @param scope 
     * @returns 
     */
    toBuffer: (scope: Scope, context: Context) => any;
}

export interface TypeOp {
    /**
     * static length
     */
    len: number;
    /**
     * how to read data from buffer
     * @param context 
     * @param scope 
     * @returns 
     */
    read: (context: Context, scope: any) => any;
    /**
     * how to write data to buffer
     * @param context 
     * @param scope 
     * @param value 
     * @returns 
     */
    write: (context: Context, scope: any, value: any) => void;
}

export type Getter = Pipe["toBuffer"]
/**
 * 操作的上下文
 */
export interface Context {
    buffer: Buffer;
    offset: number;
}

export interface ObjectOp {
    type: TypeOp;
    pipe: Pipe;
}

