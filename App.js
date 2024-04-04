import { createDrawerNavigator } from '@react-navigation/drawer';
import { NavigationContainer } from '@react-navigation/native';
import * as React from 'react';
import HomeScreen from './src/components/HomeScreen';
import AddNailService from './src/components/NailServices/AddNailService';
import NailServiceNavi from './src/components/NailServices/NailServiceNavi';
import AddReservationSetting from './src/components/ReservationSettings/AddReservationSetting';
import ReservationSettingNavi from './src/components/ReservationSettings/ReservationSettingNavi';
import ReservationNavi from './src/components/Reservations/ReservationNavi';
import AddReservationNavi from './src/components/Reservations/newreservation/AddReservationNavi';

const Drawer = createDrawerNavigator();

export default function App() {
  return (
    <NavigationContainer>
      <Drawer.Navigator initialRouteName="Kotisivu">
        <Drawer.Screen name="Kotisivu" component={HomeScreen} />
        <Drawer.Screen name="Palvelut" component={NailServiceNavi} />
        <Drawer.Screen name="Lisää palvelu" component={AddNailService} />
        <Drawer.Screen name="Varaukset" component={ReservationNavi} />
        <Drawer.Screen name="Varaa aika" component={AddReservationNavi} />
        <Drawer.Screen name="Varausten asetukset" component={ReservationSettingNavi} />
        <Drawer.Screen name="Lisää varausasetus" component={AddReservationSetting} />
      </Drawer.Navigator>
    </NavigationContainer>
  );
}