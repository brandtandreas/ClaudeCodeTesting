import { useMemo } from 'react'
import { Chessboard } from 'react-chessboard'
import { Chess } from 'chess.js'
import { ExplorerResult } from '@chess-trainer/shared'

type Square = string
type Arrow = [Square, Square, string?]

interface TrainingBoardProps {
  fen: string
  onMove: (from: string, to: string, promotion?: string) => void
  explorerResult: ExplorerResult | null
  orientation: 'white' | 'black'
  disabled: boolean
  showArrows: boolean
}

function sanToSquares(
  fen: string,
  san: string
): { from: Square; to: Square } | null {
  try {
    const chess = new Chess(fen)
    const move = chess.move(san)
    if (!move) return null
    return { from: move.from as Square, to: move.to as Square }
  } catch {
    return null
  }
}

export default function TrainingBoard({
  fen,
  onMove,
  explorerResult,
  orientation,
  disabled,
  showArrows,
}: TrainingBoardProps) {
  const customArrows = useMemo<Arrow[]>(() => {
    if (!showArrows || !explorerResult) return []

    const arrows: Arrow[] = []

    explorerResult.commonMoves.forEach((move, index) => {
      const squares = sanToSquares(fen, move.san)
      if (!squares) return
      const isBest = index === 0 && move.san === explorerResult.bestMove.san
      arrows.push([squares.from, squares.to, isBest ? 'rgb(0,200,0)' : 'rgb(200,200,0)'])
    })

    return arrows
  }, [showArrows, explorerResult, fen])

  function onPieceDrop(sourceSquare: string, targetSquare: string): boolean {
    if (disabled) return false
    onMove(sourceSquare, targetSquare)
    return true
  }

  return (
    <div style={{ width: '100%', maxWidth: '560px' }}>
      <Chessboard
        position={fen}
        onPieceDrop={onPieceDrop}
        boardOrientation={orientation}
        customArrows={customArrows}
        arePiecesDraggable={!disabled}
        animationDuration={200}
      />
    </div>
  )
}
