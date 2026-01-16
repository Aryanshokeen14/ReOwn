import React from "react";
import { useRouter, usePathname } from "next/navigation";
import { useSelector, useDispatch } from "react-redux";
import { reset } from "@/config/redux/reducer/authReducer";

export default function NavbarComponent() {
  const router = useRouter();
  const pathname = usePathname();
  const dispatch = useDispatch();
  const authState = useSelector((state) => state.auth);

  const isLandingPage = pathname === "/";

  return (
    <nav
      className={`w-full ${
        isLandingPage
          ? "bg-transparent absolute top-0 left-0"
          : "bg-white border-b shadow-sm"
      }`}
    >
      <div className="max-w-7xl mx-auto px-6 py-4 flex justify-between items-center">
        <h1
          onClick={() =>
            authState.profileFetched
              ? router.push("/dashboard")
              : router.push("/")
          }
          className={`text-2xl font-bold cursor-pointer ${
            isLandingPage ? "text-white" : "text-blue-600"
          }`}
        >
          ReOwn
        </h1>

        <div>
          {authState.profileFetched ? (
            <div className="flex items-center gap-6">
              <p
                onClick={() => router.push("/dashboard")}
                className="cursor-pointer font-medium text-gray-700 hover:text-blue-600"
              >
                Home
              </p>

              <p
                onClick={() => router.push("/profile")}
                className="cursor-pointer font-medium text-gray-700 hover:text-blue-600"
              >
                Profile
              </p>

              <p
                onClick={() => {
                  localStorage.removeItem("token");
                  dispatch(reset());
                  router.push("/login");
                }}
                className="cursor-pointer font-medium text-red-500 hover:text-red-600"
              >
                Logout
              </p>
            </div>
          ) : (
            <button
              onClick={() => router.push("/login")}
              className={`px-5 py-2 rounded-lg font-medium transition ${
                isLandingPage
                  ? "bg-white text-black hover:bg-gray-200"
                  : "bg-blue-600 text-white hover:bg-blue-700"
              }`}
            >
              Be part of ReOwn
            </button>
          )}
        </div>
      </div>
    </nav>
  );
}
