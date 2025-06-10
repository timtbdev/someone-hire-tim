import { truncateDescription, truncateTitle } from "@/lib/seo";
import type { HeadType } from "@/types";

const HEAD: HeadType[] = [
  {
    page: "Home",
    title: truncateTitle("Someone hire Tim!"),
    description: truncateDescription(
      "Shoutouts on X: &quot;Someone hire Tim!&quot;"
    ),
    slug: "/",
  },
];

export default HEAD;
