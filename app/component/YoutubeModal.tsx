"use client";

import axios from "axios";
import { useSession } from "next-auth/react";
import Image from "next/image";
import { useState } from "react";

export const YoutubeModal = () => {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState([]);
  const { data: session, status } = useSession();

  const isLoggedIn = !!session;

  const handleSearch = async () => {
    return;

    // if (!query || !session) return;

    // try {
    //   const response = await axios.get(
    //     "https://www.googleapis.com/youtube/v3/search",
    //     {
    //       params: {
    //         part: "snippet",
    //         maxResults: 10,
    //         q: query,
    //         key: process.env.YOUTUBE_API_KEY,
    //       },
    //       headers: {
    //         Authorization: `Bearer ${session.accessToken}`,
    //       },
    //     }
    //   );
    //   console.log("response", response);
    // } catch (error: any) {
    //   console.error(
    //     "Error fetching playlists:",
    //     error.response ? error.response.data : error.message
    //   );
    // }
  };

  return isLoggedIn ? (
    <div className="w-[350px] h-[200px] absolute border-4 bottom-10 right-10 rounded-3xl border-white bg-black flex flex-col px-2 z-10">
      <div className="flex h-[50px] items-center gap-2">
        <Image src="/youtube.png" width={50} height={40} alt="youtube icon" />
        <div>
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search for music"
          />
          <button onClick={handleSearch}>Search</button>
        </div>
      </div>
      <div>contents</div>
    </div>
  ) : (
    <></>
  );
};
