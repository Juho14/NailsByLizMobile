import { useIsFocused, useNavigation } from "@react-navigation/native";
import React, { useEffect, useState } from "react";
import { Alert, FlatList, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { deleteNailService, fetchNailServices } from "../../fetches/NailServiceFetch";

export default function NailServices() {
    const [nailServices, setNailServices] = useState([]);
    const navigation = useNavigation();
    const isFocused = useIsFocused();

    useEffect(() => {
        if (isFocused) {
            fetchNailServices()
                .then(data => setNailServices(data))
                .catch(err => console.error(err));
        }
    }, [isFocused]);

    const handlePressEdit = (item) => {
        navigation.navigate('Muokkaa palvelua', {
            id: item.id,
        });
    };

    const handlePressDelete = async (item) => {
        const { id, type, duration, price, adminService } = item;
        Alert.alert(
            'Vahvista poisto',
            `Oletko varma, että haluat poistaa palvelun?\n\nPalvelu: ${type}\nKesto: ${duration} minuuttia\nHinta: ${price}\nPalvelu asiakkaille: ${adminService ? 'Ei' : 'Kyllä'}`,
            [
                {
                    text: 'Peruuta',
                    onPress: () => console.log('Cancel Pressed'),
                    style: 'cancel'
                },
                {
                    text: 'Poista',
                    onPress: async () => {
                        try {
                            const response = await deleteNailService(id);
                            if (response.success) {
                                // Remove the deleted item from the list
                                setNailServices(prevServices => prevServices.filter(service => service.id !== id));
                                Alert.alert('Poisto onnistui');
                            } else {
                                console.error("Error deleting nail service:", response);
                                Alert.alert('Poisto epäonnistui');
                            }
                        } catch (error) {
                            console.error(error);
                            Alert.alert('Poisto epäonnistui');
                        }
                    }
                }
            ],
            { cancelable: false }
        );
    };

    const renderItem = ({ item }) => (
        <View style={styles.itemContainer}>
            <View style={styles.itemDetails}>
                <Text>Palvelun nimi: {item.type}</Text>
                <Text>Kesto: {item.duration} minuuttia, {(item.duration / 60).toFixed(2)} tuntia</Text>
                <Text>Hinta: {item.price}€</Text>
                <Text>Palvelu asiakkaille: {item.adminService ? 'Ei' : 'Kyllä'}</Text>
            </View>
            <View style={styles.buttonsContainer}>
                <TouchableOpacity style={styles.button} onPress={() => handlePressEdit(item)}><Text>Muokkaa</Text></TouchableOpacity>
                <TouchableOpacity style={styles.button} onPress={() => handlePressDelete(item)}><Text>Poista</Text></TouchableOpacity>
            </View>
        </View>
    );

    return (
        <View style={styles.container}>
            <FlatList
                data={nailServices}
                renderItem={renderItem}
                keyExtractor={item => item.id.toString()}
            />
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        width: '100%',
        paddingHorizontal: 10,
        paddingTop: 10,
        paddingBottom: 5,
    },
    itemContainer: {
        borderWidth: 1,
        borderColor: 'gray',
        padding: 10,
        marginBottom: 10,
        width: 330,
    },
    itemDetails: {
        marginBottom: 10,
        width: '90%',
    },
    buttonsContainer: {
        flexDirection: 'row',
        justifyContent: 'center',
    },
    button: {
        padding: 5,
        marginHorizontal: 30,
        backgroundColor: '#ccc',
    },
});