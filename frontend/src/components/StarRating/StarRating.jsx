import { Star, StarHalf } from 'lucide-react';

export default function StarRating({ rating = 0, count, size = 14 }) {
  const full = Math.floor(rating);
  const half = rating % 1 >= 0.5;

  return (
    <div className="stars" style={{ fontSize: size }}>
      {[...Array(5)].map((_, i) => (
        <span key={i} style={{ color: i < full ? 'var(--color-gold)' : (i === full && half ? 'var(--color-gold)' : 'var(--color-outline-variant)') }}>
          ★
        </span>
      ))}
      {count !== undefined && (
        <span style={{ fontSize: size - 2, color: 'var(--color-text-dim)', marginLeft: 4, fontFamily: 'var(--font-sans)' }}>
          ({count})
        </span>
      )}
    </div>
  );
}
