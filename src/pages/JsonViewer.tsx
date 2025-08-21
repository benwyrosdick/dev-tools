import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Helmet } from "react-helmet-async";
import JsonTreeViewer from "@/components/JsonTreeViewer";

const JsonViewer = () => {
  const [jsonInput, setJsonInput] = useState("");
  const [parsedJson, setParsedJson] = useState<any>(null);
  const [error, setError] = useState("");

  const formatJson = () => {
    try {
      const parsed = JSON.parse(jsonInput);
      const formatted = JSON.stringify(parsed, null, 2);
      setJsonInput(formatted);
      setParsedJson(parsed);
      setError("");
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
          <Card className="flex flex-col">
            <CardHeader>
              <CardTitle>JSON Input</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4 flex-1 flex flex-col">
              <Textarea
                placeholder="Paste your JSON here..."
                value={jsonInput}
                onChange={(e) => setJsonInput(e.target.value)}
                className="flex-1 font-mono resize-none min-h-[300px]"
              />
              <div className="flex gap-2">
                <Button onClick={formatJson}>Format</Button>
                <Button onClick={minifyJson} variant="outline">Minify</Button>
              </div>
              {error && <p className="text-sm text-destructive">{error}</p>}
            </CardContent>
          </Card>

          {parsedJson && (
            <Card className="flex flex-col flex-1 min-h-0">
              <CardHeader>
                <CardTitle>Tree View</CardTitle>
              </CardHeader>
              <CardContent className="flex-1 min-h-0">
                <JsonTreeViewer data={parsedJson} className="h-full" />
              </CardContent>
            </Card>
          )}
        </div>
      </main>
    </>
  );
};

export default JsonViewer;