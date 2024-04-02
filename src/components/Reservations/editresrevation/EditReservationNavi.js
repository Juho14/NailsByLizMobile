import { createStackNavigator } from '@react-navigation/stack';
import resrvationDetails from '../../ReservationDetails';
import DateAndServiceSelector from '../../newreservation/DateAndServiceSelector';
import ReservationTimeSelector from '../../newreservation/ReservationTimeSelector';
import Reservations from '../Reservations';
import editReservationDialog from './EditReservationDialog';

const Stack = createStackNavigator();

export default function EditReservationNavi() {
    return (
        <Stack.Navigator initialRouteName="Varaukset">
            <Stack.Screen name="Varaukset" component={Reservations} />
            <Stack.Screen name="Varauksen lisätiedot" component={resrvationDetails} />
            <Stack.Screen name="Muokkaa varausta" component={editReservationDialog} />
            <Stack.Screen name="Valitse palvelu ja päivä" component={DateAndServiceSelector} />
            <Stack.Screen name="Valitse aika" component={ReservationTimeSelector} />
        </Stack.Navigator>
    );
}
