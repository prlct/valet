const fetch = require('node-fetch');
const parseMultipartFormData = require("@anzp/azure-function-multipart").default;

const recognizeWithAzure = async ({url, file}) => {
    const urlAPI = process.env.AZCV_API_URL;
    const imageAPI = process.env.AZCV_API_IMG;
    const predictionKey = process.env.AZCV_PREDICTION_KEY;

    const recognizeURL = async (url) => {
        return await fetch(urlAPI, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Prediction-Key": predictionKey
            },
            body: JSON.stringify({Url: url})
        })
    }

    const recognizeFile = async (file) => {
        return await fetch(imageAPI, {
            method: "POST",
            headers: {
                "Content-Type": "application/octet-stream",
                "Prediction-Key": predictionKey
            },
            body: file
        })
    }

    const time = Date.now();
    const response = url ? await recognizeURL(url) : await recognizeFile(file)

    const body = await response.json();

    const recognizeTime = new Date(body.created).getTime() - time;

    return {
        ok: response.ok,
        status: response.status,
        body: {
            ...body,
            time: recognizeTime
        }
    };
}

const recognizeWithYolo = async ({url, file}) => {
    const imageAPI = process.env.YOLO_API_URL;

    const recognizeFile = async (file) => {
        return await fetch(imageAPI, {
            method: "POST",
            body: file
        })
    }

    const getFileFromUrl = async (url) => {
        const response = await fetch(url)
        return await response.blob()
    }

    const response = url
        ? await recognizeFile(await getFileFromUrl(url))
        : await recognizeFile(file)

    const body = await response.json();

    return {
        ok: response.ok,
        status: response.status,
        body
    };
}

const normalizeYoloResponse = (response) => {
    const yoloTagMap = {
        "Free": "lot",
        "Car": "car"
    }

    return {
        ...response,
        body: {
            time: response.body.time,
            predictions: response.body.objects.map(o => ({
                probability: o.confidence,
                left: o.x,
                top: o.y,
                height: o.height,
                width: o.width,
                tag: yoloTagMap[o.name]
            }))
        }
    }
}

const normalizeAzureResponse = (response) => {
    return {
        ...response,
        body: {
            time: response.body.time,
            predictions: response.body.predictions.map(o => ({
                probability: o.probability,
                left: o.boundingBox.left,
                top: o.boundingBox.top,
                height: o.boundingBox.height,
                width: o.boundingBox.width,
                tag: o.tagName
            }))
        }
    }
}

async function getParams(request) {
    const {fields, files} = await parseMultipartFormData(request);

    const url = fields.find(f => f.name === "url") || {}
    const file = files[0] && files[0].bufferFile

    return {url: url.value, file}
}

module.exports = async function (context, req) {
    const params = await getParams(req);
    const azureResponse = await recognizeWithAzure(params);
    const yoloResponse = await recognizeWithYolo(params);

    const azureResponseNormalized = normalizeAzureResponse(azureResponse)
    const yoloResponseNormalized = normalizeYoloResponse(yoloResponse)

    const allOK = azureResponse.ok && yoloResponse.ok;

    context.res = {
        body: {
            azure: azureResponseNormalized, yolo: yoloResponseNormalized,
            env: process.env,
        },
        status: allOK ? 200 : 400
    }
}
