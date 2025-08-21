import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Helmet } from "react-helmet-async";

const JsonViewer = () => {
  const [jsonInput, setJsonInput] = useState("");
  const [formattedJson, setFormattedJson] = useState("");
  const [error, setError] = useState("");

  const formatJson = () => {
    try {
      const parsed = JSON.parse(jsonInput);
      setFormattedJson(JSON.stringify(parsed, null, 2));
      setError("");
    } catch (err) {
      setError("Invalid JSON format");
      setFormattedJson("");
    }
  };

  const minifyJson = () => {
    try {
      const parsed = JSON.parse(jsonInput);
      setFormattedJson(JSON.stringify(parsed));
      setError("");
    } catch (err) {
      setError("Invalid JSON format");
      setFormattedJson("");
    }
  };

  return (
    <>
      <Helmet>
        <title>JSON Viewer & Formatter | Text Tools</title>
        <meta name="description" content="Format, validate, and beautify JSON data with our online JSON viewer tool." />
      </Helmet>

      <main className="container py-8">
        <div className="mb-6">
          <h1 className="text-3xl font-bold tracking-tight">JSON Viewer</h1>
          <p className="mt-2 text-muted-foreground">
            Format, validate, and beautify your JSON data.
          </p>
        </div>

        <div className="grid gap-6 lg:grid-cols-2">
          <Card>
            <CardHeader>
              <CardTitle>Input JSON</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <Textarea
                placeholder="Paste your JSON here..."
                value={jsonInput}
                onChange={(e) => setJsonInput(e.target.value)}
                className="min-h-[300px] font-mono"
              />
              <div className="flex gap-2">
                <Button onClick={formatJson}>Format</Button>
                <Button onClick={minifyJson} variant="outline">Minify</Button>
              </div>
              {error && <p className="text-sm text-destructive">{error}</p>}
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Formatted Output</CardTitle>
            </CardHeader>
            <CardContent>
              <Textarea
                value={formattedJson}
                readOnly
                className="min-h-[300px] font-mono"
                placeholder="Formatted JSON will appear here..."
              />
            </CardContent>
          </Card>
        </div>
      </main>
    </>
  );
};

export default JsonViewer;