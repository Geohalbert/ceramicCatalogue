import { createNativeStackNavigator } from '@react-navigation/native-stack';

import AddItem from "../screens/AddItem";
import Home from "../screens/Home";
import Collection from "../screens/Collection";
import Settings from "../screens/Settings";

const Stack = createNativeStackNavigator();

export default function StackNavigator() {
    return (
        <Stack.Navigator>
            <Stack.Screen 
                name="Home" 
                component={Home} 
                options={{ headerShown: false }}
            />
            <Stack.Screen name="AddItem" component={AddItem} />
            <Stack.Screen 
                name="Collection" 
                component={Collection} 
                options={{ headerShown: false }}
            />
            <Stack.Screen name="Settings" component={Settings} />
        </Stack.Navigator>
    );
}