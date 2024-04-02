import React, { useEffect, useState } from "react";
import { FlatList, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { fetchNailServices } from "../../fetches/NailServiceFetch";

export default function NailServices() {
    const [nailServices, setNailServices] = useState([]);

    useEffect(() => {
        fetchNailServices()
            .then(data => setNailServices(data))
            .catch(err => console.error(err));
    }, []);

    const handlePressEdit = (item) => {
        navigation.navigate('Muokkaa varausta', {
            id: item.id,

        });
    };

    const renderItem = ({ item }) => (
        <View style={styles.itemContainer}>
            <View style={styles.itemDetails}>
                <Text>Type: {item.type}</Text>
                <Text>Duration: {item.duration} minutes</Text>
                <Text>Price: ${item.price}</Text>
            </View>
            <View style={styles.buttonsContainer}>
                <TouchableOpacity style={styles.button} onPress={() => handlePressEdit(item)}><Text>Edit</Text></TouchableOpacity>
                <TouchableOpacity style={styles.button} onPress={() => handlePressDetails(item)}><Text>Details</Text></TouchableOpacity>
                <TouchableOpacity style={styles.button} onPress={() => handlePressDelete(item.id)}><Text>Delete</Text></TouchableOpacity>
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
        justifyContent: 'space-between',
    },
    button: {
        padding: 5,
        backgroundColor: '#ccc',
    },
});