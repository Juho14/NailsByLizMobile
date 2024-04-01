import DateTimePicker from '@react-native-community/datetimepicker';
import React, { useState } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';

export default function CustomDatePicker({ onDateChange }) {
    const [date, setDate] = useState(new Date());
    const [show, setShow] = useState(false);

    const onChange = (event, selectedValue) => {
        setShow(false);
        setDate(selectedValue);
        onDateChange(selectedValue);
    };

    const showDatepicker = () => {
        setShow(true);
    };

    return (
        <View style={styles.container}>
            <Pressable style={styles.button} onPress={showDatepicker}>
                <Text style={styles.buttonText}>Open Calendar</Text>
            </Pressable>
            <Text>Selected: {date.toDateString()}</Text>

            {show && (
                <DateTimePicker
                    testID="dateTimePicker"
                    value={date}
                    mode={'date'}
                    is24Hour={true}
                    onChange={onChange}
                />
            )}
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        alignItems: 'center',
        justifyContent: 'center',
        padding: 20,
    },
    button: {
        marginTop: 10,
        padding: 10,
        backgroundColor: 'lightblue',
        borderRadius: 5,
    },
    buttonText: {
        textAlign: 'center',
        color: 'black',
        fontSize: 16,
    },
});
