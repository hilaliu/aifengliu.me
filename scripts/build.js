import { spawn } from 'node:child_process'
import { dirname, resolve } from 'node:path'
import process from 'node:process'
import { fileURLToPath } from 'node:url'

const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)
const repoRoot = resolve(__dirname, '..')

function run(command, args, options = {}) {
  return new Promise((resolvePromise, rejectPromise) => {
    const child = spawn(command, args, {
      stdio: 'inherit',
      shell: process.platform === 'win32',
      ...options,
    })
    child.on('close', (code) => {
      if (code === 0) {
        resolvePromise()
      }
      else {
        const error = new Error(`Command failed: ${command} ${args.join(' ')} (exit code ${code})`)
        // @ts-ignore augment
        error.exitCode = code
        rejectPromise(error)
      }
    })
    child.on('error', (err) => {
      rejectPromise(err)
    })
  })
}

async function main() {
  const constantPath = resolve(repoRoot, 'packages/constant')
  const webPath = resolve(repoRoot, 'apps/web')

  console.log('==> 构建 @repo/constant...')
  await run('pnpm', ['-C', constantPath, 'build'])

  console.log('==> 构建 @repo/web...')
  await run('pnpm', ['-C', webPath, 'build'])

  console.log('==> 构建 RSS...')
  await run('node', ['scripts/rss.js'])

  console.log('✅ 全部构建完成')
}

main().catch((err) => {
  console.error('❌ 构建失败：', err?.message || err)
  // @ts-ignore read exitCode if any
  process.exit(typeof err?.exitCode === 'number' ? err.exitCode : 1)
})
