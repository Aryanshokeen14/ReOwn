import React, { useEffect } from "react";
import { useRouter } from "next/navigation";
import { setTokenIsThere } from "@/config/redux/reducer/authReducer";
import { useDispatch, useSelector } from "react-redux";

export default function Dashboard({ children }) {
  const router = useRouter();
  const dispatch = useDispatch();
  const authState = useSelector((state) => state.auth);

  useEffect(() => {
    if (localStorage.getItem("token") === null) {
      router.push("/login");
    }
    dispatch(setTokenIsThere());
  }, []);

  return <div>{children}</div>;
}
