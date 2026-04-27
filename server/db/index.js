// ============================================================
// PROYECTO  : SDA (Sistema de Administración de Documentos)
// ARCHIVO   : server/db/index.js
// MÓDULO    : Base de Datos (Punto de entrada)
// PROPÓSITO : Punto de entrada central para la exportación de la conexión a la base de datos y compatibilidad modular.
// AUTOR     : Oscar Alberto Valenzuela Osuna
// ============================================================

// Se re-exporta el pool de conexión para mantener compatibilidad con las referencias existentes en el proyecto.
module.exports = require('./connection');

