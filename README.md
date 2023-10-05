# FRP Desktop

FRP Desktop 是 [FRP](https://github.com/fatedier/frp) 的 GUI 版本，提供了可视化编辑 FRP Client 的能力。

![1696478693466](https://github.com/Siykt/frp-desktop/assets/44022526/9b4d2355-d682-4c32-a680-f86a7aeb303c)

## FRP 服务端部署

配置 `frps.init`，参考：[官方文档](https://gofrp.org/docs/examples/vhost-http/)

### 使用 Docker 部署

```bash
docker run --restart=always --network host -d -v /etc/frp/frps.ini:/etc/frp/frps.ini --name frps snowdreamtech/frps
```
