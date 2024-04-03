import { createStackNavigator } from '@react-navigation/stack';
import DateAndServiceSelector from './DateAndServiceSelector';
import ReservationDetails from './ReservationDetails';
import ReservationTimeSelector from './ReservationTimeSelector';
import Reservations from './Reservations';
import EditReservationDialog from './editresrevation/EditReservationDialog';

const Stack = createStackNavigator();

export default function ReservationNavi() {
    return (
        <Stack.Navigator initialRouteName="Lista varauksista">
            <Stack.Screen name="Lista varauksista" component={Reservations} />
            <Stack.Screen name="Varauksen lisätiedot" component={ReservationDetails} />
            <Stack.Screen name="Muokkaa varausta" component={EditReservationDialog} />
            <Stack.Screen name="Valitse palvelu ja päivä" component={DateAndServiceSelector} />
            <Stack.Screen name="Valitse aika" component={ReservationTimeSelector} />
        </Stack.Navigator>
    );
}
