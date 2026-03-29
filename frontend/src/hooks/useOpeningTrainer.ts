import { useState, useRef, useCallback } from 'react'
import { Chess } from 'chess.js'
import {
  Opening,
  AttemptRecord,
  ExplorerResult,
  MoveQuality,
} from '@chess-trainer/shared'
import { useLichessExplorer } from './useLichessExplorer'

export type TrainerStatus =
  | 'idle'
  | 'user_turn'
  | 'opponent_thinking'
  | 'move_feedback'
  | 'complete'

interface TrainerFeedback {
  quality: MoveQuality
  bestMove: string
  bestShare: number
}

interface UseOpeningTrainerState {
  opening: Opening | null
  status: TrainerStatus
  movesPlayed: AttemptRecord[]
  feedback: TrainerFeedback | null
  explorerResult: ExplorerResult | null
  fen: string
}

interface UseOpeningTrainerReturn extends UseOpeningTrainerState {
  startSession: (opening: Opening) => Promise<void>
  handleUserMove: (from: string, to: string, promotion?: string) => Promise<void>
  handleOpponentMove: () => Promise<void>
  continueAfterFeedback: () => void
}

function classifyMove(
  moveSan: string,
  explorerResult: ExplorerResult | null
): { quality: MoveQuality; bestMove: string; bestShare: number } {
  if (!explorerResult) {
    return { quality: 'acceptable', bestMove: moveSan, bestShare: 1 }
  }

  const { bestMove, allMoves } = explorerResult
  const bestShare = bestMove.share

  if (moveSan === bestMove.san) {
    return { quality: 'best', bestMove: bestMove.san, bestShare }
  }

  const playedMove = allMoves.find((m) => m.san === moveSan)
  if (playedMove && playedMove.share >= 0.05) {
    return { quality: 'acceptable', bestMove: bestMove.san, bestShare }
  }

  return { quality: 'mistake', bestMove: bestMove.san, bestShare }
}

export function useOpeningTrainer(): UseOpeningTrainerReturn {
  const chessRef = useRef<Chess>(new Chess())
  const [state, setState] = useState<UseOpeningTrainerState>({
    opening: null,
    status: 'idle',
    movesPlayed: [],
    feedback: null,
    explorerResult: null,
    fen: new Chess().fen(),
  })

  const explorer = useLichessExplorer()

  const startSession = useCallback(
    async (opening: Opening) => {
      const chess = new Chess(opening.startingFen)
      chessRef.current = chess

      const initialFen = chess.fen()
      const explorerResult = await explorer.fetch(initialFen)

      setState({
        opening,
        status: 'user_turn',
        movesPlayed: [],
        feedback: null,
        explorerResult,
        fen: initialFen,
      })
    },
    [explorer]
  )

  const handleUserMove = useCallback(
    async (from: string, to: string, promotion?: string) => {
      setState((prev) => {
        if (prev.status !== 'user_turn' || !prev.opening) return prev
        return prev
      })

      const chess = chessRef.current
      const fenBeforeMove = chess.fen()
      const currentExplorerResult = state.explorerResult

      let moveResult
      try {
        moveResult = chess.move({ from, to, promotion: promotion ?? 'q' })
      } catch {
        return
      }

      if (!moveResult) return

      const moveSan = moveResult.san
      const classification = classifyMove(moveSan, currentExplorerResult)

      const attempt: AttemptRecord = {
        fenBeforeMove,
        movePlayed: moveSan,
        bestMove: classification.bestMove,
        quality: classification.quality,
      }

      const newFen = chess.fen()

      setState((prev) => {
        if (!prev.opening) return prev
        const newMovesPlayed = [...prev.movesPlayed, attempt]
        const isComplete = newMovesPlayed.length >= prev.opening.moveCount

        return {
          ...prev,
          fen: newFen,
          movesPlayed: newMovesPlayed,
          feedback: {
            quality: classification.quality,
            bestMove: classification.bestMove,
            bestShare: classification.bestShare,
          },
          status: isComplete ? 'complete' : 'move_feedback',
          explorerResult: null,
        }
      })

      if (state.movesPlayed.length + 1 < (state.opening?.moveCount ?? 0)) {
        const newExplorerResult = await explorer.fetch(newFen)
        setState((prev) => ({
          ...prev,
          explorerResult: newExplorerResult,
        }))
      }
    },
    [state.explorerResult, state.movesPlayed, state.opening, explorer]
  )

  const handleOpponentMove = useCallback(async () => {
    setState((prev) => ({ ...prev, status: 'opponent_thinking' }))

    await new Promise((resolve) => setTimeout(resolve, 500))

    const chess = chessRef.current
    const currentExplorerResult = state.explorerResult

    if (!currentExplorerResult) {
      setState((prev) => ({ ...prev, status: 'user_turn' }))
      return
    }

    const opponentSan = currentExplorerResult.bestMove.san

    try {
      chess.move(opponentSan)
    } catch {
      setState((prev) => ({ ...prev, status: 'user_turn' }))
      return
    }

    const newFen = chess.fen()
    const newExplorerResult = await explorer.fetch(newFen)

    setState((prev) => {
      if (!prev.opening) return prev
      const isComplete = prev.movesPlayed.length >= prev.opening.moveCount

      return {
        ...prev,
        fen: newFen,
        explorerResult: newExplorerResult,
        status: isComplete ? 'complete' : 'user_turn',
        feedback: null,
      }
    })
  }, [state.explorerResult, explorer])

  const continueAfterFeedback = useCallback(() => {
    setState((prev) => {
      if (prev.status !== 'move_feedback') return prev
      return { ...prev, status: 'opponent_thinking', feedback: null }
    })
  }, [])

  return {
    ...state,
    startSession,
    handleUserMove,
    handleOpponentMove,
    continueAfterFeedback,
  }
}
