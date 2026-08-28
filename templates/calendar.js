export default function calendarioTemplate() {
    return `
<!DOCTYPE html>
<html lang="es" data-tema="papel">

<head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1">

    <title>Calendario · Kirkversario</title>

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

        body {
            margin: 0;
            background: var(--fondo);
            color: var(--texto);
            font-family: var(--cuerpo);
            font-size: 16px;
            line-height: 1.5;
            -webkit-font-smoothing: antialiased;
        }

        .env {
            max-width: 900px;
            margin: 0 auto;
            padding: 0 18px;
        }

        .top {
            display: flex;
            align-items: center;
            gap: 12px;
            padding: 16px 18px;
            max-width: 900px;
            margin: 0 auto;
            border-bottom: 2px solid var(--texto);
        }

        .top h1 {
            font-family: var(--display);
            font-weight: 800;
            font-size: 17px;
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

        h2 {
            font-family: var(--display);
            font-weight: 800;
            font-size: clamp(22px, 3.6vw, 30px);
            letter-spacing: -.03em;
            margin: 0 0 6px;
        }

        .sub {
            color: var(--tenue);
            margin: 0 0 22px;
            max-width: 60ch;
            font-size: 15px;
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

        select,
        input[type="number"] {
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

        /* CALENDARIO */

        .calMandos {
            display: grid;
            grid-template-columns: 1fr 120px auto;
            gap: 10px;
            align-items: end;
            margin: 0 0 18px;
        }

        .cal {
            border: 2px solid var(--texto);
            border-radius: 14px;
            overflow: hidden;
            background: var(--tarjeta);
        }

        .cal__top {
            display: flex;
            align-items: center;
            gap: 10px;
            padding: 14px 16px;
            border-bottom: 2px solid var(--texto);
            background: var(--amarillo);
            color: #191552;
        }

        .cal__mes {
            font-family: var(--display);
            font-weight: 800;
            font-size: clamp(20px, 3.4vw, 30px);
            letter-spacing: -.03em;
            margin: 0 auto 0 0;
            line-height: 1.05;
        }

        .cal__mes small {
            display: block;
            font-family: var(--mono);
            font-weight: 400;
            font-size: 11px;
            letter-spacing: .06em;
            text-transform: uppercase;
            opacity: .65;
            margin-top: 3px;
        }

        .cal__nav {
            background: transparent;
            border: 1.5px solid #191552;
            color: #191552;
            border-radius: 999px;
            width: 38px;
            height: 38px;
            font-size: 16px;
            cursor: pointer;
            line-height: 1;
            flex: 0 0 auto;
        }

        .cal__nav:hover {
            background: #191552;
            color: var(--amarillo);
        }

        .cal__hoy {
            background: #191552;
            border: 1.5px solid #191552;
            color: var(--amarillo);
            border-radius: 999px;
            height: 38px;
            padding: 0 16px;
            font-family: var(--mono);
            font-size: 11px;
            text-transform: uppercase;
            letter-spacing: .07em;
            cursor: pointer;
            flex: 0 0 auto;
        }

        .cal__hoy:hover {
            background: transparent;
            color: #191552;
        }

        .sem {
            display: grid;
            grid-template-columns: repeat(7, 1fr);
            border-bottom: 2px solid var(--texto);
        }

        .sem span {
            font-family: var(--mono);
            font-size: 10px;
            text-transform: uppercase;
            letter-spacing: .12em;
            color: var(--tenue);
            padding: 11px 10px;
        }

        .dias {
            display: grid;
            grid-template-columns: repeat(7, 1fr);
        }

        .dia {
            min-height: 96px;
            border-right: 1px solid var(--borde);
            border-bottom: 1px solid var(--borde);
            padding: 9px 10px;
            display: flex;
            flex-direction: column;
            gap: 3px;
        }

        .dia:nth-child(7n) {
            border-right: 0;
        }

        .dias .dia:nth-last-child(-n+7) {
            border-bottom: 0;
        }

        .dia b {
            font-family: var(--display);
            font-weight: 800;
            font-size: 21px;
            line-height: 1;
            letter-spacing: -.02em;
        }

        .dia small {
            font-family: var(--mono);
            font-size: 10.5px;
            color: var(--tenue);
            letter-spacing: .01em;
        }

        .dia__evento {
            margin-top: 5px;
            padding: 5px 6px;
            background: var(--rosa);
            color: #FBF7EC;
            border: 1px solid var(--texto);
            border-radius: 6px;
            font-family: var(--display);
            font-size: 11px;
            font-weight: 700;
            line-height: 1.15;
            overflow: hidden;
        }

        .dia--hoy .dia__evento {
            color: #FBF7EC;
        }

        @media (max-width: 720px) {
            .dia__evento {
                font-size: 9px;
                padding: 3px 4px;
            }
        }

        .dia--finde b {
            color: var(--rosa);
        }

        .dia--fuera {
            opacity: .3;
        }

        .dia--hoy {
            background: var(--amarillo);
        }

        .dia--hoy b,
        .dia--hoy small {
            color: #191552;
        }

        .dia__marca {
            margin-top: auto;
            font-family: var(--mono);
            font-size: 9px;
            text-transform: uppercase;
            letter-spacing: .1em;
            color: #191552;
        }

        .calPie {
            display: flex;
            flex-wrap: wrap;
            gap: 10px 22px;
            margin-top: 16px;
            font-family: var(--mono);
            font-size: 11.5px;
            color: var(--tenue);
            text-transform: uppercase;
            letter-spacing: .07em;
        }

        .calPie b {
            font-family: var(--display);
            font-size: 13px;
            letter-spacing: -.01em;
            text-transform: none;
            color: var(--texto);
        }

        .pie {
            border-top: 2px solid var(--texto);
            padding: 22px 0 36px;
            font-family: var(--mono);
            font-size: 11px;
            color: var(--tenue);
            text-transform: uppercase;
            letter-spacing: .07em;
        }

        @media (max-width: 720px) {
            .calMandos {
                grid-template-columns: 1fr;
            }

            .dia {
                min-height: 64px;
                padding: 6px 7px;
            }

            .dia b {
                font-size: 16px;
            }

            .dia small {
                font-size: 9px;
            }

            .sem span {
                padding: 8px 7px;
                font-size: 9px;
            }

            section {
                padding: 32px 0;
            }
        }

        @media (prefers-reduced-motion: reduce) {
            * {
                transition: none !important;
                animation: none !important;
            }
        }

        /* ---- PANTALLA COMPLETA ---- */
        body.pantalla { overflow: hidden; }
        body.pantalla .top,
        body.pantalla h2,
        body.pantalla .sub,
        body.pantalla .calMandos,
        body.pantalla .calPie,
        body.pantalla .pie { display: none; }
        body.pantalla main.env { max-width: none; padding: 0; }
        body.pantalla section { padding: 0; border-top: 0; }
        body.pantalla .cal {
            border: 0;
            border-radius: 0;
            height: 100vh;
            display: flex;
            flex-direction: column;
        }
        body.pantalla .cal { overflow: hidden; }
        body.pantalla .dias {
            flex: 1 1 auto;
            min-height: 0;
            grid-template-rows: repeat(6, minmax(0, 1fr));
        }
        body.pantalla .dia { min-height: 0; }
        body.pantalla .dia b { font-size: 26px; }

        /* ---- CELDA PULSABLE ---- */
        .dia { cursor: pointer; overflow: hidden; transition: background .18s ease; }
        .dia .dia__evento {
            flex: 0 0 auto;
            white-space: nowrap;
            overflow: hidden;
            text-overflow: ellipsis;
        }
        .dia:hover { background: rgba(255, 194, 51, .22); }
        .dia--abierta { visibility: hidden; }

        /* ---- FICHA DEL DIA ---- */
        .velo {
            position: fixed;
            inset: 0;
            background: rgba(9, 7, 40, .5);
            backdrop-filter: blur(3px);
            opacity: 0;
            transition: opacity .3s ease;
            z-index: 40;
        }
        .velo.on { opacity: 1; }

        .ficha {
            position: fixed;
            z-index: 50;
            background: var(--tarjeta);
            border: 2px solid var(--texto);
            border-radius: 14px;
            overflow: hidden;
            display: flex;
            flex-direction: column;
            transform-origin: top left;
            will-change: transform;
            box-shadow: 0 18px 50px rgba(9, 7, 40, .28);
        }
        .ficha__top {
            background: var(--amarillo);
            color: #191552;
            padding: 16px 18px;
            border-bottom: 2px solid var(--texto);
            display: flex;
            align-items: flex-start;
            gap: 12px;
            flex: 0 0 auto;
        }
        .ficha__dia {
            font-family: var(--display);
            font-weight: 800;
            font-size: 30px;
            line-height: 1;
            letter-spacing: -.03em;
            margin: 0 auto 0 0;
        }
        .ficha__dia small {
            display: block;
            font-family: var(--mono);
            font-weight: 400;
            font-size: 11px;
            text-transform: uppercase;
            letter-spacing: .07em;
            opacity: .72;
            margin-top: 7px;
        }
        .ficha__x {
            background: transparent;
            border: 1.5px solid #191552;
            color: #191552;
            border-radius: 999px;
            width: 34px;
            height: 34px;
            font-size: 17px;
            line-height: 1;
            cursor: pointer;
            flex: 0 0 auto;
        }
        .ficha__x:hover { background: #191552; color: var(--amarillo); }

        .ficha__cuerpo {
            padding: 16px 18px 20px;
            overflow-y: auto;
            display: grid;
            gap: 10px;
            align-content: start;
            flex: 1 1 auto;
        }
        .ficha__ev {
            border: 1.5px solid var(--borde);
            border-left: 4px solid var(--rosa);
            border-radius: 10px;
            padding: 13px 15px;
            background: var(--fondo);
        }
        .ficha__ev h4 {
            font-family: var(--display);
            font-weight: 800;
            font-size: 19px;
            letter-spacing: -.02em;
            margin: 0 0 5px;
        }
        .ficha__ev p { margin: 5px 0 0; font-size: 14.5px; color: var(--tenue); }
        .ficha__meta {
            font-family: var(--mono);
            font-size: 11px;
            text-transform: uppercase;
            letter-spacing: .08em;
            color: var(--tenue);
            display: flex;
            gap: 9px;
            flex-wrap: wrap;
            align-items: center;
        }
        .ficha__cat {
            border: 1px solid var(--borde);
            border-radius: 999px;
            padding: 4px 9px;
        }
        .ficha__vacio {
            color: var(--tenue);
            font-size: 15px;
            text-align: center;
            padding: 26px 0;
        }

        /* la ficha se desvanece por dentro para que el escalado no deforme */
        .ficha__top,
        .ficha__cuerpo { transition: opacity .22s ease; }
        .ficha--entrando .ficha__top,
        .ficha--entrando .ficha__cuerpo { opacity: 0; }


    </style>
</head>

<body>

<header class="top">

    <h1>
        Kirkversario
        <span>CALENDARIO</span>
    </h1>

    <a class="btn" href="/">
        Home
    </a>

    <button class="btn" id="btnTema" type="button">
        Noche
    </button>

</header>

<main class="env">

    <section>

        <h2>El calendario</h2>

        <p class="sub">
            Doce meses en rejilla. Cada casilla lleva el día del calendario
            Kirk arriba y su equivalente de siempre debajo.
            Los días en gris son del mes de al lado.
        </p>

        <div class="calMandos">

            <div>
                <span class="et">Mes</span>
                <select id="selMes"></select>
            </div>

            <div>
                <span class="et">AÑO</span>
                <input
                    type="number"
                    id="inAnio"
                    value="1"
                    step="1"
                >
            </div>

            <div>
                <button class="btn" id="btnIr" type="button">
                    Ir
                </button>
            </div>

        </div>

        <div class="cal">

            <div class="cal__top">

                <button
                    class="cal__nav"
                    id="navAnt"
                    type="button"
                    aria-label="Mes anterior"
                >
                    &lsaquo;
                </button>

                <button
                    class="cal__nav"
                    id="btnPantalla"
                    type="button"
                    aria-label="Pantalla completa"
                    title="Pantalla completa"
                >
                    &#x26F6;
                </button>

                <h3 class="cal__mes" id="calTitulo">
                    â€”
                    <small id="calSub">â€”</small>
                </h3>

                <button
                    class="cal__hoy"
                    id="calHoy"
                    type="button"
                    hidden
                >
                    Volver a hoy
                </button>

                <button
                    class="cal__nav"
                    id="navSig"
                    type="button"
                    aria-label="Mes siguiente"
                >
                    &rsaquo;
                </button>

            </div>

            <div class="sem" id="calSem"></div>

            <div class="dias" id="calDias"></div>

        </div>

        <div class="calPie">

            <div>
                <span class="et">Hoy</span>
                <b id="pieHoy">â€”</b>
            </div>

            <div>
                <span class="et">Equivale a</span>
                <b id="pieGreg">â€”</b>
            </div>

            <div>
                <span class="et">día del AÑO</span>
                <b id="pieDia">â€”</b>
            </div>

        </div>

    </section>

</main>

<footer class="pie env">
    Calendario Kirk Â· rejilla mensual
</footer>

<script>
(function () {

    "use strict";

    /*
     * CONFIGURACIÃ“N
     *
     * Define dÃ³nde cae el día 1 del mes 1
     * del AÑO 1 del calendario Kirk.
     */
    var EPOCA_ANIO = 2025;
    var EPOCA_MES = 9;
    var EPOCA_DIA = 10;

    var MESES = [
        { n: "Kirktrump", d: 31 },
        { n: "Kirkgilipollas", d: 28 },
        { n: "Kirkbaiden", d: 31 },
        { n: "Kirkennedy", d: 30 },
        { n: "Kirknetanyahu", d: 31 },
        { n: "Kirkfranco", d: 30 },
        { n: "Kirkgandhi", d: 31 },
        { n: "Kirkwashington", d: 31 },
        { n: "Kirkmessi", d: 30 },
        { n: "Kirkronaldo", d: 31 },
        { n: "KirkcabrÃ³n", d: 30 },
        { n: "Kirkeroro", d: 31 }
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

    var SEM = [
        "lunes",
        "martes",
        "miÃ©rcoles",
        "jueves",
        "viernes",
        "sÃ¡bado",
        "domingo"
    ];

    var MS = 86400000;

    function $(id) {
        return document.getElementById(id);
    }

    function utc(y, m, d) {
        var fecha = new Date(
            Date.UTC(2000, 0, 1)
        );

        fecha.setUTCFullYear(y, m - 1, d);
        fecha.setUTCHours(0, 0, 0, 0);

        return fecha.getTime();
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
                ? 29
                : MESES[i].d
        );
    }

    function largo(g) {
        return bis(g + 1) ? 366 : 365;
    }

    function gDe(a) {
        return a > 0
            ? EPOCA_ANIO + a - 1
            : EPOCA_ANIO + a;
    }

    function sem(ms) {
        return SEM[(new Date(ms).getUTCDay() + 6) % 7];
    }

    function nAnio(a) {
        return a > 0
            ? "AÑO " + a + " d.K."
            : "AÑO " + Math.abs(a) + " a.K.";
    }

    function inicioG(g) {
        return utc(
            g,
            EPOCA_MES,
            EPOCA_DIA
        );
    }

    function aKK(y, m, d) {

        var g =
            m > EPOCA_MES ||
            (m === EPOCA_MES && d >= EPOCA_DIA)
                ? y
                : y - 1;

        var dia =
            Math.round(
                (utc(y, m, d) - inicioG(g)) / MS
            ) + 1;

        var n = g - EPOCA_ANIO;

        var anio =
            n >= 0
                ? n + 1
                : n;

        var r = dia;
        var me = 0;

        while (r > dm(me, g)) {
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
        var acumulado = 0;

        for (var i = 0; i < m - 1; i++) {
            acumulado += dm(i, g);
        }

        return (
            inicioG(g) +
            (acumulado + d - 1) * MS
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

    function tK(k) {
        return (
            k.dia +
            " de " +
            MESES[k.mes - 1].n
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

    function lun(ms) {
        return (
            new Date(ms).getUTCDay() + 6
        ) % 7;
    }

    var vistaAnio;
    var vistaMes;
    var eventos = [];

    async function cargarEventos() {
        try {
            var response = await fetch("/api/events");

            if (!response.ok) {
                throw new Error("No se pudieron cargar los eventos");
            }

            eventos = await response.json();

            pintar();

        } catch (error) {
            console.error("Error al cargar eventos:", error);
            eventos = [];
            pintar();
        }
    }

    function escapeHtml(text) {

        return String(text ?? "")
            .replace(/&/g, "&amp;")
            .replace(/</g, "&lt;")
            .replace(/>/g, "&gt;")
            .replace(/"/g, "&quot;")
            .replace(/'/g, "&#039;");
    }

    function eventosDelDia(ms) {
        var fecha = new Date(ms);

        var fechaString =
            fecha.getUTCFullYear() +
            "-" +
            String(fecha.getUTCMonth() + 1).padStart(2, "0") +
            "-" +
            String(fecha.getUTCDate()).padStart(2, "0");

        return eventos.filter(function(evento) {
            return evento.date === fechaString;
        });
    }


    /*
     * días de la semana
     */
    $("calSem").innerHTML = SEM
        .map(function (s) {
            return "<span>" +
                s.slice(0, 3) +
                "</span>";
        })
        .join("");

    /*
     * Selector de meses
     */
    $("selMes").innerHTML = MESES
        .map(function (m, i) {
            return (
                '<option value="' +
                (i + 1) +
                '">' +
                (i + 1) +
                ". " +
                m.n +
                "</option>"
            );
        })
        .join("");

    /*
     * Pintar calendario
     */
    function pintar() {

        var g = gDe(vistaAnio);

        var total = dm(
            vistaMes - 1,
            g
        );

        var primero = msKK(
            vistaAnio,
            vistaMes,
            1
        );

        var ultimo = msKK(
            vistaAnio,
            vistaMes,
            total
        );

        var hoy = hoyMs();

        $("calTitulo")
            .childNodes[0]
            .nodeValue =
            MESES[vistaMes - 1].n;

        $("calSub").textContent =
            nAnio(vistaAnio) +
            " · " +
            total +
            " días · " +
            tGc(primero) +
            " --> " +
            tGc(ultimo);

        var arranque =
            primero -
            lun(primero) * MS;

        var celdas = "";

        for (var i = 0; i < 42; i++) {

            var ms =
                arranque +
                i * MS;

            var k = kkMs(ms);

            var cls = "dia";

            if (
                k.mes !== vistaMes ||
                k.anio !== vistaAnio
            ) {
                cls += " dia--fuera";
            }

            if (i % 7 >= 5) {
                cls += " dia--finde";
            }

            var esHoy =
                ms === hoy;

            if (esHoy) {
                cls += " dia--hoy";
            }

            var eventosDia = eventosDelDia(ms);

            var eventosHtml = eventosDia.map(function(evento) {

                var hora = evento.time
                    ? " Â· " + evento.time
                    : "";

                return (
                    '<div class="dia__evento" title="' +
                    escapeHtml(evento.title) +
                    '">' +
                    escapeHtml(evento.title) +
                    hora +
                    "</div>"
                );

            }).join("");

            celdas +=
                '<div class="' +
                cls +
                '" data-ms="' +
                ms +
                '" tabindex="0" role="button">' +

                "<b>" +
                k.dia +
                "</b>" +

                "<small>" +
                tGc(ms) +
                "</small>" +

                eventosHtml +

                (
                    esHoy
                        ? '<span class="dia__marca">hoy</span>'
                        : ""
                ) +

                "</div>";
        }

        $("calDias").innerHTML =
            celdas;

        $("selMes").value =
            vistaMes;

        $("inAnio").value =
            vistaAnio;

        var kh = kkMs(hoy);

        $("calHoy").hidden =
            kh.mes === vistaMes &&
            kh.anio === vistaAnio;

        $("pieHoy").textContent =
            tK(kh) +
            ", " +
            nAnio(kh.anio);

        $("pieGreg").textContent =
            tG(hoy);

        $("pieDia").textContent =
            kh.diaAnio +
            " de " +
            kh.largo;
    }

    /*
     * Cambiar mes
     */
    function mover(n) {

        var m = vistaMes + n;
        var a = vistaAnio;

        if (m > 12) {
            m = 1;
            a = a === -1 ? 1 : a + 1;
        }

        if (m < 1) {
            m = 12;
            a = a === 1 ? -1 : a - 1;
        }

        vistaMes = m;
        vistaAnio = a;

        pintar();
    }

    /*
     * Volver a hoy
     */
    function irHoy() {

        var k = kkMs(hoyMs());

        vistaAnio = k.anio;
        vistaMes = k.mes;

        pintar();
    }

    $("navAnt").onclick = function () {
        mover(-1);
    };

    $("navSig").onclick = function () {
        mover(1);
    };

    $("calHoy").onclick = irHoy;

    $("btnIr").onclick = function () {

        var a = parseInt(
            $("inAnio").value,
            10
        );

        if (!a || a === 0) {
            a = 1;
        }

        vistaAnio = a;
        vistaMes = parseInt(
            $("selMes").value,
            10
        );

        pintar();
    };

    $("selMes").onchange = function () {

        vistaMes =
            parseInt(this.value, 10);

        pintar();
    };

    /*
     * Teclado
     */
    document.addEventListener(
        "keydown",
        function (e) {

            if (ficha) {
                return;
            }

            if (e.key === "ArrowLeft") {
                mover(-1);
            }

            if (e.key === "ArrowRight") {
                mover(1);
            }
        }
    );

    /*
     * PANTALLA COMPLETA
     */
    function enPantalla() {
        return !!(
            document.fullscreenElement ||
            document.webkitFullscreenElement
        );
    }

    function pintarBotonPantalla() {

        var on = enPantalla();

        document.body.classList.toggle("pantalla", on);

        var b = $("btnPantalla");

        b.textContent = on ? "X" : "[ ]";

        b.title = on
            ? "Salir de pantalla completa"
            : "Pantalla completa";
    }

    $("btnPantalla").onclick = function () {

        if (enPantalla()) {

            if (document.exitFullscreen) {
                document.exitFullscreen();
            } else if (document.webkitExitFullscreen) {
                document.webkitExitFullscreen();
            }

            return;
        }

        var e = document.documentElement;

        if (e.requestFullscreen) {
            e.requestFullscreen();
        } else if (e.webkitRequestFullscreen) {
            e.webkitRequestFullscreen();
        } else {
            /* sin API: al menos expandimos el layout */
            document.body.classList.toggle("pantalla");
        }
    };

    document.addEventListener("fullscreenchange", pintarBotonPantalla);
    document.addEventListener("webkitfullscreenchange", pintarBotonPantalla);

    /*
     * FICHA DEL DIA
     */
    var velo = null;
    var ficha = null;
    var celdaAbierta = null;

    var CURVA = "cubic-bezier(.22,1,.36,1)";

    function fichaHtml(ms) {

        var k = kkMs(ms);
        var evs = eventosDelDia(ms);

        var cuerpo;

        if (!evs.length) {

            cuerpo =
                '<p class="ficha__vacio">' +
                "No hay eventos este d\u00eda." +
                "</p>";

        } else {

            cuerpo = evs.map(function (ev) {

                var meta = "";

                if (ev.time) {
                    meta += "<span>" + escapeHtml(ev.time) + "</span>";
                }

                if (ev.category) {
                    meta +=
                        '<span class="ficha__cat">' +
                        escapeHtml(ev.category) +
                        "</span>";
                }

                return (
                    '<article class="ficha__ev">' +
                    "<h4>" + escapeHtml(ev.title) + "</h4>" +
                    (
                        meta
                            ? '<div class="ficha__meta">' + meta + "</div>"
                            : ""
                    ) +
                    (
                        ev.description
                            ? "<p>" + escapeHtml(ev.description) + "</p>"
                            : ""
                    ) +
                    "</article>"
                );

            }).join("");
        }

        return (
            '<div class="ficha__top">' +
            '<h3 class="ficha__dia">' +
            tK(k) +
            "<small>" +
            sem(ms) + " \u00b7 " + tG(ms) + " \u00b7 " +
            nAnio(k.anio) +
            "</small>" +
            "</h3>" +
            '<button class="ficha__x" type="button" aria-label="Cerrar">' +
            "\u2715" +
            "</button>" +
            "</div>" +
            '<div class="ficha__cuerpo">' + cuerpo + "</div>"
        );
    }

    function abrirDia(celda) {

        if (ficha) {
            return;
        }

        var ms = parseInt(celda.dataset.ms, 10);
        var origen = celda.getBoundingClientRect();

        velo = document.createElement("div");
        velo.className = "velo";
        velo.onclick = cerrarDia;
        document.body.appendChild(velo);

        ficha = document.createElement("div");
        ficha.className = "ficha";
        ficha.setAttribute("role", "dialog");
        ficha.setAttribute("aria-modal", "true");
        ficha.innerHTML = fichaHtml(ms);

        var vw = window.innerWidth;
        var vh = window.innerHeight;
        var an = Math.min(520, vw - 32);

        ficha.style.width = an + "px";
        ficha.style.left = "0px";
        ficha.style.top = "0px";
        ficha.style.visibility = "hidden";

        document.body.appendChild(ficha);

        /* medimos con altura libre y luego la fijamos para poder escalar */
        var al = Math.min(ficha.offsetHeight, Math.round(vh * 0.8));

        var iz = Math.round((vw - an) / 2);
        var ar = Math.round((vh - al) / 2);

        ficha.style.height = al + "px";
        ficha.style.left = iz + "px";
        ficha.style.top = ar + "px";
        ficha.style.visibility = "";

        /* FLIP con Web Animations: de la celda a la ficha */
        var ex = origen.width / an;
        var ey = origen.height / al;

        celda.classList.add("dia--abierta");
        celdaAbierta = celda;

        velo.animate(
            [{ opacity: 0 }, { opacity: 1 }],
            { duration: 300, easing: "ease", fill: "forwards" }
        );

        ficha.animate(
            [
                {
                    transform:
                        "translate(" + (origen.left - iz) + "px," +
                        (origen.top - ar) + "px) scale(" + ex + "," + ey + ")"
                },
                { transform: "translate(0,0) scale(1,1)" }
            ],
            { duration: 420, easing: CURVA, fill: "backwards" }
        );

        /* el contenido entra por opacidad para que el escalado no lo deforme */
        [".ficha__top", ".ficha__cuerpo"].forEach(function (sel) {
            ficha.querySelector(sel).animate(
                [
                    { opacity: 0, offset: 0 },
                    { opacity: 0, offset: .35 },
                    { opacity: 1, offset: 1 }
                ],
                { duration: 420, easing: "ease-out", fill: "backwards" }
            );
        });

        ficha.querySelector(".ficha__x").onclick = cerrarDia;
        ficha.querySelector(".ficha__x").focus();
    }

    function cerrarDia() {

        if (!ficha) {
            return;
        }

        var f = ficha;
        var v = velo;
        var celda = celdaAbierta;

        ficha = null;
        velo = null;
        celdaAbierta = null;

        var origen = celda.getBoundingClientRect();

        var iz = parseFloat(f.style.left);
        var ar = parseFloat(f.style.top);
        var an = parseFloat(f.style.width);
        var al = parseFloat(f.style.height);

        velo_fuera(v);

        [".ficha__top", ".ficha__cuerpo"].forEach(function (sel) {
            f.querySelector(sel).animate(
                [{ opacity: 1 }, { opacity: 0 }],
                { duration: 180, easing: "ease-in", fill: "forwards" }
            );
        });

        var salida = f.animate(
            [
                { transform: "translate(0,0) scale(1,1)" },
                {
                    transform:
                        "translate(" + (origen.left - iz) + "px," +
                        (origen.top - ar) + "px) scale(" +
                        (origen.width / an) + "," + (origen.height / al) + ")"
                }
            ],
            { duration: 340, easing: CURVA, fill: "forwards" }
        );

        salida.finished.then(function () {

            f.remove();
            v.remove();

            celda.classList.remove("dia--abierta");
            celda.focus();
        });
    }

    function velo_fuera(v) {
        v.animate(
            [{ opacity: 1 }, { opacity: 0 }],
            { duration: 300, easing: "ease", fill: "forwards" }
        );
    }

    /* delegacion: las celdas se repintan en cada mes */
    $("calDias").addEventListener("click", function (e) {

        var celda = e.target.closest(".dia");

        if (celda) {
            abrirDia(celda);
        }
    });

    $("calDias").addEventListener("keydown", function (e) {

        if (e.key !== "Enter" && e.key !== " ") {
            return;
        }

        var celda = e.target.closest(".dia");

        if (celda) {
            e.preventDefault();
            abrirDia(celda);
        }
    });

    document.addEventListener("keydown", function (e) {

        if (e.key === "Escape" && ficha) {
            e.preventDefault();
            cerrarDia();
        }
    });

    /*
     * Tema noche/papel
     */
    $("btnTema").onclick = function () {

        var n =
            document.documentElement.dataset.tema ===
            "noche"
                ? "papel"
                : "noche";

        document.documentElement.dataset.tema =
            n;

        this.textContent =
            n === "noche"
                ? "Papel"
                : "Noche";
    };

    /*
     * ARRANQUE
     */
    irHoy();
    cargarEventos();

})();
</script>

</body>
</html>
    `;
}