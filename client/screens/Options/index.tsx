
import { View, StyleSheet, Button } from 'react-native';
import { useTheme } from '../../theming';
import { ThemedText } from '../../components/ThemedText';
import { pick } from '@react-native-documents/picker';
import { readFile } from 'react-native-fs';

export const Options = () => {
    const theme = useTheme();
    return (
        <View style={[styles.container, { backgroundColor: theme.colors.background }]}>
            <ThemedText>Options!</ThemedText>
            <Button
                title="single file import"
                onPress={async () => {
                    try {
                        const [pickResult] = await pick({ mode: 'import' });
                        const ft = pickResult.uri.split('.').pop();
                        console.log(pickResult.uri);
                        if (ft !== 'pdf') {
                            const content = await readFile(pickResult.uri, 'utf8');
                            console.log(content);
                        } else {
                        }
                    } catch (err: unknown) {
                        console.error('ERROR OCCURED');
                    }
                }}
            />
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
