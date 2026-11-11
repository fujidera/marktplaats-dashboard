import { useCallback, useEffect, useState } from 'react';
import { supabase } from '../supabaseClient';
import { getDeviceId } from '../lib/deviceId';

export function useFavoriteIds() {
  const [favoriteIds, setFavoriteIds] = useState(new Set());

  const reload = useCallback(async () => {
    const { data } = await supabase
      .from('favorites')
      .select('listing_id')
      .eq('user_id', getDeviceId());
    // Приводим к строке на всякий случай, так как id в базе text
    setFavoriteIds(new Set((data || []).map(r => String(r.listing_id))));
  }, []);

  useEffect(() => { reload(); }, [reload]);

  const toggleFavorite = useCallback(
    async (listingId, isCurrentlyFavorite, priceCents) => {
      const user_id = getDeviceId();

      setFavoriteIds(prev => {
        const next = new Set(prev);
        const strId = String(listingId);
        if (isCurrentlyFavorite) next.delete(strId);
        else next.add(strId);
        return next;
      });

      if (isCurrentlyFavorite) {
        await supabase
          .from('favorites')
          .delete()
          .eq('user_id', user_id)
          .eq('listing_id', String(listingId));
      } else {
        await supabase.from('favorites').insert({
          user_id,
          listing_id: String(listingId),
          price_at_add: priceCents ?? null,
        });
      }
      await reload();
    },
    [reload]
  );

  return { favoriteIds, toggleFavorite, reload };
}
