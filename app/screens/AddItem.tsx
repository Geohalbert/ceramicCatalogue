import { useState, useEffect, useRef, useCallback } from "react";
import { Text, View, TextInput, Button, ScrollView, TouchableOpacity, KeyboardAvoidingView, Platform, Keyboard, Alert } from "react-native";
import { useTranslation } from "react-i18next";
import { useNavigation, useRoute, RouteProp, useFocusEffect } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { useTheme } from "../context/ThemeContext";

import Dropdown from "../components/Dropdown";
import ImageCarousel from "../components/ImageCarousel";
import ImageModal from "../components/ImageModal";
import { useAppDispatch } from "../store/hooks";
import { ClayType, DesignType, PotStatus, GlazeType, Pottery, PotteryImage } from "../store/types";

import AddItemStyles from "./styles/AddItemStyles";
import { useAddItemHandlers } from "./hooks/AddItemHooks";
import { getClayTypeOptions, getDesignTypeOptions, getPotStatusOptions, getGlazeTypeOptions } from "../constants/AddItemConstants";

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
  const [timerMinutes, setTimerMinutes] = useState<number | null>(null);
  const [useCustomTimer, setUseCustomTimer] = useState(false);
  const [customTimerDays, setCustomTimerDays] = useState<string>("");
  const [customTimerTime, setCustomTimerTime] = useState<string>("");
  const [existingNotificationId, setExistingNotificationId] = useState<string | undefined>();
  const [images, setImages] = useState<PotteryImage[]>([]);
  const [notes, setNotes] = useState("");
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedImageIndex, setSelectedImageIndex] = useState<number>(0);
  const modalVisibleRef = useRef(false);
  const isNavigatingRef = useRef(false);
  const hasUnsavedChangesRef = useRef(false);
  const isSavingRef = useRef(false);
  const isProgrammaticNavigationRef = useRef(false);

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
    timerMinutes: number | null;
    useCustomTimer: boolean;
    customTimerDays: string;
    customTimerTime: string;
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
      setTimerMinutes(editingPottery.timerMinutes || null);
      // Clear timerMinutes if timerDays is set and vice versa
      if (editingPottery.timerDays) {
        setTimerMinutes(null);
      }
      if (editingPottery.timerMinutes) {
        setTimerDays(null);
      }
      if (editingPottery.timerTime) {
        setUseCustomTimer(true);
        setCustomTimerTime(editingPottery.timerTime);
        setCustomTimerDays(editingPottery.timerDays?.toString() || "");
      } else {
        setUseCustomTimer(false);
        setCustomTimerTime("");
        setCustomTimerDays("");
      }
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
        timerMinutes: editingPottery.timerMinutes || null,
        useCustomTimer: !!editingPottery.timerTime,
        customTimerDays: editingPottery.timerDays?.toString() || "",
        customTimerTime: editingPottery.timerTime || "",
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
        timerMinutes: null,
        useCustomTimer: false,
        customTimerDays: "",
        customTimerTime: "",
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
    handleSubmit: originalHandleSubmit,
    handleDelete: originalHandleDelete,
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
    timerDays: useCustomTimer ? (customTimerDays !== "" ? parseInt(customTimerDays, 10) : null) : (timerMinutes ? null : timerDays),
    timerMinutes: timerMinutes,
    timerTime: useCustomTimer ? customTimerTime : undefined,
    existingNotificationId,
    setExistingNotificationId,
    images,
    setImages,
    notes,
    setModalVisible,
    setSelectedImageIndex,
  });

  // Wrap handleSubmit to mark navigation as programmatic
  const handleSubmit = useCallback(async () => {
    isProgrammaticNavigationRef.current = true;
    await originalHandleSubmit();
  }, [originalHandleSubmit]);

  // Wrap handleDelete to mark navigation as programmatic
  const handleDelete = useCallback(async () => {
    isProgrammaticNavigationRef.current = true;
    await originalHandleDelete();
  }, [originalHandleDelete]);

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
    if (timerMinutes !== initial.timerMinutes) return true;
    if (useCustomTimer !== initial.useCustomTimer) return true;
    if (customTimerDays !== initial.customTimerDays) return true;
    if (customTimerTime !== initial.customTimerTime) return true;
    if (notes.trim() !== (initial.notes || "").trim()) return true;

    // Check images - compare count, URIs, and titles
    if (images.length !== initial.images.length) return true;
    for (let i = 0; i < images.length; i++) {
      if (images[i].uri !== initial.images[i]?.uri) return true;
      if ((images[i].title || "") !== (initial.images[i]?.title || "")) return true;
    }

    return false;
  }, [potName, clayType, dateCreated, designType, potStatus, glazeType, timerDays, timerMinutes, useCustomTimer, customTimerDays, customTimerTime, images, notes]);

  // Close modal when navigating back and check for unsaved changes (only for header back button)
  useFocusEffect(
    useCallback(() => {
      const onBeforeRemove = (e: any) => {
        // If this is a programmatic navigation (e.g., after save), allow it
        if (isProgrammaticNavigationRef.current) {
          isProgrammaticNavigationRef.current = false;
          return;
        }

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

        // Check for unsaved changes (only for user-initiated back navigation)
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

  return (
    <KeyboardAvoidingView 
      style={{ flex: 1 }}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
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
                        onPress: () => {
                          isProgrammaticNavigationRef.current = true;
                          navigation.pop();
                        },
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
                  isProgrammaticNavigationRef.current = true;
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
          options={getClayTypeOptions(t)}
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
          options={getDesignTypeOptions(t)}
          selectedValue={designType}
          onValueChange={(value) => setDesignType(value as DesignType)}
        />

        <Text style={[label, { color: colors.text }]}>{t('addEditItem.fields.status.label')}</Text>
        <Dropdown
          options={getPotStatusOptions(t)}
          selectedValue={potStatus}
          onValueChange={(value) => setPotStatus(value as PotStatus)}
        />

        {/* Timer for Firing, Drying, or In Progress */}
        {(potStatus === 'Firing' || potStatus === 'Drying' || potStatus === 'In Progress') && (
          <View style={{ marginTop: 15, marginBottom: 15 }}>
            <Text style={[label, { color: colors.text }]}>{t('addEditItem.fields.timer.label')}</Text>
            
            {/* Quick Timer Buttons */}
            {!useCustomTimer && (
              <View style={{ marginTop: 5 }}>
                {/* Day Buttons */}
                <View style={{ flexDirection: 'row', gap: 10, marginBottom: 10 }}>
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
                      onPress={() => {
                        setTimerDays(timerDays === days ? null : days);
                        setTimerMinutes(null);
                        setUseCustomTimer(false);
                      }}
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
                {/* 2 Minutes Button */}
                <TouchableOpacity
                  style={{
                    paddingVertical: 12,
                    paddingHorizontal: 15,
                    borderRadius: 8,
                    backgroundColor: timerMinutes === 2 ? colors.primary : colors.inputBackground,
                    borderWidth: 2,
                    borderColor: timerMinutes === 2 ? colors.primary : colors.border,
                    alignItems: 'center',
                  }}
                  onPress={() => {
                    setTimerMinutes(timerMinutes === 2 ? null : 2);
                    setTimerDays(null);
                    setUseCustomTimer(false);
                  }}
                  activeOpacity={0.7}
                >
                  <Text style={{ 
                    fontSize: 16, 
                    fontWeight: timerMinutes === 2 ? '600' : 'normal',
                    color: timerMinutes === 2 ? '#fff' : colors.text 
                  }}>
                    2 {t('addEditItem.fields.timer.minutes') || 'minutes'}
                  </Text>
                </TouchableOpacity>
              </View>
            )}
            
            {/* Custom Timer Toggle */}
            <TouchableOpacity
              style={{
                marginTop: 10,
                paddingVertical: 10,
                paddingHorizontal: 15,
                borderRadius: 8,
                backgroundColor: useCustomTimer ? colors.primary : colors.inputBackground,
                borderWidth: 2,
                borderColor: useCustomTimer ? colors.primary : colors.border,
                alignItems: 'center',
              }}
              onPress={() => {
                setUseCustomTimer(!useCustomTimer);
                if (!useCustomTimer) {
                  // When enabling custom timer, clear quick timer
                  setTimerDays(null);
                  // Set default time to current time + 1 hour
                  const now = new Date();
                  now.setHours(now.getHours() + 1);
                  setCustomTimerTime(`${now.getHours().toString().padStart(2, '0')}:${now.getMinutes().toString().padStart(2, '0')}`);
                  setCustomTimerDays("1");
                } else {
                  // When disabling custom timer, clear custom fields
                  setCustomTimerDays("");
                  setCustomTimerTime("");
                }
              }}
              activeOpacity={0.7}
            >
              <Text style={{ 
                fontSize: 16, 
                fontWeight: useCustomTimer ? '600' : 'normal',
                color: useCustomTimer ? '#fff' : colors.text 
              }}>
                {t('addEditItem.fields.timer.useCustomTimer')}
              </Text>
            </TouchableOpacity>
            
            {/* Custom Timer Inputs */}
            {useCustomTimer && (
              <View style={{ marginTop: 10, gap: 10 }}>
                <View>
                  <Text style={[label, { color: colors.text, fontSize: 14, marginBottom: 5 }]}>
                    {t('addEditItem.fields.timer.customDays')}
                  </Text>
                  <TextInput
                    style={[input, { backgroundColor: colors.inputBackground, borderColor: colors.border, color: colors.text }]}
                    value={customTimerDays}
                    onChangeText={(text) => {
                      // Only allow numbers (including 0)
                      const numericValue = text.replace(/[^0-9]/g, '');
                      setCustomTimerDays(numericValue);
                    }}
                    placeholder="1"
                    placeholderTextColor={colors.placeholder}
                    keyboardType="numeric"
                  />
                </View>
                
                <View>
                  <Text style={[label, { color: colors.text, fontSize: 14, marginBottom: 5 }]}>
                    {t('addEditItem.fields.timer.customTime')}
                  </Text>
                  <TextInput
                    style={[input, { backgroundColor: colors.inputBackground, borderColor: colors.border, color: colors.text }]}
                    value={customTimerTime}
                    onChangeText={(text) => {
                      // Format as HH:MM
                      let formatted = text.replace(/[^0-9]/g, '');
                      if (formatted.length >= 3) {
                        formatted = formatted.slice(0, 2) + ':' + formatted.slice(2, 4);
                      }
                      if (formatted.length === 2 && !formatted.includes(':')) {
                        formatted = formatted + ':';
                      }
                      // Validate hours (0-23) and minutes (0-59)
                      const parts = formatted.split(':');
                      if (parts.length === 2) {
                        const hours = parseInt(parts[0], 10);
                        const minutes = parseInt(parts[1], 10);
                        if (hours > 23) {
                          formatted = '23:' + (minutes > 59 ? '59' : parts[1]);
                        } else if (minutes > 59) {
                          formatted = parts[0] + ':59';
                        }
                      }
                      setCustomTimerTime(formatted);
                    }}
                    placeholder={t('addEditItem.fields.timer.customTimePlaceholder')}
                    placeholderTextColor={colors.placeholder}
                    keyboardType="numeric"
                    maxLength={5}
                  />
                </View>
              </View>
            )}
            
            {/* Timer Description */}
            {timerDays && !useCustomTimer && (
              <Text style={{ fontSize: 12, color: colors.secondaryText, marginTop: 8 }}>
                {t('addEditItem.fields.timer.description', { days: timerDays })}
              </Text>
            )}
            {timerMinutes && !useCustomTimer && (
              <Text style={{ fontSize: 12, color: colors.secondaryText, marginTop: 8 }}>
                {t('addEditItem.fields.timer.minutesDescription', { minutes: timerMinutes }) || `You'll receive a notification in ${timerMinutes} minute(s)`}
              </Text>
            )}
            {useCustomTimer && customTimerDays !== "" && customTimerTime && (
              <Text style={{ fontSize: 12, color: colors.secondaryText, marginTop: 8 }}>
                {t('addEditItem.fields.timer.description', { days: customTimerDays })} at {customTimerTime}
              </Text>
            )}
          </View>
        )}

        <Text style={[label, { color: colors.text }]}>{t('addEditItem.fields.glazeType.label')}</Text>
        <Dropdown
          options={getGlazeTypeOptions(t)}
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
