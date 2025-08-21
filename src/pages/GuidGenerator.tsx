import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Copy } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { Helmet } from "react-helmet-async";

const GuidGenerator = () => {
  const [guids, setGuids] = useState<string[]>([]);
  const [count, setCount] = useState(1);
  const { toast } = useToast();

  const generateGuid = () => {
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
      const r = Math.random() * 16 | 0;
      const v = c === 'x' ? r : (r & 0x3 | 0x8);
      return v.toString(16);
    });
  };

  const generateGuids = () => {
    const newGuids = Array.from({ length: count }, () => generateGuid());
    setGuids(newGuids);
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    toast({
      title: "Copied!",
      description: "GUID copied to clipboard",
    });
  };

  const copyAllToClipboard = () => {
    navigator.clipboard.writeText(guids.join('\n'));
    toast({
      title: "Copied!",
      description: "All GUIDs copied to clipboard",
    });
  };

  return (
    <>
      <Helmet>
        <title>GUID Generator | Text Tools</title>
        <meta name="description" content="Generate unique GUIDs (UUIDs) with our online GUID generator tool." />
      </Helmet>

      <main className="container py-8">
        <div className="mb-6">
          <h1 className="text-3xl font-bold tracking-tight">GUID Generator</h1>
          <p className="mt-2 text-muted-foreground">
            Generate unique identifiers (GUIDs/UUIDs).
          </p>
        </div>

        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Generator Settings</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center gap-4">
                <div className="grid w-full max-w-sm items-center gap-1.5">
                  <Label htmlFor="count">Number of GUIDs</Label>
                  <Input
                    type="number"
                    id="count"
                    value={count}
                    onChange={(e) => setCount(Math.max(1, Math.min(100, parseInt(e.target.value) || 1)))}
                    min="1"
                    max="100"
                  />
                </div>
                <Button onClick={generateGuids} className="mt-6">
                  Generate GUIDs
                </Button>
              </div>
            </CardContent>
          </Card>

          {guids.length > 0 && (
            <Card>
              <CardHeader className="flex flex-row items-center justify-between">
                <CardTitle>Generated GUIDs</CardTitle>
                <Button onClick={copyAllToClipboard} variant="outline" size="sm">
                  <Copy className="h-4 w-4 mr-2" />
                  Copy All
                </Button>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  {guids.map((guid, index) => (
                    <div key={index} className="flex items-center gap-2 p-2 rounded border">
                      <code className="flex-1 font-mono text-sm">{guid}</code>
                      <Button
                        onClick={() => copyToClipboard(guid)}
                        variant="ghost"
                        size="sm"
                      >
                        <Copy className="h-4 w-4" />
                      </Button>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      </main>
    </>
  );
};

export default GuidGenerator;