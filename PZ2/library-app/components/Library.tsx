import type { Library, Book as BookType, BookLabel } from "../types/Book";
import Book from "./Book";

export default function LibraryComponent({
  library,
  onDelete,
  onToggleLabel,
}: {
  library: Library;
  onDelete: (book: BookType) => void;
  onToggleLabel: (index: number, label: BookLabel) => void;
}) {
  if (library.length === 0) {
    return (
      <div className="text-center py-16 bg-white rounded-2xl border border-dashed border-gray-300 shadow-sm">
        <p className="text-gray-500 font-medium">
          No books in your library yet. Add one above!
        </p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
      {library.map((book: BookType, idx) => (
        <Book
          key={`${book.title}-${idx}`}
          book={book}
          index={idx}
          onDelete={onDelete}
          onToggleLabel={onToggleLabel}
        />
      ))}
    </div>
  );
}
