import { Alert } from 'react-native';
import { TFunction } from 'i18next';

interface UseImageModalHandlersArgs {
  t: TFunction;
  imageIndex: number;
  titleText: string;
  originalTitle: string;
  editingTitle: boolean;
  onEditTitle: (index: number, title: string) => void;
  onRemove: (index: number) => void;
  onClose: () => void;
  setTitleText: (text: string) => void;
  setOriginalTitle: (title: string) => void;
  setEditingTitle: (editing: boolean) => void;
}

export function useImageModalHandlers({
  t,
  imageIndex,
  titleText,
  originalTitle,
  editingTitle,
  onEditTitle,
  onRemove,
  onClose,
  setTitleText,
  setOriginalTitle,
  setEditingTitle,
}: UseImageModalHandlersArgs) {
  // Check if there are unsaved changes
  const hasUnsavedChanges = () => {
    return titleText.trim() !== originalTitle.trim();
  };

  const handleSaveTitle = () => {
    onEditTitle(imageIndex, titleText);
    setOriginalTitle(titleText);
    setEditingTitle(false);
  };

  // Handle close with unsaved changes check
  const handleClose = () => {
    if (hasUnsavedChanges()) {
      Alert.alert(
        t('addEditItem.alerts.unsavedChangesTitle') || 'Unsaved Changes',
        t('addEditItem.alerts.unsavedChangesMessage') || 'You have unsaved changes. Do you want to save them before leaving?',
        [
          {
            text: t('common.cancel') || 'Cancel',
            style: 'cancel',
          },
          {
            text: t('addEditItem.alerts.discard') || 'Discard Changes',
            style: 'destructive',
            onPress: () => {
              setTitleText(originalTitle);
              setEditingTitle(false);
              onClose();
            },
          },
          {
            text: t('addEditItem.alerts.save') || 'Save',
            onPress: () => {
              handleSaveTitle();
              onClose();
            },
          },
        ]
      );
    } else {
      onClose();
    }
  };

  // Handle cancel editing with unsaved changes check
  const handleCancelEdit = () => {
    if (hasUnsavedChanges()) {
      Alert.alert(
        t('addEditItem.alerts.unsavedChangesTitle') || 'Unsaved Changes',
        t('addEditItem.alerts.unsavedChangesMessage') || 'You have unsaved changes. Do you want to save them before leaving?',
        [
          {
            text: t('common.cancel') || 'Cancel',
            style: 'cancel',
          },
          {
            text: t('addEditItem.alerts.discard') || 'Discard Changes',
            style: 'destructive',
            onPress: () => {
              setTitleText(originalTitle);
              setEditingTitle(false);
            },
          },
          {
            text: t('addEditItem.alerts.save') || 'Save',
            onPress: () => {
              handleSaveTitle();
            },
          },
        ]
      );
    } else {
      setEditingTitle(false);
    }
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

  return {
    handleSaveTitle,
    handleClose,
    handleCancelEdit,
    handleRemove,
    hasUnsavedChanges,
  };
}

