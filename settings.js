// Hoxchat Settings Manager
const HoxSettings = {
  overlay: null,
  activePanels: ['panel-main'], // Stack to track navigation history

  init() {
    this.overlay = document.getElementById('hox-settings-overlay');
  },

  open() {
    if (!this.overlay) this.init();
    this.overlay.classList.remove('hox-hidden');
  },

  close() {
    this.overlay.classList.add('hox-hidden');
    // Optional: Reset back to main panel after closing delay
    setTimeout(() => this.resetToMain(), 400); 
  },

  openSub(element) {
    const targetId = element.getAttribute('data-target');
    const targetPanel = document.getElementById(targetId);
    const currentPanelId = this.activePanels[this.activePanels.length - 1];
    const currentPanel = document.getElementById(currentPanelId);

    if (targetPanel && currentPanel) {
      // Push current panel back
      currentPanel.classList.remove('hox-panel-active');
      currentPanel.classList.add('hox-panel-pushed');
      
      // Slide target panel in
      targetPanel.classList.add('hox-panel-active');
      
      this.activePanels.push(targetId);
    }
  },

  back() {
    if (this.activePanels.length <= 1) return;

    const currentPanelId = this.activePanels.pop();
    const currentPanel = document.getElementById(currentPanelId);
    
    const previousPanelId = this.activePanels[this.activePanels.length - 1];
    const previousPanel = document.getElementById(previousPanelId);

    // Slide current panel out
    currentPanel.classList.remove('hox-panel-active');
    
    // Pull previous panel forward
    previousPanel.classList.remove('hox-panel-pushed');
    previousPanel.classList.add('hox-panel-active');
  },

  resetToMain() {
    // Resets all classes when overlay is hidden
    document.querySelectorAll('.hox-panel').forEach(p => {
      p.classList.remove('hox-panel-active', 'hox-panel-pushed');
    });
    document.getElementById('panel-main').classList.add('hox-panel-active');
    this.activePanels = ['panel-main'];
  }
};

// Initialize on load
document.addEventListener('DOMContentLoaded', () => HoxSettings.init());