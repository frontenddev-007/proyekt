import { useQuery } from "@tanstack/react-query";
import axios from "axios";

export interface IBookDetail {
  id: string;
  title: string;
  author: string | { fullName: string };
  rating: number;
  price: number;
  favorite?: boolean;
  description?: string;
  genre?: string;
  image?: string;
  publisher?: string;
  publishedDate?: string;
  pages?: number;
  language?: string;
}

export const useGetBookDetail = (bookId: string) => {
  const { data, isPending, isError, error } = useQuery({
    queryKey: ["book", bookId],
    queryFn: async () => {
      const response = await axios.get(
        `http://localhost:3001/api/books/${bookId}`,
        {
          headers: {
            "Content-Type": "application/json",
          },
        },
      );

      return response.data;
    },
    enabled: !!bookId,
  });

  const book: IBookDetail = Array.isArray(data)
    ? data[0]
    : data?.data || data || {};

  return {
    book,
    isPending,
    isError,
    error,
  };
};
