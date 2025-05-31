import { KeyboardAvoidingView, Modal, StyleSheet, View } from "react-native";
import { X } from "react-native-feather";
import { ReactNode } from "react";
import { useTheme } from "../theming";
import { FadingPressable } from "./FadingPressable";

const ThemedModal: React.FC<{
    isVisible: boolean;
    setIsVisible: React.Dispatch<React.SetStateAction<boolean>>;
    children: ReactNode;
}> = ({ isVisible, setIsVisible, children }) => {
    const theme = useTheme();
    return (
        <Modal
            animationType="slide"
            transparent={true}
            visible={isVisible}
            onRequestClose={() => {
                setIsVisible(!isVisible);
            }}>
            <KeyboardAvoidingView style={[styles.centeredView]}>
                <View style={[styles.modalView, { backgroundColor: theme.colors.muted }]}>
                    {/* Close Modal Button */}
                    <View style={{ position: 'absolute', right: 0, top: 0, padding: 15 }}>
                        <FadingPressable
                            onPress={() => setIsVisible(!isVisible)}>
                            <X color={'grey'} width={20} style={{ padding: 5 }} />
                        </FadingPressable>
                    </View>
                    {children}
                </View>
            </KeyboardAvoidingView>
        </Modal>
    )
}

export default ThemedModal;

const styles = StyleSheet.create({
    centeredView: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'rgba(0,0,0,0.5)',
    },
    modalView: {
        justifyContent: 'center',
        alignSelf: 'center',
        marginVertical: 10,
        marginHorizontal: 5,
        borderRadius: 10,
        paddingHorizontal: 35,
        paddingTop: 35,
        paddingBottom: 25,
        shadowRadius: 4,
        elevation: 10,
        maxHeight: '90%',
    },
})
