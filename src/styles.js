import {
    StyleSheet
} from "react-native";

export const styles = StyleSheet.create({
    container: {
        height: 150
    },
    scrollView: {
        height: 120
    },
    scrollViewContentContainer: {
        flexDirection: "column",
    },
    timeContainer: {
        justifyContent: "space-between",
        flexDirection: "row",
        width: "100%",
        height: 30
    },
    trackContainer: {
        backgroundColor: "rgba(0,0,0,0.3)",
        marginTop: 10,
        height: 100
    },
    framesContainer: {
        flexDirection: "row",
        flex: 1
    },

    frameImage: {
        position: "relative",
        height: "100%"
    },

    leftHandle: {
        borderBottomLeftRadius: 5,
        justifyContent: "center",
        borderTopLeftRadius: 5,
        alignItems: "center",
        position: "absolute",
        height: "102%",
        bottom: "-1%",
        zIndex: 99
    },
    rightHandle: {
        borderBottomRightRadius: 5,
        justifyContent: "center",
        borderTopRightRadius: 5,
        alignItems: "center",
        position: "absolute",
        height: "102%",
        bottom: "-1%",
        zIndex: 99
    },

    centerLine: {
        backgroundColor: "white",
        height: "19%",
        width: 1.5,
        zIndex: 99
    },

    topLine: {
        position: "absolute",
        top: "-2%",
        height: 3,
        zIndex: 99
    },
    bottomLine: {
        position: "absolute",
        bottom: "-2%",
        height: 3,
        zIndex: 99
    },

    mask: {
        backgroundColor: "rgba(0,0,0,0.5)",
        position: "absolute",
        height: "100%",
        zIndex: 1
    }
});

export const timeStapStyles = StyleSheet.create({
    container: {
        justifyContent: "flex-end",
        alignItems: "center",
    },
    line: {
        backgroundColor: "black",
        width: 1
    }
});