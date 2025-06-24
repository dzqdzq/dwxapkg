English | [中文](./README.zh-CN.md) 

# dwxapkg

A tool for compressing and decompressing WeChat Mini Program (`.wxapkg`) files.

## Installation

```sh
npm install -g https://github.com/dzqdzq/dwxapkg.git
```

## Usage

The tool can either compress a directory into a `.wxapkg` file or decompress a `.wxapkg` file into a directory.

### Commands

| Action      | Command                | Default Output      |
| :---------- | :--------------------- | :------------------ |
| Compress    | `dwxapkg <directory>` | `<directory>.wxapkg` |
| Decompress  | `dwxapkg <file>`      | `<file>/`           |

**Note:**
*   If the argument is a directory, it will be compressed. Files starting with a dot (`.`) are excluded by default.
*   If the argument is a file, it will be decompressed. Supported file extensions are `.wxapkg`, `.wxvpkg`, and `.wx`.

### Encryption and Decryption

This tool supports encryption and decryption for PC Mini Program packages.

#### Decompression

To decompress an encrypted PC Mini Program package, you need to provide the `wxid`:

```sh
dwxapkg /path/to/your/package.wxapkg your_wxid
```

If the `.wxapkg` file is located in the WeChat Mini Program's storage directory, the `wxid` can be omitted.

#### Compression

The encryption behavior during compression depends on the operating system and whether a `wxid` is provided.

**On macOS:**
*   **Without `wxid`**: The package will **not** be encrypted.
    ```sh
    dwxapkg /path/to/your/directory
    ```
*   **With `wxid`**: The package **will** be encrypted.
    ```sh
    dwxapkg /path/to/your/directory your_wxid
    ```

**On Windows:**
*   If the `wxid` can be automatically detected from the file path (e.g., inside a `.wxapplet` directory), the package **will** be encrypted.
*   If a `wxid` is explicitly provided, the package **will** be encrypted.
*   If no `wxid` is provided and it cannot be detected from the path, encryption will be skipped.
