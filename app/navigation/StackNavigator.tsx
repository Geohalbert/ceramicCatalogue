import AddItem from "../screens/AddItem";
import Home from "../screens/Home";
import { createNativeStackNavigator } from '@react-navigation/native-stack';

const Stack = createNativeStackNavigator();

export default function StackNavigator() {
    return (
        <Stack.Navigator>
            <Stack.Screen name="Home" component={Home} />
            <Stack.Screen name="AddItem" component={AddItem} />
        </Stack.Navigator>
    );
}