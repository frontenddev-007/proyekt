import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { toast } from "react-toastify";
import { useChangePassword } from "../../hooks/api/useChangePassword";

interface ChangePasswordForm {
  currentPassword: string;
  newPassword: string;
  confirmNewPassword: string;
}

function ChangePassword() {
  const { mutateAsync, isPending, isSuccess, isError } = useChangePassword();
  const form = useForm<ChangePasswordForm>({
    defaultValues: {
      currentPassword: "",
      newPassword: "",
      confirmNewPassword: "",
    },
  });

  useEffect(() => {
    if (isSuccess) {
      toast.success("Password updated successfully");
      form.reset();
    }
    if (isError) {
      toast.error("Unable to update password");
    }
  }, [isSuccess, isError]);

  const onSubmit = async (values: ChangePasswordForm) => {
    if (values.newPassword !== values.confirmNewPassword) {
      toast.error("New passwords do not match");
      return;
    }

    await mutateAsync({
      currentPassword: values.currentPassword,
      newPassword: values.newPassword,
      confirmPassword: values.confirmNewPassword,
    });
  };

  return (
    <div>
      <h1 className="text-2xl font-bold text-gray-800 mb-1">Change Password</h1>
      <p className="text-sm text-gray-400 mb-6">
        Keep your account secure with a strong password
      </p>

      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="flex flex-col gap-4 max-w-md"
      >
        <div>
          <label className="block text-xs font-medium text-gray-500 mb-1">
            Current password
          </label>
          <input
            type="password"
            {...form.register("currentPassword", { required: true })}
            placeholder="Enter current password"
            className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm text-gray-800 focus:outline-none focus:ring-2 focus:ring-green-300"
          />
        </div>

        <div>
          <label className="block text-xs font-medium text-gray-500 mb-1">
            New password
          </label>
          <input
            type="password"
            {...form.register("newPassword", { required: true })}
            placeholder="Enter new password"
            className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm text-gray-800 focus:outline-none focus:ring-2 focus:ring-green-300"
          />
        </div>

        <div>
          <label className="block text-xs font-medium text-gray-500 mb-1">
            Confirm new password
          </label>
          <input
            type="password"
            {...form.register("confirmNewPassword", { required: true })}
            placeholder="Re-enter new password"
            className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm text-gray-800 focus:outline-none focus:ring-2 focus:ring-green-300"
          />
        </div>

        <div className="flex items-center gap-3 pt-2">
          <button
            type="submit"
            disabled={isPending}
            className="bg-green-700 hover:bg-green-800 text-white text-sm font-medium px-5 py-2 rounded-lg transition-colors disabled:opacity-60"
          >
            {isPending ? "Updating..." : "Update Password"}
          </button>
          <button
            type="button"
            onClick={() => form.reset()}
            className="bg-gray-100 text-gray-700 text-sm font-medium px-5 py-2 rounded-lg"
          >
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
}

export default ChangePassword;
