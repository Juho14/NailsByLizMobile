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

    const handleSaveReservationSetting = async () => {
        const reservationSetting = {
            name,
            startTime: startTime.toISOString().substring(11, 8), // Extract the time part (HH:MM:SS) from the ISO string
            endTime: endTime.toISOString().substring(11, 8), // Adjust the format to match the backend
            isActive,
        };

        try {
            const response = await saveReservationSetting(reservationSetting);
            if (response.success) {
                Alert.alert('Success', 'Reservation setting added successfully.');
                navigation.navigate('Varaukset');
            } else {
                throw new Error('Failed to add reservation setting.');
            }
        } catch (error) {
            console.error('Error adding reservation setting:', error);
            Alert.alert('Error', error.message || 'Failed to add reservation setting.');
        }
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
    checkboxContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 15,
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
