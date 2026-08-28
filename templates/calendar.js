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
    </style>
</head>

<body>

<header class="top">

    <h1>
        Kirkversario
        <span>CALENDARIO</span>
    </h1>

    <button class="btn" id="btnHoy" type="button">
        Hoy
    </button>

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
                <span class="et">Año</span>
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
                    ‹
                </button>

                <h3 class="cal__mes" id="calTitulo">
                    —
                    <small id="calSub">—</small>
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
                    ›
                </button>

            </div>

            <div class="sem" id="calSem"></div>

            <div class="dias" id="calDias"></div>

        </div>

        <div class="calPie">

            <div>
                <span class="et">Hoy</span>
                <b id="pieHoy">—</b>
            </div>

            <div>
                <span class="et">Equivale a</span>
                <b id="pieGreg">—</b>
            </div>

            <div>
                <span class="et">Día del año</span>
                <b id="pieDia">—</b>
            </div>

        </div>

    </section>

</main>

<footer class="pie env">
    Calendario Kirk · rejilla mensual
</footer>

<script>
(function () {

    "use strict";

    /*
     * CONFIGURACIÓN
     *
     * Define dónde cae el día 1 del mes 1
     * del Año 1 del calendario Kirk.
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
        { n: "Kirkcabrón", d: 30 },
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
        "miércoles",
        "jueves",
        "viernes",
        "sábado",
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

    function nAnio(a) {
        return a > 0
            ? "Año " + a + " d.K."
            : "Año " + Math.abs(a) + " a.K.";
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
     * Días de la semana
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
            " – " +
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
                    ? " · " + evento.time
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
                '">' +

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

    $("btnHoy").onclick = irHoy;

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

            if (e.key === "ArrowLeft") {
                mover(-1);
            }

            if (e.key === "ArrowRight") {
                mover(1);
            }
        }
    );

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