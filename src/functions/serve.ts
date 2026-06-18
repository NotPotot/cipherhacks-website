import { serve } from '@hono/node-server'
import app from './index'

serve({ fetch: app.fetch, port: 8787 }, (info) => {
  console.log(`Mirage Shield backend running on http://localhost:${info.port}`)
})
