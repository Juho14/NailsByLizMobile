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
        justifyContent: 'flex-start', // Align items at the top of the screen
        paddingTop: 50, // Add padding to create space at the top
        paddingHorizontal: 20, // Add horizontal padding
    },
    title: {
        fontSize: 24, // Increase font size for the title
        fontWeight: 'bold', // Make the title bold
        marginBottom: 10, // Add some margin at the bottom of the title
    },
    flatListContainer: {
        flexGrow: 1, // Allow the FlatList container to grow and fill the available space
        width: '100%', // Set width to 100% to fill the container
        height: '80%', // Set the height to 80% of the screen height
        borderWidth: 1,
        borderColor: 'gray',
        padding: 10,
        paddingVertical: 50, // Decrease the paddingVertical value to move the bottom of the container upwards
    },
    itemContainer: {
        marginBottom: 10, // Add margin at the bottom of each item
        alignItems: 'center', // Center items horizontally
    },
    itemDetails: {
        fontSize: 16, // Increase font size for item details
        fontWeight: 'bold', // Make item details bold
    },
    buttonText: {
        fontSize: 28, // Increase font size for the title
        fontWeight: 'bold', // Make the title bold
        marginBottom: 10, // Add some margin at the bottom of the title
    },
    button: {
        marginTop: 20, // Increase margin-top for the button
        padding: 30,
        backgroundColor: 'lightblue',
        borderRadius: 5,
        textAlign: 'center',
        marginBottom: 200,
    },
});