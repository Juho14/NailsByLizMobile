import DateTimePicker from '@react-native-community/datetimepicker';
import { useNavigation } from '@react-navigation/native';
import React, { useState } from 'react';
import { Alert, Button, StyleSheet, Text, TextInput, View } from 'react-native';
import { TouchableOpacity } from 'react-native-gesture-handler';
import { saveReservationSetting } from '../../fetches/ReservationSettingFetch';

const AddReservationSetting = () => {
    const [name, setName] = useState('');
    const [startTime, setStartTime] = useState(new Date());
    const [endTime, setEndTime] = useState(new Date());
    const [isActive, setIsActive] = useState(false);
    const [showStartTimePicker, setShowStartTimePicker] = useState(false);
    const [showEndTimePicker, setShowEndTimePicker] = useState(false);
    const navigation = useNavigation();

    const adjustTimeForTimezone = (time) => {
        const date = new Date(time);
        const timezoneOffset = date.getTimezoneOffset() * 60000;
        const localTime = new Date(date.getTime() + timezoneOffset);
        return localTime;
    };

    const handleSaveReservationSetting = async () => {
        const adjustedStartTime = adjustTimeForTimezone(startTime);
        const adjustedEndTime = adjustTimeForTimezone(endTime);

        const reservationSetting = {
            name,
            startTime: formatTime(adjustedStartTime),
            endTime: formatTime(adjustedEndTime),
            isActive,
        };

        try {
            const response = await saveReservationSetting(reservationSetting);
            if (response.success) {
                Alert.alert('Success', 'Reservation setting added successfully.');
                setName("");
                setStartTime(new Date());
                setEndTime(new Date());
                navigation.navigate('Lista asetuksista');
            } else {
                throw new Error('Failed to add reservation setting.');
            }
        } catch (error) {
            console.error('Error adding reservation setting:', error);
            Alert.alert('Error', error.message || 'Failed to add reservation setting.');
        }
    };

    // Function to format time to HH:mm:ss
    const formatTime = (time) => {
        const hours = time.getHours().toString().padStart(2, '0');
        const minutes = time.getMinutes().toString().padStart(2, '0');
        const seconds = time.getSeconds().toString().padStart(2, '0');
        return `${hours}:${minutes}:${seconds}`;
    };

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

    const startTimeString = startTime.toTimeString();
    const endTimeString = endTime.toTimeString();

    return (
        <View style={styles.container}>
            <Text style={styles.label}>Name:</Text>
            <TextInput
                style={styles.input}
                value={name}
                onChangeText={setName}
                placeholder="Enter name"
            />

            <View style={styles.buttonsContainer}>
                <Text style={styles.label}>Start Time:</Text>
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
                <Text style={styles.label}>End Time:</Text>
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

            <Button title="Save" onPress={handleSaveReservationSetting} />
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

export default AddReservationSetting;
