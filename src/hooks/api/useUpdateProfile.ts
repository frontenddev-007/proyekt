import { useMutation, useQueryClient } from "@tanstack/react-query";
import { instance } from "../../lib/axios";

interface UpdateProfilePayload {
  fullName: string;
  username: string;
  email: string;
  bio: string;
  phone: string;
  country: string;
  avatar?: File;
}

export const useUpdateProfile = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (payload: UpdateProfilePayload) => {
      const token = localStorage.getItem("token");
      const formData = new FormData();
      formData.append("fullName", payload.fullName);
      formData.append("username", payload.username);
      formData.append("email", payload.email);
      formData.append("bio", payload.bio);
      formData.append("phone", payload.phone);
      formData.append("country", payload.country);
      if (payload.avatar) {
        formData.append("avatar", payload.avatar);
      }

      const response = await instance.put("/users/profile", formData, {
        headers: {
          Authorization: token ? `Bearer ${token}` : "",
        },
      });

      return response.data?.data ?? response.data;
    },
    onSuccess: (user) => {
      queryClient.invalidateQueries({ queryKey: ["profile"] });
      queryClient.setQueryData(["profile"], user);
    },
  });
};
