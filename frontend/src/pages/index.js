import { Inter } from "next/font/google";
import { useRouter } from "next/navigation";
import UserLayout from "../layout/userLayout";

const inter = Inter({ subsets: ["latin"] });

export default function Home() {
  const router = useRouter();

  return (
    <UserLayout>
      <div className={`min-h-screen bg-gray-900 text-white ${inter.className}`}>
        <div className="max-w-6xl mx-auto px-6 py-24 flex flex-col justify-center">
          <div className="max-w-3xl">
            <p className="text-sm uppercase tracking-widest text-gray-400 mb-4">
              Buy smarter. Sell faster.
            </p>

            <p className="text-4xl md:text-5xl font-bold leading-tight mb-6">
              Give Your Goods a Second Life with{" "}
              <span className="text-blue-400">ReOwn</span>
            </p>

            <p className="text-lg text-gray-300 mb-4">
              ReOwn is a trusted marketplace where pre-owned items find new
              owners. Post your listings in seconds or explore quality used
              products at prices that make sense.
            </p>

            <p className="text-lg text-gray-300 mb-4">
              Whether you are decluttering your space or hunting for a great
              deal, ReOwn connects you directly with real people — no middlemen,
              no hassle.
            </p>

            <p className="text-lg text-gray-300 mb-8">
              Simple listings, transparent profiles, and a community built on
              trust. This is resale, done right.
            </p>

            <button
              onClick={() => router.push("/login")}
              className="bg-blue-600 hover:bg-blue-700 transition px-8 py-3 rounded-lg font-semibold text-white"
            >
              Join Now
            </button>
          </div>
        </div>
      </div>
    </UserLayout>
  );
}
