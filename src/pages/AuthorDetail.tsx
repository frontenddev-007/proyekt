import { useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import Icon from "../components/ui/icon";
import { useGetAuthorDetail } from "../hooks/api/useGetAuthorDetail";

const AuthorDetail = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { author, isPending } = useGetAuthorDetail(id || "");

  useEffect(() => {
    window.scrollTo({ top: 0, left: 0, behavior: "smooth" });
  }, [id]);

  if (!id) {
    return <div className="text-center py-20">Author not found</div>;
  }

  if (isPending) {
    return (
      <div className="flex items-center justify-center py-20 min-h-screen">
        <div className="text-center">
          <div className="animate-spin mb-4">
            <Icon.logo />
          </div>
          <p className="text-[#6B7570]">Loading author details...</p>
        </div>
      </div>
    );
  }

  const bookCount = author.booksCount || 23;
  const followers = author.followersCount || 14200;
  const avgRating = author.avgRating || 4.6;
  const initials = author.fullName
    ? author.fullName
        .split(" ")
        .map((n) => n[0])
        .join("")
        .toUpperCase()
    : "?";

  return (
    <div className="min-h-screen bg-[#F8F5EE] text-[#1F2F28]">
      <div className="bg-[#2F5A3F] text-white">
        <div className="container py-4 sm:py-6">
          <button
            onClick={() => navigate(-1)}
            className="inline-flex items-center gap-2 text-sm font-medium hover:opacity-75 transition-opacity"
          >
            <span className="text-lg">←</span> Back
          </button>
        </div>
      </div>

      <div className="container py-8 sm:py-12">
        <div className="flex flex-col gap-6 md:flex-row md:items-start md:gap-8 mb-10 md:mb-12">
          <div className="flex-shrink-0 self-center md:self-start">
            <div className="w-24 h-24 sm:w-28 sm:h-28 md:w-32 md:h-32 rounded-full bg-[#B07A48] flex items-center justify-center text-white text-3xl sm:text-4xl font-bold shadow-lg">
              {initials}
            </div>
          </div>

          <div className="flex-1">
            <h1 className="text-3xl sm:text-4xl font-serif font-bold text-[#1F2F28] mb-2 text-center md:text-left">
              {author.fullName}
            </h1>
            {author.birthPlace || author.birthDate ? (
              <p className="text-[#6B7570] text-sm mb-4 text-center md:text-left">
                {author.birthPlace ? (
                  <>
                    📍 {author.birthPlace}
                    {author.birthDate && ` - Born ${author.birthDate}`}
                  </>
                ) : (
                  `Born ${author.birthDate}`
                )}
              </p>
            ) : null}

            {author.biography && (
              <p className="text-[#6B7570] text-sm leading-relaxed max-w-2xl mb-6 text-center md:text-left">
                {author.biography}
              </p>
            )}

            <div className="flex flex-wrap gap-6 sm:gap-8 mb-6 justify-center md:justify-start">
              <div>
                <p className="text-2xl font-bold text-[#1F2F28]">{bookCount}</p>
                <p className="text-[#6B7570] text-sm">Books</p>
              </div>
              <div>
                <p className="text-2xl font-bold text-[#1F2F28]">
                  {typeof followers === "number"
                    ? followers.toLocaleString()
                    : followers}
                </p>
                <p className="text-[#6B7570] text-sm">Followers</p>
              </div>
              <div>
                <p className="text-2xl font-bold text-[#1F2F28]">{avgRating}</p>
                <p className="text-[#6B7570] text-sm">Avg Rating</p>
              </div>
            </div>

            <div className="flex justify-center md:justify-start">
              <button
                type="button"
                className="w-full sm:w-auto px-6 py-2 bg-[#2F5A3F] text-white font-medium rounded-lg hover:bg-[#1E3F2A] transition-colors"
              >
                + Follow
              </button>
            </div>
          </div>
        </div>

        <div className="border-t border-[#E8DFD0] pt-8 sm:pt-12">
          <h2 className="text-2xl font-serif font-bold text-[#1F2F28] mb-6 sm:mb-8 text-center md:text-left">
            Books by {author.fullName?.split(" ")[0]}
          </h2>

          {author.books && author.books.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-6">
              {author.books.map((book) => (
                <div
                  key={book.id}
                  className="flex flex-col rounded-2xl border border-[#E8DFD0] bg-white p-4 shadow-sm"
                >
                  <div className="relative aspect-3/4 rounded-xl bg-linear-to-br from-[#2F5A3F] to-[#1E3F2A] mb-4 overflow-hidden">
                    <div className="w-full h-full flex items-center justify-center text-white p-4 text-center">
                      <p className="font-serif font-semibold text-sm">
                        {book.title}
                      </p>
                    </div>
                  </div>
                  <h3 className="font-semibold text-[#1F2F28] text-sm line-clamp-2">
                    {book.title}
                  </h3>
                  <div className="flex items-center gap-1 mt-2">
                    <Icon.star />
                    <span className="text-xs text-[#6B7570]">
                      {book.rating}
                    </span>
                  </div>
                  <p className="font-bold text-[#1F2F28] text-sm mt-1">
                    ${book.price}
                  </p>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-[#6B7570] text-center py-12">
              No books available yet
            </p>
          )}
        </div>
      </div>
    </div>
  );
};

export default AuthorDetail;
