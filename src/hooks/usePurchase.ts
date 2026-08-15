import { useDispatch, useSelector, shallowEqual } from "react-redux";
import { closeModal, confirmPurchase, openPurchaseModal, selectPurchaseData } from "@/redux/slices/purchaseSlice";

export function usePurchase() {
  const dispatch = useDispatch();
  const purchase = useSelector(selectPurchaseData);
  const wallet = useSelector(
    (state) => ({
      RP: state.user.RP,
      BE: state.user.BE,
    }),
    shallowEqual,
  );

  return {
    ...purchase,
    wallet,
    openPurchaseModal: (payload) => dispatch(openPurchaseModal(payload)),
    closeModal: () => dispatch(closeModal()),
    confirmPurchase: (payload) => dispatch(confirmPurchase(payload)),
  };
}
