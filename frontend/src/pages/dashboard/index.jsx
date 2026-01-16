import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useDispatch, useSelector } from "react-redux";
import {
  deletePost,
  getAllPosts,
  createPost,
} from "@/config/redux/action/postAction";
import { getAboutUser } from "@/config/redux/action/authAction";
import UserLayout from "../../layout/userLayout";
import DashboardLayout from "@/layout/DashboardLayout";
import { BASE_URL } from "@/config";
import { formatDistanceToNow } from "date-fns";

export default function Dashboard() {
  const router = useRouter();
  const dispatch = useDispatch();

  const authState = useSelector((state) => state.auth);
  const postState = useSelector((state) => state.postReducer);

  const [postContent, setPostContent] = useState("");
  const [fileContent, setFileContent] = useState(null);
  const [previewUrl, setPreviewUrl] = useState(null);
  const [activePostId, setActivePostId] = useState(null);
  const [fileError, setFileError] = useState("");

  const [, forceUpdate] = useState(0);

  const [searchTerm, setSearchTerm] = useState("");

  const filteredPosts = postState.posts.filter(
    (post) =>
      post.body?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      post.userId?.name?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  useEffect(() => {
    const interval = setInterval(() => {
      forceUpdate((prev) => prev + 1);
    }, 60000);

    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    if (authState.isTokenThere) {
      dispatch(getAllPosts());
      dispatch(getAboutUser({ token: localStorage.getItem("token") }));
    }
  }, [authState.isTokenThere]);

  const handleFileChange = (e) => {
    const file = e.target.files[0];

    if (!file) {
      setFileContent(null);
      setPreviewUrl(null);
      setFileError("");
      return;
    }

    if (!file.type.startsWith("image/")) {
      setFileError("Only image files are allowed (JPG, PNG, WEBP)");
      setFileContent(null);
      setPreviewUrl(null);
      return;
    }

    setFileError("");
    setFileContent(file);
    setPreviewUrl(URL.createObjectURL(file));
  };

  const handleUpload = async () => {
    if (!fileContent) return;
    await dispatch(createPost({ file: fileContent, body: postContent }));
    setPostContent("");
    setFileContent(null);
    setPreviewUrl(null);
    dispatch(getAllPosts());
  };

  if (!authState.user) {
    return (
      <UserLayout>
        <DashboardLayout>
          <p className="text-center text-gray-500 mt-10">Loading...</p>
        </DashboardLayout>
      </UserLayout>
    );
  }

  return (
    <UserLayout>
      <DashboardLayout>
        <div className="max-w-5xl mx-auto px-4 py-6">
          <div className="bg-white rounded-xl shadow p-4 flex gap-4 mb-8">
            <img
              src={`${BASE_URL}/${authState.user.userId.profilePicture}`}
              alt=""
              className="w-12 h-12 rounded-full object-cover"
            />

            <div className="flex-1">
              <textarea
                value={postContent}
                onChange={(e) => setPostContent(e.target.value)}
                placeholder="Post your listing"
                className="w-full border rounded-lg p-3 resize-none focus:outline-none focus:ring-2 focus:ring-blue-500"
              />

              {fileError && (
                <p className="text-red-500 text-sm mt-2">{fileError}</p>
              )}

              {previewUrl && (
                <img
                  src={previewUrl}
                  alt="Preview"
                  className="mt-3 w-40 h-40 object-cover rounded-lg border"
                />
              )}

              <div className="flex items-center justify-between mt-4">
                <label className="cursor-pointer text-blue-600 font-medium">
                  Upload Image
                  <input
                    type="file"
                    hidden
                    accept="image/*"
                    onChange={handleFileChange}
                  />
                </label>

                {postContent.length > 0 && fileContent && (
                  <button
                    onClick={handleUpload}
                    className="bg-blue-600 text-white px-5 py-2 rounded-lg hover:bg-blue-700"
                  >
                    Post
                  </button>
                )}
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow p-4 mb-6">
            <div className="flex flex-col md:flex-row gap-4">
              <input
                type="text"
                placeholder="Search listings..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="flex-1 border rounded-lg px-4 py-2"
              />

              <select className="border rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500">
                <option value="">All Categories</option>
                <option>Electronics</option>
                <option>Books</option>
                <option>Furniture</option>
                <option>Clothing</option>
              </select>

              <select className="border rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500">
                <option value="latest">Latest</option>
                <option value="oldest">Oldest</option>
              </select>
            </div>
          </div>

          <div className="space-y-6">
            {filteredPosts.length === 0 && (
              <p className="text-center text-gray-500">No listings found</p>
            )}

            {filteredPosts.map((post) => {
              let timeAgo = "just now";

              if (post.createdAt && !isNaN(new Date(post.createdAt))) {
                timeAgo = formatDistanceToNow(new Date(post.createdAt), {
                  addSuffix: true,
                });
              }

              return (
                <div
                  key={post._id}
                  className="bg-white rounded-xl shadow flex overflow-hidden"
                >
                  <div className="w-3/5 h-64 bg-gray-100 flex items-center justify-center">
                    <img
                      src={`${BASE_URL}/${post.media}`}
                      alt=""
                      className="max-h-full max-w-full object-contain"
                    />
                  </div>

                  <div className="w-2/5 p-4 flex flex-col justify-between">
                    <div>
                      <div className="flex justify-between items-start">
                        <div>
                          <p className="font-semibold">{post.userId.name}</p>
                          <p className="text-sm text-gray-500">
                            @{post.userId.username} · {timeAgo}
                          </p>
                        </div>

                        {post.userId._id === authState.user.userId._id && (
                          <button
                            onClick={() =>
                              setActivePostId(
                                activePostId === post._id ? null : post._id
                              )
                            }
                            className="text-xl text-gray-400"
                          >
                            …
                          </button>
                        )}
                      </div>

                      <p className="mt-4 text-gray-700">{post.body}</p>
                    </div>

                    {post.userId._id !== authState.user.userId._id && (
                      <button className="mt-3 w-full border border-green-600 text-green-600 py-2 rounded-lg hover:bg-green-600 hover:text-white transition font-medium">
                        Purchase
                      </button>
                    )}

                    {post.userId._id === authState.user.userId._id &&
                      activePostId === post._id && (
                        <button
                          onClick={async () => {
                            await dispatch(deletePost({ post_id: post._id }));
                            await dispatch(getAllPosts());
                            setActivePostId(null);
                          }}
                          className="mt-4 bg-red-500 text-white py-2 rounded-lg hover:bg-red-600"
                        >
                          Delete Listing
                        </button>
                      )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </DashboardLayout>
    </UserLayout>
  );
}
