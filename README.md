## windows 部署 front

在服务器上执行以下命令

```powerShall
./scripts/build.ps1`
-cosSecretId "yourCosSecretId"`
-cosSecretKey "yourCosSecretKey"`
-cosBucket "yourCosBucket"`
-region "yourRegion"`
-cdnUrl "yourCdnUrl"`
-apiKey “yourApiKey”
```

## 代理

使用 charles 的 mapRemote 功能，即可用原始域名进行代理。
