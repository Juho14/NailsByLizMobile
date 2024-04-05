import { useNavigation } from '@react-navigation/native';
import React, { useEffect, useState } from 'react';
import { ActivityIndicator, Alert, FlatList, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { fetchSpecificNailService } from '../../fetches/NailServiceFetch';
import { fetchReservationsOfDay } from '../../fetches/ReservationFetch';
import { fetchActiveReservationSetting } from '../../fetches/ReservationSettingFetch';

const ReservationTimeSelector = ({ route }) => {
    const navigation = useNavigation();
    const [reservationSettings, setReservationSettings] = useState(null);
    const [reservations, setReservations] = useState([]);
    const [nailServiceDuration, setNailServiceDuration] = useState(0);
    const [fetchingError, setFetchingError] = useState(null);
    const [nailService, setNailService] = useState([]);

    const {
        reservationId,
        isFromEdit,
        selectedNailServiceId,
        formattedDate,
    } = route.params;

    const handleDialogOpen = (selectedTime) => {
        if (selectedTime) {
            if (isFromEdit === true) {
                console.log(formattedDate);
                console.log(selectedTime);
                navigation.navigate('Muokkaa varausta', {
                    formattedDate: formattedDate,
                    selectedNailServiceId: selectedNailServiceId,
                    selectedTime: selectedTime,
                    reservationId: reservationId,
                });
            } else {
                navigation.navigate('Viimeistele varaus', {
                    formattedDate: formattedDate,
                    selectedNailService: nailService,
                    selectedTime: selectedTime
                });
            }
        } else {
            setShowNullDateMessage(true);
        }
    };



    const formattedStartDate = new Date(formattedDate + 'T00:00:00');
    const formattedEndDate = new Date(formattedDate + 'T23:59:59');
    useEffect(() => {
        console.log("formattedDate:", formattedDate);
        console.log("selectedNailServiceId:", selectedNailServiceId);

        // Fetch active reservation setting
        fetchActiveReservationSetting()
            .then(data => {
                console.log("Reservation Setting Data:", data);
                setReservationSettings(data);
            })
            .catch(error => console.error('Error fetching reservation setting:', error));

        // Fetch reservations of the selected day

        fetchReservationsOfDay(formattedDate)
            .then(data => {
                console.log("Reservations Data:", data);
                setReservations(data);
                setFetchingError(null);
            })
            .catch(error => {
                console.error('Error fetching reservations:', error);
                setFetchingError(error.message);
            });


        // Fetch specific nail service duration

        fetchSpecificNailService(selectedNailServiceId)
            .then(data => {
                setNailService(data);
                setNailServiceDuration(data.duration);
            })
            .catch(error => {
                console.error('Error fetching nail service:', error);
                setFetchingError(error.message);
            });

    }, [formattedDate, selectedNailServiceId]);

    const handleNoAvailableTimes = () => {
        Alert.alert(`No available times\nDate: ${formattedDate}`);
        navigation.navigate("Valitse palvelu ja päivä");
    }


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
            let previousHadReservation = false; // Boolean to track if the previous time slot had a reservation. If true, add a 15 minute buffer
            let endTimeConflicts = false; // Boolean to track if the end time of the current reservation conflicts with the start time of an existing reservation. If true, time isn't rendered.
            let lastReservationEndTime = null; // Variable to store the end time of the last overlapping reservation

            for (let i = 0; i < reservations.length; i++) {
                const reservationObject = reservations[i];
                if (reservationObject.status !== "OK") {
                    continue;
                }
                if (reservationObject.id == reservationId) {
                    continue;
                }
                const reservationStartTime = new Date(reservationObject.startTime);
                const reservationEndTime = new Date(reservationObject.endTime);

                // Convert reservation start and end times from GMT to GMT+3
                reservationStartTime.setHours(reservationStartTime.getHours() + 3);
                reservationEndTime.setHours(reservationEndTime.getHours() + 3);

                if (startTime < reservationEndTime && timeSlotEndTime >= reservationStartTime) {
                    overlapsWithReservation = true;
                    lastReservationEndTime = reservationEndTime; // Update the last reservation end time
                    break;
                }
            }

            if (!overlapsWithReservation && startTime >= formattedStartDate && timeSlotEndTime <= formattedEndDate && !endTimeConflicts) {
                timeSlots.push(new Date(startTime));
                previousHadReservation = false; // Reset the boolean value
            } else {
                if (!overlapsWithReservation) {
                    previousHadReservation = true; // Set the boolean value to true if the current time slot has a reservation
                    startTime.setMinutes(startTime.getMinutes() + 15);
                } else {
                    // If there's a reservation, move startTime to the end time of that reservation
                    startTime.setTime(lastReservationEndTime.getTime() + (15 * 60000)); // Add 15 minutes buffer after each reservation
                }
            }

            if (endTimeConflicts) {
                startTime.setMinutes(startTime.getMinutes() + 15);
                continue;
            }

            startTime.setMinutes(startTime.getMinutes() + 15);
        }

        return timeSlots;
    };




    // Function to filter out reserved time slots
    const filterReservedTimeSlots = (timeSlots) => {
        const reservedSlots = reservations.map(reservation => new Date(reservation.endTime));
        return timeSlots.filter(timeSlot => !reservedSlots.find(slot => slot.getTime() === timeSlot.getTime()));
    };



    if (!reservationSettings || !reservationSettings.startTime || !reservationSettings.endTime || nailServiceDuration === 0) {
        return <ActivityIndicator />;
    }

    const timeSlots = generateTimeSlots();
    const availableTimeSlots = filterReservedTimeSlots(timeSlots);

    return (
        <View style={styles.container}>
            {fetchingError && <Text>Error fetching reservations: {fetchingError}</Text>}
            {availableTimeSlots.length > 0 ? (
                <>
                    <View style={{ alignItems: 'center' }}>
                        <Text style={styles.timeSlotText}>Vapaat ajat:</Text>
                    </View>
                    <FlatList
                        style={styles.flatList}
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
                handleNoAvailableTimes()
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
        borderColor: '#8FCACA',
        borderWidth: 3,
        borderRadius: 15,
        margin: 5,
        backgroundColor: '#D4F0F0',
        marginHorizontal: '15%',
        width: '70%',
        marginVertical: 10,
    },
    timeSlotText: {
        fontWeight: 'bold',
    },
    flatList: {
        margin: 15,
    },
});


export default ReservationTimeSelector;