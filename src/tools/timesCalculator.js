import {
    maxLineCalculator,
    segmentsCreator,
    stapsDetector
} from "../utils";
import {
    timeStaps
} from "../constants";

const timesCalculator = (duration, maxLine) => {
    maxLine = Math.round(maxLineCalculator(maxLine));
    duration = Math.round(duration);

    const detectedStap = stapsDetector(timeStaps, maxLine, duration);
    const creatingSegments = segmentsCreator(detectedStap, maxLine, duration);
    
    return {
        paddingRight: creatingSegments.paddingRight,
        segments: creatingSegments.segments
    }
};
export default timesCalculator;