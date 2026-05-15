import type { Book as BookType, BookLabel } from "../types/Book";
import { LABEL_CONFIG } from "../costants";

export default function Book({
  book,
  index,
  onDelete,
  onToggleLabel,
}: {
  book: BookType;
  index: number;
  onDelete: (book: BookType) => void;
  onToggleLabel: (index: number, label: BookLabel) => void;
}) {
  return (
    <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-200 flex flex-col h-full">
      <div className="mb-4">
        <h3
          className="text-xl font-bold text-gray-900 leading-tight mb-2 line-clamp-2"
          title={book.title}
        >
          {book.title}
        </h3>
        <p className="text-gray-600 font-medium">{book.author}</p>
      </div>

      <div className="mb-4">
        {book.labels.length > 0 && (
          <div className="flex flex-wrap gap-1.5 mb-2">
            {book.labels.map((label) => (
              <span
                key={label}
                className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-semibold border bg-gray-100 text-gray-700 border-gray-300"
              >
                {LABEL_CONFIG[label].name}
                <button
                  onClick={() => onToggleLabel(index, label)}
                  className="ml-0.5 cursor-pointer hover:opacity-70"
                >
                  ✕
                </button>
              </span>
            ))}
          </div>
        )}
        <select
          value=""
          onChange={(e) => {
            if (e.target.value) {
              onToggleLabel(index, e.target.value as BookLabel);
            }
          }}
          className="w-full px-3 py-2 border border-gray-300 rounded-xl text-sm text-gray-600 bg-white cursor-pointer outline-none"
        >
          <option value="" disabled>
            Add label…
          </option>
          {(Object.keys(LABEL_CONFIG) as BookLabel[]).map((label) => (
            <option
              key={label}
              value={label}
              disabled={book.labels.includes(label)}
            >
              {LABEL_CONFIG[label].name}
            </option>
          ))}
        </select>
      </div>

      <div className="mt-auto flex items-center justify-between pt-5 border-t border-gray-100">
        <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-bold tracking-wide bg-blue-50 text-blue-700 uppercase">
          {book.genre}
        </span>
        <span className="text-sm text-gray-400 font-semibold bg-gray-50 px-2 py-1 rounded-md border border-gray-100">
          {book.year}
        </span>
        <button
          onClick={() => onDelete(book)}
          className="px-4 py-2 bg-red-600 cursor-pointer text-white font-semibold rounded-lg shadow-sm outline-none"
        >
          Delete
        </button>
      </div>
    </div>
  );
}
