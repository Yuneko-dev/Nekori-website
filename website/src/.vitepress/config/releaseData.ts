import type { GetResponseDataTypeFromEndpointMethod } from '@octokit/types'
import { mkdir, readFile, rename, writeFile } from 'node:fs/promises'
import { dirname, resolve } from 'node:path'
import process from 'node:process'
import { fileURLToPath } from 'node:url'
import { Octokit } from '@octokit/rest'

const cacheFile = resolve(dirname(fileURLToPath(import.meta.url)), '../../../.cache/nekori-releases.json')
const octokit = new Octokit({ auth: process.env.GITHUB_TOKEN })

export type Release = GetResponseDataTypeFromEndpointMethod<typeof octokit.repos.getLatestRelease>

export interface ReleaseData {
  stable: Release[]
  stableLatest: Release
  nightlyLatest: Release
}

interface CachedReleaseData extends ReleaseData {
  version: 2
  fetchedAt: string
}

let releaseDataPromise: Promise<ReleaseData> | undefined

export async function getReleaseData(): Promise<ReleaseData> {
  releaseDataPromise ||= loadReleaseData()
  return releaseDataPromise
}

export async function refreshReleaseData(): Promise<ReleaseData> {
  releaseDataPromise = fetchReleaseData()
  const data = await releaseDataPromise
  await writeCache(data)
  return data
}

export async function getStableReleases(): Promise<Release[]> {
  return (await getReleaseData()).stable
}

export async function getStableRelease(tag: string): Promise<Release | undefined> {
  return (await getReleaseData()).stable.find(release => release.tag_name === tag)
}

async function loadReleaseData(): Promise<ReleaseData> {
  const cached = await readCache()
  if (cached)
    return cached

  try {
    return await refreshReleaseData()
  }
  catch (error) {
    throw new Error(
      'Unable to fetch GitHub release data. Set GITHUB_TOKEN and run "pnpm refresh:releases" to create the local cache.',
      { cause: error },
    )
  }
}

async function fetchReleaseData(): Promise<ReleaseData> {
  const [releases, stableLatest, nightlyLatest] = await Promise.all([
    octokit.paginate(octokit.repos.listReleases, {
      owner: 'Yuneko-dev',
      repo: 'Nekori',
      per_page: 100,
    }),
    octokit.repos.getLatestRelease({ owner: 'Yuneko-dev', repo: 'Nekori' }),
    octokit.repos.getLatestRelease({ owner: 'Yuneko-dev', repo: 'Nekori-nightly' }),
  ])

  return {
    stable: releases.filter(release => !release.draft && !release.prerelease),
    stableLatest: stableLatest.data,
    nightlyLatest: nightlyLatest.data,
  }
}

async function readCache(): Promise<ReleaseData | undefined> {
  try {
    const cached = JSON.parse(await readFile(cacheFile, 'utf8')) as Partial<CachedReleaseData>
    if (cached.version === 2 && Array.isArray(cached.stable) && cached.stableLatest && cached.nightlyLatest) {
      return {
        stable: cached.stable,
        stableLatest: cached.stableLatest,
        nightlyLatest: cached.nightlyLatest,
      }
    }
  }
  catch {
    // A missing or outdated cache is refreshed below.
  }
}

async function writeCache(data: ReleaseData): Promise<void> {
  await mkdir(dirname(cacheFile), { recursive: true })
  const temporaryFile = `${cacheFile}.tmp`
  const cached: CachedReleaseData = {
    version: 2,
    fetchedAt: new Date().toISOString(),
    ...data,
  }
  await writeFile(temporaryFile, `${JSON.stringify(cached, null, 2)}\n`)
  await rename(temporaryFile, cacheFile)
}

async function main(): Promise<void> {
  const data = await refreshReleaseData()
  console.warn(`Cached ${data.stable.length} stable releases in ${cacheFile}`)
}

if (process.argv[1] && resolve(process.argv[1]) === fileURLToPath(import.meta.url)) {
  void main().catch((error) => {
    console.error(error)
    process.exitCode = 1
  })
}
