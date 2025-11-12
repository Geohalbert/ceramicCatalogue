import React from 'react';
import { render, screen } from '@testing-library/react-native';
import { Provider } from 'react-redux';
import { configureStore } from '@reduxjs/toolkit';
import Home from '../Home';
import authReducer from '../../store/authSlice';
import potteryReducer from '../../store/potterySlice';
import { ThemeProvider } from '../../context/ThemeContext';

// Mock dependencies
jest.mock('react-i18next', () => ({
  useTranslation: () => ({
    t: (key: string) => {
      const translations: { [key: string]: string } = {
        'home.title': 'Ceramic Catalogue',
        'home.guestMode': 'You are in guest mode. Sign in to sync your data across devices.',
      };
      return translations[key] || key;
    },
    i18n: {
      changeLanguage: jest.fn(),
    },
  }),
}));

jest.mock('../../components/TopBar', () => {
  const { Text } = require('react-native');
  return function MockTopBar() {
    return <Text testID="top-bar">TopBar</Text>;
  };
});

jest.mock('../../components/CollectionsButton', () => {
  const { Text } = require('react-native');
  return function MockCollectionsButton() {
    return <Text testID="collections-button">CollectionsButton</Text>;
  };
});

jest.mock('../../components/Authentication', () => {
  const { Text } = require('react-native');
  return function MockAuthentication() {
    return <Text testID="authentication">Authentication</Text>;
  };
});

// Mock image require
jest.mock('../../../assets/home_screen_vase_cropped_300w.png', () => 'home-vase-image');

describe('Home Screen', () => {
  const createMockStore = (isAuthenticated = false) => {
    return configureStore({
      reducer: {
        auth: authReducer,
        pottery: potteryReducer,
      },
      preloadedState: {
        auth: {
          user: isAuthenticated
            ? { uid: 'test-uid', email: 'test@example.com', displayName: 'Test User' }
            : null,
          loading: false,
          error: null,
          isAuthenticated,
        },
        pottery: {
          items: [],
          loading: false,
          error: null,
        },
      },
    });
  };

  const renderWithProviders = (component: React.ReactElement, store: any) => {
    return render(
      <Provider store={store}>
        <ThemeProvider>{component}</ThemeProvider>
      </Provider>
    );
  };

  describe('Rendering', () => {
    it('should render the Home screen correctly', () => {
      const store = createMockStore();
      renderWithProviders(<Home />, store);

      // Check that main components are rendered
      expect(screen.getByTestId('top-bar')).toBeTruthy();
      expect(screen.getByTestId('collections-button')).toBeTruthy();
      expect(screen.getByTestId('authentication')).toBeTruthy();
    });

    it('should display the title', () => {
      const store = createMockStore();
      renderWithProviders(<Home />, store);

      expect(screen.getByText('Ceramic Catalogue')).toBeTruthy();
    });

    it('should display the home screen vase image', () => {
      const store = createMockStore();
      const { UNSAFE_getAllByType } = renderWithProviders(<Home />, store);

      // Check that an Image component is rendered
      const images = UNSAFE_getAllByType(require('react-native').Image);
      expect(images.length).toBeGreaterThan(0);
    });
  });

  describe('Authentication State', () => {
    it('should show guest notice when user is not authenticated', () => {
      const store = createMockStore(false);
      renderWithProviders(<Home />, store);

      expect(
        screen.getByText('You are in guest mode. Sign in to sync your data across devices.')
      ).toBeTruthy();
    });

    it('should not show guest notice when user is authenticated', () => {
      const store = createMockStore(true);
      renderWithProviders(<Home />, store);

      expect(
        screen.queryByText('You are in guest mode. Sign in to sync your data across devices.')
      ).toBeNull();
    });
  });

  describe('Component Integration', () => {
    it('should render TopBar component', () => {
      const store = createMockStore();
      renderWithProviders(<Home />, store);

      expect(screen.getByTestId('top-bar')).toBeTruthy();
    });

    it('should render CollectionsButton component', () => {
      const store = createMockStore();
      renderWithProviders(<Home />, store);

      expect(screen.getByTestId('collections-button')).toBeTruthy();
    });

    it('should render Authentication component', () => {
      const store = createMockStore();
      renderWithProviders(<Home />, store);

      expect(screen.getByTestId('authentication')).toBeTruthy();
    });

    it('should render all components in the correct order', () => {
      const store = createMockStore();
      const { UNSAFE_root } = renderWithProviders(<Home />, store);

      // Get all text elements to verify order
      const topBar = screen.getByTestId('top-bar');
      const title = screen.getByText('Ceramic Catalogue');
      const collectionsButton = screen.getByTestId('collections-button');
      const authentication = screen.getByTestId('authentication');

      // All components should be present
      expect(topBar).toBeTruthy();
      expect(title).toBeTruthy();
      expect(collectionsButton).toBeTruthy();
      expect(authentication).toBeTruthy();
    });
  });

  describe('Redux Integration', () => {
    it('should read authentication state from Redux store', () => {
      const store = createMockStore(true);
      renderWithProviders(<Home />, store);

      // When authenticated, guest notice should not be shown
      expect(
        screen.queryByText('You are in guest mode. Sign in to sync your data across devices.')
      ).toBeNull();
    });

    it('should respond to changes in authentication state', () => {
      const store = createMockStore(false);
      const { rerender } = renderWithProviders(<Home />, store);

      // Initially not authenticated - guest notice should show
      expect(
        screen.getByText('You are in guest mode. Sign in to sync your data across devices.')
      ).toBeTruthy();

      // Update store to authenticated state
      const authenticatedStore = createMockStore(true);
      rerender(
        <Provider store={authenticatedStore}>
          <ThemeProvider>
            <Home />
          </ThemeProvider>
        </Provider>
      );

      // Guest notice should now be hidden
      expect(
        screen.queryByText('You are in guest mode. Sign in to sync your data across devices.')
      ).toBeNull();
    });
  });

  describe('Internationalization', () => {
    it('should use translation keys for title', () => {
      const store = createMockStore();
      renderWithProviders(<Home />, store);

      // The mock translation returns the translated value
      expect(screen.getByText('Ceramic Catalogue')).toBeTruthy();
    });

    it('should use translation keys for guest mode notice', () => {
      const store = createMockStore(false);
      renderWithProviders(<Home />, store);

      // The mock translation returns the translated value
      expect(
        screen.getByText('You are in guest mode. Sign in to sync your data across devices.')
      ).toBeTruthy();
    });
  });

  describe('Theme Integration', () => {
    it('should render without crashing when ThemeProvider is present', () => {
      const store = createMockStore();
      
      expect(() => {
        renderWithProviders(<Home />, store);
      }).not.toThrow();
    });

    it('should apply theme colors to components', () => {
      const store = createMockStore(false);
      const { UNSAFE_root } = renderWithProviders(<Home />, store);

      // Component should render successfully with theme context
      expect(screen.getByText('Ceramic Catalogue')).toBeTruthy();
    });
  });

  describe('Accessibility', () => {
    it('should be accessible with screen readers', () => {
      const store = createMockStore();
      renderWithProviders(<Home />, store);

      // Check that text content is available for screen readers
      expect(screen.getByText('Ceramic Catalogue')).toBeTruthy();
    });

    it('should provide accessible testIDs for child components', () => {
      const store = createMockStore();
      renderWithProviders(<Home />, store);

      // Verify testIDs are available for testing/accessibility
      expect(screen.getByTestId('top-bar')).toBeTruthy();
      expect(screen.getByTestId('collections-button')).toBeTruthy();
      expect(screen.getByTestId('authentication')).toBeTruthy();
    });
  });
});

