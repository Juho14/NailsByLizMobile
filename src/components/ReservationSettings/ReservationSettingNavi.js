import ReservationSettings from "./ReservationSettings";

const Stack = createStackNavigator();

export default function ReservationSettingNavi() {
    return (
        <Stack.Navigator initialRouteName="Varausten asetukset">
            <Stack.Screen name="Lista asetuksista" component={ReservationSettings} />
        </Stack.Navigator>
    );
}
