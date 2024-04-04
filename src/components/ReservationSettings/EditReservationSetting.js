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
    const [endTime, setEndTime] = useState(new Date());
    const [isActive, setIsActive] = useState(false);
    const [showStartTimePicker, setShowStartTimePicker] = useState(false);
    const [showEndTimePicker, setShowEndTimePicker] = useState(false);

    useEffect(() => {
        const fetchReservationSetting = async () => {
            try {
                const setting = await fetchSpecificReservationsetting(id);
                setName(setting.name);
                setStartTime(new Date(setting.startTime));
                setEndTime(new Date(setting.endTime));
                setIsActive(setting.isActive);
            } catch (error) {
                console.error('Error fetching reservation setting:', error);
                Alert.alert('Error', 'Failed to fetch reservation setting.');
            }
        };

        fetchReservationSetting();
    }, [id]);

    const handleSaveReservationSetting = async () => {
        const reservationSetting = {
            id,
            name,
            startTime: startTime.toISOString(),
            endTime: endTime.toISOString(),
            isActive,
        };

        try {
            const response = await updateReservationSetting(reservationSetting, id);
            if (response.success) {
                console.log('Reservation setting updated successfully:', response);
                Alert.alert('Success', 'Reservation setting updated successfully.');
                navigation.navigate('Lista varauksista');
            } else {
                throw new Error('Failed to update reservation setting.');
            }
        } catch (error) {
            console.error('Error updating reservation setting:', error);
            Alert.alert('Error', error.message || 'Failed to update reservation setting.');
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

    const startTimeString = startTime.toTimeString().substring(0, 5);
    const endTimeString = endTime.toTimeString().substring(0, 5);

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

export default EditReservationSetting;