import React, {useEffect, useState} from "react";
import {
    NativeBaseProvider,
    extendTheme, TextArea,
} from "native-base";
import {Provider as StoreProvider} from "react-redux";
import {persistor, store} from "./store/store";
import {PersistGate} from 'redux-persist/integration/react'
import * as Location from 'expo-location';
import {LocationObject} from "expo-location";
import Background from "./components/background";
import {NavigationContainer} from "@react-navigation/native";
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import Login from "./screens/Login";
import { I18nManager } from "react-native";

I18nManager.forceRTL(true);
I18nManager.allowRTL(true);


const Stack = createNativeStackNavigator();

// Define the config
const config = {
    useSystemColorMode: false,
    initialColorMode: "dark",
};

// extend the theme
export const theme = extendTheme({
    config, components: {
        FormControl: {
            baseStyle: {
                direction: 'rtl',
                textAlign:'right',
            }
        },
        HStack: {
            baseStyle: {
                flexDirection: 'row-reverse'
            }
        },
        CheckBox: {
            direction: 'rtl',
            _text: {color:"white"}
        }
    }
});
type MyThemeType = typeof theme;

declare module "native-base" {
    interface ICustomTheme extends MyThemeType {
    }
}


export default function App() {
    const [location, setLocation] = useState<LocationObject[]>([]);
    const [errorMsg, setErrorMsg] = useState<string | null>(null);

    useEffect(() => {
        (async () => {

            let {status} = await Location.requestForegroundPermissionsAsync();
            if (status !== 'granted') {
                setErrorMsg('Permission to access location was denied');
                return;
            }

            let location = await Location.getCurrentPositionAsync({});
            setLocation(curr => [...curr, location]);
            console.log(location)
        })();
    }, []);

    return (
        <StoreProvider store={store}>
            <PersistGate persistor={persistor}>
                <NativeBaseProvider theme={theme}>
                    <NavigationContainer>
                        <Stack.Navigator initialRouteName={"Login"}  screenOptions={{
                            headerShown: false
                        }}>
                            <Stack.Screen name={"Login"} component={Login}/>
                            <Stack.Screen name={"Home"} component={Background}/>
                        </Stack.Navigator>
                    </NavigationContainer>
                </NativeBaseProvider>
            </PersistGate>
        </StoreProvider>
    );
}

