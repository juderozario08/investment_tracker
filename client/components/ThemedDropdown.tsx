import { Dropdown } from "react-native-element-dropdown";
import { StyleSheet, View, Text, TextStyle, StyleProp } from "react-native";
import { Theme } from "../theming/types";

export const ThemedDropdown: React.FC<{
    theme: Theme,
    data: any,
    value: any,
    onChange: (item: any) => void
    search?: boolean
    searchPlaceholder?: string
    placeholder?: string,
    selectedTextStyle?: StyleProp<TextStyle>;
    renderItem?: ((item: any, selected?: boolean) => React.ReactElement | null) | undefined
}> = ({ theme, data, onChange, value, search, searchPlaceholder, placeholder, selectedTextStyle, renderItem }) => {
    return (
        <Dropdown
            style={[styles.dropdown]}
            selectedTextStyle={selectedTextStyle ?? { color: theme.colors.text, fontSize: 14, backgroundColor: theme.colors.muted }}
            data={data}
            containerStyle={{ backgroundColor: theme.colors.card, borderRadius: 5 }}
            itemTextStyle={{ color: theme.colors.text }}
            labelField="label"
            valueField="value"
            search={search ?? false}
            searchPlaceholder={searchPlaceholder ?? "Search"}
            inputSearchStyle={search ? { color: theme.colors.text, height: 40 } : null}
            placeholder={placeholder ?? ""}
            placeholderStyle={{ color: theme.colors.textSubtle }}
            value={value}
            onChange={onChange}
            renderItem={renderItem ?? ((item, selected) => (
                <View style={{
                    backgroundColor: selected ? theme.colors.muted : theme.colors.background,
                    borderColor: 'gray',
                    borderWidth: 1,
                    padding: 8,
                }}>
                    <Text style={{ color: theme.colors.text }}>{item.label}</Text>
                </View>
            ))} />
    )
}

const styles = StyleSheet.create({
    dropdown: {
        marginTop: 8,
        height: 'auto',
        width: 150,
        borderColor: 'transparent',
        borderWidth: 0.5,
        paddingRight: 10,
    },
})
