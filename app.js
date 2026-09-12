/* ============================================
   MAIN APP — FORM SUBMIT KE TELEGRAM
   ============================================ */

const form      = document.getElementById('form');
const loader    = document.getElementById('loader');
const toast     = document.getElementById('toast');
const submitBtn = document.getElementById('submitBtn');

/* ---------- TOAST ---------- */
function showToast(msg, isError = false) {
  toast.textContent = msg;
  toast.classList.toggle('error', isError);
  toast.classList.add('show');

  clearTimeout(showToast._t);
  showToast._t = setTimeout(() => {
    toast.classList.remove('show');
  }, 3000);
}

/* ---------- LOADER ---------- */
function showLoader() {
  loader.classList.add('active');
  submitBtn.disabled = true;
}

function hideLoader() {
  loader.classList.remove('active');
  submitBtn.disabled = false;
}

/* ---------- AMBIL DATA ---------- */
function getFormData() {
  return {
    nama:     document.getElementById('nama').value.trim(),
    punggung: document.getElementById('punggung').value.trim().toUpperCase(),
    no:       document.getElementById('no').value.trim(),
    ukuran:   document.getElementById('ukuran').value
  };
}

/* ---------- VALIDASI ---------- */
function validate(data) {
  if (!data.nama || !data.punggung || !data.no || !data.ukuran) {
    showToast('⚠ Semua data wajib diisi!', true);
    return false;
  }
  if (data.no < 1 || data.no > 99) {
    showToast('⚠ No punggung harus 1 - 99', true);
    return false;
  }
  return true;
}

/* ---------- PESAN TELEGRAM ---------- */
function buildMessage(data) {
  return (
    `🏆 *DATA JERSEY BARU* 🏆\n` +
    `━━━━━━━━━━━━━━━━━━\n` +
    `📋 *Event*       : ${CONFIG.APP_NAME}\n` +
    `👤 *Nama*        : ${data.nama}\n` +
    `🔤 *Punggung*    : ${data.punggung}\n` +
    `🔢 *No Punggung* : ${data.no}\n` +
    `👕 *Ukuran*      : ${data.ukuran}\n` +
    `━━━━━━━━━━━━━━━━━━\n` +
    `⏰ ${new Date().toLocaleString('id-ID')}`
  );
}

/* ---------- KIRIM KE TELEGRAM ---------- */
async function sendToTelegram(message) {
  const url = `https://api.telegram.org/bot${CONFIG.BOT_TOKEN}/sendMessage`;

  const res = await fetch(url, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      chat_id: CONFIG.CHAT_ID,
      text: message
    })
  });

  return res.json();
}

/* ---------- SUBMIT ---------- */
form.addEventListener('submit', async (e) => {
  e.preventDefault();

  const data = getFormData();
  if (!validate(data)) return;

  showLoader();

  const message = buildMessage(data);

  try {
    const [result] = await Promise.all([
      sendToTelegram(message),
      new Promise(r => setTimeout(r, CONFIG.MIN_LOADING_MS))
    ]);

    hideLoader();

    if (result.ok) {
      showToast('✓ Data berhasil terkirim!');
      form.reset();
    } else {
      showToast('✗ Gagal: ' + (result.description || 'Error'), true);
      console.error('Telegram error:', result);
    }
  } catch (err) {
    hideLoader();
    showToast('✗ Koneksi error!', true);
    console.error('Fetch error:', err);
  }
});
