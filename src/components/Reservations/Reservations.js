import { useIsFocused, useNavigation } from '@react-navigation/native';
import React, { useCallback, useEffect, useState } from 'react';
import { FlatList, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
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

    useEffect(() => {
        fetchReservationData();
    }, [fetchReservationData]);

    useEffect(() => {
        const unsubscribe = navigation.addListener('focus', () => {
            // Fetch data again when the screen gains focus
            fetchReservationData();
        });

        return unsubscribe;
    }, [navigation, fetchReservationData]);

    const renderReservationItem = ({ item }) => {
        // Parse start and end times from the object. Add 3 hours for GMT+3
        const startTime = new Date(item.startTime + 'Z');
        const endTime = new Date(item.endTime + 'Z');

        const formattedDate = `${startTime.getDate()}.${startTime.getMonth() + 1}.${startTime.getFullYear()}`;
        const formattedStartTime = `${startTime.getHours()}:${startTime.getMinutes().toString().padStart(2, '0')}`;
        const formattedEndTime = `${endTime.getHours()}:${endTime.getMinutes().toString().padStart(2, '0')}`;

        const handlePressDetails = () => {
            navigation.navigate('Varauksen lisätiedot', {
                reservationId: item.id,
                nailServiceId: item.nailService.id,
            });
        };

        const handlePressEdit = () => {
            navigation.navigate('Muokkaa varausta', {
                reservationId: item.id,
                selectedNailServiceId: item.nailService.id,
            });
        };

        const handlePressDelete = () => {
            deleteReservation(item.id);
        };

        return (
            <View style={styles.itemContainer}>
                <View style={styles.itemDetails}>
                    <Text>{`${item.nailService.type} - ${item.fname} ${item.lname}`}</Text>
                    <Text>{`Date: ${formattedDate}`}</Text>
                    <Text>{`Time: ${formattedStartTime}-${formattedEndTime}`}</Text>
                    <Text>{`Price: ${item.price}`}</Text>
                </View>
                <View style={styles.buttonsContainer}>
                    <TouchableOpacity style={styles.button} onPress={handlePressEdit}><Text>Edit</Text></TouchableOpacity>
                    <TouchableOpacity style={styles.button} onPress={handlePressDetails}><Text>Details</Text></TouchableOpacity>
                    <TouchableOpacity style={styles.button} onPress={handlePressDelete}><Text>Delete</Text></TouchableOpacity>
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
