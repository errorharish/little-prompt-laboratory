import { createFileRoute, notFound } from "@tanstack/react-router";
import { pageBySlug } from "@/lib/eo/registry";
import { PAGE_COMPONENTS } from "@/components/eo/pageMap";

export const Route = createFileRoute("/$page")({
  loader: ({ params }) => {
    const p = pageBySlug(params.page);
    if (!p || !PAGE_COMPONENTS[params.page]) throw notFound();
    return { title: p.title, description: p.description, suite: p.suite };
  },
  head: ({ loaderData }) => {
    const title = loaderData ? `${loaderData.title} — ERROR OPTIMIZER ${loaderData.suite}` : "Unavailable — ERROR OPTIMIZER";
    const description = loaderData?.description ?? "Page not found.";
    return {
      meta: [
        { title },
        { name: "description", content: description },
        { property: "og:title", content: title },
        { property: "og:description", content: description },
        ...(loaderData ? [] : [{ name: "robots", content: "noindex" }]),
      ],
    };
  },
  component: PageRoute,
});

function PageRoute() {
  const { page } = Route.useParams();
  const C = PAGE_COMPONENTS[page];
  return <>{C ? C() : null}</>;
}
