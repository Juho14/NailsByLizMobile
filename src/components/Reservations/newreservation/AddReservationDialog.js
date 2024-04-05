import { useNavigation } from '@react-navigation/native';
import React, { useState } from 'react';
import { Alert, Modal, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { saveReservation } from '../../../fetches/ReservationFetch';
const AddReservationDialog = ({ route }) => {
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

    const handleSaveReservation = () => {
        // Format a DateTime string YYYY-MM-DDTHH-MM
        const timeString = selectedTime.split(' ')[0];
        const reservationDateString = `${formattedDate}T${timeString}`;
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

        Alert.alert(
            'Vahvista varaus',
            `Etunimi: ${fname}\n
Sukunimi: ${lname}\n
Varauksen aika: ${selectedTime}\n
Palvelu: ${selectedNailService.type}\n
Hinta: ${selectedNailService.price}€\n
Email: ${email}\n
Puhelin: ${phone}\n
Osoite: ${address}\n
Kaupunki: ${city}\n
Postinumero: ${postalcode}\n\n
Ilmoitathan varauksen muutoksista vähintään 24h ennen sovittua ajankohtaa!
`,
            [
                {
                    text: 'Peruuta',
                    onPress: () => console.log('Cancel Pressed'),
                    style: 'cancel'
                },
                {
                    text: 'Vahvista',
                    onPress: () => {
                        // Save the reservation
                        saveReservation(reservation)
                            .then(response => {
                                if (response.success) {
                                    console.log("Reservation saved successfully:", response);
                                    setIsVisible(false);
                                    navigation.reset({
                                        index: 0,
                                        routes: [{ name: 'Varaukset' }],
                                    });
                                    Alert.alert('Success', 'Reservation saved successfully.');
                                } else {
                                    console.error("Failed to save reservation:", response);
                                    Alert.alert('Error', 'Failed to save reservation.');
                                }
                            })
                            .catch(error => {
                                console.error("Error saving reservation:", error);
                                Alert.alert('Error', 'Failed to save reservation.');
                            });
                    }
                },
                {
                    text: 'Varauksen ehdot',
                    onPress: () => {
                        // Show the terms and conditions alert
                        Alert.alert(
                            'Varauksen ehdot',
                            `Saavu paikalle vasta sovittuna aikana, minulla ei ole erillistä odotustilaa. \n\nMuutoksista tulee ilmoittaa vähintään 24h ennen sovittua varausta. Muutoin joudun perimään 50% palvelun hinnasta.
                            \n\nJos jätät tulematta ilmoittamatta, joudun perimään täyden palvelun hinnan.
                            `,
                            [
                                {
                                    text: 'Sulje',
                                    onPress: () => handleSaveReservation()
                                }
                            ]
                        );
                    }
                }
            ]
        );
    };

    const handleClose = () => {
        Alert.alert(
            'Haluatko varmasti perua?',
            'Tietoja ei ole tallennettu',
            [
                {
                    text: 'Peruuta',
                    onPress: () => console.log('Cancel Pressed'),
                    style: 'cancel'
                },
                {
                    text: 'Kyllä',
                    onPress: () => {
                        setIsVisible(false);
                        navigation.goBack();
                    }
                }
            ]
        );
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
                    <Text style={styles.modalText}>Valittu aika: {selectedTime}</Text>
                    <Text style={styles.modalText}>Varauksen päivämäärä: {formattedDate}</Text>
                    <Text style={styles.modalText}>Valittu palvelu: {selectedNailService.type}</Text>
                    <Text style={styles.modalText}>Hinta: {selectedNailService.price}€</Text>
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
                        <Text style={styles.saveButtonText}>Tallenna varaus</Text>
                    </TouchableOpacity>
                    <TouchableOpacity onPress={() => {
                        handleClose();
                    }} style={styles.closeButton}>
                        <Text style={styles.closeButtonText}>Peruuta</Text>
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

export default AddReservationDialog;