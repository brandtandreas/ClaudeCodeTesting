import { ExplorerResult, OpeningMove, COMMON_MOVE_THRESHOLD } from '@chess-trainer/shared'

interface CacheEntry {
  result: ExplorerResult | null
  cachedAt: number
}

interface LichessMove {
  uci: string
  san: string
  white: number
  draws: number
  black: number
  averageRating: number
}

interface LichessExplorerResponse {
  moves: LichessMove[]
}

const cache = new Map<string, CacheEntry>()
const CACHE_TTL_MS = 24 * 60 * 60 * 1000 // 24 hours

export async function fetchExplorerData(fen: string): Promise<ExplorerResult | null> {
  const now = Date.now()
  const cached = cache.get(fen)

  if (cached && now - cached.cachedAt < CACHE_TTL_MS) {
    return cached.result
  }

  try {
    const url = `https://explorer.lichess.ovh/masters?fen=${encodeURIComponent(fen)}`
    const response = await fetch(url, {
      headers: { 'User-Agent': 'chess-trainer/1.0' },
      signal: AbortSignal.timeout(8000),
    })

    if (!response.ok) {
      cache.set(fen, { result: null, cachedAt: now })
      return null
    }

    const data = (await response.json()) as LichessExplorerResponse

    if (!data.moves || data.moves.length === 0) {
      cache.set(fen, { result: null, cachedAt: now })
      return null
    }

    const totalGames = data.moves.reduce(
      (sum, m) => sum + m.white + m.draws + m.black,
      0
    )

    if (totalGames === 0) {
      cache.set(fen, { result: null, cachedAt: now })
      return null
    }

    const allMoves: OpeningMove[] = data.moves.map((m) => {
      const games = m.white + m.draws + m.black
      return {
        san: m.san,
        games,
        share: games / totalGames,
      }
    })

    allMoves.sort((a, b) => b.games - a.games)

    const bestMove = allMoves[0]
    const commonMoves = allMoves.filter((m) => m.share >= COMMON_MOVE_THRESHOLD)

    const result: ExplorerResult = { bestMove, commonMoves, allMoves }
    cache.set(fen, { result, cachedAt: now })
    return result
  } catch {
    cache.set(fen, { result: null, cachedAt: now })
    return null
  }
}
