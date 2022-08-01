import json
import azure.functions as func
import torch
from PIL import Image
import io


def get_yolov5():
    model = torch.hub.load('./yolov5', 'custom', path='./model/best_v3.pt', source='local')  # local repo
    model.conf = 0.5
    return model


def get_image_from_bytes(binary_image, max_size=1024):
    input_image = Image.open(io.BytesIO(binary_image)).convert("RGB")
    width, height = input_image.size
    resize_factor = min(max_size / width, max_size / height)
    resized_image = input_image.resize(
        (
            int(input_image.width * resize_factor),
            int(input_image.height * resize_factor),
        )
    )
    return resized_image


model = get_yolov5()


def mapper(item):
    new_item = {
        **item,
        'x': item['xcenter'] - item['width'] / 2,
        'y': item['ycenter'] - item['height'] / 2,
    }
    new_item.pop('xcenter')
    new_item.pop('ycenter')

    return new_item


def main(req: func.HttpRequest) -> func.HttpResponse:
    binary_file = req.get_body()
    input_image = get_image_from_bytes(binary_file)
    results = model(input_image)
    objects_json = results.pandas().xywhn[0].to_json(orient="records")
    execution_time = sum(results.t)

    objects = list(map(mapper, json.loads(objects_json)))

    result = {
        "objects": objects,
        "time": execution_time
    }

    return func.HttpResponse(json.dumps(result))
