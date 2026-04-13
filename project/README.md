# AI Course Intro Deck Web

这套目录是“AI未来通识课”课程介绍的独立前端源码工程。

技术路线：

- `reveal.js`
- `Vite`
- 自定义 HTML / CSS 视觉系统

使用方式：

```bash
cd project
npm install
npm run dev
```

构建静态输出：

```bash
npm run build
```

构建后会额外生成两个可直接发送的 HTML 版本：

```text
../site/school.html
../site/institution.html
```

导出可交付 PDF：

```bash
npm run export:pdf
```

导出定向版本：

```bash
npm run export:pdf:school
npm run export:pdf:institution
npm run export:pdf:all
```

输出目录：

```text
site/
```

主要交付物：

```text
../site/index.html
../site/school.html
../site/institution.html
../site/ai-course-intro-deck.pdf
../site/ai-course-intro-deck-school.pdf
../site/ai-course-intro-deck-institution.pdf
```

说明：

- PDF 导出会自动先执行构建，再启动本地预览服务
- 导出默认使用本机 Chrome；如果路径不同，可先设置 `CHROME_PATH`
- 导出模式会自动关闭动画，并使用 `reveal.js` 的 `print-pdf` 视图保证分页稳定
- 开发预览时，也可以直接用 `?audience=school` 或 `?audience=institution` 查看定向版本
