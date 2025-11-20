import { StyleSheet } from 'react-native';

const SettingsButtonStyles = StyleSheet.create({
  button: {
    backgroundColor: '#fff',
    borderColor: '#ddd',
    borderRadius: 20,
    borderWidth: 1,
    elevation: 2,
    padding: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  icon: {
    fontSize: 24,
  },
});

export default SettingsButtonStyles;

