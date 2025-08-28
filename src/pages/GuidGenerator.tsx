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

  const generateGuidV4 = () => {
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
      const r = Math.random() * 16 | 0;
      const v = c === 'x' ? r : (r & 0x3 | 0x8);
      return v.toString(16);
    });
  };

  const generateGuidV7 = () => {
    // UUID v7 format: timestamp (48 bits) + version (4 bits) + random (12 bits) + variant (2 bits) + random (62 bits)
    const timestamp = Date.now();
    const timestampHex = timestamp.toString(16).padStart(12, '0');
    
    // Generate random bytes for the rest
    const randomBytes = new Uint8Array(10);
    crypto.getRandomValues(randomBytes);
    
    // Convert to hex string
    const randomHex = Array.from(randomBytes, byte => byte.toString(16).padStart(2, '0')).join('');
    
    // Construct UUID v7
    const uuid = [
      timestampHex.substring(0, 8),
      timestampHex.substring(8, 12),
      '7' + randomHex.substring(0, 3), // Version 7
      ((parseInt(randomHex.substring(3, 4), 16) & 0x3) | 0x8).toString(16) + randomHex.substring(4, 7), // Variant bits
      randomHex.substring(7, 19)
    ].join('-');
    
    return uuid;
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