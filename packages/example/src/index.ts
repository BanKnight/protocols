import { Types } from "typebuffer";

export const Login = Types.Struct()
    .define("name", Types.L8String())
    .define("token", Types.L8String())

export const SocketBase = Types.Struct()
    .define("socket", Types.UInt32BE())

export const TypeAddress = Types.Struct()
    .define("protocol", Types.UInt8())       //0x1: tcp, 0x2:udp
    .define("port", Types.L16BufferBE())
    .define("family", Types.UInt8())
    .select("family", {
        0x01: ["ipv4", Types.IPV4()],
        0x02: ["domain", Types.Domain()],
        0x03: ["ipv6", Types.IPV6BE()],
    })

export const Listen = Types.Struct(SocketBase)
    .define("port", Types.UInt32BE())
    .define("protocol", Types.L8String())

export const Accept = Types.Struct(SocketBase)
    .define("remote", Types.UInt32BE())
    .define("port", Types.UInt32BE())
    .define("host", Types.L8String())

export const Connect = Types.Struct(SocketBase)
    .define("port", Types.UInt32BE())
    .define("protocol", Types.L8String())
    .define("host", Types.L8String())

export const Data = Types.Struct(SocketBase)
    .define("data", Types.All())

export const Close = Types.Struct(SocketBase)

export const Alive = Types.Struct(TypeAddress)

export const Send = Types.Struct()
    .define("func", Types.L8String())
    .select("func", {
        "login": ["body", Login],
        "listen": ["body", Listen],
        "accept": ["body", Accept],
        "connect": ["body", Connect],
        "data": ["body", Data],
        "close": ["body", Close],
        "alive": ["body", Alive],
    })

export const Call = Types.Struct()
    .define("session", Types.UInt16BE())
    .concat(Send)

export const Error = Types.Struct()
    .define("session", Types.UInt16BE())
    .define("error", Types.L8String())

export const Resp = Types.Struct()
    .define("session", Types.UInt16BE())
    .define("body", Types.Json())

export const Packet = Types.Struct()
    .define("cmd", Types.UInt8())
    .select("cmd", {
        0x01: ["body", Send],
        0x02: ["body", Call],
        0x03: ["body", Error],
        0x04: ["body", Resp],
    })


const context = {
    buffer: Buffer.alloc(65536),
    offset: 0,
}

const packet = {
    cmd: 0x01,
    body: {
        func: "login",
        body: {
            name: "test",
            token: "abcd"
        }
    }
}

Packet.write(context, null, packet)

const recvContext = {
    buffer: context.buffer.subarray(0, context.offset),
    offset: 0
}

const abcd = Packet.read(recvContext)

console.dir(abcd)
