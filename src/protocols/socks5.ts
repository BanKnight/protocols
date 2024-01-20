/**
 * 参考:https://wiyi.org/socks5-protocol-in-deep.html
 */

import { Type, When } from "../ops";

export const TypeAddress = Type.Object()
    .define("family", Type.UInt8())
    .define("ipv4", Type.IPV4(), When("family", 0x01))
    .define("domain", Type.Domain(), When("family", 0x03))
    .define("ipv6", Type.IPV6BE(), When("family", 0x04))

export const Version = Type.Object()
    .define("version", Type.UInt8(0x05))

export const Negotiate = Type.Object(Version)
    .define("nmethods", Type.UInt8())

export const NegotiateReply = Type.Object(Version)
    .define("method", Type.UInt8())

export const Auth = Type.Object(Version)
    .define("uname", Type.L8String())
    .define("passwd", Type.L8String())

export const AuthReply = Type.Object(Version)
    .define("status", Type.UInt8())

export const Request = Type.Object(Version)
    .define("cmd", Type.UInt8())
    .define("rsv", Type.UInt8(0x00))
    .define("address", TypeAddress)
    .define("port", Type.UInt16BE())

export const Reply = Type.Object(Version)
    .define("reply", Type.UInt8())
    .define("rsv", Type.UInt8(0x00))
    .define("bind", TypeAddress)
    .define("port", Type.UInt16BE())

