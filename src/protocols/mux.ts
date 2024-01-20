/**
 * 参考： https://xtls.github.io/Xray-docs-next/development/protocols/muxcool.html
 */
import { Type, When } from "../ops";

export const TypeAddress = Type.Object()
    .define("protocol", Type.UInt8())       //0x1: tcp, 0x2:udp
    .define("port", Type.L16BufferBE())
    .define("family", Type.UInt8())
    .define("ipv4", Type.IPV4(), When("family", 0x01))
    .define("domain", Type.Domain(), When("family", 0x02))
    .define("ipv6", Type.IPV6BE(), When("family", 0x03))

const New = Type.Object(TypeAddress)
    .define("tcp", Type.All(), When("protocol", 0x01))
    .define("udp", Type.L16BufferBE(), When("protocol", 0x02))

const KeepAlive = Type.Object(TypeAddress)

export const Meta = Type.Object()
    .define("uid", Type.UInt16BE())
    .define("cmdType", Type.UInt8())
    .define("new", New, When("cmdType", 0x01))
    .define("keep", Type.All(), When("cmdType", 0x02))
    .define("end", Type.Ignore(), When("cmdType", 0x03))
    .define("keepAlive", KeepAlive, When("cmdType", 0x04))

export const Packet = Type.Object()
    .define("meta", Type.L16ObjectBe(Meta))
    .define("extra", Type.L16BufferBE(), When("meta.opt", 0x01))



