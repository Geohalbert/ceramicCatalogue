import { useState, useEffect } from "react";
import { Text, View, TextInput, Button, StyleSheet, ScrollView, Alert, TouchableOpacity } from "react-native";
import { useTranslation } from "react-i18next";
import { useNavigation, useRoute, RouteProp } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { useTheme } from "../context/ThemeContext";

import Dropdown from "../components/Dropdown";
import { useAppDispatch } from "../store/hooks";
import { addPotteryThunk, updatePotteryThunk, deletePotteryThunk } from "../store/potterySlice";
import { ClayType, DesignType, PotStatus, GlazeType, Pottery } from "../store/types";
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

  const navigation = useNavigation<NativeStackNavigationProp<any>>();
  const dispatch = useAppDispatch();

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
    }
  }, [editingPottery]);

  const { container, form, label, input } = AddItemStyles;

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
          notificationId,
          timerDays: timerDays || undefined,
          timerStartDate: (potStatus === 'Firing' || potStatus === 'Drying') && timerDays ? timerStartDate : undefined,
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
          notificationId,
          timerDays: timerDays || undefined,
          timerStartDate: (potStatus === 'Firing' || potStatus === 'Drying') && timerDays ? timerStartDate : undefined,
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
    <ScrollView style={[container, { backgroundColor: colors.background }]}>
      <View style={form}>
        <Text style={[label, { color: colors.text }]}>{t('addEditItem.fields.potName.label')}</Text>
        <TextInput
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

        <Button title={t(editingPottery ? 'addEditItem.buttons.update' : 'addEditItem.buttons.add')} onPress={handleSubmit} color={colors.primary} />
        
        {editingPottery && (
          <View style={{ marginTop: 20 }}>
            <Button title={t('addEditItem.buttons.delete')} onPress={handleDelete} color={colors.danger} />
          </View>
        )}
      </View>
    </ScrollView>
  );
}
