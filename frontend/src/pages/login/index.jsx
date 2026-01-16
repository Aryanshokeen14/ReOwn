import UserLayout from "../../layout/userLayout";
import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useSelector, useDispatch } from "react-redux";
import { loginUser, registerUser } from "@/config/redux/action/authAction";
import { emptyMessage } from "@/config/redux/reducer/authReducer";

function LoginComponent() {
  const authState = useSelector((state) => state.auth);
  const router = useRouter();
  const dispatch = useDispatch();

  const [userLoginMethod, setUserLoginMethod] = useState(false);
  const [password, setPassword] = useState("");
  const [email, setEmail] = useState("");
  const [username, setUsername] = useState("");
  const [name, setName] = useState("");

  useEffect(() => {
    if (authState.loggedIn || localStorage.getItem("token")) {
      router.push("/dashboard");
    }
  }, [authState.loggedIn]);

  useEffect(() => {
    dispatch(emptyMessage());
  }, [userLoginMethod]);

  const handleRegister = () => {
    dispatch(registerUser({ username, password, email, name }));
  };

  const handleLogin = () => {
    dispatch(loginUser({ email, password }));
  };

  return (
    <UserLayout>
      <div className="min-h-screen flex items-center justify-center bg-gray-100 px-4">
        <div className="bg-white rounded-2xl shadow-lg flex flex-col md:flex-row w-full max-w-4xl overflow-hidden">
          <div className="w-full md:w-2/3 p-8">
            <h2 className="text-2xl font-semibold mb-4">
              {userLoginMethod ? "Sign In" : "Sign Up"}
            </h2>

            {authState.message?.message && (
              <p
                className={`mb-4 text-sm ${
                  authState.isError ? "text-red-500" : "text-green-600"
                }`}
              >
                {authState.message.message}
              </p>
            )}

            <div className="space-y-4">
              {!userLoginMethod && (
                <div className="flex gap-3">
                  <input
                    type="text"
                    placeholder="Username"
                    onChange={(e) => setUsername(e.target.value)}
                    className="w-1/2 border rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                  <input
                    type="text"
                    placeholder="Name"
                    onChange={(e) => setName(e.target.value)}
                    className="w-1/2 border rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              )}

              <input
                type="email"
                placeholder="Email"
                onChange={(e) => setEmail(e.target.value)}
                className="w-full border rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />

              <input
                type="password"
                placeholder="Password"
                onChange={(e) => setPassword(e.target.value)}
                className="w-full border rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />

              <button
                onClick={() =>
                  userLoginMethod ? handleLogin() : handleRegister()
                }
                className="w-full border border-blue-600 text-blue-600 py-2 rounded-lg font-medium hover:bg-blue-600 hover:text-white transition"
              >
                {userLoginMethod ? "Sign In" : "Sign Up"}
              </button>
            </div>
          </div>

          <div className="w-full md:w-1/3 bg-blue-600 text-white flex flex-col items-center justify-center p-6 text-center">
            <p className="mb-4">
              {userLoginMethod
                ? "Don't have an account?"
                : "Already have an account?"}
            </p>

            <button
              onClick={() => setUserLoginMethod(!userLoginMethod)}
              className="bg-white text-blue-600 px-6 py-2 rounded-lg font-medium hover:bg-gray-100 transition"
            >
              {userLoginMethod ? "Switch to Sign Up" : "Switch to Sign In"}
            </button>
          </div>
        </div>
      </div>
    </UserLayout>
  );
}

export default LoginComponent;
