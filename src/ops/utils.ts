import { TypeOp } from ".";
class When {
    cmp!: (_: any, scope: any) => boolean;
    constructor(private name: string) { }

    toBe(value: any) {
        const name = this.name;
        this.cmp = (_: any, scope: any) => {
            return scope[name] == value;
        }
        return this
    }
    notBe(value: any) {
        const name = this.name;
        this.cmp = (_: any, scope: any) => {
            return scope[name] !== value;
        }
        return this
    }
    as(op: TypeOp) {
        const cmp = this.cmp;
        return {
            len: 0,
            read(context: any, scope: any) {
                if (cmp(context, scope)) {
                    return op.read(context, scope);
                }
            },
            write(context: any, scope: any, value: any) {
                if (cmp(context, scope)) {
                    op.write(context, scope, value);
                }
            }
        }
    }
}

export function when(name: string) {
    return new When(name);
}

export function get(scope: any, name: string) {
    return scope[name];
}

export function set(scope: any, name: string, value: any) {
    scope[name] = value;
}

