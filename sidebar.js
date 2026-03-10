document.addEventListener('DOMContentLoaded', async () => {
  // 1. Fetch and inject the sidebar HTML into index.html
  const resp = await fetch('sidebar.html');
  const html = await resp.text();
  document.getElementById('sidebar-container').innerHTML = html;

  // 2. Grab elements
  const sidebar = document.getElementById('sidebar-menu');
  const overlay = document.getElementById('sidebar-overlay');
  const hamburgerBtn = document.getElementById('hamburger-btn');
  const chatHistoryList = document.getElementById('chat-history-list');

  // 3. Toggle Logic
  function toggleSidebar() {
    sidebar.classList.toggle('active');
    overlay.classList.toggle('active');
  }

  hamburgerBtn?.addEventListener('click', toggleSidebar);
  overlay?.addEventListener('click', toggleSidebar);

  // 4. Render History (Calls functions exposed from index.html)
  async function renderChatHistory() {
    if (typeof window.hoxLoadChats !== 'function') return;
    const chats = await window.hoxLoadChats();
    chatHistoryList.innerHTML = '';
    
    if (!chats || chats.length === 0) {
      chatHistoryList.innerHTML = '<div class="px-3 py-2 text-gray-500 text-xs">No past chats</div>';
      return;
    }

    chats.forEach(chat => {
      const btn = document.createElement('button');
      btn.className = 'w-full text-left px-3 py-3 rounded-md hover:bg-[#444654] text-[#ececf1] truncate transition-colors cursor-pointer text-sm mb-1';
      btn.textContent = chat.title || 'Conversation';
      btn.onclick = () => {
        window.hoxLoadSpecificChat(chat.id);
        if (window.innerWidth < 768) toggleSidebar(); // auto-close on mobile
      };
      chatHistoryList.appendChild(btn);
      // --- ADD THIS TO INJECT THE TRASH ICON ---
      btn.classList.add('flex', 'justify-between', 'items-center', 'group');
      
      const delBtn = document.createElement('div');
      delBtn.innerHTML = '🗑️';
      delBtn.className = 'opacity-0 group-hover:opacity-100 hover:text-red-500 transition-opacity ml-2 text-xs';
      
      delBtn.onclick = async (e) => {
        e.stopPropagation(); // Prevents the chat from loading when you click delete
        if (confirm('Delete this chat forever?')) {
          await window.sharedSupabase.from('chats').delete().eq('id', chat.id);
          renderChatHistory(); // Instantly refreshes the sidebar
        }
      };
      
      btn.appendChild(delBtn);
      // ----------------------------------------
    });
  }

  // 5. Button Listeners
  document.getElementById('sidebar-new-chat')?.addEventListener('click', () => {
    if (typeof window.hoxReset === 'function') window.hoxReset();
    if (window.innerWidth < 768) toggleSidebar();
  });

  document.getElementById('sidebar-logout')?.addEventListener('click', async () => {
    await window.sharedSupabase.auth.signOut();
    window.location.href = 'login.html';
  });

  // Render chats after a tiny delay to ensure Supabase auth is ready
  setTimeout(renderChatHistory, 500);
});