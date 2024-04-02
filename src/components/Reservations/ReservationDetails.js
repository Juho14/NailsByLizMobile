import { useEffect, useState } from "react";
import { StyleSheet, Text, View } from "react-native";
import { fetchSpecificNailService } from "../../fetches/NailServiceFetch";

export default function ReservationDetails({ route }) {

    const [nailService, setNailService] = useState([]);

    const {
        reservationId,
        email,
        phone,
        address,
        city,
        postalcode,
        startTime,
        endTime,
        price,
        nailServiceId,
        status,
        fname,
        lname,
    } = route.params;

    const startDate = new Date(startTime);
    const endDate = new Date(endTime);
    const formattedDate = `${startDate.getDate()}.${startDate.getMonth() + 1}.${startDate.getFullYear()}`;
    const formattedStartTime = `${startDate.getHours()}:${startDate.getMinutes().toString().padStart(2, '0')}`;
    const formattedEndTime = `${endDate.getHours()}:${endDate.getMinutes().toString().padStart(2, '0')}`;

    useEffect(() => {
        fetchSpecificNailService(nailServiceId)
            .then(data => {
                console.log("Nail Service Data:", data);
                setNailService(data);
            })
            .catch(error => {
                console.error('Error fetching nail service:', error);
                setFetchingError(error.message);
            });
    }, []);

    return (
        <View style={styles.DetailView}>
            <View style={styles.itemContainer}>
                <Text style={styles.itemTitle}>Varauksen tunnus</Text>
                <Text style={styles.item}>{reservationId}</Text>
            </View>
            <View style={styles.itemContainer}>
                <Text style={styles.itemTitle}>Varaajan nimi</Text>
                <Text style={styles.item}>{fname} {lname}</Text>
            </View>
            <View style={styles.itemContainer}>
                <Text style={styles.itemTitle}>Varaajan sähköposti</Text>
                <Text style={styles.item}>{email}</Text>
            </View>
            <View style={styles.itemContainer}>
                <Text style={styles.itemTitle}>Varaajan puhelinnumero</Text>
                <Text style={styles.item}>{phone}</Text>
            </View>
            <View style={styles.itemContainer}>
                <Text style={styles.itemTitle}>Varaajan osoite</Text>
                <Text style={styles.item}>{address}, {city}, postinumero {postalcode}</Text>
            </View>
            <View style={styles.itemContainer}>
                <Text style={styles.itemTitle}>Varauksen aika</Text>
                <Text style={styles.item}>Päivämäärä: {formattedDate}</Text>
                <Text style={styles.item}>Alkaa: {formattedStartTime}</Text>
                <Text style={styles.item}>Loppuu: {formattedEndTime}</Text>
            </View>
            <View style={styles.itemContainer}>
                <Text style={styles.itemTitle}>Varauksen hinta</Text>
                <Text style={styles.item}>{price}€</Text>
            </View>
            <View style={styles.itemContainer}>
                <Text style={styles.itemTitle}>Varauksen tila</Text>
                <Text style={styles.item}>{status}</Text>
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
