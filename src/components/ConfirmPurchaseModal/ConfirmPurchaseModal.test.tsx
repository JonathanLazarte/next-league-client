import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { Provider } from 'react-redux';
import PurchaseModal from '@/components/ConfirmPurchaseModal/ConfirmPurchaseModal';
import purchaseReducer, { confirmPurchase } from '@/redux/slices/purchaseSlice';
import userReducer from '@/redux/slices/userSlice'
import { configureStore } from '@reduxjs/toolkit';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

const createTestQueryClient = () =>
    new QueryClient({
        defaultOptions: {
            queries: {
                retry: false,
            },
        },
    });


const createTestStore = ({ status = 'idle' } = {}) =>
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
                status: status,
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
    beforeEach(() => {
        jest.clearAllMocks();
    });
    test('should render', () => {
        const store = createTestStore()
        const queryClient = createTestQueryClient();

        render(
            <Provider store={store}>
                <QueryClientProvider client={queryClient}>
                    <PurchaseModal />
                </QueryClientProvider>
            </Provider>
        );

        expect(screen.getByText('AATROX')).toBeInTheDocument();
        expect(screen.getByText('1200')).toBeInTheDocument();
        expect(screen.getByText('1000')).toBeInTheDocument();
    });
    test('should open the modal when the open modal action is dispatched', () => {
        const store = createTestStore()
        const queryClient = createTestQueryClient();
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
    test('modal is not rendered after closing it by dispatching the close modal action', async () => {
        const store = createTestStore({ status: 'success' })
        const queryClient = createTestQueryClient();
        render(
            <Provider store={store}>
                <QueryClientProvider client={queryClient}>
                    <PurchaseModal />
                </QueryClientProvider>
            </Provider>
        );
        const doneButton = screen.getByTestId('done-purchase-button')
        const user = userEvent.setup()
        await user.click(doneButton)
        await waitFor(() => {
            expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
        })
    })
    test('after clicking que rp button the purchase is succesfull and the success message is displayed', async () => {

        const mockFetch = jest.fn();

        global.fetch = mockFetch;

        mockFetch.mockResolvedValue({
            ok: true,
            json: async () => ({
                id: "3",
                type: "champion",
                name: "Aatrox",
                img: "https://d2l6vvcxr1n0o0.cloudfront.net/splash/Aatrox_1.jpg",
                value: { rp: 1200, be: 1000 }
            })
        })

        const store = createTestStore()
        const queryClient = createTestQueryClient();
        render(
            <Provider store={store}>
                <QueryClientProvider client={queryClient}>
                    <PurchaseModal />
                </QueryClientProvider>
            </Provider>
        );
        expect(screen.getByText('1000')).toBeInTheDocument()
        const beButton = screen.getByTestId('buy-be-button')

        const user = userEvent.setup();
        await user.click(beButton);
        //store.dispatch(confirmPurchase({ coin: 'RP', price: 1000 }))
        //expect(store.getState().purchase.status).toBe('processing');
        //expect(screen.getByTestId('loading-spinner')).toBeInTheDocument()

        await waitFor(() => {
            expect(mockFetch).toHaveBeenCalledWith(
                expect.stringContaining(`${process.env.NEXT_PUBLIC_API_URL}api/v1/store/`),
                expect.objectContaining({
                    method: 'POST',
                })
            )
        })
        await waitFor(() => {
            //expect(screen.getByTestId('purchase-loading-spinner')).toBeInTheDocument()
            //expect(store.getState().purchase.status).toBe('processing');
            expect(screen.getByTestId('purchase-success-message')).toBeInTheDocument()
        })

    })
    test('after clicking que rp button the purchase is succesfull and the success message is displayed', async () => {

        const mockFetch = jest.fn();

        global.fetch = mockFetch;

        mockFetch.mockResolvedValue({
            ok: false,
            json: async () => ({
                message: 'Insufficient funds'
            })
        })

        const store = createTestStore()
        const queryClient = createTestQueryClient();
        render(
            <Provider store={store}>
                <QueryClientProvider client={queryClient}>
                    <PurchaseModal />
                </QueryClientProvider>
            </Provider>
        );
        expect(screen.getByText('1000')).toBeInTheDocument()
        const beButton = screen.getByTestId('buy-be-button')

        const user = userEvent.setup();
        await user.click(beButton);
        await waitFor(() => {
            expect(mockFetch).toHaveBeenCalledWith(
                expect.stringContaining(`${process.env.NEXT_PUBLIC_API_URL}api/v1/store/`),
                expect.objectContaining({
                    method: 'POST',
                })
            )
        })
        await waitFor(() => {
            expect(screen.getByTestId('purchase-error-message')).toBeInTheDocument()
        })

    })
    test('after clicking the selected coin to buy, the component shows a loading spinner while the thunk is pending', async () => {

        jest.useFakeTimers();
        const mockFetch = jest.fn();

        let fetchResolver: ((value: Response) => void) | null = null;
        let fetchReject: ((reason?: any) => void) | null = null;

        const fetchPromise = new Promise<Response>((resolve, reject) => {
            fetchResolver = resolve;
            fetchReject = reject;
        });
        mockFetch.mockReturnValue(fetchPromise);
        global.fetch = mockFetch;


        const store = createTestStore()
        const queryClient = createTestQueryClient();
        render(
            <Provider store={store}>
                <QueryClientProvider client={queryClient}>
                    <PurchaseModal />
                </QueryClientProvider>
            </Provider>
        );
        const beButton = screen.getByTestId('buy-be-button')
        expect(beButton).toBeInTheDocument()

        const user = userEvent.setup({ advanceTimers: jest.advanceTimersByTime });
        await user.click(beButton);
        await waitFor(() => {
            expect(screen.getByTestId('purchase-loading-spinner')).toBeInTheDocument()
        })
        fetchResolver!({
            ok: true,
            json: async () => ({
                id: '3',
                type: 'champion',
                name: 'Aatrox',
                img: '...',
                value: { rp: 1200, be: 1000 },
            }),
        } as Response);

        jest.advanceTimersByTime(300);
        await waitFor(() => {
            expect(screen.queryByTestId('purchase-success-message')).toBeInTheDocument()
        })
    })
});