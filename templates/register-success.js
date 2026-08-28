export default function registerSuccessTemplate(email) {
    return `
<!DOCTYPE html>
<html lang="es" data-tema="papel">

<head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1">

    <title>Cuenta creada · Kirkversario</title>

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

            --display: 'Bricolage Grotesque', 'Arial Black', sans-serif;
            --cuerpo: 'Instrument Sans', system-ui, sans-serif;
            --mono: 'DM Mono', ui-monospace, monospace;
        }

        * {
            box-sizing: border-box;
        }

        body {
            margin: 0;
            min-height: 100vh;
            background: var(--fondo);
            color: var(--texto);
            font-family: var(--cuerpo);
            display: flex;
            align-items: center;
            justify-content: center;
            padding: 24px;
        }

        .tarjeta {
            width: 100%;
            max-width: 560px;
            background: var(--tarjeta);
            border: 2px solid var(--texto);
            border-radius: 16px;
            overflow: hidden;
        }

        .cabecera {
            background: var(--amarillo);
            border-bottom: 2px solid var(--texto);
            padding: 24px;
        }

        .marca {
            font-family: var(--display);
            font-size: 17px;
            font-weight: 800;
            text-transform: uppercase;
        }

        .marca span {
            color: var(--rosa);
        }

        .contenido {
            padding: 32px 28px;
        }

        .et {
            font-family: var(--mono);
            font-size: 10px;
            text-transform: uppercase;
            letter-spacing: .1em;
            opacity: .55;
            margin-bottom: 8px;
        }

        h1 {
            font-family: var(--display);
            font-size: clamp(28px, 6vw, 42px);
            line-height: 1;
            letter-spacing: -.04em;
            margin: 0 0 18px;
        }

        p {
            font-size: 16px;
            line-height: 1.55;
            margin: 12px 0;
        }

        .correo {
            display: inline-block;
            margin: 8px 0;
            padding: 10px 13px;
            border: 1.5px solid var(--borde);
            border-radius: 8px;
            font-family: var(--mono);
            font-size: 14px;
            word-break: break-word;
        }

        .boton {
            display: inline-block;
            margin-top: 20px;
            padding: 11px 18px;
            border-radius: 999px;
            border: 1.5px solid var(--texto);
            background: var(--texto);
            color: var(--fondo);
            font-family: var(--mono);
            font-size: 11px;
            text-transform: uppercase;
            letter-spacing: .07em;
            text-decoration: none;
        }

        .boton:hover {
            background: transparent;
            color: var(--texto);
        }

        .nota {
            margin-top: 22px;
            color: rgba(25, 21, 82, .55);
            font-size: 13px;
        }

        @media (max-width: 600px) {
            body {
                padding: 14px;
            }

            .contenido {
                padding: 26px 20px;
            }
        }
    </style>
</head>

<body>

    <main class="tarjeta">

        <header class="cabecera">
            <div class="marca">
                Kirkversario
                <span>CUENTA</span>
            </div>
        </header>

        <section class="contenido">

            <div class="et">
                Registro completado
            </div>

            <h1>
                Cuenta creada
            </h1>

            <p>
                Hemos enviado un correo de verificación a:
            </p>

            <div class="correo">
                ${email}
            </div>

            <p>
                Revisa tu bandeja de entrada y pulsa el enlace
                para activar tu cuenta.
            </p>

            <a class="boton" href="/login">
                Ir al login
            </a>

            <p class="nota">
                Si no encuentras el correo, revisa también la carpeta
                de spam o correo no deseado.
            </p>

        </section>

    </main>

</body>
</html>
    `;
}