import { shallowEqual } from "react-redux";
import { closeModal, confirmPurchase, openPurchaseModal, selectPurchaseData } from "@/redux/slices/purchaseSlice";
import { useAppDispatch, useAppSelector } from '@/hooks/hooks'

export function usePurchase() {
  const dispatch = useAppDispatch();
  const purchase = useAppSelector(selectPurchaseData);
  const wallet = useAppSelector(
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
