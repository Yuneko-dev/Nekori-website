import type { Release } from '../../config/releaseData'
import { defineLoader } from 'vitepress'
import { getReleaseData } from '../../config/releaseData'

export interface AppRelease {
  stable: Release
  nightly: Release
}

declare const data: AppRelease
export { data }

export default defineLoader({
  async load(): Promise<AppRelease> {
    const { stableLatest: stable, nightlyLatest: nightly } = await getReleaseData()
    return { stable, nightly }
  },
})
