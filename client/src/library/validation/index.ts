import { TransactionInvestTagOptions, TransactionSpendingTagOptions, TransactionIncomeTagOptions } from "../constants";

export const validateCategory = (category: string) => {
    return category === 'spending' || category === 'income' || category === 'investment'
}

export const validateTag = (tag: string) => {
    for (const investment of TransactionInvestTagOptions) {
        if (tag === investment.value) {
            return true
        }
    }
    for (const income of TransactionIncomeTagOptions) {
        if (tag === income.value) {
            return true
        }
    }
    for (const spending of TransactionSpendingTagOptions) {
        if (tag === spending.value) {
            return true
        }
    }
    return false;
}

export const validateName = (name: string) => {
    return name.length >= 2;
}

export const validateAmount = (amount: string) => {
    return Number(amount) > 0;
}
