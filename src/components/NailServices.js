import React, { useEffect, useState } from "react";
import { FlatList, StyleSheet, Text, View } from "react-native";
import { fetchNailServices } from "../fetches/NailServiceFetch";

export default function NailServices() {
    const [nailServices, setNailServices] = useState([]);

    useEffect(() => {
        fetchNailServices()
            .then(data => setNailServices(data))
            .catch(err => console.error(err));
    }, []);

    const renderItem = ({ item }) => (
        <View style={styles.settingContainer}>
            <Text>Type: {item.type}</Text>
            <Text>Duration: {item.duration} minutes</Text>
            <Text>Price: ${item.price}</Text>
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
    },
    settingContainer: {
        borderWidth: 1,
        borderColor: 'gray',
        padding: 10,
        marginBottom: 10,
        width: '80%',
        alignItems: 'center',
    },
});
