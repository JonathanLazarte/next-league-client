/*import { render, screen, fireEvent } from '@testing-library/react';
import { Provider } from 'react-redux';
import { configureStore } from '@reduxjs/toolkit'; // Importar configureStore
import DesktopHeader from '../DesktopHeader';
import { useRouter } from '@/hooks/useRouter.js';
import { useSound } from '@/hooks/useSound.js';



import userReducer from '@/redux/slices/userSlice.ts';
import userInterfaceReducer from '@/redux/slices/userInterfaceSlice.ts';

// Mock de los hooks useRouter y useSound
jest.mock('@/hooks/useRouter.js', () => ({
  useRouter: jest.fn(),
}));

jest.mock('@/hooks/useSound.js', () => ({
  useSound: jest.fn(),
}));
// Creamos un mock de la función que devuelve las props (getTriggerProps)
const mockGetTriggerProps = jest.fn().mockImplementation(({ content }) => ({
  onMouseEnter: jest.fn(),
  onMouseLeave: jest.fn(),
  ref: { current: null },
  'data-content-mock': content, // Opcional: para debuggear
}));

// Mockeamos el hook por defecto
jest.mock('@/components/Tooltip/globalTooltip/TooltipTrigger', () => ({
  __esModule: true,
  default: () => mockGetTriggerProps,
}));

describe('DesktopHeader', () => {
  let store;
  let mockPush;
  let mockPlay;

  const createTestStore = (initialState) => {
    return configureStore({
      reducer: {
        user: userReducer, // Usar tu reducer real
        userInterface: userInterfaceReducer, // Usar tu reducer real
        // ...otros reducers que DesktopHeader pueda necesitar
      },
      preloadedState: initialState,
    });
  };

  beforeEach(() => {
    mockPush = jest.fn();
    mockPlay = jest.fn();
    useRouter.mockReturnValue({ push: mockPush });
    useSound.mockReturnValue({ play: mockPlay });

    // Configura el estado inicial para el test
    const initialState = {
      user: {
        RP: 5000,
        BE: 15000,
      },
      userInterface: {
        actualSection: 'collection',
      },
    };
    store = createTestStore(initialState);
  });

  it('renders correctly with initial state', () => {
    render(
      <Provider store={store}>
        <DesktopHeader showSideNav={false} />
      </Provider>
    );

    expect(screen.getByTestId('tab-league')).toBeInTheDocument();
    expect(screen.getByTestId('tab-collection')).toBeInTheDocument();
    expect(screen.getByTestId('tab-store')).toBeInTheDocument();
    expect(screen.getByText('5000')).toBeInTheDocument(); // RP
    expect(screen.getByText('15 K')).toBeInTheDocument(); // BE, formateado
  });

  it('navigates to the correct section when a tab is clicked and dispatches updates', () => {
    render(
      <Provider store={store}>
        <DesktopHeader showSideNav={false} />
      </Provider>
    );

    const storeTab = screen.getByTestId(`tab-store`);
    fireEvent.mouseUp(storeTab); // Usamos mouseUp porque el componente usa onMouseUp

    expect(mockPlay).toHaveBeenCalledTimes(1);
    expect(mockPush).toHaveBeenCalledWith('store');

    // Aquí puedes verificar el estado de Redux si el componente despacha acciones
    // Por ejemplo, si al hacer clic en una pestaña se despacha una acción para cambiar actualSection:
    // const actions = store.getActions(); // Esto no funciona con configureStore directamente
    // Para verificar acciones despachadas, podrías espiar el dispatch o usar un middleware de logging en el store de test.
    // Sin embargo, para este componente, la verificación principal es la navegación y la clase CSS.
  });

  it('applies "actual-section" class to the current active tab', () => {
    render(
      <Provider store={store}>
        <DesktopHeader showSideNav={false} />
      </Provider>
    );

    const collectionTab = screen.getByTestId(`tab-collection`);
    expect(collectionTab).toHaveClass('actual-section');
  });

  it('applies "selected" class when a tab is clicked and updates the store state', () => {
    render(
      <Provider store={store}>
        <DesktopHeader showSideNav={false} />
      </Provider>
    );

    const leagueTab = screen.getByTestId(`tab-league`);
    fireEvent.mouseUp(leagueTab);

    // Verificar que la clase 'selected' se aplica
    expect(leagueTab).toHaveClass('selected');
    const pointerImage = leagueTab.querySelector('.header-pointer');
    expect(pointerImage).toHaveStyle('display: block');

    // Si el componente despacha una acción para actualizar `sectionTabSelected`
    // en `userInterfaceSlice`, el estado real de la tienda se actualizaría.
    // Podríamos verificar el estado actual de la tienda después del dispatch si el componente interactuara directamente con el store
    // para cambiar `actualSection` o `sectionTabSelected` en el store.
    // En este caso, `sectionTabSelected` es un estado local, por lo que la verificación de la clase es suficiente.
  });
  it('shows RP and BE values correctly, including K formatting', () => {
    // Para probar diferentes estados, recreamos la tienda con un nuevo initialState
    const storeWithDifferentValues = createTestStore({
      user: {
        RP: 12000,
        BE: 9000,
      },
      userInterface: {
        actualSection: 'collection',
      },
    });

    render(
      <Provider store={storeWithDifferentValues}>
        <DesktopHeader showSideNav={false} />
      </Provider>
    );

    expect(screen.getByText('12 K')).toBeInTheDocument();
    expect(screen.getByText('9000')).toBeInTheDocument();
  });

  // src/components/header/tests/DesktopHeader.test.jsx




  it('configures the tooltip triggers with the correct content for each tab', () => {
    render(
      <Provider store={store}>
        <DesktopHeader showSideNav={false} />
      </Provider>
    );

    // Verificamos que el Header llamó a la función para configurar las pestañas
    // DesktopHeader llama a trigger({ section: 'league' }) y otros

    // Para la pestaña de colección
    expect(mockGetTriggerProps).toHaveBeenCalledWith(
      expect.objectContaining({ content: 'collection' })
    );

    // Para la pestaña de tienda
    expect(mockGetTriggerProps).toHaveBeenCalledWith(
      expect.objectContaining({ content: 'store' })
    );

    // Para la pestaña de league
    expect(mockGetTriggerProps).not.toHaveBeenCalledWith(
      expect.objectContaining({ content: 'league' })
    ); +
  });



});
*/
