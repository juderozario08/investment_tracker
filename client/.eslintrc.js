module.exports = {
    root: true,
    plugins: [
        "react-hooks"
    ],
    extends: [
        "@react-native"
    ],
    rules: {
        "react-hooks/rules-of-hooks": "error",
        "react-hooks/exhaustive-deps": "warn"
    }
};
