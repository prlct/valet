import {useEffect, useRef} from "react";

import {PredictionsEntity} from "utils/api";

interface GenericProps {
    threshold: number
    predictions: PredictionsEntity[]
}

interface FileCanvasProps extends GenericProps {
    file: File,
}

interface UrlCanvasProps extends GenericProps {
    url: string,
}

export function Canvas(props: UrlCanvasProps | FileCanvasProps) {
    const { predictions, threshold } = props;
    const source = "file" in props ? URL.createObjectURL(props.file) : props.url;

    const canvasRef = useRef<HTMLCanvasElement>(null);

    const getElementColor = (element: PredictionsEntity) => {
        switch (element.tag) {
            case "car":
                return 'rgba(0, 0, 200, 0.3)'
            case "lot":
            default:
                return 'rgb(200, 0, 0, 0.3)'
        }
    }

    useEffect(() => {
        const img = new Image();
        const drawImageOnCanvas = () => {
            const canvas = canvasRef.current
            if (!canvas) return

            const ctx = canvas.getContext('2d');

            if (!ctx) return

            canvas.width = img.width;
            canvas.height = img.height;

            ctx.drawImage(img, 0, 0, img.width, img.height, 0, 0, canvas.width, canvas.height);

            const validPredictions = predictions.filter(p => p.probability > threshold)

            validPredictions.forEach(element => {
                ctx.fillStyle = getElementColor(element);


                ctx.fillRect(
                    element.left * canvas.width,
                    element.top * canvas.height,
                    element.width * canvas.width,
                    element.height * canvas.height
                )
            })
        }
        img.src = source;
        img.onload = drawImageOnCanvas
    }, [predictions, source, threshold])

    return <canvas ref={canvasRef} style={{ width: "100%", height: "100%"}}/>
}
