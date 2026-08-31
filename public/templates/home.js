import BANNER from "../components/banner.js";
export default `

<!DOCTYPE html>
<html lang="es" data-tema="papel">

<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">

  <title>kirkversario</title>

  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>

  <link
    href="https://fonts.googleapis.com/css2?family=Bricolage+Grotesque:opsz,wght@12..96,400;12..96,700;12..96,800&family=Instrument+Sans:wght@400;500&family=DM+Mono:wght@400;500&display=swap"
    rel="stylesheet"
  >

  <style>

    :root {
      --fondo: #F3EDDF;
      --texto: #191552;
      --tarjeta: #FBF7EC;
      --rosa: #FF4A6E;
      --amarillo: #FFC233;

      --borde: rgba(25, 21, 82, .2);
      --fuerte: rgba(25, 21, 82, .5);
      --tenue: rgba(25, 21, 82, .55);

      --display: 'Bricolage Grotesque', 'Arial Black', sans-serif;
      --cuerpo: 'Instrument Sans', system-ui, -apple-system, sans-serif;
      --mono: 'DM Mono', ui-monospace, Menlo, monospace;
    }

    [data-tema="noche"] {
      --fondo: #12103F;
      --texto: #F3EDDF;
      --tarjeta: #1B1857;

      --borde: rgba(243, 237, 223, .2);
      --fuerte: rgba(243, 237, 223, .45);
      --tenue: rgba(243, 237, 223, .58);
    }

    * {
      box-sizing: border-box;
    }

    [hidden] {
      display: none !important;
    }

    html {
      height: 100%;
    }

    body {
      margin: 0;
      background: var(--fondo);
      color: var(--texto);
      font-family: var(--cuerpo);
      font-size: 17px;
      line-height: 1.55;
      -webkit-font-smoothing: antialiased;
    }


    .env {
      max-width: none;
      margin: 0;
      padding: 0 26px;
    }

    /* =========================================================
       DOS COLUMNAS + BOTÓN DE INTERCAMBIO
       ========================================================= */

    .duo {
      display: grid;
      grid-template-columns: 1fr 1px 1fr;
      column-gap: 40px;
      align-items: stretch;
    }

    /* cada columna se estira y su bloque flexible
       se come el hueco sobrante, para que las dos
       terminen a la misma altura sin espacios muertos */
    .duo__lado {
      display: flex;
      flex-direction: column;
    }

    .duo__lado > section {
      display: flex;
      flex-direction: column;
    }

    .duo__lado > section:last-child {
      flex: 1;
    }

    .mesesCaja {
      flex: 1;
      display: flex;
      flex-direction: column;
    }

    .meses {
      flex: 1;
    }

    #ladoTexto .glifos {
      flex: 1;
      grid-auto-rows: minmax(72px, 1fr);
    }

    #tecladoCaja {
      display: flex;
      flex-direction: column;
      flex: 1;
      min-height: 0;
    }


    .duo__lado {
      min-width: 0;
      grid-row: 1;
    }


    #ladoFechas { grid-column: 1; }
    #ladoTexto  { grid-column: 3; }

    .duo__medio {
      grid-row: 1;
      grid-column: 2;
    }

    .duo__lado section {
      padding: 34px 0 40px;
    }

    .duo__medio {
      position: relative;
    }

    /* línea fina que separa las dos columnas */
    .duo__medio::before {
      content: "";
      position: absolute;
      top: 40px;
      bottom: 40px;
      left: 50%;
      width: 2px;
      background: var(--borde);
    }

    /* =========================================================
       LEYENDA DE MESES
       ========================================================= */

    .mesesCaja {
      margin-top: 18px;
      border: 2px solid var(--texto);
      border-radius: 14px;
      background: var(--tarjeta);
      padding: 14px 16px 16px;
    }

    .mesesCaja__et {
      font-family: var(--mono);
      font-size: 10px;
      text-transform: uppercase;
      letter-spacing: .12em;
      color: var(--tenue);
      margin: 0 0 10px;
      display: flex;
      justify-content: space-between;
      gap: 10px;
    }

    .meses {
      display: grid;
      grid-template-columns: 1fr;
      grid-auto-rows: minmax(56px, 1fr);
    }

    .mes {
      display: grid;
      grid-template-columns: 30px 1fr auto;
      align-items: center;
      gap: 14px;
      padding: 6px 2px;
      border-bottom: 1px solid var(--borde);
    }

    .mes:last-child {
      border-bottom: 0;
    }

    .mes__txt {
      display: flex;
      flex-direction: column;
      gap: 1px;
      min-width: 0;
    }

    .mes__dias {
      font-family: var(--mono);
      font-size: 12px;
      color: var(--tenue);
      white-space: nowrap;
    }

    .mes--hoy .mes__dias {
      color: var(--rosa);
    }

    .mes__n {
      font-family: var(--mono);
      font-size: 11.5px;
      color: var(--tenue);
    }

    .mes__nombre {
      font-weight: 500;
      font-size: 16px;
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
    }

    .mes__rango {
      font-family: var(--mono);
      font-size: 12.5px;
      color: var(--tenue);
      white-space: nowrap;
    }

    .mes--hoy .mes__nombre {
      color: var(--rosa);
      font-weight: 700;
    }

    .mes--hoy .mes__n,
    .mes--hoy .mes__rango {
      color: var(--rosa);
    }

    /* =========================================================
       GLIFOS PULSADOS
       ========================================================= */

    /* apilado: alto fijo, igual que el textarea y el lienzo,
       para que escribir con la tabla tampoco empuje nada */
    .lienzoK {
      flex: none;
      height: 200px;
      overflow-y: auto;
      min-height: 78px;
      line-height: 1.85;
      word-break: break-word;
      align-content: flex-start;
      border: 2px dashed var(--borde);
      border-radius: 10px;
      padding: 8px 10px;
      margin-bottom: 12px;
      display: flex;
      flex-wrap: wrap;
      align-items: center;
      gap: 4px 10px;
      overflow-x: auto;
    }

    .lienzoK svg {
      display: inline-block;
      vertical-align: -.3em;
      width: 19px;
      height: 24px;
      margin-right: 1px;
    }

    .lienzoK .pal {
      display: inline;
      margin-right: .5em;
      overflow-wrap: anywhere;
    }

    .lienzoK .vacio {
      font-size: 13px;
      color: var(--tenue);
    }

    .top {
      display: flex;
      align-items: center;
      flex-wrap: wrap;
      gap: 12px;
      padding: 18px 26px;
      max-width: none;
      margin: 0;
      border-bottom: 2px solid var(--texto);
    }

    .top h1 {
      font-family: var(--display);
      font-weight: 800;
      font-size: 19px;
      text-transform: uppercase;
      letter-spacing: -.02em;
      margin: 0 auto 0 0;
    }

    .top h1 span {
      color: var(--rosa);
    }

    .btn {
      font-family: var(--mono);
      font-size: 11px;
      text-transform: uppercase;
      letter-spacing: .07em;
      background: transparent;
      color: var(--texto);
      border: 1.5px solid var(--texto);
      border-radius: 999px;
      padding: 7px 14px;
      cursor: pointer;
    }

    .btn:hover {
      background: var(--texto);
      color: var(--fondo);
    }

    :focus-visible {
      outline: 3px solid var(--rosa);
      outline-offset: 2px;
    }

    section {
      padding: 40px 0;
    }

    section + section {
      border-top: 2px solid var(--texto);
    }

    .duo + section {
      border-top: 2px solid var(--texto);
    }

    h2 {
      font-family: var(--display);
      font-weight: 800;
      font-size: clamp(26px, 2.4vw, 38px);
      letter-spacing: -.03em;
      margin: 0 0 8px;
    }

    .sub {
      color: var(--tenue);
      margin: 0 0 24px;
      max-width: 70ch;
      font-size: 16px;
    }

    /* =========================================================
       FUENTE
       ========================================================= */

    @font-face {
      font-family: "KarlosKikos";
      src: url("./fonts/karloskikos.ttf") format("truetype");
    }

    .kikos-icon {
      font-family: "KarlosKikos";
    }

    /* =========================================================
       TRADUCTOR
       ========================================================= */

    .trad {
      display: grid;
      /* minmax(0,...) y no 1fr: el mínimo automático de 1fr es
         el ancho del contenido, y una palabra larga estiraba la
         columna de salida aplastando la de entrada */
      grid-template-columns: minmax(0, 1fr) 52px minmax(0, 1fr);
      border: 2px solid var(--texto);
      border-radius: 14px;
      overflow: hidden;
      background: var(--tarjeta);
    }

    .panel {
      min-width: 0;
      padding: 22px;
      min-height: 190px;
      display: flex;
      flex-direction: column;
    }

    #ladoTexto .panel {
      min-height: 340px;
    }

    /* apilado: alto fijo, así escribir tampoco empuja nada */
    #ladoTexto textarea {
      flex: none;
      height: 200px;
      resize: none;
      min-height: 0;
      overflow-y: auto;
    }

    /* apilado: alto fijo igual que el textarea, así la caja
       nunca cambia de tamaño según lo que escribas */
    #ladoTexto .lienzo {
      flex: none;
      height: 200px;
      min-height: 0;
      overflow-y: auto;
    }


    .panel__et {
      font-family: var(--mono);
      font-size: 10px;
      text-transform: uppercase;
      letter-spacing: .12em;
      color: var(--tenue);
      margin: 0 0 12px;
    }

    .medio {
      display: flex;
      align-items: center;
      justify-content: center;
      border-left: 2px solid var(--texto);
      border-right: 2px solid var(--texto);
      background: var(--amarillo);
    }

    .medio button {
      background: none;
      border: 0;
      font-size: 20px;
      color: #191552;
      cursor: pointer;
      padding: 10px;
      line-height: 1;
    }

    .salida {
      font-family: var(--display);
      font-weight: 800;
      font-size: clamp(26px, 2.6vw, 40px);
      line-height: 1.1;
      letter-spacing: -.025em;
      margin: 0;
      flex: 1;
    }

    .salida {
      min-height: 0;
      overflow: hidden;
    }

    /* apilado: la salida en español tampoco puede empujar
       el panel cuando el texto pasa de una línea */
    #salidaT {
      flex: none;
      height: 200px;
      overflow-y: auto;
    }

    .salida small {
      display: block;
      font-family: var(--mono);
      font-weight: 400;
      font-size: 13.5px;
      color: var(--tenue);
      margin-top: 8px;
      letter-spacing: 0;
    }

    .contador {
      font-family: var(--mono);
      font-size: 11px;
      color: var(--tenue);
      margin: 6px 0 0;
      text-align: right;
    }

    .contador--tope {
      color: var(--rosa);
    }

    .pieP {
      display: flex;
      gap: 8px;
      margin-top: 12px;
      flex-wrap: wrap;
    }

    input[type="date"],
    input[type="number"],
    select,
    textarea {
      background: var(--fondo);
      border: 1.5px solid var(--fuerte);
      border-radius: 8px;
      padding: 10px;
      font-family: var(--mono);
      font-size: 15px;
      width: 100%;
      color: inherit;
      min-height: 44px;
    }

    textarea {
      font-family: var(--cuerpo);
      font-size: 17px;
      resize: vertical;
      min-height: 120px;
      line-height: 1.4;
    }

    .rejK {
      display: grid;
      grid-template-columns: 66px 1fr;
      gap: 8px;
    }

    .rejK2 {
      display: grid;
      grid-template-columns: 1fr 84px;
      gap: 8px;
      margin-top: 8px;
    }

    .et {
      font-family: var(--mono);
      font-size: 10px;
      text-transform: uppercase;
      letter-spacing: .1em;
      color: var(--tenue);
      display: block;
      margin-bottom: 4px;
    }

    /* =========================================================
       MESES
       ========================================================= */

    table {
      width: 100%;
      border-collapse: collapse;
      font-size: 15px;
    }

    th {
      font-family: var(--mono);
      font-size: 10px;
      text-transform: uppercase;
      letter-spacing: .09em;
      color: var(--tenue);
      text-align: left;
      padding: 0 10px 8px;
      font-weight: 400;
      border-bottom: 2px solid var(--texto);
    }

    td {
      padding: 11px 10px;
      border-bottom: 1px solid var(--borde);
    }

    tr:last-child td {
      border-bottom: 0;
    }

    td.n {
      font-family: var(--mono);
      font-size: 12px;
      color: var(--tenue);
      width: 34px;
    }

    td.m {
      font-family: var(--display);
      font-weight: 700;
      white-space: nowrap;
    }

    td.g {
      font-family: var(--mono);
      font-size: 12.5px;
      color: var(--tenue);
      white-space: nowrap;
    }

    .desliza {
      overflow-x: auto;
    }

    /* =========================================================
       ALFABETO
       ========================================================= */

    .glifos {
      display: grid;
      grid-template-columns: repeat(auto-fill, minmax(96px, 1fr));
      gap: 10px;
    }

    .gl {
      background: var(--tarjeta);
      color: var(--texto);
      border: 1.5px solid var(--borde);
      border-radius: 12px;
      padding: 14px 6px;
      text-align: center;
      cursor: pointer;
      font: inherit;
      transition: border-color .12s ease, background .12s ease;
    }

    .gl:hover {
      border-color: var(--texto);
      background: var(--fondo);
    }

    .gl:active {
      background: var(--amarillo);
    }

    .gl svg {
      width: 36px;
      height: 46px;
      display: block;
      margin: 0 auto 6px;
    }

    .gl b {
      font-family: var(--mono);
      font-size: 14px;
      font-weight: 500;
      text-transform: uppercase;
    }

    .leyenda {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 14px;
      margin: 0 0 22px;
    }

    .leyenda div {
      border-left: 4px solid var(--rosa);
      padding: 2px 0 2px 12px;
      font-size: 14.5px;
      color: var(--tenue);
    }

    .leyenda b {
      color: var(--texto);
      font-family: var(--display);
      font-weight: 700;
      display: block;
    }

    /* =========================================================
       LIENZO
       ========================================================= */

    .lienzo {
      flex: 1;
      display: block;
      min-height: 80px;
      line-height: 1.85;
      overflow-y: auto;
      word-break: break-word;
    }

    /* cada palabra es una caja en línea: al llegar al borde
       salta abajo. Si una sola palabra es más larga que la
       caja, se parte, que si no estiraría el panel. */
    .pal {
      display: inline;
      margin-right: .5em;
      overflow-wrap: anywhere;
    }

    .lienzo svg {
      display: inline-block;
      vertical-align: -.3em;
      width: 17px;
      height: 22px;
      margin-right: 1px;
      color: var(--texto);
    }


    .lienzo .raw {
      font-family: var(--mono);
      font-size: 20px;
      align-self: center;
      color: var(--tenue);
    }

    .vacio {
      color: var(--tenue);
      font-size: 15px;
      font-family: var(--cuerpo);
    }

    /* =========================================================
       TECLADO
       ========================================================= */







    /* =========================================================
       PIE
       ========================================================= */

    .pie {
      border-top: 2px solid var(--texto);
      padding: 22px 0 36px;
      font-family: var(--mono);
      font-size: 11px;
      color: var(--tenue);
      text-transform: uppercase;
      letter-spacing: .07em;
    }

    /* =========================================================
       EVENTOS
       ========================================================= */


    /* =========================================================
       RESPONSIVE
       ========================================================= */

    /* las dos columnas se apilan antes que el resto,
       porque cada una necesita su propio ancho */
    @media (max-width: 1080px) {

      .duo {
        display: flex;
        flex-direction: column;
      }

      .duo__medio {
        display: none;
      }

      #ladoTexto .panel {
        min-height: 0;
      }

      .meses {
        grid-template-columns: repeat(2, minmax(0, 1fr));
      }
    }

    @media (max-width: 720px) {

      .trad {
        grid-template-columns: 1fr;
      }

      .medio {
        border-left: 0;
        border-right: 0;
        border-top: 2px solid var(--texto);
        border-bottom: 2px solid var(--texto);
        padding: 2px;
      }

      .medio button {
        transform: rotate(90deg);
      }

      .leyenda {
        grid-template-columns: 1fr;
      }

      .meses {
        grid-template-columns: 1fr;
      }

      section {
        padding: 32px 0;
      }
    }

    /* =========================================================
       UNA SOLA PANTALLA

       Con al menos 1081x700 la página mide exactamente el alto
       de la ventana y no hay scroll. Cada bloque que puede
       crecer lleva min-height:0 y su propio overflow, así que
       escribir un texto largo no mueve nada de sitio.

       Por debajo de ese tamaño no cabe todo sin dejar el texto
       ilegible, así que se vuelve al desplazamiento normal.
       ========================================================= */

    @media (min-width: 1081px) and (min-height: 700px) {

      body {
        height: 100%;
        display: flex;
        flex-direction: column;
        overflow: hidden;
      }

      .top {
        flex: 0 0 auto;
      }

      .env {
        flex: 1;
        min-height: 0;
        display: flex;
        flex-direction: column;
      }

      .duo {
        flex: 1;
        min-height: 0;
      }

      .duo__lado {
        min-height: 0;
        overflow: hidden;
      }

      .duo__lado > section {
        min-height: 0;
        padding: clamp(10px, 2vh, 20px) 0 clamp(8px, 1.5vh, 16px);
      }

      /* en pantallas bajas las cabeceras también encogen,
         si no se comen el sitio de la leyenda y del alfabeto */
      .duo__lado h2 {
        font-size: clamp(19px, 3vh, 38px);
        margin-bottom: clamp(2px, .6vh, 8px);
      }

      .duo__lado .sub {
        font-size: clamp(12px, 1.6vh, 16px);
        line-height: 1.4;
        margin-bottom: clamp(8px, 1.8vh, 24px);
      }

      .mesesCaja {
        padding: clamp(8px, 1.3vh, 14px) 16px clamp(8px, 1.3vh, 16px);
      }

      .mesesCaja__et {
        margin-bottom: clamp(3px, .8vh, 10px);
        font-size: clamp(8px, 1.1vh, 10px);
      }

      #ladoFechas .trad {
        flex: 0 0 auto;
      }

      #ladoFechas .panel {
        min-height: clamp(148px, 20vh, 200px);
      }

      .mesesCaja {
        min-height: 0;
      }

      /* seis meses en cada columna: filas el doble de altas,
         así vuelve a caber el rango debajo del nombre */
      .mesesCaja .meses {
        min-height: 0;
        grid-template-columns: repeat(2, minmax(0, 1fr));
        grid-template-rows: repeat(6, minmax(0, 1fr));
        grid-auto-flow: column;
        gap: 0 26px;
        overflow: hidden;
      }

      .mesesCaja .mes {
        min-height: 0;
        padding: 2px;
        overflow: hidden;
        grid-template-columns: 30px 1fr auto;
      }

      .mesesCaja .mes__txt {
        flex-direction: column;
        align-items: flex-start;
        gap: 1px;
        overflow: hidden;
      }

      /* el texto de la leyenda se mide en vh: en una pantalla
         baja las filas son más cortas y con tamaño fijo el
         texto no cabía y se salía de su fila */
      .mesesCaja .mes__nombre {
        font-size: clamp(12px, 1.55vh, 17px);
        line-height: 1.2;
      }

      .mesesCaja .mes__rango,
      .mesesCaja .mes__dias,
      .mesesCaja .mes__n {
        font-size: clamp(10px, 1.25vh, 13px);
        line-height: 1.2;
      }

      .mesesCaja .mes__rango {
        overflow: hidden;
        text-overflow: ellipsis;
      }

      /* derecha: el traductor y el alfabeto se reparten el alto
         en proporción fija, nunca según el contenido */
      #ladoTexto > section:first-of-type {
        flex: 5 1 0;
      }

      #ladoTexto > section:last-of-type {
        flex: 5 1 0;
      }

      #ladoTexto .trad {
        flex: 1;
        min-height: 0;
      }

      #ladoTexto .panel {
        min-height: 0;
      }

      #ladoTexto textarea,
      #ladoTexto .lienzo {
        min-height: 0;
        overflow-y: auto;
      }

      #tecladoCaja {
        min-height: 0;
      }

      #ladoTexto .lienzoK {
        flex: 1;
        height: auto;
        min-height: 0;
        overflow-y: auto;
      }

      #ladoTexto textarea {
        flex: 1;
        height: auto;
        max-height: none;
      }

      #salidaT {
        flex: 1;
        height: auto;
      }

      #ladoTexto .lienzo {
        flex: 1;
        height: auto;
        max-height: none;
      }

      /* 9 columnas fijas = 3 filas exactas para las 27 letras,
         y las fichas escalan para llenar el alto disponible */
      #ladoTexto .glifos {
        min-height: 0;
        grid-template-columns: repeat(9, minmax(0, 1fr));
        grid-auto-rows: minmax(0, 1fr);
        overflow: hidden;
      }

      #ladoTexto .gl {
        min-height: 0;
        padding: 4px;
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
        gap: 2px;
      }

      #ladoTexto .gl b {
        font-size: clamp(9px, 1.3vh, 14px);
        line-height: 1;
      }

      #ladoTexto .gl svg {
        width: auto;
        height: 100%;
        min-height: 0;
        max-height: 52px;
        flex: 1;
        margin: 0;
      }

      /* el alfabeto ocupa menos cabecera para dejar sitio */
      #ladoTexto > section:last-of-type h2 {
        font-size: clamp(22px, 1.7vw, 28px);
        margin-bottom: 4px;
      }

      #ladoTexto > section:last-of-type .sub {
        margin-bottom: 12px;
        font-size: 15px;
      }

      #ladoTexto .leyenda {
        margin-bottom: 14px;
        font-size: 14px;
      }

      .pie {
        flex: 0 0 auto;
        padding: 12px 0;
      }
    }

    /* pantallas bajas: las dos tarjetas explicativas del
       alfabeto se llevan unos 90px que la tabla necesita */
    @media (min-width: 1081px) and (max-height: 830px) {

      #ladoTexto .leyenda {
        display: none;
      }
    }

    @media (prefers-reduced-motion: reduce) {
      * {
        transition: none !important;
        animation: none !important;
      }
    }

  </style>
</head>

${BANNER}

<body>

  <!-- ========================================================
       CABECERA
       ======================================================== -->

  <header class="top">

    <h1>
      Kirkversario
      <span>HOME</span>
    </h1>

    <a class="btn" href="/calendar">
      Calendar
    </a>

    {{ADMIN_BUTTON}}
    
    <button class="btn" id="btnTema">
      Noche
    </button>

  </header>


  <main class="env">

    <!-- ======================================================
         DOS COLUMNAS: FECHAS  |  TEXTO
         ====================================================== -->

    <div class="duo" id="duo">

      <div class="duo__lado" id="ladoFechas">

        <section>

          <h2>Fechas</h2>

          <p class="sub">
            El 10 de septiembre es el 1 de Kirktrump del Año 1.
            Escribe una fecha y sale la otra.
            El botón del medio cambia el sentido.
          </p>


          <div class="trad">

            <!-- IZQUIERDA -->

            <div class="panel" id="panelIzq">

              <p class="panel__et" id="etIzq">
                Calendario gregoriano
              </p>


              <div id="entradaG">

                <div class="rejK">

                  <div>

                    <span class="et">
                      Día
                    </span>

                    <input
                      type="number"
                      id="inGDia"
                      inputmode="numeric"
                      min="1"
                      max="31"
                      value="1"
                    >

                  </div>


                  <div>

                    <span class="et">
                      Mes
                    </span>

                    <select id="inGMes"></select>

                  </div>

                </div>


                <div class="rejK2">

                  <div>

                    <span class="et">
                      Año
                    </span>

                    <input
                      type="number"
                      id="inGAnio"
                      inputmode="numeric"
                      value="2026"
                    >

                  </div>

                </div>

              </div>


              <div id="entradaK" hidden>

                <div class="rejK">

                  <div>

                    <span class="et">
                      Día
                    </span>

                    <input
                      type="number"
                      id="inDia"
                      min="1"
                      max="31"
                      value="1"
                    >

                  </div>


                  <div>

                    <span class="et">
                      Mes
                    </span>

                    <select id="inMes"></select>

                  </div>

                </div>


                <div class="rejK2">

                  <div>

                    <span class="et">
                      Año
                    </span>

                    <input
                      type="number"
                      id="inAnio"
                      min="1"
                      value="1"
                    >

                  </div>


                  <div>

                    <span class="et">
                      Era
                    </span>

                    <select id="inEra">

                      <option value="d">
                        d.K.
                      </option>

                      <option value="a">
                        a.K.
                      </option>

                    </select>

                  </div>

                </div>

              </div>


              <div class="pieP">

                <button class="btn" id="btnHoy">
                  Hoy
                </button>

              </div>

            </div>


            <!-- BOTÓN CENTRAL -->

            <div class="medio">

              <button
                id="btnGirar"
                title="Cambiar el sentido"
                aria-label="Cambiar el sentido"
              >
                ⇄
              </button>

            </div>


            <!-- DERECHA -->

            <div class="panel">

              <p class="panel__et" id="etDer">
                Calendario Charlie Kirk
              </p>

              <p class="salida" id="salidaF">
                —
              </p>

              <div class="pieP">

                <button class="btn" id="btnCopiaF">
                  Copiar
                </button>

              </div>

            </div>

          </div>


          <!-- LEYENDA DE MESES -->

          <div class="mesesCaja">

            <p class="mesesCaja__et">
              Los doce meses
              <span id="mesesAnio"></span>
            </p>

            <div class="meses" id="meses"></div>

          </div>

        </section>

      </div>


      <div class="duo__medio"></div>


      <div class="duo__lado" id="ladoTexto">

        <section>

          <h2>
            Texto
          </h2>

          <p class="sub">
            Escribe cualquier cosa y se pasa al alfabeto Charlie Kirk.
            Gira el sentido y escribe pulsando las letras de la tabla
            de aquí abajo.
          </p>


          <div class="trad">

            <!-- TEXTO IZQUIERDA -->

            <div class="panel">

              <p class="panel__et" id="etTxtIzq">
                Español
              </p>


              <textarea
                id="inTexto"
                placeholder="Escribe aquí…"
                rows="4"
                maxlength="220"
              ></textarea>

              <p class="contador" id="contador">
                0 / 220
              </p>


              <div id="tecladoCaja" hidden>

                <div
                  class="lienzoK"
                  id="lienzoK"
                >
                  <span class="vacio">
                    Pulsa las letras de la tabla de abajo
                    y aparecerán aquí.
                  </span>
                </div>

                <div class="pieP">

                  <button class="btn" id="btnEspacio">
                    Espacio
                  </button>

                  <button class="btn" id="btnBorrar">
                    Borrar
                  </button>

                </div>

              </div>

            </div>


            <!-- BOTÓN -->

            <div class="medio">

              <button
                id="btnGirarT"
                title="Cambiar el sentido"
                aria-label="Cambiar el sentido"
              >
                ⇄
              </button>

            </div>


            <!-- RESULTADO -->

            <div class="panel">

              <p class="panel__et" id="etTxtDer">
                Alfabeto Kirk
              </p>


              <div
                class="lienzo"
                id="lienzo"
              >
                <span class="vacio">
                  La traducción aparece aquí.
                </span>
              </div>


              <p
                class="salida"
                id="salidaT"
                hidden
              ></p>


              <div class="pieP">

                <button
                  class="btn"
                  id="btnCopiaT"
                >
                  Copiar
                </button>

              </div>

            </div>

          </div>

        </section>


        <!-- ==================================================
             ALFABETO (dentro de la columna de Texto)
             ================================================== -->

        <section>

          <h2>
            El alfabeto Kirk
          </h2>

          <p class="sub">
            Veintisiete letras con una lógica detrás,
            para que se pueda aprender en un rato.
          </p>


          <div class="leyenda">

            <div>

              <b>
                No se parecen al abecedario
              </b>

              Ninguna letra recuerda a una latina ni a un número.
              Comprobado contra las 62 letras y cifras en tres tipografías
              distintas.

            </div>


            <div>

              <b>
                Ni se parecen entre ellas
              </b>

              Cada una es una figura entera:
              casa, escalera, nube, trébol, cometa, arcoíris.
              Nada de troncos con rayitas.

            </div>

          </div>


          <div
            class="glifos"
            id="glifos"
          ></div>

        </section>

      </div>

    </div>


    <!-- PIE -->

    <div
      class="pie"
      id="pie"
    ></div>

  </main>


  <!-- ========================================================
       JAVASCRIPT
       ======================================================== -->

  <script>

    (function () {

      "use strict";


      /* ======================================================
         CALENDARIO
         ====================================================== */

      var MESES = [

        {
          n: "Kirktrump",
          d: 31
        },

        {
          n: "Kirknigger",
          d: 28
        },

        {
          n: "Kirkbaiden",
          d: 31
        },

        {
          n: "Kirkennedy",
          d: 30
        },

        {
          n: "Kirknetanyahu",
          d: 31
        },

        {
          n: "Kirkfranco",
          d: 30
        },

        {
          n: "Kirkronaldo",
          d: 31
        },

        {
          n: "Kirkwashington",
          d: 31
        },

        {
          n: "Kirkghandi",
          d: 30
        },

        {
          n: "Kirkmessi",
          d: 31
        },

        {
          n: "Kirkgay",
          d: 30
        },

        {
          n: "Kirkeroro",
          d: 31
        }

      ];


      var MG = [
        "Enero",
        "Febrero",
        "Marzo",
        "Abril",
        "Mayo",
        "Junio",
        "Julio",
        "Agosto",
        "Septiembre",
        "Octubre",
        "Noviembre",
        "Diciembre"
      ];


      var MGC = [
        "ene",
        "feb",
        "mar",
        "abr",
        "may",
        "jun",
        "jul",
        "ago",
        "sep",
        "oct",
        "nov",
        "dic"
      ];


      var SEM = [
        "lunes",
        "martes",
        "miércoles",
        "jueves",
        "viernes",
        "sábado",
        "domingo"
      ];


      var MS = 86400000;
      var EPOCA = 2025;
      var dir = "g2k";


      /* ======================================================
         UTILIDADES
         ====================================================== */

      function $(i) {
        return document.getElementById(i);
      }


      function utc(y, m, d) {

        var f = new Date(
          Date.UTC(2000, 0, 1)
        );

        f.setUTCFullYear(
          y,
          m - 1,
          d
        );

        f.setUTCHours(
          0,
          0,
          0,
          0
        );

        return f.getTime();
      }


      function bis(y) {

        return (
          (y % 4 === 0 && y % 100 !== 0) ||
          y % 400 === 0
        );

      }


      function dm(i, g) {

        return (
          i === 1 && bis(g + 1)
        )
          ? 29
          : MESES[i].d;

      }


      function largo(g) {

        return bis(g + 1)
          ? 366
          : 365;

      }


      function gDe(a) {

        return a > 0
          ? EPOCA + a - 1
          : EPOCA + a;

      }


      function nAnio(a) {

        return a > 0
          ? "Año " + a + " d.K."
          : "Año " + Math.abs(a) + " a.K.";

      }


      /* ======================================================
         CONVERSIÓN GREGORIANO -> KIRK
         ====================================================== */

      function aKK(y, m, d) {

        var g =
          (
            m > 9 ||
            (m === 9 && d >= 10)
          )
            ? y
            : y - 1;


        var dia =
          Math.round(
            (
              utc(y, m, d) -
              utc(g, 9, 10)
            ) / MS
          ) + 1;


        var n = g - EPOCA;

        var anio =
          n >= 0
            ? n + 1
            : n;


        var r = dia;
        var me = 0;


        while (
          r > dm(me, g)
        ) {

          r -= dm(me, g);
          me++;

        }


        return {

          anio: anio,
          mes: me + 1,
          dia: r,
          diaAnio: dia,
          gI: g,
          largo: largo(g)

        };

      }


      function kkMs(ms) {

        var f = new Date(ms);

        return aKK(
          f.getUTCFullYear(),
          f.getUTCMonth() + 1,
          f.getUTCDate()
        );

      }


      function msKK(a, m, d) {

        var g = gDe(a);
        var ac = 0;


        for (
          var i = 0;
          i < m - 1;
          i++
        ) {

          ac += dm(i, g);

        }


        return (
          utc(g, 9, 10) +
          (ac + d - 1) * MS
        );

      }


      /* ======================================================
         FORMATO DE FECHAS
         ====================================================== */

      function tG(ms) {

        var f = new Date(ms);

        return (
          f.getUTCDate() +
          " de " +
          MG[f.getUTCMonth()] +
          " de " +
          f.getUTCFullYear()
        );

      }


      function tGc(ms) {

        var f = new Date(ms);

        return (
          f.getUTCDate() +
          " " +
          MGC[f.getUTCMonth()]
        );

      }


      function tK(k) {

        return (
          k.dia +
          " de " +
          MESES[k.mes - 1].n
        );

      }


      function iso(ms) {

        var f = new Date(ms);

        return (
          f.getUTCFullYear() +
          "-" +
          String(
            f.getUTCMonth() + 1
          ).padStart(2, "0") +
          "-" +
          String(
            f.getUTCDate()
          ).padStart(2, "0")
        );

      }


      function hoyMs() {

        var h = new Date();

        return utc(
          h.getFullYear(),
          h.getMonth() + 1,
          h.getDate()
        );

      }


      function sem(ms) {

        return SEM[
          (
            new Date(ms).getUTCDay() +
            6
          ) % 7
        ];

      }


      /* ======================================================
         SELECTOR DE MESES
         ====================================================== */

      var op = "";

      MESES.forEach(
        function (m, i) {

          op +=
            '<option value="' +
            (i + 1) +
            '">' +
            m.n +
            "</option>";

        }
      );


      $("inMes").innerHTML = op;


      var opG = "";

      MG.forEach(
        function (m, i) {

          opG +=
            '<option value="' +
            (i + 1) +
            '">' +
            m +
            "</option>";

        }
      );


      $("inGMes").innerHTML = opG;


      /* ======================================================
         LEYENDA DE LOS DOCE MESES
         ====================================================== */

      function pintarLeyendaMeses() {

        var caja = $("meses");

        if (!caja) {
          return;
        }


        var hoy = kkMs(hoyMs());
        var anio = hoy.anio;
        var g = gDe(anio);


        $("mesesAnio").textContent =
          nAnio(anio);


        var h = "";


        MESES.forEach(
          function (m, i) {

            var dias = dm(i, g);

            var ini = new Date(
              msKK(anio, i + 1, 1)
            );

            var fin = new Date(
              msKK(anio, i + 1, dias)
            );


            var rango =
              ini.getUTCDate() +
              " " +
              MGC[ini.getUTCMonth()] +
              " – " +
              fin.getUTCDate() +
              " " +
              MGC[fin.getUTCMonth()];


            h +=
              '<div class="mes' +
              (i + 1 === hoy.mes ? " mes--hoy" : "") +
              '">' +

              '<span class="mes__n">' +
              (i + 1 < 10 ? "0" : "") +
              (i + 1) +
              "</span>" +

              '<span class="mes__txt">' +

              '<span class="mes__nombre">' +
              m.n +
              "</span>" +

              '<span class="mes__rango">' +
              rango +
              "</span>" +

              "</span>" +

              '<span class="mes__dias">' +
              dias +
              " días</span>" +

              "</div>";

          }
        );


        caja.innerHTML = h;

      }


      /* ======================================================
         TRADUCIR FECHA
         ====================================================== */

      function traducirFecha() {

        if (dir === "g2k") {

          var gd =
            parseInt(
              $("inGDia").value,
              10
            );


          var gm =
            parseInt(
              $("inGMes").value,
              10
            );


          var ga =
            parseInt(
              $("inGAnio").value,
              10
            );


          /* mientras se está escribiendo el año
             puede quedar vacío o a medias */
          if (
            !gd ||
            !gm ||
            isNaN(ga) ||
            String($("inGAnio").value).trim() === ""
          ) {

            $("salidaF").textContent = "—";
            return;

          }


          var mxG =
            [
              31,
              bis(ga) ? 29 : 28,
              31, 30, 31, 30,
              31, 31, 30, 31, 30, 31
            ][gm - 1];


          if (gd > mxG) {

            gd = mxG;
            $("inGDia").value = mxG;

          }


          $("inGDia").max = mxG;


          var k =
            aKK(
              ga,
              gm,
              gd
            );


          $("salidaF").innerHTML =
            tK(k) +
            "<small>" +
            nAnio(k.anio) +
            " · día " +
            k.diaAnio +
            " de " +
            k.largo +
            "</small>";

        }

        else {

          var d =
            parseInt(
              $("inDia").value,
              10
            ) || 1;


          var m =
            parseInt(
              $("inMes").value,
              10
            );


          var a =
            Math.abs(
              parseInt(
                $("inAnio").value,
                10
              )
            ) || 1;


          if (
            $("inEra").value === "a"
          ) {

            a = -a;

          }


          var mx =
            dm(
              m - 1,
              gDe(a)
            );


          if (d > mx) {

            d = mx;
            $("inDia").value = mx;

          }


          if (d < 1) {

            d = 1;
            $("inDia").value = 1;

          }


          $("inDia").max = mx;


          var ms =
            msKK(
              a,
              m,
              d
            );


          $("salidaF").innerHTML =
            tG(ms) +
            "<small>" +
            sem(ms) +
            "</small>";

        }

      }


      /* ======================================================
         GIRAR CALENDARIO
         ====================================================== */

      function girar() {

        dir =
          dir === "g2k"
            ? "k2g"
            : "g2k";


        var g =
          dir === "g2k";


        $("entradaG").hidden = !g;
        $("entradaK").hidden = g;


        $("etIzq").textContent =
          g
            ? "Calendario de siempre"
            : "Calendario Charlie Kirk";


        $("etDer").textContent =
          g
            ? "Calendario Charlie Kirk"
            : "Calendario de siempre";


        traducirFecha();

      }


      /* ======================================================
         HOY
         ====================================================== */

      function ponHoy() {

        var h = hoyMs();
        var k = kkMs(h);
        var f = new Date(h);


        $("inGDia").value =
          f.getUTCDate();


        $("inGMes").value =
          f.getUTCMonth() + 1;


        $("inGAnio").value =
          f.getUTCFullYear();


        $("inDia").value =
          k.dia;


        $("inMes").value =
          k.mes;


        $("inAnio").value =
          Math.abs(k.anio);


        $("inEra").value =
          k.anio > 0
            ? "d"
            : "a";


        traducirFecha();

      }


      $("btnGirar")
        .addEventListener(
          "click",
          girar
        );


      $("btnHoy")
        .addEventListener(
          "click",
          ponHoy
        );


      [
        "inGDia",
        "inGMes",
        "inGAnio",
        "inDia",
        "inMes",
        "inAnio",
        "inEra"
      ].forEach(
        function (i) {

          $(i).addEventListener(
            "input",
            traducirFecha
          );

          $(i).addEventListener(
            "change",
            traducirFecha
          );

        }
      );

      /* ======================================================
         ALFABETO
         ====================================================== */

      var GLIFOS = {

        a:
          '<circle cx="30" cy="21" r="12"/>' +
          '<circle cx="30" cy="59" r="12"/>',

        b:
          '<path d="M30 12 L52 32 L52 66 L8 66 L8 32 Z"/>',

        c:
          '<path d="M8 66 L8 52 L26 52 L26 34 L44 34 L44 16 L54 16"/>',

        d:
          '<path d="M8 48 q11 -30 22 0 q11 30 22 0"/>',

        e:
          '<path d="M30 10 L30 70 M11 25 L49 55 M49 25 L11 55"/>',

        f:
          '<path d="M8 28 q11 -22 22 0 q11 22 22 0 M8 58 q11 -22 22 0 q11 22 22 0"/>',

        g:
          '<path d="M18 12 L42 26 L18 40 L42 54 L18 68"/>',

        h:
          '<path d="M8 18 L30 42 L52 18 M8 42 L30 66 L52 42"/>',

        i:
          '<circle cx="30" cy="17" r="9" fill="currentColor"/>' +
          '<circle cx="14" cy="58" r="9" fill="currentColor"/>' +
          '<circle cx="46" cy="58" r="9" fill="currentColor"/>',

        j:
          '<path d="M8 66 L8 22 L20 40 L30 18 L40 40 L52 22 L52 66"/>',

        k:
          '<path d="M12 66 L48 20 M26 16 L50 16 L50 40"/>',

        l:
          '<path d="M6 20 L18 20 L18 38 L34 38 L34 56 L54 56"/>',

        m:
          '<rect x="12" y="30" width="36" height="32"/>' +
          '<path d="M8 15 L52 15"/>',

        n:
          '<path d="M30 12 L50 52 L10 52 Z"/>' +
          '<path d="M8 66 L52 66"/>',

        "ñ":
          '<path d="M14 14 L14 66 M30 14 L30 66 M46 14 L46 66"/>',

        o:
          '<rect x="7" y="17" width="46" height="46"/>' +
          '<rect x="21" y="31" width="18" height="18"/>',

        p:
          '<path d="M30 16 a24 24 0 0 0 0 48 Z" fill="currentColor"/>' +
          '<path d="M30 12 L30 68"/>',

        q:
          '<path d="M10 62 a20 20 0 0 1 40 0 M20 62 a10 10 0 0 1 20 0"/>',

        r:
          '<rect x="9" y="19" width="42" height="42"/>' +
          '<path d="M30 19 L30 61"/>',

        s:
          '<path d="M12 40 L48 40"/>' +
          '<circle cx="12" cy="40" r="9" fill="currentColor"/>' +
          '<circle cx="48" cy="40" r="9" fill="currentColor"/>',

        t:
          '<path d="M14 14 a14 14 0 0 1 0 28 M46 38 a14 14 0 0 1 0 28"/>',

        u:
          '<circle cx="30" cy="22" r="12"/>' +
          '<circle cx="18" cy="46" r="12"/>' +
          '<circle cx="42" cy="46" r="12"/>',

        v:
          '<path d="M6 14 L30 40 L6 66 Z" fill="currentColor"/>' +
          '<path d="M32 14 L56 40 L32 66 Z" fill="currentColor"/>',

        w:
          '<path d="M30 10 L48 40 L30 56 L12 40 Z"/>' +
          '<path d="M30 56 L30 70"/>',

        x:
          '<path d="M14 56 a12 12 0 0 1 0 -24 a16 16 0 0 1 32 0 a12 12 0 0 1 0 24 Z"/>',

        y:
          '<path d="M22 10 q28 12 0 24 q-28 12 0 24 q28 12 0 24"/>',

        z:
          '<path d="M10 30 L34 6 M10 52 L44 18 M20 64 L50 34 M40 68 L54 54"/>'

      };


      var ORDEN =
        "abcdefghijklmnñopqrstuvwxyz"
          .split("");


      function svg(ch) {

        var c =
          GLIFOS[ch];


        if (!c) {
          return null;
        }


        return (
          '<svg ' +
          'viewBox="0 0 60 80" ' +
          'fill="none" ' +
          'stroke="currentColor" ' +
          'stroke-width="7" ' +
          'stroke-linecap="round" ' +
          'stroke-linejoin="round" ' +
          'aria-hidden="true">' +
          c +
          "</svg>"
        );

      }


      /* ======================================================
         NORMALIZAR TEXTO
         ====================================================== */

      function normaliza(t) {

        return t
          .toLowerCase()
          .replace(
            /[áàäâ]/g,
            "a"
          )
          .replace(
            /[éèëê]/g,
            "e"
          )
          .replace(
            /[íìïî]/g,
            "i"
          )
          .replace(
            /[óòöô]/g,
            "o"
          )
          .replace(
            /[úùüû]/g,
            "u"
          );

      }


      /* ======================================================
         PINTAR GLIFOS
         ====================================================== */

      function pintarGlifos() {

        var h = "";


        ORDEN.forEach(
          function (l) {

            h +=
              '<button type="button" class="gl" data-l="' +
              l +
              '">' +
              svg(l) +
              "<b>" +
              l +
              "</b>" +
              "</button>";

          }
        );


        $("glifos").innerHTML = h;

      }


      /* ======================================================
         TRADUCTOR DE TEXTO
         ====================================================== */

      var dirT = "es2k";
      var buffer = "";


      var TOPE = 220;


      /* ======================================================
         EL TOPE SE MIDE, NO SE ADIVINA

         Cuánto cabe depende del tamaño de la ventana: en una
         pantalla grande entran unos 200 caracteres y en una
         pequeña bastantes menos. Se calcula a partir del hueco
         real y se vuelve a calcular al redimensionar.
         ====================================================== */

      function calcularTope() {

        var caja =
          dirT === "es2k"
            ? $("lienzo")
            : $("lienzoK");


        if (!caja || !caja.clientHeight) {
          return;
        }


        var fs =
          parseFloat(
            getComputedStyle(caja).fontSize
          ) || 17;


        var lineas =
          Math.max(
            1,
            Math.floor(caja.clientHeight / (fs * 1.85))
          );


        var porLinea =
          Math.max(
            4,
            Math.floor(caja.clientWidth / 18)
          );


        /* suelo de 80: por debajo el traductor no serviría de
           nada. Si en esa pantalla no cabe, el propio lienzo
           se desplaza por dentro y la rejilla no se mueve. */
        TOPE =
          Math.max(
            80,
            Math.floor(lineas * porLinea * 0.92)
          );


        $("inTexto").maxLength = TOPE;


        if ($("inTexto").value.length > TOPE) {

          $("inTexto").value =
            $("inTexto").value.slice(0, TOPE);

        }


        if (buffer.length > TOPE) {

          buffer = buffer.slice(0, TOPE);

        }


        pintarTexto();

      }


      var relojTope;

      window.addEventListener(
        "resize",
        function () {

          clearTimeout(relojTope);

          relojTope =
            setTimeout(calcularTope, 150);

        }
      );


      function actualizarContador(n) {

        var c = $("contador");

        if (!c) {
          return;
        }

        c.textContent = n + " / " + TOPE;

        c.className =
          n >= TOPE
            ? "contador contador--tope"
            : "contador";

      }


      function pintarTexto() {

        if (dirT === "es2k") {

          var t =
            normaliza(
              $("inTexto").value
            );


          actualizarContador($("inTexto").value.length);


          if (!t.trim()) {

            $("lienzo").className = "lienzo";

            $("lienzo").innerHTML =
              '<span class="vacio">' +
              "La traducción aparece aquí." +
              "</span>";

            return;

          }


          $("lienzo").className = "lienzo";


          var h = "";


          t
            .split(/(\\s+)/)
            .forEach(
              function (p) {

                /* los saltos de línea que escriba la persona
                   se respetan en la traducción */
                if (!p.trim()) {

                  if (p.indexOf("\\n") !== -1) {
                    h += "<br>";
                  }

                  return;

                }


                h +=
                  '<span class="pal">';


                p
                  .split("")
                  .forEach(
                    function (c) {

                      var s =
                        svg(c);


                      h += s
                        ? s
                        : '<span class="raw">' +
                          c
                            .replace(
                              /&/g,
                              "&amp;"
                            )
                            .replace(
                              /</g,
                              "&lt;"
                            ) +
                          "</span>";

                    }
                  );


                h +=
                  "</span>";

              }
            );


          $("lienzo").innerHTML = h;

        }

        else {

          $("salidaT").textContent =
            buffer || "—";


          var lk = $("lienzoK");

          actualizarContador(buffer.length);


          if (lk) {

            if (!buffer) {

              lk.className = "lienzoK";

              lk.innerHTML =
                '<span class="vacio">' +
                "Pulsa las letras de la tabla de abajo " +
                "y aparecerán aquí." +
                "</span>";

            }

            else {

              lk.className = "lienzoK";

              var hk = "";

              buffer
                .split(/(\\s+)/)
                .forEach(
                  function (p) {

                    if (!p.trim()) {

                      if (p.indexOf("\\n") !== -1) {
                        hk += "<br>";
                      }

                      return;

                    }


                    hk +=
                      '<span class="pal">';


                    p
                      .split("")
                      .forEach(
                        function (c) {

                          var s = svg(c);

                          hk += s
                            ? s
                            : '<span class="raw">' +
                              c
                                .replace(/&/g, "&amp;")
                                .replace(/</g, "&lt;") +
                              "</span>";

                        }
                      );


                    hk += "</span>";

                  }
                );


              lk.innerHTML = hk;

            }

          }

        }

      }


      /* ======================================================
         GIRAR TRADUCTOR DE TEXTO
         ====================================================== */

      function girarT() {

        dirT =
          dirT === "es2k"
            ? "k2es"
            : "es2k";


        var es =
          dirT === "es2k";


        $("inTexto").hidden =
          !es;


        $("tecladoCaja").hidden =
          es;


        $("lienzo").hidden =
          !es;


        $("salidaT").hidden =
          es;


        /* copiar sirve en los dos sentidos */
        $("btnCopiaT").hidden = false;


        $("etTxtIzq").textContent =
          es
            ? "Español"
            : "Alfabeto Charlie Kirk";


        $("etTxtDer").textContent =
          es
            ? "Alfabeto Charlie Kirk"
            : "Español";


        pintarTexto();

      }


      /* ======================================================
         TECLADO
         ====================================================== */

      /* ======================================================
         LA TABLA DEL ALFABETO ES EL TECLADO

         Antes había un teclado propio dentro del panel, pero
         solo cabían 7 de las 29 teclas y repetía la tabla de
         abajo. Ahora se pulsa directamente sobre la tabla,
         que se ve entera.
         ====================================================== */

      function escribirLetra(l) {

        if (dirT === "k2es") {

          if (buffer.length >= TOPE) {
            return;
          }

          buffer += l;

        }

        else {

          var caja = $("inTexto");

          caja.value += l;

        }


        pintarTexto();

      }


      $("glifos")
        .addEventListener(
          "click",
          function (e) {

            var b =
              e.target.closest(
                "button[data-l]"
              );


            if (!b) {
              return;
            }


            escribirLetra(b.dataset.l);

          }
        );


      $("btnEspacio")
        .addEventListener(
          "click",
          function () {

            if (buffer.length < TOPE) {
              buffer += " ";
            }

            pintarTexto();

          }
        );


      $("btnBorrar")
        .addEventListener(
          "click",
          function () {

            buffer = buffer.slice(0, -1);
            pintarTexto();

          }
        );


      $("inTexto")
        .addEventListener(
          "input",
          pintarTexto
        );


      $("btnGirarT")
        .addEventListener(
          "click",
          girarT
        );


      /* ======================================================
         COPIAR
         ====================================================== */

      function copiar(btn, texto) {

        var t =
          btn.textContent;


        var ok =
          function () {

            btn.textContent =
              "Copiado";


            setTimeout(
              function () {

                btn.textContent = t;

              },
              1500
            );

          };


        if (
          navigator.clipboard &&
          navigator.clipboard.writeText
        ) {

          navigator.clipboard
            .writeText(texto)
            .then(
              ok,
              function () {}
            );

        }

        else {

          var ta =
            document.createElement(
              "textarea"
            );


          ta.value = texto;


          document.body.appendChild(
            ta
          );


          ta.select();


          try {

            document.execCommand(
              "copy"
            );

            ok();

          }

          catch (err) {}


          document.body.removeChild(
            ta
          );

        }

      }


      $("btnCopiaF")
        .addEventListener(
          "click",
          function () {

            copiar(
              this,
              $("salidaF").textContent
            );

          }
        );


      $("btnCopiaT")
        .addEventListener(
          "click",
          function () {

            copiar(
              this,
              dirT === "es2k"
                ? normaliza($("inTexto").value)
                : buffer
            );

          }
        );


      /* ======================================================
         TEMA
         ====================================================== */

      $("btnTema")
        .addEventListener(
          "click",
          function () {

            var n =
              document.documentElement
                .getAttribute(
                  "data-tema"
                ) === "noche";


            document.documentElement
              .setAttribute(
                "data-tema",
                n
                  ? "papel"
                  : "noche"
              );


            this.textContent =
              n
                ? "Noche"
                : "Papel";

          }
        );

    /*======================================================
    ARRANQUE
    ====================================================== */


    pintarGlifos();
    pintarLeyendaMeses();
    ponHoy();
    calcularTope();

    var k = kkMs(hoyMs());

    $("pie").textContent =
    "Hoy · " +
    tK(k) +
    " · " +
    nAnio(k.anio);

    })();

  </script>

</body>
</html>

`;
