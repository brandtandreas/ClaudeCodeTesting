import { create } from 'zustand'
import { Opening, AttemptRecord, ExplorerResult, MoveQuality } from '@chess-trainer/shared'

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

interface TrainingState {
  opening: Opening | null
  status: TrainerStatus
  movesPlayed: AttemptRecord[]
  feedback: TrainerFeedback | null
  explorerResult: ExplorerResult | null
  currentFen: string
  setOpening: (opening: Opening | null) => void
  setStatus: (status: TrainerStatus) => void
  addMove: (attempt: AttemptRecord) => void
  setFeedback: (feedback: TrainerFeedback | null) => void
  setExplorerResult: (result: ExplorerResult | null) => void
  setCurrentFen: (fen: string) => void
  resetSession: () => void
}

export const useTrainingStore = create<TrainingState>((set) => ({
  opening: null,
  status: 'idle',
  movesPlayed: [],
  feedback: null,
  explorerResult: null,
  currentFen: 'rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1',

  setOpening: (opening) => set({ opening }),
  setStatus: (status) => set({ status }),
  addMove: (attempt) =>
    set((state) => ({ movesPlayed: [...state.movesPlayed, attempt] })),
  setFeedback: (feedback) => set({ feedback }),
  setExplorerResult: (explorerResult) => set({ explorerResult }),
  setCurrentFen: (currentFen) => set({ currentFen }),
  resetSession: () =>
    set({
      status: 'idle',
      movesPlayed: [],
      feedback: null,
      explorerResult: null,
    }),
}))
