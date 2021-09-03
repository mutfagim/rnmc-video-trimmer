import React, {
    useImperativeHandle,
    forwardRef,
    useEffect,
    useState,
    useRef,
    useMemo
} from "react";
import {
    ScrollView,
    Dimensions,
    Animated,
    Image,
    View,
    Text
} from "react-native";
import {
    responderCreator,
    frameController,
    timesCalculator,
    spaceResizer,
    masksResizer,
    lineResizer,
    onMoveRight,
    onMoveLeft
} from "./tools";
import {
    setInitialPositions,
    maxValueController,
    resizeControlArea,
    updatePositions,
    spaceCalulator,
    valueEqualizer
} from "./utils";
import {
    timeStapStyles,
    styles
} from "./styles";

const {
    width
} = Dimensions.get("window");

const Trimmer = ({
    handlerColor = "#FFCA39",
    maxSpaceSecond = 300,
    minSpaceSecond = 10,
    framesImages = [],
    handlerSize = 8,
    timeStapsStyle,
    zoomValue = 0,
    rightPosition,
    onChangeEvent,
    totalDuration,
    setPositions,
    leftPosition,
    padding = 10,
    radius = 8,

}, ref) => {
    const [times, setTimes] = useState([]);
    const [remainingTimesPadding, setRemainingTimesPadding] = useState(0);
    const [_framesImages, _setFramesImages] = useState([]);

    const [fullWidth, setFullWidth] = useState(width - (padding * 2));
    const [maxLine, setMaxLine] = useState(fullWidth - handlerSize);

    const [lastLeftX, setLastLeftX] = useState(0);
    const [lastRightX, setLastRightX] = useState(maxLine);

    const [minSpaceWidth, setMinSpaceWidth] = useState(spaceCalulator({
        spaceSecond: minSpaceSecond,
        duration: totalDuration,
        maxLine: maxLine
    }));
    const [maxSpaceWidth, setMaxSpaceWidth] = useState(maxSpaceSecond);

    const [spaceResizerRef, setSpaceResizerRef] = useState("left");

    const leftX = useRef(new Animated.Value(lastLeftX)).current;
    const rightX = useRef(new Animated.Value(lastRightX)).current;

    const lineWidth = useRef(new Animated.Value((rightX._value - leftX._value) - handlerSize)).current;
    const lineX = useRef(new Animated.Value(rightX._value + handlerSize)).current;

    const leftMaskWidth = useRef(new Animated.Value(0)).current;
    const leftMaskX = useRef(new Animated.Value(0)).current;

    const rightMaskWidth = useRef(new Animated.Value(0)).current;
    const rightMaskX = useRef(new Animated.Value(0)).current;

    const leftPanResponder = responderCreator({
        onPanResponderGrant: () => onChangeEvent("leftResponderStart"),
        onPanResponderMove: ({
            gestureState
        }) => onMoveLeft({
            minSpace: minSpaceWidth,
            maxSpace: maxSpaceWidth,
            gestureState,
            handlerSize,
            lastLeftX,
            maxLine,
            rightX,
            leftX
        }),
        onPanResponderRelease: () => {
            onChangeEvent("leftResponderEnd");
            valueEqualizer({
                setLastRightX,
                setLastLeftX,
                rightX,
                leftX
            });
        }
    });

    const rightPanResponder = responderCreator({
        onPanResponderGrant: () => onChangeEvent("rightResponderStart"),
        onPanResponderMove: ({
            gestureState
        }) => onMoveRight({
            minSpace: minSpaceWidth,
            maxSpace: maxSpaceWidth,
            gestureState,
            handlerSize,
            lastRightX,
            maxLine,
            rightX,
            leftX
        }),
        onPanResponderRelease: () => {
            onChangeEvent("rightResponderEnd");
            valueEqualizer({
                setLastRightX,
                setLastLeftX,
                rightX,
                leftX
            });
        },
    });

    const masksAndLinesResize = ({
        rightMaskWidth,
        leftMaskWidth,
        handlerSize,
        rightMaskX,
        fullWidth,
        lineWidth,
        rightX,
        lineX,
        leftX,
    }) => {
        masksResizer({
            rightMaskWidth,
            leftMaskWidth,
            rightMaskX,
            fullWidth,
            rightX,
            leftX
        });
        lineResizer({
            handlerSize,
            lineWidth,
            rightX,
            leftX,
            lineX
        });
    };

    useEffect(() => {
        setInitialPositions({
            totalDuration,
            setLastRightX,
            rightPosition,
            leftPosition,
            setLastLeftX,
            handlerSize,
            maxLine,
            rightX,
            leftX
        });

        const leftXListener = leftX.addListener((value) => masksAndLinesResize({
            rightX: rightX._value,
            leftX: value.value,
            rightMaskWidth,
            leftMaskWidth,
            handlerSize,
            rightMaskX,
            lineWidth,
            fullWidth,
            lineX
        }));
        const rightXListener = rightX.addListener((value) => masksAndLinesResize({
            rightX: value.value,
            leftX: leftX._value,
            rightMaskWidth,
            leftMaskWidth,
            handlerSize,
            rightMaskX,
            lineWidth,
            fullWidth,
            lineX
        }));

        return () => {
            leftX.removeListener(leftXListener);
            rightX.removeListener(rightXListener);
        };
    }, [fullWidth]);

    useEffect(() => {
        const {
            newFullWidth,
            newMaxline
        } = resizeControlArea({
            handlerSize,
            zoomValue,
            padding,
            width
        });

        const newMinSpace = spaceCalulator({
            spaceSecond: minSpaceSecond,
            duration: totalDuration,
            maxLine: maxLine
        });
        const newMaxSpace = spaceCalulator({
            spaceSecond: maxSpaceSecond,
            duration: totalDuration,
            maxLine: maxLine
        });

        setFullWidth(newFullWidth);
        setMaxLine(newMaxline);

        setMinSpaceWidth(newMinSpace);
        setMaxSpaceWidth(newMaxSpace);

        spaceResizer({
            reference: spaceResizerRef,
            minSpace: newMinSpace,
            maxSpace: newMaxSpace,
            setLastRightX,
            setLastLeftX,
            handlerSize,
            newMaxline,
            zoomValue,
            fullWidth,
            rightX,
            leftX,
        });

        masksAndLinesResize({
            fullWidth: newFullWidth,
            rightX: rightX._value,
            leftX: leftX._value,
            rightMaskWidth,
            leftMaskWidth,
            handlerSize,
            rightMaskX,
            lineWidth,
            lineX,
        });

        /* Use Memo Kullanılacak */
        const newTimes = timesCalculator(totalDuration, newMaxline);
        if (JSON.stringify(times) !== JSON.stringify(newTimes)) {
            setTimes(newTimes.segments);
            setRemainingTimesPadding(newTimes.paddingRight)
        };
    }, [zoomValue, lastLeftX, lastRightX, leftX._value, rightX._value, totalDuration]);

    useEffect(() => {
        updatePositions({
            totalDuration,
            setPositions,
            lastRightX: rightX._value,
            lastLeftX: leftX._value,
            maxLine
        });
    }, [leftX._value, rightX._value, maxLine]);

    useEffect(() => {
        if (framesImages && framesImages.length) {
            frameController({
                _setFramesImages,
                framesImages,
                totalDuration,
                zoomValue
            });
        };
    }, [framesImages, zoomValue]);

    useImperativeHandle(ref, () => ({
        setLeftHandle: (leftSecond, rightSecond) => {
            setSpaceResizerRef("left");
            setInitialPositions({
                rightPosition: rightSecond,
                leftPosition: leftSecond,
                minSpace: minSpaceWidth,
                maxSpace: maxSpaceWidth,
                totalDuration,
                setLastRightX,
                setLastLeftX,
                handlerSize,
                zoomValue,
                fullWidth,
                maxLine,
                rightX,
                leftX
            })
        },
        setRightHandle: (leftSecond, rightSecond) => {
            setSpaceResizerRef("right");
            setInitialPositions({
                rightPosition: rightSecond,
                leftPosition: leftSecond,
                minSpace: minSpaceWidth,
                maxSpace: maxSpaceWidth,
                totalDuration,
                setLastRightX,
                setLastLeftX,
                handlerSize,
                zoomValue,
                fullWidth,
                maxLine,
                rightX,
                leftX
            })
        }
    }));

    const handlerStyle = {
        backgroundColor: handlerColor,
        width: handlerSize,
    };
    const leftTransformStyle = {
        alignItems: "flex-start",
        width: handlerSize * 2,
        transform: [
            {
                translateX: leftX
            }
        ]
    };
    const rightTransformStyle = {
        alignItems: "flex-start",
        width: handlerSize * 2,
        transform: [
            {
                translateX: rightX
            }
        ]
    };
    const lineTransformStyle = {
        backgroundColor: handlerColor,
        width: lineWidth,
        left: lineX
    };
    const leftMaskTransformStyle = {
        borderBottomLeftRadius: radius,
        borderTopLeftRadius: radius,
        width: leftMaskWidth,
        left: leftMaskX,
    };
    const rightMaskTransformStyle = {
        borderBottomRightRadius: radius,
        borderTopRightRadius: radius,
        width: rightMaskWidth,
        left: rightMaskX
    };

    const timesMap = useMemo(() => times.map((item, index) => {
        const isMinute = item.type === "minute";

        return <View
            style={timeStapStyles.container}
        >
            <Text
                style={[
                    {
                        fontSize: isMinute ? 10 : 8,
                        bottom: isMinute ? 3 : 0
                    },
                    timeStapsStyle
                ]}
                key={index}
            >
                {item}
            </Text>
            <View
                style={[
                    timeStapStyles.line,
                    {
                        height: isMinute ? 10 : 8,
                    }
                ]}
            />
        </View>;
    }), [times]);

    const framesMap = useMemo(() => _framesImages.map((item, index) => {
        const isHaveLeftRadius = index === 0;
        const isHaveRightRadius = index === _framesImages.length - 1;

        const imageStyle = {
            borderBottomRightRadius: isHaveRightRadius ? radius : 0,
            borderBottomLeftRadius: isHaveLeftRadius ? radius : 0,
            borderTopRightRadius: isHaveRightRadius ? radius : 0,
            borderTopLeftRadius: isHaveLeftRadius ? radius : 0,
            width: fullWidth / _framesImages.length,
        };
        return <View
            key={index + "FramesImage"}
        >
            <Image
                source={{
                    uri: item
                }}
                style={[
                    styles.frameImage,
                    imageStyle
                ]}
            />
        </View>
    }), [_framesImages]);

    return <View
        style={styles.container}
    >
        <ScrollView
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={[
                styles.scrollViewContentContainer,
                {
                    width: fullWidth + padding * 2,
                }
            ]}
            style={styles.scrollView}
            horizontal={true}
        >

            <View
                style={[
                    styles.timeContainer,
                    {
                        paddingRight: remainingTimesPadding
                    }
                ]}
            >
                {
                    timesMap
                }
            </View>

            <View
                style={{
                    paddingHorizontal: padding
                }}
            >
                <View
                    style={[
                        styles.trackContainer,
                        {
                            width: fullWidth
                        }
                    ]}
                >
                    <View
                        style={styles.framesContainer}
                    >
                        {
                            framesMap
                        }
                    </View>

                    <Animated.View
                        style={[
                            styles.leftHandle,
                            leftTransformStyle
                        ]}
                        {...leftPanResponder.panHandlers}

                    >
                        <Animated.View
                            style={[
                                styles.leftHandle,
                                handlerStyle
                            ]}
                        >
                            <View
                                style={styles.centerLine}
                            />
                        </Animated.View>
                    </Animated.View>

                    <Animated.View
                        style={[
                            styles.rightHandle,
                            rightTransformStyle,
                        ]}
                        {...rightPanResponder.panHandlers}

                    >
                        <Animated.View
                            style={[
                                styles.rightHandle,
                                handlerStyle
                            ]}
                        >
                            <View
                                style={styles.centerLine}
                            />
                        </Animated.View>
                    </Animated.View>

                    <Animated.View
                        style={[
                            lineTransformStyle,
                            styles.topLine
                        ]}
                    />
                    <Animated.View
                        style={[
                            lineTransformStyle,
                            styles.bottomLine
                        ]}
                    />

                    <Animated.View
                        style={[
                            leftMaskTransformStyle,
                            styles.mask
                        ]}
                    />
                    <Animated.View
                        style={[
                            rightMaskTransformStyle,
                            styles.mask
                        ]}
                    />
                </View>
            </View>
        </ScrollView>
    </View >;
};
export {
    maxValueController
};
export default forwardRef(Trimmer);