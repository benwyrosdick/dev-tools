
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Helmet } from "react-helmet-async";
import JsonTreeViewer from "@/components/JsonTreeViewer";

const JsonViewer = () => {
  const [jsonInput, setJsonInput] = useState("");
  const [parsedJson, setParsedJson] = useState<any>(null);
  const [error, setError] = useState("");
  const [activeTab, setActiveTab] = useState("input");
  const [selectedAction, setSelectedAction] = useState<string | null>(null);

  const formatJson = () => {
    try {
      const parsed = JSON.parse(jsonInput);
      const formatted = JSON.stringify(parsed, null, 2);
      setJsonInput(formatted);
      setParsedJson(parsed);
      setError("");
      setActiveTab("input");
      setSelectedAction("format");
    } catch (err) {
      setError("Invalid JSON format");
      setParsedJson(null);
    }
  };

  const minifyJson = () => {
    try {
      const parsed = JSON.parse(jsonInput);
      const minified = JSON.stringify(parsed);
      setJsonInput(minified);
      setParsedJson(parsed);
      setError("");
      setActiveTab("input");
      setSelectedAction("minify");
    } catch (err) {
      setError("Invalid JSON format");
      setParsedJson(null);
    }
  };

  const showTreeView = () => {
    try {
      if (jsonInput) {
        const parsed = JSON.parse(jsonInput);
        setParsedJson(parsed);
        setError("");
        setActiveTab("tree");
        setSelectedAction("tree");
      }
    } catch (err) {
      setError("Invalid JSON format");
      setParsedJson(null);
    }
  };

  return (
    <>
      <Helmet>
        <title>JSON Viewer & Formatter | Text Tools</title>
        <meta name="description" content="Format, validate, and beautify JSON data with our online JSON viewer tool." />
      </Helmet>

      <main className="container py-8 h-screen flex flex-col">
        <div className="mb-6">
          <h1 className="text-3xl font-bold tracking-tight">JSON Viewer</h1>
          <p className="mt-2 text-muted-foreground">
            Format, validate, and beautify your JSON data.
          </p>
        </div>

        <div className="space-y-6 flex-1 flex flex-col min-h-0">
          <Card className="flex flex-col flex-1 border-primary/20 shadow-lg shadow-primary/5">
            <CardHeader>
              <CardTitle>JSON Tools</CardTitle>
              <div className="flex gap-2">
                <Button onClick={formatJson} variant={selectedAction === "format" ? "default" : "outline"} className={selectedAction === "format" ? "bg-primary hover:bg-primary/90" : ""}>Format</Button>
                <Button onClick={minifyJson} variant={selectedAction === "minify" ? "default" : "outline"} className={selectedAction === "minify" ? "bg-secondary hover:bg-secondary/90" : ""}>Minify</Button>
                <Button onClick={showTreeView} variant={selectedAction === "tree" ? "default" : "outline"} className={selectedAction === "tree" ? "bg-accent hover:bg-accent/90" : ""}>Tree View</Button>
              </div>
              {error && <p className="text-sm text-destructive">{error}</p>}
            </CardHeader>
            <CardContent className="flex-1 flex flex-col min-h-0 pb-0">
              {activeTab === "input" ? (
                <Textarea
                  placeholder="Paste your JSON here..."
                  value={jsonInput}
                  onChange={(e) => setJsonInput(e.target.value)}
                  className="flex-1 font-mono resize-none"
                />
              ) : (
                parsedJson ? (
                  <div className="flex-1 border rounded-md overflow-auto mb-6">
                    <JsonTreeViewer data={parsedJson} className="p-3" />
                  </div>
                ) : (
                  <div className="flex-1 border rounded-md flex items-center justify-center text-muted-foreground mb-6">
                    Enter valid JSON and click Tree View to see the tree structure
                  </div>
                )
              )}
            </CardContent>
          </Card>
        </div>
      </main>
    </>
  );
};

export default JsonViewer;
