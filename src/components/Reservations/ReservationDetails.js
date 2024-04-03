import { useEffect, useState } from "react";
import { StyleSheet, Text, View } from "react-native";
import { fetchSpecificNailService } from "../../fetches/NailServiceFetch";
import { fetchSpecificReservation } from "../../fetches/ReservationFetch";


export default function ReservationDetails({ route }) {
    const [reservation, setReservation] = useState([]);
    const [nailService, setNailService] = useState([]);

    const {
        reservationId,
        nailServiceId,
    } = route.params;

    const startTime = new Date(reservation.startTime + 'Z');
    const endTime = new Date(reservation.endTime + 'Z');

    const formattedDate = `${startTime.getDate()}.${startTime.getMonth() + 1}.${startTime.getFullYear()}`;
    const formattedStartTime = `${startTime.getHours()}:${startTime.getMinutes().toString().padStart(2, '0')}`;
    const formattedEndTime = `${endTime.getHours()}:${endTime.getMinutes().toString().padStart(2, '0')}`;

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
        fetchSpecificNailService(nailServiceId)
            .then(data => {
                console.log("Nail Service Data:", data);
                setNailService(data);
            })
            .catch(error => {
                console.error('Error fetching nail service:', error);
            });
    }, [nailServiceId]);

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
                <Text style={styles.item}>Päivämäärä: {formattedDate}</Text>
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
});
