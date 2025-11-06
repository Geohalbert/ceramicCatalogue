import { useState, useEffect } from "react";
import { Text, View, TextInput, Button, StyleSheet, ScrollView, Alert } from "react-native";
import { useNavigation, useRoute, RouteProp } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";

import Dropdown from "../components/Dropdown";
import { useAppDispatch } from "../store/hooks";
import { addPotteryThunk, updatePotteryThunk } from "../store/potterySlice";
import { ClayType, DesignType, PotStatus, GlazeType, Pottery } from "../store/types";

import AddItemStyles from "./styles/AddItemStyles";

type AddItemRouteParams = {
  AddItem: {
    pottery?: Pottery;
  };
};

export default function AddItem() {
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
    { label: "Porcelain", value: "Porcelain" },
    { label: "Cinco Rojo", value: "Cinco Rojo" },
    { label: "Cinco Blanco", value: "Cinco Blanco" },
    { label: "Buffalo Wallow", value: "Buffalo Wallow" },
    { label: "Dark Chocolate", value: "Dark Chocolate" },
    { label: "Custom", value: "Custom" },
    { label: "Other", value: "Other" },
  ];

  const designTypeOptions = [
    { label: "Pot", value: "Pot" },
    { label: "Vase", value: "Vase" },
    { label: "Platter", value: "Platter" },
    { label: "Mug", value: "Mug" },
    { label: "Bowl", value: "Bowl" },
    { label: "Other", value: "Other" },
  ];

  const potStatusOptions = [
    { label: "In Progress", value: "In Progress" },
    { label: "Drying", value: "Drying" },
    { label: "Firing", value: "Firing" },
    { label: "Finished", value: "Finished" },
  ];

  const glazeTypeOptions = [
    { label: "No Glaze", value: "No Glaze" },
    { label: "Matte", value: "Matte" },
    { label: "Gloss", value: "Gloss" },
  ];

  const handleSubmit = async () => {
    if (!potName.trim()) {
      Alert.alert("Error", "Please enter a pot name");
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
        Alert.alert("Success", "Pottery item updated!");
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
        Alert.alert("Success", "Pottery item added!");
      }

      navigation.pop();
    } catch (error) {
      console.error("Error saving pottery:", error);
      Alert.alert("Error", "Failed to save pottery item. Please check your Firebase configuration.");
    }
  };

  return (
    <ScrollView style={container}>
      <View style={form}>
        <Text style={label}>Pot Name *</Text>
        <TextInput
          style={input}
          value={potName}
          onChangeText={setPotName}
          placeholder="Enter pot name"
        />

        <Text style={label}>Clay Type</Text>
        <Dropdown
          options={clayTypeOptions}
          selectedValue={clayType}
          onValueChange={(value) => setClayType(value as ClayType)}
        />

        <Text style={label}>Date Created</Text>
        <TextInput
          style={input}
          value={dateCreated}
          onChangeText={setDateCreated}
          placeholder="YYYY-MM-DD"
        />

        <Text style={label}>Design Type</Text>
        <Dropdown
          options={designTypeOptions}
          selectedValue={designType}
          onValueChange={(value) => setDesignType(value as DesignType)}
        />

        <Text style={label}>Status</Text>
        <Dropdown
          options={potStatusOptions}
          selectedValue={potStatus}
          onValueChange={(value) => setPotStatus(value as PotStatus)}
        />

        <Text style={label}>Glaze Type</Text>
        <Dropdown
          options={glazeTypeOptions}
          selectedValue={glazeType}
          onValueChange={(value) => setGlazeType(value as GlazeType)}
        />

        <Button title={editingPottery ? "Update Pottery" : "Add Pottery"} onPress={handleSubmit} />
      </View>
    </ScrollView>
  );
}
