export const onMoveLeft = ({
    gestureState,
    lastLeftX,
    maxSpace,
    minSpace,
    maxLine,
    rightX,
    leftX
}) => {
    const moveX = gestureState.dx + lastLeftX;
    const calculatedMinSpace = rightX._value - minSpace;
    const calculatedMaxSpace = rightX._value - maxSpace;

    if (moveX < 0) leftX.setValue(0);
    else if (moveX > calculatedMinSpace) {
        if (rightX._value >= maxLine) {
            leftX.setValue(calculatedMinSpace);
            rightX.setValue(maxLine);
        }
        else {
            leftX.setValue(moveX);
            rightX.setValue(moveX + minSpace);
        }
    }
    else if (moveX <= calculatedMaxSpace) {
        rightX.setValue(moveX + maxSpace);
        leftX.setValue(moveX);
    }
    else leftX.setValue(moveX);
};

export const onMoveRight = ({
    gestureState,
    lastRightX,
    maxSpace,
    minSpace,
    maxLine,
    rightX,
    leftX
}) => {
    const moveX = gestureState.dx + lastRightX;
    const calculatedMinSpace = leftX._value + minSpace;
    const calculatedMaxSpace = leftX._value + maxSpace;

    if (moveX >= maxLine) rightX.setValue(maxLine)
    else if (moveX < calculatedMinSpace) {
        if (leftX._value <= 0) {
            rightX.setValue(calculatedMinSpace);
        }
        else {
            rightX.setValue(moveX);
            leftX.setValue(moveX - minSpace <= 0 ? 0 : moveX - minSpace);
        }
        rightX.setValue(calculatedMinSpace);
    }
    else if (moveX > calculatedMaxSpace) {
        leftX.setValue(moveX - maxSpace);
        rightX.setValue(moveX);
    }
    else rightX.setValue(moveX);
};