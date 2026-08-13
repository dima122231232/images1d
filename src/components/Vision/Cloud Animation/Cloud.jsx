"use client";

import { useEffect, useRef } from "react";

import "./Cloud.css";

const CONFIG = {
    count: 72,
    radius: 1,
    jitter: 0.08,

    size: 90,
    sizeVariance: 0.35,

    spinY: 0.03,
    spinX: 0.008,

    floatAmount: 0.05,
    floatSpeed: 0.3,

    camera: 3.2,
    focalLength: 1000,

    fog: 0.75,
    minOpacity: 0.06,

    grayscale: 0,
    contrast: 1,
    brightness: 1,

    background: "#FFFFFF",

    blur: false,
    blurMax: 4,

    maxImageSize: 420,
    maxDpr: 2,
};

const IMAGE_SOURCES = [
    "/cloud/image-01.jpg",
    "/cloud/image-02.jpg",
    "/cloud/image-03.jpg",
    "/cloud/image-04.jpg",
    "/cloud/image-05.jpg",
    "/cloud/image-06.jpg",
    "/cloud/image-07.jpg",
    "/cloud/image-08.jpg",
];

const CENTER_TEXT =
    "What if we reframed health as our ability to adapt and recover to life’s inevitable challenges?";

const TEXT_MAX_WIDTH = 470;

export default function Cloud() {
    const canvasRef = useRef(null);

    useEffect(() => {
        const canvas = canvasRef.current;
        const ctx = canvas.getContext("2d");

        if (!ctx) return;

        let animationFrame;
        let resizeObserver;

        let width = 0;
        let height = 0;

        let time = 0;
        let lastTime = performance.now();

        const sources = [];
        const tiles = [];
        const items = [];

        const hash = (value) => {
            const x =
                Math.sin(value * 12.9898 + 11 * 78.233) *
                43758.5453123;

            return x - Math.floor(x);
        };

        const createPlaceholder = (index) => {
            const ratios = [
                [300, 400],
                [400, 300],
                [360, 360],
                [280, 420],
                [480, 270],
                [300, 400],
                [240, 427],
                [360, 360],
            ];

            const [
                placeholderWidth,
                placeholderHeight,
            ] = ratios[index % ratios.length];

            const placeholder =
                document.createElement("canvas");

            placeholder.width = placeholderWidth;
            placeholder.height = placeholderHeight;

            const placeholderContext =
                placeholder.getContext("2d");

            const gradient =
                placeholderContext.createLinearGradient(
                    0,
                    0,
                    placeholderWidth,
                    placeholderHeight
                );

            gradient.addColorStop(0, "#ffffff");
            gradient.addColorStop(1, "#d6d6d6");

            placeholderContext.fillStyle = gradient;

            placeholderContext.fillRect(
                0,
                0,
                placeholderWidth,
                placeholderHeight
            );

            const minSize = Math.min(
                placeholderWidth,
                placeholderHeight
            );

            placeholderContext.fillStyle =
                "rgba(30, 30, 34, .65)";

            placeholderContext.save();

            placeholderContext.translate(
                placeholderWidth / 2,
                placeholderHeight / 2
            );

            placeholderContext.rotate(index * 0.7);

            if (index % 3 === 0) {
                placeholderContext.beginPath();

                placeholderContext.arc(
                    0,
                    0,
                    minSize * 0.21,
                    0,
                    Math.PI * 2
                );

                placeholderContext.fill();
            } else if (index % 3 === 1) {
                placeholderContext.fillRect(
                    -minSize * 0.19,
                    -minSize * 0.19,
                    minSize * 0.38,
                    minSize * 0.38
                );
            } else {
                placeholderContext.beginPath();

                for (let i = 0; i < 12; i++) {
                    const angle =
                        (i / 12) *
                        Math.PI *
                        2;

                    const pointRadius =
                        i % 2
                            ? minSize * 0.09
                            : minSize * 0.25;

                    const x =
                        Math.cos(angle) *
                        pointRadius;

                    const y =
                        Math.sin(angle) *
                        pointRadius;

                    if (i === 0) {
                        placeholderContext.moveTo(
                            x,
                            y
                        );
                    } else {
                        placeholderContext.lineTo(
                            x,
                            y
                        );
                    }
                }

                placeholderContext.closePath();
                placeholderContext.fill();
            }

            placeholderContext.restore();

            return {
                raw: placeholder,
            };
        };

        const createPlaceholders = () => {
            return Array.from(
                { length: 8 },
                (_, index) =>
                    createPlaceholder(index)
            );
        };

        const processImage = (source) => {
            const raw = source.raw;

            const sourceWidth =
                raw.width ||
                raw.naturalWidth;

            const sourceHeight =
                raw.height ||
                raw.naturalHeight;

            const scale = Math.min(
                1,
                CONFIG.maxImageSize /
                    Math.max(
                        sourceWidth,
                        sourceHeight
                    )
            );

            const processedCanvas =
                document.createElement("canvas");

            processedCanvas.width = Math.max(
                1,
                Math.round(
                    sourceWidth * scale
                )
            );

            processedCanvas.height = Math.max(
                1,
                Math.round(
                    sourceHeight * scale
                )
            );

            const processedContext =
                processedCanvas.getContext("2d");

            processedContext.filter =
                `grayscale(${(
                    CONFIG.grayscale * 100
                ).toFixed(0)}%) ` +
                `contrast(${CONFIG.contrast.toFixed(
                    2
                )}) ` +
                `brightness(${CONFIG.brightness.toFixed(
                    2
                )})`;

            processedContext.drawImage(
                raw,
                0,
                0,
                processedCanvas.width,
                processedCanvas.height
            );

            return processedCanvas;
        };

        const loadImages = async () => {
            if (!IMAGE_SOURCES.length) {
                return createPlaceholders();
            }

            const loadedImages =
                await Promise.all(
                    IMAGE_SOURCES.map(
                        (source) =>
                            new Promise(
                                (resolve) => {
                                    const image =
                                        new Image();

                                    image.onload =
                                        () => {
                                            resolve({
                                                raw: image,
                                            });
                                        };

                                    image.onerror =
                                        () => {
                                            resolve(null);
                                        };

                                    image.src =
                                        source;
                                }
                            )
                    )
                );

            const validImages =
                loadedImages.filter(Boolean);

            if (!validImages.length) {
                return createPlaceholders();
            }

            return validImages;
        };

        const rebuild = () => {
            const amount = Math.max(
                1,
                Math.round(
                    CONFIG.count
                )
            );

            items.length = 0;

            const goldenAngle =
                Math.PI *
                (3 - Math.sqrt(5));

            for (
                let i = 0;
                i < amount;
                i++
            ) {
                const y =
                    amount > 1
                        ? 1 -
                          (i /
                              (amount - 1)) *
                              2
                        : 0;

                const sphereRadius =
                    Math.sqrt(
                        Math.max(
                            0,
                            1 - y * y
                        )
                    );

                const angle =
                    goldenAngle * i;

                let x =
                    Math.cos(angle) *
                    sphereRadius;

                let z =
                    Math.sin(angle) *
                    sphereRadius;

                x +=
                    (hash(i * 7.7) - 0.5) *
                    CONFIG.jitter;

                let finalY =
                    y +
                    (hash(i * 9.3) - 0.5) *
                        CONFIG.jitter;

                z +=
                    (hash(i * 11.9) - 0.5) *
                    CONFIG.jitter;

                const length = Math.sqrt(
                    x * x +
                        finalY * finalY +
                        z * z
                );

                x /= length;
                finalY /= length;
                z /= length;

                items.push({
                    x,
                    y: finalY,
                    z,

                    imageIndex:
                        i % 8,

                    phase:
                        hash(i * 13.7) *
                        Math.PI *
                        2,

                    scale:
                        1 +
                        (hash(i * 17.3) -
                            0.5),

                    tilt:
                        (hash(i * 19.1) -
                            0.5) *
                        2,
                });
            }
        };

        const resize = () => {
            const dpr = Math.min(
                window.devicePixelRatio ||
                    1,
                CONFIG.maxDpr
            );

            width =
                canvas.clientWidth;

            height =
                canvas.clientHeight;

            canvas.width =
                Math.round(width * dpr);

            canvas.height =
                Math.round(
                    height * dpr
                );

            ctx.setTransform(
                dpr,
                0,
                0,
                dpr,
                0,
                0
            );
        };

        /*
         * Получаем реальные CSS-переменные
         * из проекта.
         */
        const getTextStyles = () => {
            const rootStyles =
                getComputedStyle(
                    document.documentElement
                );

            const fontFamily =
                rootStyles
                    .getPropertyValue(
                        "--font-primary"
                    )
                    .trim() ||
                "sans-serif";

            const textColor =
                rootStyles
                    .getPropertyValue(
                        "--content-200"
                    )
                    .trim() ||
                "#000000";

            const rootFontSize =
                parseFloat(
                    rootStyles.fontSize
                ) || 16;

            return {
                fontFamily,
                textColor,
                fontSize:
                    rootFontSize * 2,
            };
        };

        /*
         * Перенос текста по max-width.
         */
        const wrapText = (
            text,
            maxWidth
        ) => {
            const words =
                text.split(" ");

            const lines = [];
            let currentLine = "";

            for (const word of words) {
                const testLine =
                    currentLine
                        ? `${currentLine} ${word}`
                        : word;

                const metrics =
                    ctx.measureText(
                        testLine
                    );

                if (
                    metrics.width >
                        maxWidth &&
                    currentLine
                ) {
                    lines.push(
                        currentLine
                    );

                    currentLine =
                        word;
                } else {
                    currentLine =
                        testLine;
                }
            }

            if (currentLine) {
                lines.push(
                    currentLine
                );
            }

            return lines;
        };

        /*
         * Рисуем текст в центре глобуса.
         *
         * Он рисуется:
         * - после задних фото
         * - перед передними фото
         *
         * Благодаря этому передние изображения
         * физически перекрывают текст.
         */
        const drawCenterText = () => {
            const {
                fontFamily,
                textColor,
                fontSize,
            } = getTextStyles();

            const lineHeight =
                fontSize * 1.1;

            ctx.save();

            ctx.globalAlpha = 1;
            ctx.filter = "none";

            ctx.fillStyle =
                textColor;

            ctx.textAlign = "center";
            ctx.textBaseline =
                "middle";

            ctx.font =
                `italic 200 ${fontSize}px ${fontFamily}`;

            /*
             * -3% letter spacing.
             *
             * Canvas не поддерживает letter-spacing
             * как CSS, поэтому текст рисуем
             * посимвольно.
             */
            const letterSpacing =
                fontSize * -0.03;

            /*
             * Для переноса строк сначала
             * используем обычную ширину,
             * затем центрируем каждую строку.
             */
            const words =
                CENTER_TEXT.split(" ");

            const lines = [];
            let currentLine = "";

            const measureWithSpacing = (
                text
            ) => {
                if (!text.length) return 0;

                let width =
                    ctx.measureText(
                        text
                    ).width;

                width +=
                    letterSpacing *
                    (text.length - 1);

                return width;
            };

            for (const word of words) {
                const testLine =
                    currentLine
                        ? `${currentLine} ${word}`
                        : word;

                if (
                    measureWithSpacing(
                        testLine
                    ) >
                        TEXT_MAX_WIDTH &&
                    currentLine
                ) {
                    lines.push(
                        currentLine
                    );

                    currentLine =
                        word;
                } else {
                    currentLine =
                        testLine;
                }
            }

            if (currentLine) {
                lines.push(
                    currentLine
                );
            }

            const totalHeight =
                lines.length *
                lineHeight;

            const startY =
                height / 2 -
                totalHeight / 2 +
                lineHeight / 2;

            const drawLetterSpacedLine = (
                text,
                centerX,
                y
            ) => {
                const characters =
                    Array.from(text);

                let totalWidth = 0;

                const characterWidths =
                    characters.map(
                        (character) => {
                            const w =
                                ctx.measureText(
                                    character
                                ).width;

                            totalWidth += w;

                            return w;
                        }
                    );

                totalWidth +=
                    letterSpacing *
                    Math.max(
                        characters.length - 1,
                        0
                    );

                let x =
                    centerX -
                    totalWidth / 2;

                for (
                    let i = 0;
                    i <
                    characters.length;
                    i++
                ) {
                    const character =
                        characters[i];

                    const characterWidth =
                        characterWidths[i];

                    ctx.fillText(
                        character,
                        x +
                            characterWidth / 2,
                        y
                    );

                    x +=
                        characterWidth +
                        letterSpacing;
                }
            };

            for (
                let i = 0;
                i < lines.length;
                i++
            ) {
                drawLetterSpacedLine(
                    lines[i],
                    width / 2,
                    startY +
                        i * lineHeight
                );
            }

            ctx.restore();
        };

        const draw = (currentTime) => {
            const deltaTime = Math.min(
                (currentTime -
                    lastTime) /
                    1000,
                0.05
            );

            lastTime = currentTime;
            time += deltaTime;

            ctx.fillStyle =
                CONFIG.background;

            ctx.fillRect(
                0,
                0,
                width,
                height
            );

            if (!tiles.length) {
                animationFrame =
                    requestAnimationFrame(
                        draw
                    );

                return;
            }

            const centerX =
                width / 2;

            const centerY =
                height / 2;

            const rotationY =
                time *
                CONFIG.spinY *
                Math.PI *
                2;

            const rotationX =
                time *
                CONFIG.spinX *
                Math.PI *
                2;

            const cosY =
                Math.cos(rotationY);

            const sinY =
                Math.sin(rotationY);

            const cosX =
                Math.cos(rotationX);

            const sinX =
                Math.sin(rotationX);

            const renderList = [];

            for (
                let i = 0;
                i < items.length;
                i++
            ) {
                const item =
                    items[i];

                const floatX =
                    Math.sin(
                        time *
                            CONFIG.floatSpeed +
                            item.phase
                    ) *
                    CONFIG.floatAmount;

                const floatY =
                    Math.cos(
                        time *
                            CONFIG.floatSpeed *
                            0.83 +
                            item.phase *
                                1.7
                    ) *
                    CONFIG.floatAmount;

                const x =
                    (item.x +
                        floatX) *
                    CONFIG.radius;

                const y =
                    (item.y +
                        floatY) *
                    CONFIG.radius;

                const z =
                    item.z *
                    CONFIG.radius;

                const rotatedX =
                    x * cosY -
                    z * sinY;

                const rotatedZ =
                    x * sinY +
                    z * cosY;

                const finalY =
                    y * cosX -
                    rotatedZ * sinX;

                const finalZ =
                    y * sinX +
                    rotatedZ * cosX;

                const cameraZ =
                    finalZ +
                    CONFIG.camera;

                if (
                    cameraZ <= 0.05
                ) {
                    continue;
                }

                const scale =
                    CONFIG.focalLength /
                    cameraZ /
                    1000;

                renderList.push({
                    item,

                    x:
                        centerX +
                        rotatedX *
                            scale *
                            1000,

                    y:
                        centerY +
                        finalY *
                            scale *
                            1000,

                    scale,

                    z: cameraZ,
                });
            }

            /*
             * Сначала дальние фото,
             * потом ближние.
             */
            renderList.sort(
                (a, b) =>
                    b.z - a.z
            );

            const near =
                CONFIG.camera -
                CONFIG.radius;

            const far =
                CONFIG.camera +
                CONFIG.radius;

            const depthRange =
                Math.max(
                    far - near,
                    0.0001
                );

            /*
             * Текст находится примерно
             * в плоскости центра глобуса.
             */
            const textDepth =
                CONFIG.camera;

            let textDrawn = false;

            for (
                let i = 0;
                i < renderList.length;
                i++
            ) {
                const renderItem =
                    renderList[i];

                /*
                 * Как только начинаются
                 * передние фотографии,
                 * сначала рисуем текст.
                 *
                 * Всё, что было дальше,
                 * уже находится за текстом.
                 *
                 * Всё, что рисуется после,
                 * находится перед текстом.
                 */
                if (
                    !textDrawn &&
                    renderItem.z <=
                        textDepth
                ) {
                    drawCenterText();

                    textDrawn = true;
                }

                const item =
                    renderItem.item;

                const tile =
                    tiles[
                        item.imageIndex %
                            tiles.length
                    ];

                if (!tile) {
                    continue;
                }

                const depth =
                    Math.min(
                        1,
                        Math.max(
                            0,
                            (renderItem.z -
                                near) /
                                depthRange
                        )
                    );

                let opacity =
                    1 -
                    CONFIG.fog *
                        depth;

                opacity = Math.max(
                    opacity,
                    CONFIG.minOpacity
                );

                if (
                    opacity <= 0.004
                ) {
                    continue;
                }

                const sizeMultiplier =
                    1 +
                    item.scale *
                        CONFIG.sizeVariance;

                const baseSize =
                    CONFIG.size *
                    sizeMultiplier *
                    renderItem.scale;

                const aspectRatio =
                    tile.width /
                    tile.height;

                const tileWidth =
                    baseSize *
                    Math.sqrt(
                        aspectRatio
                    );

                const tileHeight =
                    baseSize /
                    Math.sqrt(
                        aspectRatio
                    );

                ctx.globalAlpha =
                    opacity;

                if (
                    CONFIG.blur &&
                    CONFIG.blurMax > 0.05
                ) {
                    const blurAmount =
                        depth *
                        CONFIG.blurMax;

                    ctx.filter =
                        blurAmount > 0.15
                            ? `blur(${blurAmount.toFixed(
                                  2
                              )}px)`
                            : "none";
                }

                ctx.save();

                ctx.translate(
                    renderItem.x,
                    renderItem.y
                );

                ctx.rotate(
                    item.tilt *
                        Math.PI /
                        180
                );

                ctx.drawImage(
                    tile,
                    -tileWidth / 2,
                    -tileHeight / 2,
                    tileWidth,
                    tileHeight
                );

                ctx.restore();
            }

            /*
             * Если по какой-то причине
             * не было фотографии перед
             * центральной глубиной,
             * всё равно рисуем текст.
             */
            if (!textDrawn) {
                drawCenterText();
            }

            ctx.globalAlpha = 1;
            ctx.filter = "none";

            animationFrame =
                requestAnimationFrame(
                    draw
                );
        };

        const initialize = async () => {
            const loadedSources =
                await loadImages();

            sources.push(
                ...loadedSources
            );

            tiles.push(
                ...sources.map(
                    processImage
                )
            );

            rebuild();
            resize();

            animationFrame =
                requestAnimationFrame(
                    draw
                );
        };

        resizeObserver =
            new ResizeObserver(resize);

        resizeObserver.observe(
            canvas
        );

        initialize();

        return () => {
            cancelAnimationFrame(
                animationFrame
            );

            resizeObserver?.disconnect();
        };
    }, []);

    return (
        <div className="cloud">
            <canvas
                ref={canvasRef}
                className="cloud__canvas"
            />
        </div>
    );
}