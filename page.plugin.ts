import fs from 'node:fs';
import { resolve } from 'node:path';
import { promisify } from 'node:util';
import { Plugin } from 'vite';


const readdir = promisify(fs.readdir)
const stat = promisify(fs.stat)
const getFile = async () => {
  const src = resolve(__dirname, 'src')
  console.log('[ src ]-11', src)
  let fileList: string[] = []
  const dirs = await readdir(src)
  console.log('[ dirs ]-14', dirs)
  const fileDir = dirs.map(async (f) => {
    const dir = resolve(__dirname, 'src', f)
    const isDir = await stat(dir)
    if (isDir.isDirectory()) {
      const file = await readdir(dir)
      await Promise.all(
        file.map(async (name) => {
          const filename = resolve(__dirname, dir, name)
          if ((await stat(filename)).isFile() && name === 'index.html') {
            fileList.push(filename);
          }
        })
      )
    }
  })
  await Promise.all(fileDir)
  return fileList
}

// 多入口html文件
export default async (): Promise<Plugin> => {
  const files = await getFile()

  const input: Record<string, string> = {}
  for (const inputpath of files) {
    const name = inputpath.split(/\\|\//).at(-2)
    if (name && name !== 'src') {
      input[name] = resolve(__dirname, inputpath)
    }
  }
  input.index = resolve(__dirname, 'src/index.html')
  return {
    name: 'getPageTemplate',
    config(config, { command }) {
      if (!config?.build) config.build = { rollupOptions: {} }
      if (!config.build.rollupOptions) config.build.rollupOptions = {}
      if (!config.build) config.build = { rollupOptions: {} }
      if (command === 'serve') {
        if (!config.server) config.server = {}
        const prot = config.server.port ? config.server.port : config.server.port = 4000
        console.log(`\t\t \x1b[32m index:\x1b[32m` + `\x1b[34m http://localhost:${prot}/\x1b[34m`);
        for (const key in input) {
          key !== 'index' && console.log(`\t\t \x1b[32m ${key}:\x1b[32m` + `\x1b[34m http://localhost:${prot}/${key}/\x1b[34m`);
        }
      }
      //@ts-ignore
      config.build.rollupOptions.input = input
      //@ts-ignore
      config.build.rollupOptions.output = {
        assetFileNames: '[ext]/[name]-[hash].[ext]', //静态文件输出的文件夹名称
        chunkFileNames: 'js/[name]-[hash].js',  //chunk包输出的文件夹名称
        entryFileNames: 'js/[name]-[hash].js',  //入口文件输出的文件夹名称
      }
    },
  }
}