import DiffTool from "@/components/diff/DiffTool";
import { Helmet } from "react-helmet-async";

const DiffToolPage = () => {
  const canonical = typeof window !== 'undefined' ? window.location.href : '/';
  return (
    <>
      <Helmet>
        <title>Visual Text Diff Tool | Compare Files & Strings</title>
        <meta name="description" content="Compare two text files or strings with a visual diff. Paste or upload and see differences side-by-side or unified." />
        <link rel="canonical" href={canonical} />
        <meta name="robots" content="index,follow" />
        <meta property="og:title" content="Visual Text Diff Tool" />
        <meta property="og:description" content="Paste or upload text files and see a visual diff." />
      </Helmet>

      <main className="container py-8">
        <div className="mb-6">
          <h1 className="text-3xl font-bold tracking-tight">Visual Text Diff Tool</h1>
          <p className="mt-2 text-muted-foreground">
            Paste text or upload files to compare differences.
          </p>
        </div>
        <DiffTool />
      </main>

      <script type="application/ld+json">
        {JSON.stringify({
          "@context": "https://schema.org",
          "@type": "SoftwareApplication",
          name: "Visual Text Diff Tool",
          applicationCategory: "DeveloperApplication",
          operatingSystem: "Web",
          description: "Compare two text files or strings with a visual diff."
        })}
      </script>
    </>
  );
};

export default DiffToolPage;