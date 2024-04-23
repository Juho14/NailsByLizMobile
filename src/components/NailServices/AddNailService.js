import { Picker } from '@react-native-picker/picker';
import { useNavigation } from '@react-navigation/native';
import React, { useState } from 'react';
import { Alert, Button, StyleSheet, Text, TextInput, View } from 'react-native';
import { saveNailService } from '../../fetches/NailServiceFetch';

function AddNailService() {
    const [type, setType] = useState('');
    const [duration, setDuration] = useState('');
    const [price, setPrice] = useState('');
    const [adminService, setAdminService] = useState(false);
    const navigation = useNavigation();

    const handleAddNailService = () => {
        const newNailService = {
            type,
            duration: parseInt(duration),
            price: parseFloat(price),
            adminService,
        };

        saveNailService(newNailService)
            .then(response => {
                console.log("Nail service saved successfully:", response);
                setType('');
                setDuration('');
                setPrice('');
                setAdminService(false);
                navigation.navigate('Palvelut');
                Alert.alert('Palvelu tallennettu!', `Nimi: ${type}, Hinta: ${price}€, Kesto: ${duration} min.`);
            })
            .catch(error => {
                console.error("Error saving nail service:", error);
                Alert.alert('Virhe tallennuksessa', 'Tallennus epäonnistui.');
            });
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
                placeholder="Syötä ketso"
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

            <Button title="Save" onPress={handleAddNailService} />
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

export default AddNailService;