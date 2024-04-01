import { createDrawerNavigator } from '@react-navigation/drawer';
import { NavigationContainer } from '@react-navigation/native';
import * as React from 'react';
import { View } from 'react-native';
import HomeScreen from './HomeScreen';
import NailServices from './NailServices';

function HomeScreenNavi() {
    return (
        <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
            <HomeScreen />
        </View>
    );
}

function NailServiceNavi() {
    return (
        <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
            <NailServices />
        </View>
    );
}

const Drawer = createDrawerNavigator();

export default function DrawerNavigation() {
    return (
        <NavigationContainer>
            <Drawer.Navigator initialRouteName="Home">
                <Drawer.Screen name="Home" component={HomeScreenNavi} />
                <Drawer.Screen name="Services" component={NailServiceNavi} />
            </Drawer.Navigator>
        </NavigationContainer>
    );
}