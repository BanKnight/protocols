/**
 * 参考： https://xtls.github.io/Xray-docs-next/development/protocols/vless.html
 */

import { Type, When } from "../ops";

export const TypeAddress = Type.Object()
    .define("protocol", Type.UInt8())       //0x1: tcp, 0x2:udp
    .define("port", Type.L16BufferBE())
    .define("family", Type.UInt8())
    .define("ipv4", Type.IPV4(), When("family", 0x01))
    .define("domain", Type.Domain(), When("family", 0x02))
    .define("ipv6", Type.IPV6BE(), When("family", 0x03))

export const Success = Type.Object()
    .define("version", Type.UInt8(0))
    .define("error", Type.UInt8(0))

export const HandShake = Type.Object()
    .define("version", Type.UInt8())
    .define("uuid", Type.SubArray(16))
    .define("opt", Type.L8Buffer())      //opt buffer
    .define("cmd", Type.UInt8())

export const Packet = Type.Object(HandShake)
    .define("tcp", Type.All(), When("cmd", 0x01))
    .define("udp", Type.L16BufferBE(), When("cmd", 0x02))
    .define("mux", Type.All(), When("cmd", 0x03))




