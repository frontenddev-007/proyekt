import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "react-toastify";
import { useUserStore } from "../../store/user.store";
import { useUpdateProfile } from "../../hooks/api/useUpdateProfile";

interface EditProfileForm {
  fullName: string;
  username: string;
  email: string;
  phone: string;
  bio: string;
  country: string;
  avatar?: FileList;
}

function EditProfile() {
  const user = useUserStore((state) => state.user);
  const setUser = useUserStore((state) => state.setUser);
  const { mutateAsync, isPending, isSuccess, isError } = useUpdateProfile();
  const [avatarPreview, setAvatarPreview] = useState<string>(
    user?.avatar ?? "",
  );
  const form = useForm<EditProfileForm>({
    defaultValues: {
      fullName: user?.fullName ?? "",
      username: user?.username ?? "",
      email: user?.email ?? "",
      phone: user?.phone ?? "",
      bio: user?.bio ?? "",
      country: user?.country ?? "",
      avatar: undefined,
    },
  });

  const avatarFile = form.watch("avatar")?.[0];

  useEffect(() => {
    if (user) {
      form.reset({
        fullName: user.fullName,
        username: user.username,
        email: user.email,
        phone: user.phone ?? "",
        bio: user.bio ?? "",
        country: user.country ?? "",
        avatar: undefined,
      });
      setAvatarPreview(user.avatar ?? "");
    }
  }, [user]);

  useEffect(() => {
    if (avatarFile) {
      const preview = URL.createObjectURL(avatarFile);
      setAvatarPreview(preview);
      return () => URL.revokeObjectURL(preview);
    }
  }, [avatarFile]);

  useEffect(() => {
    if (user) {
      form.reset({
        fullName: user.fullName,
        username: user.username,
        email: user.email,
        phone: user.phone ?? "",
        bio: user.bio ?? "",
        country: user.country ?? "",
      });
    }
  }, [user]);

  useEffect(() => {
    if (isSuccess) {
      toast.success("Profile updated successfully");
    }
    if (isError) {
      toast.error("Unable to update profile");
    }
  }, [isSuccess, isError]);

  const onSubmit = async (values: EditProfileForm) => {
    const payload = {
      fullName: values.fullName,
      username: values.username,
      email: values.email,
      phone: values.phone,
      bio: values.bio,
      country: values.country,
      avatar: values.avatar?.[0],
    };

    const updatedUser = await mutateAsync(payload);
    if (updatedUser) {
      setUser(updatedUser);
    }
  };

  if (!user) {
    return <div className="text-gray-600">Loading profile…</div>;
  }

  return (
    <div>
      <h1 className="text-2xl font-bold text-gray-800 mb-1">Edit Profile</h1>
      <p className="text-sm text-gray-400 mb-6">
        Update your personal information
      </p>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="grid gap-4 max-w-4xl"
      >
        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div className="flex items-center gap-4">
            <div className="w-28 h-28 rounded-full bg-slate-100 overflow-hidden border border-gray-200 flex items-center justify-center">
              {avatarPreview ? (
                <img
                  src={avatarPreview}
                  alt="Avatar preview"
                  className="w-full h-full object-cover"
                />
              ) : (
                <span className="text-3xl text-gray-500">
                  {user?.fullName?.[0] ?? user?.username?.[0] ?? "U"}
                </span>
              )}
            </div>
            <label className="cursor-pointer text-sm text-[#2A3D33] font-medium">
              Upload photo
              <input
                type="file"
                accept="image/*"
                {...form.register("avatar")}
                className="hidden"
              />
            </label>
          </div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-medium text-gray-500 mb-1">
              Full name
            </label>
            <input
              {...form.register("fullName")}
              className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm text-gray-800 focus:outline-none focus:ring-2 focus:ring-green-300"
            />
          </div>
          <div>
            <label className="block text-xs font-medium text-gray-500 mb-1">
              Username
            </label>
            <input
              {...form.register("username")}
              className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm text-gray-800 focus:outline-none focus:ring-2 focus:ring-green-300"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-medium text-gray-500 mb-1">
              Email address
            </label>
            <input
              type="email"
              {...form.register("email")}
              className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm text-gray-800 focus:outline-none focus:ring-2 focus:ring-green-300"
            />
          </div>
          <div>
            <label className="block text-xs font-medium text-gray-500 mb-1">
              Phone
            </label>
            <input
              {...form.register("phone")}
              className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm text-gray-800 focus:outline-none focus:ring-2 focus:ring-green-300"
            />
          </div>
        </div>

        <div>
          <label className="block text-xs font-medium text-gray-500 mb-1">
            Bio
          </label>
          <textarea
            {...form.register("bio")}
            rows={4}
            className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm text-gray-800 focus:outline-none focus:ring-2 focus:ring-green-300 resize-none"
          />
        </div>

        <div>
          <label className="block text-xs font-medium text-gray-500 mb-1">
            Country
          </label>
          <input
            {...form.register("country")}
            className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm text-gray-800 focus:outline-none focus:ring-2 focus:ring-green-300"
          />
        </div>

        <div className="flex items-center gap-3 pt-2">
          <button
            type="submit"
            disabled={isPending}
            className="bg-green-700 hover:bg-green-800 text-white text-sm font-medium px-5 py-2 rounded-lg transition-colors disabled:opacity-60"
          >
            {isPending ? "Saving..." : "Save Changes"}
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

export default EditProfile;
