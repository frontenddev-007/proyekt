import { useNavigate } from "react-router-dom";
import { useGetAuthors } from "../hooks/api/useGetAuthors";
import Icon from "../components/ui/icon";

const Authors = () => {
  const navigate = useNavigate();
  const { authors, isPending } = useGetAuthors();

  if (isPending) {
    return (
      <div className="flex items-center justify-center py-20 min-h-screen">
        <div className="text-center">
          <div className="animate-spin mb-4">
            <Icon.logo />
          </div>
          <p className="text-[#6B7570]">Loading authors...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-[#F8F5EE] min-h-screen py-12">
      <div className="container">
        <div className="flex items-center justify-between mb-10">
          <div>
            <h1 className="text-4xl font-serif font-bold text-[#1F2F28]">
              All Authors
            </h1>
            <p className="text-sm text-[#6B7570] mt-2 max-w-2xl">
              Explore our author collection, read about their work, and open the
              author profile for detailed information.
            </p>
          </div>
          <button
            type="button"
            onClick={() => navigate(-1)}
            className="inline-flex items-center gap-2 text-sm font-medium text-[#1F2F28] hover:opacity-80 transition-opacity"
          >
            <span className="text-xl">←</span> Back
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6">
          {authors.map((author: any) => {
            const initials = author.fullName
              ? author.fullName
                  .split(" ")
                  .map((word: string) => word[0])
                  .join("")
                  .toUpperCase()
              : "?";
            const colors = [
              "from-[#2F6B4A] to-[#264B33]",
              "from-[#9B4FB8] to-[#54356D]",
              "from-[#B07A48] to-[#7C5938]",
              "from-[#4A7BC8] to-[#2C4C77]",
              "from-[#D16A6A] to-[#8C3D3D]",
              "from-[#4FA89A] to-[#2D6E65]",
            ];
            const colorIndex =
              (author.id?.toString().charCodeAt(0) || 0) % colors.length;

            return (
              <button
                type="button"
                key={author.id}
                onClick={() => navigate(`/authors/${author.id}`)}
                className="group text-left rounded-[32px] bg-white p-6 shadow-[0_24px_60px_rgba(70,83,74,0.08)] hover:-translate-y-1 hover:shadow-lg transition-all"
              >
                <div
                  className={`mb-6 h-24 w-full rounded-[28px] bg-gradient-to-br ${colors[colorIndex]} flex items-center justify-center text-white text-4xl font-bold`}
                >
                  {initials}
                </div>
                <div className="mb-4">
                  <h2 className="text-2xl font-semibold text-[#1F2F28] mb-2">
                    {author.fullName}
                  </h2>
                  <p className="text-[#6B7570] text-sm leading-relaxed min-h-[3rem]">
                    {author.biography
                      ? author.biography.substring(0, 100) + "..."
                      : "No biography available yet."}
                  </p>
                </div>
                <div className="flex items-center justify-between text-sm text-[#6B7570]">
                  <span>{author.books?.length ?? 12} books</span>
                  <span className="inline-flex items-center gap-1 text-[#2F5A3F] font-semibold group-hover:text-[#1E3F2A]">
                    View profile
                    <Icon.arrowRight />
                  </span>
                </div>
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default Authors;
