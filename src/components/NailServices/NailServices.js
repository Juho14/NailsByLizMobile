import { useIsFocused, useNavigation } from "@react-navigation/native"; // Import the useIsFocused hook
import React, { useEffect, useState } from "react";
import { Alert, FlatList, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { deleteNailService, fetchNailServices } from "../../fetches/NailServiceFetch"; // Import the deleteNailService function

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
            'Confirm Delete',
            `Are you sure you want to delete the nail service?\n\nType: ${type}\nDuration: ${duration} minutes\nPrice: ${price}\nAdmin Service: ${adminService ? 'Yes' : 'No'}`,
            [
                {
                    text: 'Cancel',
                    onPress: () => console.log('Cancel Pressed'),
                    style: 'cancel'
                },
                {
                    text: 'OK',
                    onPress: async () => {
                        try {
                            const response = await deleteNailService(id);
                            if (response.success) {
                                // Remove the deleted item from the list
                                setNailServices(prevServices => prevServices.filter(service => service.id !== id));
                                Alert.alert('Success', 'Nail service deleted successfully');
                            } else {
                                console.error("Error deleting nail service:", response);
                                Alert.alert('Error', 'Failed to delete nail service');
                            }
                        } catch (error) {
                            console.error(error);
                            Alert.alert('Error', 'Failed to delete nail service');
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
                <Text>Type: {item.type}</Text>
                <Text>Duration: {item.duration} minutes, {(item.duration / 60).toFixed(2)} hours</Text>
                <Text>Price: ${item.price}</Text>
                <Text>Admin service: {item.adminService ? 'Yes' : 'No'}</Text>
            </View>
            <View style={styles.buttonsContainer}>
                <TouchableOpacity style={styles.button} onPress={() => handlePressEdit(item)}><Text>Edit</Text></TouchableOpacity>
                <TouchableOpacity style={styles.button} onPress={() => handlePressDelete(item)}><Text>Delete</Text></TouchableOpacity>
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
