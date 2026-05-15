import type { Book } from "../types/Book";

export default function BookAddForm({
  onAdd,
}: {
  onAdd: (book: Book) => void;
}) {
  const handleSubmit = (event: React.ChangeEvent<HTMLFormElement>) => {
    event.preventDefault();
    const data = new FormData(event.currentTarget);

    const book: Book = {
      title: data.get("title") as string,
      author: data.get("author") as string,
      year: Number(data.get("year")),
      genre: data.get("genre") as string,
      labels: [],
    };

    onAdd(book);
    event.currentTarget.reset();
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="grid grid-cols-1 sm:grid-cols-2 gap-5"
    >
      <div>
        <label className="block text-sm font-semibold text-gray-700 mb-1.5">
          Title
        </label>
        <input
          required
          name="title"
          type="text"
          placeholder="e.g. The Great Gatsby"
          className="w-full px-4 py-2.5 border border-gray-300 rounded-xl outline-none"
        />
      </div>
      <div>
        <label className="block text-sm font-semibold text-gray-700 mb-1.5">
          Author
        </label>
        <input
          required
          name="author"
          type="text"
          placeholder="e.g. F. Scott Fitzgerald"
          className="w-full px-4 py-2.5 border border-gray-300 rounded-xl outline-none"
        />
      </div>
      <div>
        <label className="block text-sm font-semibold text-gray-700 mb-1.5">
          Year
        </label>
        <input
          required
          name="year"
          type="number"
          placeholder="e.g. 1925"
          className="w-full px-4 py-2.5 border border-gray-300 rounded-xl outline-none"
        />
      </div>
      <div>
        <label className="block text-sm font-semibold text-gray-700 mb-1.5">
          Genre
        </label>
        <input
          required
          name="genre"
          type="text"
          placeholder="e.g. Novel"
          className="w-full px-4 py-2.5 border border-gray-300 rounded-xl outline-none"
        />
      </div>
      <div className="sm:col-span-2 pt-2 flex justify-end">
        <button
          type="submit"
          className="w-full sm:w-auto px-8 py-3 bg-blue-600 text-white font-semibold rounded-xl shadow-sm outline-none cursor-pointer"
        >
          Add Book to Library
        </button>
      </div>
    </form>
  );
}
