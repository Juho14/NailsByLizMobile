import { useNavigation } from '@react-navigation/native';
import React, { useState } from 'react';
import { Alert, Modal, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { saveReservation } from '../../fetches/ReservationFetch';

const ReservationDialog = ({ route }) => {
    const navigation = useNavigation();

    const {
        formattedDate,
        selectedTime,
        selectedNailService,
    } = route.params;


    const [fname, setFname] = useState('');
    const [lname, setLname] = useState('');
    const [email, setEmail] = useState('');
    const [phone, setPhone] = useState('');
    const [address, setAddress] = useState('');
    const [city, setCity] = useState('');
    const [postalcode, setPostalCode] = useState('');

    const [isVisible, setIsVisible] = useState(true);

    // Function to handle saving the reservation
    const handleSaveReservation = () => {

        // Format a DateTime string YYYY-MM-DDTHH-MM
        const timeString = selectedTime.split(' ')[0];
        const reservationDateString = `${formattedDate}T${timeString}`;
        console.log("reservationDateString:", reservationDateString);
        // Change to ISO for the backend
        const startTime = new Date(reservationDateString).toISOString();
        const reservation = {
            startTime,
            endTime: '',
            nailService: {
                id: selectedNailService.id,
                type: selectedNailService.type,
                duration: selectedNailService.duration,
                price: selectedNailService.price,
                adminService: selectedNailService.adminService,
            },
            fname,
            lname,
            email,
            phone,
            address,
            city,
            postalcode,
            status: "OK" // Default value is OK
        };

        saveReservation(reservation)
            .then(response => {
                console.log("Reservation saved successfully:", response);
                setIsVisible(false);
                navigation.navigate('Kotisivu');
                Alert.alert('Success', 'Reservation saved successfully.');
            })
            .catch(error => {
                console.error("Error saving reservation:", error);
                Alert.alert('Error', 'Failed to save reservation.');
            });
    };

    return (
        <Modal
            animationType="slide"
            transparent={true}
            visible={isVisible}
            onRequestClose={() => {
            }}
        >
            <View style={styles.centeredView}>
                <View style={styles.modalView}>
                    <Text style={styles.modalText}>Selected Time: {selectedTime}</Text>
                    <Text style={styles.modalText}>Selected Date: {formattedDate}</Text>
                    <Text style={styles.modalText}>Selected Service: {selectedNailService.type}</Text>
                    <TextInput
                        style={styles.input}
                        placeholder="Etunimi"
                        value={fname}
                        onChangeText={setFname}
                    />
                    <TextInput
                        style={styles.input}
                        placeholder="Sukunimi"
                        value={lname}
                        onChangeText={setLname}
                    />
                    <TextInput
                        style={styles.input}
                        placeholder="Email"
                        value={email}
                        onChangeText={setEmail}
                    />
                    <TextInput
                        style={styles.input}
                        placeholder="Phone"
                        value={phone}
                        onChangeText={setPhone}
                    />
                    <TextInput
                        style={styles.input}
                        placeholder="Address"
                        value={address}
                        onChangeText={setAddress}
                    />
                    <TextInput
                        style={styles.input}
                        placeholder="City"
                        value={city}
                        onChangeText={setCity}
                    />
                    <TextInput
                        style={styles.input}
                        placeholder="Postal Code"
                        value={postalcode}
                        onChangeText={setPostalCode}
                    />
                    <TouchableOpacity onPress={handleSaveReservation} style={styles.saveButton}>
                        <Text style={styles.saveButtonText}>Save Reservation</Text>
                    </TouchableOpacity>
                    <TouchableOpacity onPress={() => {
                        // Close the modal
                        setIsVisible(false);
                    }} style={styles.closeButton}>
                        <Text style={styles.closeButtonText}>Close</Text>
                    </TouchableOpacity>
                </View>
            </View>
        </Modal>
    );
};

const styles = StyleSheet.create({
    centeredView: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
    },
    modalView: {
        backgroundColor: 'white',
        borderRadius: 20,
        padding: 35,
        alignItems: 'center',
        shadowColor: '#000',
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: 0.25,
        shadowRadius: 4,
        elevation: 5,
    },
    modalText: {
        marginBottom: 15,
        textAlign: 'center',
    },
    input: {
        height: 40,
        width: '100%',
        borderColor: 'gray',
        borderWidth: 1,
        marginBottom: 10,
        paddingHorizontal: 10,
    },
    saveButton: {
        marginTop: 10,
        backgroundColor: 'green',
        borderRadius: 20,
        padding: 10,
    },
    saveButtonText: {
        color: 'white',
        fontWeight: 'bold',
        textAlign: 'center',
    },
    closeButton: {
        marginTop: 10,
        backgroundColor: '#2196F3',
        borderRadius: 20,
        padding: 10,
    },
    closeButtonText: {
        color: 'white',
        fontWeight: 'bold',
        textAlign: 'center',
    },
});

export default ReservationDialog;