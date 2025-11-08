import { useState, useEffect } from "react";
import { Text, View, TextInput, Button, StyleSheet, ScrollView, Alert } from "react-native";
import { useTranslation } from "react-i18next";
import { useNavigation, useRoute, RouteProp } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { useTheme } from "../context/ThemeContext";

import Dropdown from "../components/Dropdown";
import { useAppDispatch } from "../store/hooks";
import { addPotteryThunk, updatePotteryThunk, deletePotteryThunk } from "../store/potterySlice";
import { ClayType, DesignType, PotStatus, GlazeType, Pottery } from "../store/types";

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
      if (editingPottery) {
        // Update existing pottery
        const updatedPottery = {
          ...editingPottery,
          potName: potName.trim(),
          clayType,
          dateCreated,
          designType,
          potStatus,
          glazeType,
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
