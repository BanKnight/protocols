/**
 * 参考： https://xtls.github.io/Xray-docs-next/development/protocols/vless.html
 */

import { Types, when } from "../ops";

export const TypeAddress = Types.struct()
    .define("protocol", Types.UInt8())       //0x1: tcp, 0x2:udp
    .define("port", Types.L16BufferBE())
    .define("family", Types.UInt8())
    .define("ipv4", when("family").toBe(0x01).as(Types.IPV4()))
    .define("domain", when("family").toBe(0x02).as(Types.Domain()))
    .define("ipv6", when("family").toBe(0x03).as(Types.IPV6BE()))

export const Success = Types.struct()
    .define("version", Types.UInt8(0))
    .define("error", Types.UInt8(0))

export const HandShake = Types.struct()
    .define("version", Types.UInt8())
    .define("uuid", Types.Bytes(16))
    .define("opt", Types.L8Buffer())      //opt buffer
    .define("cmd", Types.UInt8())

export const Packet = Types.struct(HandShake)
    .define("tcp", when("cmd").toBe(0x01).as(Types.All()))
    .define("udp", when("cmd").toBe(0x02).as(Types.L16BufferBE()))
    .define("mux", when("cmd").toBe(0x03).as(Types.All()))




