import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { Provider } from 'react-redux';
import PurchaseModal from '@/components/ConfirmPurchaseModal/ConfirmPurchaseModal';
import purchaseReducer, { confirmPurchase } from '@/redux/slices/purchaseSlice';
import userReducer from '@/redux/slices/userSlice'
import { configureStore } from '@reduxjs/toolkit';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

const queryClient = new QueryClient();

const createTestStore = () =>
    configureStore({
        reducer: {
            purchase: purchaseReducer as any,
            user: userReducer as any
        },
        preloadedState: {
            purchase: {
                isOpen: true,
                itemToBuy: {
                    id: '3',
                    type: 'champion',
                    name: 'Aatrox',
                    img: 'https://d2l6vvcxr1n0o0.cloudfront.net/splash/Aatrox_1.jpg',
                    value: { rp: 1200, be: 1000 }
                },
                currency: 'BE',
                status: 'idle',
                price: '1000'
            },
            user: {
                wallet: { RP: 30000, BE: 30000 },
                profile: { id: 1, nickname: 'mocked user' },
                RP: 300000,
                BE: 300000
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

        expect(screen.getByText('AATROX')).toBeInTheDocument();
        expect(screen.getByText('1200')).toBeInTheDocument();
    });
    test('modal is not rendered after closing it by dispatching the close modal action', () => {
        const store = createTestStore()
        store.dispatch({ type: 'purchase/closeModal' })
        render(
            <Provider store={store}>
                <QueryClientProvider client={queryClient}>
                    <PurchaseModal />
                </QueryClientProvider>
            </Provider>
        );

        expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
    })
    test('should open the modal when the open modal action is dispatched', () => {
        const store = createTestStore()
        const payload = {
            id: '4',
            type: 'champion',
            name: 'Ahri',
            img: 'https://d2l6vvcxr1n0o0.cloudfront.net/splash/Ahri_1.jpg',
            value: { rp: 1200, be: 1000 }
        }

        store.dispatch({ type: 'purchase/openPurchaseModal', payload })
        render(
            <Provider store={store}>
                <QueryClientProvider client={queryClient}>
                    <PurchaseModal />
                </QueryClientProvider>
            </Provider>
        );

        expect(screen.getByText('AHRI')).toBeInTheDocument();
        expect(screen.getByText('1200')).toBeInTheDocument();
    })
    test('after clicking que rp button the purchase status becomes loading', async () => {
        const store = createTestStore()
        render(
            <Provider store={store}>
                <QueryClientProvider client={queryClient}>
                    <PurchaseModal />
                </QueryClientProvider>
            </Provider>
        );
        expect(screen.getByText('1000')).toBeInTheDocument()
        const button = screen.getByText('1000')
        fireEvent.click(button)
        //store.dispatch(confirmPurchase({ coin: 'RP', price: 1000 }))
        //expect(store.getState().purchase.status).toBe('processing');
        //expect(screen.getByTestId('loading-spinner')).toBeInTheDocument()
        await waitFor(() => {
            expect(screen.getByTestId('purchase-loading-spinner')).toBeInTheDocument()
        })



    })

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