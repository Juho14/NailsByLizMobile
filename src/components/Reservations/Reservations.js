import { useNavigation } from '@react-navigation/native';
import React, { useEffect, useState } from 'react';
import { FlatList, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { deleteReservation, fetchReservations } from '../../fetches/ReservationFetch';

export default function Reservations() {
    const [reservations, setReservations] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const navigation = useNavigation();

    useEffect(() => {
        const fetchData = async () => {
            try {
                const reservationData = await fetchReservations();
                setReservations(reservationData);
            } catch (error) {
                console.error(error);
            } finally {
                setIsLoading(false);
            }
        };

        fetchData();
    }, []);

    const renderReservationItem = ({ item }) => {
        // Parse start and end times from the object. Add 3 hours for GMT+3
        const startTime = new Date(item.startTime);
        const endTime = new Date(item.endTime);
        startTime.setHours(startTime.getHours() + 3);
        endTime.setHours(endTime.getHours() + 3);

        // Format date as "20.5.2024"
        const formattedDate = `${startTime.getDate()}.${startTime.getMonth() + 1}.${startTime.getFullYear()}`;

        // Format times as "15:30-18:30"
        const formattedStartTime = `${startTime.getHours()}:${startTime.getMinutes().toString().padStart(2, '0')}`;
        const formattedEndTime = `${endTime.getHours()}:${endTime.getMinutes().toString().padStart(2, '0')}`;

        const handlePressDetails = (item) => {
            navigation.navigate('Varauksen lisätiedot', {
                reservationId: item.id,
                email: item.email,
                address: item.address,
                city: item.city,
                postalcode: item.postalcode,
                price: item.price,
                startTime: item.startTime,
                endTime: item.endTime,
                nailServiceId: item.nailService.id,
                status: item.status,
                fname: item.fname,
                lname: item.lname,
            });
        };



        const handlePressEdit = (item) => {
            navigation.navigate('Muokkaa varausta', {
                reservationId: item.id,
                email: item.email,
                address: item.address,
                city: item.city,
                postalcode: item.postalcode,
                price: item.price,
                startTime: item.startTime,
                endTime: item.endTime,
                nailServiceId: item.nailService.id,
                status: item.status,
                fname: item.fname,
                lname: item.lname,
            });
        };

        const handlePressDelete = (reservationid) => {
            deleteReservation(reservationid)
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
                    <TouchableOpacity style={styles.button} onPress={() => handlePressEdit(item)}><Text>Edit</Text></TouchableOpacity>
                    <TouchableOpacity style={styles.button} onPress={() => handlePressDetails(item)}><Text>Details</Text></TouchableOpacity>
                    <TouchableOpacity style={styles.button} onPress={() => handlePressDelete(item.id)}><Text>Delete</Text></TouchableOpacity>
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
