// ============================================================
// PROYECTO  : SDA (Sistema de Administración de Documentos)
// ARCHIVO   : server/db/seed-pc.js
// MÓDULO    : Base de Datos (Semillas / Carga Inicial)
// PROPÓSITO : Carga del catálogo maestro de Puntos de Control (PC) institucionales normados.
// AUTOR     : Oscar Alberto Valenzuela Osuna
// ============================================================

// ============================================================
// SECCIÓN: IMPORTACIONES Y DEPENDENCIAS
// ============================================================
const { pool } = require('./connection');

// ============================================================
// SECCIÓN: LÓGICA DE POBLACIÓN (PC_CATALOGO)
// ============================================================

// ------------------------------------------------------------
// FUNCIÓN  : run
// PROPÓSITO: Insertar la totalidad de los 236 puntos de control normados en la tabla pc_catalogo de la base de datos PostgreSQL.
// PARÁMETROS: Ninguno.
// RETORNA  : Promise<void>.
// ------------------------------------------------------------

async function run() {
  try {
    // Verificación de integridad: se evita la reinserción si ya existe el total de registros esperado.
    const { rows: check } = await pool.query('SELECT COUNT(*) as n FROM pc_catalogo');
    const count = parseInt(check[0].n || check[0].count || 0, 10);
    
    if (count >= 236) {
      console.log('[Seed-PC] La tabla pc_catalogo ya contiene la totalidad de registros. Se omite la inserción.');
      return;
    }

    // Inserción masiva del primer bloque de puntos de control (1-116)
    await pool.query(`
    INSERT INTO pc_catalogo (numero, coordinadora_zonal, dia_aplicacion, metodo_presencial, metodo_remoto, proceso, estandar, elemento_medible, nivel_riesgo, ponderacion, descripcion) VALUES
    (1, 1, 'DÍA 1', '1', '1 y 2', 'SEG', 'Control de acceso', 'Externos', 'Medio', 0.45, 'En el local de recepción y control, el vigilante o elemento de seguridad lleva a cabo el control de acceso conforme al tipo de ingreso que corresponda. Solicita credencial proporcionada y autorizada por la directora a las personas usuarias o autorizadas; al personal adscrito su credencial institucional (directa) o credencial de identificación personal (indirecta), y a personas ajenas verifica el acceso mediante identificación oficial y registro correspondiente de entrada y salida.'),
    (2, 1, NULL, '1', '1 y 2', 'SEG', 'Control de acceso', 'Externos', 'Medio', 0.45, 'Todos los accesos al inmueble permanecen cerrados y para CA de prestación directa están vigilados cuando se abren y en caso de existir estacionamiento se registra el ingreso y salida del vehículo en el formato correspondiente.'),
    (3, 1, NULL, '1', '1 y 2 y 4', 'REN', 'Admisión', 'Registro SDA', 'Medio', 0.45, 'El registro de la entrada de la niña y el niño se realiza a través del dispositivo de huella dactilar o en su caso con credencial de identificación o bitácora de asistencia manual.'),
    (4, 1, NULL, '1', '1 y 2 y 4', 'REN', 'Admisión', 'Registro SDA', 'Alto', 0.68, 'El personal asignado al filtro verifica que se registre la entrada de los niños en SDA.'),
    (5, 1, NULL, '1 y 3', '1 y 2 y 4', 'REN', 'Admisión', 'Registro SDA', 'Bajo', 0.23, 'La recepción de la niña o niño es posterior a que el trabajador usuario o persona autorizada registra la entrada en el SDA.'),
    (6, 1, NULL, '1', '4', 'REN', 'Admisión', 'Filtro', 'Medio', 0.45, 'La niña o el niño de nuevo ingreso es recibido y entregado con su nombre completo en un lugar visible al frente de la prenda exterior (de 43 días a 6 meses de edad durante toda su permanencia en la sala de atención y de 7 meses en adelante durante el primer mes).'),
    (7, 1, NULL, '1', '1 y 2 y 4', 'REN', 'Admisión', 'Filtro', 'Alto', 0.68, 'Se recibe a la niña o el niño despierto y con la cabeza descubierta.'),
    (8, 1, NULL, '1', '1 y 2 y 4', 'REN', 'Admisión', 'Filtro', 'Bajo', 0.23, 'Se revisa que las niñas y niños ingresen con las uñas cortas y sin portar alhajas.'),
    (9, 1, NULL, '1 y 3', '1 y 2 y 4', 'FOS', 'Atención de la salud', 'Cuidados', 'Bajo', 0.23, 'En los casos que se requiera se realiza el traslado de las niñas y niños a la unidad médica de apoyo o al servicio de urgencias más cercano y los casos de lesión física con sospecha de maltrato a segundo nivel.'),
    (10, 1, NULL, '1 y 3', '1 y 2 y 4', 'GES', 'Medidas preventivas', 'Protección de niñas y niños', 'Medio', 0.45, 'Se cuenta con carteles de atención de atragantamiento colocados en lugares visibles.'),
    (11, 1, NULL, '1 y 3', '2 y 4', 'REN', 'Admisión', 'Filtro', 'Medio', 0.45, 'Durante la recepción de las y los niños se realiza la toma de temperatura corporal y se pregunta a la persona que lo entrega si presentó signos o síntomas de enfermedad.'),
    (12, 1, NULL, '1 y 4', '1 y 2', 'REN', 'Admisión', 'Filtro', 'Alto', 0.68, 'Durante el filtro sanitario se realiza revisión exhaustiva en el área de fomento de la salud a las y los niños que así lo requieran.'),
    (13, 1, NULL, '1 y 3 y 4', '3 y 4', 'FOS', 'Atención de la salud', 'Cuidados', 'Medio', 0.45, 'Se verifica que los medicamentos que se ministran estén avalados por una Receta médica y que esta contenga los datos completos.'),
    (14, 1, NULL, '1 y 3', '4', 'SEG', 'Control de acceso', 'Externos', 'Alto', 0.68, 'En CA de prestación indirecta el local de recepción y control cuenta con puerta o cancel que impide el paso de personas no autorizadas.'),
    (15, 1, NULL, '1 y 3', '1 y 2 y 4', 'REN', 'Admisión', 'Filtro', 'Bajo', 0.23, 'Durante la recepción de la niña o el niño se revisa aleatoriamente que la ropa interior esté limpia.'),
    (16, 1, NULL, '1 y 3', '1 y 2 y 4', 'REN', 'Admisión', 'Filtro', 'Bajo', 0.23, 'Se recibe en la sala de atención a las niñas y niños de 43 días a 18 meses de edad.'),
    (17, 1, NULL, '1 y 2 y 3 y 4', '1 y 2 y 4', 'REN', 'Admisión', 'Filtro', 'Bajo', 0.23, 'Se recibe en sala de atención a los niños de 19 meses en adelante únicamente cuando el CA cuenta con acceso diferenciado.'),
    (18, 1, NULL, '1 y 3', '1 y 2', 'REN', 'Admisión', 'Filtro', 'Medio', 0.45, 'A los niñas y niños de 19 meses en adelante y para el caso de esquema guardería se recibe directamente en sala de atención.'),
    (19, 1, NULL, '1 y 3', '4', 'ALI', 'Preparación y distribución', 'Nutrición integral', 'Bajo', 0.23, 'Las charolas con el menú muestra exhiben los platillos de acuerdo al tiempo de alimentación correspondiente.'),
    (20, 1, NULL, '1 y 2 y 3', '1 y 2 y 3 y 4', 'PER', 'Plantilla', 'Cobertura', 'Alto', 0.68, 'La distribución física de personal en salas de atención o grupos y áreas del CA garantiza la cobertura normada.'),
    (21, 1, NULL, '1 y 3', '1 y 2', 'HIG', 'Hábitos higiénicos', 'Higiénicas de niñas y niños', 'Medio', 0.45, 'Se realiza la limpieza o lavado de manos de la niña o el niño de acuerdo a su edad y condición.'),
    (22, 1, NULL, '1', '1 y 4', 'ALI', 'Seguimiento alimentario', 'Lactancia materna', 'Bajo', 0.23, 'El CA cuenta con lugar destinado para que la trabajadora usuaria o persona autorizada extraiga y suministre leche materna.'),
    (23, 1, NULL, '1 y 2 y 3', '4', 'ALI', 'Planeación y almacenamiento', 'Insumos', 'Medio', 0.45, 'Verificar que se cuentan con las órdenes de compra emitidas por el módulo PlaC para el abastecimiento de insumos alimentarios.'),
    (24, 1, NULL, '2 y 3 y 4', '3 y 4', 'ALI', 'Seguimiento alimentario', 'Lactancia materna', 'Bajo', 0.23, 'En el CA se promueve y facilita la lactancia materna exclusiva directa o indirecta.'),
    (25, 1, NULL, '1 y 3', '1 y 2', 'HIG', 'Hábitos higiénicos', 'Higiénicas personal', 'Medio', 0.45, 'El personal que está en contacto con las niñas y niños se lava las manos con la técnica normada en los momentos establecidos.'),
    (26, 1, NULL, '4', '1 y 2 y 4', 'PER', 'Capacitación', 'Cursos acreditados', 'Bajo', 0.23, 'Verificar que se cuente con el reporte semestral de la Detección de Necesidades de Capacitación.'),
    (27, 1, NULL, '1 y 3', '1 y 2 y 4', 'SEG', 'Medidas preventivas', 'Protección de niñas y niños', 'Medio', 0.45, 'La Directora asegura que al menos un jefe de área esté presente durante la ministración de alimentos.'),
    (28, 1, NULL, '1 y 3', '1 y 2 y 4', 'SEG', 'Medidas preventivas', 'Protección de niñas y niños', 'Medio', 0.45, 'Las sillas porta bebé o sillas altas infantiles tipo periquera están alejadas de superficies que puedan representar un riesgo.'),
    (29, 1, NULL, '1 y 3', '1 y 2 y 4', 'SEG', 'Medidas preventivas', 'Protección de niñas y niños', 'Alto', 0.68, 'Las niñas y niños que se encuentren en sillas porta bebé o sillas infantiles tipo periquera están supervisados en todo momento.'),
    (30, 1, NULL, '1 y 2 y 3 y 4', '2 y 4', 'SEG', 'Medidas preventivas', 'Protección de niñas y niños', 'Alto', 0.68, 'Se identifican plenamente las charolas con modificación alimentaria y/o fórmulas especiales para niñas y niños.'),
    (31, 1, NULL, '1 y 3', '2', 'SEG', 'Medidas preventivas', 'Protección de niñas y niños', 'Alto', 0.68, 'Para las niñas y niños que toman biberón se revisa el flujo del chupón y la temperatura de la leche antes de su ministración.'),
    (32, 1, NULL, '1', '1 y 2', 'SEG', 'Medidas preventivas', 'Protección de niñas y niños', 'Bajo', 0.23, 'Durante la ministración de alimentos se invita a comer a todos las niñas y niños sin forzarlos.'),
    (33, 1, NULL, '1', '1 y 2', 'ALI', 'Ministración', 'Técnica de ministración', 'Bajo', 0.23, 'Inician la ministración de alimentos con la niña o niño que manifiesta mayor ansiedad por comer.'),
    (34, 1, NULL, '1 y 3', '1 y 2', 'ALI', 'Ministración', 'Técnica de ministración', 'Bajo', 0.23, 'La técnica de ministración para niñas y niños de 43 días a 3 meses se realiza in posición semisentado.'),
    (35, 1, NULL, '1 y 3', '1 y 2', 'ALI', 'Ministración', 'Técnica de ministración', 'Bajo', 0.23, 'La técnica de ministración para niñas y niños de 4 a 9 meses se realiza in silla periquera con apoyo adecuado.'),
    (36, 1, NULL, '1 y 3', '1 y 2', 'ALI', 'Ministración', 'Técnica de ministración', 'Bajo', 0.23, 'La técnica de ministración para niñas y niños de 10 a 16 meses se realiza in silla periquera sin apoyo adicional.'),
    (37, 1, NULL, '1 y 3', '1 y 2', 'ALI', 'Ministración', 'Técnica de ministración', 'Bajo', 0.23, 'La técnica de ministración para niñas y niños de 17 meses en adelante se realiza in mesa y silla adaptadas a su tamaño.'),
    (38, 1, NULL, '1 y 3', '1 y 2', 'SEG', 'Medidas preventivas', 'Protección de niñas y niños', 'Alto', 0.68, 'No se introduce alimento de manera forzada in la boca de las niñas y niños cuando se niegan a comer.'),
    (39, 1, NULL, '1 y 3', '1 y 2', 'SEG', 'Medidas preventivas', 'Protección de niñas y niños', 'Medio', 0.45, 'Se hace eructar a las niñas y niños menores de 12 meses de edad a la mitad y al término de cada toma.'),
    (40, 1, NULL, '1 y 3', '1 y 2', 'SEG', 'Medidas preventivas', 'Protección de niñas y niños', 'Alto', 0.68, 'Posterior a la alimentación se deja reposar a la niña o el niño menor de 12 meses in posición decúbito ventral o de lado.'),
    (41, 1, NULL, '1 y 3', '1 y 2', 'HIG', 'Hábitos higiénicos', 'Higiénicas de niñas y niños', 'Bajo', 0.23, 'Se realiza el aseo bucal o cepillado de dientes de la niña o el niño después de cada toma de alimento según corresponda por edad.'),
    (42, 1, NULL, '1 y 3', '1 y 2', 'HIG', 'Hábitos higiénicos', 'Higiénicas de niñas y niños', 'Bajo', 0.23, 'Se enjuagan los cepillos de dientes por separado al chorro de agua y se colocan de manera individual in posición vertical con las cerdas hacia arriba.'),
    (43, 1, NULL, '1 y 3', '1 y 2', 'HIG', 'Hábitos higiénicos', 'Cambio de pañal', 'Bajo', 0.23, 'Previo al cambio de pañal se cuenta con el material completo y al alcance para realizar el procedimiento.'),
    (44, 1, NULL, '1 y 3', '1 y 2', 'SEG', 'Medidas preventivas', 'Protección de niñas y niños', 'Alto', 0.68, 'Durante el cambio de pañal se mantiene siempre una mano in contacto con la niña o el niño cuando se encuentra sobre el cambiador.'),
    (45, 1, NULL, '1 y 3', '1 y 2', 'HIG', 'Hábitos higiénicos', 'Cambio de pañal', 'Bajo', 0.23, 'El personal retira la ropa de los niñas y niños de la cintura hacia abajo antes del cambio de pañal.'),
    (46, 1, NULL, '1 y 3', '1 y 2', 'HIG', 'Hábitos higiénicos', 'Cambio de pañal', 'Bajo', 0.23, 'El personal retira el papel kraft y lo sustituye in la colchoneta in cada cambio de pañal.'),
    (47, 1, NULL, '1 y 3', '1 y 2', 'HIG', 'Hábitos higiénicos', 'Cambio de pañal', 'Medio', 0.45, 'La limpieza de los genitales in las niñas durante el cambio de pañal se realiza de adelante hacia atrás.'),
    (48, 1, NULL, '1 y 3', '1 y 2', 'HIG', 'Hábitos higiénicos', 'Cambio de pañal', 'Bajo', 0.23, 'El personal revisa que las niñas y niños tengan el pañal seco y realiza el cambio cuando sea necesario.'),
    (49, 1, NULL, '1 y 3', '1 y 2', 'PED', 'Sueño o descanso', 'Preparación', 'Bajo', 0.23, 'Los periodos de sueño o descanso son programados por rango de edad respetando el ritmo individual de cada niña o niño.'),
    (50, 1, NULL, '1 y 3', '1 y 2 y 4', 'PED', 'Sueño o descanso', 'Preparación', 'Alto', 0.68, 'Para los niños menores de 12 meses el acomodo durante el sueño o descanso es in posición decúbito dorsal y sin objetos in la cuna.'),
    (51, 1, NULL, '1 y 3', '1 y 2 y 4', 'PED', 'Sueño o descanso', 'Preparación', 'Bajo', 0.23, 'Para las niñas y niños de 13 meses de edad in adelante durante la actividad de sueño o descanso se respeta la posición que adoptan.'),
    (52, 1, NULL, '1 y 3', '1 y 2 y 4', 'PED', 'Sueño o descanso', 'Vigilancia', 'Alto', 0.68, 'Durante la actividad de sueño o descanso el personal realiza recorridos permanentes para verificar las condiciones de las niñas y niños.'),
    (53, 1, NULL, '1 y 3', '1 y 2 y 4', 'PED', 'Sueño o descanso', 'Vigilancia', 'Medio', 0.45, 'Durante la actividad de sueño o descanso las cunas están libres de juguetes y mantas que representen riesgo de asfixia.'),
    (54, 1, NULL, '1 y 3', '1 y 2 y 4', 'PED', 'Sueño o descanso', 'Vigilancia', 'Bajo', 0.23, 'Durante el periodo de sueño o descanso se realizan actividades con las niñas y niños que no desean dormir.'),
    (55, 1, NULL, '1 y 3', '1 y 2 y 4', 'PED', 'Sueño o descanso', 'Preparación', 'Bajo', 0.23, 'Antes de iniciar el horario de sueño o descanso se implementan estrategias diferenciadas para facilitar el sueño de las niñas y niños.'),
    (56, 1, NULL, '1 y 2 y 3 y 4', '1 y 2 y 3 y 4', 'PED', 'Desarrollo', 'Periodo de adaptación', 'Bajo', 0.23, 'El proceso de adaptación para las niñas y niños de nuevo ingreso de 43 días de nacido hasta preescolar se lleva a cabo conforme a lo normado.'),
    (57, 1, NULL, '1 y 2 y 3 y 4', '1 y 2 y 3 y 4', 'PED', 'Desarrollo', 'Periodo de adaptación', 'Bajo', 0.23, 'El proceso de adaptación se realiza de manera gradual el primer día 4 horas el segundo día 6 horas y a partir del tercer día permanencia completa.'),
    (58, 1, NULL, '1 y 2 y 3 y 4', '1 y 2 y 3 y 4', 'PED', 'Desarrollo', 'Periodo de adaptación', 'Bajo', 0.23, 'Se realiza proceso de adaptación con las niñas y niños que regresan al CA después de una ausencia de 15 días o más.'),
    (59, 1, NULL, '2 y 3 y 4', '3 y 4', 'FOS', 'Prevención de la salud', 'Registro', 'Bajo', 0.23, 'Se registran in el SDA las vacunas que han sido aplicadas según el esquema de inmunizaciones correspondiente a la edad del niño.'),
    (60, 1, NULL, '1 y 2 y 3 y 4', '1 y 2 y 3 y 4', 'PED', 'Acciones pedagógicas', 'Planeación', 'Bajo', 0.23, 'La Planeación de acciones pedagógicas está disponible in el área y corresponde al periodo in curso.'),
    (61, 1, NULL, '1 y 2 y 3 y 4', '1 y 2 y 3 y 4', 'PED', 'Acciones pedagógicas', 'Planeación', 'Bajo', 0.23, 'La Planeación de acciones pedagógicas considera actividades de atención y cuidado diferenciadas por grupos de edad.'),
    (62, 1, NULL, '1 y 2 y 3 y 4', '1 y 2 y 3 y 4', 'PED', 'Acciones pedagógicas', 'Implementación', 'Bajo', 0.23, 'Las acciones o actividades que se realizan con las y los niños están descritas in la planeación pedagógica vigente.'),
    (63, 1, NULL, '1 y 2 y 3 y 4', '1 y 2 y 3 y 4', 'PED', 'Acciones pedagógicas', 'Implementación', 'Bajo', 0.23, 'Se cuenta con el material didáctico requerido de acuerdo con lo registrado in el plan de trabajo pedagógico.'),
    (64, 1, NULL, '1 y 3', '1 y 2 y 4', 'PED', 'Acciones pedagógicas', 'Implementación', 'Bajo', 0.23, 'Se realizan las actividades recreativas al menos dos veces por día in los horarios establecidos.'),
    (65, 1, NULL, '2 y 3 y 4', '1 y 2 y 4', 'FOS', 'Seguimiento de la salud', 'Registro', 'Medio', 0.45, 'En CA integradoras se deberá verificar que para la totalidad de los niños inscritos con discapacidad se cuente con plan de atención individualizado.'),
    (66, 1, NULL, '1 y 3', '1 y 2 y 4', 'HIG', 'Hábitos higiénicos', 'Higiénicas de niñas y niños', 'Bajo', 0.23, 'Se realiza la limpieza o lavado de cara de la niña o el niño antes y después de cada toma de alimento.'),
    (67, 1, NULL, '1 y 3', '1 y 2 y 4', 'HIG', 'Hábitos higiénicos', 'Higiénicas de niñas y niños', 'Bajo', 0.23, 'Se realiza la limpieza de fosas nasales de la niña o el niño cuando se requiera con material desechable.'),
    (68, 1, NULL, '1 y 3', '1 y 2 y 4', 'HIG', 'Hábitos higiénicos', 'Higiénicas de niñas y niños', 'Bajo', 0.23, 'El papel higiénico in la limpieza de fosas nasales se utiliza por niña o niño y se desecha inmediatamente.'),
    (69, 1, NULL, '2 y 3', '1 y 2 y 4', 'HIG', 'Hábitos higiénicos', 'Higiénicas de niñas y niños', 'Bajo', 0.23, 'El lavado de cintura hacia abajo de la niña o niño se realiza de acuerdo con la técnica normada.'),
    (70, 1, NULL, '1 y 3', '2 y 3 y 4', 'SEG', 'Medidas preventivas', 'Protección de niñas y niños', 'Medio', 0.45, 'Previo a realizar cualquier actividad higiénica in las que debe utilizar agua el personal verifica la temperatura del agua.'),
    (71, 1, NULL, '1 y 3', '1 y 2', 'HIG', 'Hábitos higiénicos', 'Higiénicas de niñas y niños', 'Bajo', 0.23, 'Se realiza la limpieza o lavado de manos de la niña o el niño previo a la entrega del turno.'),
    (72, 1, NULL, '1 y 3', '1 y 2', 'FOS', 'Seguimiento de la salud', 'Atención médica', 'Alto', 0.68, 'Se realiza seguimiento de la niña o el niño que requirió atención médica y in caso de que el trabajador usuario no informe al día hábil siguiente la Directora lo contacta para conocer el resultado.'),
    (73, 1, NULL, '1 y 3', '1 y 2', 'GES', 'Acciones administrativas', 'Inscripción', 'Medio', 0.45, 'Para los casos donde in el proceso de verificación de vigencia de derechos se hayan detectado irregularidades se aplica el procedimiento correspondiente.'),
    (74, 1, NULL, '1 y 3', '1 y 2', 'REN', 'Salida', 'Registro SDA', 'Alto', 0.68, 'El personal asignado al local de recepción y control verifica que la salida de las niñas y niños se registre in SDA.'),
    (75, 1, NULL, '1 y 2 y 3 y 4', '1 y 2 y 3 y 4', 'REN', 'Salida', 'Registro SDA', 'Medio', 0.45, 'La niña o niño se entrega posterior a que el Trabajador Usuario o Persona Autorizada registra la salida in el SDA.'),
    (76, 1, NULL, '1 y 2 y 3 y 4', '1 y 2 y 3 y 4', 'REN', 'Salida', 'Método de entrega', 'Medio', 0.45, 'El personal asignado al vestíbulo avisa al personal de la sala por el altavoz el nombre de la niña o niño que va a ser entregado.'),
    (77, 1, NULL, '2 y 3 y 4', '2 y 3 y 4', 'REN', 'Salida', 'Método de entrega', 'Bajo', 0.23, 'Se entrega in mano o in brazos según corresponda in la sala de atención a las niñas y niños menores de 18 meses.'),
    (78, 1, NULL, '1 y 2 y 3 y 4', '1 y 2 y 3 y 4', 'REN', 'Salida', 'Método de entrega', 'Alto', 0.68, 'A las niñas y niños de 19 meses in adelante y los inscritos in el grupo III y IV se entregan in el vestíbulo.'),
    (79, 1, NULL, '1 y 2 y 3 y 4', '1 y 2 y 3 y 4', 'PED', 'Acciones pedagógicas', 'Implementación', 'Bajo', 0.23, 'Los logros e incidencias de las niñas y niños obtenidos durante el día se registran in el formato correspondiente.'),
    (80, 1, NULL, '1 y 2 y 3 y 4', '1 y 2 y 3 y 4', 'REN', 'Salida', 'Método de entrega', 'Bajo', 0.23, 'Se proporciona in caso requerido la información sobre la atención de las niñas y niños durante la jornada al momento de la entrega.'),
    (81, 1, NULL, '2 y 3 y 4', '3 y 4', 'FOS', 'Seguimiento de la salud', 'Registro', 'Bajo', 0.23, 'Las niñas y niños con discapacidad que tienen indicado el uso de ayudas técnicas cuentan con el expediente de atención a la discapacidad actualizado.'),
    (82, 1, 'DÍA 2', '1 y 2 y 3 y 4', '1 y 2 y 3 y 4', 'GES', 'Acciones administrativas', 'Inscripción', 'Bajo', 0.23, 'La CURP de la o el niño registrada in SDA coincide con el documento físico que obra in el expediente del niño.'),
    (83, 1, NULL, '2 y 3 y 4', '3 y 4', 'GES', 'Acciones administrativas', 'Inscripción', 'Bajo', 0.23, 'Se cuenta con correo electrónico del CA informando a la persona trabajadora que su hijo fue inscrito in el CA.'),
    (84, 1, NULL, '2 y 3 y 4', '3 y 4', 'REN', 'Admisión', 'Registro SDA', 'Alto', 0.68, 'Las y los niños que se encuentran físicamente in el CA cuentan con registro de asistencia in SDA.'),
    (85, 1, NULL, '2 y 3 y 4', '3 y 4', 'GES', 'Acciones administrativas', 'Bajas de niñas y niños', 'Bajo', 0.23, 'Las bajas de los niños de la última supervisión a la fecha se aplicaron in la fecha in que dejaron de asistir o in la fecha que se tenga conocimiento.'),
    (86, 1, NULL, '2 y 3 y 4', '3 y 4', 'GES', 'Acciones administrativas', 'Inscripción', 'Bajo', 0.23, 'El personal que forma parte de la plantilla y que funge como persona autorizada está registrado in SDA.'),
    (87, 1, NULL, '2 y 3', '3 y 4', 'GES', 'Acciones administrativas', 'Bajas de niñas y niños', 'Bajo', 0.23, 'Para los casos de las o los niños con ocho o más inasistencias consecutivas se realizaron las acciones de localización correspondientes.'),
    (88, 1, NULL, '2 y 3', '3 y 4', 'GES', 'Acciones administrativas', 'Inscripción', 'Medio', 0.45, 'Para los casos donde in el proceso de verificación de vigencia de derechos hayan existido variaciones se aplica el procedimiento normado.'),
    (89, 1, NULL, '2 y 3 y 4', '3 y 4', 'GES', 'Acciones administrativas', 'Expedientes', 'Medio', 0.45, 'La documentación que conforma el Expediente del Niño está completa y actualizada.'),
    (90, 1, NULL, '2 y 3 y 4', '3 y 4', 'ALI', 'Seguimiento alimentario', 'Historial y seguimiento', 'Bajo', 0.23, 'Se aplica el cuestionario de Historia alimentaria a los niños de nuevo ingreso y está integrado al expediente del niño.'),
    (91, 1, NULL, '2 y 3 y 4', '3 y 4', 'FOS', 'Prevención de la salud', 'Registro', 'Alto', 0.68, 'El Control de inmunizaciones se encuentra actualizado in SDA con las fechas de aplicación de vacunas.'),
    (92, 1, NULL, '2 y 3 y 4', '3 y 4', 'GES', 'Mejora continua', 'Reuniones', 'Alto', 0.68, 'Se realizan acciones de coordinación con la UMF de apoyo para la aplicación de vacunas a los niños inscritos in el CA.'),
    (93, 1, NULL, '2 y 3 y 4', '3 y 4', 'FOS', 'Atención de la salud', 'Cuidados', 'Alto', 0.68, 'A los niños que presentan signos y síntomas de enfermedad o que sufrieron un accidente dentro del CA se les brinda la atención médica que su condición requiere.'),
    (94, 1, NULL, '2 y 3 y 4', '3 y 4', 'FOS', 'Seguimiento de la salud', 'Registro', 'Medio', 0.45, 'La Relación mensual para la medición de peso talla y perímetro cefálico de las niñas y niños se encuentra colocada in el vestíbulo con las firmas correspondientes.'),
    (95, 1, NULL, '2 y 3 y 4', '3 y 4', 'FOS', 'Prevención de la salud', 'Detección', 'Medio', 0.45, 'Realizan la detección de defectos de la agudeza visual a los niños a partir de los 3 años de edad.'),
    (96, 1, NULL, '2 y 3 y 4', '3 y 4', 'FOS', 'Seguimiento de la salud', 'Registro', 'Bajo', 0.23, 'Los niños que se reincorporan a la unidad derivado de una enfermedad y requieren revaluación médica cuentan con valoración médica que avale que sus condiciones de salud no representan riesgo.'),
    (97, 1, NULL, '2 y 3 y 4', '3 y 4', 'FOS', 'Seguimiento de la salud', 'Registro', 'Medio', 0.45, 'Se identifican claramente in el Registro de actividades de fomento de la salud todos los signos y síntomas que presentó el niño así como las acciones realizadas y el seguimiento brindado.'),
    (98, 1, NULL, '1 y 2 y 3 y 4', '1 y 2 y 3 y 4', 'FOS', 'Seguimiento de la salud', 'Atención médica', 'Medio', 0.45, 'Los casos que requirieron atención médica de urgencia están registrados in el Reporte de logros e incidencias diarias.'),
    (99, 1, NULL, '1 y 2 y 3 y 4', '1 y 2 y 3 y 4', 'GES', 'Acciones administrativas', 'Expedientes', 'Bajo', 0.23, 'La responsable de fomento de la salud integra correctamente el Expediente de vigilancia de la salud del niño.'),
    (100, 1, NULL, '1 y 2 y 3 y 4', '1 y 2 y 3 y 4', 'FOS', 'Prevención de la salud', 'Detección', 'Alto', 0.68, 'Se notifica al Director de la Unidad Médica de Apoyo y al Responsable de vigilancia epidemiológica ante la presencia de un caso sujeto a vigilancia epidemiológica.'),
    (101, 1, NULL, '1 y 2 y 3 y 4', '1 y 2 y 3 y 4', 'FOS', 'Seguimiento de la salud', 'Atención médica', 'Medio', 0.45, 'Los casos sujetos a vigilancia epidemiológica y brotes de enfermedades transmisibles se notifican y registran conforme a lo normado.'),
    (102, 1, NULL, '2 y 3 y 4', '1 y 2 y 3 y 4', 'FOS', 'Prevención de la salud', 'Detección', 'Medio', 0.45, 'Se realizan las mediciones de peso talla y perímetro cefálico a los niños conforme a lo normado y in los tiempos establecidos.'),
    (103, 1, NULL, '2 y 3 y 4', '1 y 2 y 3 y 4', 'FOS', 'Seguimiento de la salud', 'Registro', 'Bajo', 0.23, 'El registro de las mediciones se encuentra actualizado in SDA y se encuentran incluidos todos los niños que les corresponde medición in el mes.'),
    (104, 1, NULL, '1 y 2 y 3 y 4', '1 y 2 y 3 y 4', 'FOS', 'Seguimiento de la salud', 'Atención médica', 'Bajo', 0.23, 'Se cuenta con valoración médica de los niños con alteración de peso talla o perímetro cefálico.'),
    (105, 1, NULL, '1 y 2 y 3 y 4', '1 y 2 y 3 y 4', 'FOS', 'Atención de la salud', 'Cuidados', 'Bajo', 0.23, 'Las y los niños con adecuación alimentaria o fórmula infantil especial cuentan con indicación médica.'),
    (106, 1, NULL, '1 y 2 y 3 y 4', '1 y 2 y 3 y 4', 'FOS', 'Atención de la salud', 'Cuidados', 'Medio', 0.45, 'Se ministran los medicamentos con la técnica y medidas de seguridad normadas.'),
    (107, 1, NULL, '1 y 2 y 3', '1 y 2 y 3 y 4', 'FOS', 'Atención de la salud', 'Cuidados', 'Bajo', 0.23, 'Los niños con discapacidad y aquellos que el médico indicó que requieren acudir a sesiones terapéuticas cuentan con el permiso firmado por el trabajador usuario.'),
    (108, 1, NULL, '1 y 2 y 3', '1 y 2 y 3 y 4', 'FOS', 'Seguimiento de la salud', 'Atención médica', 'Bajo', 0.23, 'Se verifica que las niñas y los niños que se reincorporan al Centro de Atención después de una enfermedad cumplan con el periodo de suspensión indicado.'),
    (109, 1, NULL, '1 y 2 y 3', '1 y 2 y 3 y 4', 'FOS', 'Atención de la salud', 'Cuidados', 'Bajo', 0.23, 'Los niños con discapacidad se atienden cumpliendo con las recomendaciones del terapeuta.'),
    (110, 1, NULL, '2 y 3 y 4', '2 y 3 y 4', 'FOS', 'Atención de la salud', 'Cuidados', 'Medio', 0.45, 'Se brinda apoyo terapéutico a los niños con discapacidad inscritos in el Área para la atención de niñas y niños con discapacidad.'),
    (111, 1, NULL, '2 y 3', '3 y 4', 'HIG', 'Limpieza de locales', 'Instalaciones', 'Medio', 0.45, 'Se realizan al menos dos recorridos de saneamiento ambiental identificando condiciones sanitarias que puedan afectar la salud de las niñas y niños.'),
    (112, 1, NULL, '2 y 3', '3 y 4', 'PED', 'Sostenimiento afectivo', 'Integridad emocional', 'Bajo', 0.23, 'El personal complementa las actividades higiénicas de los niños con juegos canciones o conversaciones.'),
    (113, 1, NULL, '2 y 3', '3 y 4', 'PED', 'Sostenimiento afectivo', 'Integridad emocional', 'Bajo', 0.23, 'Durante las actividades higiénicas se establece contacto visual y/o verbal y afecto con la niña o niño.'),
    (114, 1, NULL, '2 y 3', '3 y 4', 'ALI', 'Seguimiento alimentario', 'Historial y seguimiento', 'Bajo', 0.23, 'Se aplica el cuestionario de Seguimiento alimentario a los padres de los niños que cumplen los 6 meses de asistencia al CA y está integrado al expediente.'),
    (115, 1, NULL, '2 y 3', '3 y 4', 'GES', 'Mejora continua', 'Reuniones', 'Bajo', 0.23, 'Se cuenta con evidencia de las reuniones realizadas por el Grupo de calidad.'),
    (116, 1, NULL, '2 y 3', '3 y 4', 'GES', 'Mejora continua', 'Acciones correctivas y preventivas', 'Bajo', 0.23, 'Cuenta con la evidencia de implementación de actividades esenciales y/o barreras de seguridad para la atención de niñas y niños con discapacidad.')
    ON CONFLICT (numero) DO NOTHING;
    `);

    // Inserción masiva del segundo bloque de puntos de control (117-236)
    await pool.query(`
    INSERT INTO pc_catalogo (numero, coordinadora_zonal, dia_aplicacion, metodo_presencial, metodo_remoto, proceso, estandar, elemento_medible, nivel_riesgo, ponderacion, descripcion) VALUES
    (117, 2, 'DÍA 1', '1 y 2 y 3', '1 y 2 y 3 y 4', 'GES', 'Mejora continua', 'Acciones correctivas y preventivas', 'Bajo', 0.23, 'Se encuentra colocado in un lugar visible del área de vestíbulo material gráfico con información QR para el registro de Manifestaciones de Opinión.'),
    (118, 2, NULL, '1 y 2 y 3', '1 y 2 y 3 y 4', 'GES', 'Mejora continua', 'Acciones correctivas y preventivas', 'Bajo', 0.23, 'Para las MO atendidas por el CA se cuenta con copia del soporte documental que acredite la atención de cada MO dentro del periodo de tiempo establecido.'),
    (119, 2, NULL, '1 y 2 y 3', '1 y 2 y 3 y 4', 'GES', 'Mejora continua', 'Recorridos', 'Medio', 0.45, 'Se realizan recorridos diarios in el CA para identificar áreas de oportunidad que representen riesgos in la operación y in caso de identificar alguna se registra in la Cédula de autoevaluación.'),
    (120, 2, NULL, '1 y 2 y 3', '1 y 2 y 3 y 4', 'GES', 'Mejora continua', 'Recorridos', 'Medio', 0.45, 'Se realiza la autoevaluación y la operación coincide con lo registrado in la Cédula de autoevaluación.'),
    (121, 2, NULL, '1 y 3', '1 y 2 y 3 y 4', 'GES', 'Mejora continua', 'Acciones correctivas y preventivas', 'Medio', 0.45, 'Se difunde la normatividad del Servicio de guardería al personal y facilita su consulta.'),
    (122, 2, NULL, '1 y 2 y 3 y 4', '1 y 2 y 3 y 4', 'SEG', 'Medidas preventivas', 'Medidas de seguridad', 'Alto', 0.68, 'Los documentos relacionados con permisos licencias y trámites del inmueble se encuentran vigentes y emitidos por la autoridad competente y la información institucional in el vestíbulo está actualizada y legible.'),
    (123, 2, NULL, '1 y 3 y 4', '1 y 2 y 4', 'MAN', 'Conservación', 'Instalaciones', 'Alto', 0.68, 'Se realiza el recorrido al inicio y cierre de la jornada ejecutando y registrando las actividades establecidas in la Lista de verificación de inicio y término.'),
    (124, 2, NULL, '1 y 3', '1 y 2 y 4', 'MAN', 'Conservación', 'Instalaciones', 'Medio', 0.45, 'No se observan a simple vista fugas de agua u obstrucciones in desagüe.'),
    (125, 2, NULL, '1 y 2 y 3', '1 y 2 y 3 y 4', 'ALI', 'Preparación y distribución', 'Nutrición integral', 'Alto', 0.68, 'Se realiza la preparación y conservación de fórmulas infantiles fórmulas infantiles especiales y leche materna conforme a la técnica normada.'),
    (126, 2, NULL, '1 y 2 y 3', '1 y 2 y 3 y 4', 'SEG', 'Medidas preventivas', 'Protección de niñas y niños', 'Medio', 0.45, 'Se realiza la esterilización de los biberones conforme a la técnica normada y se almacenan ensamblados hasta su utilización.'),
    (127, 2, NULL, '1 y 3', '1 y 2', 'HIG', 'Hábitos higiénicos', 'Higiénicas personal', 'Medio', 0.45, 'El personal de cocina utiliza cubre pelo y cubre boca cuando prepara sirve y distribuye alimentos y fórmulas infantiles.'),
    (128, 2, NULL, '1 y 2 y 3', '1 y 2 y 3 y 4', 'ALI', 'Planeación y almacenamiento', 'Insumos', 'Bajo', 0.23, 'Los insumos alimentarios se encuentran almacenados in condiciones adecuadas de temperatura humedad y orden.'),
    (129, 2, NULL, '1 y 2 y 3', '1 y 2 y 3 y 4', 'ALI', 'Planeación y almacenamiento', 'Insumos', 'Medio', 0.45, 'Los insumos alimentarios cuentan con fecha de caducidad vigente y no presentan alteraciones in su empaque o presentación.'),
    (130, 2, NULL, '1 y 2 y 3', '1 y 2 y 3 y 4', 'ALI', 'Planeación y almacenamiento', 'Insumos', 'Alto', 0.68, 'Los insumos alimentarios utilizados in la preparación de fórmulas infantiles especiales cuentan con la indicación médica correspondiente.'),
    (131, 2, NULL, '1 y 2 y 3', '1 y 2 y 3 y 4', 'ALI', 'Planeación y almacenamiento', 'Insumos', 'Alto', 0.68, 'Los productos utilizados in la preparación de alimentos y fórmulas están dentro de la fecha de caducidad vigente.'),
    (132, 2, NULL, '1 y 2 y 3 y 4', '1 y 2 y 3 y 4', 'HIG', 'Hábitos higiénicos', 'Higiénicas personal', 'Alto', 0.68, 'El personal que manipula alimentos no presenta lesiones in las manos y utiliza guantes cuando es necesario.'),
    (133, 2, NULL, '1 y 2 y 3', '1 y 2 y 3 y 4', 'ALI', 'Preparación y distribución', 'Nutrición integral', 'Bajo', 0.23, 'Los alimentos preparados se conservan a temperatura adecuada hasta su distribución.'),
    (134, 2, NULL, '1 y 2 y 3', '1 y 2 y 3 y 4', 'ALI', 'Preparación y distribución', 'Nutrición integral', 'Medio', 0.45, 'La distribución de los alimentos a las salas de atención se realiza conforme al menú autorizado y in las cantidades establecidas.'),
    (135, 2, NULL, '1 y 2 y 3', '1 y 2 y 3 y 4', 'ALI', 'Preparación y distribución', 'Nutrición integral', 'Medio', 0.45, 'Los alimentos se distribuyen cubiertos hacia las salas de atención para su ministración.'),
    (136, 2, NULL, '1 y 2 y 3', '1 y 2 y 3 y 4', 'ALI', 'Preparación y distribución', 'Nutrición integral', 'Medio', 0.45, 'El menú del día coincide con el menú autorizado y está colocado in lugar visible para los trabajadores usuarios.'),
    (137, 2, NULL, '1 y 2 y 3', '1 y 2 y 3 y 4', 'ALI', 'Planeación y almacenamiento', 'Insumos', 'Medio', 0.45, 'El CA cuenta con el menú del ciclo vigente autorizado por la nutricionista del IMSS.'),
    (138, 2, NULL, '1 y 2 y 3', '1 y 2 y 3 y 4', 'SEG', 'Medidas preventivas', 'Protección de niñas y niños', 'Medio', 0.45, 'Los productos de limpieza y sustancias químicas están almacenados bajo llave fuera del alcance de las niñas y niños y del área de cocina.'),
    (139, 2, NULL, '1 y 2 y 3', '1 y 2 y 3 y 4', 'PED', 'Desarrollo', 'Evaluación', 'Medio', 0.45, 'Se aplica la evaluación del desarrollo a las niñas y niños in los tiempos establecidos y está integrada al expediente.'),
    (140, 2, NULL, '1 y 2 y 3', '1 y 2 y 3 y 4', 'GES', 'Acciones administrativas', 'Expedientes', 'Alto', 0.68, 'El expediente del personal contiene los documentos requeridos completos y actualizados.'),
    (141, 2, NULL, '1 y 2 y 3', '1 y 2 y 3 y 4', 'PED', 'Desarrollo', 'Evaluación', 'Alto', 0.68, 'Los resultados de la evaluación del desarrollo son comunicados a los trabajadores usuarios.'),
    (142, 2, NULL, '1 y 2 y 3', '1 y 2 y 3 y 4', 'GES', 'Acciones administrativas', 'Expedientes', 'Bajo', 0.23, 'El plan de trabajo del CA para el periodo in curso está disponible y actualizado.'),
    (143, 2, NULL, '1 y 2 y 3', '1 y 2 y 3 y 4', 'PED', 'Desarrollo', 'Evaluación', 'Medio', 0.45, 'Se aplica la evaluación del desarrollo a los niños con discapacidad usando los instrumentos normativos correspondientes.'),
    (144, 2, NULL, '1 y 2 y 3', '1 y 2 y 3 y 4', 'GES', 'Acciones administrativas', 'Expedientes', 'Bajo', 0.23, 'Se cuenta con el programa anual de trabajo del CA del periodo in curso.'),
    (145, 2, NULL, '1 y 2 y 3', '1 y 2 y 3 y 4', 'GES', 'Acciones administrativas', 'Expedientes', 'Bajo', 0.23, 'Se cuenta con evidencia del seguimiento al programa anual de trabajo.'),
    (146, 2, NULL, '1 y 2 y 3', '1 y 2 y 3 y 4', 'PED', 'Acciones pedagógicas', 'Implementación', 'Medio', 0.45, 'Las acciones pedagógicas que se implementan favorecen el desarrollo integral de las niñas y niños.'),
    (147, 2, NULL, '1 y 2 y 3', '1 y 2 y 3 y 4', 'PED', 'Acciones pedagógicas', 'Implementación', 'Medio', 0.45, 'El personal realiza acciones de interacción positiva con las niñas y niños durante las actividades del día.'),
    (148, 2, NULL, '1 y 2 y 3', '1 y 2 y 3 y 4', 'SEG', 'Medidas preventivas', 'Protección de niñas y niños', 'Bajo', 0.23, 'Los juguetes y material didáctico están in buen estado sin bordes filosos ni piezas que representen riesgo de asfixia.'),
    (149, 2, NULL, '1 y 2 y 3', '1 y 2 y 3 y 4', 'GES', 'Acciones administrativas', 'Recursos materiales', 'Medio', 0.45, 'Se cuenta con el inventario de mobiliario y equipo actualizado.'),
    (150, 2, NULL, '1 y 2 y 3', '1 y 2 y 3 y 4', 'SEG', 'Estándares de Seguridad', 'Medidas de seguridad', 'Alto', 0.68, 'Se cuenta con botiquín de primeros auxilios completo con los insumos normados vigentes y disponible in el área de fomento a la salud.'),
    (151, 2, NULL, '1 y 2 y 3', '1 y 2 y 3 y 4', 'SEG', 'Control de acceso', 'Internos', 'Medio', 0.45, 'El personal del CA porta in lugar visible su gafete de identificación durante su jornada laboral.'),
    (152, 2, NULL, '1 y 2 y 3', '1 y 2 y 3 y 4', 'SEG', 'Control de acceso', 'Internos', 'Bajo', 0.23, 'El personal de servicios externos que ingresa al CA porta gafete de identificación de su empresa.'),
    (153, 2, NULL, '1 y 2 y 3', '1 y 2 y 3 y 4', 'MAN', 'Conservación', 'Instalaciones', 'Alto', 0.68, 'Las instalaciones eléctricas no presentan riesgos visibles como cables expuestos o contactos sin cubierta.'),
    (154, 2, NULL, '1 y 2 y 3', '1 y 2 y 3 y 4', 'MAN', 'Conservación', 'Instalaciones', 'Medio', 0.45, 'Las áreas del CA se encuentran in condiciones de conservación adecuadas sin riesgos visibles para las niñas y niños.'),
    (155, 2, NULL, '1 y 2 y 3', '1 y 2 y 3 y 4', 'HIG', 'Limpieza de locales', 'Instalaciones', 'Medio', 0.45, 'Las áreas del CA se encuentran limpias y in orden durante la jornada.'),
    (156, 2, NULL, '1 y 2 y 3', '1 y 2 y 3 y 4', 'HIG', 'Limpieza de locales', 'Instalaciones', 'Bajo', 0.23, 'Los sanitarios del personal y de las niñas y niños se encuentran limpios y con los insumos necesarios.'),
    (157, 2, NULL, '1 y 2 y 3', '1 y 2 y 3 y 4', 'HIG', 'Limpieza de locales', 'Bienes', 'Bajo', 0.23, 'El mobiliario colchones colchonetas y demás bienes del CA se encuentran limpios y in buen estado.'),
    (158, 2, NULL, '1 y 2 y 3', '1 y 2 y 3 y 4', 'MAN', 'Conservación', 'Instalaciones', 'Bajo', 0.23, 'Las puertas ventanas y demás accesos del CA se encuentran in buen estado de conservación y funcionamiento.'),
    (159, 2, NULL, '1 y 2 y 3', '1 y 2 y 3 y 4', 'MAN', 'Conservación', 'Instalaciones', 'Medio', 0.45, 'Los pisos y paredes del CA se encuentran in condiciones adecuadas sin grietas roturas o humedad visible.'),
    (160, 2, NULL, '1 y 2 y 3', '1 y 2 y 3 y 4', 'MAN', 'Conservación', 'Mobiliario y equipo', 'Medio', 0.45, 'El mobiliario y equipo del CA se encuentra in condiciones adecuadas de funcionamiento y sin riesgos para las niñas y niños.'),
    (161, 2, NULL, '1 y 2 y 3', '1 y 2 y 3 y 4', 'HIG', 'Limpieza de locales', 'Bienes', 'Medio', 0.45, 'Los juguetes y material didáctico se limpian y desinfectan conforme a la periodicidad normada.'),
    (162, 2, NULL, '1 y 2 y 3', '1 y 2 y 3 y 4', 'HIG', 'Limpieza de locales', 'Bienes', 'Medio', 0.45, 'Los biberones y utensilios de alimentación se limpian y desinfectan conforme a la técnica normada.'),
    (163, 2, NULL, '1 y 2 y 3', '1 y 2 y 3 y 4', 'HIG', 'Limpieza de locales', 'Bienes', 'Medio', 0.45, 'Las colchonetas y cunas se limpian y desinfectan conforme a la periodicidad normada.'),
    (164, 2, NULL, '1 y 2 y 3', '1 y 2 y 3 y 4', 'HIG', 'Limpieza de locales', 'Bienes', 'Medio', 0.45, 'El equipo de refrigeración se limpia y desinfecta conforme a la periodicidad normada.'),
    (165, 2, NULL, '1 y 2 y 3', '1 y 2 y 3 y 4', 'GES', 'Acciones administrativas', 'Recursos materiales', 'Medio', 0.45, 'Se cuenta con el acervo bibliográfico y didáctico suficiente y adecuado a las edades de los niños inscritos.'),
    (166, 2, NULL, '1 y 2 y 3', '1 y 2 y 3 y 4', 'GES', 'Acciones administrativas', 'Recursos materiales', 'Medio', 0.45, 'Se cuenta con equipo médico y material de curación suficiente para la atención de fomento de la salud.'),
    (167, 2, NULL, '1 y 2 y 3', '1 y 2 y 3 y 4', 'SEG', 'Estándares de Seguridad', 'Medidas de seguridad', 'Alto', 0.68, 'Se cuenta con extintores vigentes in número y ubicación adecuados conforme a la norma de protección civil.'),
    (168, 2, NULL, '1 y 2 y 3', '1 y 2 y 3 y 4', 'GES', 'Acciones administrativas', 'Recursos materiales', 'Bajo', 0.23, 'Se cuenta con el programa interno de protección civil autorizado por la autoridad competente y vigente.'),
    (169, 2, NULL, '1 y 2 y 3', '1 y 2 y 3 y 4', 'MAN', 'Conservación', 'Mobiliario y equipo', 'Medio', 0.45, 'El equipo de cómputo y los sistemas de información se encuentran in funcionamiento adecuado.'),
    (170, 2, NULL, '1 y 2 y 3', '1 y 2 y 3 y 4', 'MAN', 'Conservación', 'Instalaciones', 'Medio', 0.45, 'El sistema de agua potable funciona correctamente y se cuenta con agua suficiente durante la jornada.'),
    (171, 2, NULL, '1 y 2 y 3', '1 y 2 y 3 y 4', 'SEG', 'Estándares de Seguridad', 'Medidas de seguridad', 'Medio', 0.45, 'Se cuenta con señalización de seguridad y rutas de evacuación visibles y in buen estado.'),
    (172, 2, NULL, '1 y 2 y 3', '1 y 2 y 3 y 4', 'SEG', 'Estándares de Seguridad', 'Medidas de seguridad', 'Medio', 0.45, 'Las rutas de evacuación están libres de obstáculos in todo momento.'),
    (173, 2, NULL, '1 y 2 y 3', '1 y 2 y 3 y 4', 'MAN', 'Conservación', 'Instalaciones', 'Medio', 0.45, 'El sistema de iluminación funciona correctamente in todas las áreas del CA.'),
    (174, 2, NULL, '1 y 2 y 3', '1 y 2 y 3 y 4', 'HIG', 'Limpieza de locales', 'Instalaciones', 'Alto', 0.68, 'El área de cocina se encuentra limpia y in orden con los procedimientos de higiene aplicados correctamente.'),
    (175, 2, NULL, '1 y 2 y 3', '1 y 2 y 3 y 4', 'PER', 'Plantilla', 'Código de conducta', 'Medio', 0.45, 'El personal conoce y aplica el código de conducta institucional in su interacción con las niñas y niños y sus familias.'),
    (176, 2, NULL, '1 y 2 y 3', '1 y 2 y 3 y 4', 'HIG', 'Hábitos higiénicos', 'Higiénicas personal', 'Bajo', 0.23, 'El personal se presenta con ropa limpia apropiada para sus funciones y sin joyería que represente riesgo para las niñas y niños.'),
    (177, 2, NULL, '1 y 2 y 3', '1 y 2 y 3 y 4', 'HIG', 'Hábitos higiénicos', 'Higiénicas personal', 'Medio', 0.45, 'El personal mantiene el cabello recogido durante su jornada laboral cuando está in contacto con las niñas y niños.'),
    (178, 2, NULL, '1 y 2 y 3', '1 y 2 y 3 y 4', 'PER', 'Plantilla', 'Código de conducta', 'Bajo', 0.23, 'El personal no utiliza dispositivos móviles personales durante la atención de las niñas y niños.'),
    (179, 2, NULL, '1 y 2 y 3', '1 y 2 y 3 y 4', 'PER', 'Plantilla', 'Código de conducta', 'Bajo', 0.23, 'El personal mantiene actitud de respeto y trato digno hacia las niñas y niños y sus familias in todo momento.'),
    (180, 2, NULL, '1 y 2 y 3', '1 y 2 y 3 y 4', 'PER', 'Plantilla', 'Código de conducta', 'Alto', 0.68, 'No se observan actitudes de maltrato violencia o trato inadecuado hacia las niñas y niños por parte del personal.'),
    (181, 2, NULL, '1 y 2 y 3', '1 y 2 y 3 y 4', 'HIG', 'Limpieza de locales', 'Bienes', 'Medio', 0.45, 'La loza y utensilios del servicio de alimentación son escamochados y lavados conforme a la técnica normada.'),
    (182, 2, NULL, '1 y 2 y 3', '1 y 2 y 3 y 4', 'HIG', 'Limpieza de locales', 'Bienes', 'Medio', 0.45, 'El equipo mobiliario y área del laboratorio de leches son lavados y desinfectados al término de la jornada.'),
    (183, 2, NULL, '1 y 2 y 3', '1 y 2 y 3 y 4', 'GES', 'Acciones administrativas', 'Expedientes', 'Bajo', 0.23, 'Se cuenta con el libro de actas del Grupo de calidad actualizado con las reuniones del periodo in curso.'),
    (184, 2, NULL, '1 y 2 y 3', '1 y 2 y 3 y 4', 'GES', 'Acciones administrativas', 'Expedientes', 'Alto', 0.68, 'El CA cuenta con el convenio vigente firmado por ambas partes y con las modificaciones que correspondan al periodo.'),
    (185, 2, 'DÍA 2', '1 y 2 y 3', '1 y 2 y 3 y 4', 'GES', 'Acciones administrativas', 'Expedientes', 'Alto', 0.68, 'El expediente del CA contiene los documentos requeridos completos vigentes y actualizados.'),
    (186, 2, NULL, '1 y 2 y 3', '1 y 2 y 3 y 4', 'FOS', 'Seguimiento de la salud', 'Registro', 'Bajo', 0.23, 'Se cuenta con el plan de trabajo de fomento a la salud del periodo in curso actualizado.'),
    (187, 2, NULL, '1 y 2 y 3', '1 y 2 y 3 y 4', 'PER', 'Capacitación', 'Cursos acreditados', 'Alto', 0.68, 'El personal de nuevo ingreso recibió inducción al puesto conforme a lo normado antes de tener contacto con las niñas y niños.'),
    (188, 2, NULL, '1 y 2 y 3', '1 y 2 y 3 y 4', 'PER', 'Plantilla', 'Cobertura', 'Alto', 0.68, 'La plantilla de personal cubre los puestos requeridos conforme al número de niñas y niños inscritos y la normatividad vigente.'),
    (189, 2, NULL, '1 y 2 y 3', '1 y 2 y 3 y 4', 'GES', 'Acciones administrativas', 'Expedientes', 'Bajo', 0.23, 'Se cuenta con los comprobantes de pago de nómina del personal al corriente.'),
    (190, 2, NULL, '1 y 2 y 3', '1 y 2 y 3 y 4', 'PER', 'Capacitación', 'Cursos acreditados', 'Bajo', 0.23, 'El personal cuenta con los cursos de capacitación obligatorios acreditados conforme al catálogo vigente.'),
    (191, 2, NULL, '1 y 2 y 3', '1 y 2 y 3 y 4', 'PER', 'Capacitación', 'Cursos acreditados', 'Medio', 0.45, 'El personal responsable de fomento de la salud cuenta con la acreditación de los cursos especializados requeridos.'),
    (192, 2, NULL, '1 y 2 y 3', '1 y 2 y 3 y 4', 'PER', 'Capacitación', 'Cursos acreditados', 'Alto', 0.68, 'La Directora del CA cuenta con la acreditación de los cursos de capacitación requeridos para el puesto.'),
    (193, 2, NULL, '1 y 2 y 3', '1 y 2 y 3 y 4', 'PER', 'Capacitación', 'Cursos acreditados', 'Alto', 0.68, 'El personal de cocina cuenta con la acreditación de los cursos de manipulación de alimentos requeridos.'),
    (194, 2, NULL, '1 y 2 y 3', '1 y 2 y 3 y 4', 'PER', 'Capacitación', 'Cursos acreditados', 'Medio', 0.45, 'El personal cuenta con certificación in primeros auxilios vigente conforme a lo normado.'),
    (195, 2, NULL, '1 y 2 y 3', '1 y 2 y 3 y 4', 'PER', 'Capacitación', 'Cursos acreditados', 'Medio', 0.45, 'Se cuenta con evidencia de la participación del personal in los cursos de capacitación del periodo in curso.'),
    (196, 2, NULL, '1 y 2 y 3', '1 y 2 y 3 y 4', 'PER', 'Capacitación', 'Cursos acreditados', 'Medio', 0.45, 'El personal de vigilancia cuenta con la capacitación requerida para el control de acceso.'),
    (197, 2, NULL, '1 y 2 y 3', '1 y 2 y 3 y 4', 'PER', 'Capacitación', 'Cursos acreditados', 'Medio', 0.45, 'Se cuenta con el programa anual de capacitación del CA del periodo in curso actualizado y in seguimiento.'),
    (198, 2, NULL, '1 y 2 y 3', '1 y 2 y 3 y 4', 'PER', 'Plantilla', 'Perfiles de puesto', 'Alto', 0.68, 'El personal cuenta con el perfil de puesto requerido conforme a la normatividad vigente.'),
    (199, 2, NULL, '1 y 2 y 3', '1 y 2 y 3 y 4', 'PER', 'Capacitación', 'Cursos acreditados', 'Bajo', 0.23, 'Se cuenta con el expediente del personal completo con documentos vigentes y actualizados.'),
    (200, 2, NULL, '1 y 2 y 3', '1 y 2 y 3 y 4', 'PER', 'Capacitación', 'Cursos acreditados', 'Alto', 0.68, 'El personal de educación cuenta con la acreditación de los cursos requeridos para el área pedagógica.'),
    (201, 2, NULL, '1 y 2 y 3', '1 y 2 y 3 y 4', 'PER', 'Plantilla', 'Perfiles de puesto', 'Alto', 0.68, 'El personal de nuevo ingreso cuenta con los documentos que acreditan su perfil de puesto antes de iniciar funciones.'),
    (202, 2, NULL, '1 y 2 y 3', '1 y 2 y 3 y 4', 'PER', 'Plantilla', 'Cobertura', 'Alto', 0.68, 'No se presentan ausencias de personal sin sustitución que afecten la cobertura mínima requerida.'),
    (203, 2, NULL, '1 y 2 y 3', '1 y 2 y 3 y 4', 'PER', 'Plantilla', 'Cobertura', 'Alto', 0.68, 'Las sustituciones de personal cumplen con el perfil requerido para el puesto a cubrir.'),
    (204, 2, NULL, '1 y 2 y 3', '1 y 2 y 3 y 4', 'PER', 'Plantilla', 'Perfiles de puesto', 'Alto', 0.68, 'El personal que cubre puestos de manera temporal cuenta con el perfil requerido.'),
    (205, 2, NULL, '1 y 2 y 3', '1 y 2 y 3 y 4', 'PER', 'Plantilla', 'Perfiles de puesto', 'Alto', 0.68, 'La Directora del CA cumple con el perfil de puesto requerido conforme a la normatividad vigente.'),
    (206, 2, NULL, '1 y 2 y 3', '1 y 2 y 3 y 4', 'PER', 'Plantilla', 'Cobertura', 'Alto', 0.68, 'Se cuenta con la plantilla de personal completa conforme al número de niñas y niños inscritos.'),
    (207, 2, NULL, '1 y 2 y 3', '1 y 2 y 3 y 4', 'PER', 'Plantilla', 'Cobertura', 'Medio', 0.45, 'El personal de servicios generales cubre las funciones requeridas para el mantenimiento de las condiciones de higiene del CA.'),
    (208, 2, NULL, '1 y 2 y 3', '1 y 2 y 3 y 4', 'GES', 'Acciones administrativas', 'Inscripción', 'Bajo', 0.23, 'Se cuenta con la relación actualizada de niñas y niños inscritos con los datos completos requeridos.'),
    (209, 2, NULL, '1 y 2 y 3', '1 y 2 y 3 y 4', 'SEG', 'Estándares de Seguridad', 'Medidas de seguridad', 'Alto', 0.68, 'Se cuenta con el plan de emergencias actualizado con los teléfonos de emergencia y el croquis de evacuación visibles.'),
    (210, 2, NULL, '1 y 2 y 3', '1 y 2 y 3 y 4', 'GES', 'Acciones administrativas', 'Recursos materiales', 'Alto', 0.68, 'Se cuenta con los recursos materiales suficientes para garantizar la operación del CA conforme a la normatividad.'),
    (211, 2, NULL, '1 y 2 y 3', '1 y 2 y 3 y 4', 'PED', 'Sostenimiento afectivo', 'Integridad emocional', 'Alto', 0.68, 'El personal establece vínculos afectivos positivos con las niñas y niños favoreciendo su desarrollo emocional.'),
    (212, 2, NULL, '1 y 2 y 3', '1 y 2 y 3 y 4', 'HIG', 'Limpieza de locales', 'Instalaciones', 'Medio', 0.45, 'Las áreas de almacenamiento de alimentos se encuentran limpias ordenadas y con acceso restringido.'),
    (213, 2, NULL, '1 y 2 y 3', '1 y 2 y 3 y 4', 'SEG', 'Estándares de Seguridad', 'Medidas de seguridad', 'Alto', 0.68, 'Se realizan simulacros de evacuación conforme a la frecuencia establecida in el programa de protección civil.'),
    (214, 2, NULL, '1 y 2 y 3', '1 y 2 y 3 y 4', 'SEG', 'Estándares de Seguridad', 'Medidas de seguridad', 'Medio', 0.45, 'Se cuenta con evidencia de los simulacros realizados con los resultados y áreas de mejora identificadas.'),
    (215, 2, NULL, '1 y 2 y 3', '1 y 2 y 3 y 4', 'SEG', 'Estándares de Seguridad', 'Medidas de seguridad', 'Alto', 0.68, 'Las áreas de juego exterior cuentan con superficies seguras y el equipo de juego está in condiciones adecuadas sin riesgos visibles.'),
    (216, 2, NULL, '1 y 2 y 3', '1 y 2 y 3 y 4', 'SEG', 'Estándares de Seguridad', 'Medidas de seguridad', 'Alto', 0.68, 'El CA no presenta fauna nociva visible ni condiciones que favorezcan su presencia.'),
    (217, 2, NULL, '1 y 2 y 3', '1 y 2 y 3 y 4', 'SEG', 'Estándares de Seguridad', 'Medidas de seguridad', 'Alto', 0.68, 'Los materiales de limpieza y desinfección se encuentran almacenados correctamente separados de alimentos y medicamentos.'),
    (218, 2, NULL, '1 y 2 y 3', '1 y 2 y 3 y 4', 'SEG', 'Estándares de Seguridad', 'Medidas de seguridad', 'Alto', 0.68, 'Los medicamentos están almacenados bajo llave fuera del alcance de las niñas y niños y separados de otros insumos.'),
    (219, 2, NULL, '1 y 2 y 3', '1 y 2 y 3 y 4', 'SEG', 'Estándares de Seguridad', 'Medidas de seguridad', 'Bajo', 0.23, 'Los objetos pequeños que representan riesgo de asfixia están fuera del alcance de las niñas y niños.'),
    (220, 2, NULL, '1 y 2 y 3', '1 y 2 y 3 y 4', 'SEG', 'Estándares de Seguridad', 'Medidas de seguridad', 'Alto', 0.68, 'Los enchufes eléctricos a la altura de las niñas y niños están protegidos con tapas de seguridad.'),
    (221, 2, NULL, '1 y 2 y 3', '1 y 2 y 3 y 4', 'SEG', 'Estándares de Seguridad', 'Medidas de seguridad', 'Alto', 0.68, 'Las escaleras y desniveles cuentan con barandales protecciones o señalización adecuada para la seguridad de las niñas y niños.'),
    (222, 2, NULL, '1 y 2 y 3', '1 y 2 y 3 y 4', 'SEG', 'Estándares de Seguridad', 'Medidas de seguridad', 'Alto', 0.68, 'Las ventanas y parapetos a la altura de las niñas y niños tienen protecciones que impiden la caída.'),
    (223, 2, NULL, '1 y 2 y 3', '1 y 2 y 3 y 4', 'SEG', 'Estándares de Seguridad', 'Medidas de seguridad', 'Alto', 0.68, 'El CA no cuenta con objetos punzocortantes o peligrosos al alcance de las niñas y niños.'),
    (224, 2, NULL, '1 y 2 y 3', '1 y 2 y 3 y 4', 'HIG', 'Limpieza de locales', 'Bienes', 'Bajo', 0.23, 'Los contenedores de basura están cubiertos y se vacían con la frecuencia requerida.'),
    (225, 2, NULL, '1 y 2 y 3', '1 y 2 y 3 y 4', 'SEG', 'Estándares de Seguridad', 'Medidas de seguridad', 'Bajo', 0.23, 'La iluminación de emergencia funciona correctamente in las rutas de evacuación.'),
    (226, 2, NULL, '1 y 2 y 3', '1 y 2 y 3 y 4', 'SEG', 'Estándares de Seguridad', 'Medidas de seguridad', 'Alto', 0.68, 'Se cuenta con sistema de alarma contra incendio o detectores de humo in funcionamiento.'),
    (227, 2, NULL, '1 y 2 y 3', '1 y 2 y 3 y 4', 'SEG', 'Estándares de Seguridad', 'Medidas de seguridad', 'Medio', 0.45, 'El CA cuenta con cerco perimetral o delimitación clara que impide el acceso de personas no autorizadas.'),
    (228, 2, NULL, '1 y 2 y 3', '1 y 2 y 3 y 4', 'SEG', 'Estándares de Seguridad', 'Medidas de seguridad', 'Alto', 0.68, 'Las áreas de juego están delimitadas y supervisadas evitando que las niñas y niños tengan acceso a zonas de riesgo.'),
    (229, 2, NULL, '1 y 2 y 3', '1 y 2 y 3 y 4', 'SEG', 'Estándares de Seguridad', 'Medidas de seguridad', 'Alto', 0.68, 'El CA cuenta con cámara de videovigilancia in áreas comunes funcionando conforme a la normatividad.'),
    (230, 2, NULL, '1 y 2 y 3', '1 y 2 y 3 y 4', 'GES', 'Mejora continua', 'Recorridos', 'Bajo', 0.23, 'Se realiza el recorrido de cierre de jornada verificando las condiciones del CA y registrando lo observado.'),
    (231, 2, NULL, '1 y 2 y 3', '1 y 2 y 3 y 4', 'GES', 'Acciones administrativas', 'Expedientes', 'Alto', 0.68, 'Se cuenta con los estados de cuenta o comprobantes de pago de servicios del CA al corriente.'),
    (232, 2, NULL, '1 y 2 y 3', '1 y 2 y 3 y 4', 'GES', 'Acciones administrativas', 'Recursos materiales', 'Bajo', 0.23, 'Se cuenta con el inventario de insumos alimentarios actualizado.'),
    (233, 2, NULL, '1 y 2 y 3', '1 y 2 y 3 y 4', 'GES', 'Acciones administrativas', 'Recursos materiales', 'Alto', 0.68, 'Los insumos alimentarios adquiridos cuentan con los comprobantes fiscales correspondientes.'),
    (234, 2, NULL, NULL, NULL, 'N/A', NULL, NULL, 'N/A', 0, 'Punto de control sin proceso definido. Marcar siempre como N/A.'),
    (235, 2, NULL, NULL, NULL, 'N/A', NULL, NULL, 'N/A', 0, 'Punto de control sin proceso definido. Marcar siempre como N/A.'),
    (236, 2, NULL, NULL, NULL, 'N/A', NULL, NULL, 'N/A', 0, 'Punto de control sin proceso definido. Marcar siempre como SI.')
    ON CONFLICT (numero) DO NOTHING;
    `);

    // Resumen final de la operación
    const { rows: finalCheck } = await pool.query('SELECT COUNT(*) as n FROM pc_catalogo');
    console.log(`[Seed-PC] Proceso finalizado. Total de puntos in la tabla: ${finalCheck[0].n}`);
    
  } catch (err) {
    console.error('[Seed-PC] Error:', err.message);
  } finally {
    /* Cierre de conexión para scripts de ejecución única */
    await pool.end();
  }
}

// ─────────────────────────────────────────────────────────────

// ============================================================
// SECCIÓN: EJECUCIÓN DEL SCRIPT
// ============================================================
run().catch(err => {
  console.error('[Seed-PC] Error fatal:', err.message);
  process.exit(1);
});
