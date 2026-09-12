/* ============================================
   BACKSOUND HANDLER
   ============================================ */

const bgm      = document.getElementById('bgm');
const musicBtn = document.getElementById('musicBtn');

let musicPlaying = false;

// Set sumber audio dari config
if (CONFIG.MUSIC_URL) {
  bgm.src = CONFIG.MUSIC_URL;
  bgm.volume = CONFIG.MUSIC_VOLUME ?? 0.5;
}

async function tryPlayMusic() {
  if (!CONFIG.MUSIC_URL) return;

  try {
    await bgm.play();
    musicPlaying = true;
    musicBtn.classList.remove('muted');
    musicBtn.textContent = '🔊';
  } catch (err) {
    musicPlaying = false;
    musicBtn.classList.add('muted');
    musicBtn.textContent = '🔇';
  }
}

// Toggle manual
musicBtn.addEventListener('click', (e) => {
  e.stopPropagation();

  if (bgm.paused) {
    bgm.play();
    musicPlaying = true;
    musicBtn.classList.remove('muted');
    musicBtn.textContent = '🔊';
  } else {
    bgm.pause();
    musicPlaying = false;
    musicBtn.classList.add('muted');
    musicBtn.textContent = '🔇';
  }
});