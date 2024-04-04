import { createStackNavigator } from '@react-navigation/stack';

import EditReservationSetting from "./EditReservationSetting";
import ReservationSettings from "./ReservationSettings";

const Stack = createStackNavigator();

export default function ReservationSettingNavi() {
    return (
        <Stack.Navigator initialRouteName="Varausten asetukset">
            <Stack.Screen name="Lista asetuksista" component={ReservationSettings} />
            <Stack.Screen name="Muokkaa asetusta" component={EditReservationSetting} />
        </Stack.Navigator>
    );
}
