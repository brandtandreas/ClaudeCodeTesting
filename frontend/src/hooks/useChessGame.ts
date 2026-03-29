import { useRef, useState, useCallback } from 'react'
import { Chess } from 'chess.js'

interface UseMakeMoveOptions {
  from: string
  to: string
  promotion?: string
}

interface UseChessGameReturn {
  fen: string
  history: string[]
  makeMove: (options: UseMakeMoveOptions) => boolean
  undoMove: () => void
  reset: (fen?: string) => void
}

export function useChessGame(initialFen?: string): UseChessGameReturn {
  const chessRef = useRef<Chess>(
    initialFen ? new Chess(initialFen) : new Chess()
  )
  const [fen, setFen] = useState<string>(chessRef.current.fen())

  const makeMove = useCallback(
    ({ from, to, promotion }: UseMakeMoveOptions): boolean => {
      try {
        const result = chessRef.current.move({
          from,
          to,
          promotion: promotion ?? 'q',
        })
        if (result) {
          setFen(chessRef.current.fen())
          return true
        }
        return false
      } catch {
        return false
      }
    },
    []
  )

  const undoMove = useCallback(() => {
    chessRef.current.undo()
    setFen(chessRef.current.fen())
  }, [])

  const reset = useCallback((startFen?: string) => {
    if (startFen) {
      chessRef.current = new Chess(startFen)
    } else {
      chessRef.current = new Chess()
    }
    setFen(chessRef.current.fen())
  }, [])

  const history = chessRef.current.history()

  return { fen, history, makeMove, undoMove, reset }
}
