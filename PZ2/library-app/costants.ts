import type { Library, BookLabel } from "./types/Book";

export const BOOKS: Library = [
    {
        title: "Book 1",
        author: "Author 1",
        year: 2022,
        genre: "Genre 1",
        labels: [],
    },
    {
        title: "Book 2",
        author: "Author 2",
        year: 2023,
        genre: "Genre 2",
        labels: [],
    },
    {
        title: "Book 3",
        author: "Author 3",
        year: 2024,
        genre: "Genre 3",
        labels: [],
    },
];


export const LABEL_CONFIG: Record<BookLabel, { name: string }> = {
  favorite: { name: "Favorite" },
  read: { name: "Read" },
  reading: { name: "Reading" },
  wishlist: { name: "Wishlist" },
};
