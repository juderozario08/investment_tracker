export const capitalizeString = (str: string) => {
    return str.substring(0, 1).toUpperCase() + str.substring(1);
}

export const getStepValue = (max: number, numOfSections: number) => {
    return Math.round(((max + 150) / numOfSections) / 10) * 10;
}

export const getCurrentDate = () => {
    const d = new Date();
    return new Date(d.getFullYear(), d.getMonth(), d.getDate(), 0, 0, 0);
}
