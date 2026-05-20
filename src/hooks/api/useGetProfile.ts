import { useQuery } from "@tanstack/react-query";
import { instance } from "../../lib/axios";

export const useGetProfile = () => {
  const token =
    typeof window !== "undefined" ? localStorage.getItem("token") : null;

  const getProfile = async () => {
    if (!token) return null;
    const response = await instance.get("/users/profile", {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return response.data?.data ?? response.data;
  };

  const { data, isSuccess, isError } = useQuery({
    queryKey: ["profile", token],
    queryFn: getProfile,
    retry: false,
    enabled: !!token,
  });

  return { data, isSuccess, isError };
};
