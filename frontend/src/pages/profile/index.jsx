import UserLayout from "@/layout/userLayout";
import React, { useEffect, useState } from "react";
import DashboardLayout from "@/layout/DashboardLayout";
import { clientServer, BASE_URL } from "@/config";
import { useDispatch, useSelector } from "react-redux";
import { getAllPosts } from "@/config/redux/action/postAction";
import { getAboutUser } from "@/config/redux/action/authAction";

export default function ProfilePage() {
  const authState = useSelector((state) => state.auth);
  const postReducer = useSelector((state) => state.postReducer);
  const dispatch = useDispatch();

  const [userProfile, setUserProfile] = useState({});
  const [userPosts, setUserPosts] = useState([]);

  useEffect(() => {
    dispatch(getAboutUser({ token: localStorage.getItem("token") }));
    dispatch(getAllPosts());
  }, []);

  useEffect(() => {
    if (authState.user) {
      setUserProfile(authState.user);
      const posts = postReducer.posts.filter(
        (post) => post.userId.username === authState.user.userId.username
      );
      setUserPosts(posts);
    }
  }, [authState.user, postReducer.posts]);

  const updateProfilePicture = async (file) => {
    if (!file) return;
    const formData = new FormData();
    formData.append("profile_picture", file);
    formData.append("token", localStorage.getItem("token"));

    await clientServer.post("/update_profile_picture", formData, {
      headers: { "Content-Type": "multipart/form-data" },
    });

    dispatch(getAboutUser({ token: localStorage.getItem("token") }));
  };

  const updateProfileData = async () => {
    await clientServer.post("/user_update", {
      token: localStorage.getItem("token"),
      name: userProfile.userId.name,
    });

    await clientServer.post("/update_profile_data", {
      token: localStorage.getItem("token"),
      location: userProfile.location,
    });

    dispatch(getAboutUser({ token: localStorage.getItem("token") }));
  };

  if (!authState.user || !userProfile.userId) return null;

  return (
    <UserLayout>
      <DashboardLayout>
        <div className="max-w-4xl mx-auto px-4 py-8">
          <div className="bg-white rounded-xl shadow p-6 flex flex-col md:flex-row gap-8">
            <div className="flex flex-col items-center">
              <label htmlFor="profilePictureUpload" className="cursor-pointer">
                <img
                  src={`${BASE_URL}/${userProfile.userId.profilePicture}`}
                  alt="Profile"
                  className="w-32 h-32 rounded-full object-cover border"
                />
                <p className="text-sm text-blue-600 mt-2 text-center">
                  Change Picture
                </p>
              </label>
              <input
                hidden
                type="file"
                id="profilePictureUpload"
                accept="image/*"
                onChange={(e) => updateProfilePicture(e.target.files[0])}
              />
            </div>

            <div className="flex-1">
              <h2 className="text-xl font-semibold mb-6">
                Profile Information
              </h2>

              <div className="space-y-4">
                <div>
                  <label className="block text-sm text-gray-500 mb-1">
                    Name
                  </label>
                  <input
                    type="text"
                    value={userProfile.userId.name || ""}
                    onChange={(e) =>
                      setUserProfile({
                        ...userProfile,
                        userId: {
                          ...userProfile.userId,
                          name: e.target.value,
                        },
                      })
                    }
                    className="w-full border rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                <div>
                  <label className="block text-sm text-gray-500 mb-1">
                    Location
                  </label>
                  <input
                    type="text"
                    value={userProfile.location || ""}
                    onChange={(e) =>
                      setUserProfile({
                        ...userProfile,
                        location: e.target.value,
                      })
                    }
                    className="w-full border rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                <div>
                  <label className="block text-sm text-gray-500 mb-1">
                    Email
                  </label>
                  <input
                    type="text"
                    value={userProfile.userId.email || ""}
                    disabled
                    className="w-full border rounded-lg px-4 py-2 bg-gray-100 cursor-not-allowed"
                  />
                </div>

                <div>
                  <label className="block text-sm text-gray-500 mb-1">
                    Username
                  </label>
                  <input
                    type="text"
                    value={`@${userProfile.userId.username}`}
                    disabled
                    className="w-full border rounded-lg px-4 py-2 bg-gray-100 cursor-not-allowed"
                  />
                </div>

                <button
                  onClick={updateProfileData}
                  className="mt-6 bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition"
                >
                  Update Profile
                </button>
              </div>
            </div>
          </div>
        </div>
      </DashboardLayout>
    </UserLayout>
  );
}
