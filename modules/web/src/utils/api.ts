const hostname = process.env.NODE_ENV === "production" ? "" : "http://localhost:7071"
const recognizeURL = hostname + "/api/recognize"

interface RecognizeURL {
    url: string;
}

interface RecognizeFile {
    file: File;
}

export async function recognize(params: RecognizeURL | RecognizeFile): Promise<RecognizeResponse> {
    const formData = new FormData();

    if ("url" in params) {
        formData.append('url', params.url)
    }
    if ("file" in params) {
        formData.append('file', params.file)
    }

    const response = await fetch(recognizeURL, {
        method: "POST",
        body: formData
    })

    return await response.json();
}

export interface RecognizeResponse {
    azure: {
        ok: boolean
        status: number
        body: Prediction
    }
    yolo: {
        ok: boolean
        status: number
        body: Prediction
    }
}

export interface Prediction {
    time: number;
    predictions: PredictionsEntity[];
}

export interface PredictionsEntity {
    probability: number;
    tag: string;
    left: number;
    top: number;
    width: number;
    height: number;
}
