import React, { useEffect, useState } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { fetchReservationsettings } from '../fetches/ReservationSettingFetch';

export default function ReservationSettings() {
    const [settings, setSettings] = useState([]);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const settingsData = await fetchReservationsettings();
                setSettings(settingsData);
            } catch (error) {
                console.error(error);
            } finally {
                setIsLoading(false);
            }
        };

        fetchData();
    }, []);

    if (isLoading) {
        return <Text>Loading...</Text>;
    }

    return (
        <View style={styles.container}>
            {settings.map((setting, index) => (
                <View key={index} style={styles.settingContainer}>
                    <Text>{`Name: ${setting.name}`}</Text>
                    <Text>{`Start Time: ${setting.startTime}`}</Text>
                    <Text>{`End Time: ${setting.endTime}`}</Text>
                    <Text>{`Active: ${setting.isActive ? 'Yes' : 'No'}`}</Text>
                </View>
            ))}
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
