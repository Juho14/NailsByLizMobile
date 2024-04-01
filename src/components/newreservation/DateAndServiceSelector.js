import { useNavigation } from '@react-navigation/native';
import React, { useState } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import CustomDatePicker from './CustomDatePicker';
import NailServicePicker from './NailServicePicker';

export default function DateAndServiceSelector() {
    const [formattedDate, setFormattedDate] = useState(null);
    const [showNullDateMessage, setShowNullDateMessage] = useState(false);
    const [selectedNailService, setSelectedNailService] = useState(null);

    const navigation = useNavigation();

    const handleDate = (rawDate) => {
        const formatted = formatDate(rawDate);
        setFormattedDate(formatted);
    };

    const handleServiceChange = (nailService) => {
        setSelectedNailService(nailService);
    }

    const handleDialogOpen = () => {
        if (formattedDate && selectedNailService) {
            navigation.navigate('Valitse aika', { formattedDate: formattedDate, selectedNailService: selectedNailService });
        }
        else {
            setShowNullDateMessage(true);
        }
    };

    const formatDate = (date) => {
        if (!date) return '';
        const year = date.getFullYear();
        const month = String(date.getMonth() + 1).padStart(2, '0');
        const day = String(date.getDate()).padStart(2, '0');
        return `${year}-${month}-${day}`;
    };

    return (
        <View style={styles.container}>
            <View style={styles.pickerContainer}>
                <NailServicePicker
                    selectedNailService={selectedNailService}
                    onSelectNailService={handleServiceChange}
                />
            </View>
            <View style={styles.pickerContainer}>
                <CustomDatePicker onDateChange={handleDate} />
            </View>
            <View style={styles.buttonContainer}>
                <Text style={styles.button} onPress={handleDialogOpen}>Continue</Text>
            </View>
            <View>
                {showNullDateMessage && <Text style={styles.nullDateMessage}>Select a date and service</Text>}
                <Text>Formatted date: {formattedDate}</Text>
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        alignItems: 'center',
        justifyContent: 'center',
    },
    pickerContainer: {
        marginVertical: 10,
    },
    buttonContainer: {
        marginVertical: 20,
    },
    button: {
        paddingVertical: 10,
        paddingHorizontal: 20,
        backgroundColor: 'lightblue',
        borderRadius: 5,
    },
});
