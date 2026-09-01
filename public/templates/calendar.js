import BANNER from "../components/banner.js";
export default function calendarioTemplate() {
    return `

<!DOCTYPE html>
<html lang="es" data-tema="papel">

<head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1">

    <title>Calendar · Kirkversario</title>

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
            font-size: 17px;
            line-height: 1.5;
            -webkit-font-smoothing: antialiased;
        }

        html { height: 100%; }

        .env {
            max-width: none;
            margin: 0;
            padding: 0 32px;
        }

        .top {
            display: flex;
            align-items: center;
            flex-wrap: wrap;
            gap: 12px;
            padding: 16px 32px;
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

        h2 {
            font-family: var(--display);
            font-weight: 800;
            font-size: clamp(24px, 2.4vw, 36px);
            letter-spacing: -.03em;
            margin: 0 0 6px;
        }

        .sub {
            color: var(--tenue);
            margin: 0 0 22px;
            max-width: 70ch;
            font-size: 16px;
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

        /* el calendario es el centro de la página: contenedor
           propio, ancho generoso, siempre centrado */
        /* =========================================================
           DOS COLUMNAS: AÑO  |  MES
           ========================================================= */

        .duo {
            display: grid;
            grid-template-columns: 1fr 1px 1.15fr;
            column-gap: 40px;
            align-items: stretch;
        }

        .duo__lado {
            min-width: 0;
            min-height: 0;
            display: flex;
            flex-direction: column;
        }

        .duo__lado > section {
            display: flex;
            flex-direction: column;
            padding: 34px 0 40px;
        }

        .duo__lado > section > .anioEnv,
        .duo__lado > section > .calEnv {
            flex: 1;
            display: flex;
            flex-direction: column;
            min-height: 0;
        }

        .duo__medio {
            position: relative;
        }

        .duo__medio::before {
            content: "";
            position: absolute;
            top: 40px;
            bottom: 40px;
            left: 0;
            width: 1px;
            background: var(--borde);
        }

        @media (max-width: 1080px) {

            .duo {
                display: flex;
                flex-direction: column;
            }

            .duo__medio {
                display: none;
            }
        }

        /* =========================================================
           CALENDARIO ANUAL (columna izquierda)
           ========================================================= */

        .anioEnv {
            max-width: 820px;
        }

        .anio {
            border: 2px solid var(--texto);
            border-radius: 16px;
            overflow: hidden;
            background: var(--tarjeta);
            display: flex;
            flex-direction: column;
            flex: 1;
        }

        .anio__top {
            display: flex;
            align-items: center;
            gap: 12px;
            padding: 16px 20px;
            border-bottom: 2px solid var(--texto);
            background: var(--amarillo);
            color: #191552;
            flex: 0 0 auto;
        }

        .anio__titulo {
            font-family: var(--display);
            font-weight: 800;
            font-size: clamp(20px, 1.8vw, 26px);
            letter-spacing: -.02em;
            margin: 0 auto 0 0;
        }

        .anioGrid {
            flex: 1;
            min-height: 0;
            display: grid;
            grid-template-columns: repeat(3, 1fr);
            grid-template-rows: repeat(4, minmax(0, 1fr));
            gap: 10px;
            padding: 12px;
        }

        /* cada mini-mes es el calendario de la derecha en pequeño:
           misma tarjeta, misma cabecera amarilla, misma fila de
           días de la semana y la misma rejilla con bordes */
        .mesMini {
            border: 1.5px solid var(--texto);
            border-radius: 9px;
            overflow: hidden;
            background: var(--tarjeta);
            display: flex;
            flex-direction: column;
            min-height: 0;
            transition: box-shadow .15s ease, transform .15s ease;
        }

        .mesMini:hover {
            transform: translateY(-1px);
            box-shadow: 0 4px 14px rgba(9, 7, 40, .14);
        }

        .mesMini--actual {
            box-shadow: 0 0 0 2.5px var(--rosa);
        }

        .mesMini--actual:hover {
            box-shadow: 0 0 0 2.5px var(--rosa),
                        0 4px 14px rgba(9, 7, 40, .14);
        }

        .mesMini__top {
            flex: 0 0 auto;
            display: block;
            width: 100%;
            text-align: left;
            background: var(--amarillo);
            color: #191552;
            border: 0;
            border-bottom: 1.5px solid var(--texto);
            padding: 5px 8px;
            font-family: var(--display);
            font-weight: 800;
            font-size: 11.5px;
            letter-spacing: -.01em;
            line-height: 1.15;
            cursor: pointer;
        }

        .mesMini__top:hover {
            background: var(--rosa);
            color: #FBF7EC;
        }

        .mesMini__top span {
            opacity: .55;
            font-family: var(--mono);
            font-weight: 400;
            font-size: 9px;
            margin-right: 4px;
        }

        .mesMini__sem {
            flex: 0 0 auto;
            display: grid;
            grid-template-columns: repeat(7, 1fr);
            border-bottom: 1.5px solid var(--texto);
        }

        .mesMini__sem span {
            font-family: var(--mono);
            font-size: 7.5px;
            text-transform: uppercase;
            letter-spacing: .04em;
            color: var(--tenue);
            text-align: center;
            padding: 3px 0;
        }

        .mesMini__dias {
            flex: 1;
            min-height: 0;
            display: grid;
            grid-template-columns: repeat(7, 1fr);
            grid-template-rows: repeat(6, minmax(0, 1fr));
        }

        .mesMini__dia {
            background: transparent;
            border: 0;
            border-right: 1px solid var(--borde);
            border-bottom: 1px solid var(--borde);
            padding: 0;
            font-family: var(--mono);
            font-size: 8.5px;
            color: var(--texto);
            cursor: pointer;
            display: flex;
            align-items: center;
            justify-content: center;
            min-width: 0;
            transition: background .12s ease;
        }

        .mesMini__dia:nth-child(7n) {
            border-right: 0;
        }

        .mesMini__dias .mesMini__dia:nth-last-child(-n+7) {
            border-bottom: 0;
        }

        .mesMini__dia:hover {
            background: rgba(255, 194, 51, .35);
        }

        .mesMini__dia--finde {
            color: var(--rosa);
        }

        .mesMini__dia--fuera {
            opacity: .3;
        }

        .mesMini__dia--hoy {
            background: var(--amarillo);
            color: #191552;
            font-weight: 500;
        }

        .mesMini__dia--hoy:hover {
            background: var(--amarillo);
        }

        @media (max-width: 1080px) {

            .anioGrid {
                grid-template-columns: repeat(3, 1fr);
                grid-template-rows: repeat(4, minmax(130px, auto));
            }
        }

        @media (max-width: 720px) {

            .anioGrid {
                grid-template-columns: repeat(2, 1fr);
                grid-template-rows: repeat(6, minmax(120px, auto));
            }
        }

        .calEnv {
            max-width: 1400px;
            margin: 0 auto;
        }

        .calMandos {
            display: grid;
            grid-template-columns: 1fr 140px auto;
            gap: 12px;
            align-items: end;
            margin: 0 0 20px;
        }

        .cal {
            border: 2px solid var(--texto);
            border-radius: 16px;
            overflow: hidden;
            background: var(--tarjeta);
        }

        .cal__top {
            display: flex;
            align-items: center;
            gap: 12px;
            padding: 18px 22px;
            border-bottom: 2px solid var(--texto);
            background: var(--amarillo);
            color: #191552;
        }

        .cal__mes {
            font-family: var(--display);
            font-weight: 800;
            font-size: clamp(24px, 2.4vw, 38px);
            letter-spacing: -.03em;
            margin: 0 auto 0 0;
            line-height: 1.05;
        }

        .cal__mes small {
            display: block;
            font-family: var(--mono);
            font-weight: 400;
            font-size: 12.5px;
            letter-spacing: .06em;
            text-transform: uppercase;
            opacity: .65;
            margin-top: 4px;
        }

        .cal__nav {
            background: transparent;
            border: 1.5px solid #191552;
            color: #191552;
            border-radius: 999px;
            width: 44px;
            height: 44px;
            font-size: 18px;
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
            height: 44px;
            padding: 0 18px;
            font-family: var(--mono);
            font-size: 12px;
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
            font-size: 11.5px;
            text-transform: uppercase;
            letter-spacing: .12em;
            color: var(--tenue);
            padding: 14px 10px;
        }

        .dias {
            display: grid;
            grid-template-columns: repeat(7, 1fr);
        }

        .dia {
            height: 130px;
            border-right: 1px solid var(--borde);
            border-bottom: 1px solid var(--borde);
            padding: 11px 13px;
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
            font-size: 25px;
            line-height: 1;
            letter-spacing: -.02em;
        }

        .dia small {
            font-family: var(--mono);
            font-size: 12px;
            color: var(--tenue);
            letter-spacing: .01em;
            white-space: nowrap;
        }

        .dia__eventos {
            display: flex;
            flex: 1 1 0;
            min-height: 0;
            max-height: 36px;
            flex-wrap: nowrap;
            align-items: flex-end;
            gap: 2px;
            overflow: hidden;
            transition: gap .2s cubic-bezier(.4, 0, .2, 1);
        }

        .dia__evento {
            position: relative;
            flex: 0 1 10px;
            min-width: 0;
            height: 100%;
            border-radius: 4px;
            background: var(--rosa);
            box-shadow: inset 0 0 0 1px var(--texto);
            overflow: hidden;
            transition:
                flex-basis .2s cubic-bezier(.4, 0, .2, 1),
                opacity .2s cubic-bezier(.4, 0, .2, 1);
        }

        /* ancho fijo: así el texto no se re-maqueta en cada
           fotograma mientras la barra se abre */
        .dia__ev-txt {
            position: absolute;
            left: 0;
            top: 0;
            bottom: 0;
            width: 220px;
            display: flex;
            align-items: center;
            padding: 0 13px;
            font-family: var(--display);
            font-weight: 700;
            font-size: 11.5px;
            line-height: 1;
            white-space: nowrap;
        }

        /* solo cuando el ratón está encima de una marca de verdad:
           esa se abre a los dos lados y las demás se van por los costados */
        .dia__eventos:has(.dia__evento:hover) {
            gap: 0;
        }

        .dia__eventos:has(.dia__evento:hover) .dia__evento {
            flex-basis: 0;
            opacity: 0;
        }

        .dia__eventos:has(.dia__evento:hover) .dia__evento:hover {
            flex-basis: 100%;
            opacity: 1;
        }

        @media (max-width: 720px) {
            .dia__eventos {
                gap: 1px;
            }

            .dia__evento {
                flex-basis: 5px;
                height: 18px;
                border-radius: 2px;
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

        /* posición absoluta: así "HOY" no le quita alto al resto
           de la celda, que es lo que la desbordaba cuando el día
           de hoy tenía muchos eventos */
        .dia--hoy {
            position: relative;
        }

        .dia__marca {
            position: absolute;
            right: 10px;
            top: 10px;
            font-family: var(--mono);
            font-size: 9px;
            text-transform: uppercase;
            letter-spacing: .1em;
            color: #191552;
            opacity: .55;
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
                height: 86px;
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

        /* =========================================================
           UNA SOLA PANTALLA

           Con al menos 1081x760 la página mide exactamente el alto
           de la ventana y no hace falta la rueda del ratón. El
           calendario se estira para llenar el hueco vertical que
           quede. Por debajo de ese tamaño no cabe sin dejar las
           casillas ilegibles, así que vuelve el scroll normal.
           ========================================================= */

        @media (min-width: 1081px) and (min-height: 760px) {

            html, body {
                height: 100%;
                overflow: hidden;
            }

            body {
                display: flex;
                flex-direction: column;
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

            section {
                flex: 1;
                min-height: 0;
                padding: clamp(6px, 1.4vh, 40px) 0;
                display: flex;
                flex-direction: column;
            }

            h2 {
                flex: 0 0 auto;
                font-size: clamp(20px, 2.4vh, 36px);
                margin-bottom: clamp(1px, .4vh, 6px);
            }

            .sub {
                flex: 0 0 auto;
                font-size: clamp(12px, 1.5vh, 16px);
                margin-bottom: clamp(6px, 1.2vh, 22px);
            }

            .calEnv {
                flex: 1;
                min-height: 0;
                display: flex;
                flex-direction: column;
                width: 100%;
            }

            .calMandos {
                flex: 0 0 auto;
                margin-bottom: clamp(6px, 1.2vh, 20px);
            }

            .calMandos .et {
                margin-bottom: 2px;
            }

            .calMandos select,
            .calMandos input,
            .calMandos .btn {
                min-height: clamp(30px, 4.6vh, 44px);
                padding-top: 0;
                padding-bottom: 0;
            }

            .cal {
                flex: 1;
                min-height: 0;
                display: flex;
                flex-direction: column;
            }

            .cal__top {
                flex: 0 0 auto;
                padding: clamp(6px, 1.2vh, 22px) clamp(10px, 1.6vh, 22px);
            }

            .sem {
                flex: 0 0 auto;
            }

            .sem span {
                padding: clamp(4px, .8vh, 14px) 10px;
            }

            .dias {
                flex: 1;
                min-height: 0;
                grid-template-rows: repeat(6, minmax(0, 1fr));
            }

            .dia {
                height: auto;
                min-height: 0;
                padding: clamp(5px, 1vh, 13px) clamp(6px, 1.2vh, 13px);
                gap: clamp(1px, .4vh, 3px);
                overflow: hidden;
            }

            .dia b {
                font-size: clamp(16px, 2.6vh, 26px);
            }

            .dia small {
                font-size: clamp(9px, 1.15vh, 12.5px);
            }

            .dia__eventos {
                max-height: clamp(16px, 3.4vh, 38px);
            }

            .dia__ev-txt {
                font-size: clamp(9px, 1.1vh, 12px);
            }

            .dia__marca {
                font-size: clamp(8px, 1vh, 9.5px);
            }

            .calPie {
                flex: 0 0 auto;
                margin-top: clamp(6px, 1vh, 16px);
            }

            .pie {
                flex: 0 0 auto;
                padding: clamp(4px, .8vh, 22px) 0;
                font-size: 10px;
            }

            /* la cadena que reparte el alto hasta el panel anual */
            .duo {
                flex: 1;
                min-height: 0;
            }

            .anioEnv {
                max-width: none;
            }

            .anio__top {
                padding: clamp(6px, 1.2vh, 16px) clamp(10px, 1.6vh, 20px);
            }

            .anio__titulo {
                font-size: clamp(16px, 2vh, 26px);
            }

            .anioGrid {
                gap: clamp(4px, .8vh, 10px);
                padding: clamp(5px, .9vh, 12px);
            }

            .mesMini__top {
                padding: clamp(2px, .5vh, 5px) clamp(4px, .6vw, 8px);
                font-size: clamp(8px, 1.15vh, 12px);
            }

            .mesMini__top span {
                font-size: clamp(6px, .85vh, 9px);
            }

            .mesMini__sem span {
                padding: clamp(1px, .3vh, 3px) 0;
                font-size: clamp(5.5px, .78vh, 8px);
            }

            .mesMini__dia {
                font-size: clamp(6px, .92vh, 9px);
            }
        }

        /* muy poca altura: la intro y el pie de fecha ya no caben
           sin apretar la rejilla, así que se ocultan */
        @media (min-width: 1081px) and (min-height: 760px) and (max-height: 860px) {

            .sub,
            .calPie {
                display: none;
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
        body.pantalla .calEnv { max-width: none; }
        /* pantalla completa es solo el mes: la columna del año
           y la línea divisoria se apartan */
        body.pantalla #ladoAnual,
        body.pantalla .duo__medio { display: none; }
        body.pantalla .duo {
            display: block;
            height: 100%;
        }
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
        body.pantalla .dia { height: auto; min-height: 0; }
        body.pantalla .dia b { font-size: 26px; }

        /* ---- CELDA PULSABLE ---- */
        .dia { cursor: pointer; overflow: hidden; transition: background .18s ease; }
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

        .ficha__ev p {
            margin: 5px 0 0;
            font-size: 14.5px;
            color: inherit;
        }

        .ficha__meta {
            font-family: var(--mono);
            font-size: 11px;
            text-transform: uppercase;
            letter-spacing: .08em;
            color: inherit;
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

        .ficha__ev,
        .ficha__ev h4,
        .ficha__ev p,
        .ficha__ev .ficha__meta,
        .ficha__ev .ficha__meta span,
        .ficha__ev .ficha__cat {
            color: inherit !important;
        }


    </style>
</head>

<body>

${BANNER}

<header class="top">

    <h1>
        Kirkversario
        <span>CALENDAR</span>
    </h1>

    <a class="btn" href="/">
        Home
    </a>

    {{ADMIN_BUTTON}}

    <button class="btn" id="btnTema" type="button">
        Noche
    </button>

</header>

<main class="env">

    <div class="duo" id="duo">

        <div class="duo__lado" id="ladoAnual">

            <section>

                <h2>El año</h2>

                <p class="sub">
                    Los doce meses de un vistazo. Pulsa un mes o un día
                    para saltar a él en el calendario de la derecha.
                </p>

                <div class="anioEnv">

                <div class="anio">

                    <div class="anio__top">

                        <button
                            class="cal__nav"
                            id="anioAnt"
                            type="button"
                            aria-label="Año anterior"
                        >
                            &lsaquo;
                        </button>

                        <h3 class="anio__titulo" id="anioTitulo">
                            —
                        </h3>

                        <button
                            class="cal__hoy"
                            id="anioHoy"
                            type="button"
                            hidden
                        >
                            Volver a hoy
                        </button>

                        <button
                            class="cal__nav"
                            id="anioSig"
                            type="button"
                            aria-label="Año siguiente"
                        >
                            &rsaquo;
                        </button>

                    </div>

                    <div class="anioGrid" id="anioGrid"></div>

                </div>

                </div>

            </section>

        </div>


        <div class="duo__medio"></div>


        <div class="duo__lado" id="ladoMensual">

            <section>

                <h2>El calendario</h2>

                <p class="sub">
                    Doce meses en rejilla. Cada casilla lleva el día del calendario
                    Kirk arriba y su equivalente de siempre debajo.
                    Los días en gris son del mes de al lado.
                </p>

                <div class="calEnv">

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
                            &rsaquo;
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
                        <span class="et">día del año</span>
                        <b id="pieDia">—</b>
                    </div>

                </div>

                </div>

            </section>

        </div>

    </div>

</main>

<footer class="pie env">
    Calendario Kirk · rejilla mensual
</footer>

<script>
(function () {

    "use strict";

    /*
     * CONFIGURACION
     *
     * Define donde cae el día 1 del mes 1
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
        { n: "Kirkcabron", d: 30 },
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
        "miercoles",
        "jueves",
        "viernes",
        "sabado",
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
    var anioActual;
    var eventos = [];
    var MAX_MARCAS = 13;

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

    var CACHE_TEXTO = {};

    function colorTextoDe(color) {

        if (CACHE_TEXTO[color] !== undefined) {
            return CACHE_TEXTO[color];
        }

        var hex = String(color).replace("#", "");

        var resultado = "#ffffff";

        if (/^[0-9a-f]{6}$/i.test(hex)) {

            var r = parseInt(hex.substring(0, 2), 16);
            var v = parseInt(hex.substring(2, 4), 16);
            var b = parseInt(hex.substring(4, 6), 16);

            if ((r * 299 + v * 587 + b * 114) / 1000 > 150) {
                resultado = "#191552";
            }
        }

        CACHE_TEXTO[color] = resultado;

        return resultado;
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

            var eventosHtml =
                '<div class="dia__eventos">' +

                eventosDia.slice(0, MAX_MARCAS).map(function(evento) {

                    var color = evento.color || "#6366f1";

                    return (
                        '<div class="dia__evento" ' +
                        'style="background-color:' +
                        escapeHtml(color) +
                        ";color:" +
                        colorTextoDe(color) +
                        ';">' +
                        '<span class="dia__ev-txt">' +
                        escapeHtml(evento.title) +
                        "</span>" +
                        "</div>"
                    );

                }).join("") +

                "</div>";

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

        /* el año siempre refleja el mes que se está viendo:
           así quedan las dos columnas conectadas de verdad */
        anioActual = vistaAnio;
        pintarAnio();
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
     * CALENDARIO ANUAL (columna izquierda)
     *
     * Rejilla de 42 casillas por mes (6 filas fijas), así todos
     * los meses miden lo mismo aunque tengan 4, 5 o 6 semanas
     * reales. Cada mes y cada día son botones que saltan al
     * calendario mensual de la derecha.
     */
    var SEM_MINI = ["L", "M", "X", "J", "V", "S", "D"];

    function pintarAnio() {

        var hoy = hoyMs();

        $("anioTitulo").textContent =
            nAnio(anioActual);

        $("anioHoy").hidden =
            anioActual === kkMs(hoy).anio;

        var cabecera =
            '<div class="mesMini__sem">' +
            SEM_MINI.map(function (d) {
                return "<span>" + d + "</span>";
            }).join("") +
            "</div>";

        var html = "";

        for (var m = 0; m < 12; m++) {

            var primero = msKK(
                anioActual,
                m + 1,
                1
            );

            /* mismo arranque que el calendario grande: se
               retrocede al lunes de la primera semana */
            var arranque =
                primero -
                lun(primero) * MS;

            var esMesActual =
                anioActual === vistaAnio &&
                (m + 1) === vistaMes;

            html +=
                '<div class="mesMini' +
                (esMesActual ? " mesMini--actual" : "") +
                '">' +

                '<button type="button" class="mesMini__top" data-mes="' +
                (m + 1) +
                '"><span>' +
                (m + 1) +
                "</span>" +
                MESES[m].n +
                "</button>" +

                cabecera +

                '<div class="mesMini__dias">';

            for (var c = 0; c < 42; c++) {

                var ms =
                    arranque +
                    c * MS;

                var k = kkMs(ms);

                var fuera =
                    k.mes !== (m + 1) ||
                    k.anio !== anioActual;

                html +=
                    '<button type="button" class="mesMini__dia' +
                    (c % 7 >= 5 ? " mesMini__dia--finde" : "") +
                    (fuera ? " mesMini__dia--fuera" : "") +
                    (ms === hoy ? " mesMini__dia--hoy" : "") +
                    '" data-ms="' +
                    ms +
                    '">' +
                    k.dia +
                    "</button>";
            }

            html += "</div></div>";
        }

        $("anioGrid").innerHTML = html;
    }

    function saltarMes(mes) {

        vistaAnio = anioActual;
        vistaMes = mes;

        pintar();
    }

    /* salta al día exacto, aunque sea de un mes vecino:
       la fecha en ms ya lleva toda la información */
    function saltarDia(ms) {

        var k = kkMs(ms);

        vistaAnio = k.anio;
        vistaMes = k.mes;

        pintar();

        var celda = document.querySelector(
            '.dia[data-ms="' + ms + '"]'
        );

        if (celda) {
            abrirDia(celda);
        }
    }

    $("anioGrid").addEventListener("click", function (e) {

        var diaBtn = e.target.closest(".mesMini__dia");

        if (diaBtn) {

            saltarDia(
                parseInt(diaBtn.dataset.ms, 10)
            );

            return;
        }

        var mesBtn = e.target.closest(".mesMini__top");

        if (mesBtn) {
            saltarMes(parseInt(mesBtn.dataset.mes, 10));
        }
    });

    function moverAnio(n) {

        var a = anioActual + n;

        if (a === 0) {
            a = n > 0 ? 1 : -1;
        }

        anioActual = a;

        pintarAnio();
    }

    $("anioAnt").onclick = function () {
        moverAnio(-1);
    };

    $("anioSig").onclick = function () {
        moverAnio(1);
    };

    $("anioHoy").onclick = function () {

        anioActual = kkMs(hoyMs()).anio;

        pintarAnio();
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

        /* el icono del HTML (&#x26F6;) se queda siempre igual;
           solo cambia el texto accesible, no lo que se ve */
        b.title = on
            ? "Salir de pantalla completa"
            : "Pantalla completa";

        b.setAttribute(
            "aria-label",
            b.title
        );
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
                "No hay eventos este d\\u00eda." +
                "</p>";

        } else {

            cuerpo = evs.map(function (ev) {

                /*
                * COLOR DEL EVENTO
                */
                var color = ev.color || "#6366f1";

                var hex = color.replace("#", "");

                var r = parseInt(hex.substring(0, 2), 16);
                var g = parseInt(hex.substring(2, 4), 16);
                var b = parseInt(hex.substring(4, 6), 16);

                var luminosidad =
                    (r * 299 + g * 587 + b * 114) / 1000;

                /*
                * Texto negro para fondos claros
                * Texto blanco para fondos oscuros
                */
                var colorTexto =
                    luminosidad > 150
                        ? "#000000"
                        : "#ffffff";


                /*
                * HORA Y CATEGORÍA
                */
                var meta = "";

                if (ev.time) {

                    meta +=
                        '<span style="color:' +
                        colorTexto +
                        ' !important;">' +
                        escapeHtml(ev.time) +
                        "</span>";
                }

                if (ev.category) {

                    meta +=
                        '<span class="ficha__cat" style="color:' +
                        colorTexto +
                        ' !important; border-color:' +
                        colorTexto +
                        ';">' +
                        escapeHtml(ev.category) +
                        "</span>";
                }


                /*
                * EVENTO COMPLETO
                */
                return (
                    '<article class="ficha__ev" style="' +
                    'background-color:' +
                    escapeHtml(color) +
                    ';' +
                    'color:' +
                    colorTexto +
                    ' !important;' +
                    '">' +

                    /*
                    * TÍTULO
                    */
                    '<h4 style="color:' +
                    colorTexto +
                    ' !important;">' +
                    escapeHtml(ev.title) +
                    "</h4>" +

                    /*
                    * HORA + CATEGORÍA
                    */
                    (
                        meta
                            ? '<div class="ficha__meta" style="color:' +
                            colorTexto +
                            ' !important;">' +
                            meta +
                            "</div>"
                            : ""
                    ) +

                    /*
                    * DESCRIPCIÓN
                    */
                    (
                        ev.description
                            ? '<p style="color:' +
                            colorTexto +
                            ' !important;">' +
                            escapeHtml(ev.description) +
                            "</p>"
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
            sem(ms) +
            " \\u00b7 " +
            tG(ms) +
            " \\u00b7 " +
            nAnio(k.anio) +
            "</small>" +

            "</h3>" +

            '<button class="ficha__x" type="button" aria-label="Cerrar">' +
            "\\u2715" +
            "</button>" +

            "</div>" +

            '<div class="ficha__cuerpo">' +
            cuerpo +
            "</div>"
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
