import React from 'react';
import { StyleSheet, Text, View } from 'react-native';

export default function HomeScreen() {

    return (
        <View style={styles.container}>
            <Text> Hello, this is the front page</Text>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        padding: 20,
    },
    button: {
        marginTop: 10,
        padding: 10,
        backgroundColor: 'lightblue',
        borderRadius: 5,
        textAlign: 'center',
    },
});
