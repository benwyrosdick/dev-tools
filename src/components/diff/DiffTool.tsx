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

// JSON helpers for canonical diffing
function sortKeysDeep(value: any): any {
  if (Array.isArray(value)) return value.map(sortKeysDeep);
  if (value && typeof value === "object" && value.constructor === Object) {
    const out: Record<string, any> = {};
    Object.keys(value)
      .sort()
      .forEach((k) => {
        out[k] = sortKeysDeep((value as Record<string, any>)[k]);
      });
    return out;
  }
  return value;
}

function toCanonicalJsonString(input: string): string {
  const parsed = JSON.parse(input);
  return JSON.stringify(sortKeysDeep(parsed), null, 2);
}

export function DiffTool() {
  const [leftText, setLeftText] = useState("");
  const [rightText, setRightText] = useState("");

  const [splitView, setSplitView] = useState(true);
  const [ignoreCase, setIgnoreCase] = useState(false);
  const [ignoreWhitespace, setIgnoreWhitespace] = useState(false);
  const [method, setMethod] = useState<'lines' | 'words' | 'chars'>('lines');
  const [jsonMode, setJsonMode] = useState(false);
  const [showDiff, setShowDiff] = useState(false);
  const [diffA, setDiffA] = useState("");
  const [diffB, setDiffB] = useState("");

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
    if (jsonMode) {
      try {
        const leftStr = leftText ? toCanonicalJsonString(leftText) : "";
        const rightStr = rightText ? toCanonicalJsonString(rightText) : "";
        setDiffA(leftStr);
        setDiffB(rightStr);
        setShowDiff(true);
      } catch (err) {
        toast({
          title: "Invalid JSON",
          description: "Ensure both inputs are valid JSON when JSON mode is enabled.",
        });
        setShowDiff(false);
      }
    } else {
      setDiffA(processed.a);
      setDiffB(processed.b);
      setShowDiff(true);
    }
  };

  const onSwap = () => {
    setLeftText(rightText);
    setRightText(leftText);
  };

  return (
    <section className="w-full">
      <Card className="border-primary/20 shadow-lg shadow-primary/5">
        <CardHeader className="bg-gradient-to-r from-primary/5 to-secondary/5">
          <CardTitle className="text-xl text-primary">Input</CardTitle>
        </CardHeader>
        <CardContent className="mt-4">
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
                <Label>JSON mode</Label>
                <p className="text-xs text-muted-foreground">Parse, sort keys, pretty-print objects</p>
              </div>
              <Switch checked={jsonMode} onCheckedChange={setJsonMode} />
            </div>

            {!jsonMode && (
              <div className="flex items-center justify-between rounded-md border p-3">
                <div className="space-y-0.5">
                  <Label>Ignore case</Label>
                  <p className="text-xs text-muted-foreground">Compare case-insensitively</p>
                </div>
                <Switch checked={ignoreCase} onCheckedChange={setIgnoreCase} />
              </div>
            )}

            {!jsonMode && (
              <div className="flex items-center justify-between rounded-md border p-3">
                <div className="space-y-0.5">
                  <Label>Ignore whitespace</Label>
                  <p className="text-xs text-muted-foreground">Normalize spaces and tabs</p>
                </div>
                <Switch checked={ignoreWhitespace} onCheckedChange={setIgnoreWhitespace} />
              </div>
            )}

            {!jsonMode && (
              <div className="rounded-md border p-3">
                <Label className="mb-2 block">Diff granularity</Label>
                <Select
                  value={method}
                  onValueChange={(v) => setMethod(v as 'lines' | 'words' | 'chars')}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select method" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="lines">Lines</SelectItem>
                    <SelectItem value="words">Words</SelectItem>
                    <SelectItem value="chars">Characters</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            )}
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
        <Card className="mt-6 border-primary/20 shadow-lg shadow-primary/5">
          <CardHeader className="bg-gradient-to-r from-secondary/5 to-accent/5">
            <CardTitle className="text-xl text-secondary">Result</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="overflow-auto rounded-md border">
              <ReactDiffViewer
                oldValue={diffA}
                newValue={diffB}
                splitView={splitView}
                compareMethod={method === 'lines' ? DiffMethod.LINES : method === 'words' ? DiffMethod.WORDS : DiffMethod.CHARS}
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
