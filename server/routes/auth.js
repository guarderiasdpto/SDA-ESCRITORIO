// ============================================================
// PROYECTO  : SDA (Sistema de Administración de Documentos)
// ARCHIVO   : server/routes/auth.js
// MÓDULO    : Autenticación (Rutas API)
// PROPÓSITO : Endpoints para inicio de sesión, verificación de identidad y cambio de claves.
// AUTOR     : Oscar Alberto Valenzuela Osuna
// ============================================================

// ============================================================
// SECCIÓN: IMPORTACIONES Y DEPENDENCIAS
// ============================================================
const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { pool } = require('../db/connection');
const { authMiddleware, JWT_SECRET } = require('../middlewares/auth');
const rateLimit = require('express-rate-limit');

// Configuración del limitador de intentos de acceso para mitigar ataques de fuerza bruta
const limitadorLogin = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 10,
  message: { error: 'Demasiados intentos de sesión. Intenta de nuevo en 15 minutos.' },
  standardHeaders: true,
  legacyHeaders: false
});

const router = express.Router();

// ============================================================
// SECCIÓN: RUTAS DE AUTENTICACIÓN
// ============================================================

// ------------------------------------------------------------
// FUNCIÓN  : POST /login
// PROPÓSITO: Validar credenciales de usuario y generar token JWT de acceso.
// ------------------------------------------------------------
router.post('/login', limitadorLogin, async (req, res) => {
  const { usuario, password } = req.body || {};
  if (!usuario || !password) {
    return res.status(400).json({ error: 'Usuario y contraseña requeridos' });
  }
  try {
    const sql = `SELECT id, nombre, usuario, password_hash, rol, correo, activo FROM usuarios WHERE usuario = $1 AND activo = true`;
    const { rows } = await pool.query(sql, [usuario.trim().toLowerCase()]);
    const user = rows[0];
    if (!user || !bcrypt.compareSync(password, user.password_hash)) {
      return res.status(401).json({ error: 'Usuario o contraseña incorrectos' });
    }
    const updSql = 'UPDATE usuarios SET ultima_sesion = NOW() WHERE id = $1';
    await pool.query(updSql, [user.id]);
    const token = jwt.sign({ userId: user.id }, JWT_SECRET, { expiresIn: '7d' });
    res.json({
      token,
      user: { id: user.id, nombre: user.nombre, usuario: user.usuario, rol: user.rol, correo: user.correo }
    });
  } catch (e) {
    console.error('[Auth] Error en login:', e.message);
    res.status(500).json({ error: 'Error interno' });
  }
});

// ------------------------------------------------------------
// FUNCIÓN  : GET /me
// PROPÓSITO: Retornar los datos del perfil del usuario actualmente autenticado.
// ------------------------------------------------------------
router.get('/me', authMiddleware, (req, res) => {
  res.json({ id: req.user.id, nombre: req.user.nombre, usuario: req.user.usuario, rol: req.user.rol });
});

// ------------------------------------------------------------
// FUNCIÓN  : PUT /cambiar-password
// PROPÓSITO: Actualizar la contraseña del usuario previa validación de la clave actual.
// ------------------------------------------------------------
router.put('/cambiar-password', authMiddleware, async (req, res) => {
  const { actual, nueva } = req.body || {};
  if (!actual || !nueva || nueva.length < 6) {
    return res.status(400).json({ error: 'Contraseña actual y nueva (mín. 6 caracteres) requeridas' });
  }
  try {
    const sql = 'SELECT password_hash FROM usuarios WHERE id = $1';
    const { rows } = await pool.query(sql, [req.user.id]);
    if (!bcrypt.compareSync(actual, rows[0].password_hash)) {
      return res.status(400).json({ error: 'Contraseña actual incorrecta' });
    }
    const hash = bcrypt.hashSync(nueva, 10);
    const updSql = 'UPDATE usuarios SET password_hash = $1 WHERE id = $2';
    await pool.query(updSql, [hash, req.user.id]);
    res.json({ ok: true });
  } catch (e) {
    console.error('[Auth] Error al cambiar contraseña:', e.message);
    res.status(500).json({ error: 'Error interno' });
  }
});

// ============================================================
// SECCIÓN: EXPORTACIONES
// ============================================================
module.exports = router;

