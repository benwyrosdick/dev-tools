import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Helmet } from "react-helmet-async";
import JsonTreeViewer from "@/components/JsonTreeViewer";

const JsonViewer = () => {
  const [jsonInput, setJsonInput] = useState("");
  const [formattedJson, setFormattedJson] = useState("");
  const [parsedJson, setParsedJson] = useState<any>(null);
  const [error, setError] = useState("");

  const formatJson = () => {
    try {
      const parsed = JSON.parse(jsonInput);
      setFormattedJson(JSON.stringify(parsed, null, 2));
      setParsedJson(parsed);
      setError("");
    } catch (err) {
      setError("Invalid JSON format");
      setFormattedJson("");
      setParsedJson(null);
    }
  };

  const minifyJson = () => {
    try {
      const parsed = JSON.parse(jsonInput);
      setFormattedJson(JSON.stringify(parsed));
      setParsedJson(parsed);
      setError("");
    } catch (err) {
      setError("Invalid JSON format");
      setFormattedJson("");
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

        <div className="grid gap-6 lg:grid-cols-2 flex-1 min-h-0">
          <Card className="flex flex-col">
            <CardHeader>
              <CardTitle>Input JSON</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4 flex-1 flex flex-col">
              <Textarea
                placeholder="Paste your JSON here..."
                value={jsonInput}
                onChange={(e) => setJsonInput(e.target.value)}
                className="flex-1 font-mono resize-none"
              />
              <div className="flex gap-2">
                <Button onClick={formatJson}>Format</Button>
                <Button onClick={minifyJson} variant="outline">Minify</Button>
              </div>
              {error && <p className="text-sm text-destructive">{error}</p>}
            </CardContent>
          </Card>

          <Card className="flex flex-col">
            <CardHeader>
              <CardTitle>Output</CardTitle>
            </CardHeader>
            <CardContent className="flex-1 flex flex-col min-h-0">
              <Tabs defaultValue="tree" className="flex-1 flex flex-col min-h-0">
                <TabsList className="grid w-full grid-cols-2">
                  <TabsTrigger value="tree">Tree View</TabsTrigger>
                  <TabsTrigger value="formatted">Formatted Text</TabsTrigger>
                </TabsList>
                
                <TabsContent value="tree" className="flex-1 mt-4 min-h-0">
                  {parsedJson ? (
                    <JsonTreeViewer data={parsedJson} className="h-full" />
                  ) : (
                    <div className="flex items-center justify-center h-full text-muted-foreground border rounded-md">
                      Parsed JSON will appear here as a collapsible tree...
                    </div>
                  )}
                </TabsContent>
                
                <TabsContent value="formatted" className="flex-1 mt-4 min-h-0">
                  <Textarea
                    value={formattedJson}
                    readOnly
                    className="h-full font-mono resize-none"
                    placeholder="Formatted JSON will appear here..."
                  />
                </TabsContent>
              </Tabs>
            </CardContent>
          </Card>
        </div>
      </main>
    </>
  );
};

export default JsonViewer;