import React, { useState, useEffect, useCallback } from 'react';
import { FaStar, FaRegStar, FaThumbsUp, FaEdit, FaTrash, FaCheckCircle, FaSpinner } from 'react-icons/fa';
import { toast } from 'react-toastify';
import { useAuth } from '../../context/AuthContext';
import { reviewService } from '../../services/reviewService';
import './ReviewSection.css';

/* ─── Shared star renderer ─────────────────────────────────────────────── */
const StarDisplay = ({ rating, size = 'md' }) => {
    const full = Math.floor(rating);
    const empty = 5 - Math.ceil(rating);
    const half = rating % 1 >= 0.5;
    return (
        <span className={`star-display star-display--${size}`} aria-label={`${rating} out of 5 stars`}>
            {Array.from({ length: full }).map((_, i) => <FaStar key={`f${i}`} className="star-icon star-filled" />)}
            {half && <FaStar key="half" className="star-icon star-half" />}
            {Array.from({ length: empty }).map((_, i) => <FaRegStar key={`e${i}`} className="star-icon star-empty" />)}
        </span>
    );
};

/* ─── Interactive star picker ──────────────────────────────────────────── */
const StarPicker = ({ value, onChange, disabled }) => {
    const [hovered, setHovered] = useState(0);
    return (
        <div className="star-picker" role="group" aria-label="Select rating">
            {[1, 2, 3, 4, 5].map((n) => (
                <button
                    key={n}
                    type="button"
                    disabled={disabled}
                    className={`star-picker__btn ${(hovered || value) >= n ? 'active' : ''}`}
                    onMouseEnter={() => setHovered(n)}
                    onMouseLeave={() => setHovered(0)}
                    onClick={() => onChange(n)}
                    aria-label={`Rate ${n} star${n !== 1 ? 's' : ''}`}
                >
                    <FaStar />
                </button>
            ))}
            {(hovered || value) > 0 && (
                <span className="star-picker__label">
                    {['', 'Poor', 'Fair', 'Good', 'Very Good', 'Excellent'][hovered || value]}
                </span>
            )}
        </div>
    );
};

/* ─── Rating breakdown bars ────────────────────────────────────────────── */
const RatingBreakdown = ({ breakdown, total, avgRating, numReviews }) => {
    return (
        <div className="rating-overview">
            <div className="rating-overview__score">
                <span className="rating-big">{avgRating > 0 ? avgRating.toFixed(1) : '—'}</span>
                <StarDisplay rating={avgRating || 0} size="lg" />
                <span className="rating-count">{numReviews} {numReviews === 1 ? 'review' : 'reviews'}</span>
            </div>
            <div className="rating-overview__bars">
                {[5, 4, 3, 2, 1].map((star) => {
                    const count = breakdown[star] || 0;
                    const pct = total > 0 ? Math.round((count / total) * 100) : 0;
                    return (
                        <div key={star} className="rating-bar-row">
                            <span className="rating-bar-label">{star} ★</span>
                            <div className="rating-bar-track">
                                <div
                                    className="rating-bar-fill"
                                    style={{ width: `${pct}%` }}
                                    aria-valuenow={pct}
                                    aria-valuemin={0}
                                    aria-valuemax={100}
                                />
                            </div>
                            <span className="rating-bar-count">{count}</span>
                        </div>
                    );
                })}
            </div>
        </div>
    );
};

/* ─── Review form ──────────────────────────────────────────────────────── */
const ReviewForm = ({ productId, existingReview, onSuccess, onCancel }) => {
    const [form, setForm] = useState({
        rating: existingReview?.rating || 0,
        title: existingReview?.title || '',
        comment: existingReview?.comment || '',
    });
    const [submitting, setSubmitting] = useState(false);

    const isEdit = !!existingReview;

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (form.rating === 0) { toast.error('Please select a star rating'); return; }
        if (!form.comment.trim()) { toast.error('Please write a comment'); return; }

        setSubmitting(true);
        try {
            let result;
            if (isEdit) {
                result = await reviewService.updateReview(productId, existingReview._id, form);
            } else {
                result = await reviewService.createReview(productId, form);
            }
            toast.success(result.message);
            onSuccess(result.review);
        } catch (err) {
            toast.error(err.response?.data?.message || 'Failed to submit review');
        } finally {
            setSubmitting(false);
        }
    };

    return (
        <form className="review-form" onSubmit={handleSubmit} id="review-form">
            <h3 className="review-form__title">
                {isEdit ? '✏️ Edit Your Review' : '✍️ Write a Review'}
            </h3>

            <div className="review-form__field">
                <label className="review-form__label">Your Rating *</label>
                <StarPicker
                    value={form.rating}
                    onChange={(v) => setForm({ ...form, rating: v })}
                    disabled={submitting}
                />
            </div>

            <div className="review-form__field">
                <label className="review-form__label" htmlFor="review-title">Review Title</label>
                <input
                    id="review-title"
                    type="text"
                    className="review-form__input"
                    placeholder="Sum it up in a few words…"
                    value={form.title}
                    onChange={(e) => setForm({ ...form, title: e.target.value })}
                    maxLength={100}
                    disabled={submitting}
                />
            </div>

            <div className="review-form__field">
                <label className="review-form__label" htmlFor="review-comment">Your Review *</label>
                <textarea
                    id="review-comment"
                    className="review-form__textarea"
                    placeholder="What did you love or wish was different?"
                    value={form.comment}
                    onChange={(e) => setForm({ ...form, comment: e.target.value })}
                    rows={5}
                    maxLength={1000}
                    disabled={submitting}
                    required
                />
                <span className="review-form__char-count">{form.comment.length}/1000</span>
            </div>

            <div className="review-form__actions">
                <button type="submit" className="btn btn-primary review-form__submit" disabled={submitting}>
                    {submitting
                        ? <><FaSpinner className="spin" /> Submitting…</>
                        : isEdit ? 'Update Review' : 'Submit Review'}
                </button>
                {onCancel && (
                    <button type="button" className="btn btn-outline review-form__cancel" onClick={onCancel} disabled={submitting}>
                        Cancel
                    </button>
                )}
            </div>
        </form>
    );
};

/* ─── Single review card ───────────────────────────────────────────────── */
const ReviewCard = ({ review, currentUserId, productId, onUpdated, onDeleted }) => {
    const [helpfulVotes, setHelpfulVotes] = useState(review.helpfulVotes || 0);
    const [votedHelpful, setVotedHelpful] = useState(false); // optimistic (server holds truth)
    const [editing, setEditing] = useState(false);
    const [deleting, setDeleting] = useState(false);

    const isOwner = currentUserId && review.user?._id === currentUserId;

    const handleHelpful = async () => {
        try {
            const data = await reviewService.toggleHelpful(productId, review._id);
            setHelpfulVotes(data.helpfulVotes);
            setVotedHelpful(data.helpful);
        } catch (err) {
            toast.error(err.response?.data?.message || 'Failed to vote');
        }
    };

    const handleDelete = async () => {
        if (!window.confirm('Delete your review? This cannot be undone.')) return;
        setDeleting(true);
        try {
            await reviewService.deleteReview(productId, review._id);
            toast.success('Review deleted');
            onDeleted(review._id);
        } catch (err) {
            toast.error('Failed to delete review');
        } finally {
            setDeleting(false);
        }
    };

    const initials = review.user?.name
        ? review.user.name.split(' ').map((n) => n[0]).join('').toUpperCase().slice(0, 2)
        : '?';

    if (editing) {
        return (
            <div className="review-card review-card--editing">
                <ReviewForm
                    productId={productId}
                    existingReview={review}
                    onSuccess={(updated) => { setEditing(false); onUpdated(updated); }}
                    onCancel={() => setEditing(false)}
                />
            </div>
        );
    }

    return (
        <div className="review-card">
            <div className="review-card__header">
                <div className="review-card__author">
                    <div className="review-card__avatar">
                        {review.user?.profilePicture
                            ? <img src={review.user.profilePicture} alt={review.user.name} />
                            : <span>{initials}</span>}
                    </div>
                    <div className="review-card__author-info">
                        <span className="review-card__name">{review.user?.name || 'Anonymous'}</span>
                        {review.verifiedPurchase && (
                            <span className="verified-badge">
                                <FaCheckCircle /> Verified Purchase
                            </span>
                        )}
                    </div>
                </div>
                <div className="review-card__meta">
                    <span className="review-card__date">
                        {new Date(review.createdAt).toLocaleDateString('en-IN', { year: 'numeric', month: 'short', day: 'numeric' })}
                    </span>
                    {isOwner && (
                        <div className="review-card__owner-actions">
                            <button className="icon-btn" onClick={() => setEditing(true)} title="Edit review" aria-label="Edit review">
                                <FaEdit />
                            </button>
                            <button className="icon-btn icon-btn--danger" onClick={handleDelete} disabled={deleting} title="Delete review" aria-label="Delete review">
                                {deleting ? <FaSpinner className="spin" /> : <FaTrash />}
                            </button>
                        </div>
                    )}
                </div>
            </div>

            <div className="review-card__rating">
                <StarDisplay rating={review.rating} size="sm" />
                {review.title && <span className="review-card__review-title">{review.title}</span>}
            </div>

            <p className="review-card__comment">{review.comment}</p>

            {!isOwner && currentUserId && (
                <button
                    className={`helpful-btn ${votedHelpful ? 'helpful-btn--voted' : ''}`}
                    onClick={handleHelpful}
                    aria-label="Mark review as helpful"
                >
                    <FaThumbsUp />
                    Helpful ({helpfulVotes})
                </button>
            )}
            {!currentUserId && helpfulVotes > 0 && (
                <span className="helpful-count"><FaThumbsUp /> {helpfulVotes} found this helpful</span>
            )}
        </div>
    );
};

/* ─── Main ReviewSection ───────────────────────────────────────────────── */
const ReviewSection = ({ productId, avgRating, numReviews }) => {
    const { user, isAuthenticated } = useAuth();
    const [reviews, setReviews] = useState([]);
    const [breakdown, setBreakdown] = useState({ 5: 0, 4: 0, 3: 0, 2: 0, 1: 0 });
    const [total, setTotal] = useState(numReviews || 0);
    const [liveAvg, setLiveAvg] = useState(avgRating || 0);
    const [page, setPage] = useState(1);
    const [pages, setPages] = useState(1);
    const [loading, setLoading] = useState(true);
    const [loadingMore, setLoadingMore] = useState(false);
    const [sort, setSort] = useState('-createdAt');
    const [myReview, setMyReview] = useState(null);
    const [showForm, setShowForm] = useState(false);

    const fetchReviews = useCallback(async (pg = 1, sortBy = sort, replace = true) => {
        try {
            if (pg === 1) setLoading(true); else setLoadingMore(true);
            const data = await reviewService.getProductReviews(productId, { page: pg, limit: 8, sort: sortBy });
            setBreakdown(data.breakdown);
            setTotal(data.total);
            setPages(data.pages);
            setLiveAvg(data.total > 0
                ? Object.entries(data.breakdown).reduce((sum, [star, cnt]) => sum + star * cnt, 0) / data.total
                : 0);
            setReviews((prev) => replace ? data.reviews : [...prev, ...data.reviews]);
            setPage(pg);
        } catch {
            toast.error('Failed to load reviews');
        } finally {
            setLoading(false);
            setLoadingMore(false);
        }
    }, [productId, sort]);

    const fetchMyReview = useCallback(async () => {
        if (!isAuthenticated()) return;
        try {
            const data = await reviewService.getMyReview(productId);
            setMyReview(data.review);
        } catch { /* silent */ }
    }, [productId, isAuthenticated]);

    useEffect(() => {
        fetchReviews(1, sort, true);
        fetchMyReview();
    }, [productId, sort]); // eslint-disable-line react-hooks/exhaustive-deps

    const handleSortChange = (e) => {
        setSort(e.target.value);
        fetchReviews(1, e.target.value, true);
    };

    const handleNewReview = (review) => {
        setMyReview(review);
        setShowForm(false);
        fetchReviews(1, sort, true);
    };

    const handleUpdated = (updated) => {
        setMyReview(updated);
        setReviews((prev) => prev.map((r) => r._id === updated._id ? updated : r));
    };

    const handleDeleted = (deletedId) => {
        if (myReview?._id === deletedId) setMyReview(null);
        setReviews((prev) => prev.filter((r) => r._id !== deletedId));
        fetchReviews(1, sort, true); // refresh stats
    };

    return (
        <section className="reviews-section" id="reviews" aria-label="Customer Reviews">
            <h2 className="reviews-section__title">Customer Reviews</h2>

            {/* Rating overview */}
            <RatingBreakdown breakdown={breakdown} total={total} avgRating={liveAvg} numReviews={total} />

            {/* CTA to write a review */}
            {isAuthenticated() && !myReview && !showForm && (
                <div className="reviews-section__cta">
                    <p>Bought this? Share your experience!</p>
                    <button className="btn btn-primary" onClick={() => setShowForm(true)} id="write-review-btn">
                        ✍️ Write a Review
                    </button>
                </div>
            )}

            {!isAuthenticated() && (
                <div className="reviews-section__cta reviews-section__cta--login">
                    <p><a href="/login">Log in</a> to write a review.</p>
                </div>
            )}

            {/* My existing review badge */}
            {myReview && !reviews.some((r) => r._id === myReview._id) && (
                <div className="my-review-banner">
                    <span>✅ You've already reviewed this product.</span>
                </div>
            )}

            {/* New review form */}
            {showForm && (
                <div className="reviews-section__form-wrap">
                    <ReviewForm
                        productId={productId}
                        onSuccess={handleNewReview}
                        onCancel={() => setShowForm(false)}
                    />
                </div>
            )}

            {/* Sort controls */}
            {total > 0 && (
                <div className="reviews-section__controls">
                    <span className="reviews-section__count">{total} {total === 1 ? 'Review' : 'Reviews'}</span>
                    <label htmlFor="review-sort" className="sr-only">Sort reviews</label>
                    <select id="review-sort" className="review-sort-select" value={sort} onChange={handleSortChange}>
                        <option value="-createdAt">Newest First</option>
                        <option value="createdAt">Oldest First</option>
                        <option value="-rating">Highest Rated</option>
                        <option value="rating">Lowest Rated</option>
                        <option value="-helpfulVotes">Most Helpful</option>
                    </select>
                </div>
            )}

            {/* Reviews list */}
            {loading ? (
                <div className="reviews-loading">
                    {[1, 2, 3].map((i) => <div key={i} className="review-skeleton" />)}
                </div>
            ) : reviews.length === 0 ? (
                <div className="no-reviews">
                    <span className="no-reviews__emoji">💎</span>
                    <p>No reviews yet. Be the first to share your thoughts!</p>
                </div>
            ) : (
                <div className="reviews-list">
                    {reviews.map((review) => (
                        <ReviewCard
                            key={review._id}
                            review={review}
                            currentUserId={user?._id}
                            productId={productId}
                            onUpdated={handleUpdated}
                            onDeleted={handleDeleted}
                        />
                    ))}
                </div>
            )}

            {/* Load more */}
            {page < pages && (
                <div className="reviews-section__load-more">
                    <button
                        className="btn btn-outline"
                        onClick={() => fetchReviews(page + 1, sort, false)}
                        disabled={loadingMore}
                    >
                        {loadingMore ? <><FaSpinner className="spin" /> Loading…</> : 'Load More Reviews'}
                    </button>
                </div>
            )}
        </section>
    );
};

export default ReviewSection;
