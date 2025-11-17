import { useState, useEffect } from 'react';
import {
  Modal,
  View,
  Image,
  Text,
  TextInput,
  TouchableOpacity,
  Dimensions,
  Alert,
} from 'react-native';
import { useTranslation } from 'react-i18next';
import { useTheme } from '../context/ThemeContext';
import { PotteryImage } from '../store/types';
import createImageModalStyles from './styles/ImageModalStyles';

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

  const styles = createImageModalStyles({
    background: colors.background,
    text: colors.text,
    inputBackground: colors.inputBackground,
    border: colors.border,
    primary: colors.primary,
    danger: colors.danger,
    placeholder: colors.placeholder,
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
