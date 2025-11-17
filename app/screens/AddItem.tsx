import { useState, useEffect, useRef, useCallback } from "react";
import { Text, View, TextInput, Button, StyleSheet, ScrollView, TouchableOpacity, KeyboardAvoidingView, Platform, Keyboard, Alert } from "react-native";
import { useTranslation } from "react-i18next";
import { useNavigation, useRoute, RouteProp, useFocusEffect } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { useTheme } from "../context/ThemeContext";

import Dropdown from "../components/Dropdown";
import ImageCarousel from "../components/ImageCarousel";
import ImageModal from "../components/ImageModal";
import { useAppDispatch } from "../store/hooks";
import { addPotteryThunk, updatePotteryThunk, deletePotteryThunk } from "../store/potterySlice";
import { ClayType, DesignType, PotStatus, GlazeType, Pottery, PotteryImage } from "../store/types";
import { getRemainingTime } from "../services/notificationService";

import AddItemStyles from "./styles/AddItemStyles";
import { useAddItemHandlers } from "./hooks/useAddItemHandlers";

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
  const modalVisibleRef = useRef(false);
  const isNavigatingRef = useRef(false);
  const hasUnsavedChangesRef = useRef(false);
  const isSavingRef = useRef(false);

  const navigation = useNavigation<NativeStackNavigationProp<any>>();
  const dispatch = useAppDispatch();

  // Track initial state for change detection
  const initialStateRef = useRef<{
    potName: string;
    clayType: ClayType;
    dateCreated: string;
    designType: DesignType;
    potStatus: PotStatus;
    glazeType: GlazeType;
    timerDays: number | null;
    images: PotteryImage[];
    notes: string;
  } | null>(null);
  
  // Refs for scrolling to specific images
  const scrollViewRef = useRef<ScrollView>(null);
  const imageRefs = useRef<Array<View | null>>([]);
  const inputRefs = useRef<Array<TextInput | null>>([]);
  
  // Keep ref in sync with state
  useEffect(() => {
    modalVisibleRef.current = modalVisible;
    // Reset navigation flag when modal closes
    if (!modalVisible) {
      isNavigatingRef.current = false;
    }
  }, [modalVisible]);

  // Reset state when screen regains focus
  useFocusEffect(
    useCallback(() => {
      // Reset navigation flag when screen is focused
      isNavigatingRef.current = false;
      
      return () => {
        // Close modal when screen loses focus
        setModalVisible(false);
        isNavigatingRef.current = false;
      };
    }, [])
  );
  
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
      let initialImages: PotteryImage[] = [];
      if (editingPottery.images && editingPottery.images.length > 0) {
        initialImages = editingPottery.images;
        setImages(editingPottery.images);
      } else if (editingPottery.imageUri) {
        initialImages = [{ uri: editingPottery.imageUri }];
        setImages([{ uri: editingPottery.imageUri }]);
      }
      
      setNotes(editingPottery.notes || "");
      
      // Store initial state for change detection
      initialStateRef.current = {
        potName: editingPottery.potName,
        clayType: editingPottery.clayType,
        dateCreated: editingPottery.dateCreated,
        designType: editingPottery.designType,
        potStatus: editingPottery.potStatus,
        glazeType: editingPottery.glazeType,
        timerDays: editingPottery.timerDays || null,
        images: initialImages,
        notes: editingPottery.notes || "",
      };
      hasUnsavedChangesRef.current = false;
    } else {
      // For new items, initial state is empty/default
      initialStateRef.current = {
        potName: "",
        clayType: "Porcelain",
        dateCreated: new Date().toISOString().split('T')[0],
        designType: "Pot",
        potStatus: "In Progress",
        glazeType: "No Glaze",
        timerDays: null,
        images: [],
        notes: "",
      };
      hasUnsavedChangesRef.current = false;
    }
  }, [editingPottery]);

  const {
    handleAddPhoto,
    handleRemovePhoto,
    handleUpdateImageTitle,
    handleCarouselImagePress,
    handleModalClose,
    handleModalEditTitle,
    handleModalRemove,
    handleSubmit,
    handleDelete,
  } = useAddItemHandlers({
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
    existingNotificationId,
    setExistingNotificationId,
    images,
    setImages,
    notes,
    setModalVisible,
    setSelectedImageIndex,
  });

  // Function to check if there are unsaved changes
  const hasUnsavedChanges = useCallback(() => {
    if (!initialStateRef.current) return false;
    if (isSavingRef.current) return false; // Don't prompt if we're in the process of saving

    const initial = initialStateRef.current;
    
    // Check if any field has changed
    if (potName.trim() !== initial.potName.trim()) return true;
    if (clayType !== initial.clayType) return true;
    if (dateCreated !== initial.dateCreated) return true;
    if (designType !== initial.designType) return true;
    if (potStatus !== initial.potStatus) return true;
    if (glazeType !== initial.glazeType) return true;
    if (timerDays !== initial.timerDays) return true;
    if (notes.trim() !== (initial.notes || "").trim()) return true;

    // Check images - compare count, URIs, and titles
    if (images.length !== initial.images.length) return true;
    for (let i = 0; i < images.length; i++) {
      if (images[i].uri !== initial.images[i]?.uri) return true;
      if ((images[i].title || "") !== (initial.images[i]?.title || "")) return true;
    }

    return false;
  }, [potName, clayType, dateCreated, designType, potStatus, glazeType, timerDays, images, notes]);

  // Close modal when navigating back and check for unsaved changes
  useFocusEffect(
    useCallback(() => {
      const onBeforeRemove = (e: any) => {
        // If modal is visible, close it first
        if (modalVisibleRef.current && !isNavigatingRef.current) {
          e.preventDefault();
          isNavigatingRef.current = true;
          setModalVisible(false);
          // After modal closes, check for unsaved changes
          requestAnimationFrame(() => {
            requestAnimationFrame(() => {
              isNavigatingRef.current = false;
              // Trigger navigation again to check for unsaved changes
              navigation.dispatch(e.data.action);
            });
          });
          return;
        }

        // Check for unsaved changes
        if (hasUnsavedChanges() && !isNavigatingRef.current) {
          e.preventDefault();

          Alert.alert(
            t('addEditItem.alerts.unsavedChangesTitle'),
            t('addEditItem.alerts.unsavedChangesMessage'),
            [
              {
                text: t('common.cancel'),
                style: 'cancel',
                onPress: () => {
                  // Do nothing, stay on screen
                },
              },
              {
                text: t('addEditItem.alerts.discard'),
                style: 'destructive',
                onPress: () => {
                  isNavigatingRef.current = true;
                  navigation.dispatch(e.data.action);
                },
              },
              {
                text: t('addEditItem.alerts.save'),
                onPress: async () => {
                  isNavigatingRef.current = true;
                  isSavingRef.current = true;
                  try {
                    await handleSubmit();
                    // After successful save, navigation will happen automatically
                  } catch (error) {
                    isSavingRef.current = false;
                    isNavigatingRef.current = false;
                    // If save fails, stay on screen
                  }
                },
              },
            ]
          );
        }
      };

      const unsubscribe = navigation.addListener('beforeRemove', onBeforeRemove);

      return () => {
        unsubscribe();
      };
    }, [navigation, hasUnsavedChanges, handleSubmit, t])
  );

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
        {/* Preview Carousel - always show with placeholders if space available */}
        <View style={{ marginBottom: 20, marginHorizontal: -20, marginTop: -20 }}>
          <ImageCarousel 
            images={images}
            height={250}
            showTitle={true}
            interactive={true}
            onImagePress={handleCarouselImagePress}
            maxImages={3}
            showPlaceholders={images.length < 3}
            onPlaceholderPress={handleAddPhoto}
          />
        </View>
        
        {/* Show "Photos (Optional - Up to 3)" text below carousel when less than 3 photos */}
        {images.length < 3 && (
          <Text style={[label, { color: colors.secondaryText, marginTop: -10, marginBottom: 20, textAlign: 'center', fontSize: 14, fontWeight: 'normal' }]}>
            {t('addEditItem.fields.image.label')}
          </Text>
        )}

        {/* Action Buttons at the top - in one row */}
        <View style={{ flexDirection: 'row', marginBottom: 20, alignItems: 'center' }}>
          <View style={{ flex: 1, marginRight: 5 }}>
            <Button title={t(editingPottery ? 'addEditItem.buttons.update' : 'addEditItem.buttons.add')} onPress={handleSubmit} color={colors.primary} />
          </View>
          
          {editingPottery && (
            <View style={{ flex: 1, marginHorizontal: 5 }}>
              <Button title={t('addEditItem.buttons.delete')} onPress={handleDelete} color={colors.danger} />
            </View>
          )}

          <View style={{ flex: 1, marginLeft: 5 }}>
            <Button 
              title={t('addEditItem.buttons.cancel')} 
              onPress={() => {
                if (hasUnsavedChanges()) {
                  Alert.alert(
                    t('addEditItem.alerts.unsavedChangesTitle'),
                    t('addEditItem.alerts.unsavedChangesMessage'),
                    [
                      {
                        text: t('common.cancel'),
                        style: 'cancel',
                      },
                      {
                        text: t('addEditItem.alerts.discard'),
                        style: 'destructive',
                        onPress: () => navigation.pop(),
                      },
                      {
                        text: t('addEditItem.alerts.save'),
                        onPress: async () => {
                          isSavingRef.current = true;
                          try {
                            await handleSubmit();
                          } catch (error) {
                            isSavingRef.current = false;
                          }
                        },
                      },
                    ]
                  );
                } else {
                  navigation.pop();
                }
              }} 
              color={colors.secondaryText} 
            />
          </View>
        </View>

        <View style={{ marginTop: 20, marginBottom: 10 }}>
          <View style={{ height: 1, backgroundColor: colors.border }} />
        </View>

        <Text style={[label, { color: colors.text }]}>{t('addEditItem.fields.potName.label')}</Text>
        <TextInput
          ref={(ref) => { inputRefs.current[0] = ref; }}
          style={[input, { backgroundColor: colors.inputBackground, borderColor: colors.border, color: colors.text }]}
          value={potName}
          onChangeText={setPotName}
          placeholder={t('addEditItem.fields.potName.placeholder')}
          placeholderTextColor={colors.placeholder}
        />

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
