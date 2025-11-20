import { StyleSheet } from 'react-native';

const TopBarStyles = StyleSheet.create({
  container: {
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'space-between',
    left: 0,
    paddingHorizontal: 10,
    position: 'absolute',
    right: 0,
    top: 40,
    zIndex: 10,
  },
});

export default TopBarStyles;

