import { useIsFocused, useNavigation } from '@react-navigation/native';
import React, { useEffect, useState } from 'react';
import { Alert, FlatList, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { activateReservationSetting, deleteReservationSetting, fetchReservationsettings } from '../../fetches/ReservationSettingFetch';

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
        const { name, startTime, endTime } = item;
        Alert.alert(
            'Vahvista poisto',
            `Haluatko varmasti poistaa asetuksen "${name}"?\n \n Aukioloajat: ${startTime} - ${endTime}`,
            [
                {
                    text: 'Peruuta',
                    style: 'cancel',
                },
                {
                    text: 'Poista',
                    onPress: async () => {
                        try {
                            const response = await deleteReservationSetting(item.id);
                            if (response.success) {
                                // Reload settings after deletion
                                await reloadSettings();
                                Alert.alert('Poisto onnistui', `Asetus "${name}" on poistettu.`);
                            } else {
                                Alert.alert('Poistaminen epäonnistui.');
                            }
                        } catch (error) {
                            console.error("Error deleting reservation setting:", error);
                            Alert.alert('Poistaminen epäonnistui.');
                        }
                    },
                },
            ],
            { cancelable: false }
        );
    };

    const reloadSettings = async () => {
        try {
            const data = await fetchReservationsettings();
            setSettings(data);
        } catch (error) {
            console.error(error);
            Alert.alert('Lataus epäonnistui');
            navigation.reset({
                index: 0,
                routes: [{ name: 'Lista asetuksista' }],
            });
        }
    };

    const handlePressActivate = async (item) => {
        const { id, name, startTime, endTime } = item;

        Alert.alert(
            'Vahvista aktivointi',
            `Haluatko varmasti aktivoida asetuksen "${name}"?\n \n Aukioloajat: ${startTime} - ${endTime}`,
            [
                {
                    text: 'Peruuta',
                    style: 'cancel',
                },
                {
                    text: 'Aktivoi',
                    onPress: async () => {
                        try {
                            const response = await activateReservationSetting(id);

                            if (response.success) {
                                // Reload settings after activation
                                await reloadSettings();
                                Alert.alert('Aktivointi onnistui!', `Asetus "${name}" on aktivoitu.`);
                            } else {
                                Alert.alert('Aktivointi epäonnistui.');
                            }
                        } catch (error) {
                            console.error("Error activating reservation setting:", error);
                            Alert.alert('Aktivointi epäonnistui.');
                        }
                    },
                },
            ],
            { cancelable: false }
        );
    };

    const formatTimeToString = (time) => {
        const parts = time.split(":");
        const settingHours = parseInt(parts[0], 10);
        const settingMinutes = parseInt(parts[1], 10);

        // Create a new Date object
        const date = new Date();
        date.setHours(settingHours, settingMinutes, 0);
        const timezoneOffset = date.getTimezoneOffset();
        const adjustedHours = date.getHours() - Math.floor(timezoneOffset / 60);
        const adjustedMinutes = date.getMinutes() + timezoneOffset % 60;
        const hours = adjustedHours.toString().padStart(2, '0');
        const minutes = adjustedMinutes.toString().padStart(2, '0');
        return `${hours}:${minutes}`;
    };

    const renderItem = ({ item }) => {
        // Adjust times from assumed UTC to local
        const localStartTime = formatTimeToString(item.startTime);
        const localEndTime = formatTimeToString(item.endTime);

        return (
            <View style={styles.settingContainer}>
                <Text>{`Nimi: ${item.name}`}</Text>
                <Text>{`Aukioloajat: ${localStartTime} - ${localEndTime}`}</Text>
                <Text style={[styles.activeText, item.isActive && styles.active]}>{item.isActive ? 'AKTIIVINEN' : ''}</Text>
                {!item.isActive && (
                    <View style={styles.buttonsContainer}>
                        <TouchableOpacity style={styles.button} onPress={() => handlePressEdit(item)}><Text>Muokkaa</Text></TouchableOpacity>
                        <TouchableOpacity style={styles.button} onPress={() => handlePressDelete(item)}><Text>Poista</Text></TouchableOpacity>
                        <TouchableOpacity style={[styles.button, styles.activateButton]} onPress={() => handlePressActivate(item)}><Text style={styles.activateButtonText}>Aktivoi</Text></TouchableOpacity>
                    </View>
                )}
            </View>
        );
    };


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
    activeText: {
        fontWeight: 'bold',
    },
    active: {
        color: 'green',
    },
});