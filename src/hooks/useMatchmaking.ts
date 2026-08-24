import { useAppDispatch, useAppSelector } from '@/hooks/hooks'
import { setQueueState, setSelectedQueue } from "@/redux/slices/matchmakingSlice";

export function useMatchmaking() {
  const dispatch = useAppDispatch();
  const matchmaking = useAppSelector((state) => state.matchmaking);

  return {
    ...matchmaking,
    matchmaking,
    setSelectedQueue: (payload) => dispatch(setSelectedQueue(payload)),
    setQueueState: (payload) => dispatch(setQueueState(payload)),
  };
}
