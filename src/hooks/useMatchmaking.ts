import { useAppDispatch, useAppSelector } from '@/hooks/hooks'
import { setQueueState, setSelectedQueue } from "@/redux/slices/matchmakingSlice";
import type { MatchmakingState, queueState, PartyMember } from "@/redux/slices/matchmakingSlice";

export function useMatchmaking() {
  const dispatch = useAppDispatch();
  const matchmaking = useAppSelector((state) => state.matchmaking);

  return {
    ...matchmaking,
    matchmaking,
    setSelectedQueue: (payload: string) => dispatch(setSelectedQueue(payload)),
    setQueueState: (payload: queueState) => dispatch(setQueueState(payload)),
  };
}
