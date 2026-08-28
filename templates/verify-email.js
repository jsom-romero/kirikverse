export default function verifyEmailTemplate({
    success = false,
    title = "",
    message = "",
    link = "/login",
    linkText = "Ir al login"
}) {

    return `
<!DOCTYPE html>
<html lang="es" data-tema="papel">

<head>

    <meta charset="utf-8">
    <meta
        name="viewport"
        content="width=device-width, initial-scale=1"
    >

    <title>${title} · Kirkversario</title>

    <link
        href="https://fonts.googleapis.com/css2?family=Bricolage+Grotesque:opsz,wght@12..96,400;12..96,700;12..96,800&family=Instrument+Sans:wght@400;500&family=DM+Mono:wght@400;500&display=swap"
        rel="stylesheet"
    >

    <style>

        :root {
            --fondo: #F3EDDF;
            --texto: #191552;
            --rosa: #FF4A6E;
            --amarillo: #FFC233;
            --tarjeta: #FBF7EC;
        }

        * {
            box-sizing: border-box;
        }

        body {
            margin: 0;
            min-height: 100vh;

            display: flex;
            align-items: center;
            justify-content: center;

            background: var(--fondo);
            color: var(--texto);

            font-family: 'Instrument Sans', sans-serif;
        }

        .caja {
            width: min(520px, calc(100% - 32px));

            background: var(--tarjeta);

            border: 2px solid var(--texto);
            border-radius: 16px;

            padding: 36px;

            box-shadow: 8px 8px 0 var(--texto);
        }

        .marca {
            font-family: 'Bricolage Grotesque', sans-serif;
            font-weight: 800;
            font-size: 14px;
            text-transform: uppercase;
            letter-spacing: .04em;

            margin-bottom: 28px;
        }

        .marca span {
            color: var(--rosa);
        }

        .icono {
            width: 58px;
            height: 58px;

            display: flex;
            align-items: center;
            justify-content: center;

            border: 2px solid var(--texto);
            border-radius: 50%;

            background: var(--amarillo);

            font-family: 'DM Mono', monospace;
            font-size: 24px;

            margin-bottom: 22px;
        }

        h1 {
            margin: 0 0 12px;

            font-family: 'Bricolage Grotesque', sans-serif;
            font-weight: 800;

            font-size: clamp(28px, 7vw, 42px);
            line-height: 1;
            letter-spacing: -.04em;
        }

        p {
            margin: 0 0 24px;

            font-size: 16px;
            line-height: 1.6;
        }

        .boton {
            display: inline-block;

            background: var(--texto);
            color: var(--fondo);

            border: 2px solid var(--texto);
            border-radius: 999px;

            padding: 11px 18px;

            font-family: 'DM Mono', monospace;
            font-size: 11px;

            text-transform: uppercase;
            letter-spacing: .07em;

            text-decoration: none;
        }

        .boton:hover {
            background: transparent;
            color: var(--texto);
        }

    </style>

</head>

<body>

    <main class="caja">

        <div class="marca">
            Kirkversario <span>CUENTA</span>
        </div>

        <div class="icono">
            ${success ? "✓" : "!"}
        </div>

        <h1>
            ${title}
        </h1>

        <p>
            ${message}
        </p>

        <a
            class="boton"
            href="${link}"
        >
            ${linkText}
        </a>

    </main>

</body>

</html>
    `;
}