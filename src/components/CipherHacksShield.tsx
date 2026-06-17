// @ts-ignore
import { CipherHacksProvider } from 'cipherhacks-shield/react'
import type { ReactNode } from 'react'

export function CipherHacksShield({ children }: { children: ReactNode }) {
  return (
    <CipherHacksProvider
      protectSelectors={['[data-sensitive]', 'input[type="password"]', 'input[name*="card"]', 'input[name*="cvv"]']}
      honeypotFields={true}
      behaviorTracking={true}
    >
      {children}
    </CipherHacksProvider>
  )
}
