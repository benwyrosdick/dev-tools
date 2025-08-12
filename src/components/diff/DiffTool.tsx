import { useState, useMemo } from "react";
import ReactDiffViewer, { DiffMethod } from "react-diff-viewer-continued";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "@/components/ui/select";
import { toast } from "@/components/ui/use-toast";

function readFileAsText(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(String(reader.result ?? ""));
    reader.onerror = () => reject(reader.error);
    reader.readAsText(file);
  });
}

const sanitizeWhitespace = (input: string) =>
  input.replace(/\r\n|\r/g, "\n");

export function DiffTool() {
  const [leftText, setLeftText] = useState("");
  const [rightText, setRightText] = useState("");

  const [splitView, setSplitView] = useState(true);
  const [ignoreCase, setIgnoreCase] = useState(false);
  const [ignoreWhitespace, setIgnoreWhitespace] = useState(false);
  const [method, setMethod] = useState<DiffMethod>(DiffMethod.LINES);
  const [showDiff, setShowDiff] = useState(false);

  const processed = useMemo(() => {
    const transform = (t: string) => {
      let out = sanitizeWhitespace(t ?? "");
      if (ignoreWhitespace) {
        // Normalize all whitespace runs to a single space but keep newlines
        out = out
          .split("\n")
          .map((line) => line.replace(/\s+/g, " ").trimEnd())
          .join("\n");
      }
      if (ignoreCase) out = out.toLowerCase();
      return out;
    };
    return { a: transform(leftText), b: transform(rightText) };
  }, [leftText, rightText, ignoreCase, ignoreWhitespace]);

  const onCompare = () => {
    if (!leftText && !rightText) {
      toast({ title: "Nothing to compare", description: "Add text or upload files first." });
      return;
    }
    setShowDiff(true);
  };

  const onSwap = () => {
    setLeftText(rightText);
    setRightText(leftText);
  };

  return (
    <section className="w-full">
      <Card className="border-muted">
        <CardHeader>
          <CardTitle className="text-xl">Input</CardTitle>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="paste" className="w-full">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="paste">Paste text</TabsTrigger>
              <TabsTrigger value="upload">Upload files</TabsTrigger>
            </TabsList>
            <TabsContent value="paste" className="mt-4">
              <div className="grid gap-4 md:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="left">Original</Label>
                  <Textarea
                    id="left"
                    value={leftText}
                    onChange={(e) => setLeftText(e.target.value)}
                    placeholder="Paste original text here"
                    className="min-h-[200px]"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="right">Modified</Label>
                  <Textarea
                    id="right"
                    value={rightText}
                    onChange={(e) => setRightText(e.target.value)}
                    placeholder="Paste modified text here"
                    className="min-h-[200px]"
                  />
                </div>
              </div>
            </TabsContent>
            <TabsContent value="upload" className="mt-4">
              <div className="grid gap-6 md:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="leftFile">Original file (.txt)</Label>
                  <Input
                    id="leftFile"
                    type="file"
                    accept=".txt,.md,.csv,.json,.log,.xml,.yml,.yaml,.env,.ini,.conf,.cfg,.sql"
                    onChange={async (e) => {
                      const file = e.target.files?.[0];
                      if (file) {
                        try {
                          const text = await readFileAsText(file);
                          setLeftText(text);
                        } catch (err) {
                          toast({ title: "Failed to read file", description: String(err) });
                        }
                      }
                    }}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="rightFile">Modified file (.txt)</Label>
                  <Input
                    id="rightFile"
                    type="file"
                    accept=".txt,.md,.csv,.json,.log,.xml,.yml,.yaml,.env,.ini,.conf,.cfg,.sql"
                    onChange={async (e) => {
                      const file = e.target.files?.[0];
                      if (file) {
                        try {
                          const text = await readFileAsText(file);
                          setRightText(text);
                        } catch (err) {
                          toast({ title: "Failed to read file", description: String(err) });
                        }
                      }
                    }}
                  />
                </div>
              </div>
            </TabsContent>
          </Tabs>

          <div className="mt-6 grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            <div className="flex items-center justify-between rounded-md border p-3">
              <div className="space-y-0.5">
                <Label>Side-by-side view</Label>
                <p className="text-xs text-muted-foreground">Toggle unified vs split</p>
              </div>
              <Switch checked={splitView} onCheckedChange={setSplitView} />
            </div>

            <div className="flex items-center justify-between rounded-md border p-3">
              <div className="space-y-0.5">
                <Label>Ignore case</Label>
                <p className="text-xs text-muted-foreground">Compare case-insensitively</p>
              </div>
              <Switch checked={ignoreCase} onCheckedChange={setIgnoreCase} />
            </div>

            <div className="flex items-center justify-between rounded-md border p-3">
              <div className="space-y-0.5">
                <Label>Ignore whitespace</Label>
                <p className="text-xs text-muted-foreground">Normalize spaces and tabs</p>
              </div>
              <Switch checked={ignoreWhitespace} onCheckedChange={setIgnoreWhitespace} />
            </div>

            <div className="rounded-md border p-3">
              <Label className="mb-2 block">Diff granularity</Label>
              <Select
                value={String(method)}
                onValueChange={(v) => setMethod(Number(v) as unknown as DiffMethod)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select method" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value={String(DiffMethod.LINES)}>Lines</SelectItem>
                  <SelectItem value={String(DiffMethod.WORDS)}>Words</SelectItem>
                  <SelectItem value={String(DiffMethod.CHARS)}>Characters</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="mt-6 flex flex-wrap gap-3">
            <Button variant="secondary" onClick={onSwap}>
              Swap inputs
            </Button>
            <Button onClick={onCompare}>Compare</Button>
          </div>
        </CardContent>
      </Card>

      {showDiff && (
        <Card className="mt-6">
          <CardHeader>
            <CardTitle className="text-xl">Result</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="overflow-auto rounded-md border">
              <ReactDiffViewer
                oldValue={processed.a}
                newValue={processed.b}
                splitView={splitView}
                compareMethod={method}
                useDarkTheme={false}
                hideLineNumbers={false}
              />
            </div>
          </CardContent>
        </Card>
      )}
    </section>
  );
}

export default DiffTool;
