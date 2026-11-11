import { useCallback, useEffect, useState } from 'react';
import { supabase } from '../supabaseClient';
import { getDeviceId } from '../lib/deviceId';

export function usePresets() {
  const [presets, setPresets] = useState([]);
  const [loading, setLoading] = useState(true);

  const reload = useCallback(async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from('search_presets')
      .select('*')
      .eq('user_id', getDeviceId())
      .order('created_at', { ascending: false });
    if (!error) setPresets(data || []);
    setLoading(false);
  }, []);

  useEffect(() => { reload(); }, [reload]);

  const savePreset = useCallback(async (name, filters) => {
    const { error } = await supabase
      .from('search_presets')
      .upsert(
        { user_id: getDeviceId(), name: name.trim(), filters },
        { onConflict: 'user_id,name' }
      );
    if (error) throw error;
    await reload();
  }, [reload]);

  const deletePreset = useCallback(async (id) => {
    await supabase
      .from('search_presets')
      .delete()
      .eq('id', id)
      .eq('user_id', getDeviceId());
    await reload();
  }, [reload]);

  return { presets, loading, savePreset, deletePreset, reload };
}
