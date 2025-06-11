import { Suspense } from "react";
import { unstable_cache } from "next/cache";
import { TweetSkeleton, EmbeddedTweet, TweetNotFound } from "react-tweet";
import { getTweet as _getTweet } from "react-tweet/api";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { FaSquareXTwitter as XIcon } from "react-icons/fa6";

// Optimize cache configuration with better error handling and revalidation
const getTweet = unstable_cache(
  async (id: string) => {
    try {
      const tweet = await _getTweet(id);
      return tweet;
    } catch (error) {
      console.error(`Failed to fetch tweet ${id}:`, error);
      return null;
    }
  },
  ["tweet"],
  {
    revalidate: 3600 * 24, // 24 hours
    tags: ["tweets"], // Add cache tag for better invalidation control
  }
);

// Separate component for tweet display with error boundary
const TweetPage = async ({ id }: { id: string }) => {
  const tweet = await getTweet(id);
  if (!tweet) {
    return <TweetNotFound />;
  }
  return <EmbeddedTweet tweet={tweet} />;
};

// Memoized static content
const TWEET_IDS = [
  "1930094628885471387",
  "1916331166984245599",
  "1932667733964886198",
] as const;
const TWEET_TEXT = "Someone hire Tim! @hire_tim_com";

// Optimized main component
export default function Home() {
  const tweetText = encodeURIComponent(TWEET_TEXT);
  const tweetUrl = `https://twitter.com/intent/tweet?text=${tweetText}`;

  return (
    <main className="mx-auto max-w-7xl text-center justify-center items-center">
      <h1 className="text-4xl font-bold mt-10">Shoutouts on X:</h1>
      <p className="text-2xl font-semibold mt-4 text-gray-600">
        &quot;Someone hire Tim!&quot;
      </p>
      <p className="text-md text-gray-500 mt-2 italic font-medium">
        Give me a shoutout, and I&apos;ll feature your post here!
      </p>

      {/* Action buttons */}
      <div className="flex gap-4 justify-center mt-4">
        <Button asChild>
          <Link href="https://x.com/hire_tim_com">
            <XIcon className="size-6 mr-2" />
            Follow Me
          </Link>
        </Button>
        <Button asChild variant="outline">
          <Link href={tweetUrl} target="_blank" rel="noopener noreferrer">
            <XIcon className="size-6 mr-2" />
            Give a Shoutout
          </Link>
        </Button>
      </div>

      {/* Tweets section with parallel loading */}
      <div className="mx-auto w-full mt-4 flex flex-col justify-center items-center gap-4">
        {TWEET_IDS.map((id) => (
          <Suspense key={id} fallback={<TweetSkeleton />}>
            <TweetPage id={id} />
          </Suspense>
        ))}
      </div>
    </main>
  );
}
