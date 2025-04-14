'use client';
import Link from "next/link";
export default function Home(){

  return (

    
    <div className="max-w-5xl mx-auto px-4 py-10">
      <h1 className="text-5xl font-extrabold mb-10 text-center text-white text-shadow-lg">
        Welcome to Synkro
      </h1>

      {/* Navigation Buttons */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        <Link
          href={`/my-events`}
          className="bg-gradient-to-r from-blue-500 to-blue-700 hover:from-blue-600 hover:to-blue-800 text-white font-semibold py-4 px-6 rounded-xl shadow-lg text-center transition transform hover:scale-105"
        >
          Mes evenements
        </Link>
        <Link
          href="/mes-invitations"
          className="bg-gradient-to-r from-purple-500 to-purple-700 hover:from-purple-600 hover:to-purple-800 text-white font-semibold py-4 px-6 rounded-xl shadow-lg text-center transition transform hover:scale-105"
        >
          Mes invitations
        </Link>
        <Link
          href="/profil"
          className="bg-gradient-to-r from-teal-500 to-teal-700 hover:from-teal-600 hover:to-teal-800 text-white font-semibold py-4 px-6 rounded-xl shadow-lg text-center transition transform hover:scale-105"
        >
          Mon profil
        </Link>
      </div>
    </div>
  );
}
