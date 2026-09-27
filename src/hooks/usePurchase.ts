import { shallowEqual } from "react-redux";
import { closeModal, confirmPurchase, openPurchaseModal, selectPurchaseData } from "@/redux/slices/purchaseSlice";
import type { ItemType, Coin } from "@/redux/slices/purchaseSlice";
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

  interface OpenPurchaseModalPayload {
    id: string
    type: ItemType
    name: string
    img: string
    subtitle?: string
    value: {
      be?: number | string;
      rp?: number | string;
    }
  }

  return {
    ...purchase,
    wallet,
    openPurchaseModal: (payload: OpenPurchaseModalPayload) => dispatch(openPurchaseModal(payload)),
    closeModal: () => dispatch(closeModal()),
    confirmPurchase: (payload: { coin: Coin, price: number }) => dispatch(confirmPurchase(payload)),
  };
}
