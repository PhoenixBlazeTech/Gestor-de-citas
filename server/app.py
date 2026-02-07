from flask import Flask
from flask_cors import CORS
from routes.auth import auth_bp
from routes.medico import medico_bp
from routes.paciente import paciente_bp
from routes.empleado import empleado_bp
from routes.citas import citas_bp
from routes.medicamentos import medicamentos_bp
from routes.diagnostico import diagnostico_bp

app = Flask(__name__)
CORS(app)

# Registrar blueprints
app.register_blueprint(auth_bp)
app.register_blueprint(medico_bp)
app.register_blueprint(paciente_bp)
app.register_blueprint(empleado_bp)
app.register_blueprint(citas_bp)
app.register_blueprint(medicamentos_bp)
app.register_blueprint(diagnostico_bp)

@app.route('/')
def home():
    return "Funcionando"


if __name__ == '__main__':
    app.run(debug=True)
