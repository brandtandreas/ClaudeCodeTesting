import { Opening } from '../types/opening'

export const COMMON_MOVE_THRESHOLD = 0.1

const STARTING_FEN = 'rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1'

function countPlies(pgn: string): number {
  // Split on whitespace, filter out move numbers (e.g. "1.", "2.") and empty strings
  const tokens = pgn.trim().split(/\s+/)
  return tokens.filter((t) => !t.match(/^\d+\./) && t.length > 0).length
}

export const OPENINGS: Opening[] = [
  {
    id: 'ruy-lopez',
    ecoCode: 'C65',
    name: 'Ruy Lopez',
    color: 'white',
    startingFen: STARTING_FEN,
    pgnMoves: '1. e4 e5 2. Nf3 Nc6 3. Bb5',
    moveCount: countPlies('1. e4 e5 2. Nf3 Nc6 3. Bb5'),
  },
  {
    id: 'ruy-lopez-berlin',
    ecoCode: 'C67',
    name: 'Ruy Lopez: Berlin Defense',
    color: 'white',
    startingFen: STARTING_FEN,
    pgnMoves: '1. e4 e5 2. Nf3 Nc6 3. Bb5 Nf6 4. O-O Nxe4 5. d4',
    moveCount: countPlies('1. e4 e5 2. Nf3 Nc6 3. Bb5 Nf6 4. O-O Nxe4 5. d4'),
  },
  {
    id: 'sicilian-defense',
    ecoCode: 'B20',
    name: 'Sicilian Defense',
    color: 'black',
    startingFen: STARTING_FEN,
    pgnMoves: '1. e4 c5',
    moveCount: countPlies('1. e4 c5'),
  },
  {
    id: 'sicilian-najdorf',
    ecoCode: 'B90',
    name: 'Sicilian Defense: Najdorf Variation',
    color: 'black',
    startingFen: STARTING_FEN,
    pgnMoves: '1. e4 c5 2. Nf3 d6 3. d4 cxd4 4. Nxd4 Nf6 5. Nc3 a6',
    moveCount: countPlies('1. e4 c5 2. Nf3 d6 3. d4 cxd4 4. Nxd4 Nf6 5. Nc3 a6'),
  },
  {
    id: 'queens-gambit',
    ecoCode: 'D06',
    name: "Queen's Gambit",
    color: 'white',
    startingFen: STARTING_FEN,
    pgnMoves: '1. d4 d5 2. c4',
    moveCount: countPlies('1. d4 d5 2. c4'),
  },
  {
    id: 'queens-gambit-accepted',
    ecoCode: 'D20',
    name: "Queen's Gambit Accepted",
    color: 'white',
    startingFen: STARTING_FEN,
    pgnMoves: '1. d4 d5 2. c4 dxc4 3. Nf3 Nf6 4. e3',
    moveCount: countPlies('1. d4 d5 2. c4 dxc4 3. Nf3 Nf6 4. e3'),
  },
  {
    id: 'french-defense',
    ecoCode: 'C00',
    name: 'French Defense',
    color: 'black',
    startingFen: STARTING_FEN,
    pgnMoves: '1. e4 e6 2. d4 d5',
    moveCount: countPlies('1. e4 e6 2. d4 d5'),
  },
  {
    id: 'french-winawer',
    ecoCode: 'C15',
    name: 'French Defense: Winawer Variation',
    color: 'black',
    startingFen: STARTING_FEN,
    pgnMoves: '1. e4 e6 2. d4 d5 3. Nc3 Bb4',
    moveCount: countPlies('1. e4 e6 2. d4 d5 3. Nc3 Bb4'),
  },
  {
    id: 'italian-game',
    ecoCode: 'C50',
    name: 'Italian Game',
    color: 'white',
    startingFen: STARTING_FEN,
    pgnMoves: '1. e4 e5 2. Nf3 Nc6 3. Bc4',
    moveCount: countPlies('1. e4 e5 2. Nf3 Nc6 3. Bc4'),
  },
  {
    id: 'italian-giuoco-piano',
    ecoCode: 'C54',
    name: 'Italian Game: Giuoco Piano',
    color: 'white',
    startingFen: STARTING_FEN,
    pgnMoves: '1. e4 e5 2. Nf3 Nc6 3. Bc4 Bc5 4. c3 Nf6 5. d4',
    moveCount: countPlies('1. e4 e5 2. Nf3 Nc6 3. Bc4 Bc5 4. c3 Nf6 5. d4'),
  },
  {
    id: 'kings-indian-defense',
    ecoCode: 'E60',
    name: "King's Indian Defense",
    color: 'black',
    startingFen: STARTING_FEN,
    pgnMoves: '1. d4 Nf6 2. c4 g6 3. Nc3 Bg7 4. e4 d6 5. Nf3 O-O',
    moveCount: countPlies('1. d4 Nf6 2. c4 g6 3. Nc3 Bg7 4. e4 d6 5. Nf3 O-O'),
  },
  {
    id: 'caro-kann',
    ecoCode: 'B10',
    name: 'Caro-Kann Defense',
    color: 'black',
    startingFen: STARTING_FEN,
    pgnMoves: '1. e4 c6 2. d4 d5',
    moveCount: countPlies('1. e4 c6 2. d4 d5'),
  },
  {
    id: 'caro-kann-classical',
    ecoCode: 'B18',
    name: 'Caro-Kann Defense: Classical Variation',
    color: 'black',
    startingFen: STARTING_FEN,
    pgnMoves: '1. e4 c6 2. d4 d5 3. Nc3 dxe4 4. Nxe4 Bf5',
    moveCount: countPlies('1. e4 c6 2. d4 d5 3. Nc3 dxe4 4. Nxe4 Bf5'),
  },
  {
    id: 'english-opening',
    ecoCode: 'A10',
    name: 'English Opening',
    color: 'white',
    startingFen: STARTING_FEN,
    pgnMoves: '1. c4 e5 2. Nc3 Nf6 3. Nf3',
    moveCount: countPlies('1. c4 e5 2. Nc3 Nf6 3. Nf3'),
  },
  {
    id: 'london-system',
    ecoCode: 'D02',
    name: 'London System',
    color: 'white',
    startingFen: STARTING_FEN,
    pgnMoves: '1. d4 d5 2. Nf3 Nf6 3. Bf4 e6 4. e3 Bd6 5. Bd3',
    moveCount: countPlies('1. d4 d5 2. Nf3 Nf6 3. Bf4 e6 4. e3 Bd6 5. Bd3'),
  },
]
