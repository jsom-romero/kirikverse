export default `
<style>
  .banner-contador {
    width: 100%;
    background: var(--amarillo);
    color: #191552;
    border-bottom: 2px solid var(--texto);
    position: relative;
    z-index: 1000;
  }

  .banner-contador__contenido {
    width: 100%;
    max-width: 900px;
    min-height: 52px;
    margin: 0 auto;
    padding: 8px 18px;

    display: flex;
    align-items: center;
    justify-content: center;
    gap: 14px;

    font-family: var(--mono);
    font-size: 12px;
    font-weight: 500;
    text-transform: uppercase;
    letter-spacing: .06em;
    text-align: center;
  }

  .banner-contador__numero {
    font-family: var(--display);
    font-size: 21px;
    font-weight: 800;
    line-height: 1;
    letter-spacing: -.03em;
    white-space: nowrap;
  }

  @media (max-width: 520px) {
    .banner-contador__contenido {
      min-height: 58px;
      flex-direction: column;
      gap: 4px;
      padding: 9px 12px;
    }

    .banner-contador__texto {
      font-size: 10px;
    }

    .banner-contador__numero {
      font-size: 20px;
    }
  }
</style>

<div class="banner-contador" id="bannerContador">
  <div class="banner-contador__contenido">
    <span class="banner-contador__texto">
      PRÓXIMO KIRKVERSARIO
    </span>

    <span
      class="banner-contador__numero"
      id="contadorKirkversario"
      aria-live="polite"
    >
      00:00:00:00
    </span>
  </div>
</div>

<script>
(function () {

  function actualizarContador() {

    var ahora = new Date();

    var objetivo = new Date(
      ahora.getFullYear(),
      8,
      10,
      0,
      0,
      0,
      0
    );

    if (ahora >= objetivo) {
      objetivo = new Date(
        ahora.getFullYear() + 1,
        8,
        10,
        0,
        0,
        0,
        0
      );
    }

    var diferencia =
      objetivo.getTime() - ahora.getTime();

    var dias =
      Math.floor(diferencia / 86400000);

    var horas =
      Math.floor(
        (diferencia % 86400000) / 3600000
      );

    var minutos =
      Math.floor(
        (diferencia % 3600000) / 60000
      );

    var segundos =
      Math.floor(
        (diferencia % 60000) / 1000
      );

    function dos(n) {
      return String(n).padStart(2, "0");
    }

    var contador =
      document.getElementById(
        "contadorKirkversario"
      );

    if (!contador) return;

    contador.textContent =
      dos(dias) + ":" +
      dos(horas) + ":" +
      dos(minutos) + ":" +
      dos(segundos);
  }

  actualizarContador();

  setInterval(
    actualizarContador,
    1000
  );

})();
</script>
`;
