export type GoogleBook = {
  id: string;
  volumeInfo: {
    title: string;
    authors?: string[];
    publishedDate?: string;
    categories?: string[];
    imageLinks?: {
      thumbnail?: string;
    };
  };
}