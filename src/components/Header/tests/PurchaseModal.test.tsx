import { render, screen, fireEvent } from '@testing-library/react';
import { Provider } from 'react-redux';
import PurchaseModal from '@/components/ConfirmPurchaseModal/ConfirmPurchaseModal';
import purchaseReducer from '@/redux/slices/purchaseSlice';
import userReducer from '@/redux/slices/userSlice'
import { configureStore } from '@reduxjs/toolkit';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

const queryClient = new QueryClient();

const createTestStore = () =>
    configureStore({
        reducer: {
            purchase: purchaseReducer,
            user: userReducer
        },
        preloadedState: {
            purchase: {
                isOpen: true,
                itemToBuy: {
                    id: '3',
                    type: 'champion'
                },
                currency: 'RP',
                status: 'idle',
                price: '1200'
            },
            user: {
                wallet: { RP: 1000, BE: 1000 },
                profile: { id: 1, nickname: 'mocked user' }
            }
        },
    });



describe('PurchaseModal', () => {
    test('should render', () => {
        const store = createTestStore()

        render(
            <Provider store={store}>
                <QueryClientProvider client={queryClient}>
                    <PurchaseModal />
                </QueryClientProvider>
            </Provider>
        );

        expect(screen.getByText('1200')).toBeInTheDocument();
    });

    /*test('should close when close button is clicked', () => {
        const store = createTestStore();

        render(
            <Provider store={store}>
                <QueryClientProvider client={queryClient}>
                    <PurchaseModal />
                </QueryClientProvider>
            </Provider>
        );

        fireEvent.click(screen.getByText('RP'));
        fireEvent.click(screen.getByTestId('close-modal'));
        expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
    });*/
});