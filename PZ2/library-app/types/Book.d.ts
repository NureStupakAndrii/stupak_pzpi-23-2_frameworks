export type BookLabel = "favorite" | "read" | "wishlist" | "reading";

export type Book = {
  title: string;
  author: string;
  year: number;
  genre: string;
  labels: BookLabel[];
};

export type Library = Book[];