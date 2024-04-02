import { useNavigation } from "@react-navigation/native";
import { Text, View } from "react-native";

export default function EditReservationDialog() {
    navigate = useNavigation();

    handlePressEditContents = () => {
        navigation.navigate('Varaa aika', { fromEdit: true })
    };

    return (
        <View>
            <Text>
                Hei
            </Text>
        </View>
    )
}