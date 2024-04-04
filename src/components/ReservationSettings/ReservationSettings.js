import { useIsFocused, useNavigation } from '@react-navigation/native';
import React, { useEffect, useState } from 'react';
import { Alert, FlatList, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { activateReservationSetting, fetchReservationsettings } from '../../fetches/ReservationSettingFetch';

export default function ReservationSettings() {
    const [settings, setSettings] = useState([]);
    const navigation = useNavigation();
    const isFocused = useIsFocused();

    useEffect(() => {
        if (isFocused) {
            fetchReservationsettings()
                .then(data => setSettings(data))
                .catch(err => console.error(err));
        }
    }, [isFocused]);

    const handlePressEdit = (item) => {
        navigation.navigate("Muokkaa asetusta", { id: item.id });
    };

    const handlePressDelete = async (item) => {
        // Implement your delete logic here
    };

    const reloadSettings = async () => {
        try {
            const data = await fetchReservationsettings();
            setSettings(data);
        } catch (error) {
            console.error(error);
            // Handle error
        }
    };

    const handlePressActivate = async (item) => {
        const { id, name, startTime, endTime } = item;

        Alert.alert(
            'Confirm Activation',
            `Are you sure you want to activate the reservation setting "${name}"?\n\nName: ${name}\nStart Time: ${startTime}\nEnd Time: ${endTime}`,
            [
                {
                    text: 'Cancel',
                    style: 'cancel',
                },
                {
                    text: 'OK',
                    onPress: async () => {
                        try {
                            const response = await activateReservationSetting(id);

                            if (response.success) {
                                // Reload settings after activation
                                await reloadSettings();
                                Alert.alert('Success', `Reservation setting "${name}" activated successfully`);
                            } else {
                                Alert.alert('Error', 'Failed to activate reservation setting');
                            }
                        } catch (error) {
                            console.error("Error activating reservation setting:", error);
                            Alert.alert('Error', 'Failed to activate reservation setting');
                        }
                    },
                },
            ],
            { cancelable: false }
        );
    };



    const renderItem = ({ item }) => (
        <View style={styles.settingContainer}>
            <Text>{`Name: ${item.name}`}</Text>
            <Text>{`Start Time: ${item.startTime}`}</Text>
            <Text>{`End Time: ${item.endTime}`}</Text>
            <Text>{`Active: ${item.isActive ? 'Yes' : 'No'}`}</Text>
            <View style={styles.buttonsContainer}>
                <TouchableOpacity style={styles.button} onPress={() => handlePressEdit(item.id)}><Text>Edit</Text></TouchableOpacity>
                <TouchableOpacity style={styles.button} onPress={() => handlePressDelete(item)}><Text>Delete</Text></TouchableOpacity>
                {!item.isActive && <TouchableOpacity style={[styles.button, styles.activateButton]} onPress={() => handlePressActivate(item)}><Text style={styles.activateButtonText}>Activate</Text></TouchableOpacity>}
            </View>
        </View>
    );


    return (
        <View style={styles.container}>
            <FlatList
                data={settings}
                renderItem={renderItem}
                keyExtractor={(item) => item.id.toString()}
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
    settingContainer: {
        borderWidth: 1,
        borderColor: 'gray',
        padding: 10,
        marginBottom: 10,
        width: 330,
    },
    buttonsContainer: {
        flexDirection: 'row',
        justifyContent: 'center',
        marginTop: 10,
    },
    button: {
        padding: 5,
        marginHorizontal: 10,
        backgroundColor: '#ccc',
    },
    activateButton: {
        backgroundColor: 'green',
    },
    activateButtonText: {
        color: 'white',
    },
});
