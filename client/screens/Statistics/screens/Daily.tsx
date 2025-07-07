import { Dimensions, View } from "react-native";
import { useTheme } from "../../../theming";
import { useEffect, useState } from "react";
import { useDataContext } from "../../../context/DataContext";
import {
    CategoryTypes,
    IncomeTagTypes,
    InvestmentTagTypes,
    SpendingTagTypes,
    TransactionDataType
} from "../../../library/types";
import { barDataItem, pieDataItem } from "react-native-gifted-charts";
import { ScrollView } from "react-native-gesture-handler";
import { ThemedText } from "../../../components/ThemedText";
import { TransactionItem } from "../../../components/TransactionItem";
import { Months, getDefaultTransactionValue } from "../../../library/constants";
import { TransactionModal } from "../../../components/TransactionModal";
import Animated, {
    runOnJS,
    useAnimatedStyle,
    useSharedValue,
    withSequence,
    withTiming
} from "react-native-reanimated";
import { FadingPressable } from "../../../components/FadingPressable";
import { X } from "react-native-feather";
import { STANDARD_ANIMATION_DURATION } from "../../../library/animationConfigs";
import { styles } from "../styles";
import { generateBarData, generatePieData } from "../helpers/functions";
import { ChartTypeNames } from "../../../components/ChartSelectionDropdown";
import { ChartOverview } from "../../../components/ChartOverview";
import { MaterialTopTabScreenProps } from "@react-navigation/material-top-tabs";
import { TopTabParamList } from "..";

type AmountBreakdownType = {
    income: TransactionGroupType;
    spending: TransactionGroupType;
    investment: TransactionGroupType;
}

interface GroupType<T> {
    amount: number;
    data: T[];
}

type TransactionGroupType = GroupType<TransactionDataType>;

export type PieDataItemWithLabelType = {
    label: CategoryTypes | SpendingTagTypes | InvestmentTagTypes | IncomeTagTypes;
    item: pieDataItem;
}

const AnimatedView = Animated.createAnimatedComponent(View);

type DailyProps = MaterialTopTabScreenProps<TopTabParamList, "Daily">;
export const Daily: React.FC<DailyProps> = () => {
    const { groupedByDate, editTransaction, removeTransaction } = useDataContext();
    const currentDate = (() => {
        const d = new Date();
        return new Date(d.getFullYear(), d.getMonth(), d.getDate(), 0, 0, 0);
    })()
    const [amountBreakdown, setAmountBreakdown] = useState<AmountBreakdownType>({
        income: { amount: 0, data: [] },
        spending: { amount: 0, data: [] },
        investment: { amount: 0, data: [] },
    });
    const [spendingGroupedByTags, setSpendingGroupedByTags] = useState<Map<SpendingTagTypes, TransactionGroupType>>(new Map());
    const [incomeGroupedByTags, setIncomeGroupedByTags] = useState<Map<IncomeTagTypes, TransactionGroupType>>(new Map());
    const [investmentGroupedByTags, setInvestmentGroupedByTags] = useState<Map<InvestmentTagTypes, TransactionGroupType>>(new Map());

    const [accountPieData, setAccountPieData] = useState<PieDataItemWithLabelType[]>([]);
    const [accountBarData, setAccountBarData] = useState<barDataItem[]>([]);

    const [investmentPieData, setInvestmentPieData] = useState<PieDataItemWithLabelType[]>([]);
    const [transactionPieData, setTransactionPieData] = useState<PieDataItemWithLabelType[]>([]);

    const [investmentBarData, setInvestmentBarData] = useState<barDataItem[]>([]);
    const [transactionBarData, setTransactionBarData] = useState<barDataItem[]>([]);

    const [investmentGroupPieData, setInvestmentGroupPieData] = useState<PieDataItemWithLabelType[]>([]);
    const [incomeGroupPieData, setIncomeGroupPieData] = useState<PieDataItemWithLabelType[]>([]);
    const [spendingGroupPieData, setSpendingGroupPieData] = useState<PieDataItemWithLabelType[]>([]);

    const [investmentGroupBarData, setInvestmentGroupBarData] = useState<barDataItem[]>([]);
    const [incomeGroupBarData, setIncomeGroupBarData] = useState<barDataItem[]>([]);
    const [spendingGroupBarData, setSpendingGroupBarData] = useState<barDataItem[]>([]);

    const [transactionDoesExist, setTransactionDoesExist] = useState<boolean>(false);
    const [clickedCategory, setClickedCategory] = useState<CategoryTypes>("income");
    const [transactions, setTransactions] = useState<TransactionDataType[]>([]);
    const [slideViewVisible, setSlideViewVisible] = useState<boolean>(false);

    const [selectedAccountChart, setSelectedAccountChart] = useState<ChartTypeNames>("Bar");
    const [selectedInvestmentChart, setSelectedInvestmentChart] = useState<ChartTypeNames>("Bar");
    const [selectedTransactionChart, setSelectedTransactionChart] = useState<ChartTypeNames>("Bar");
    const [selectedInvestmentGroupChart, setSelectedInvestmentGroupChart] = useState<ChartTypeNames>("Bar");
    const [selectedIncomeGroupChart, setSelectedIncomeGroupChart] = useState<ChartTypeNames>("Bar");
    const [selectedSpendingGroupChart, setSelectedSpendingGroupChart] = useState<ChartTypeNames>("Bar");

    const [selectedAccountChartData, setSelectedAccountChartData] = useState<any[]>([]);
    const [selectedInvestmentChartData, setSelectedInvestmentChartData] = useState<any[]>([]);
    const [selectedTransactionChartData, setSelectedTransactionChartData] = useState<any[]>([]);
    const [selectedInvestmentGroupChartData, setSelectedInvestmentGroupChartData] = useState<any[]>([]);
    const [selectedIncomeGroupChartData, setSelectedIncomeGroupChartData] = useState<any[]>([]);
    const [selectedSpendingGroupChartData, setSelectedSpendingGroupChartData] = useState<any[]>([]);

    const updateCategoryTransactionsAndViewModal = (t: CategoryTypes) => {
        const result: TransactionDataType[] = [];
        const records = groupedByDate.get(currentDate.toString());
        if (records) {
            records.forEach(tx => {
                if (tx.category === t) {
                    result.push(tx);
                }
            })
        }
        setTransactions(result);
        setSlideViewVisible(true);
    }

    // Calculates the amounts for each category
    const calculateAllAmountsFromLogs = () => {
        const addToMap = (map: Map<SpendingTagTypes | IncomeTagTypes | InvestmentTagTypes, TransactionGroupType>, tx: TransactionDataType) => {
            if (!map.has(tx.tag)) {
                map.set(tx.tag, {
                    amount: Number(tx.amount),
                    data: [tx]
                });
            } else {
                const currentValue = map.get(tx.tag);
                if (currentValue) {
                    map.set(tx.tag, {
                        amount: currentValue.amount + Number(tx.amount),
                        data: [...currentValue.data, tx]
                    });
                }
            }
        }

        let spending = 0;
        let spendingList: TransactionDataType[] = [];
        let incomeList: TransactionDataType[] = [];
        let investmentList: TransactionDataType[] = [];
        let income = 0;
        let investment = 0;
        let transactions = groupedByDate.get(currentDate.toString());
        let spendingGroup = new Map<SpendingTagTypes, TransactionGroupType>();
        let incomeGroup = new Map<IncomeTagTypes, TransactionGroupType>();
        let investmentGroup = new Map<InvestmentTagTypes, TransactionGroupType>();

        let investPieGroupData: PieDataItemWithLabelType[] = [];
        let incPieGroupData: PieDataItemWithLabelType[] = [];
        let spePieGroupData: PieDataItemWithLabelType[] = [];

        let investBarGroupData: barDataItem[] = [];
        let incBarGroupData: barDataItem[] = [];
        let speBarGroupData: barDataItem[] = [];

        if (transactions) {
            for (const tx of transactions) {
                if (tx.category === "spending") {
                    spending += Number(tx.amount);
                    spendingList.push(tx);
                    addToMap(spendingGroup, tx);
                } else if (tx.category === "income") {
                    income += Number(tx.amount);
                    incomeList.push(tx);
                    addToMap(incomeGroup, tx);
                } else {
                    investment += Number(tx.amount);
                    investmentList.push(tx);
                    addToMap(investmentGroup, tx);
                }
            }
        }
        setAmountBreakdown({
            income: { amount: income, data: incomeList },
            spending: { amount: spending, data: spendingList },
            investment: { amount: investment, data: investmentList }
        });

        spendingGroup.forEach((value, key) => spePieGroupData.push({ label: key, item: generatePieData<SpendingTagTypes>(value.amount, key) }));
        incomeGroup.forEach((value, key) => incPieGroupData.push({ label: key, item: generatePieData<IncomeTagTypes>(value.amount, key) }));
        investmentGroup.forEach((value, key) => investPieGroupData.push({ label: key, item: generatePieData<InvestmentTagTypes>(value.amount, key) }));

        spendingGroup.forEach((value, key) => speBarGroupData.push(generateBarData<SpendingTagTypes>(value.amount, key)));
        incomeGroup.forEach((value, key) => incBarGroupData.push(generateBarData<IncomeTagTypes>(value.amount, key)));
        investmentGroup.forEach((value, key) => investBarGroupData.push(generateBarData<InvestmentTagTypes>(value.amount, key)));

        setSpendingGroupedByTags(spendingGroup);
        setIncomeGroupedByTags(incomeGroup);
        setInvestmentGroupedByTags(investmentGroup);

        setAccountPieData([
            { label: "income", item: generatePieData<CategoryTypes>(income, "income") },
            { label: "spending", item: generatePieData<CategoryTypes>(spending, "spending") },
            { label: "investment", item: generatePieData<CategoryTypes>(investment, "investment") }
        ])
        setTransactionPieData([
            { label: "income", item: generatePieData<CategoryTypes>(income, "income") },
            { label: "spending", item: generatePieData<CategoryTypes>(spending, "spending") }
        ]);
        setInvestmentPieData([
            { label: "income", item: generatePieData<CategoryTypes>(income, "income") },
            { label: "investment", item: generatePieData<CategoryTypes>(investment, "investment") }
        ]);
        setIncomeGroupPieData(incPieGroupData);
        setSpendingGroupPieData(spePieGroupData);
        setInvestmentGroupPieData(investPieGroupData);

        setAccountBarData([
            generatePieData<CategoryTypes>(income, "income"),
            generatePieData<CategoryTypes>(spending, "spending"),
            generateBarData<CategoryTypes>(investment, "investment")
        ])
        setTransactionBarData([
            generatePieData<CategoryTypes>(income, "income"),
            generatePieData<CategoryTypes>(spending, "spending")
        ]);
        setInvestmentBarData([
            generateBarData<CategoryTypes>(income, "income"),
            generateBarData<CategoryTypes>(investment, "investment")
        ]);
        setIncomeGroupBarData(incBarGroupData);
        setSpendingGroupBarData(speBarGroupData);
        setInvestmentGroupBarData(investBarGroupData);
    }

    useEffect(() => {
        const updatedTransactions = groupedByDate.get(currentDate.toString());
        const newList: TransactionDataType[] = [];
        if (updatedTransactions) {
            updatedTransactions.forEach((tx) => {
                if (tx.category === clickedCategory) {
                    newList.push(tx);
                }
            })
        }
        setTransactions(newList);

        // Ensures calculation is only done when there is at least one recorded transaction for the day
        if (groupedByDate.has(currentDate.toString()) && groupedByDate.get(currentDate.toString())) {
            calculateAllAmountsFromLogs();
            setTransactionDoesExist(true);
        }
    }, [groupedByDate])

    useEffect(() => {
        if (selectedAccountChart === "Bar") {
            setSelectedAccountChartData(accountBarData);
        } else if (selectedAccountChart === "Pie") {
            setSelectedAccountChartData(accountPieData);
        }
    }, [selectedAccountChart])

    useEffect(() => {
        if (selectedInvestmentChart === "Bar") {
            setSelectedInvestmentChartData(investmentBarData);
        } else if (selectedInvestmentChart === "Pie") {
            setSelectedInvestmentChartData(investmentPieData);
        }
    }, [selectedInvestmentChart])

    useEffect(() => {
        if (selectedTransactionChart === "Bar") {
            setSelectedTransactionChartData(transactionBarData);
        } else if (selectedTransactionChart === "Pie") {
            setSelectedTransactionChartData(transactionPieData);
        }
    }, [selectedTransactionChart])

    useEffect(() => {
        if (selectedIncomeGroupChart === "Bar") {
            setSelectedIncomeGroupChartData(incomeGroupBarData);
        } else if (selectedIncomeGroupChart === "Pie") {
            setSelectedIncomeGroupChartData(incomeGroupPieData);
        }
    }, [selectedIncomeGroupChart])

    useEffect(() => {
        if (selectedSpendingGroupChart === "Bar") {
            setSelectedSpendingGroupChartData(spendingGroupBarData);
        } else if (selectedSpendingGroupChart === "Pie") {
            setSelectedSpendingGroupChartData(spendingGroupPieData);
        }
    }, [selectedSpendingGroupChart])

    useEffect(() => {
        if (selectedInvestmentGroupChart === "Bar") {
            setSelectedInvestmentGroupChartData(investmentGroupBarData);
        } else if (selectedInvestmentGroupChart === "Pie") {
            setSelectedInvestmentGroupChartData(investmentGroupPieData);
        }
    }, [selectedInvestmentGroupChart])

    return (
        <View style={styles.container}>
            <View>
                {transactionDoesExist ?
                    <ScrollView showsVerticalScrollIndicator={false}>
                        {/*Account Overview*/}
                        <ChartOverview
                            title={"Account Overview"}
                            selectedChart={selectedAccountChart}
                            selectedChartData={selectedAccountChartData}
                            setSelectedChart={setSelectedAccountChart}
                            chartSelectionList={["Bar", "Pie"]} />

                        {/*Transaction Overview*/}
                        <ChartOverview
                            title={"Transaction Overview"}
                            selectedChart={selectedTransactionChart}
                            selectedChartData={selectedTransactionChartData}
                            setSelectedChart={setSelectedTransactionChart}
                            chartSelectionList={["Bar", "Pie"]} />

                        {/*Income Overview*/}
                        <ChartOverview
                            title={"Income Overview"}
                            selectedChart={selectedIncomeGroupChart}
                            selectedChartData={selectedIncomeGroupChartData}
                            setSelectedChart={setSelectedIncomeGroupChart}
                            chartSelectionList={["Bar", "Pie"]} />

                        {/*Spending Overview*/}
                        <ChartOverview
                            title={"Spending Overview"}
                            selectedChart={selectedSpendingGroupChart}
                            selectedChartData={selectedSpendingGroupChartData}
                            setSelectedChart={setSelectedSpendingGroupChart}
                            chartSelectionList={["Bar", "Pie"]} />

                        {/*Investment Overview*/}
                        <ChartOverview
                            title={"Investment Overview"}
                            selectedChart={selectedInvestmentChart}
                            selectedChartData={selectedInvestmentChartData}
                            setSelectedChart={setSelectedInvestmentChart}
                            chartSelectionList={["Bar", "Pie"]} />
                        <ChartOverview
                            selectedChart={selectedInvestmentGroupChart}
                            selectedChartData={selectedInvestmentGroupChartData}
                            setSelectedChart={setSelectedInvestmentGroupChart}
                            chartSelectionList={["Bar", "Pie"]} />
                    </ScrollView>
                    :
                    <View style={{
                        height: "100%",
                        justifyContent: "center",
                        alignItems: "center",
                    }}>
                        <ThemedText style={{
                            textAlign: "center",
                            fontSize: 20
                        }}>No transactions for the day</ThemedText>
                    </View>
                }
            </View>
            <SlideDailyTransaction
                visible={slideViewVisible}
                setVisible={setSlideViewVisible}
                currentDate={currentDate}
                transactions={transactions}
                removeTransaction={removeTransaction}
                editTransaction={editTransaction} />
        </View>
    )
}

const SlideDailyTransaction: React.FC<{
    visible: boolean;
    setVisible: React.Dispatch<React.SetStateAction<boolean>>;
    currentDate: Date;
    transactions: TransactionDataType[];
    removeTransaction: (id: string) => void;
    editTransaction: (t: TransactionDataType) => void;
}> = ({ visible, setVisible, currentDate, transactions, editTransaction, removeTransaction }) => {
    const theme = useTheme();

    {/* Slide Animation */ }
    const screenHeight = Dimensions.get("screen").height;
    const translateY = useSharedValue<number>(screenHeight);
    const animatedStyle = useAnimatedStyle(() => ({
        transform: [{ translateY: translateY.value }]
    }));

    const [isVisible, setIsVisible] = useState<boolean>(false);
    const [selectedTransaction, setSelectedTransaction] = useState<TransactionDataType>(getDefaultTransactionValue(currentDate));

    useEffect(() => {
        if (!visible) return;

        translateY.value = withSequence(
            withTiming(screenHeight, { duration: STANDARD_ANIMATION_DURATION }),
            withTiming(0, { duration: STANDARD_ANIMATION_DURATION })
        );
    }, [currentDate, transactions])

    return (
        <AnimatedView
            pointerEvents={visible ? 'auto' : 'none'}
            style={[
                {
                    backgroundColor: theme.colors.muted,
                    position: "absolute",
                    width: "100%",
                    bottom: 0,
                    borderTopRightRadius: 12,
                    borderTopLeftRadius: 12,
                    padding: 16,
                    paddingBottom: 30,
                    zIndex: 1000,
                    elevation: 5,
                    shadowColor: "#fff",
                    shadowOpacity: 0.5,
                    shadowRadius: 20,
                    maxHeight: "50%"
                },
                animatedStyle
            ]}>
            <View style={{ flexDirection: "row-reverse" }}>
                <FadingPressable onPress={() => {
                    translateY.value = withTiming(500, { duration: 200 }, () => {
                        'worklet';
                        runOnJS(setVisible)(false);
                    });
                }}>
                    <X color={'grey'} width={20} style={{ padding: 5 }} />
                </FadingPressable>
            </View>
            {
                transactions.length === 0 ?
                    <View style={{
                        backgroundColor: theme.colors.background,
                        borderRadius: 10,
                        padding: 10,
                        marginTop: 10
                    }}>
                        <ThemedText style={{
                            textAlign: "center",
                            fontSize: 16,
                        }}>No Transactions were recorded this day!</ThemedText>
                    </View>
                    : <View>
                        <View style={{ paddingBottom: 20 }}>
                            <ThemedText
                                style={{
                                    textAlign: "center",
                                    fontSize: 16,
                                    fontWeight: "bold",
                                }}>
                                Transactions for {Months[currentDate.getMonth()]} {currentDate.getDate()}, {currentDate.getFullYear()}
                            </ThemedText>
                        </View>
                        <ScrollView style={{
                            backgroundColor: theme.colors.background,
                            borderRadius: 10,
                            padding: 10,
                            gap: 10,
                        }}>
                            {transactions.map((val) => (
                                <TransactionItem
                                    key={val.id}
                                    setDetails={setSelectedTransaction}
                                    setIsVisible={setIsVisible}
                                    transaction={val}
                                    removeTransaction={removeTransaction} />
                            ))}
                            <TransactionModal
                                isVisibleState={[isVisible, setIsVisible]}
                                detailsState={[selectedTransaction, setSelectedTransaction]}
                                onSubmit={() => {
                                    editTransaction(selectedTransaction);
                                    setIsVisible(false);
                                }} />
                        </ScrollView>
                    </View>
            }
        </AnimatedView>
    );
};

