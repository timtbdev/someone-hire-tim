import { Suspense } from "react";
import { unstable_cache } from "next/cache";
import { TweetSkeleton, EmbeddedTweet, TweetNotFound } from "react-tweet";
import { getTweet as _getTweet } from "react-tweet/api";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { Twitter } from "lucide-react";

const getTweet = unstable_cache(
  async (id: string) => _getTweet(id),
  ["tweet"],
  { revalidate: 3600 * 24 }
);

const TweetPage = async ({ id }: { id: string }) => {
  try {
    const tweet = await getTweet(id);
    return tweet ? <EmbeddedTweet tweet={tweet} /> : <TweetNotFound />;
  } catch (error) {
    console.error(error);
    return <TweetNotFound error={error} />;
  }
};

export default function Home() {
  const tweetText = encodeURIComponent("Someone hire Tim! @hire_tim_com");
  const tweetUrl = `https://twitter.com/intent/tweet?text=${tweetText}`;

  return (
    <main className="mx-auto max-w-7xl text-center justify-center items-center">
      <h1 className="text-4xl font-bold mt-10">Shoutouts on X:</h1>
      <p className="text-2xl font-semibold mt-4 text-gray-600">
        &quot;Someone hire Tim!&quot;
      </p>
      <div className="flex gap-4 justify-center mt-4">
        <Button asChild>
          <Link href="https://x.com/hire_tim_com">
            <Twitter className="w-4 h-4 mr-2" />
            Follow
          </Link>
        </Button>
        <Button asChild variant="outline">
          <Link href={tweetUrl} target="_blank" rel="noopener noreferrer">
            <Twitter className="w-4 h-4 mr-2" />
            Share Tweet
          </Link>
        </Button>
      </div>
      <div className="mx-auto w-full mt-4 flex flex-col justify-center items-center">
        <Suspense fallback={<TweetSkeleton />}>
          <TweetPage id="1930094628885471387" />
        </Suspense>
        <Suspense fallback={<TweetSkeleton />}>
          <TweetPage id="1916331166984245599" />
        </Suspense>
      </div>
    </main>
  );
}
