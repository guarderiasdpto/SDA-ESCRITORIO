// ============================================================
// PROYECTO  : SDA (Sistema de Administración de Documentos)
// ARCHIVO   : server/routes/configuracion.js
// MÓDULO    : Configuración Global (Rutas API)
// PROPÓSITO : Gestión de parámetros del sistema, respaldos y restauración de base de datos.
// AUTOR     : Oscar Alberto Valenzuela Osuna
// ============================================================

// ============================================================
// SECCIÓN: IMPORTACIONES Y DEPENDENCIAS
// ============================================================
const express = require('express');
const { execFile } = require('child_process');
const path = require('path');
const fs = require('fs');
const { pool } = require('../db/connection');
const { authMiddleware, adminOnly, usuarioActivo } = require('../middlewares/auth');

const router = express.Router();

// ============================================================
// SECCIÓN: RUTAS DE CONFIGURACIÓN
// ============================================================
router.use(authMiddleware);

// ------------------------------------------------------------
// FUNCIÓN  : GET /
// PROPÓSITO: Recuperar el conjunto completo de parámetros de configuración del sistema en formato clave-valor.
// ------------------------------------------------------------
router.get('/', async (req, res) => {
  try {
    const { rows } = await pool.query('SELECT clave, valor FROM configuracion');
    const obj = {};
    rows.forEach(r => { obj[r.clave] = r.valor; });
    res.json(obj);
  } catch (e) {
    console.error('[Configuración] GET /:', e.message);
    res.status(500).json({ error: 'Error al obtener configuración' });
  }
});

// ------------------------------------------------------------
// FUNCIÓN  : PUT /
// PROPÓSITO: Actualizar o insertar múltiples parámetros de configuración de forma atómica.
// ------------------------------------------------------------
router.put('/', usuarioActivo, async (req, res) => {
  const body = req.body || {};
  try {
    for (const [clave, valor] of Object.entries(body)) {
      if (!clave) continue;
      await pool.query(`INSERT INTO configuracion (clave, valor) VALUES ($1, $2) ON CONFLICT (clave) DO UPDATE SET valor = EXCLUDED.valor`, [clave, String(valor)]);
    }
    res.json({ ok: true });
  } catch (e) {
    console.error('[Configuración] PUT /:', e.message);
    res.status(500).json({ error: 'Error al guardar configuración' });
  }
});

// ------------------------------------------------------------
// FUNCIÓN  : POST /backup
// PROPÓSITO: Generar un respaldo físico de la base de datos PostgreSQL en formato custom (.dump).
// ------------------------------------------------------------
router.post('/backup', adminOnly, async (req, res) => {
    const rolesBackup = ['Programador', 'Programadora'];
    if (!rolesBackup.includes((req.user.rol || '').trim())) {
      return res.status(403).json({ error: 'No tiene permisos para realizar respaldos.' });
    }

  try {
    const { customPath } = req.body;
    let filePath = customPath;

    if (!filePath) {
      const home = process.env.USERPROFILE || process.env.HOME || process.cwd();
      const backupDir = __dirname.includes('.asar') 
        ? path.join(home, 'Documents', 'SDA_Backups')
        : path.join(__dirname, '..', '..', 'backups');

      if (!fs.existsSync(backupDir)) fs.mkdirSync(backupDir, { recursive: true });
      const now = new Date();
      const YYYY = now.getFullYear();
      const MM = String(now.getMonth() + 1).padStart(2, '0');
      const DD = String(now.getDate()).padStart(2, '0');
      const HH = String(now.getHours()).padStart(2, '0');
      const mm = String(now.getMinutes()).padStart(2, '0');
      filePath = path.join(backupDir, `SDA_Respaldo_${YYYY}-${MM}-${DD}_${HH}${mm}.dump`);
    }

    const dbUrl = process.env.DATABASE_URL;
    if (!dbUrl) return res.status(500).json({ error: 'DATABASE_URL no definida' });

    const pgDumpPath = process.env.PG_DUMP_PATH || 'pg_dump';
    
    // Ejecución de la utilidad pg_dump. Se genera el archivo de respaldo binario.
    execFile(pgDumpPath, [dbUrl, '-F', 'c', '-f', filePath], (err) => {
      if (err) {
        console.error('[Backup] Error:', err.message);
        return res.status(500).json({ error: 'Error al generar archivo: ' + err.message });
      }
      res.json({ ok: true, ruta: filePath });
    });
  } catch (e) {
    console.error('[Configuración] POST /backup:', e.message);
    res.status(500).json({ error: 'Error interno' });
  }
});

// ------------------------------------------------------------
// FUNCIÓN  : POST /restore
// PROPÓSITO: Ejecutar la restauración física de la base de datos previa generación de un respaldo preventivo de seguridad.
// ------------------------------------------------------------
router.post('/restore', adminOnly, async (req, res) => {
  const rolesBackup = ['Programador', 'Programadora'];
  if (!rolesBackup.includes((req.user.rol || '').trim())) {
    return res.status(403).json({ error: 'Acceso denegado' });
  }

  const { filePath } = req.body;
  if (!filePath || !fs.existsSync(filePath)) {
    return res.status(400).json({ error: 'Archivo de respaldo no encontrado o no especificado.' });
  }

  try {
    const dbUrl = process.env.DATABASE_URL;
    const pgDumpPath = process.env.PG_DUMP_PATH || 'pg_dump';
    const pgRestorePath = process.env.PG_DUMP_PATH ? path.join(path.dirname(process.env.PG_DUMP_PATH), 'pg_restore.exe') : 'pg_restore';

    // Generación obligatoria de un respaldo de seguridad preventivo.
    const now = new Date();
    const ts = now.toISOString().replace(/[:.]/g, '-').slice(0, 19);
    const safetyFile = path.join(path.dirname(filePath), `SDA_AutoRespaldo_ANTES_RESTAURACION_${ts}.dump`);
    
    console.log('[Restore] Generando respaldo de seguridad:', safetyFile);
    const safetyCmd = `"${pgDumpPath}" "${dbUrl}" -F c -f "${safetyFile}"`;

    const { exec } = require('child_process');
    exec(safetyCmd, async (err) => {
      if (err) {
        console.error('[Restore] Falló respaldo de seguridad:', err.message);
        return res.status(500).json({ error: 'La restauración se canceló porque falló el respaldo de seguridad preventivo.' });
      }

      try {
        // Finalización forzada de conexiones activas. Se permite la restauración exclusiva.
        const dbName = dbUrl.split('/').pop().split('?')[0];
        await pool.query(`SELECT pg_terminate_backend(pid) FROM pg_stat_activity WHERE datname = $1 AND pid <> pg_backend_pid()`, [dbName]);

        const restoreCmdArgs = ['--clean', '--if-exists', '--no-owner', '--no-privileges', '-d', dbUrl, filePath];
        
        console.log('[Restore] Ejecutando restauración...');
        execFile(pgRestorePath, restoreCmdArgs, (rErr, stdout, stderr) => {
          if (rErr) {
            console.error('[Restore] Error:', rErr.message, stderr);
            return res.status(500).json({ error: 'Error durante la restauración física: ' + rErr.message });
          }
          console.log('[Restore] Éxito');
          res.json({ ok: true, mensaje: 'Base de datos restaurada correctamente. Reiniciando aplicación...' });
        });
      } catch (poolErr) {
        console.error('[Restore] Error al limpiar conexiones:', poolErr.message);
        res.status(500).json({ error: 'No se pudieron cerrar las conexiones activas: ' + poolErr.message });
      }
    });
  } catch (e) {
    console.error('[Configuración] POST /restore:', e.message);
    res.status(500).json({ error: 'Error interno en proceso de restauración' });
  }
});

// ------------------------------------------------------------
// FUNCIÓN  : GET /backups-list
// PROPÓSITO: Recuperar el listado de archivos de respaldo binario disponibles en el directorio del servidor.
// ------------------------------------------------------------
router.get('/backups-list', adminOnly, (req, res) => {
  try {
    const home = process.env.USERPROFILE || process.env.HOME || process.cwd();
    const backupDir = __dirname.includes('.asar') 
      ? path.join(home, 'Documents', 'SDA_Backups')
      : path.join(__dirname, '..', '..', 'backups');

    if (!fs.existsSync(backupDir)) {
      return res.json([]);
    }
    const files = fs.readdirSync(backupDir)
      .filter(f => f.endsWith('.dump'))
      .map(f => ({
        nombre: f,
        ruta: path.join(backupDir, f),
        fecha: fs.statSync(path.join(backupDir, f)).mtime
      }))
      .sort((a, b) => b.fecha - a.fecha);
    
    res.json(files);
  } catch (e) {
    console.error('[Configuración] GET /backups-list:', e.message);
    res.status(500).json({ error: 'Error al listar respaldos' });
  }
});

// ============================================================
// SECCIÓN: EXPORTACIONES
// ============================================================
module.exports = router;

