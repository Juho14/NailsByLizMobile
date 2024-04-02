import { createStackNavigator } from '@react-navigation/stack';
import DateAndServiceSelector from '../DateAndServiceSelector';
import ReservationTimeSelector from '../ReservationTimeSelector';
import AddReservationDialog from './AddReservationDialog';

const Stack = createStackNavigator();

export default function AddReservationNavi() {
    return (
        <Stack.Navigator initialRouteName="Valitse palvelu ja päivä">
            <Stack.Screen name="Valitse palvelu ja päivä" component={DateAndServiceSelector} />
            <Stack.Screen name="Valitse aika" component={ReservationTimeSelector} />
            <Stack.Screen name="Viimeistele varaus" component={AddReservationDialog} />
        </Stack.Navigator>
    );
}
