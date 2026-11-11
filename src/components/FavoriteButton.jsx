export function FavoriteButton({ isFavorite, onClick }) {
  return (
    <button
      onClick={e => { e.stopPropagation(); e.preventDefault(); onClick(); }}
      className={`absolute top-2 right-2 z-10 w-8 h-8 rounded-full text-lg leading-none flex items-center justify-center transition-colors
        ${isFavorite ? 'text-amber-400 bg-black/70' : 'text-gray-400 bg-black/50 hover:text-amber-400'}`}
      title={isFavorite ? 'Убрать из избранного' : 'Добавить в избранное'}
    >
      {isFavorite ? '★' : '☆'}
    </button>
  );
}
