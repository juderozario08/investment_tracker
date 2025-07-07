import { View } from "react-native";
import { CategoryTypes, IncomeTagTypes, InvestmentTagTypes, SpendingTagTypes } from "../library/types";
import { chartColors } from "../library/constants";
import { capitalizeString } from "../library/helper";
import { ThemedText } from "./ThemedText";

interface LegendProps {
    legendsLabels: (CategoryTypes | InvestmentTagTypes | SpendingTagTypes | IncomeTagTypes)[];
}

export const Legends: React.FC<LegendProps> = ({ legendsLabels }) => {
    return (
        <View
            style={{
                flexDirection: "row",
                flexWrap: "wrap",
                gap: 30,
                paddingVertical: 10,
                justifyContent: "center",
                paddingHorizontal: 20,
                alignItems: "center",
            }}
        >
            {legendsLabels.map((t, index) => {
                return (
                    <View
                        style={{
                            flexDirection: "row",
                            alignItems: "center",
                        }}
                        key={index}
                    >
                        <View
                            style={{
                                height: 10,
                                width: 10,
                                borderRadius: 5,
                                marginRight: 10,
                                backgroundColor: chartColors[t],
                            }}
                        />
                        <ThemedText>{capitalizeString(t)}</ThemedText>
                    </View>
                );
            })}
        </View>
    );
};
