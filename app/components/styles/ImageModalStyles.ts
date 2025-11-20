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
    button: {
      alignItems: 'center',
      borderRadius: 8,
      flex: 1,
      justifyContent: 'center',
      paddingVertical: 14,
    },
    buttonRow: {
      flexDirection: 'row',
      gap: 12,
    },
    buttonText: {
      color: '#fff',
      fontSize: 16,
      fontWeight: '600',
    },
    closeButton: {
      alignItems: 'center',
      backgroundColor: 'rgba(0, 0, 0, 0.6)',
      borderRadius: 20,
      height: 40,
      justifyContent: 'center',
      position: 'absolute',
      right: 20,
      top: 50,
      width: 40,
      zIndex: 10,
    },
    closeButtonText: {
      color: '#fff',
      fontSize: 24,
      fontWeight: 'bold',
    },
    controlsContainer: {
      backgroundColor: colors.background,
      borderTopLeftRadius: 20,
      borderTopRightRadius: 20,
      bottom: 0,
      elevation: 5,
      left: 0,
      padding: 20,
      paddingBottom: 40,
      position: 'absolute',
      right: 0,
      shadowColor: '#000',
      shadowOffset: { width: 0, height: -2 },
      shadowOpacity: 0.25,
      shadowRadius: 3.84,
    },
    editButton: {
      backgroundColor: colors.primary,
    },
    fullImage: {
      height: '70%',
      resizeMode: 'contain',
      width: '100%',
    },
    imageContainer: {
      alignItems: 'center',
      backgroundColor: '#000',
      flex: 1,
      justifyContent: 'center',
    },
    modalContent: {
      backgroundColor: colors.background,
      flex: 1,
    },
    removeButton: {
      backgroundColor: colors.danger,
    },
    titleDisplay: {
      color: colors.text,
      fontSize: 16,
      minHeight: 44,
      padding: 12,
    },
    titleInput: {
      backgroundColor: colors.inputBackground,
      borderColor: colors.border,
      borderRadius: 8,
      borderWidth: 1,
      color: colors.text,
      fontSize: 16,
      padding: 12,
    },
    titleLabel: {
      color: colors.text,
      fontSize: 16,
      fontWeight: '600',
      marginBottom: 8,
    },
    titleSection: {
      marginBottom: 20,
    },
  });

export default createImageModalStyles;


