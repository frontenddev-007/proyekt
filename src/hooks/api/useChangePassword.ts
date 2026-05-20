import { useMutation } from "@tanstack/react-query";
import { instance } from "../../lib/axios";

interface ChangePasswordDto {
  currentPassword: string;
  newPassword: string;
  confirmPassword: string;
}

export const useChangePassword = () => {
  return useMutation({
    mutationFn: async (payload: ChangePasswordDto) => {
      const token = localStorage.getItem("token");
      return await instance.patch("/users/change-password", payload, {
        headers: {
          Authorization: token ? `Bearer ${token}` : "",
          "Content-Type": "application/json",
        },
      });
    },
  });
};
