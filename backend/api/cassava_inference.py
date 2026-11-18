import json
import math
from functools import lru_cache
from pathlib import Path


MODEL_DIR = Path(__file__).resolve().parents[2] / 'final model'
MAX_IMAGE_BYTES = 10 * 1024 * 1024

DISEASE_INFO = {
    'cbb': {
        'name': 'Cassava bacterial blight',
        'risk_level': 'high',
        'actions': [
            'Inspect nearby plants for similar leaf or stem symptoms.',
            'Ask an agronomist to confirm the diagnosis before treatment.',
            'Follow local guidance for handling affected plant material.',
        ],
        'actions_fr': [
            'Inspectez les plantes voisines à la recherche de symptômes similaires sur les feuilles ou les tiges.',
            'Demandez à un agronome de confirmer le diagnostic avant tout traitement.',
            'Suivez les recommandations locales pour gérer les plants touchés.',
        ],
    },
    'cbsd': {
        'name': 'Cassava brown streak disease',
        'risk_level': 'high',
        'actions': [
            'Inspect roots and nearby plants for brown streak symptoms.',
            'Ask an agronomist to confirm the diagnosis before treatment.',
            'Follow local guidance for handling affected plant material.',
        ],
        'actions_fr': [
            'Inspectez les racines et les plantes voisines à la recherche de stries brunes.',
            'Demandez à un agronome de confirmer le diagnostic avant tout traitement.',
            'Suivez les recommandations locales pour gérer les plants touchés.',
        ],
    },
    'cgm': {
        'name': 'Cassava green mite damage',
        'risk_level': 'moderate',
        'actions': [
            'Inspect the undersides of leaves and nearby plants for mite damage.',
            'Ask an agronomist to confirm the diagnosis and recommend a response.',
        ],
        'actions_fr': [
            'Inspectez le dessous des feuilles et les plantes voisines pour détecter les dégâts d’acariens.',
            'Demandez à un agronome de confirmer le diagnostic et de recommander une réponse.',
        ],
    },
    'cmd': {
        'name': 'Cassava mosaic disease',
        'risk_level': 'high',
        'actions': [
            'Inspect nearby plants for mosaic patterns and leaf distortion.',
            'Ask an agronomist to confirm the diagnosis before treatment.',
            'Follow local guidance for handling affected plant material.',
        ],
        'actions_fr': [
            'Inspectez les plantes voisines à la recherche de mosaïques ou de déformations foliaires.',
            'Demandez à un agronome de confirmer le diagnostic avant tout traitement.',
            'Suivez les recommandations locales pour gérer les plants touchés.',
        ],
    },
    'healthy': {
        'name': 'Healthy',
        'risk_level': 'low',
        'actions': ['Continue routine crop monitoring.'],
        'actions_fr': ['Poursuivez la surveillance habituelle de la culture.'],
    },
}


@lru_cache(maxsize=1)
def _load_tensorflow():
    import tensorflow as tf
    return tf


@lru_cache(maxsize=1)
def _load_model():
    tf = _load_tensorflow()
    config_path = MODEL_DIR / 'config.json'
    model_path = MODEL_DIR / 'resnet50v2_384_fold0_fp32.keras'
    with config_path.open(encoding='utf-8') as config_file:
        config = json.load(config_file)
    with tf.device('/CPU:0'):
        model = tf.keras.models.load_model(model_path, compile=False)
    return tf, config, model


def predict_image(image_bytes):
    """Run cassava classification on bytes received from a sensor integration."""
    if not isinstance(image_bytes, (bytes, bytearray, memoryview)) or not image_bytes:
        raise ValueError('A non-empty image byte string is required.')
    if len(image_bytes) > MAX_IMAGE_BYTES:
        raise ValueError('Image exceeds the 10 MB limit.')

    tf = _load_tensorflow()
    try:
        image = tf.io.decode_image(bytes(image_bytes), channels=3, expand_animations=False)
    except tf.errors.InvalidArgumentError as error:
        raise ValueError('The sensor payload is not a supported image.') from error

    image.set_shape([None, None, 3])
    _, config, model = _load_model()
    image = tf.image.resize(
        image,
        (config['img_size'], config['img_size']),
        method='bilinear',
        antialias=True,
    )
    image = tf.cast(tf.clip_by_value(tf.round(image), 0, 255), tf.uint8)
    image = tf.expand_dims(tf.cast(image, tf.float32), axis=0)

    with tf.device('/CPU:0'):
        probabilities = model(image, training=False).numpy().reshape(-1)

    class_names = config['class_names']
    if len(probabilities) != len(class_names) or not all(
        math.isfinite(float(value)) and 0 <= float(value) <= 1
        for value in probabilities
    ):
        raise RuntimeError('The model returned invalid prediction probabilities.')

    predicted_index = int(probabilities.argmax())
    predicted_class = class_names[predicted_index]
    if predicted_class not in DISEASE_INFO:
        raise RuntimeError(f'Unknown cassava class returned by the model: {predicted_class}')

    confidence = float(probabilities[predicted_index])
    assessment = DISEASE_INFO[predicted_class]
    return {
        'predicted_class': predicted_class,
        'class_name': assessment['name'],
        'confidence': confidence,
        'probabilities': {
            name: float(probabilities[index])
            for index, name in enumerate(class_names)
        },
        'risk_level': assessment['risk_level'],
        'decision': 'monitor' if predicted_class == 'healthy' and confidence >= 0.75 else 'inspect',
        'requires_human_review': predicted_class != 'healthy' or confidence < 0.75,
        'recommended_actions': assessment['actions'],
        'recommended_actions_fr': assessment['actions_fr'],
    }
