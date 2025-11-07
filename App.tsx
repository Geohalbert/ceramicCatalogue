import { Provider } from 'react-redux';
import { store } from './app/store/store';
import { NavigationContainer } from '@react-navigation/native';
import StackNavigator from './app/navigation/StackNavigator';
import './app/config/i18n'; // Initialize i18next

export default function App() {
  return (
    <Provider store={store}>
      <NavigationContainer>
        <StackNavigator />
      </NavigationContainer>  
    </Provider>
  );
}