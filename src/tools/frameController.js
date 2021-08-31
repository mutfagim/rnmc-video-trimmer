import {
    maxValueController
} from "../utils";

const frameController = ({
    _setFramesImages,
    totalDuration,
    framesImages,
    zoomValue
}) => {
    const framesLength = framesImages.length - 1;

    const startFrame = framesImages[0];
    const endFrame = framesImages[framesLength];
    const anotherFrames = [];

    const maxValue = maxValueController(totalDuration / 60, 20);

    const showFrameCount = totalDuration < 60 ? 8 : Math.round((
        (
            zoomValue === 0 ? 1 :
                zoomValue >= maxValue - 0.5 ? maxValue
                    : zoomValue
        ) * framesLength) / maxValue);

    if (showFrameCount) {
        for (let index = 0; index < framesLength; index++) {
            const increase = Math.round(framesLength / index);
            if (increase <= showFrameCount) {

                for (let i = 2; i < framesLength; i++) {
                    const frame = framesImages[i];
                    if ((i / index) % 1 === 0 && frame !== startFrame) anotherFrames.push(frame);
                }
                break;
            }
        };
        _setFramesImages([
            startFrame,
            ...anotherFrames,
            endFrame
        ]);
    }
};
export default frameController;