import { KeyboardAvoidingView, Modal, ModalProps, StyleSheet, View } from 'react-native';
import { X } from 'react-native-feather';
import { useTheme } from '../theming';
import { FadingPressable } from './FadingPressable';

interface ThemedModalProps extends ModalProps {
    isVisible: boolean;
    setIsVisible: React.Dispatch<React.SetStateAction<boolean>>;
    onClosePress?: () => void;
}

export const ThemedModal: React.FC<ThemedModalProps> = ({ isVisible, setIsVisible, onClosePress, children, ...props }) => {
    const theme = useTheme();
    return (
        <Modal
            animationType="slide"
            transparent={true}
            visible={isVisible}
            onRequestClose={(e) => {
                if (props.onRequestClose) {
                    props.onRequestClose(e);
                }
                setIsVisible(!isVisible);
            }} {...props}>
            <KeyboardAvoidingView style={[styles.centeredView]}>
                <View style={[styles.modalView, { backgroundColor: theme.colors.muted }]}>
                    {/* Close Modal Button */}
                    {/* eslint-disable-next-line react-native/no-inline-styles */}
                    <View style={[{ position: 'absolute', right: 0, top: 0, padding: 15 }]}>
                        <FadingPressable
                            onPress={() => {
                                if (onClosePress) {
                                    onClosePress();
                                } else {
                                    setIsVisible(!isVisible);
                                }
                            }}>
                            {/* eslint-disable-next-line react-native/no-inline-styles */}
                            <X color={'grey'} width={20} style={{ padding: 5 }} />
                        </FadingPressable>
                    </View>
                    {children}
                </View>
            </KeyboardAvoidingView>
        </Modal>
    );
};

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
        borderRadius: 10,
        shadowRadius: 4,
        elevation: 10,
        maxHeight: '90%',
        marginVertical: 10,
        marginHorizontal: 5,
        paddingHorizontal: 35,
        paddingTop: 35,
        paddingBottom: 25,
    },
});
