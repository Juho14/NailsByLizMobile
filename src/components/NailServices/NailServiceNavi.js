import { createStackNavigator } from '@react-navigation/stack';
import EditNailService from './EditNailService';
import NailServices from './NailServices';

const Stack = createStackNavigator();

export default function NailServiceNavi() {
    return (
        <Stack.Navigator initialRouteName="Lista palveluista">
            <Stack.Screen name="Lista palveluista" component={NailServices} />
            <Stack.Screen name="Muokkaa palvelua" component={EditNailService} />
        </Stack.Navigator>
    );
}
