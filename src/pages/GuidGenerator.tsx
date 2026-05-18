import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Copy } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { Helmet } from "react-helmet-async";

const GuidGenerator = () => {
  const [guids, setGuids] = useState<string[]>([]);
  const [count, setCount] = useState(1);
  const [version, setVersion] = useState<"v4" | "v7">("v4");
  const { toast } = useToast();

  const generateGuidV4 = () => crypto.randomUUID();

  const generateGuidV7 = () => {
    const timestampHex = Date.now().toString(16).padStart(12, '0');
    const randomBytes = new Uint8Array(10);
    crypto.getRandomValues(randomBytes);
    const randomHex = Array.from(randomBytes, byte => byte.toString(16).padStart(2, '0')).join('');
    return [
      timestampHex.substring(0, 8),
      timestampHex.substring(8, 12),
      '7' + randomHex.substring(0, 3),
      ((parseInt(randomHex.substring(3, 4), 16) & 0x3) | 0x8).toString(16) + randomHex.substring(4, 7),
      randomHex.substring(7, 19),
    ].join('-');
  };

  const generateGuids = () => {
    const generateFn = version === "v7" ? generateGuidV7 : generateGuidV4;
    const newGuids = Array.from({ length: count }, () => generateFn());
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
          <h1 className="text-3xl font-bold tracking-tight bg-gradient-to-r from-primary via-secondary to-accent bg-clip-text text-transparent">GUID Generator</h1>
          <p className="mt-2 text-muted-foreground">
            Generate unique identifiers (GUIDs/UUIDs).
          </p>
        </div>

        <div className="space-y-6">
          <Card className="border-primary/20 shadow-lg shadow-primary/5">
            <CardHeader className="bg-gradient-to-r from-primary/5 to-secondary/5">
              <CardTitle className="text-primary">Generator Settings</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4 mt-4">
              <div>
                <Label className="text-base font-medium">GUID Version</Label>
                <RadioGroup value={version} onValueChange={(value) => setVersion(value as "v4" | "v7")} className="mt-2">
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="v4" id="v4" />
                    <Label htmlFor="v4" className="text-sm font-normal">
                      Version 4 (Random) - Standard random UUID
                    </Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="v7" id="v7" />
                    <Label htmlFor="v7" className="text-sm font-normal">
                      Version 7 (Timestamp) - Sortable timestamp-based UUID
                    </Label>
                  </div>
                </RadioGroup>
              </div>
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
            <Card className="border-primary/20 shadow-lg shadow-primary/5">
              <CardHeader className="flex flex-row items-center justify-between bg-gradient-to-r from-secondary/5 to-accent/5">
                <CardTitle className="text-secondary">Generated GUIDs</CardTitle>
                <Button onClick={copyAllToClipboard} variant="outline" size="sm">
                  <Copy className="h-4 w-4 mr-2" />
                  Copy All
                </Button>
              </CardHeader>
              <CardContent className="mt-4">
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