export interface Opening {
  id: string
  ecoCode: string
  name: string
  color: 'white' | 'black'
  startingFen: string
  pgnMoves: string
  moveCount: number
}

export interface OpeningMove {
  san: string
  games: number
  share: number
}

export interface ExplorerResult {
  bestMove: OpeningMove
  commonMoves: OpeningMove[]
  allMoves: OpeningMove[]
}
