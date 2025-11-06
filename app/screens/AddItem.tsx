import { useState, useEffect } from "react";
import { Text, View, TextInput, Button, StyleSheet, ScrollView, Alert } from "react-native";
import { Picker } from "@react-native-picker/picker";
import { useNavigation, useRoute, RouteProp } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";


import { useAppDispatch } from "../store/hooks";
import { addPottery, updatePottery } from "../store/potterySlice";
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

  const { container, form, label, input, pickerContainer } = AddItemStyles;

  const handleSubmit = () => {
    if (!potName.trim()) {
      Alert.alert("Error", "Please enter a pot name");
      return;
    }

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

      dispatch(updatePottery(updatedPottery));
      Alert.alert("Success", "Pottery item updated!");
    } else {
      // Add new pottery
      const newPottery = {
        id: Date.now().toString(),
        potName: potName.trim(),
        clayType,
        dateCreated,
        designType,
        potStatus,
        glazeType,
      };

      dispatch(addPottery(newPottery));
      Alert.alert("Success", "Pottery item added!");
    }

    navigation.pop();
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
        <View style={pickerContainer}>
          <Picker
            selectedValue={clayType}
            onValueChange={(value: ClayType) => setClayType(value)}
          >
            <Picker.Item label="Porcelain" value="Porcelain" />
            <Picker.Item label="Cinco Rojo" value="Cinco Rojo" />
            <Picker.Item label="Cinco Blanco" value="Cinco Blanco" />
            <Picker.Item label="Buffalo Wallow" value="Buffalo Wallow" />
            <Picker.Item label="Dark Chocolate" value="Dark Chocolate" />
            <Picker.Item label="Custom" value="Custom" />
            <Picker.Item label="Other" value="Other" />
          </Picker>
        </View>

        <Text style={label}>Date Created</Text>
        <TextInput
          style={input}
          value={dateCreated}
          onChangeText={setDateCreated}
          placeholder="YYYY-MM-DD"
        />

        <Text style={label}>Design Type</Text>
        <View style={pickerContainer}>
          <Picker
            selectedValue={designType}
            onValueChange={(value: DesignType) => setDesignType(value)}
          >
            <Picker.Item label="Pot" value="Pot" />
            <Picker.Item label="Vase" value="Vase" />
            <Picker.Item label="Platter" value="Platter" />
            <Picker.Item label="Mug" value="Mug" />
            <Picker.Item label="Bowl" value="Bowl" />
            <Picker.Item label="Other" value="Other" />
          </Picker>
        </View>

        <Text style={label}>Status</Text>
        <View style={pickerContainer}>
          <Picker
            selectedValue={potStatus}
            onValueChange={(value: PotStatus) => setPotStatus(value)}
          >
            <Picker.Item label="In Progress" value="In Progress" />
            <Picker.Item label="Drying" value="Drying" />
            <Picker.Item label="Firing" value="Firing" />
            <Picker.Item label="Finished" value="Finished" />
          </Picker>
        </View>

        <Text style={label}>Glaze Type</Text>
        <View style={pickerContainer}>
          <Picker
            selectedValue={glazeType}
            onValueChange={(value: GlazeType) => setGlazeType(value)}
          >
            <Picker.Item label="No Glaze" value="No Glaze" />
            <Picker.Item label="Matte" value="Matte" />
            <Picker.Item label="Gloss" value="Gloss" />
          </Picker>
        </View>

        <Button title={editingPottery ? "Update Pottery" : "Add Pottery"} onPress={handleSubmit} />
      </View>
    </ScrollView>
  );
}
