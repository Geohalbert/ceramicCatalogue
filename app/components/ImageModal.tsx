import { useState, useEffect } from 'react';
import {
  Modal,
  View,
  Image,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Dimensions,
  Alert,
} from 'react-native';
import { useTranslation } from 'react-i18next';
import { useTheme } from '../context/ThemeContext';
import { PotteryImage } from '../store/types';

interface ImageModalProps {
  visible: boolean;
  image: PotteryImage | null;
  imageIndex: number;
  onClose: () => void;
  onEditTitle: (index: number, title: string) => void;
  onRemove: (index: number) => void;
}

export default function ImageModal({
  visible,
  image,
  imageIndex,
  onClose,
  onEditTitle,
  onRemove,
}: ImageModalProps) {
  const { t } = useTranslation();
  const { colors } = useTheme();
  const [editingTitle, setEditingTitle] = useState(false);
  const [titleText, setTitleText] = useState(image?.title || '');
  const { width, height } = Dimensions.get('window');

  // Update title text when image changes
  useEffect(() => {
    if (image) {
      setTitleText(image.title || '');
      setEditingTitle(false);
    }
  }, [image]);

  if (!image) return null;

  const handleSaveTitle = () => {
    onEditTitle(imageIndex, titleText);
    setEditingTitle(false);
  };

  const handleRemove = () => {
    Alert.alert(
      t('imageModal.removeTitle') || 'Remove Photo',
      t('imageModal.removeMessage') || 'Are you sure you want to remove this photo?',
      [
        {
          text: t('common.cancel') || 'Cancel',
          style: 'cancel',
        },
        {
          text: t('common.remove') || 'Remove',
          style: 'destructive',
          onPress: () => {
            onRemove(imageIndex);
            onClose();
          },
        },
      ]
    );
  };

  const styles = StyleSheet.create({
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
      width: width,
      height: height * 0.7,
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

  return (
    <Modal
      visible={visible}
      transparent={false}
      animationType="slide"
      onRequestClose={onClose}
    >
      <View style={styles.modalContent}>
        {/* Close Button */}
        <TouchableOpacity style={styles.closeButton} onPress={onClose}>
          <Text style={styles.closeButtonText}>×</Text>
        </TouchableOpacity>

        {/* Full-size Image */}
        <View style={styles.imageContainer}>
          <Image source={{ uri: image.uri }} style={styles.fullImage} resizeMode="contain" />
        </View>

        {/* Controls */}
        <View style={styles.controlsContainer}>
          {/* Title Section */}
          <View style={styles.titleSection}>
            <Text style={styles.titleLabel}>
              {t('imageModal.title') || 'Photo Title'}
            </Text>
            {editingTitle ? (
              <View style={{ flexDirection: 'row', gap: 8 }}>
                <TextInput
                  style={[styles.titleInput, { flex: 1 }]}
                  value={titleText}
                  onChangeText={setTitleText}
                  placeholder={t('addEditItem.fields.image.titlePlaceholder') || 'Enter title'}
                  placeholderTextColor={colors.placeholder}
                  autoFocus
                />
                <TouchableOpacity
                  style={[styles.button, styles.editButton, { flex: 0, paddingHorizontal: 16 }]}
                  onPress={handleSaveTitle}
                >
                  <Text style={styles.buttonText}>{t('common.save') || 'Save'}</Text>
                </TouchableOpacity>
              </View>
            ) : (
              <TouchableOpacity
                onPress={() => setEditingTitle(true)}
                style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}
              >
                <Text style={styles.titleDisplay}>
                  {image.title || t('imageModal.noTitle') || 'No title'}
                </Text>
                <TouchableOpacity
                  onPress={() => setEditingTitle(true)}
                  style={{ padding: 8 }}
                >
                  <Text style={{ fontSize: 20 }}>✏️</Text>
                </TouchableOpacity>
              </TouchableOpacity>
            )}
          </View>

          {/* Action Buttons */}
          <View style={styles.buttonRow}>
            <TouchableOpacity
              style={[styles.button, styles.editButton]}
              onPress={() => setEditingTitle(!editingTitle)}
            >
              <Text style={styles.buttonText}>
                {editingTitle
                  ? t('common.cancel') || 'Cancel'
                  : t('imageModal.edit') || 'Edit Title'}
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.button, styles.removeButton]}
              onPress={handleRemove}
            >
              <Text style={styles.buttonText}>
                {t('imageModal.remove') || 'Remove Photo'}
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
}
