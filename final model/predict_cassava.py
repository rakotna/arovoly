import tensorflow as tf
import keras
import numpy as np
import json
import streamlit as st

MODEL_DIR = "/kaggle/working/cassava_model_fp32"

# Chargement de la configuration
with open(f"{MODEL_DIR}/config.json", "r") as f:
    config = json.load(f)

# Chargement unique du modèle FP32
with tf.device("/CPU:0"):
    model = keras.saving.load_model(
        f"{MODEL_DIR}/resnet50v2_384_fold0_fp32.keras",
        compile=False
    )


# Prétraitement d'une image reçue
def preprocess_image(image_bytes, img_size):

    image = tf.io.decode_image(
        image_bytes,
        channels=3,
        expand_animations=False
    )

    image.set_shape([None, None, 3])

    image = tf.image.resize(
        image,
        (img_size, img_size),
        method="bilinear",
        antialias=True
    )

    image = tf.cast(
        tf.clip_by_value(
            tf.round(image), 0, 255
        ),
        tf.uint8
    )

    image = tf.cast(image, tf.float32)

    # Ajouter la dimension batch
    image = tf.expand_dims(image, axis=0)

    return image


# Prédiction d'une seule image
def predict_image(image_bytes):

    # 1. Prétraitement
    image = preprocess_image(
        image_bytes,
        config["img_size"]
    )

    # 2. Inférence CPU FP32
    with tf.device("/CPU:0"):
        probabilities = model(
            image,
            training=False
        ).numpy()[0]

    # 3. Récupération de la classe
    predicted_index = int(np.argmax(probabilities))

    class_name = config["class_names"][predicted_index]

    confidence = float(probabilities[predicted_index])

    # 4. Résultat
    return {
        "predicted_class": class_name,
        "confidence": confidence,
        "probabilities": {
            name: float(probabilities[i])
            for i, name in enumerate(config["class_names"])
        }
    }
uploaded_file = st.file_uploader("Choisissez une image de manioc", type=["jpg", "jpeg", "png"])

if uploaded_file is not None:
    image_bytes = uploaded_file.getvalue()
    result = predict_image(image_bytes)
    st.json(result)

