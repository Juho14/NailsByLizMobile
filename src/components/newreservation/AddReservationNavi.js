import { createStackNavigator } from '@react-navigation/stack';
import DateAndServiceSelector from './DateAndServiceSelector';
import ReservationDialog from './ReservationDialog';
import ReservationTimeSelector from './ReservationTimeSelector';

const Stack = createStackNavigator();

export default function AddReservationNavi() {
    return (
        <Stack.Navigator initialRouteName="DateAndServiceSelector">
            <Stack.Screen name="Valitse palvelu ja päivä" component={DateAndServiceSelector} />
            <Stack.Screen name="Valitse aika" component={ReservationTimeSelector} />
            <Stack.Screen name="Viimeistele varaus" component={ReservationDialog} />
        </Stack.Navigator>
    );
}
