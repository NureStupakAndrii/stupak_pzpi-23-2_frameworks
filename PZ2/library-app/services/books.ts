export async function SearchBook(query: string) {
    try {
        if (!query.trim()) return [];

        const response = await fetch(`https://www.googleapis.com/books/v1/volumes?q=${query}`, {
            headers: {
                "x-goog-api-key": import.meta.env.VITE_GOOGLE_BOOKS_API_KEY,
            },
        });

        if (!response.ok) {
            throw new Error("Failed to fetch books");
        }

        const data = await response.json();
        return data;
    } catch (error) {
        console.error("Error searching for books:", error);
        return [];
    }
}