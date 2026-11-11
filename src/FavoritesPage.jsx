import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { supabase } from './supabaseClient';
import { getDeviceId } from './lib/deviceId';
import { useFavoriteIds } from './hooks/useFavorites';
import { FavoriteButton } from './components/FavoriteButton';

export default function FavoritesPage() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const { favoriteIds, toggleFavorite } = useFavoriteIds();

  useEffect(() => {
    const load = async () => {
      const { data: favs } = await supabase
        .from('favorites')
        .select('listing_id, price_at_add, created_at')
        .eq('user_id', getDeviceId())
        .order('created_at', { ascending: false });

      if (!favs?.length) {
        setItems([]);
        setLoading(false);
        return;
      }

      const ids = favs.map(f => f.listing_id);
      const { data: listings } = await supabase
        .from('marktplaats_listings')
        .select('*')
        .in('id', ids);

      const byId = new Map((listings || []).map(l => [String(l.id), l]));
      const merged = favs
        .map(f => {
          const l = byId.get(String(f.listing_id));
          return l ? { ...l, price_at_add: f.price_at_add } : null;
        })
        .filter(Boolean);

      setItems(merged);
      setLoading(false);
    };
    load();
  }, [favoriteIds]);

  if (loading) return <div className="min-h-screen bg-[#0a0908] text-gray-400 p-8">Загрузка избранного…</div>;

  return (
    <div className="min-h-screen bg-[#0a0908] text-gray-300 p-4 md:p-6">
      <div className="max-w-7xl mx-auto">
        <div className="flex items-center justify-between mb-6 border-b border-[#222] pb-4">
          <h1 className="text-xl font-semibold text-white">⭐ Избранное</h1>
          <Link to="/" className="text-blue-400 text-sm hover:underline">
            ← Назад к списку
          </Link>
        </div>

        {items.length === 0 && (
          <p className="text-gray-500 bg-[#141414] border border-[#222] p-6 rounded-xl text-center">Пока ничего не добавлено в избранное.</p>
        )}

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
          {items.map(item => {
            const priceDropped =
              item.price_at_add != null &&
              item.price_cents != null &&
              item.price_cents < item.price_at_add;

            return (
              <div
                key={item.id}
                className="relative bg-[#141414] border border-[#222] rounded-xl overflow-hidden hover:border-gray-500 transition-all group flex flex-col"
              >
                <FavoriteButton
                  isFavorite={favoriteIds.has(String(item.id))}
                  onClick={() => toggleFavorite(item.id, true, item.price_cents)}
                />

                <Link to={`/listing/${item.id}`} className="flex flex-col flex-grow">
                  <div className="h-44 bg-[#1a1a1a] relative overflow-hidden flex items-center justify-center">
                    {item.image_url ? (
                      <img
                        src={item.image_url}
                        alt=""
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                        onError={e => { e.currentTarget.style.display = 'none'; }}
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-gray-600 text-sm">
                        Без фото
                      </div>
                    )}
                  </div>

                  <div className="p-3 flex flex-col flex-grow">
                    <h3 className="text-white text-sm line-clamp-2 min-h-[2.5rem] font-medium leading-tight">{item.title}</h3>
                    <div className="mt-auto pt-2 flex items-end justify-between">
                      <strong className="text-lg text-white block">
                        {item.price_cents ? `€ ${(item.price_cents / 100).toFixed(0)}` : '—'}
                      </strong>
                      {priceDropped && (
                        <span className="text-green-400 text-xs mb-1">
                          ↓ было {(item.price_at_add / 100).toFixed(0)} €
                        </span>
                      )}
                    </div>
                  </div>
                </Link>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
