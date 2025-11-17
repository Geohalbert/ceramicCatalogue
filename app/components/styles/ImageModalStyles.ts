import { StyleSheet } from 'react-native';

interface ModalColors {
  background: string;
  text: string;
  inputBackground: string;
  border: string;
  primary: string;
  danger: string;
  placeholder: string;
}

const createImageModalStyles = (colors: ModalColors) =>
  StyleSheet.create({
    modalContent: {
      flex: 1,
      backgroundColor: colors.background,
    },
    imageContainer: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
      backgroundColor: '#000',
    },
    fullImage: {
      width: '100%',
      height: '70%',
      resizeMode: 'contain',
    },
    controlsContainer: {
      position: 'absolute',
      bottom: 0,
      left: 0,
      right: 0,
      backgroundColor: colors.background,
      borderTopLeftRadius: 20,
      borderTopRightRadius: 20,
      padding: 20,
      paddingBottom: 40,
      shadowColor: '#000',
      shadowOffset: { width: 0, height: -2 },
      shadowOpacity: 0.25,
      shadowRadius: 3.84,
      elevation: 5,
    },
    titleSection: {
      marginBottom: 20,
    },
    titleLabel: {
      fontSize: 16,
      fontWeight: '600',
      color: colors.text,
      marginBottom: 8,
    },
    titleInput: {
      backgroundColor: colors.inputBackground,
      borderColor: colors.border,
      borderWidth: 1,
      borderRadius: 8,
      padding: 12,
      color: colors.text,
      fontSize: 16,
    },
    titleDisplay: {
      fontSize: 16,
      color: colors.text,
      padding: 12,
      minHeight: 44,
    },
    buttonRow: {
      flexDirection: 'row',
      gap: 12,
    },
    button: {
      flex: 1,
      paddingVertical: 14,
      borderRadius: 8,
      alignItems: 'center',
      justifyContent: 'center',
    },
    editButton: {
      backgroundColor: colors.primary,
    },
    removeButton: {
      backgroundColor: colors.danger,
    },
    buttonText: {
      color: '#fff',
      fontSize: 16,
      fontWeight: '600',
    },
    closeButton: {
      position: 'absolute',
      top: 50,
      right: 20,
      backgroundColor: 'rgba(0, 0, 0, 0.6)',
      borderRadius: 20,
      width: 40,
      height: 40,
      justifyContent: 'center',
      alignItems: 'center',
      zIndex: 10,
    },
    closeButtonText: {
      color: '#fff',
      fontSize: 24,
      fontWeight: 'bold',
    },
  });

export default createImageModalStyles;


