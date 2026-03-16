// modal.js
const hoxModal = (() => {
  const overlay = document.getElementById('hox-modal-overlay');
  const sheet = document.getElementById('hox-modal-sheet');
  const slider = document.getElementById('hox-modal-slider');
  const dragArea = document.getElementById('hox-drag-area');
  const subScroll = document.getElementById('hox-sub-scroll');
  const pillContainer = document.getElementById('hox-pill-container');
  
  let activePills = new Set();
  let touchStartY = 0;

  const open = () => {
    overlay.classList.add('active');
    sheet.classList.add('active');
    document.body.style.overflow = 'hidden'; // Lock background scroll
  };

  const close = () => {
    sheet.classList.remove('active');
    overlay.classList.remove('active');
    document.body.style.overflow = '';
    setTimeout(slideBack, 300); // Reset panel quietly after it slides down
  };

  const slideNext = () => slider.classList.add('slide-left');
  const slideBack = () => slider.classList.remove('slide-left');

  // Pill Management Engine
  const addPill = (id, text, icon) => {
    if (activePills.has(id)) { close(); return; } // Prevent duplicates
    
    // Rule: Only one specialization active at a time.
    if (id.startsWith('spec-')) {
      document.querySelectorAll('.hox-pill[data-type="spec"]').forEach(p => p.remove());
      activePills.forEach(p => { if(p.startsWith('spec-')) activePills.delete(p) });
    }

    activePills.add(id);
    const pill = document.createElement('div');
    pill.className = 'hox-pill';
    pill.dataset.id = id;
    pill.dataset.type = id.startsWith('spec-') ? 'spec' : 'action';
    pill.innerHTML = `<span>${icon}</span> ${text} <span class="hox-pill-close" onclick="hoxModal.removePill('${id}')">✕</span>`;
    
    pillContainer.appendChild(pill);
    close();
  };

  const removePill = (id) => {
    activePills.delete(id);
    const pill = document.querySelector(`.hox-pill[data-id="${id}"]`);
    if (pill) pill.remove();
  };

  const showToast = (msg) => {
    const toast = document.createElement('div');
    toast.className = 'hox-toast';
    toast.innerText = msg;
    document.body.appendChild(toast);
    setTimeout(() => toast.remove(), 2000);
  };

  // Advanced Swipe Engine (Prevents accidental closure while scrolling sub-lists)
  const handleTouchStart = (e) => { touchStartY = e.touches[0].clientY; };
  
  const handleTouchEnd = (e, isScrollableArea) => {
    const touchEndY = e.changedTouches[0].clientY;
    const deltaY = touchEndY - touchStartY;
    
    // If they swiped down hard enough (> 50px)
    if (deltaY > 50) {
      // If dragging from the handle, always close. 
      // If dragging inside the list, ONLY close if the list is scrolled to the absolute top.
      if (!isScrollableArea || subScroll.scrollTop === 0) {
        close();
      }
    }
  };

  // Event Listeners
  document.getElementById('hox-modal-trigger').addEventListener('click', open);
  overlay.addEventListener('click', close);
  
  dragArea.addEventListener('touchstart', handleTouchStart, {passive: true});
  dragArea.addEventListener('touchend', (e) => handleTouchEnd(e, false));
  
  sheet.addEventListener('touchstart', handleTouchStart, {passive: true});
  sheet.addEventListener('touchend', (e) => handleTouchEnd(e, true));

  // Expose necessary functions
  return { slideNext, slideBack, addPill, removePill, showToast };
})();