import { useNavigation } from '@react-navigation/native';
import React, { useEffect, useState } from 'react';
import { ActivityIndicator, FlatList, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { fetchSpecificNailService } from '../../fetches/NailServiceFetch';
import { fetchReservationsOfDay } from '../../fetches/ReservationFetch';
import { fetchActiveReservationsetting } from '../../fetches/ReservationSettingFetch';

const ReservationTimeSelector = ({ route }) => {
    const navigation = useNavigation();
    let formattedDate = route.params.formattedDate;
    let selectedNailService = route.params.selectedNailService;
    const [reservationSettings, setReservationSettings] = useState(null);
    const [reservations, setReservations] = useState([]);
    const [nailServiceDuration, setNailServiceDuration] = useState(0);
    const [fetchingError, setFetchingError] = useState(null);

    const handleDialogOpen = (selectedTime) => {
        if (selectedTime) {
            navigation.navigate('Viimeistele varaus', { formattedDate: formattedDate, selectedNailService: selectedNailService, selectedTime: selectedTime });
        }
        else {
            setShowNullDateMessage(true);
        }
    };

    const formattedStartDate = new Date(formattedDate + 'T00:00:00');
    const formattedEndDate = new Date(formattedDate + 'T23:59:59');
    useEffect(() => {
        console.log("formattedDate:", formattedDate);
        console.log("selectedNailService:", selectedNailService);

        // Fetch active reservation setting
        fetchActiveReservationsetting()
            .then(data => {
                console.log("Reservation Setting Data:", data);
                setReservationSettings(data);
            })
            .catch(error => console.error('Error fetching reservation setting:', error));

        // Fetch reservations of the selected day
        if (formattedDate) {
            fetchReservationsOfDay(formattedDate)
                .then(data => {
                    console.log("Reservations Data:", data);
                    setReservations(data);
                    setFetchingError(null); // Reset fetching error if successful
                })
                .catch(error => {
                    console.error('Error fetching reservations:', error);
                    setFetchingError(error.message); // Set fetching error
                });
        }

        // Fetch specific nail service duration
        if (selectedNailService) {
            fetchSpecificNailService(selectedNailService.id)
                .then(data => {
                    console.log("Nail Service Data:", data);
                    setNailServiceDuration(data.duration);
                })
                .catch(error => {
                    console.error('Error fetching nail service:', error);
                    setFetchingError(error.message); // Set fetching error
                });
        }
    }, [formattedDate, selectedNailService]);


    // Function to generate time slots
    const generateTimeSlots = () => {
        if (!reservationSettings || !reservationSettings.startTime || !reservationSettings.endTime || nailServiceDuration === 0) {
            return [];
        }

        const timeSlots = [];
        const startTime = new Date(`${formattedDate}T${reservationSettings.startTime}`);
        const endTime = new Date(`${formattedDate}T${reservationSettings.endTime}`);

        while (startTime <= endTime) {
            let timeSlotEndTime = new Date(startTime.getTime() + (nailServiceDuration * 60000));
            let overlapsWithReservation = false;

            for (let i = 0; i < reservations.length; i++) {
                const reservationObject = reservations[i];
                if (reservationObject.status !== "OK") {
                    continue;
                }
                const reservationStartTime = new Date(reservationObject.startTime);
                const reservationEndTime = new Date(reservationObject.endTime);

                if (startTime < reservationEndTime && timeSlotEndTime > reservationStartTime) {
                    overlapsWithReservation = true;
                    break;
                }
            }

            if (!overlapsWithReservation && startTime >= formattedStartDate && timeSlotEndTime <= formattedEndDate) {
                timeSlots.push(new Date(startTime));
            }
            startTime.setMinutes(startTime.getMinutes() + 15);
        }

        return timeSlots;
    };

    // Function to filter out reserved time slots
    const filterReservedTimeSlots = (timeSlots) => {
        const reservedSlots = reservations.map(reservation => new Date(reservation.time));
        return timeSlots.filter(timeSlot => !reservedSlots.find(slot => slot.getTime() === timeSlot.getTime()));
    };

    if (!reservationSettings || !reservationSettings.startTime || !reservationSettings.endTime || nailServiceDuration === 0) {
        return <ActivityIndicator />;
    }

    const timeSlots = generateTimeSlots();
    const availableTimeSlots = filterReservedTimeSlots(timeSlots);

    return (
        <View>
            {fetchingError && <Text>Error fetching reservations: {fetchingError}</Text>}
            {availableTimeSlots.length > 0 ? (
                <>
                    <View style={{ alignItems: 'center' }}>
                        <Text style={styles.timeSlotText}>Vapaat ajat:</Text>
                    </View>
                    <FlatList
                        data={availableTimeSlots}
                        renderItem={({ item }) => (
                            <TouchableOpacity onPress={() => handleDialogOpen(item.toTimeString())}>
                                <View style={styles.timeSlotContainer}>
                                    <Text>{item.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</Text>
                                </View>
                            </TouchableOpacity>

                        )}
                        keyExtractor={(item, index) => index.toString()}
                    />
                </>
            ) : (
                <Text>No available time slots</Text>
            )}
        </View>
    );
};

const styles = StyleSheet.create({
    timeSlotContainer: {
        alignItems: 'center',
        justifyContent: 'center',
        paddingVertical: 5,
        paddingHorizontal: 10,
        borderColor: 'pink',
        borderWidth: 2,
        borderRadius: 15,
        margin: 5,
        backgroundColor: '#FFE4E1',
        marginHorizontal: '15%',
        width: '70%',
    },
    timeSlotText: {
        fontWeight: 'bold',
    },
});

export default ReservationTimeSelector;