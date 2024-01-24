# protocols（wip）

包含多个npm库，用于简化二进制协议的实现

## typebuffer

一个简单的二进制读写库,可用于定义复杂的协议

### 安装方式

```bash
npm install typebuffer
```

### 例子：socks5例子

```typescript
import { Types } from "typebuffer";

export const TypeAddress = Types.Struct()
    .define("family", Types.UInt8())
    .switch("family", {
        0x01: ["ipv4", Types.IPV4()],
        0x03: ["domain", Types.Domain()],
        0x04: ["ipv6", Types.IPV6BE()],
    })

export const Version = Types.Struct()
    .define("version", Types.UInt8(0x05))

export const Negotiate = Types.Struct(Version)
    .define("nmethods", Types.UInt8())

export const NegotiateReply = Types.Struct(Version)
    .define("method", Types.UInt8())

export const Auth = Types.Struct(Version)
    .define("uname", Types.L8String())
    .define("passwd", Types.L8String())

export const AuthReply = Types.Struct(Version)
    .define("status", Types.UInt8())

export const Request = Types.Struct(Version)
    .define("cmd", Types.UInt8())
    .define("rsv", Types.UInt8(0x00))
    .define("address", TypeAddress)
    .define("port", Types.UInt16BE())

export const Reply = Types.Struct(Version)
    .define("reply", Types.UInt8())
    .define("rsv", Types.UInt8(0x00))
    .define("bind", TypeAddress)
    .define("port", Types.UInt16BE())
```

## typeprotols

预定义了很多协议的库，包含如下：

+ socks5
+ vless
+ ws
+ mux
