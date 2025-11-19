

## macOS 权限问题说明（vite: Permission denied）

如果在 macOS 下执行 `npm run dev` 出现：

```bash
sh: node_modules/.bin/vite: Permission denied
```

说明下载 / 解压后的项目在本地生成的 `node_modules/.bin` 缺少可执行权限。解决方式：

### 方式一：使用脚本一键修复（推荐）

```bash
cd mp3-to-wav
npm install
bash fix-permissions.sh
npm run dev
```

### 方式二：手动执行 chmod

```bash
cd mp3-to-wav
npm install
chmod -R +x node_modules/.bin
npm run dev
```

两种方式任选其一即可解决。
