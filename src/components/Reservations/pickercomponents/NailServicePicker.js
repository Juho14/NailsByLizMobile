import { Picker } from '@react-native-picker/picker';
import React, { useEffect, useState } from 'react';
import { StyleSheet, View } from 'react-native';
import { fetchNailServices } from '../../../fetches/NailServiceFetch';

export default function NailServicePicker({ onSelectNailService }) {
    const [nailServices, setNailServices] = useState([]);
    const [selectedNailService, setSelectedNailService] = useState(null);

    useEffect(() => {
        fetchNailServices()
            .then(data => {
                setNailServices(data);
                if (data.length > 0) {
                    setSelectedNailService(data[0]);
                }
            })
            .catch(err => console.error(err));
    }, []);

    const handleFieldChange = (value) => {
        const selectedService = nailServices.find(service => service.id === value);
        setSelectedNailService(selectedService);
        onSelectNailService(selectedService);
    };

    return (
        <View style={styles.container}>
            <Picker
                style={styles.picker}
                selectedValue={selectedNailService ? selectedNailService.id : null}
                onValueChange={(value) => handleFieldChange(value)}
            >
                {nailServices.map(service => (
                    <Picker.Item key={service.id} label={`${service.type} - ${service.duration / 60} h - ${service.price}€`} value={service.id} />
                ))}
            </Picker>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        marginTop: 10,
        padding: 10,
        backgroundColor: '#D4F0F0',
        borderColor: '#8FCACA',
        borderWidth: 3,
        borderRadius: 5,
    },
    picker: {
        borderRadius: 5,
        borderColor: '#8FCACA',
        borderWidth: 1,
        width: 310,
    },
});
