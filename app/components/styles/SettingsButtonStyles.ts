import { StyleSheet } from 'react-native';

const SettingsButtonStyles = StyleSheet.create({
  button: {
    position: 'absolute',
    top: 50,
    right: 10,
    backgroundColor: '#fff',
    borderRadius: 20,
    padding: 8,
    borderWidth: 1,
    borderColor: '#ddd',
    elevation: 2,
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

