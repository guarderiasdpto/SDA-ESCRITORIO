// ============================================================
// PROYECTO  : SDA (Sistema de Administración de Documentos)
// ARCHIVO   : server/cron/alertas.js
// MÓDULO    : Procesos Automáticos (Alertas por Correo)
// PROPÓSITO : Motor de notificación y alertas de vigencia para documentos y extintores.
// AUTOR     : Oscar Alberto Valenzuela Osuna
// ============================================================

// ============================================================
// SECCIÓN: IMPORTACIONES Y DEPENDENCIAS
// ============================================================
const { sendMail } = require('../utils/mailer');
const { pool } = require('../db/connection');

// ============================================================
// SECCIÓN: FUNCIONES AUXILIARES Y CONFIGURACIÓN
// ============================================================

// ------------------------------------------------------------
// FUNCIÓN  : getConfig
// PROPÓSITO: Obtener las claves de configuración del sistema desde la base de datos.
// PARÁMETROS: Ninguno
// RETORNA  : Promise<Object> — Mapa de configuración { clave: valor }.
// ERRORES  : Lanza error si falla la consulta SQL.
// ------------------------------------------------------------
async function getConfig() {
  const { rows } = await pool.query('SELECT clave, valor FROM configuracion');
  const c = {};
  rows.forEach(r => { c[r.clave] = r.valor; });
  return c;
}

const DEFAULT_ASUNTO = 'SDA — Notificación de Estatus de Documentación Institucional · {{GUARDERIA}}';
const DEFAULT_CUERPO = `Estimada(s) {{ENCARGADA}}:

Por medio del presente, y de acuerdo a los requerimientos institucionales del IMSS, nos dirigimos a usted para notificarle que la Guardería {{GUARDERIA}} ({{NUMERO}}) cuenta con documentos en su expediente que requieren su atención y/o actualización correspondiente.

A continuación, se presenta el desglose del estado actual de dichos documentos:

{{LISTA}}

Le exhortamos amablemente a iniciar el proceso de regularización a la brevedad posible para evitar incumplimientos ante la normativa vigente. Su Coordinadora o Analista asignada se encuentra a su disposición para cualquier orientación adicional.

Fecha de evaluación del sistema: {{FECHA}}
Nivel de notificación: {{TIPO}}`;

// ------------------------------------------------------------
// FUNCIÓN  : resolver
// PROPÓSITO: Reemplazar etiquetas dinámicas en plantillas con valores reales.
// PARÁMETROS:
//   - texto (String): Plantilla original.
//   - datos (Object): Valores para el reemplazo.
// RETORNA  : String — Texto procesado.
// ------------------------------------------------------------
function resolver(texto, datos) {
  if (!texto) return '';
  return texto
    .split('{{GUARDERIA}}').join(datos.guarderia || '')
    .split('{{ENCARGADA}}').join(datos.encargada || '')
    .split('{{NUMERO}}').join(datos.numero || '')
    .split('{{LISTA}}').join(datos.lista || '')
    .split('{{FECHA}}').join(datos.fecha || '')
    .split('{{TIPO}}').join(datos.tipo || '');
}

// ------------------------------------------------------------
// FUNCIÓN  : escapeHtml
// PROPÓSITO: Sanitizar cadenas para prevenir inyecciones HTML en correos.
// PARÁMETROS: s (String)
// RETORNA  : String
// ------------------------------------------------------------
function escapeHtml(s) {
  if (!s) return '';
  return String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
}

// ------------------------------------------------------------
// FUNCIÓN  : formatDateDMY
// PROPÓSITO: Formatear objetos Date a cadena DD/MM/AAAA.
// PARÁMETROS: date (Date/String)
// RETORNA  : String
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

// ------------------------------------------------------------
// FUNCIÓN  : buildListaTexto
// PROPÓSITO: Generar el cuerpo de texto plano con el listado de documentos agrupados por nivel de urgencia.
// PARÁMETROS: items (Array)
// RETORNA  : String
// ------------------------------------------------------------
function buildListaTexto(items) {
  const groups = {
    vencido: { title: '🔴 DOCUMENTOS VENCIDOS (Atención Inmediata)', docs: [] },
    '15d': { title: '🟠 AVISO URGENTE (Plazo: 0 a 15 días)', docs: [] },
    '30d': { title: '🟡 AVISO MEDIO (Plazo: 16 a 30 días)', docs: [] },
    '45d': { title: '🔵 AVISO PREVENTIVO (Plazo: 31 a 45 días)', docs: [] },
    'por vencer': { title: '🟡 DOCUMENTOS POR VENCER (Próximo Vencimiento)', docs: [] },
    vigente: { title: '🟢 DOCUMENTOS VIGENTES (Correctos)', docs: [] }
  };

  items.forEach(it => {
    if (groups[it.tier]) groups[it.tier].docs.push(it);
  });

  let s = '';
  for (const key of ['vencido', '15d', '30d', '45d', 'por vencer', 'vigente']) {
    const g = groups[key];
    if (g.docs.length > 0) {
      s += `${g.title}\n`;
      g.docs.forEach(it => {
        const fechaStr = formatDateDMY(it.fecha_vigencia);
        let verbo = 'Vence:';
        if (it.tier === 'vencido') verbo = 'Venció el';
        if (it.tier === 'vigente') verbo = 'Vigente hasta:';
        if (it.tier === 'por vencer') verbo = 'Vence:';
        s += `  • ${it.documento_nombre || ''} (${verbo} ${fechaStr})\n`;
      });
      s += '\n';
    }
  }
  return s.trim();
}

// ------------------------------------------------------------
// FUNCIÓN  : buildListaHtml
// PROPÓSITO: Generar el bloque HTML estilizado con el listado de documentos para el correo.
// PARÁMETROS: items (Array)
// RETORNA  : String (HTML)
// ------------------------------------------------------------
function buildListaHtml(items) {
  const groups = {
    vencido: { title: '🔴 DOCUMENTOS VENCIDOS', color: '#e74c3c', docs: [] },
    '15d': { title: '🟠 AVISO URGENTE (0-15 Días)', color: '#e67e22', docs: [] },
    '30d': { title: '🟡 AVISO MEDIO (16-30 Días)', color: '#f1c40f', docs: [] },
    '45d': { title: '🔵 AVISO PREVENTIVO (31-45 Días)', color: '#3498db', docs: [] },
    'por vencer': { title: '🟡 DOCUMENTOS POR VENCER', color: '#f1c40f', docs: [] },
    vigente: { title: '🟢 DOCUMENTOS VIGENTES', color: '#27ae60', docs: [] }
  };

  items.forEach(it => {
    if (groups[it.tier]) groups[it.tier].docs.push(it);
  });

  return Object.keys(groups).map(key => {
    const g = groups[key];
    if (g.docs.length === 0) return '';
    
    const docsHtml = g.docs.map(it => {
      const fechaStr = formatDateDMY(it.fecha_vigencia);
      let verbo = 'Vence:';
      if (it.tier === 'vencido') verbo = 'Venció el';
      if (it.tier === 'vigente') verbo = 'Vigente hasta:';
      if (it.tier === 'por vencer') verbo = 'Vence:';
      return `<li style="margin-bottom: 4px;"><strong>${escapeHtml(it.documento_nombre)}</strong> — <span style="font-size: 0.9em;">${verbo} ${fechaStr}</span></li>`;
    }).join('');

    return `
      <div style="margin-bottom: 15px; border-left: 4px solid ${g.color}; padding-left: 12px;">
        <h4 style="margin: 0 0 8px 0; color: ${g.color}; text-transform: uppercase; font-size: 13px;">${g.title}</h4>
        <ul style="margin: 0; padding-left: 18px; font-size: 13px;">${docsHtml}</ul>
      </div>
    `;
  }).join('');
}

// ------------------------------------------------------------
// FUNCIÓN  : buildMensaje
// PROPÓSITO: Construir el asunto y cuerpo del mensaje (texto y HTML) personalizado para una guardería.
// PARÁMETROS:
//   - guarderia (Object): Datos del centro receptor.
//   - items (Array)     : Lista de documentos a notificar.
//   - config (Object)    : Mapa de configuración global del sistema.
// RETORNA  : Object { asunto, cuerpo, cuerpoHtml }
// ------------------------------------------------------------
function buildMensaje(guarderia, items, config) {
  const isResumen = items.some(it => it.isResumen);
  
  let asuntoTemplate, cuerpoTemplate;
  if (isResumen) {
    asuntoTemplate = config['plantilla_asunto_resumen'] || ('[RESUMEN] ' + (config['plantilla_asunto_general'] || DEFAULT_ASUNTO));
    cuerpoTemplate = config['plantilla_cuerpo_resumen'] || (config['plantilla_cuerpo_general'] || DEFAULT_CUERPO);
  } else {
    asuntoTemplate = config['plantilla_asunto_general'] || DEFAULT_ASUNTO;
    cuerpoTemplate = config['plantilla_cuerpo_general'] || DEFAULT_CUERPO;
  }
  
  const datos = {
    guarderia: guarderia.nombre || guarderia.numero,
    numero: guarderia.numero || '',
    encargada: guarderia.encargada || '',
    lista: buildListaTexto(items),
    fecha: formatDateDMY(new Date()),
    tipo: (items.length === 1) ? items[0].label : (isResumen ? 'Resumen de Estatus' : 'Múltiples avisos')
  };

  const asunto = resolver(asuntoTemplate, datos);
  const cuerpo = resolver(cuerpoTemplate, datos);
  const listaHtml = buildListaHtml(items);

  // Generación de HTML. Se respeta la estructura y estilo institucional.
  const cuerpoHtmlRaw = resolver(cuerpoTemplate, { ...datos, lista: listaHtml });
  const cuerpoHtml = `
    <div style="font-family: Arial, sans-serif; font-size: 14px; color: #333; max-width: 600px;">
      ${cuerpoHtmlRaw.replace(/\n/g, '<br>')}
      <hr style="border: none; border-top: 1px solid #ccc; margin: 25px 0 10px;">
      <p style="font-size: 11px; color: #888;">
        Este mensaje es generado automáticamente por el Sistema SDA y no recibe respuestas.
        Para iniciar el proceso de regularización, comuníquese con su Coordinadora o Analista asignada a la brevedad.
      </p>
      <hr style="border: none; border-top: 1px solid #ccc; margin: 10px 0;">
      <p style="font-weight: bold; color: #666; font-size: 12px;">
        Departamento de Guarderías · IMSS OOAD Sinaloa · Sistema SDA
      </p>
    </div>
  `;

  return { asunto, cuerpo, cuerpoHtml };
}

// ============================================================
// SECCIÓN: PROCESO DE ENVÍO (CRON / MANUAL)
// ============================================================

// ------------------------------------------------------------
// FUNCIÓN  : runAlertas
// PROPÓSITO: Ejecutar el escaneo de vigencias y realizar el envío agrupado de correos electrónicos.
// PARÁMETROS:
//   - baseUrl (String): URL base del sistema para hipervínculos.
//   - options (Object): { forzarPrueba, guarderiaIds, incluirVigentes }.
// RETORNA  : Promise<Object> { enviados, error }
// ------------------------------------------------------------
async function runAlertas(baseUrl, options = {}) {
  const { forzarPrueba = false, guarderiaIds = null } = options;
  const config = await getConfig();
  if (!forzarPrueba && config.auto_correo !== '1' && !guarderiaIds) return { enviados: 0, error: 'Automatización apagada' };

  if (!process.env.GMAIL_USER || !process.env.GMAIL_APP_PASSWORD) {
    return { enviados: 0, error: 'Faltan credenciales de Gmail en el servidor.' };
  }

  let sql = `
    SELECT e.id, e.guarderia_id, e.fecha_vigencia, e.estado, 
            g.numero as guarderia_numero, g.nombre as guarderia_nombre, g.encargada, g.correos_aviso, 
            d.nombre as documento_nombre 
    FROM expedientes e 
    JOIN guarderias g ON g.id = e.guarderia_id AND g.activo = true
    JOIN documentos_catalogo d ON d.id = e.documento_id AND d.activo = true
    WHERE e.estado != 'no aplica'
  `;
  const params = [];
  if (guarderiaIds && Array.isArray(guarderiaIds) && guarderiaIds.length > 0) {
    sql += ` AND g.id = ANY($1)`;
    params.push(guarderiaIds);
  }

  const { rows: expedientes } = await pool.query(sql, params);
  const hoyData = new Date();
  hoyData.setHours(0,0,0,0);

  const nivelesSDA = [
    { dias: Number(config.dias_aviso_45 || 45), clave: '45d', label: 'AVISO 45 DÍAS' },
    { dias: Number(config.dias_aviso_30 || 30), clave: '30d', label: 'AVISO 30 DÍAS' },
    { dias: Number(config.dias_aviso_15 || 15), clave: '15d', label: 'AVISO 15 DÍAS' },
    { dias: 0, clave: 'vencido', label: 'CRÍTICO: VENCIDO' }
  ];

  const porGuarderia = {};

  for (const e of expedientes) {
    if (e.estado === 'no aplica') continue;

    let tier = null;
    let label = '';

    const fvigRaw = e.fecha_vigencia;
    let diffDays = null;

    if (fvigRaw) {
      const fvig = new Date(fvigRaw);
      fvig.setHours(0,0,0,0);
      const diffMs = fvig - hoyData;
      diffDays = Math.ceil(diffMs / (1000 * 60 * 60 * 24));
    }

    if (diffDays !== null && diffDays <= 0) {
      tier = 'vencido';
      label = '🔴 VENCIDO';
    } else {
      const match = (diffDays !== null) ? nivelesSDA.find(n => n.dias === diffDays) : null;
      if (match) {
        tier = match.clave;
        label = `⚠️ ${match.label}`;
      } else if (guarderiaIds || forzarPrueba) {
        // Envío manual. El estado de la base de datos determina la inclusión si no hay coincidencia de días.
        if (e.estado === 'vencido') {
          tier = 'vencido';
          label = '🔴 VENCIDO';
        } else if (e.estado === 'por vencer') {
          tier = 'por vencer';
          label = '⚠️ POR VENCER';
        } else if (options.incluirVigentes) {
          tier = 'vigente';
          label = '🟢 VIGENTE';
        }
      }
    }

    if (!tier) continue;
    
    // Prevención de duplicados. Se evitan duplicados en el mismo día cuando el envío no es manual ni de prueba.
    if (!forzarPrueba && !guarderiaIds) {
      const checkSql = `SELECT id FROM historial_alertas WHERE expediente_id = $1 AND tipo_alerta = $2 AND exitoso = true AND DATE(fecha_envio) = CURRENT_DATE`;
      const { rows: yaEnviado } = await pool.query(checkSql, [e.id, tier]);
      if (yaEnviado.length > 0) continue;
    }

    const key = e.guarderia_id;
    if (!porGuarderia[key]) porGuarderia[key] = {
      guarderia_id: e.guarderia_id,
      nombre: e.guarderia_nombre,
      numero: e.guarderia_numero,
      encargada: e.encargada,
      correos_aviso: e.correos_aviso,
      items: []
    };
    
    porGuarderia[key].items.push({ ...e, tier, label, isResumen: !!options.incluirVigentes });
  }

  let enviados = 0;
  let ultimoError = null;
  console.log(`[Alertas] Iniciando envío de ${Object.keys(porGuarderia).length} resúmenes...`);

  const promesas = Object.keys(porGuarderia).map(async (key) => {
    const guarderia = porGuarderia[key];
    const { correos_aviso, items } = guarderia;
    const dests = (correos_aviso || '').split(/[,;]/).map(e => e.trim()).filter(Boolean);
    if (!dests.length || !items.length) return;
    
    const { asunto, cuerpo, cuerpoHtml } = buildMensaje(guarderia, items, config);
    
    console.log(`[Alertas] Enviando a ${guarderia.numero} (${dests.join(', ')})...`);
    const res = await sendMail({ to: dests, subject: asunto, text: cuerpo, html: cuerpoHtml });
    
    if (res.ok) {
      console.log(`[Alertas] ✓ Éxito: ${guarderia.numero}`);
      enviados += items.length;
      const queries = [];
      for (const it of items) {
        for (const dest of dests) {
          queries.push(pool.query(
            'INSERT INTO historial_alertas (expediente_id, tipo_alerta, destinatario, fecha_envio, exitoso, asunto, cuerpo) VALUES ($1, $2, $3, NOW(), true, $4, $5)',
            [it.id, it.tier, dest, asunto, cuerpo]
          ));
        }
      }
      await Promise.all(queries);
    } else {
      console.error(`[Alertas] ✗ Fallo en ${guarderia.numero}:`, res.error);
      ultimoError = res.error;
      const queries = [];
      for (const it of items) {
        for (const dest of dests) {
          queries.push(pool.query(
            'INSERT INTO historial_alertas (expediente_id, tipo_alerta, destinatario, fecha_envio, exitoso, error, asunto, cuerpo) VALUES ($1, $2, $3, NOW(), false, $4, $5, $6)',
            [it.id, it.tier, dest, res.error, asunto, cuerpo]
          ));
        }
      }
      await Promise.all(queries);
    }
  });

  await Promise.allSettled(promesas);
  console.log(`[Alertas] Proceso finalizado. Total documentos avisados: ${enviados}`);

  if (enviados === 0 && ultimoError) return { enviados: 0, error: 'Error al enviar: ' + ultimoError };
  return { enviados, error: null };
}

// ------------------------------------------------------------
// FUNCIÓN  : runPruebaCorreo
// PROPÓSITO: Realizar un envío de prueba a los correos registrados para validar la configuración SMTP.
// PARÁMETROS:
//   - baseUrl (String)       : URL base.
//   - customTemplate (Object): (Opcional) Plantilla personalizada.
// RETORNA  : Promise<Object> { enviados, error }
// ------------------------------------------------------------
async function runPruebaCorreo(baseUrl, customTemplate = null) {
  const config = await getConfig();
  if (!process.env.GMAIL_USER || !process.env.GMAIL_APP_PASSWORD) {
    return { enviados: 0, error: 'Faltan credenciales de Gmail en el servidor.' };
  }

  const { rows } = await pool.query(`SELECT correos_aviso FROM guarderias WHERE activo = true AND correos_aviso IS NOT NULL AND correos_aviso != ''`);
  const set = new Set();
  rows.forEach(r => (r.correos_aviso || '').split(/[,;]/).forEach(e => { if (e.trim()) set.add(e.trim()); }));
  const correos = [...set];
  if (!correos.length) return { enviados: 0, error: 'Configure correos de aviso en al menos una guardería.' };

  const guarderiaMock = { numero: 'U-1114', nombre: 'Guardería de Prueba', encargada: 'Encargada de Prueba' };
  const sample = [{ label: customTemplate ? (customTemplate.label || 'PRUEBA') : 'PRUEBA', documento_nombre: 'Documento de prueba', fecha_vigencia: new Date().toISOString().slice(0, 10), tier: '45d' }];
  
  let result;
  if (customTemplate && customTemplate.asunto && customTemplate.cuerpo) {
      const datos = {
        guarderia: guarderiaMock.nombre,
        numero: guarderiaMock.numero,
        encargada: guarderiaMock.encargada,
        lista: buildListaTexto(sample),
        fecha: formatDateDMY(new Date()),
        tipo: 'PRUEBA'
      };
      result = {
        asunto: resolver(customTemplate.asunto, datos),
        cuerpo: resolver(customTemplate.cuerpo, datos),
        cuerpoHtml: '<div style="font-family:sans-serif; padding:20px; border:1px solid #eee; border-radius:8px;">' + resolver(customTemplate.cuerpo, datos).replace(/\n/g, '<br>') + '</div>'
      };
  } else {
      result = buildMensaje(guarderiaMock, sample, config);
  }

  const res = await sendMail({ 
    to: correos, 
    subject: '[PRUEBA SDA] ' + result.asunto, 
    text: result.cuerpo,
    html: result.cuerpoHtml
  });

  if (res.ok) return { enviados: correos.length, error: null };
  return { enviados: 0, error: 'Error al enviar: ' + res.error };
}

// ------------------------------------------------------------
// FUNCIÓN  : buildMensajeExtintores
// PROPÓSITO: Construir el asunto y cuerpo HTML para las notificaciones del inventario de extintores.
// PARÁMETROS:
//   - guarderia (Object): Datos del centro.
//   - items (Array)     : Lista de extintores afectados.
// RETORNA  : Object { asunto, cuerpoHtml }
// ------------------------------------------------------------
function buildMensajeExtintores(guarderia, items) {
  const asunto = `SDA — Alerta Extintores · Guardería ${guarderia.numero}`;
  const hoyStr = formatDateDMY(new Date());
  
  const listaHtml = items.map(it => {
    const color = it.tier === 'vencido' ? '#e74c3c' : '#e67e22';
    const fVenc = it.fecha_vencimiento ? formatDateDMY(it.fecha_vencimiento) : 'N/A';
    return `<li><span style="color:${color};font-weight:bold;">[${it.label}]</span> <strong>Extintor #${it.numero_extintor} (${escapeHtml(it.modelo)})</strong> — Vence: ${fVenc}</li>`;
  }).join('');

  const cuerpoHtml = `
    <div style="font-family: Arial, sans-serif; font-size: 14px; color: #333; max-width: 600px;">
      <p>Estimada <strong>${escapeHtml(guarderia.encargada || 'N/A')}</strong>,</p>
      <p>Se le informa que los siguientes extintores de la <strong>Guardería ${escapeHtml(guarderia.nombre || '')} (${escapeHtml(guarderia.numero || '')})</strong> están próximos a vencer o ya se encuentran vencidos:</p>
      <ul style="padding-left: 20px;">${listaHtml}</ul>
      <p>Es de carácter <strong>URGENTE</strong> realizar el mantenimiento correspondiente para garantizar la seguridad del centro y cumplir con la normativa vigente.</p>
      <p style="margin-top: 20px;">Fecha de notificación: ${hoyStr}</p>
      <p style="margin-top: 25px; border-top: 1px solid #eee; padding-top: 10px; font-weight: bold;">
        Departamento de Guarderías IMSS OOAD Sinaloa
      </p>
    </div>
  `;
  
  return { asunto, cuerpoHtml };
}

// ------------------------------------------------------------
// FUNCIÓN  : runAlertasExtintores
// PROPÓSITO: Ejecutar el escaneo preventivo de vigencias en el inventario de extintores y notificar vía correo.
// PARÁMETROS: Ninguno
// RETORNA  : Promise<Object> { ok, enviados, error }
// ------------------------------------------------------------
async function runAlertasExtintores() {
  const config = await getConfig();
  if (config.auto_correo !== '1') return { enviados: 0, error: 'Automatización apagada' };
  if (!process.env.GMAIL_USER || !process.env.GMAIL_APP_PASSWORD) return { enviados: 0, error: 'Faltan credenciales de Gmail' };

  try {
    const sql = `
      SELECT e.*, g.nombre as guarderia_nombre, g.numero as guarderia_numero, g.encargada, g.correos_aviso
      FROM extintores e
      JOIN guarderias g ON g.numero = e.guarderia_clave AND g.activo = true
      WHERE e.activo = true AND e.fecha_vencimiento IS NOT NULL
    `;
    const { rows: extintores } = await pool.query(sql);
    
    const hoyStr = new Date().toISOString().slice(0, 10);
    const hoyData = new Date(hoyStr);
    const niveles = [
      { dias: Number(config.dias_aviso_45 || 45), clave: '45d', label: 'AVISO 45 DÍAS' },
      { dias: Number(config.dias_aviso_30 || 30), clave: '30d', label: 'AVISO 30 DÍAS' },
      { dias: Number(config.dias_aviso_15 || 15), clave: '15d', label: 'AVISO 15 DÍAS' },
      { dias: 0, clave: 'vencido', label: 'VENCIDO' }
    ];

    const porGuarderia = {};

    for (const e of extintores) {
      let tier = null;
      let label = '';
      const fvig = new Date(String(e.fecha_vencimiento).slice(0, 10));
      const diffMs = fvig - hoyData;
      const diffDays = Math.ceil(diffMs / (1000 * 60 * 60 * 24));

      if (diffDays < 0) {
        tier = 'vencido';
        label = '🔴 CRÍTICO: VENCIDO';
      } else {
        const match = niveles.find(n => n.dias === diffDays);
        if (match) {
          tier = match.clave;
          label = `⚠️ ${match.label}`;
        }
      }

      if (!tier) continue;

      // Prevención de spam. Se evita la repetición de alertas del mismo nivel en el día actual.
      const checkSql = `SELECT id FROM historial_alertas WHERE extintor_id = $1 AND tipo_alerta = $2 AND exitoso = true`;
      const { rows: yaEnviado } = await pool.query(checkSql, [e.id, tier]);
      if (yaEnviado.length > 0) continue;

      const key = e.guarderia_clave;
      if (!porGuarderia[key]) porGuarderia[key] = {
        nombre: e.guarderia_nombre,
        numero: e.guarderia_numero,
        encargada: e.encargada,
        correos_aviso: e.correos_aviso,
        items: []
      };
      porGuarderia[key].items.push({ ...e, tier, label });
    }

    let enviados = 0;
    for (const key of Object.keys(porGuarderia)) {
      const g = porGuarderia[key];
      const dests = (g.correos_aviso || '').split(/[,;]/).map(e => e.trim()).filter(Boolean);
      if (!dests.length || !g.items.length) continue;

      const { asunto, cuerpoHtml } = buildMensajeExtintores(g, g.items);
      const res = await sendMail({ to: dests, subject: asunto, text: 'Alerta de extintores SDA', html: cuerpoHtml });

      if (res.ok) {
        enviados += dests.length;
        for (const it of g.items) {
          for (const dest of dests) {
            await pool.query(
              `INSERT INTO historial_alertas (extintor_id, tipo_alerta, destinatario, fecha_envio, exitoso) VALUES ($1, $2, $3, NOW(), true)`,
              [it.id, it.tier, dest]
            );
          }
        }
      }
    }

    return { ok: true, enviados };
  } catch (e) {
    console.error('[Cron] Error en runAlertasExtintores:', e.message);
    return { ok: false, error: e.message };
  }
}

// ------------------------------------------------------------
// FUNCIÓN  : ejecutarAlertas
// PROPÓSITO: Punto de entrada para la ejecución manual masiva de alertas ordinarias y de extintores.
// PARÁMETROS: Ninguno.
// RETORNA  : Nada.
// ------------------------------------------------------------
async function ejecutarAlertas() {
  try {
    const baseUrl = process.env.BASE_URL || 'http://127.0.0.1:' + (process.env.PORT || 3000);
    console.log('[Alertas] Ejecutando alertas de documentos...');
    await runAlertas(baseUrl);
    console.log('[Alertas] Ejecutando alertas de extintores...');
    await runAlertasExtintores();
    console.log('[Alertas] Ejecuciones manuales completadas.');
  } catch(e) {
    console.error('[Alertas] Error en ejecutarAlertas manual:', e.message);
  }
}

// ============================================================
// SECCIÓN: EXPORTACIONES
// ============================================================
module.exports = { 
  ejecutarAlertas, 
  runAlertas, 
  runPruebaCorreo, 
  runAlertasExtintores, 
  buildMensaje, 
  getConfig 
};

