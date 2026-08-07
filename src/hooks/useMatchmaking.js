import { useDispatch, useSelector } from "react-redux";
import { setQueueState, setSelectedQueue } from "@/redux/slices/matchmakingSlice";

export function useMatchmaking() {
  const dispatch = useDispatch();
  const matchmaking = useSelector((state) => state.matchmaking);

  return {
    ...matchmaking,
    matchmaking,
    setSelectedQueue: (payload) => dispatch(setSelectedQueue(payload)),
    setQueueState: (payload) => dispatch(setQueueState(payload)),
  };
}
