import { useNavigate, useParams } from "react-router-dom";
import Icon from "../components/ui/icon";
import { useFavorites } from "../hooks/useFavorites";
import { useGetBookDetail } from "../hooks/api/useGetBookDetail";

const BookDetail = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { book, isPending, isError } = useGetBookDetail(id || "");
  const { toggleFavorite, isFavorite } = useFavorites();

  if (!id) {
    return <div className="text-center py-20">Book not found</div>;
  }

  if (isPending) {
    return (
      <div className="flex items-center justify-center py-20 min-h-screen">
        <div className="text-center">
          <div className="animate-spin mb-4">
            <Icon.logo />
          </div>
          <p className="text-[#6B7570]">Loading book details...</p>
        </div>
      </div>
    );
  }

  const bookTitle = book?.title || "Untitled Book";
  const authorName =
    typeof book?.author === "object"
      ? book.author?.fullName
      : book?.author || "Unknown Author";
  const description =
    book?.description ||
    "A beautifully written book that invites you into a world of imagination and discovery.";
  const genre = book?.genre || "Fiction";
  const image =
    book?.image ||
    `https://via.placeholder.com/420x620?text=${encodeURIComponent(bookTitle)}`;
  const price = book?.price ? `$${book.price.toFixed(2)}` : "$0.00";
  const rating = book?.rating || 0;
  const pages = book?.pages || 320;
  const publishedDate = book?.publishedDate || "2024";
  const publisher = book?.publisher || "Penguin Press";
  const language = book?.language || "English";
  const isBookFavorite = isFavorite(String(book?.id || id));

  if (isError && !book?.id) {
    return (
      <div className="text-center py-20">
        <p className="text-[#6B7570] mb-4">Unable to load this book.</p>
        <button
          type="button"
          className="px-6 py-3 bg-[#2F5A3F] text-white rounded-lg hover:bg-[#1E3F2A] transition-colors"
          onClick={() => navigate(-1)}
        >
          Back
        </button>
      </div>
    );
  }

  return (
    <div className="bg-white min-h-screen">
      <div className="container py-10">
        <button
          type="button"
          onClick={() => navigate(-1)}
          className="mb-6 text-sm font-medium text-[#1F2F28] hover:opacity-80 transition-opacity"
        >
          ← Back to books
        </button>

        <div className="grid gap-10 lg:grid-cols-[360px_minmax(0,1fr)] items-start">
          <div className="rounded-[32px] overflow-hidden shadow-[0_40px_120px_rgba(45,63,69,0.08)]">
            <img
              src={image}
              alt={bookTitle}
              className="w-full h-full object-cover"
            />
          </div>

          <div>
            <div className="flex flex-col gap-4 mb-8">
              <div className="inline-flex items-center gap-3 rounded-full bg-[#F3F2EE] px-4 py-2 text-xs font-medium text-[#6B7570]">
                <span className="rounded-full bg-[#E8D7B7] px-2 py-1 text-[#7A5A2E]">
                  {genre}
                </span>
                <span>{language}</span>
                <span>{pages} pages</span>
              </div>

              <div className="flex flex-col gap-3">
                <h1 className="text-4xl font-serif font-bold text-[#1F2F28]">
                  {bookTitle}
                </h1>
                <p className="text-[#6B7570] text-sm">by {authorName}</p>

                <div className="flex flex-wrap gap-3 items-center">
                  <div className="flex items-center gap-2 text-[#1F2F28] font-semibold">
                    <Icon.star />
                    <span>{rating.toFixed(1)}</span>
                  </div>
                  <span className="text-sm text-[#6B7570]">
                    Published {publishedDate}
                  </span>
                  <span className="text-sm text-[#6B7570]">{publisher}</span>
                </div>
              </div>
            </div>

            <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between mb-8">
              <div>
                <p className="text-3xl font-bold text-[#1F2F28]">{price}</p>
                <p className="text-sm text-[#6B7570]">Exclusive offer</p>
              </div>

              <div className="flex flex-wrap gap-3">
                <button
                  type="button"
                  onClick={() => toggleFavorite(String(book?.id || id))}
                  className="inline-flex items-center gap-2 px-6 py-3 rounded-2xl border border-[#E8DFD0] bg-white text-[#1F2F28] hover:bg-[#FBF7F0] transition-colors"
                >
                  {isBookFavorite ? "Remove Favorite" : "Add to Favorites"}
                  <Icon.heartOutlineDark />
                </button>
                <button
                  type="button"
                  className="inline-flex items-center gap-2 px-6 py-3 rounded-2xl bg-[#2F5A3F] text-white hover:bg-[#1E3F2A] transition-colors"
                >
                  Buy Now
                </button>
              </div>
            </div>

            <div className="rounded-[32px] border border-[#F0ECE5] bg-[#FBF7F1] p-8">
              <h2 className="text-2xl font-semibold text-[#1F2F28] mb-4">
                Book synopsis
              </h2>
              <p className="text-[#6B7570] leading-relaxed mb-6">
                {description}
              </p>

              <div className="grid gap-4 sm:grid-cols-2">
                <div className="space-y-2">
                  <p className="text-sm text-[#6B7570]">Author</p>
                  <p className="text-[#1F2F28] font-semibold">{authorName}</p>
                </div>
                <div className="space-y-2">
                  <p className="text-sm text-[#6B7570]">Genre</p>
                  <p className="text-[#1F2F28] font-semibold">{genre}</p>
                </div>
                <div className="space-y-2">
                  <p className="text-sm text-[#6B7570]">Pages</p>
                  <p className="text-[#1F2F28] font-semibold">{pages}</p>
                </div>
                <div className="space-y-2">
                  <p className="text-sm text-[#6B7570]">Language</p>
                  <p className="text-[#1F2F28] font-semibold">{language}</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BookDetail;
