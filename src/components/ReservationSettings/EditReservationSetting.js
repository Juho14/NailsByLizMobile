import DateTimePicker from '@react-native-community/datetimepicker';
import { useNavigation } from '@react-navigation/native';
import React, { useEffect, useState } from 'react';
import { Alert, Button, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { fetchSpecificReservationsetting, updateReservationSetting } from '../../fetches/ReservationSettingFetch';

const EditReservationSetting = ({ route }) => {
    const { id } = route.params;
    const navigation = useNavigation();

    const [name, setName] = useState('');
    const [startTime, setStartTime] = useState(new Date());
    const [endTime, setEndTime] = useState(new Date);
    const [isActive, setIsActive] = useState(false);
    const [showStartTimePicker, setShowStartTimePicker] = useState(false);
    const [showEndTimePicker, setShowEndTimePicker] = useState(false);
    const [originalStartTime, setOriginalStartTime] = useState("");
    const [originalEndTime, setOriginalEndTime] = useState("");

    const adjustTimeForTimezone = (time) => {
        const date = new Date(time);
        const timezoneOffset = date.getTimezoneOffset() * 60000;
        const localTime = new Date(date.getTime() + timezoneOffset);
        return localTime;
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

    useEffect(() => {
        fetchSpecificReservationsetting(id)
            .then(data => {
                setName(data.name)
                setOriginalStartTime(data.startTime);
                setOriginalEndTime(data.endTime);
            })
            .catch(error => {
                console.error('Error fetching nail service:', error);
                setFetchingError(error.message);
            });
    }, [id]);

    const handleSaveReservationSetting = async () => {
        const adjustedStartTime = adjustTimeForTimezone(startTime);
        const adjustedEndTime = adjustTimeForTimezone(endTime);

        const updatedReservationSetting = {
            name,
            startTime: formatTime(adjustedStartTime),
            endTime: formatTime(adjustedEndTime),
            isActive,
        };

        try {
            const response = await updateReservationSetting(updatedReservationSetting, id);
            if (response.success) {
                console.log('Reservation setting updated successfully:', response);
                Alert.alert('Success', 'Reservation setting updated successfully.');
                navigation.reset({
                    index: 0,
                    routes: [{ name: 'Lista asetuksista' }],
                });
            } else {
                throw new Error('Failed to update reservation setting.');
            }
        } catch (error) {
            console.error('Error updating reservation setting:', error);
            Alert.alert('Error', error.message || 'Failed to update reservation setting.');
        }
    };


    const formatTime = (time) => {
        const hours = time.getHours().toString().padStart(2, '0');
        const minutes = time.getMinutes().toString().padStart(2, '0');
        const seconds = time.getSeconds().toString().padStart(2, '0');
        return `${hours}:${minutes}:${seconds}`;
    };

    const startString = formatTimeToString(originalStartTime);
    const endString = formatTimeToString(originalEndTime);


    const startTimeString = startTime.toTimeString();
    const endTimeString = endTime.toTimeString();



    const onChangeStartTime = (event, selectedTime) => {
        const currentTime = selectedTime || startTime;
        setShowStartTimePicker(false);
        setStartTime(currentTime);
    };

    const onChangeEndTime = (event, selectedTime) => {
        const currentTime = selectedTime || endTime;
        setShowEndTimePicker(false);
        setEndTime(currentTime);
    };

    return (
        <View style={styles.container}>
            <Text style={styles.label}>Nimi:</Text>
            <TextInput
                style={styles.input}
                value={name}
                onChangeText={setName}
                placeholder="Syötä nimi"
            />

            <View style={styles.buttonsContainer}>
                <Text style={styles.label}>Alkuperäinen aloitusaika: {startString}</Text>
                <TouchableOpacity style={styles.button} onPress={() => setShowStartTimePicker(true)}>
                    <Text>{startTimeString}</Text>
                </TouchableOpacity>
                {showStartTimePicker && (
                    <DateTimePicker
                        testID="startTimePicker"
                        value={startTime}
                        mode="time"
                        is24Hour={true}
                        display="spinner"
                        onChange={onChangeStartTime}
                    />
                )}
            </View>

            <View style={styles.buttonsContainer}>
                <Text style={styles.label}>Alkuperäinen lopetusaika: {endString}</Text>
                <TouchableOpacity style={styles.button} onPress={() => setShowEndTimePicker(true)}>
                    <Text>{endTimeString}</Text>
                </TouchableOpacity>
                {showEndTimePicker && (
                    <DateTimePicker
                        testID="endTimePicker"
                        value={endTime}
                        mode="time"
                        is24Hour={true}
                        display="spinner"
                        onChange={onChangeEndTime}
                    />
                )}
            </View>

            <Button title="Tallenna muutokset" onPress={handleSaveReservationSetting} />
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 20,
    },
    label: {
        fontWeight: 'bold',
        marginBottom: 5,
    },
    input: {
        height: 40,
        borderColor: 'gray',
        borderWidth: 1,
        marginBottom: 15,
        paddingHorizontal: 10,
    },
    buttonsContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        marginBottom: 15,
    },
    button: {
        backgroundColor: '#ccc',
        padding: 10,
        borderRadius: 5,
    },
});

export default EditReservationSetting;