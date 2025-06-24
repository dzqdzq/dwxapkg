[English](./README.md) | 中文

# dwxapkg

一个用于压缩和解压微信小程序（`.wxapkg`）文件的工具。

## 安装

```sh
npm install -g https://github.com/dzqdzq/dwxapkg.git
```

## 使用方法

该工具可以将目录压缩为 `.wxapkg` 文件，或将 `.wxapkg` 文件解压为目录。

### 命令

| 操作 | 命令 | 默认输出 |
| :--- | :--- | :--- |
| 压缩 | `dwxapkg <目录>` | `<目录>.wxapkg` |
| 解压 | `dwxapkg <文件>` | `<文件>/` |

**注意：**
* 如果参数是目录，它将被压缩。以点（`.`）开头的文件默认被排除。
* 如果参数是文件，它将被解压。支持的文件扩展名有 `.wxapkg`、`.wxvpkg` 和 `.wx`。

### 加密与解密

本工具支持 PC 端小程序包的加密和解密。

#### 解密

要解密一个加密的 PC 端小程序包，您需要提供 `wxid`：

```sh
dwxapkg /path/to/your/package.wxapkg your_wxid
```

如果 `.wxapkg` 文件位于微信小程序的存储目录中，可以省略 `wxid`。

#### 加密

压缩过程中的加密行为取决于操作系统以及是否提供了 `wxid`。

**在 macOS 上：**
* **没有 `wxid`**：包将**不会**被加密。
  ```sh
  dwxapkg /path/to/your/directory
  ```
* **有 `wxid`**：包将**会**被加密。
  ```sh
  dwxapkg /path/to/your/directory your_wxid
  ```

**在 Windows 上：**
* 如果可以从文件路径中自动检测到 `wxid`（例如，在 `.wxapplet` 目录内），包将**会**被加密。
* 如果明确提供了 `wxid`，包将**会**被加密。
* 如果没有提供 `wxid`，也无法从路径中检测到，则会跳过加密。

## 更新日志

*   **2023-11-19**：增加了对 PC 端小游戏包的解压支持。
*   **2024-01-04**：优化了在 macOS 和 Windows 环境下压缩时的加密逻辑。