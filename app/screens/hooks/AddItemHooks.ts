import { Alert } from "react-native";
import { TFunction } from "i18next";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import * as ImagePicker from "expo-image-picker";

import { Pottery, PotteryImage, PotStatus, ClayType, DesignType, GlazeType } from "../../store/types";
import { addPotteryThunk, updatePotteryThunk, deletePotteryThunk } from "../../store/potterySlice";
import { schedulePotteryNotification, cancelPotteryNotification } from "../../services/notificationService";

type Navigation = NativeStackNavigationProp<any>;

interface UseAddItemHandlersArgs {
  t: TFunction;
  navigation: Navigation;
  dispatch: any;
  editingPottery?: Pottery;

  potName: string;
  clayType: ClayType;
  dateCreated: string;
  designType: DesignType;
  potStatus: PotStatus;
  glazeType: GlazeType;
  timerDays: number | null;
  timerMinutes?: number | null; // Optional minutes for short timers
  timerTime?: string; // Optional time in HH:MM format
  existingNotificationId?: string;
  setExistingNotificationId: (id: string | undefined) => void;
  images: PotteryImage[];
  setImages: (images: PotteryImage[]) => void;
  notes: string;

  setModalVisible: (visible: boolean) => void;
  setSelectedImageIndex: (index: number) => void;
}

export function useAddItemHandlers({
  t,
  navigation,
  dispatch,
  editingPottery,
  potName,
  clayType,
  dateCreated,
  designType,
  potStatus,
  glazeType,
  timerDays,
  timerMinutes,
  timerTime,
  existingNotificationId,
  setExistingNotificationId,
  images,
  setImages,
  notes,
  setModalVisible,
  setSelectedImageIndex,
}: UseAddItemHandlersArgs) {
  // Image picker helpers
  const pickImageFromLibrary = async () => {
    if (images.length >= 3) {
      Alert.alert(t("common.error"), t("addEditItem.fields.image.maxReached"));
      return;
    }

    try {
      const permissionResult = await ImagePicker.requestMediaLibraryPermissionsAsync();

      if (!permissionResult.granted) {
        Alert.alert(t("common.error"), t("addEditItem.fields.image.permissionDenied"));
        return;
      }

      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ["images"] as any,
        allowsEditing: true,
        aspect: [4, 3],
        quality: 0.8,
      });

      if (!result.canceled && result.assets[0]) {
        setImages([...images, { uri: result.assets[0].uri }]);
      }
    } catch (error) {
      console.error("Error picking image from library:", error);
      Alert.alert(t("common.error"), "Failed to pick image");
    }
  };

  const pickImageFromCamera = async () => {
    if (images.length >= 3) {
      Alert.alert(t("common.error"), t("addEditItem.fields.image.maxReached"));
      return;
    }

    try {
      const permissionResult = await ImagePicker.requestCameraPermissionsAsync();

      if (!permissionResult.granted) {
        Alert.alert(t("common.error"), t("addEditItem.fields.image.permissionDenied"));
        return;
      }

      const result = await ImagePicker.launchCameraAsync({
        allowsEditing: true,
        aspect: [4, 3],
        quality: 0.8,
      });

      if (!result.canceled && result.assets[0]) {
        setImages([...images, { uri: result.assets[0].uri }]);
      }
    } catch (error) {
      console.error("Error taking photo:", error);
      Alert.alert(t("common.error"), "Failed to take photo");
    }
  };

  const handleAddPhoto = () => {
    if (images.length >= 3) {
      Alert.alert(t("common.error"), t("addEditItem.fields.image.maxReached"));
      return;
    }

    Alert.alert(t("addEditItem.fields.image.chooseSource"), "", [
      {
        text: t("addEditItem.fields.image.fromCamera"),
        onPress: pickImageFromCamera,
      },
      {
        text: t("addEditItem.fields.image.fromLibrary"),
        onPress: pickImageFromLibrary,
      },
      {
        text: t("common.cancel"),
        style: "cancel",
      },
    ]);
  };

  const handleRemovePhoto = (index: number) => {
    const newImages = images.filter((_, i) => i !== index);
    setImages(newImages);
  };

  const handleUpdateImageTitle = (index: number, title: string) => {
    const newImages = [...images];
    newImages[index] = { ...newImages[index], title: title || undefined };
    setImages(newImages);
  };

  const handleCarouselImagePress = (index: number) => {
    setSelectedImageIndex(index);
    setModalVisible(true);
  };

  const handleModalClose = () => {
    setModalVisible(false);
  };

  const handleModalEditTitle = (index: number, title: string) => {
    handleUpdateImageTitle(index, title);
  };

  const handleModalRemove = (index: number) => {
    handleRemovePhoto(index);
  };

  const handleSubmit = async () => {
    if (!potName.trim()) {
      Alert.alert(t("common.error"), t("addEditItem.alerts.enterName"));
      return;
    }

    try {
      let notificationId: string | undefined = existingNotificationId;
      const timerStartDate = new Date().toISOString();

      if (existingNotificationId && ((potStatus !== "Firing" && potStatus !== "Drying" && potStatus !== "In Progress") || (timerDays === null && timerMinutes === null))) {
        await cancelPotteryNotification(existingNotificationId);
        notificationId = undefined;
      }

      // Only schedule if we have a valid timer value (not null, and > 0 unless using custom time)
      const hasValidTimer = (timerMinutes !== null && timerMinutes !== undefined && timerMinutes > 0) || 
                           (timerDays !== null && timerDays !== undefined && timerDays > 0) ||
                           (timerDays === 0 && timerTime); // 0 days is valid with custom time
      
      if ((potStatus === "Firing" || potStatus === "Drying" || potStatus === "In Progress") && hasValidTimer) {
        if (existingNotificationId) {
          await cancelPotteryNotification(existingNotificationId);
        }

        // Determine duration and whether it's in minutes
        let duration: number;
        let isMinutes: boolean;
        
        if (timerMinutes !== null && timerMinutes !== undefined) {
          duration = timerMinutes;
          isMinutes = true;
          // Validate minutes
          if (duration <= 0) {
            console.warn('Cannot schedule notification with zero or negative minutes');
            return;
          }
        } else if (timerDays !== null && timerDays !== undefined) {
          duration = timerDays;
          isMinutes = false;
          // Validate days - 0 days is only valid with custom time
          if (duration === 0 && !timerTime) {
            console.warn('Cannot schedule notification for 0 days without a custom time');
            return;
          }
          if (duration < 0) {
            console.warn('Cannot schedule notification with negative days');
            return;
          }
        } else {
          // Should not reach here due to condition above, but handle gracefully
          console.warn('Attempted to schedule notification with no timer value');
          return;
        }

        console.log(`Scheduling notification: duration=${duration}, isMinutes=${isMinutes}, time=${timerTime || 'none'}`);

        const newNotificationId = await schedulePotteryNotification(
          potName.trim(), 
          potStatus, 
          duration, 
          timerTime,
          isMinutes
        );

        if (newNotificationId) {
          notificationId = newNotificationId;
          setExistingNotificationId(newNotificationId);
        }
      }

      if (editingPottery) {
        const updatedPottery: Pottery = {
          ...editingPottery,
          potName: potName.trim(),
          clayType,
          dateCreated,
          designType,
          potStatus,
          glazeType,
          images: images.length > 0 ? images : undefined,
          imageUri: images.length > 0 ? images[0].uri : undefined,
          notificationId,
          timerDays: timerDays || undefined,
          timerMinutes: timerMinutes || undefined,
          timerTime: timerTime || undefined,
          timerStartDate:
            (potStatus === "Firing" || potStatus === "Drying" || potStatus === "In Progress") && (timerDays || timerMinutes) ? timerStartDate : undefined,
          notes: notes.trim() || undefined,
        };

        await dispatch(updatePotteryThunk(updatedPottery)).unwrap();
        Alert.alert(t("common.success"), t("addEditItem.alerts.updateSuccess"));
      } else {
        const newPottery: Omit<Pottery, "id"> = {
          potName: potName.trim(),
          clayType,
          dateCreated,
          designType,
          potStatus,
          glazeType,
          images: images.length > 0 ? images : undefined,
          imageUri: images.length > 0 ? images[0].uri : undefined,
          notificationId,
          timerDays: timerDays || undefined,
          timerMinutes: timerMinutes || undefined,
          timerTime: timerTime || undefined,
          timerStartDate:
            (potStatus === "Firing" || potStatus === "Drying" || potStatus === "In Progress") && (timerDays || timerMinutes) ? timerStartDate : undefined,
          notes: notes.trim() || undefined,
        };

        await dispatch(addPotteryThunk(newPottery as any)).unwrap();
        Alert.alert(t("common.success"), t("addEditItem.alerts.addSuccess"));
      }

      navigation.pop();
    } catch (error) {
      console.error("Error saving pottery:", error);
      Alert.alert(t("common.error"), t("addEditItem.alerts.saveFailed"));
    }
  };

  const handleDelete = async () => {
    if (!editingPottery) return;

    Alert.alert(
      t("addEditItem.alerts.deleteConfirmTitle"),
      t("addEditItem.alerts.deleteConfirmMessage", { name: editingPottery.potName }),
      [
        {
          text: t("common.cancel"),
          style: "cancel",
        },
        {
          text: t("common.delete"),
          style: "destructive",
          onPress: async () => {
            try {
              if (editingPottery.notificationId) {
                await cancelPotteryNotification(editingPottery.notificationId);
              }

              await dispatch(deletePotteryThunk(editingPottery.id)).unwrap();
              Alert.alert(t("common.success"), t("addEditItem.alerts.deleteSuccess"));
              navigation.pop();
            } catch (error) {
              console.error("Error deleting pottery:", error);
              Alert.alert(t("common.error"), t("addEditItem.alerts.deleteFailed"));
            }
          },
        },
      ]
    );
  };

  return {
    handleAddPhoto,
    handleRemovePhoto,
    handleUpdateImageTitle,
    handleCarouselImagePress,
    handleModalClose,
    handleModalEditTitle,
    handleModalRemove,
    handleSubmit,
    handleDelete,
  };
}


