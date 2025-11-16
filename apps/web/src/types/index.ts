import type { App as VueApp } from 'vue'

export type UserModule = (ctx: { app: VueApp }) => void
