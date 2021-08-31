import {
    linePositionCalculator,
    lineWidthCalculator
} from "../utils";

const lineResizer = ({
    handlerSize,
    lineWidth,
    rightX,
    lineX,
    leftX
}) => {
    lineWidth.setValue(lineWidthCalculator({
        rightX: rightX,
        leftX: leftX,
        handlerSize
    }));
    lineX.setValue(linePositionCalculator({
        handlerSize,
        leftX
    }));
};
export default lineResizer;