import { useState } from "react";
import "./App.css";
import LibraryComponent from "../components/Library";
import BookAddForm from "../components/BookAddForm";
import GoogleBooksSearch from "../components/GoogleBooksSearch";
import TabSwitch from "../components/TabSwitch";
import { BOOKS } from "../costants";
import type { Library, Book, BookLabel } from "../types/Book";

type Tab = "library" | "browse";

function App() {
  const [library, setLibrary] = useState<Library>(BOOKS);
  const [activeTab, setActiveTab] = useState<Tab>("library");

  const handleAddBoooks = (book: Book) => {
    setLibrary((prev) => [...prev, { ...book, labels: [] }]);
  };

  const handleDeleteBook = (book: Book) => {
    setLibrary((prev) => prev.filter((b) => b !== book));
  };

  const handleToggleLabel = (index: number, label: BookLabel) => {
    setLibrary((prev) =>
      prev.map((book, i) => {
        if (i !== index) return book;
        const has = book.labels.includes(label);
        return {
          ...book,
          labels: has
            ? book.labels.filter((l) => l !== label)
            : [...book.labels, label],
        };
      }),
    );
  };

  return (
    <div className="min-h-screen bg-gray-50 py-10 px-4 sm:px-6 lg:px-8 font-sans">
      <div className="max-w-5xl mx-auto space-y-10">
        <div className="text-center">
          <h1 className="text-4xl font-extrabold text-gray-900 tracking-tight">
            My Library
          </h1>
          <p className="mt-2 text-lg text-gray-500">
            A simple collection of your favorite books
          </p>
        </div>
        ы
        <TabSwitch
          activeTab={activeTab}
          setActiveTab={setActiveTab as (tab: Tab) => void}
        />
        {activeTab === "library" && (
          <>
            <div className="bg-white p-6 sm:p-8 rounded-2xl shadow-sm border border-gray-200">
              <h2 className="text-xl font-bold text-gray-800 mb-6">
                Add a New Book
              </h2>
              <BookAddForm onAdd={handleAddBoooks} />
            </div>

            <div>
              <h2 className="text-2xl font-bold text-gray-800 mb-6 px-1">
                Your Books Collection
              </h2>
              <LibraryComponent
                library={library}
                onDelete={handleDeleteBook}
                onToggleLabel={handleToggleLabel}
              />
            </div>
          </>
        )}
        {activeTab === "browse" && <GoogleBooksSearch />}
      </div>
    </div>
  );
}

export default App;
