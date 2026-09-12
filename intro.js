/* ============================================
   INTRO SCREEN — TOMBOL LANJUTKAN
   ============================================ */

const intro    = document.getElementById('intro');
const introBtn = document.getElementById('introBtn');
const mainApp  = document.getElementById('mainApp');

introBtn.addEventListener('click', () => {
  // 1. Play musik — user gesture, pasti berhasil
  if (typeof tryPlayMusic === 'function') {
    tryPlayMusic();
  }

  // 2. Fade out intro + fade in form
  intro.classList.add('hide');
  mainApp.classList.add('show');

  // 3. Hapus intro dari DOM setelah animasi kelar
  setTimeout(() => {
    intro.remove();
  }, 1000);
});