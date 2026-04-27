// ============================================================
// PROYECTO  : SDA (Sistema de Administración de Documentos)
// ARCHIVO   : server/routes/correo.js
// MÓDULO    : Correo Electrónico (Rutas API)
// PROPÓSITO : Endpoints para el envío manual de resúmenes de cumplimiento a las guarderías.
// AUTOR     : Oscar Alberto Valenzuela Osuna
// ============================================================

// ============================================================
// SECCIÓN: IMPORTACIONES Y DEPENDENCIAS
// ============================================================
const express = require('express');
const { pool } = require('../db/connection');
const { authMiddleware, usuarioActivo } = require('../middlewares/auth');
const { sendMail } = require('../utils/mailer');
const { buildMensaje, getConfig } = require('../cron/alertas');

const router = express.Router();

// ============================================================
// SECCIÓN: FUNCIONES AUXILIARES
// ============================================================

// ------------------------------------------------------------
// FUNCIÓN  : formatDateDMY
// PROPÓSITO: Convertir un objeto Date o cadena ISO al formato regional estándar (DD/MM/YYYY).
// PARÁMETROS: date (Date/String) - La fecha objeto de la transformación.
// RETORNA  : String — Representación textual de la fecha en formato día/mes/año.
// ------------------------------------------------------------
function formatDateDMY(date) {
  if (!date) return '';
  const d = new Date(date);
  if (isNaN(d.getTime())) return date;
  const dd = String(d.getDate()).padStart(2, '0');
  const mm = String(d.getMonth() + 1).padStart(2, '0');
  const yyyy = d.getFullYear();
  return `${dd}/${mm}/${yyyy}`;
}

// ============================================================
// SECCIÓN: DEFINICIÓN DE RUTAS
// ============================================================
router.use(authMiddleware);
router.use(usuarioActivo);

// ------------------------------------------------------------
// FUNCIÓN  : POST /enviar-resumen-guarderia
// PROPÓSITO: Desencadenar el envío manual de un resumen exhaustivo de documentos (vencidos, por vencer y vigentes) a una guardería específica.
// ------------------------------------------------------------
router.post('/enviar-resumen-guarderia', async (req, res) => {
  const { guarderia_id } = req.body;
  if (!guarderia_id) return res.status(400).json({ error: 'Falta guarderia_id' });

  try {
    const { runAlertas } = require('../cron/alertas');
    const baseUrl = req.protocol + '://' + req.get('host');

    // Invocación del motor de alertas para la guardería indicada. Se fuerza la ejecución.
    // y solicitando la inclusión de documentos vigentes para generar un resumen integral.
    const result = await runAlertas(baseUrl, { 
      forzarPrueba: true, 
      guarderiaIds: [parseInt(guarderia_id, 10)],
      incluirVigentes: true 
    });

    if (result.error) {
      return res.status(400).json({ error: result.error });
    }

    res.json({ 
      ok: true, 
      mensaje: 'Resumen enviado correctamente',
      documentos_avisados: result.enviados 
    });

  } catch (e) {
    console.error('[Correo] Error:', e.message);
    res.status(500).json({ error: 'Error interno al procesar el resumen' });
  }
});

// ============================================================
// SECCIÓN: EXPORTACIONES
// ============================================================
module.exports = router;

