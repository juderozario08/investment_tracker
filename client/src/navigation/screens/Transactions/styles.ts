import { StyleSheet } from "react-native";

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    centeredView: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: "rgba(0,0,0,0.5)",
    },
    modalView: {
        justifyContent: "center",
        alignSelf: "center",
        marginVertical: 10,
        marginHorizontal: 5,
        borderRadius: 10,
        paddingHorizontal: 35,
        paddingTop: 35,
        paddingBottom: 25,
        shadowRadius: 4,
        elevation: 10,
        maxHeight: "90%",
    },
    modalFields: {
        flexDirection: "row",
        borderBottomWidth: 1,
        borderColor: "rgba(128, 128, 128, 0.7)",
        paddingBottom: 5,
    },
    modalText: {
        marginTop: 10,
        width: 100,
    },
    dropdown: {
        marginTop: 8,
        height: "auto",
        width: 150,
        borderColor: "transparent",
        borderWidth: 0.5,
        paddingRight: 10,
    },
});

export default styles;
