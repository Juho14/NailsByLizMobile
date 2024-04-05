import DateTimePicker from '@react-native-community/datetimepicker';
import { useEffect, useState } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';

export default function CustomDatePicker({ onDateChange }) {
    const [date, setDate] = useState(new Date());
    const [show, setShow] = useState(false);

    useEffect(() => {
        const currentDate = new Date();
        setDate(currentDate);
        onDateChange(currentDate);
    }, []);

    const onChange = (event, selectedValue) => {
        setShow(false);
        setDate(selectedValue);
        onDateChange(selectedValue);
    };

    const showDatepicker = () => {
        setShow(true);
    };

    const dateString = date.toLocaleDateString();

    return (
        <View style={styles.container}>
            <View style={styles.dateContainer}>
                <Text style={styles.dateText}>Valittu päivämäärä: {dateString}</Text>
            </View>
            <Pressable style={styles.button} onPress={showDatepicker}>
                <Text style={styles.buttonText}>Valitse päivä</Text>
            </Pressable>

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
    dateContainer: {
        backgroundColor: '#D4F0F0',
        padding: 10,
        borderRadius: 5,
        marginBottom: 10,
        borderWidth: 3,
        borderColor: '#8FCACA'
    },
    dateText: {
        fontWeight: 'bold',
        fontSize: 16,
    },
    button: {
        marginTop: 10,
        padding: 10,
        backgroundColor: '#D4F0F0',
        borderColor: '#8FCACA',
        borderWidth: 3,
        borderRadius: 5,
    },
    buttonText: {
        textAlign: 'center',
        color: 'black',
        fontSize: 16,
    },
});
