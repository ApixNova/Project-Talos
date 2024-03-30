import { Pressable, StyleSheet } from "react-native"
export default function Button() {
    return (
        <Pressable
        style={styles.button}
        >
            Button
        </Pressable>
    )
}

const styles = StyleSheet.create({
    button: {
        borderRadius: 10,
        borderColor: 'white',
        borderWidth: 5,
        backgroundColor: 'black',
        padding: 15,
        color: 'white'
    }
})