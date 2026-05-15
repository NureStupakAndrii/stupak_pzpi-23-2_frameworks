import { useState } from "react";
import { useSearchBooks } from "../hooks/useSearchBook";
import type { GoogleBook } from "../types/GoogleBooks";

export default function GoogleBooksSearch() {
  const [query, setQuery] = useState("");
  const [search, setSearch] = useState("");

  const { data, loading, error } = useSearchBooks(search);

  const handleSubmit = (e: React.SubmitEvent) => {
    e.preventDefault();
    setSearch(query);
  };

  return (
    <div className="space-y-6">
      <form onSubmit={handleSubmit} className="flex gap-3">
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search books on Google..."
          className="flex-1 px-4 py-2.5 border border-gray-300 rounded-xl text-sm outline-none"
        />
        <button
          type="submit"
          className="px-6 py-2.5 bg-blue-600 text-white font-semibold rounded-xl shadow-sm cursor-pointer"
        >
          Search
        </button>
      </form>

      {loading && <p className="text-center text-gray-500 py-8">Loading...</p>}

      {error && (
        <p className="text-center text-red-500 py-8">{error.message}</p>
      )}

      {!loading && !error && search && data.length === 0 && (
        <p className="text-center text-gray-500 py-8">No results found</p>
      )}

      {!loading && data && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {data.map((item: GoogleBook) => {
            const info = item.volumeInfo;
            return (
              <div
                key={item.id}
                className="bg-white rounded-2xl p-6 shadow-sm border border-gray-200 flex flex-col h-full"
              >
                {info.imageLinks?.thumbnail && (
                  <img
                    src={info.imageLinks.thumbnail}
                    alt={info.title}
                    className="w-20 h-28 object-cover rounded-lg mb-4 self-center"
                  />
                )}
                <h3
                  className="text-lg font-bold text-gray-900 leading-tight mb-1 line-clamp-2"
                  title={info.title}
                >
                  {info.title}
                </h3>
                <p className="text-sm text-gray-600 mb-2">
                  {info.authors?.join(", ") || "Unknown author"}
                </p>
                <div className="mt-auto flex items-center justify-between pt-4 border-t border-gray-100">
                  <span className="text-xs text-gray-400 font-semibold">
                    {info.publishedDate || "N/A"}
                  </span>
                  {info.categories && (
                    <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-semibold bg-gray-100 text-gray-700 border border-gray-300">
                      {info.categories[0]}
                    </span>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}

      {!loading && !search && (
        <div className="text-center py-16 bg-white rounded-2xl border border-dashed border-gray-300 shadow-sm">
          <p className="text-gray-500 font-medium">
            Enter a search query to browse Google Books
          </p>
        </div>
      )}
    </div>
  );
}
