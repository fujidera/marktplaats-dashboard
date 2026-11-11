import { useState } from 'react';
import { usePresets } from '../hooks/usePresets';

export function PresetControls({ currentFilters, onLoad }) {
  const { presets, savePreset, deletePreset } = usePresets();
  const [open, setOpen] = useState(false);
  const [name, setName] = useState('');
  const [busy, setBusy] = useState(false);

  const handleSave = async () => {
    if (!name.trim() || busy) return;
    setBusy(true);
    try {
      await savePreset(name, currentFilters);
      setName('');
      setOpen(false);
    } catch (e) {
      alert('Не удалось сохранить пресет: ' + e.message);
    } finally {
      setBusy(false);
    }
  };

  return (
    <div className="relative inline-block">
      <button
        onClick={() => setOpen(o => !o)}
        className="bg-[#0a0908] border border-[#333] text-gray-300 px-4 py-2.5 rounded-lg text-sm hover:bg-[#1a1a1a] transition"
      >
        📁 Пресеты {presets.length > 0 && `(${presets.length})`}
      </button>

      {open && (
        <div className="absolute top-full right-0 mt-2 z-50 bg-[#141414] border border-[#333] rounded-xl p-3 w-80 shadow-2xl">
          <div className="flex gap-2 mb-3">
            <input
              value={name}
              onChange={e => setName(e.target.value)}
              placeholder="Название пресета"
              onKeyDown={e => e.key === 'Enter' && handleSave()}
              className="flex-1 bg-[#0a0908] text-gray-200 border border-[#333] rounded-lg px-3 py-2 text-sm outline-none focus:border-blue-500"
            />
            <button
              onClick={handleSave}
              disabled={busy || !name.trim()}
              className="bg-blue-600 text-white px-3 py-2 rounded-lg text-sm disabled:opacity-40 hover:bg-blue-700 transition"
            >
              💾
            </button>
          </div>

          <ul className="max-h-72 overflow-auto space-y-1">
            {presets.length === 0 && (
              <li className="text-gray-600 text-sm py-2">Нет сохранённых пресетов</li>
            )}
            {presets.map(p => (
              <li key={p.id} className="flex items-center gap-1">
                <button
                  onClick={() => { onLoad(p.filters); setOpen(false); }}
                  className="flex-1 text-left text-gray-200 text-sm px-2 py-1.5 rounded-lg hover:bg-[#222]"
                >
                  {p.name}
                </button>
                <button
                  onClick={() => deletePreset(p.id)}
                  className="text-red-500 hover:text-red-400 text-sm px-2"
                >
                  ✕
                </button>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}
