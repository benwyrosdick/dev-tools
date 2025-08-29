
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
  const [activeTab, setActiveTab] = useState("input");

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

  const showTreeView = () => {
    try {
      if (jsonInput) {
        const parsed = JSON.parse(jsonInput);
        setParsedJson(parsed);
        setError("");
        setActiveTab("tree");
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
          <Card className="flex flex-col flex-1">
            <CardHeader>
              <CardTitle>JSON Tools</CardTitle>
              <div className="flex gap-2">
                <Button onClick={formatJson}>Format</Button>
                <Button onClick={minifyJson} variant="outline">Minify</Button>
                <Button onClick={showTreeView} variant="outline">Tree View</Button>
              </div>
              {error && <p className="text-sm text-destructive">{error}</p>}
            </CardHeader>
            <CardContent className="flex-1 flex flex-col min-h-0">
              <Tabs value={activeTab} onValueChange={setActiveTab} className="flex flex-col flex-1 min-h-0">
                <TabsList className="grid w-full grid-cols-2">
                  <TabsTrigger value="input">Input</TabsTrigger>
                  <TabsTrigger value="tree">Tree View</TabsTrigger>
                </TabsList>
                
                <TabsContent value="input" className="flex-1 flex flex-col min-h-0">
                  <Textarea
                    placeholder="Paste your JSON here..."
                    value={jsonInput}
                    onChange={(e) => setJsonInput(e.target.value)}
                    className="flex-1 font-mono resize-none min-h-[400px]"
                  />
                </TabsContent>
                
                <TabsContent value="tree" className="flex-1 min-h-0">
                  {parsedJson ? (
                    <JsonTreeViewer data={parsedJson} className="h-full" />
                  ) : (
                    <div className="flex items-center justify-center h-full text-muted-foreground">
                      Enter valid JSON in the Input tab to view the tree structure
                    </div>
                  )}
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
