<?php
session_start();

// ============================================================
//  CONFIGURACIÓN
// ============================================================
// Cambia estas credenciales antes de subir a producción.
// Para generar el hash de la clave, ejecuta una sola vez:
//   php -r "echo password_hash('TU_CLAVE', PASSWORD_DEFAULT);"
// y pega el resultado en ADMIN_PASS_HASH.
$ADMIN_USER      = 'admin';
$ADMIN_PASS_HASH = '$2a$12$W6RLdVPssjNGEGhMaLgp5eMvcAfWM9kJ2kOtpCaR39zBuyx0smyt2'; // <- CAMBIAR

$ARCHIVOS = [
    'sistemas' => [
        'ruta'   => __DIR__ . '/assets/json/turnos_sistemas.json',
        'titulo' => 'Área de Desarrollo (Sistemas)',
        'area'   => 'Desarrollo',
    ],
    'soporte' => [
        'ruta'   => __DIR__ . '/assets/json/turnos_soporte.json',
        'titulo' => 'Soporte Técnico',
        'area'   => 'Soporte',
    ],
];

// ============================================================
//  LOGIN / LOGOUT
// ============================================================
if (isset($_GET['logout'])) {
    session_destroy();
    header('Location: turnos-admin.php');
    exit;
}

if (!isset($_SESSION['auth']) && $_SERVER['REQUEST_METHOD'] === 'POST' && isset($_POST['login'])) {
    $user = $_POST['user'] ?? '';
    $pass = $_POST['pass'] ?? '';
    if ($user === $ADMIN_USER && password_verify($pass, $ADMIN_PASS_HASH)) {
        $_SESSION['auth'] = true;
        header('Location: turnos-admin.php');
        exit;
    } else {
        $loginError = 'Usuario o clave incorrectos.';
    }
}

if (!isset($_SESSION['auth'])) {
    ?>
    <!doctype html>
    <html lang="es">
    <head>
      <meta charset="utf-8">
      <title>Login · Mantenedor de Turnos</title>
      <meta name="viewport" content="width=device-width,initial-scale=1">
      <style>
        body { font-family: system-ui, sans-serif; background:#EDF0F4; display:flex; align-items:center; justify-content:center; min-height:100vh; margin:0; }
        form { background:#fff; padding:32px; border-radius:12px; box-shadow:0 8px 32px rgba(0,0,0,.08); width:320px; }
        h1 { font-size:18px; margin:0 0 18px; color:#1C1C25; }
        label { display:block; font-size:13px; color:#555; margin:10px 0 4px; }
        input { width:100%; padding:10px 12px; border:1px solid #d0d4dc; border-radius:8px; font-size:14px; box-sizing:border-box; }
        button { width:100%; margin-top:18px; padding:11px; background:#407360; color:#fff; border:0; border-radius:8px; font-size:14px; cursor:pointer; }
        button:hover { background:#365f50; }
        .err { color:#b22; font-size:13px; margin-top:10px; }
      </style>
    </head>
    <body>
      <form method="post">
        <h1>Mantenedor de Turnos</h1>
        <label>Usuario</label>
        <input type="text" name="user" required autofocus>
        <label>Clave</label>
        <input type="password" name="pass" required>
        <button type="submit" name="login" value="1">Ingresar</button>
        <?php if (!empty($loginError)) echo '<div class="err">'.htmlspecialchars($loginError).'</div>'; ?>
      </form>
    </body>
    </html>
    <?php
    exit;
}

// ============================================================
//  API: guardar cambios (AJAX)
// ============================================================
if ($_SERVER['REQUEST_METHOD'] === 'POST' && isset($_POST['accion'])) {
    header('Content-Type: application/json');

    $clave = $_POST['archivo'] ?? '';
    if (!isset($ARCHIVOS[$clave])) {
        echo json_encode(['ok' => false, 'msg' => 'Archivo no válido']);
        exit;
    }
    $cfg  = $ARCHIVOS[$clave];
    $ruta = $cfg['ruta'];

    if (!is_writable($ruta)) {
        echo json_encode(['ok' => false, 'msg' => 'El archivo no tiene permiso de escritura: '.basename($ruta)]);
        exit;
    }

    $datos = json_decode(file_get_contents($ruta), true);
    if (!is_array($datos)) {
        echo json_encode(['ok' => false, 'msg' => 'JSON inválido en '.basename($ruta)]);
        exit;
    }

    $accion = $_POST['accion'];

    if ($accion === 'guardar') {
        $semana      = (int)($_POST['semana'] ?? 0);
        $responsable = trim($_POST['responsable'] ?? '');
        $telefono    = trim($_POST['telefono'] ?? '');

        if ($semana < 1 || $semana > 53) { echo json_encode(['ok'=>false,'msg'=>'Semana fuera de rango (1-53)']); exit; }
        if ($responsable === '')          { echo json_encode(['ok'=>false,'msg'=>'El responsable no puede estar vacío']); exit; }
        if (!preg_match('/^\+?[0-9\s\-]{7,20}$/', $telefono)) {
            echo json_encode(['ok'=>false,'msg'=>'Formato de teléfono inválido']); exit;
        }

        $encontrado = false;
        foreach ($datos as &$fila) {
            if ((int)$fila['semana'] === $semana && $fila['area'] === $cfg['area']) {
                $fila['responsable'] = $responsable;
                $fila['telefono']    = $telefono;
                $encontrado = true;
                break;
            }
        }
        unset($fila);

        if (!$encontrado) {
            $datos[] = [
                'semana'      => $semana,
                'area'        => $cfg['area'],
                'responsable' => $responsable,
                'telefono'    => $telefono,
            ];
            usort($datos, fn($a, $b) => $a['semana'] - $b['semana']);
        }
    } elseif ($accion === 'eliminar') {
        $semana = (int)($_POST['semana'] ?? 0);
        $datos = array_values(array_filter($datos, fn($f) => !((int)$f['semana'] === $semana && $f['area'] === $cfg['area'])));
    } else {
        echo json_encode(['ok' => false, 'msg' => 'Acción desconocida']);
        exit;
    }

    // Backup antes de guardar
    @copy($ruta, $ruta . '.bak');

    $json = json_encode($datos, JSON_PRETTY_PRINT | JSON_UNESCAPED_UNICODE);
    if (file_put_contents($ruta, $json) === false) {
        echo json_encode(['ok' => false, 'msg' => 'No se pudo escribir el archivo']);
        exit;
    }

    echo json_encode(['ok' => true]);
    exit;
}

// ============================================================
//  CARGAR DATOS PARA LA VISTA
// ============================================================
$datosVista = [];
foreach ($ARCHIVOS as $clave => $cfg) {
    $raw = @file_get_contents($cfg['ruta']);
    $datosVista[$clave] = $raw ? (json_decode($raw, true) ?: []) : [];
}
$semanaActual = (int)date('W');
?>
<!doctype html>
<html lang="es">
<head>
  <meta charset="utf-8">
  <title>Mantenedor de Turnos</title>
  <meta name="viewport" content="width=device-width,initial-scale=1">
  <style>
    :root { --green:#407360; --green-dk:#365f50; --blue:#2057b0; --bg:#EDF0F4; --txt:#1C1C25; }
    * { box-sizing:border-box; }
    body { margin:0; font-family: system-ui, -apple-system, sans-serif; background:var(--bg); color:var(--txt); }
    header { background:var(--txt); color:#fff; padding:14px 24px; display:flex; justify-content:space-between; align-items:center; }
    header h1 { font-size:16px; margin:0; font-weight:600; }
    header a { color:rgba(255,255,255,.8); font-size:13px; text-decoration:none; }
    header a:hover { color:#fff; }
    main { max-width:1100px; margin:24px auto; padding:0 16px; }
    .panel { background:#fff; border-radius:12px; padding:20px; margin-bottom:24px; box-shadow:0 4px 16px rgba(0,0,0,.04); }
    .panel h2 { font-size:18px; margin:0 0 14px; color:var(--green); }
    table { width:100%; border-collapse:collapse; }
    th, td { padding:8px 10px; text-align:left; border-bottom:1px solid #eef0f4; font-size:14px; }
    th { background:#f7f9fc; font-weight:600; color:#555; font-size:12px; text-transform:uppercase; letter-spacing:.3px; }
    tr.actual { background:#fff8e1; }
    input.celda { width:100%; padding:6px 8px; border:1px solid #d0d4dc; border-radius:6px; font-size:14px; background:#fff; }
    input.celda:focus { outline:0; border-color:var(--green); box-shadow:0 0 0 2px rgba(64,115,96,.15); }
    .acciones { display:flex; gap:6px; }
    button.btn { padding:6px 12px; border:0; border-radius:6px; font-size:13px; cursor:pointer; }
    .btn-save { background:var(--green); color:#fff; }
    .btn-save:hover { background:var(--green-dk); }
    .btn-del { background:#eee; color:#a33; }
    .btn-del:hover { background:#fbe5e5; }
    .btn-add { background:var(--blue); color:#fff; padding:8px 16px; font-size:14px; margin-top:12px; }
    .badge { display:inline-block; background:#fff8e1; color:#a87b00; font-size:11px; padding:2px 6px; border-radius:4px; margin-left:6px; }
    #toast { position:fixed; bottom:20px; right:20px; padding:12px 18px; border-radius:8px; color:#fff; font-size:14px; opacity:0; transition:opacity .25s; pointer-events:none; }
    #toast.ok  { background:#2e8b57; opacity:1; }
    #toast.err { background:#b22; opacity:1; }
    .hint { font-size:12px; color:#777; margin-top:4px; }
  </style>
</head>
<body>
  <header>
    <h1>Mantenedor de Turnos · semana actual: <?= $semanaActual ?></h1>
    <a href="?logout=1">Cerrar sesión</a>
  </header>

  <main>
    <?php foreach ($ARCHIVOS as $clave => $cfg): ?>
      <section class="panel" data-archivo="<?= $clave ?>">
        <h2><?= htmlspecialchars($cfg['titulo']) ?></h2>
        <table>
          <thead>
            <tr>
              <th style="width:80px">Semana</th>
              <th>Responsable</th>
              <th style="width:200px">Teléfono</th>
              <th style="width:170px">Acciones</th>
            </tr>
          </thead>
          <tbody>
            <?php foreach ($datosVista[$clave] as $fila): ?>
              <?php $esActual = ((int)$fila['semana'] === $semanaActual); ?>
              <tr class="<?= $esActual ? 'actual' : '' ?>" data-semana="<?= (int)$fila['semana'] ?>">
                <td>
                  <?= (int)$fila['semana'] ?>
                  <?php if ($esActual) echo '<span class="badge">hoy</span>'; ?>
                </td>
                <td><input class="celda resp" value="<?= htmlspecialchars($fila['responsable']) ?>"></td>
                <td><input class="celda tel"  value="<?= htmlspecialchars($fila['telefono']) ?>"></td>
                <td class="acciones">
                  <button class="btn btn-save">Guardar</button>
                  <button class="btn btn-del">Eliminar</button>
                </td>
              </tr>
            <?php endforeach; ?>
          </tbody>
        </table>
        <button class="btn btn-add">+ Agregar semana</button>
        <div class="hint">Teléfono con formato internacional, ej: +56956645705</div>
      </section>
    <?php endforeach; ?>
  </main>

  <div id="toast"></div>

<script>
const toast = (msg, ok = true) => {
  const el = document.getElementById('toast');
  el.textContent = msg;
  el.className = ok ? 'ok' : 'err';
  setTimeout(() => { el.className = ''; }, 2400);
};

async function enviar(archivo, datos) {
  const body = new URLSearchParams({ archivo, ...datos });
  const r = await fetch('turnos-admin.php', { method:'POST', body });
  return r.json();
}

document.querySelectorAll('section.panel').forEach(panel => {
  const archivo = panel.dataset.archivo;

  panel.addEventListener('click', async (e) => {
    const fila = e.target.closest('tr');

    if (e.target.classList.contains('btn-save') && fila) {
      const semana      = fila.dataset.semana;
      const responsable = fila.querySelector('.resp').value.trim();
      const telefono    = fila.querySelector('.tel').value.trim();
      const res = await enviar(archivo, { accion:'guardar', semana, responsable, telefono });
      toast(res.ok ? `Semana ${semana} guardada` : res.msg, res.ok);
    }

    if (e.target.classList.contains('btn-del') && fila) {
      if (!confirm(`¿Eliminar la semana ${fila.dataset.semana}?`)) return;
      const res = await enviar(archivo, { accion:'eliminar', semana: fila.dataset.semana });
      if (res.ok) { fila.remove(); toast('Eliminado'); }
      else toast(res.msg, false);
    }

    if (e.target.classList.contains('btn-add')) {
      const semana = prompt('Número de semana (1-53):');
      if (!semana) return;
      const responsable = prompt('Responsable:');
      if (!responsable) return;
      const telefono = prompt('Teléfono (ej: +56956645705):');
      if (!telefono) return;
      const res = await enviar(archivo, { accion:'guardar', semana, responsable, telefono });
      if (res.ok) { toast('Agregado — recargando…'); setTimeout(() => location.reload(), 800); }
      else toast(res.msg, false);
    }
  });
});
</script>
</body>
</html>
