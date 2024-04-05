import { useIsFocused, useNavigation } from '@react-navigation/native';
import React, { useCallback, useEffect, useState } from 'react';
import { ActivityIndicator, Alert, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { fetchSpecificNailService } from '../../../fetches/NailServiceFetch';
import { fetchSpecificReservation, updateReservation } from '../../../fetches/ReservationFetch';


const EditReservationDialog = ({ route }) => {
    const navigation = useNavigation();
    const isFocused = useIsFocused();

    const [isLoading, setIsLoading] = useState(false);
    const [reservation, setReservation] = useState({});
    const [selectedNailService, setSelectedNailService] = useState(null);
    const [price, setPrice] = useState("");

    const {
        reservationId,
        selectedNailServiceId,
        selectedTime,
        formattedDate,
    } = route.params;

    useEffect(() => {
        fetchData();
    }, [fetchData]);

    const fetchData = useCallback(async () => {
        try {
            const reservationData = await fetchSpecificReservation(reservationId);
            setReservation(reservationData);
            setPrice(reservationData.price.toString())
            const nailServiceData = await fetchSpecificNailService(selectedNailServiceId);
            setSelectedNailService(nailServiceData);
        } catch (error) {
            console.error(error);
        } finally {
            setIsLoading(false);
        }
    }, [reservationId, selectedNailServiceId]);


    useEffect(() => {
        fetchData();
    }, [fetchData]);

    useEffect(() => {
        const unsubscribe = navigation.addListener('focus', () => {
            fetchData();
        });

        return unsubscribe;
    }, [navigation, fetchData]);


    const formatDate = (selectedTime) => {
        const timeString = selectedTime.split(' ')[0];
        const reservationDateString = `${formattedDate}T${timeString}`;
        return new Date(reservationDateString).toISOString();
    }

    const handlePickerComponents = () => {
        navigation.navigate('Valitse palvelu ja päivä', { reservationId: reservationId, isFromEdit: true });
    };

    const handleSaveReservation = async () => {
        try {
            setIsLoading(true);

            const updatedNailService = await fetchSpecificNailService(selectedNailServiceId);
            const updatedReservation = {
                reservationId,
                startTime: formatDate(selectedTime),
                endTime: '',
                price: parseFloat(price),
                nailService: {
                    id: updatedNailService.id,
                    type: updatedNailService.type,
                    duration: updatedNailService.duration,
                    adminService: updatedNailService.adminService,
                },
                fname: reservation.fname,
                lname: reservation.lname,
                email: reservation.email,
                phone: reservation.phone,
                address: reservation.address,
                city: reservation.city,
                postalcode: reservation.postalcode,
                status: reservation.status,
            };

            console.log("Newly fetched service ", updatedNailService);

            const response = await updateReservation(updatedReservation, reservationId);
            if (response.success) {
                navigation.reset({
                    index: 0,
                    routes: [{ name: 'Varaukset' }],
                });
                Alert.alert('Success', 'Reservation saved successfully.');
            } else {
                console.error("Failed to save reservation:", response);
                Alert.alert('Error', 'Failed to save reservation.');
            }
        } catch (error) {
            console.error("Error updating reservation:", error);
            Alert.alert('Error', 'Failed to save reservation.');
        } finally {
            setIsLoading(false);
        }
    };

    const startTime = new Date(reservation.startTime + 'Z');
    const endTime = new Date(reservation.endTime + 'Z');

    const formattedDateText = `${startTime.getDate()}.${startTime.getMonth() + 1}.${startTime.getFullYear()}`;
    const formattedStartTime = `${startTime.getHours()}:${startTime.getMinutes().toString().padStart(2, '0')}`;
    const formattedEndTime = `${endTime.getHours()}:${endTime.getMinutes().toString().padStart(2, '0')}`;

    return (
        <View style={styles.centeredView}>
            <View style={styles.modalView}>
                <Text style={styles.modalText}>Selected Time: {formattedStartTime} - {formattedEndTime}</Text>
                <Text style={styles.modalText}>Selected Date: {formattedDateText}</Text>
                <Text style={styles.modalText}>Selected Service: {selectedNailService?.type}</Text>
                <TouchableOpacity onPress={handlePickerComponents} style={styles.closeButton}>
                    <Text style={styles.saveButtonText}>Change date and service</Text>
                </TouchableOpacity>
                <TextInput style={styles.input} placeholder="Etunimi" value={reservation.fname} onChangeText={value => setReservation(prevState => ({ ...prevState, fname: value }))} />
                <TextInput style={styles.input} placeholder="Sukunimi" value={reservation.lname} onChangeText={value => setReservation(prevState => ({ ...prevState, lname: value }))} />
                <TextInput style={styles.input} placeholder="Email" value={reservation.email} onChangeText={value => setReservation(prevState => ({ ...prevState, email: value }))} />
                <TextInput style={styles.input} placeholder="Phone" value={reservation.phone} onChangeText={value => setReservation(prevState => ({ ...prevState, phone: value }))} />
                <TextInput style={styles.input} placeholder="Address" value={reservation.address} onChangeText={value => setReservation(prevState => ({ ...prevState, address: value }))} />
                <TextInput style={styles.input} placeholder="City" value={reservation.city} onChangeText={value => setReservation(prevState => ({ ...prevState, city: value }))} />
                <TextInput style={styles.input} placeholder="Postal Code" value={reservation.postalcode} onChangeText={value => setReservation(prevState => ({ ...prevState, postalcode: value }))} />
                <TextInput style={styles.input} placeholder="Price" value={price} onChangeText={(value) => setPrice(value)} />
                <TextInput style={styles.input} placeholder="Status" value={reservation.status} onChangeText={value => setReservation(prevState => ({ ...prevState, status: value }))} />
                <TouchableOpacity onPress={handleSaveReservation} style={styles.saveButton} disabled={isLoading}>
                    {isLoading ? (
                        <ActivityIndicator color="white" />
                    ) : (
                        <Text style={styles.saveButtonText}>Save changes</Text>
                    )}
                </TouchableOpacity>
                <TouchableOpacity onPress={() => navigation.reset({ index: 0, routes: [{ name: 'Varaukset' }] })} style={styles.closeButton}>
                    <Text style={styles.closeButtonText}>Back</Text>
                </TouchableOpacity>
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    centeredView: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    modalView: {
        backgroundColor: 'white',
        borderRadius: 20,
        padding: 20,
        alignItems: 'center',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.25,
        shadowRadius: 4,
        elevation: 1,
        width: '100%',
    },
    modalText: {
        marginBottom: 5,
        textAlign: 'center',
    },
    input: {
        height: 30,
        width: '100%',
        borderColor: 'gray',
        borderWidth: 1,
        marginBottom: 10,
        paddingHorizontal: 10,
    },
    saveButton: {
        margin: 10,
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
        margin: 10,
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

export default EditReservationDialog;