import { useIsFocused, useNavigation } from '@react-navigation/native';
import { useEffect, useState } from 'react';
import { FlatList, StyleSheet, Text, View } from 'react-native';
import { TouchableOpacity } from 'react-native-gesture-handler';
import { fetchNailServices } from '../fetches/NailServiceFetch';

export default function HomeScreen() {
    const navigation = useNavigation();
    const isFocused = useIsFocused();
    const [nailServices, setNailServices] = useState([])

    useEffect(() => {
        if (isFocused) {
            fetchNailServices()
                .then(data => setNailServices(data))
                .catch(err => console.error(err));
        }
    }, [isFocused]);
    const renderItem = ({ item }) => {
        if (item.adminService) {
            return null;
        }

        return (
            <View style={styles.itemContainer}>
                <View style={styles.itemDetails}>
                    <Text style={styles.title}>{item.type} - {item.price}€</Text>
                </View>
            </View>
        );
    };


    const handlePressNewReservation = () => {
        navigation.reset({
            index: 0,
            routes: [{ name: 'Varaa aika' }],
        });
    };

    return (
        <View style={styles.container}>
            <Text style={styles.title}>Tervetuloa kynsiteknikon mobiilisovellukseen!</Text>
            <Text style={styles.title}>Hinnasto:</Text>
            <FlatList
                style={styles.flatListContainer}
                data={nailServices}
                renderItem={renderItem}
                keyExtractor={item => item.id.toString()}
            />
            <TouchableOpacity style={styles.button} onPress={() => handlePressNewReservation()}><Text style={styles.buttonText}>Varaa aika</Text></TouchableOpacity>
        </View>
    );

}
const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'flex-start',
        paddingTop: 50,
        paddingHorizontal: 20,
    },
    title: {
        fontSize: 24,
        fontWeight: 'bold',
        marginBottom: 10,
    },
    flatListContainer: {
        flexGrow: 1,
        width: '100%',
        height: '80%',
        borderWidth: 1,
        borderColor: 'gray',
        padding: 10,
        paddingVertical: 50,
    },
    itemContainer: {
        marginBottom: 10,
        alignItems: 'center',
    },
    itemDetails: {
        fontSize: 16,
        fontWeight: 'bold',
    },
    buttonText: {
        fontSize: 28,
        fontWeight: 'bold',
        marginBottom: 10,
    },
    button: {
        marginTop: 20,
        padding: 30,
        backgroundColor: 'lightblue',
        borderRadius: 5,
        textAlign: 'center',
        marginBottom: 200,
    },
});