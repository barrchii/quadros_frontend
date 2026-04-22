// print.js — shared logic for all print pages
//
// Each print page declares its print key via:
//   <main class="print-page" data-print="AguaBlanca" data-title="Agua Blanca">
//
// Image files must follow the naming convention:
//   framed/{key}-BlackFrame.png
//   framed/{key}-WoodFrame.png
//   framed/{key}-NoFrame.png
 
(function () {
  const main     = document.querySelector('.print-page');
  const printKey = main.dataset.print;
 
  const photo       = document.getElementById('photo');
  const sizeSelect  = document.getElementById('size');
  const frameSelect = document.getElementById('frame');
  const priceTag    = document.getElementById('price');
 
  // ── Pricing table ─────────────────────────────────────────────────────────
  // Flat price per size + whether a frame is added.
  // "framed" covers both black and wood — same price either way.
  const prices = {
    medium: { noframe: 80,  framed: 110 },
    large:  { noframe: 120, framed: 150 },
  };
 
  // ── Image paths keyed by frame value ──────────────────────────────────────
  const frameImages = {
    black: `framed/${printKey}-BlackFrame.png`,
    wood:  `framed/${printKey}-WoodFrame.png`,
    none:  `framed/${printKey}-NoFrame.png`,
  };
 
  // ── Price ─────────────────────────────────────────────────────────────────
  function updatePrice() {
    const size     = sizeSelect.value;
    const isFramed = frameSelect.value !== 'none';
    const price    = prices[size][isFramed ? 'framed' : 'noframe'];
    priceTag.textContent = `$${price} USD`;
  }
 
  // ── Image swap ────────────────────────────────────────────────────────────
  function updateImage() {
    photo.src = frameImages[frameSelect.value] ?? frameImages.none;
  }
 
  // ── Event listeners ───────────────────────────────────────────────────────
  sizeSelect.addEventListener('change', updatePrice);
  frameSelect.addEventListener('change', () => {
    updatePrice();
    updateImage();
  });
 
  // ── Init — run once on load to set correct image and price ────────────────
  updatePrice();
  updateImage();

  // ── Cart buttons ────────────────────────────────────────────────────────
  const buttons = document.querySelectorAll('.buttons button');

  // "Buy now" button
  buttons[0].addEventListener('click', () => {
    addToCart(main.dataset.print.toLowerCase(), sizeSelect.value, frameSelect.value);
  });

  // "Add to cart" button
  buttons[1].addEventListener('click', () => {
    addToCart(main.dataset.print.toLowerCase(), sizeSelect.value, frameSelect.value);
  });
})();