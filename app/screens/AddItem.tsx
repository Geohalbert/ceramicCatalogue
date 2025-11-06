import { useState } from "react";
import { Text, View, TextInput, Button, StyleSheet, ScrollView, Alert } from "react-native";
import { Picker } from "@react-native-picker/picker";
import { useAppDispatch } from "../store/hooks";
import { addPottery } from "../store/potterySlice";
import { ClayType, DesignType, PotStatus, GlazeType } from "../store/types";
import { useNavigation } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";


export default function AddItem() {
  const [potName, setPotName] = useState("");
  const [clayType, setClayType] = useState<ClayType>("Porcelain");
  const [dateCreated, setDateCreated] = useState(new Date().toISOString().split('T')[0]);
  const [designType, setDesignType] = useState<DesignType>("Pot");
  const [potStatus, setPotStatus] = useState<PotStatus>("In Progress");
  const [glazeType, setGlazeType] = useState<GlazeType>("No Glaze");

  const navigation = useNavigation<NativeStackNavigationProp<any>>();
  const dispatch = useAppDispatch();

  const handleSubmit = () => {
    if (!potName.trim()) {
      Alert.alert("Error", "Please enter a pot name");
      return;
    }

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
    navigation.pop();
  };

  return (
    <ScrollView style={styles.container}>
      <View style={styles.form}>
        <Text style={styles.label}>Pot Name *</Text>
        <TextInput
          style={styles.input}
          value={potName}
          onChangeText={setPotName}
          placeholder="Enter pot name"
        />

        <Text style={styles.label}>Clay Type</Text>
        <View style={styles.pickerContainer}>
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

        <Text style={styles.label}>Date Created</Text>
        <TextInput
          style={styles.input}
          value={dateCreated}
          onChangeText={setDateCreated}
          placeholder="YYYY-MM-DD"
        />

        <Text style={styles.label}>Design Type</Text>
        <View style={styles.pickerContainer}>
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

        <Text style={styles.label}>Status</Text>
        <View style={styles.pickerContainer}>
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

        <Text style={styles.label}>Glaze Type</Text>
        <View style={styles.pickerContainer}>
          <Picker
            selectedValue={glazeType}
            onValueChange={(value: GlazeType) => setGlazeType(value)}
          >
            <Picker.Item label="No Glaze" value="No Glaze" />
            <Picker.Item label="Matte" value="Matte" />
            <Picker.Item label="Gloss" value="Gloss" />
          </Picker>
        </View>

        <Button title="Add Pottery" onPress={handleSubmit} />
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  form: {
    padding: 20,
  },
  label: {
    fontSize: 16,
    fontWeight: 'bold',
    marginTop: 15,
    marginBottom: 5,
  },
  input: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 5,
    padding: 10,
    fontSize: 16,
  },
  pickerContainer: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 5,
  },
});

