import { useIsFocused, useNavigation } from '@react-navigation/native';
import React, { useCallback, useEffect, useState } from 'react';
import { Alert, FlatList, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { deleteReservation, fetchReservations } from '../../fetches/ReservationFetch';

export default function Reservations() {
    const [reservations, setReservations] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const navigation = useNavigation();
    const isFocused = useIsFocused();

    const fetchReservationData = useCallback(async () => {
        try {
            const reservationData = await fetchReservations();
            // Sort the reservation data by startTime
            const sortedData = reservationData.sort((a, b) => new Date(a.startTime) - new Date(b.startTime));
            setReservations(sortedData);
        } catch (error) {
            console.error(error);
        } finally {
            setIsLoading(false);
        }
    }, []);

    const handlePressDelete = async (reservationId, reservation) => {
        const { formattedDate, formattedStartTime, formattedEndTime } = formatDateAndTime(reservation.startTime, reservation.endTime);
        Alert.alert(
            'Vahvista poisto',
            `Haluatko varmasti poistaa varauksen?\n\nPalvelu: ${reservation.nailService.type}\nPvm: ${formattedDate}\nAika: ${formattedStartTime}-${formattedEndTime}\nNimi: ${reservation.fname} ${reservation.lname}\nHinta: ${reservation.price}€`,
            [
                {
                    text: 'Peruuta',
                    onPress: () => console.log('Cancel Pressed'),
                    style: 'cancel'
                },
                {
                    text: 'Poista',
                    onPress: async () => {
                        try {
                            const response = await deleteReservation(reservationId);
                            if (response.success) {
                                setReservations(prevReservations => prevReservations.filter(res => res.id !== reservationId));
                                Alert.alert('Poisto onnistui');
                            } else {
                                console.error("Error deleting reservation:", response);
                                Alert.alert('Poisto epäonnistui');
                            }
                        } catch (error) {
                            console.error(error);
                            Alert.alert('Poisto epäonnistui');
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

    const formatTimeToString = (time) => {
        const date = new Date(time);
        const timezoneOffset = date.getTimezoneOffset();
        const adjustedHours = date.getHours() - Math.floor(timezoneOffset / 60);
        const adjustedMinutes = date.getMinutes() + timezoneOffset % 60;
        const hours = adjustedHours.toString().padStart(2, '0');
        const minutes = adjustedMinutes.toString().padStart(2, '0');
        const seconds = date.getSeconds().toString().padStart(2, '0');
        const offsetSign = timezoneOffset < 0 ? '+' : '-';
        const offsetHours = Math.abs(Math.floor(timezoneOffset / 60)).toString().padStart(2, '0');
        const offsetMinutes = Math.abs(timezoneOffset % 60).toString().padStart(2, '0');
        const offsetString = `${offsetSign}${offsetHours}${offsetMinutes}`;

        return `${hours}:${minutes}:${seconds} GMT${offsetString}`;
    };

    useEffect(() => {
        fetchReservationData();
    }, [fetchReservationData, isFocused]);

    const renderReservationItem = ({ item }) => {
        const { formattedDate, formattedStartTime, formattedEndTime } = formatDateAndTime(item.startTime, item.endTime);


        const handlePressDetails = () => {
            const formatDateForBackend = (timeString) => {
                const date = new Date(timeString);
                const year = date.getFullYear();
                const month = String(date.getMonth() + 1).padStart(2, '0');
                const day = String(date.getDate()).padStart(2, '0');
                return `${year}-${month}-${day}`;
            };

            const formattedDate = formatDateForBackend(item.startTime);
            navigation.navigate('Varauksen lisätiedot', {
                reservationId: item.id,
                selectedNailServiceId: item.nailService.id,
                selectedTime: formatTimeToString(item.startTime),
                formattedDate: formattedDate,
            });
        };

        const handlePressEdit = () => {
            const formatDateForBackend = (timeString) => {
                const date = new Date(timeString);
                const year = date.getFullYear();
                const month = String(date.getMonth() + 1).padStart(2, '0');
                const day = String(date.getDate()).padStart(2, '0');
                return `${year}-${month}-${day}`;
            };

            const formattedDate = formatDateForBackend(item.startTime);
            navigation.navigate('Muokkaa varausta', {
                reservationId: item.id,
                selectedNailServiceId: item.nailService.id,
                selectedTime: formatTimeToString(item.startTime),
                formattedDate: formattedDate,
            });
        };

        return (
            <View style={styles.itemContainer}>
                <View style={styles.itemDetails}>
                    <Text>{`${item.nailService.type} - ${item.fname} ${item.lname}`}</Text>
                    <Text>{`Pvm: ${formattedDate}`}</Text>
                    <Text>{`Ajankohta: ${formattedStartTime}-${formattedEndTime}`}</Text>
                    <Text>{`Hinta: ${item.price}`}</Text>
                </View>
                <View style={styles.buttonsContainer}>
                    <TouchableOpacity style={styles.button} onPress={handlePressEdit}><Text>Muokkaa</Text></TouchableOpacity>
                    <TouchableOpacity style={styles.button} onPress={handlePressDetails}><Text>Lisätiedot</Text></TouchableOpacity>
                    <TouchableOpacity style={styles.button} onPress={() => handlePressDelete(item.id, item)}><Text>Poista</Text></TouchableOpacity>
                </View>
            </View>
        );
    };

    if (isLoading) {
        return <Text>Loading...</Text>;
    }

    return (
        <View style={styles.container}>
            <FlatList
                data={reservations}
                renderItem={renderReservationItem}
                keyExtractor={(item, index) => index.toString()}
                refreshing={isLoading}
                onRefresh={fetchReservationData}
            />
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        width: '100%',
        paddingHorizontal: 10,
        paddingTop: 10,
        paddingBottom: 5,
    },
    itemContainer: {
        borderWidth: 1,
        borderColor: 'gray',
        padding: 10,
        marginBottom: 10,
        width: 330,
    },
    itemDetails: {
        marginBottom: 10,
        width: '90%',
    },
    buttonsContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
    },
    button: {
        padding: 5,
        backgroundColor: '#ccc',
    },
});