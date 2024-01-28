import { Context, Pipe, Scope, StructOp, TypeOp } from "./type";
import * as Attributes from "./attributes";

export function makeOp(names: string | Array<string>, pipe: Pipe | TypeOp, type?: TypeOp): StructOp {

    const isArray = names instanceof Array;
    const attribute = isArray ? Attributes.Many(names) : Attributes.Single(names as string)

    if (isArray && !type) throw new Error("Type must be specified for arrays of names")

    //@ts-ignore
    const op: StructOp = { pipes: [], attribute }

    if (type) {
        op.type = type
        op.pipes.push(pipe as Pipe)
    }
    else {
        op.type = pipe as TypeOp
    }
    return op
}

export function opRead(op: StructOp, context: Context, scope: Scope) {
    let value = op.type.read(context, scope)

    for (let i = op.pipes.length - 1; i >= 0; i--) {
        const pipe = op.pipes[i]
        value = pipe!.fromRight(value, scope, context)
    }

    op.attribute.set(scope, value, context)
}

export function opWrite(op: StructOp, context: Context, scope: Scope) {
    let value = op.attribute.get(scope, context)

    for (let i = 0; i < op.pipes.length; i++) {
        const pipe = op.pipes[i]
        value = pipe!.fromLeft(value, scope, context)
    }
    if (!value) {
        return
    }
    op.type.write(context, scope, value)
}

export function get(scope: any, name: string) {
    return scope[name];
}

export function set(scope: any, name: string, value: any) {
    scope[name] = value;
}

