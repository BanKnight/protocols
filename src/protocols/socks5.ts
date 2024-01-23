/**
 * 参考:https://wiyi.org/socks5-protocol-in-deep.html
 */

import { Types } from "../ops";

export const TypeAddress = Types.struct()
    .define("family", Types.UInt8())
    .switch("family", {
        0x01: ["ipv4", Types.IPV4()],
        0x03: ["domain", Types.Domain()],
        0x04: ["ipv6", Types.IPV6BE()],
    })

export const Version = Types.struct()
    .define("version", Types.UInt8(0x05))

export const Negotiate = Types.struct(Version)
    .define("nmethods", Types.UInt8())

export const NegotiateReply = Types.struct(Version)
    .define("method", Types.UInt8())

export const Auth = Types.struct(Version)
    .define("uname", Types.L8String())
    .define("passwd", Types.L8String())

export const AuthReply = Types.struct(Version)
    .define("status", Types.UInt8())

export const Request = Types.struct(Version)
    .define("cmd", Types.UInt8())
    .define("rsv", Types.UInt8(0x00))
    .define("address", TypeAddress)
    .define("port", Types.UInt16BE())

export const Reply = Types.struct(Version)
    .define("reply", Types.UInt8())
    .define("rsv", Types.UInt8(0x00))
    .define("bind", TypeAddress)
    .define("port", Types.UInt16BE())

