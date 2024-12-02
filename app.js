const express = require("express");
const app = express();
const port = 3000;

// Configuración de vistas y archivos estáticos
app.set("view engine", "ejs");
app.use(express.static("public"));
app.use(express.urlencoded({ extended: true }));

// Página principal
app.get("/", (req, res) => {
  // Asegurar que 'error' y 'results' siempre se definan
  res.render("index", { error: null, results: null });
});

// Simulación de modelo M/M/1
app.post("/simulate", (req, res) => {
  const { arrivalRate, serviceRate } = req.body;

  const λ = parseFloat(arrivalRate); // Tasa de llegada
  const μ = parseFloat(serviceRate); // Tasa de servicio

  // Validar los valores de entrada
  if (isNaN(λ) || isNaN(μ) || λ <= 0 || μ <= 0) {
    return res.render("index", {
      error: "Por favor, ingresa valores válidos para las tasas.",
      results: null,
    });
  }

  if (λ >= μ) {
    return res.render("index", {
      error: "La tasa de llegada debe ser menor que la tasa de servicio para un sistema estable.",
      results: null,
    });
  }

  // Cálculos del modelo M/M/1
  const ρ = λ / μ; // Utilización
  const Lq = Math.pow(λ, 2) / (μ * (μ - λ)); // Longitud promedio de la cola
  const L = Lq + ρ; // Número promedio en el sistema
  const Wq = Lq / λ; // Tiempo promedio en cola
  const W = Wq + 1 / μ; // Tiempo promedio en el sistema

  // Renderizar resultados
  res.render("index", {
    error: null,
    results: { ρ, Lq, L, Wq, W },
  });
});

// Iniciar servidor
app.listen(port, () => {
  console.log(`Servidor corriendo en http://localhost:${port}`);
});
