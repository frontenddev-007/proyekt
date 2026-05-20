import Header from "../header";
import Footer from "../footer";
import { Outlet } from "react-router-dom";
import { useGetProfile } from "../../hooks/api/useGetProfile";
import { useEffect } from "react";
import { useUserStore } from "../../store/user.store";
const RootLayout = () => {
  const { data, isSuccess } = useGetProfile();
  const setUser = useUserStore((state) => state.setUser);

  useEffect(() => {
    if (isSuccess && data) {
      setUser(data);
    }
  }, [isSuccess, data, setUser]);
  return (
    <>
      <Header />
      <main>
        <Outlet />
      </main>
      <Footer />
    </>
  );
};

export default RootLayout;
