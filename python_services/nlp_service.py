from flask import Flask, request, jsonify
import spacy
 
app = Flask(__name__)
 
# Cargar modelo de spaCy
nlp = spacy.load("es_core_news_sm")
 
@app.route("/analyze", methods=["POST"])
def analyze():
    #Obtener el JSON enviado desde Node.js
    data = request.get_json()
    text = data.get("text", "")
 
    if not text:
        return jsonify({"error": "Texto no proporcionado"}), 400
 
    # Analizar texto con spaCy
    doc = nlp(text)
    entities = [{"text": ent.text, "label": ent.label_} for ent in doc.ents]

    # Retornar las entidades encontradas
    return jsonify({"entities": entities})
 
if __name__ == "__main__":
    # Ejecutar el servicio en el puerto 5000
    app.run(port=5000)