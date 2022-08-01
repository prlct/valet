import { useState } from "react";
import {DropzoneProps} from "@mantine/dropzone";
import * as api from "utils/api";
import {RecognizeResponse} from "utils/api";

interface useDropzoneDropReturn {
    file: File | null
    url: string | null
    loading: boolean
    predictions: RecognizeResponse | null
    onFileSubmit: DropzoneProps["onDrop"]
    onUrlSubmit: (url: string) => void
}

export function useImageRecognize(): useDropzoneDropReturn {
    const [file, setFile] = useState<File | null>(null);
    const [url, setUrl] = useState<string | null>(null);
    const [loading, setLoading] = useState(false);

    const [predictions, setPredictions] = useState<api.RecognizeResponse | null>(null)

    const clear = () => {
        setFile(null)
        setUrl(null)
    }

    return {
        file,
        url,
        predictions,
        loading,
        onFileSubmit: async function onDrop (files) {
            setLoading(true);

            clear()

            const prediction = await api.recognize({ file: files[0] })
            setFile(files[0])
            setPredictions(prediction)

            setLoading(false)
        },
        onUrlSubmit: async function onUrlSubmit (url: string) {
            setLoading(true);

            clear()

            const prediction = await api.recognize({ url })
            setUrl(url)
            setPredictions(prediction)

            setLoading(false)
        },
    }
}
