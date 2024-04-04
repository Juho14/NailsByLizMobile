import { useNavigation } from "@react-navigation/native";
import { useEffect, useState } from "react";
import { Alert, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { fetchSpecificNailService } from "../../fetches/NailServiceFetch";
import { deleteReservation, fetchSpecificReservation } from "../../fetches/ReservationFetch";


export default function ReservationDetails({ route }) {
    const [reservation, setReservation] = useState([]);
    const [nailService, setNailService] = useState([]);
    const navigation = useNavigation();

    const {
        reservationId,
        selectedNailServiceId,
        selectedTime,
        formattedDate,
    } = route.params;

    const startTime = new Date(reservation.startTime + 'Z');
    const endTime = new Date(reservation.endTime + 'Z');

    const formattedDateText = `${startTime.getDate()}.${startTime.getMonth() + 1}.${startTime.getFullYear()}`;
    const formattedStartTime = `${startTime.getHours()}:${startTime.getMinutes().toString().padStart(2, '0')}`;
    const formattedEndTime = `${endTime.getHours()}:${endTime.getMinutes().toString().padStart(2, '0')}`;

    const handlePressEdit = () => {
        navigation.navigate('Muokkaa varausta', {
            reservationId: reservation.id,
            selectedNailServiceId: selectedNailServiceId,
            selectedTime: selectedTime,
            formattedDate: formattedDate,
        });
    };

    const handlePressDelete = async (reservationId, reservation) => {
        const { formattedDate, formattedStartTime, formattedEndTime } = formatDateAndTime(reservation.startTime, reservation.endTime);
        Alert.alert(
            'Confirm Delete',
            `Are you sure you want to delete the reservation?\n\nType: ${reservation.nailService.type}\nDate: ${formattedDate}\nTime: ${formattedStartTime}-${formattedEndTime}\nName: ${reservation.fname} ${reservation.lname}\nPrice: ${reservation.price}`,
            [
                {
                    text: 'Cancel',
                    onPress: () => console.log('Cancel Pressed'),
                    style: 'cancel'
                },
                {
                    text: 'OK',
                    onPress: async () => {
                        try {
                            const response = await deleteReservation(reservationId);
                            if (response.success) {
                                navigation.reset({
                                    index: 0,
                                    routes: [{ name: 'Varaukset' }],
                                });
                                Alert.alert('Success', 'Reservation deleted successfully');
                            } else {
                                console.error("Error deleting reservation:", response);
                                Alert.alert('Error', 'Failed to delete reservation');
                            }
                        } catch (error) {
                            console.error(error);
                            Alert.alert('Error', 'Failed to delete reservation');
                        }
                    }
                }
            ],
            { cancelable: false }
        );
    };
    const formatDateAndTime = (startTime, endTime) => {
        const formattedStartTime = formatTime(startTime);
        const formattedEndTime = formatTime(endTime);
        const formattedDate = formatDate(startTime);
        return { formattedDate, formattedStartTime, formattedEndTime };
    };

    const formatTime = (time) => {
        const date = new Date(time + 'Z');
        return `${date.getHours()}:${date.getMinutes().toString().padStart(2, '0')}`;
    };

    const formatDate = (time) => {
        const date = new Date(time + 'Z');
        return `${date.getDate()}.${date.getMonth() + 1}.${date.getFullYear()}`;
    };

    useEffect(() => {
        fetchSpecificReservation(reservationId)
            .then(data => {
                console.log("Reservation Data:", data);
                setReservation(data);
            })
            .catch(error => {
                console.error('Error fetching reservation:', error);
            });
    }, [reservationId]);
    useEffect(() => {
        fetchSpecificNailService(selectedNailServiceId)
            .then(data => {
                setNailService(data);
            })
            .catch(error => {
                console.error('Error fetching nail service:', error);
            });
    }, [selectedNailServiceId]);

    return (
        <View style={styles.DetailView}>
            <View style={styles.itemContainer}>
                <Text style={styles.itemTitle}>Varauksen tunnus</Text>
                <Text style={styles.item}>{reservationId}</Text>
            </View>
            <View style={styles.itemContainer}>
                <Text style={styles.itemTitle}>Varaajan nimi</Text>
                <Text style={styles.item}>{reservation.fname} {reservation.lname}</Text>
            </View>
            <View style={styles.itemContainer}>
                <Text style={styles.itemTitle}>Varaajan sähköposti</Text>
                <Text style={styles.item}>{reservation.email}</Text>
            </View>
            <View style={styles.itemContainer}>
                <Text style={styles.itemTitle}>Varaajan puhelinnumero</Text>
                <Text style={styles.item}>{reservation.phone}</Text>
            </View>
            <View style={styles.itemContainer}>
                <Text style={styles.itemTitle}>Varaajan osoite</Text>
                <Text style={styles.item}>{reservation.address}, {reservation.city}, postinumero {reservation.postalcode}</Text>
            </View>
            <View style={styles.itemContainer}>
                <Text style={styles.itemTitle}>Varauksen aika</Text>
                <Text style={styles.item}>Päivämäärä: {formattedDateText}</Text>
                <Text style={styles.item}>Alkaa: {formattedStartTime}</Text>
                <Text style={styles.item}>Loppuu: {formattedEndTime}</Text>
            </View>
            <View style={styles.itemContainer}>
                <Text style={styles.itemTitle}>Varauksen hinta</Text>
                <Text style={styles.item}>{reservation.price}€</Text>
            </View>
            <View style={styles.itemContainer}>
                <Text style={styles.itemTitle}>Varauksen tila</Text>
                <Text style={styles.item}>{reservation.status}</Text>
            </View>
            <View style={styles.itemContainer}>
                <Text style={styles.itemTitle}>Kynsipalvelu </Text>
                <Text style={styles.item}>{nailService.type} - Palvelun nykyinen hinta: {nailService.price}€,  kesto {nailService.duration} min </Text>
            </View>
            <View style={styles.buttonsContainer}>
                <TouchableOpacity style={styles.button} onPress={handlePressEdit}><Text>Edit</Text></TouchableOpacity>
                <TouchableOpacity style={styles.button} onPress={() => handlePressDelete(reservation.id, reservation)}><Text>Delete</Text></TouchableOpacity>
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    DetailView: {
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
    itemContainer: {
        marginBottom: 15,
        justifyContent: 'center',
        textAlign: 'center'
    },
    itemTitle: {
        fontWeight: 'bold',
        marginBottom: 5,
    },
    item: {
        textAlign: 'center',
    },
    buttonsContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
    },
    button: {
        padding: 5,
        margin: 15,
        backgroundColor: '#ccc',
    },
});
