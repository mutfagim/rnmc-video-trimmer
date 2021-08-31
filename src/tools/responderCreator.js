import {
    PanResponder
} from "react-native";

const responderSettings = {
    onStartShouldSetPanResponderCapture: () => true,
    onMoveShouldSetPanResponderCapture: () => true,
    onPanResponderTerminationRequest: () => false,
    onStartShouldSetPanResponder: () => true,
    onShouldBlockNativeResponder: () => true,
    onMoveShouldSetPanResponder: () => true,
};

const responderCreator = ({
    onPanResponderRelease,
    onPanResponderGrant,
    onPanResponderMove,
}) => {
    return PanResponder.create({
        onPanResponderGrant: () => onPanResponderGrant(),
        onPanResponderMove: (event, gestureState) => onPanResponderMove({
            event,
            gestureState,
        }),
        onPanResponderRelease: () => onPanResponderRelease(),
        ...responderSettings
    });
};
export default responderCreator;