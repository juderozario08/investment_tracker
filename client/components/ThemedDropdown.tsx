import { Dropdown } from "react-native-element-dropdown";
import { StyleSheet, View, Text, TextStyle, StyleProp, DimensionValue } from "react-native";
import { Theme } from "../theming/types";
import { ThemedText } from "./ThemedText";

export const ThemedDropdown: React.FC<{
    theme: Theme,
    data: any,
    value: any,
    width?: DimensionValue;
    onChange: (item: any) => void
    search?: boolean
    searchPlaceholder?: string
    placeholder?: string,
    selectedTextStyle?: StyleProp<TextStyle>;
    renderItem?: ((item: any, selected?: boolean) => React.ReactElement | null) | undefined
}> = ({ theme, width, data, onChange, value, search, searchPlaceholder, placeholder, selectedTextStyle, renderItem }) => {
    return (
        <Dropdown
            style={[styles.dropdown, { width: width ?? 150 }]}
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
                    <ThemedText>{item.label}</ThemedText>
                </View>
            ))} />
    )
}

const styles = StyleSheet.create({
    dropdown: {
        marginTop: 8,
        height: 'auto',
        borderColor: 'transparent',
        borderWidth: 0.5,
        paddingRight: 10,
    },
})
