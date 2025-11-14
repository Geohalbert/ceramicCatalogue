import { useState, useEffect, useRef } from "react";
import { Text, View, TextInput, Button, StyleSheet, ScrollView, Alert, TouchableOpacity, Image, KeyboardAvoidingView, Platform, Keyboard } from "react-native";
import { useTranslation } from "react-i18next";
import { useNavigation, useRoute, RouteProp } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { useTheme } from "../context/ThemeContext";
import * as ImagePicker from 'expo-image-picker';

import Dropdown from "../components/Dropdown";
import ImageCarousel from "../components/ImageCarousel";
import ImageModal from "../components/ImageModal";
import { useAppDispatch } from "../store/hooks";
import { addPotteryThunk, updatePotteryThunk, deletePotteryThunk } from "../store/potterySlice";
import { ClayType, DesignType, PotStatus, GlazeType, Pottery, PotteryImage } from "../store/types";
import { schedulePotteryNotification, cancelPotteryNotification, getRemainingTime } from "../services/notificationService";

import AddItemStyles from "./styles/AddItemStyles";

type AddItemRouteParams = {
  AddItem: {
    pottery?: Pottery;
  };
};

export default function AddItem() {
  const { t } = useTranslation();
  const { colors } = useTheme();
  const route = useRoute<RouteProp<AddItemRouteParams, 'AddItem'>>();
  const editingPottery = route.params?.pottery;

  const [potName, setPotName] = useState("");
  const [clayType, setClayType] = useState<ClayType>("Porcelain");
  const [dateCreated, setDateCreated] = useState(new Date().toISOString().split('T')[0]);
  const [designType, setDesignType] = useState<DesignType>("Pot");
  const [potStatus, setPotStatus] = useState<PotStatus>("In Progress");
  const [glazeType, setGlazeType] = useState<GlazeType>("No Glaze");
  const [timerDays, setTimerDays] = useState<number | null>(null);
  const [existingNotificationId, setExistingNotificationId] = useState<string | undefined>();
  const [images, setImages] = useState<PotteryImage[]>([]);
  const [notes, setNotes] = useState("");
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedImageIndex, setSelectedImageIndex] = useState<number>(0);

  const navigation = useNavigation<NativeStackNavigationProp<any>>();
  const dispatch = useAppDispatch();
  
  // Refs for scrolling to specific images
  const scrollViewRef = useRef<ScrollView>(null);
  const imageRefs = useRef<Array<View | null>>([]);
  const inputRefs = useRef<Array<TextInput | null>>([]);
  
  // Handle keyboard appearance to scroll to focused input
  useEffect(() => {
    const keyboardDidShowListener = Keyboard.addListener(
      Platform.OS === 'ios' ? 'keyboardWillShow' : 'keyboardDidShow',
      (e) => {
        // Small delay to ensure the input is focused
        setTimeout(() => {
          // Find the currently focused input
          const focusedInputIndex = inputRefs.current.findIndex(ref => ref?.isFocused());
          if (focusedInputIndex !== -1 && inputRefs.current[focusedInputIndex] && scrollViewRef.current) {
            inputRefs.current[focusedInputIndex]?.measureLayout(
              scrollViewRef.current as any,
              (x, y) => {
                const keyboardHeight = e.endCoordinates.height;
                const scrollOffset = y - 50; // 50px padding from top
                scrollViewRef.current?.scrollTo({ y: Math.max(0, scrollOffset), animated: true });
              },
              () => {}
            );
          }
        }, 100);
      }
    );

    return () => {
      keyboardDidShowListener.remove();
    };
  }, []);

  // Initialize form with existing pottery data if editing
  useEffect(() => {
    if (editingPottery) {
      setPotName(editingPottery.potName);
      setClayType(editingPottery.clayType);
      setDateCreated(editingPottery.dateCreated);
      setDesignType(editingPottery.designType);
      setPotStatus(editingPottery.potStatus);
      setGlazeType(editingPottery.glazeType);
      setTimerDays(editingPottery.timerDays || null);
      setExistingNotificationId(editingPottery.notificationId);
      
      // Migrate old imageUri to new images array format
      if (editingPottery.images && editingPottery.images.length > 0) {
        setImages(editingPottery.images);
      } else if (editingPottery.imageUri) {
        setImages([{ uri: editingPottery.imageUri }]);
      }
      
      setNotes(editingPottery.notes || "");
    }
  }, [editingPottery]);

  // Image picker functions
  const pickImageFromLibrary = async () => {
    if (images.length >= 3) {
      Alert.alert(t('common.error'), t('addEditItem.fields.image.maxReached'));
      return;
    }

    try {
      const permissionResult = await ImagePicker.requestMediaLibraryPermissionsAsync();
      
      if (!permissionResult.granted) {
        Alert.alert(t('common.error'), t('addEditItem.fields.image.permissionDenied'));
        return;
      }

      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ['images'],
        allowsEditing: true,
        aspect: [4, 3],
        quality: 0.8,
      });

      if (!result.canceled && result.assets[0]) {
        setImages([...images, { uri: result.assets[0].uri }]);
      }
    } catch (error) {
      console.error('Error picking image from library:', error);
      Alert.alert(t('common.error'), 'Failed to pick image');
    }
  };

  const pickImageFromCamera = async () => {
    if (images.length >= 3) {
      Alert.alert(t('common.error'), t('addEditItem.fields.image.maxReached'));
      return;
    }

    try {
      const permissionResult = await ImagePicker.requestCameraPermissionsAsync();
      
      if (!permissionResult.granted) {
        Alert.alert(t('common.error'), t('addEditItem.fields.image.permissionDenied'));
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
      console.error('Error taking photo:', error);
      Alert.alert(t('common.error'), 'Failed to take photo');
    }
  };

  const handleAddPhoto = () => {
    if (images.length >= 3) {
      Alert.alert(t('common.error'), t('addEditItem.fields.image.maxReached'));
      return;
    }

    Alert.alert(
      t('addEditItem.fields.image.chooseSource'),
      '',
      [
        {
          text: t('addEditItem.fields.image.fromCamera'),
          onPress: pickImageFromCamera,
        },
        {
          text: t('addEditItem.fields.image.fromLibrary'),
          onPress: pickImageFromLibrary,
        },
        {
          text: t('common.cancel'),
          style: 'cancel',
        },
      ]
    );
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
    // Open modal with the selected image
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

  const { container, form, label, input, multilineInput } = AddItemStyles;

  // Dropdown options
  const clayTypeOptions = [
    { label: t('dropdown.clayTypes.porcelain'), value: "Porcelain" },
    { label: t('dropdown.clayTypes.cincoRojo'), value: "Cinco Rojo" },
    { label: t('dropdown.clayTypes.cincoBlanco'), value: "Cinco Blanco" },
    { label: t('dropdown.clayTypes.buffaloWallow'), value: "Buffalo Wallow" },
    { label: t('dropdown.clayTypes.darkChocolate'), value: "Dark Chocolate" },
    { label: t('dropdown.clayTypes.custom'), value: "Custom" },
    { label: t('dropdown.clayTypes.other'), value: "Other" },
  ];

  const designTypeOptions = [
    { label: t('dropdown.designTypes.pot'), value: "Pot" },
    { label: t('dropdown.designTypes.vase'), value: "Vase" },
    { label: t('dropdown.designTypes.platter'), value: "Platter" },
    { label: t('dropdown.designTypes.mug'), value: "Mug" },
    { label: t('dropdown.designTypes.bowl'), value: "Bowl" },
    { label: t('dropdown.designTypes.other'), value: "Other" },
  ];

  const potStatusOptions = [
    { label: t('dropdown.statuses.inProgress'), value: "In Progress" },
    { label: t('dropdown.statuses.drying'), value: "Drying" },
    { label: t('dropdown.statuses.firing'), value: "Firing" },
    { label: t('dropdown.statuses.finished'), value: "Finished" },
  ];

  const glazeTypeOptions = [
    { label: t('dropdown.glazeTypes.noGlaze'), value: "No Glaze" },
    { label: t('dropdown.glazeTypes.matte'), value: "Matte" },
    { label: t('dropdown.glazeTypes.gloss'), value: "Gloss" },
  ];

  const handleSubmit = async () => {
    if (!potName.trim()) {
      Alert.alert(t('common.error'), t('addEditItem.alerts.enterName'));
      return;
    }

    try {
      // Handle notifications for Firing or Drying status
      let notificationId: string | undefined = existingNotificationId;
      const timerStartDate = new Date().toISOString();

      // Cancel existing notification if status changed or timer removed
      if (existingNotificationId && (potStatus !== 'Firing' && potStatus !== 'Drying' || !timerDays)) {
        await cancelPotteryNotification(existingNotificationId);
        notificationId = undefined;
      }

      // Schedule new notification if Firing or Drying with timer
      if ((potStatus === 'Firing' || potStatus === 'Drying') && timerDays) {
        // Cancel old notification if exists
        if (existingNotificationId) {
          await cancelPotteryNotification(existingNotificationId);
        }
        
        const newNotificationId = await schedulePotteryNotification(
          potName.trim(),
          potStatus,
          timerDays
        );
        
        if (newNotificationId) {
          notificationId = newNotificationId;
        }
      }

      if (editingPottery) {
        // Update existing pottery
        const updatedPottery: Pottery = {
          ...editingPottery,
          potName: potName.trim(),
          clayType,
          dateCreated,
          designType,
          potStatus,
          glazeType,
          images: images.length > 0 ? images : undefined,
          imageUri: images.length > 0 ? images[0].uri : undefined, // Keep for backward compatibility
          notificationId,
          timerDays: timerDays || undefined,
          timerStartDate: (potStatus === 'Firing' || potStatus === 'Drying') && timerDays ? timerStartDate : undefined,
          notes: notes.trim() || undefined,
        };

        await dispatch(updatePotteryThunk(updatedPottery)).unwrap();
        Alert.alert(t('common.success'), t('addEditItem.alerts.updateSuccess'));
      } else {
        // Add new pottery
        const newPottery = {
          potName: potName.trim(),
          clayType,
          dateCreated,
          designType,
          potStatus,
          glazeType,
          images: images.length > 0 ? images : undefined,
          imageUri: images.length > 0 ? images[0].uri : undefined, // Keep for backward compatibility
          notificationId,
          timerDays: timerDays || undefined,
          timerStartDate: (potStatus === 'Firing' || potStatus === 'Drying') && timerDays ? timerStartDate : undefined,
          notes: notes.trim() || undefined,
        };

        await dispatch(addPotteryThunk(newPottery)).unwrap();
        Alert.alert(t('common.success'), t('addEditItem.alerts.addSuccess'));
      }

      navigation.pop();
    } catch (error) {
      console.error("Error saving pottery:", error);
      Alert.alert(t('common.error'), t('addEditItem.alerts.saveFailed'));
    }
  };

  const handleDelete = async () => {
    if (!editingPottery) return;

    Alert.alert(
      t('addEditItem.alerts.deleteConfirmTitle'),
      t('addEditItem.alerts.deleteConfirmMessage', { name: editingPottery.potName }),
      [
        {
          text: t('common.cancel'),
          style: "cancel"
        },
        {
          text: t('common.delete'),
          style: "destructive",
          onPress: async () => {
            try {
              // Cancel notification if exists
              if (editingPottery.notificationId) {
                await cancelPotteryNotification(editingPottery.notificationId);
              }
              
              await dispatch(deletePotteryThunk(editingPottery.id)).unwrap();
              Alert.alert(t('common.success'), t('addEditItem.alerts.deleteSuccess'));
              navigation.pop();
            } catch (error) {
              console.error("Error deleting pottery:", error);
              Alert.alert(t('common.error'), t('addEditItem.alerts.deleteFailed'));
            }
          }
        }
      ]
    );
  };

  return (
    <KeyboardAvoidingView 
      style={{ flex: 1, paddingTop: 30 }}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      keyboardVerticalOffset={Platform.OS === 'ios' ? 90 : 0}
    >
      <ScrollView 
        ref={scrollViewRef}
        style={[container, { backgroundColor: colors.background }]}
        keyboardShouldPersistTaps="handled"
        contentInsetAdjustmentBehavior="automatic"
      >
      <View style={form}>
        {/* Preview Carousel - only show if images exist */}
        {images.length > 0 && (
          <View style={{ marginBottom: 20, marginHorizontal: -20, marginTop: -20 }}>
            <ImageCarousel 
              images={images}
              height={250}
              showTitle={true}
              interactive={true}
              onImagePress={handleCarouselImagePress}
            />
          </View>
        )}

        <Text style={[label, { color: colors.text }]}>{t('addEditItem.fields.potName.label')}</Text>
        <TextInput
          ref={(ref) => { inputRefs.current[0] = ref; }}
          style={[input, { backgroundColor: colors.inputBackground, borderColor: colors.border, color: colors.text }]}
          value={potName}
          onChangeText={setPotName}
          placeholder={t('addEditItem.fields.potName.placeholder')}
          placeholderTextColor={colors.placeholder}
        />

        {/* Photo Section */}
        <Text style={[label, { color: colors.text, marginTop: 15 }]}>{t('addEditItem.fields.image.label')}</Text>
        
        {/* Add photo button */}
        {images.length < 3 && (
          <TouchableOpacity
            style={{
              marginTop: images.length > 0 ? 0 : 10,
              marginBottom: 15,
              paddingVertical: 40,
              paddingHorizontal: 20,
              borderRadius: 8,
              backgroundColor: colors.inputBackground,
              borderWidth: 2,
              borderColor: colors.border,
              borderStyle: 'dashed',
              alignItems: 'center',
              justifyContent: 'center',
            }}
            onPress={handleAddPhoto}
          >
            <Text style={{ fontSize: 40, marginBottom: 10 }}>📷</Text>
            <Text style={{ color: colors.text, fontSize: 16, fontWeight: '500' }}>
              {t('addEditItem.fields.image.addPhoto')}
            </Text>
            {images.length > 0 && (
              <Text style={{ color: colors.secondaryText, fontSize: 12, marginTop: 5 }}>
                ({images.length}/3)
              </Text>
            )}
          </TouchableOpacity>
        )}

        <Text style={[label, { color: colors.text }]}>{t('addEditItem.fields.clayType.label')}</Text>
        <Dropdown
          options={clayTypeOptions}
          selectedValue={clayType}
          onValueChange={(value) => setClayType(value as ClayType)}
        />

        <Text style={[label, { color: colors.text }]}>{t('addEditItem.fields.dateCreated.label')}</Text>
        <TextInput
          ref={(ref) => { 
            const dateInputIndex = 1 + images.length;
            inputRefs.current[dateInputIndex] = ref; 
          }}
          style={[input, { backgroundColor: colors.inputBackground, borderColor: colors.border, color: colors.text }]}
          value={dateCreated}
          onChangeText={setDateCreated}
          placeholder={t('addEditItem.fields.dateCreated.placeholder')}
          placeholderTextColor={colors.placeholder}
        />

        <Text style={[label, { color: colors.text }]}>{t('addEditItem.fields.designType.label')}</Text>
        <Dropdown
          options={designTypeOptions}
          selectedValue={designType}
          onValueChange={(value) => setDesignType(value as DesignType)}
        />

        <Text style={[label, { color: colors.text }]}>{t('addEditItem.fields.status.label')}</Text>
        <Dropdown
          options={potStatusOptions}
          selectedValue={potStatus}
          onValueChange={(value) => setPotStatus(value as PotStatus)}
        />

        {/* Timer for Firing or Drying */}
        {(potStatus === 'Firing' || potStatus === 'Drying') && (
          <View style={{ marginTop: 15, marginBottom: 15 }}>
            <Text style={[label, { color: colors.text }]}>{t('addEditItem.fields.timer.label')}</Text>
            <View style={{ flexDirection: 'row', gap: 10, marginTop: 5 }}>
              {[1, 2, 3].map((days) => (
                <TouchableOpacity
                  key={days}
                  style={{
                    flex: 1,
                    paddingVertical: 12,
                    paddingHorizontal: 15,
                    borderRadius: 8,
                    backgroundColor: timerDays === days ? colors.primary : colors.inputBackground,
                    borderWidth: 2,
                    borderColor: timerDays === days ? colors.primary : colors.border,
                    alignItems: 'center',
                  }}
                  onPress={() => setTimerDays(timerDays === days ? null : days)}
                  activeOpacity={0.7}
                >
                  <Text style={{ 
                    fontSize: 16, 
                    fontWeight: timerDays === days ? '600' : 'normal',
                    color: timerDays === days ? '#fff' : colors.text 
                  }}>
                    {days} {t('addEditItem.fields.timer.days')}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
            {timerDays && (
              <Text style={{ fontSize: 12, color: colors.secondaryText, marginTop: 8 }}>
                {t('addEditItem.fields.timer.description', { days: timerDays })}
              </Text>
            )}
          </View>
        )}

        <Text style={[label, { color: colors.text }]}>{t('addEditItem.fields.glazeType.label')}</Text>
        <Dropdown
          options={glazeTypeOptions}
          selectedValue={glazeType}
          onValueChange={(value) => setGlazeType(value as GlazeType)}
        />

        <Text style={[label, { color: colors.text }]}>{t('addEditItem.fields.notes.label')}</Text>
        <TextInput
          ref={(ref) => { 
            const notesInputIndex = 2 + images.length;
            inputRefs.current[notesInputIndex] = ref; 
          }}
          style={[multilineInput, { backgroundColor: colors.inputBackground, borderColor: colors.border, color: colors.text }]}
          value={notes}
          onChangeText={setNotes}
          placeholder={t('addEditItem.fields.notes.placeholder')}
          placeholderTextColor={colors.placeholder}
          multiline={true}
          numberOfLines={3}
        />

        <Button title={t(editingPottery ? 'addEditItem.buttons.update' : 'addEditItem.buttons.add')} onPress={handleSubmit} color={colors.primary} />
        
        {editingPottery && (
          <View style={{ marginTop: 20 }}>
            <Button title={t('addEditItem.buttons.delete')} onPress={handleDelete} color={colors.danger} />
          </View>
        )}

        <View style={{ marginTop: 20 }}>
          <Button title={t('addEditItem.buttons.cancel')} onPress={() => navigation.pop()} color={colors.secondaryText} />
        </View>
      </View>
      </ScrollView>

      {/* Image Modal */}
      <ImageModal
        visible={modalVisible}
        image={images[selectedImageIndex] || null}
        imageIndex={selectedImageIndex}
        onClose={handleModalClose}
        onEditTitle={handleModalEditTitle}
        onRemove={handleModalRemove}
      />
    </KeyboardAvoidingView>
  );
}
