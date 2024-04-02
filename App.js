import { createDrawerNavigator } from '@react-navigation/drawer';
import { NavigationContainer } from '@react-navigation/native';
import * as React from 'react';
import HomeScreen from './src/components/HomeScreen';
import NailServices from './src/components/NailServices/NailServices';
import ReservationSettings from './src/components/ReservationSettings/ReservationSettings';
import ReservationNavi from './src/components/Reservations/ReservationNavi';
import AddReservationNavi from './src/components/Reservations/newreservation/AddReservationNavi';

const Drawer = createDrawerNavigator();

export default function App() {
  return (
    <NavigationContainer>
      <Drawer.Navigator initialRouteName="Kotisivu">
        <Drawer.Screen name="Kotisivu" component={HomeScreen} />
        <Drawer.Screen name="Palvelut" component={NailServices} />
        <Drawer.Screen name="Varaukset" component={ReservationNavi} />
        <Drawer.Screen name="Varaa aika" component={AddReservationNavi} />
        <Drawer.Screen name="Varausten asetukset" component={ReservationSettings} />
      </Drawer.Navigator>
    </NavigationContainer>
  );
}