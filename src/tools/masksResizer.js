import {
    maskWidthCalculator
} from "../utils";

const masksResizer = ({
    rightMaskWidth,
    leftMaskWidth,
    rightMaskX,
    fullWidth,
    rightX,
    leftX,
}) => {
    leftMaskWidth.setValue(maskWidthCalculator({
        endX: leftX,
        startX: 0
    }));
    rightMaskWidth.setValue(maskWidthCalculator({
        endX: fullWidth,
        startX: rightX
    }));
    rightMaskX.setValue(rightX);
};
export default masksResizer;