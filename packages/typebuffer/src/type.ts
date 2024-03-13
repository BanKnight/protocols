// 用于存储变量的作用域
export type Scope = Record<string, any>;
/**
 * 用于转换类型的
 */
export type Getter = (scope: Scope, context: Context) => any;

/**
 * 对属性的读写
 * 可以是单个，也可以是多个
 */
export interface Attribute {
    /**
     * 获取属性
     * @param scope 
     * @param context 
     * @returns 
     */
    get: (scope: Scope, context: Context) => any;
    /**
     * 设置属性
     * @param scope 
     * @param value 
     * @param context 
     * @returns 
     */
    set: (scope: Scope, value: any, context: Context) => void;
}

/**
 * 管道，将两侧的数据进行转换
 */
export interface Pipe {
    /**
     * transform left value to right
     * @param scope 
     * @param value 
     * @param context 
     * @returns 
     */
    fromLeft: (value: any, scope: Scope, context: Context) => any;
    /**
     * transform right value to left
     * @param context 
     * @param scope 
     * @param value 
     * @returns 
     */
    fromRight: (value: any, scope: Scope, context: Context) => any;
}

export interface TypeOp {
    /**
     * static length
     */
    len: number;
    /**
     * read buffer
     * @param context 
     * @param scope 
     * @returns 
     */
    read: (context: Context, scope: any) => any;
    /**
     * write buffer
     * @param context 
     * @param scope 
     * @param value 
     * @returns 
     */
    write: (context: Context, scope: any, value: any) => void;
}

/**
 * 操作的上下文
 */
export interface Context {
    /**
     * 读下标
     */
    read: number
    /**
     * 缓冲区
     */
    buffer: Buffer;
    /**
     * 写下标
     */
    write: number;
}

/**
 * 条件
 */
export type Condition = (scope: Scope, context: Context) => boolean;

/**
 * 属性操作器
 */
export interface StructOp {

    /**
     * 属性操作
     */
    attribute: Attribute;
    /**
     * 经过的管道
     */
    pipes: Pipe[];
    /**
     * 管道的末端是对buffer的操作
     */
    type: TypeOp;
}

