/* eslint-disable react-native/no-inline-styles */
import { Dropdown } from 'react-native-element-dropdown';
import { View } from 'react-native';
import { ThemedText } from './ThemedText';
import { DropdownProps } from 'react-native-element-dropdown/lib/typescript/components/Dropdown/model';
import { useTheme } from '../theming';

interface Props<T> extends Omit<DropdownProps<T>, 'labelField' | 'valueField'> {
    labelField?: keyof T | string;
    valueField?: keyof T | string;
}

export const ThemedDropdown = <T,>({
    labelField = 'label',
    valueField = 'value',
    style,
    containerStyle,
    itemTextStyle,
    selectedTextStyle,
    search,
    inputSearchStyle,
    placeholder,
    searchPlaceholder,
    placeholderStyle,
    renderItem,
    ...props
}: Props<T>) => {
    const theme = useTheme();
    return (
        <Dropdown
            style={[{
                height: 'auto',
                borderColor: 'transparent',
                borderWidth: 0.5,
                paddingRight: 10,
                width: 150,
            }, style]}
            selectedTextStyle={[selectedTextStyle, { color: theme.colors.text, fontSize: 14, backgroundColor: theme.colors.muted }]}
            containerStyle={[{ backgroundColor: theme.colors.card, borderRadius: 5 }, containerStyle]}
            itemTextStyle={[{ color: theme.colors.text }, itemTextStyle]}
            labelField={labelField}
            valueField={valueField}
            search={search ?? false}
            searchPlaceholder={searchPlaceholder ?? 'Search'}
            inputSearchStyle={search ?
                [inputSearchStyle, { color: theme.colors.text, height: 40 }] : null}
            placeholder={placeholder ?? ''}
            placeholderStyle={[{ color: theme.colors.textSubtle }, placeholderStyle]}
            renderItem={renderItem ?? ((item, selected) => (
                <View style={{
                    backgroundColor: selected ? theme.colors.muted : theme.colors.background,
                    borderColor: 'gray',
                    borderWidth: 1,
                    padding: 8,
                }}>
                    <ThemedText>{item.label}</ThemedText>
                </View>
            ))}
            {...props} />
    );
};
