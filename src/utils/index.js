
import {
    segmentSize
} from "../constants";

export const maxValueController = (value, maxValue) => value > maxValue ? maxValue : value;

export const valueEqualizer = ({
    setLastRightX,
    setLastLeftX,
    rightX,
    leftX
}) => {
    setLastRightX(rightX._value);
    setLastLeftX(leftX._value);
    rightX.flattenOffset();
    leftX.flattenOffset();
}

export const spaceCalulator = ({
    spaceSecond,
    duration,
    maxLine
}) => {
    return (maxLine * spaceSecond) / duration;
}

export const resizeControlArea = ({
    handlerSize,
    zoomValue,
    padding,
    width
}) => {
    const newMaxline = ((zoomValue + 1) * (width - (padding * 2))) - handlerSize;
    const newFullWidth = (zoomValue + 1) * (width - (padding * 2));
    return {
        newFullWidth: newFullWidth,
        newMaxline: newMaxline
    };
};

export const setInitialPositions = ({
    totalDuration,
    setLastRightX,
    rightPosition,
    setLastLeftX,
    leftPosition,
    maxLine,
    rightX,
    leftX
}) => {
    if (typeof leftPosition !== "undefined") {
        const leftPositionTypeForSecond = ((maxLine) * leftPosition) / totalDuration;
        leftX.setValue(leftPositionTypeForSecond);
        setLastLeftX(leftPositionTypeForSecond);
    };

    if (typeof rightPosition !== "undefined") {
        const rightPositionTypeForSecond = ((maxLine) * rightPosition) / totalDuration;
        rightX.setValue(rightPositionTypeForSecond);
        setLastRightX(rightPositionTypeForSecond);
    };
};

export const updatePositions = ({
    totalDuration,
    setPositions,
    lastRightX,
    lastLeftX,
    maxLine
}) => {
    totalDuration = Math.round(totalDuration);
    const rightSecond = (lastRightX * totalDuration) / (maxLine);
    const leftSecond = (lastLeftX * totalDuration) / (maxLine);
    setPositions({
        rightPosition: Math.round(rightSecond),
        leftPosition: Math.round(leftSecond)
    });
};

export const maxLineCalculator = (maxLine) => maxLine - 22;

export const stapsDetector = (staps, maxLine, duration) => {
    let stapIndex = 0;
    while (stapIndex < staps.length) {
        const currentStap = staps[stapIndex];

        /* Eğer bir saniye stapi işlemi başarıyla tamamlıyorsa  */
        const isFill = stapSimulator(currentStap, maxLine, duration);
        if (isFill.status) return {
            totalSegmentSize: isFill.totalSegmentSize,
            segmentCount: isFill.segmentCount,
            stap: currentStap
        };

        ++stapIndex;
    };
};

export const stapSimulator = (stap, maxLine, duration) => {
    const howManyNeed = Math.floor(duration / stap);
    const totalSegmentSize = howManyNeed * segmentSize;
    return {
        status: totalSegmentSize < maxLine,
        totalSegmentSize: totalSegmentSize,
        segmentCount: howManyNeed
    };
};

export const segmentsCreator = (detectedStap, maxLine, duration) => {
    const segments = [];
    const {
        segmentCount,
        stap
    } = detectedStap;

    /* Segmentleri oluşturmak için */
    let currentSegmentCount = 0;
    while (currentSegmentCount <= segmentCount) {
        const currentSecond = currentSegmentCount * stap;

        if (currentSecond < 60) segments.push(segmentTimeCreator(currentSecond, 0));
        else {
            const minute = Math.floor(currentSecond / 60);
            const second = currentSecond - (minute * 60);
            segments.push(segmentTimeCreator(second, minute));
        }
        ++currentSegmentCount;
    }

    /* Eğer küsürat varsa onun için padding hazırlamak için */
    let paddingRight = 0;
    const isHaveRemaining = duration - segmentCount * stap;

    if (isHaveRemaining > 0) paddingRight = (isHaveRemaining * maxLine) / duration

    return {
        segments: segments,
        paddingRight: paddingRight,
    };
};

export const segmentTimeCreator = (second, minute) => {
    minute = minute < 10 ? `0${minute}` : minute;
    second = second < 10 ? `0${second}` : second;
    return `${minute}:${second}`;
};

export const lineWidthCalculator = ({
    handlerSize,
    rightX,
    leftX
}) => (rightX - leftX) - handlerSize;

export const linePositionCalculator = ({
    leftX,
    handlerSize
}) => leftX + handlerSize;

export const maskWidthCalculator = ({
    startX,
    endX
}) => endX - startX;