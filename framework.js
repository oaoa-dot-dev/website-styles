/**
 * OAOA NEO-BRUTALIST DESIGN SYSTEM & UI JAVASCRIPT FRAMEWORK
 * Interactive Component Handlers, Modals, Tabs, and Utilities
 * Version: 1.0.0
 */

// Escape HTML utility
export function escapeHtml(value) {
  return String(value ?? '')
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}

// Modal dialog builder
export function openModal({ title, body, footer, wide, onClose }) {
  const backdrop = document.createElement('div');
  backdrop.className = 'modal-backdrop';
  backdrop.setAttribute('role', 'dialog');
  backdrop.setAttribute('aria-modal', 'true');

  backdrop.innerHTML = `
    <div class="modal-panel ${wide ? 'wide' : ''}">
      <div class="modal-header">
        <h3 class="panel-title" style="font-size: 1rem;">${escapeHtml(title || '')}</h3>
        <button type="button" class="btn-ghost btn-sm" data-close>✕</button>
      </div>
      <div class="modal-body"></div>
      <div class="modal-footer ${footer ? '' : 'hidden'}"></div>
    </div>
  `;

  const bodyEl = backdrop.querySelector('.modal-body');
  const footEl = backdrop.querySelector('.modal-footer');

  if (typeof body === 'string') bodyEl.innerHTML = body;
  else if (body) bodyEl.appendChild(body);

  if (footer) {
    if (typeof footer === 'string') footEl.innerHTML = footer;
    else footEl.appendChild(footer);
  }

  const close = () => {
    backdrop.remove();
    document.removeEventListener('keydown', onKey);
    onClose?.();
  };

  const onKey = (e) => {
    if (e.key === 'Escape') close();
  };

  backdrop.addEventListener('click', (e) => {
    if (e.target === backdrop) close();
  });

  backdrop.querySelector('[data-close]').addEventListener('click', close);
  document.addEventListener('keydown', onKey);
  document.body.appendChild(backdrop);

  return { backdrop, bodyEl, footEl, close };
}

// Confirm dialog promise
export function confirmDialog(message, { title = 'Confirm', confirmLabel = 'Confirm', danger = false } = {}) {
  return new Promise((resolve) => {
    let settled = false;
    const done = (value) => {
      if (settled) return;
      settled = true;
      resolve(value);
    };

    const footer = `
      <button type="button" class="btn-secondary" data-cancel>Cancel</button>
      <button type="button" class="${danger ? 'btn-danger' : 'btn-primary'}" data-ok>${escapeHtml(confirmLabel)}</button>
    `;

    const modal = openModal({
      title,
      body: `<p style="margin:0">${escapeHtml(message)}</p>`,
      footer,
      onClose: () => done(false),
    });

    modal.footEl.querySelector('[data-cancel]').onclick = () => {
      done(false);
      modal.close();
    };

    modal.footEl.querySelector('[data-ok]').onclick = () => {
      done(true);
      modal.close();
    };
  });
}

// Dropdown binder
export function bindDropdowns(root = document) {
  const closeAll = () => {
    document.querySelectorAll('.dropdown-menu').forEach((menu) => {
      menu.hidden = true;
      menu.style.position = '';
      menu.style.top = '';
      menu.style.right = '';
      menu.style.left = '';
      const toggle = menu.previousElementSibling || document.querySelector(`[data-menu-target="${menu.id}"]`);
      if (toggle) {
        toggle.setAttribute('aria-expanded', 'false');
        toggle.classList.remove('active');
      }
    });
  };

  const place = (btn, menu) => {
    const r = btn.getBoundingClientRect();
    const menuWidth = menu.offsetWidth || 240;
    const menuHeight = menu.offsetHeight || 280;
    const align = menu.getAttribute('data-align') || btn.getAttribute('data-align');

    menu.style.position = 'fixed';
    menu.style.zIndex = '1000';

    // Vertical positioning: default below, flip above if overflowing bottom
    let top = Math.round(r.bottom + 2);
    if (top + menuHeight > window.innerHeight && r.top - menuHeight - 2 >= 0) {
      top = Math.round(r.top - menuHeight - 2);
    }
    menu.style.top = `${top}px`;

    // Horizontal positioning: align left or right
    if (align === 'left' || (align !== 'right' && r.left + menuWidth <= window.innerWidth)) {
      const left = Math.max(8, Math.min(Math.round(r.left), window.innerWidth - menuWidth - 8));
      menu.style.left = `${left}px`;
      menu.style.right = 'auto';
    } else {
      const right = Math.max(8, Math.min(Math.round(window.innerWidth - r.right), window.innerWidth - menuWidth - 8));
      menu.style.right = `${right}px`;
      menu.style.left = 'auto';
    }
  };

  root.querySelectorAll('[data-menu-toggle]').forEach((btn) => {
    btn.onclick = (e) => {
      e.preventDefault();
      e.stopPropagation();
      const menu = btn.nextElementSibling;
      if (!menu) return;
      const willOpen = menu.hidden;
      closeAll();
      if (willOpen) {
        menu.hidden = false;
        btn.setAttribute('aria-expanded', 'true');
        btn.classList.add('active');
        place(btn, menu);
      }
    };
  });

  const onDoc = (e) => {
    if (e.target.closest('[data-menu-toggle]')) return;
    const keepOpen = e.target.closest('.dropdown-menu[data-keep-open], .table-filter-menu');
    if (keepOpen) {
      if (e.target.closest('[data-menu-close]')) {
        closeAll();
      }
      return;
    }
    closeAll();
  };

  const onScroll = (e) => {
    if (e && e.target && (e.target.closest?.('.dropdown-menu') || e.target.classList?.contains('dropdown-menu'))) {
      return;
    }
    closeAll();
  };

  document.addEventListener('click', onDoc);
  document.addEventListener('scroll', onScroll, true);
  window.addEventListener('resize', onScroll);
}

// Table Column Filter binder (Excel-style header dropdowns)
export function bindTableFilters(root = document) {
  root.querySelectorAll('.table-filter-dropdown').forEach((dropdown) => {
    const th = dropdown.closest('th');
    const table = th?.closest('table');
    const colIndex = th ? Array.from(th.parentNode.children).indexOf(th) : -1;
    const btn = dropdown.querySelector('.th-filter-btn, [data-menu-toggle]');
    const menu = dropdown.querySelector('.table-filter-menu');
    if (!menu || !table || colIndex < 0) return;

    const searchInput = menu.querySelector('.table-filter-search-input');
    const list = menu.querySelector('.table-filter-list');
    const selectAllBtn = menu.querySelector('[data-action="select-all"]');
    const clearAllBtn = menu.querySelector('[data-action="clear-all"]');
    const applyBtn = menu.querySelector('[data-action="apply"]');
    const resetBtn = menu.querySelector('[data-action="reset"]');

    // Auto-populate unique column values if data-auto-populate="true"
    if (list && list.hasAttribute('data-auto-populate') && list.children.length === 0) {
      const tbody = table.querySelector('tbody');
      const counts = new Map();
      tbody?.querySelectorAll('tr').forEach((row) => {
        const cell = row.children[colIndex];
        const val = (cell?.dataset.filterValue || cell?.textContent || '').trim();
        if (val) counts.set(val, (counts.get(val) || 0) + 1);
      });

      Array.from(counts.keys()).sort().forEach((val) => {
        const item = document.createElement('label');
        item.className = 'table-filter-item';
        item.innerHTML = `
          <input type="checkbox" value="${escapeHtml(val)}" checked />
          <span class="item-text">${escapeHtml(val)}</span>
          <span class="item-count">${counts.get(val)}</span>
        `;
        list.appendChild(item);
      });
    }

    // Search filter input
    if (searchInput && list) {
      searchInput.addEventListener('input', () => {
        const q = searchInput.value.toLowerCase().trim();
        const items = list.querySelectorAll('.table-filter-item');
        let visible = 0;
        items.forEach((item) => {
          const text = (item.querySelector('.item-text')?.textContent || item.textContent || '').toLowerCase();
          const match = !q || text.includes(q);
          item.style.display = match ? 'flex' : 'none';
          if (match) visible++;
        });

        let emptyEl = menu.querySelector('.table-filter-empty');
        if (visible === 0) {
          if (!emptyEl) {
            emptyEl = document.createElement('div');
            emptyEl.className = 'table-filter-empty';
            emptyEl.textContent = 'No matching values';
            list.appendChild(emptyEl);
          }
          emptyEl.style.display = 'block';
        } else if (emptyEl) {
          emptyEl.style.display = 'none';
        }
      });
    }

    // Select All
    selectAllBtn?.addEventListener('click', (e) => {
      e.preventDefault();
      list?.querySelectorAll('.table-filter-item').forEach((item) => {
        if (item.style.display !== 'none') {
          const cb = item.querySelector('input[type="checkbox"]');
          if (cb) cb.checked = true;
        }
      });
    });

    // Clear All
    clearAllBtn?.addEventListener('click', (e) => {
      e.preventDefault();
      list?.querySelectorAll('.table-filter-item').forEach((item) => {
        if (item.style.display !== 'none') {
          const cb = item.querySelector('input[type="checkbox"]');
          if (cb) cb.checked = false;
        }
      });
    });

    // Sort buttons
    menu.querySelectorAll('[data-sort]').forEach((sortBtn) => {
      sortBtn.addEventListener('click', (e) => {
        e.preventDefault();
        const tbody = table.querySelector('tbody');
        if (!tbody) return;
        const sortType = sortBtn.getAttribute('data-sort');
        const rows = Array.from(tbody.querySelectorAll('tr'));

        rows.forEach((row, idx) => {
          if (!row.dataset.origIndex) row.dataset.origIndex = String(idx);
        });

        menu.querySelectorAll('[data-sort]').forEach((b) => b.classList.remove('active'));

        if (sortType === 'clear') {
          rows.sort((a, b) => Number(a.dataset.origIndex) - Number(b.dataset.origIndex));
        } else {
          sortBtn.classList.add('active');
          rows.sort((a, b) => {
            const aCell = a.children[colIndex];
            const bCell = b.children[colIndex];
            const aVal = (aCell?.dataset.sortValue || aCell?.textContent || '').trim();
            const bVal = (bCell?.dataset.sortValue || bCell?.textContent || '').trim();
            const numA = parseFloat(aVal.replace(/[^0-9.-]+/g, ''));
            const numB = parseFloat(bVal.replace(/[^0-9.-]+/g, ''));
            let cmp;
            if (!isNaN(numA) && !isNaN(numB) && /^\$?[0-9]/.test(aVal) && /^\$?[0-9]/.test(bVal)) {
              cmp = numA - numB;
            } else {
              cmp = aVal.localeCompare(bVal, undefined, { numeric: true, sensitivity: 'base' });
            }
            return sortType === 'asc' ? cmp : -cmp;
          });
        }

        rows.forEach((r) => tbody.appendChild(r));
        menu.hidden = true;
        if (btn) {
          btn.setAttribute('aria-expanded', 'false');
          btn.classList.remove('active');
        }
      });
    });

    // Apply Filter
    applyBtn?.addEventListener('click', (e) => {
      e.preventDefault();
      if (!list) return;
      const checkboxes = Array.from(list.querySelectorAll('input[type="checkbox"]'));
      const checkedValues = new Set(checkboxes.filter((cb) => cb.checked).map((cb) => cb.value.trim().toLowerCase()));
      const allChecked = checkboxes.length > 0 && checkboxes.every((cb) => cb.checked);

      const tbody = table.querySelector('tbody');
      const rows = Array.from(tbody?.querySelectorAll('tr') || []);
      let visibleCount = 0;

      rows.forEach((row) => {
        const cell = row.children[colIndex];
        const cellVal = (cell?.dataset.filterValue || cell?.textContent || '').trim().toLowerCase();

        let match = false;
        for (const val of checkedValues) {
          if (cellVal.includes(val) || val.includes(cellVal)) {
            match = true;
            break;
          }
        }

        row.dataset[`filterCol_${colIndex}`] = match ? 'pass' : 'fail';

        const passesAll = Object.keys(row.dataset)
          .filter((k) => k.startsWith('filterCol_'))
          .every((k) => row.dataset[k] === 'pass');

        if (passesAll) {
          row.style.display = '';
          visibleCount++;
        } else {
          row.style.display = 'none';
        }
      });

      if (!allChecked && checkboxes.length > 0) {
        btn?.classList.add('filtered');
        btn?.setAttribute('data-filtered', 'true');
      } else {
        btn?.classList.remove('filtered');
        btn?.removeAttribute('data-filtered');
      }

      const countEl = table.closest('.demo-box, .panel, .section-card')?.querySelector('.footer-count span:first-child');
      if (countEl) {
        countEl.textContent = `Showing ${visibleCount} of ${rows.length} records`;
      }

      menu.hidden = true;
      if (btn) {
        btn.setAttribute('aria-expanded', 'false');
        btn.classList.remove('active');
      }
    });

    // Reset Filter
    resetBtn?.addEventListener('click', (e) => {
      e.preventDefault();
      if (list) {
        list.querySelectorAll('input[type="checkbox"]').forEach((cb) => { cb.checked = true; });
        list.querySelectorAll('.table-filter-item').forEach((item) => { item.style.display = 'flex'; });
      }
      if (searchInput) searchInput.value = '';
      const emptyEl = menu.querySelector('.table-filter-empty');
      if (emptyEl) emptyEl.style.display = 'none';

      const tbody = table.querySelector('tbody');
      const rows = Array.from(tbody?.querySelectorAll('tr') || []);
      rows.forEach((row) => {
        delete row.dataset[`filterCol_${colIndex}`];
        const passesAll = Object.keys(row.dataset)
          .filter((k) => k.startsWith('filterCol_'))
          .every((k) => row.dataset[k] === 'pass');
        if (passesAll) row.style.display = '';
      });

      btn?.classList.remove('filtered');
      btn?.removeAttribute('data-filtered');
      menu.querySelectorAll('[data-sort]').forEach((b) => b.classList.remove('active'));

      const countEl = table.closest('.demo-box, .panel, .section-card')?.querySelector('.footer-count span:first-child');
      if (countEl) {
        const visibleRows = rows.filter((r) => r.style.display !== 'none').length;
        countEl.textContent = `Showing ${visibleRows} of ${rows.length} records`;
      }

      menu.hidden = true;
      if (btn) {
        btn.setAttribute('aria-expanded', 'false');
        btn.classList.remove('active');
      }
    });
  });
}

// Tab switcher binder
export function bindTabs(container) {
  const tabs = container.querySelectorAll('[data-tab-target]');
  tabs.forEach((tab) => {
    tab.addEventListener('click', (e) => {
      e.preventDefault();
      const targetId = tab.getAttribute('data-tab-target');
      const group = tab.getAttribute('data-tab-group') || 'default';

      // Deactivate sister tabs
      container.querySelectorAll(`[data-tab-group="${group}"]`).forEach((t) => t.classList.remove('active'));
      tab.classList.add('active');

      // Hide sister panels
      document.querySelectorAll(`[data-tab-panel-group="${group}"]`).forEach((p) => (p.style.display = 'none'));
      const targetPanel = document.getElementById(targetId);
      if (targetPanel) targetPanel.style.display = 'block';
    });
  });
}

// Code copier utility
export function bindCodeCopiers(root = document) {
  root.querySelectorAll('[data-copy-target]').forEach((btn) => {
    btn.onclick = async () => {
      const targetId = btn.getAttribute('data-copy-target');
      const target = document.getElementById(targetId);
      if (!target) return;
      const code = target.innerText;
      try {
        await navigator.clipboard.writeText(code);
        const originalText = btn.innerText;
        btn.innerText = 'COPIED!';
        btn.classList.add('btn-primary');
        setTimeout(() => {
          btn.innerText = originalText;
          btn.classList.remove('btn-primary');
        }, 1800);
      } catch (err) {
        console.error('Failed to copy', err);
      }
    };
  });
}

// Auto-init on DOMContentLoaded
document.addEventListener('DOMContentLoaded', () => {
  bindDropdowns();
  bindTableFilters();
  bindTabs(document);
  bindCodeCopiers();
});
