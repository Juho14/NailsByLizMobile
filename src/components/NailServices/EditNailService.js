import { Picker } from '@react-native-picker/picker';
import { useNavigation } from '@react-navigation/native';
import React, { useEffect, useState } from 'react';
import { Alert, Button, StyleSheet, Text, TextInput, View } from 'react-native';
import { fetchSpecificNailService, updateNailservice } from '../../fetches/NailServiceFetch';

function EditNailService({ route }) {
    const { id } = route.params;
    const [type, setType] = useState('');
    const [duration, setDuration] = useState('');
    const [price, setPrice] = useState('');
    const [adminService, setAdminService] = useState(false);
    const navigation = useNavigation();

    useEffect(() => {
        fetchNailServiceData();
    }, []);

    const fetchNailServiceData = async () => {
        try {
            const nailServiceData = await fetchSpecificNailService(id);
            setType(nailServiceData.type);
            setDuration(nailServiceData.duration.toString());
            setPrice(nailServiceData.price.toString());
            setAdminService(nailServiceData.adminService);
        } catch (error) {
            console.error('Error fetching nail service data:', error);
        }
    };

    const handleEditNailService = async () => {
        const updatedNailService = {
            id,
            type,
            duration: parseInt(duration),
            price: parseFloat(price),
            adminService,
        };

        try {
            const response = await updateNailservice(updatedNailService, id);
            if (response.success) {
                Alert.alert('Muutokset tallennettu!', `Nimi: ${type}, Hinta: ${price}€, Kesto: ${duration} min.`);
                navigation.navigate('Lista palveluista');
            } else {
                throw new Error('Failed to update nail service.');
            }
        } catch (error) {
            console.error('Error updating nail service:', error);
            Alert.alert('Virhe muokkauksessa');
        }
    };

    const handleFieldChange = (value) => {
        setAdminService(value);
    };

    return (
        <View style={styles.container}>
            <Text style={styles.label}>Palvelu:</Text>
            <TextInput
                style={styles.input}
                value={type}
                onChangeText={setType}
                placeholder="Syötä palvelun nimi"
            />

            <Text style={styles.label}>Kesto (minuutteina):</Text>
            <TextInput
                style={styles.input}
                value={duration}
                onChangeText={setDuration}
                placeholder="Syötä kesto"
                keyboardType="numeric"
            />

            <Text style={styles.label}>Hinta: (kokoluku tai desimaali)</Text>
            <TextInput
                style={styles.input}
                value={price}
                onChangeText={setPrice}
                placeholder="Syötä hinta"
                keyboardType="numeric"
            />

            <View style={styles.checkboxContainer}>
                <Text style={styles.label}>Tuleeko palvelu asiakkaille? :</Text>
                <View style={styles.container}>
                    <Picker
                        style={styles.picker}
                        selectedValue={adminService}
                        onValueChange={(value) => handleFieldChange(value)}
                    >
                        <Picker.Item key={2} label="Kyllä" value={false} />
                        <Picker.Item key={1} label="ei" value={true} />
                    </Picker>
                </View>
            </View>

            <Button title="Tallenna" onPress={handleEditNailService} />
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 20,
    },
    label: {
        fontWeight: 'bold',
        marginBottom: 5,
    },
    input: {
        height: 40,
        borderColor: 'gray',
        borderWidth: 1,
        marginBottom: 15,
        paddingHorizontal: 10,
    },
    checkboxContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 15,
    },
});

export default EditNailService;
