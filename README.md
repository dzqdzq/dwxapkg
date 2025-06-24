# unwxapkg
支持wxapkg格式的解压和压缩
安装：
```sh
npm i https://github.com/dzqdzq/unwxapkg.git -g
```

压缩命令：unwxapkg dir   
默认生成文件：dir.wxapkg

解压命令： unwxapkg file
默认生成目录： file/

说明： 如果参数是目录，那么将对这个目录压缩，默认排除点开头的文件。 如果是文件名， 那么默认执行解压， 目前支持的文件格式有'.wxapkg', '.wxvpkg', '.wx'。

<b>2023年11月19日更新：</b><br/>
支持PC端小游戏解压，使用方法：unwxapkg /a/b/c/111.wxapkg  wx111111111
如果wxapkg文件在微信小程序存放目录，可以忽略wxid参数

<b>2024年01月04日更新：</b><br/>
Mac下执行:<br/>
unwxapkg /a/b/c/.wxapplet/packages/wx2f7fda52d8d031ee/139/xxxxx_dir<br/>
生成的xxxxx_dir.wxapkg 压缩包不会加密<br/>
unwxapkg /a/b/c//.wxapplet/packages/wx2f7fda52d8d031ee/139/xxxxx_dir wx2f7fda52d8d031ee<br/>
生成的xxxxx_dir.wxapkg 由于显示指定wxid,压缩包会加密<br/>
<br/>
<br/>
Win下执行:<br/>
unwxapkg /a/b/c/.wxapplet/packages/wx2f7fda52d8d031ee/139/xxxxx_dir<br/>
生成的xxxxx_dir.wxapkg 压缩包会加密，因为在路径中解析到wx2f7fda52d8d031ee<br/>
unwxapkg /a/b/c/.wxapplet/packages/wx2f7fda52d8d031ee/139/xxxxx_dir wx2f7fda52d8d031ee<br/>
生成的xxxxx_dir.wxapkg 由于显示指定wxid,压缩包会加密<br/>
unwxapkg /a/b/c/139/xxxxx_dir wx2f7fda52d8d031ee<br/>
生成的xxxxx_dir.wxapkg 由于显示指定wxid,压缩包会加密<br/>
unwxapkg /a/b/c/139/xxxxx_dir<br/>
生成的xxxxx_dir.wxapkg 没有指定wxid, 也没有解析到wxid，跳过加密<br/>