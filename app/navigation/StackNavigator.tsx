import { createNativeStackNavigator } from '@react-navigation/native-stack';

import AddItem from "../screens/AddItem";
import Home from "../screens/Home";
import Collection from "../screens/Collection";
import Settings from "../screens/Settings";

// Main stack navigator for regular navigation (Home, Collection, AddItem)
const MainStack = createNativeStackNavigator();

function MainStackNavigator() {
    return (
        <MainStack.Navigator>
            <MainStack.Screen 
                name="Home" 
                component={Home} 
                options={{ headerShown: false }}
            />
            <MainStack.Screen 
                name="Collection" 
                component={Collection} 
                options={{ headerShown: false }}
            />
            <MainStack.Screen 
                name="AddItem" 
                component={AddItem} 
                options={{ headerShown: false }}
            />
        </MainStack.Navigator>
    );
}

// Root stack navigator with modal presentation for Settings
const RootStack = createNativeStackNavigator();

export default function StackNavigator() {
    return (
        <RootStack.Navigator>
            <RootStack.Screen 
                name="Main" 
                component={MainStackNavigator}
                options={{ headerShown: false }}
            />
            <RootStack.Screen 
                name="Settings" 
                component={Settings}
                options={{
                    presentation: 'modal',
                    headerShown: true,
                    headerShadowVisible: false,
                }}
            />
        </RootStack.Navigator>
    );
}
