const spaceResizer = ({
    reference = "left",
    setLastRightX,
    setLastLeftX,
    handlerSize,
    newMaxline,
    zoomValue,
    fullWidth,
    minSpace,
    maxSpace,
    rightX,
    leftX
}) => {
    const [
        rightValue,
        leftValue
    ] = [
            rightX._value,
            leftX._value
        ];
    zoomValue = zoomValue + 1;

    const isRightValueOut = parseInt(rightValue) >= parseInt(newMaxline);
    const isLeftValueOut = leftValue <= 0;

    const isMinSpaceExceeded = (rightValue - leftValue) <= minSpace || leftValue > rightValue;
    const isMaxSpaceExceeded = (rightValue - leftValue) >= maxSpace;

    const setRightXValue = (newValue) => rightX.setValue(newValue);
    const setLeftXValue = (newValue) => leftX.setValue(newValue);

    const spaceResize = (type) => {
        if (type === "left") {
            if (isMaxSpaceExceeded) setRightXValue(leftValue + maxSpace);
            else if (isMinSpaceExceeded) setRightXValue(leftValue + minSpace);
            else return true;
        }
        else {
            if (isMaxSpaceExceeded) setLeftXValue(rightValue - maxSpace);
            else if (isMinSpaceExceeded) {
                const _leftValue = rightValue - minSpace;
                if (_leftValue <= 0) {
                    setLeftXValue(0);
                    setRightXValue(minSpace);
                }
                else setLeftXValue(_leftValue);
            }
            else return true;
        }
    };

    if (isLeftValueOut) {
        spaceResize("left");
        if(!isRightValueOut) return null;
    }
    if (isRightValueOut) {
        setRightXValue(newMaxline);
        spaceResize("right");
    }
    else {
        const isNotExceeded = spaceResize(reference);
        if (isNotExceeded) {
            setLeftXValue(
                leftValue > fullWidth - handlerSize ?
                    zoomValue * leftValue :
                    leftValue
            );
            setLastRightX(
                rightValue > fullWidth - handlerSize ?
                    zoomValue * rightValue :
                    rightValue
            );
        }
        return isNotExceeded;
    }

    setLastRightX(rightX._value);
    setLastLeftX(leftX._value);
};
export default spaceResizer;