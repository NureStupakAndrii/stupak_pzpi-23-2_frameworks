import { useEffect, useState } from "react";
import { SearchBook } from "../services/books";

export function useSearchBooks(query: string) {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    async function fetchBooks() {
      try {
        setLoading(true);
        setError(null);

        const result = await SearchBook(query);
        setData(result?.items || []);
      } catch (error) {
        setError(error as Error);
        setData([]);
      } finally {
        setLoading(false);
      }
    }

    fetchBooks();
  }, [query]);

  return { data, loading, error };
}