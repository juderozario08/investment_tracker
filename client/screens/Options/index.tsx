import { View, StyleSheet } from 'react-native';
import { useTheme } from '../../theming';
import { ThemedText } from '../../components/ThemedText';

export const Options = () => {
    const theme = useTheme();
    return (
        <View style={[styles.container, { backgroundColor: theme.colors.background }]}>
            <ThemedText>Options!</ThemedText>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        gap: 10,
    },
});
