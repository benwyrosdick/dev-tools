import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Helmet } from "react-helmet-async";

const CryptoTools = () => {
  const [input, setInput] = useState("");
  const [output, setOutput] = useState("");

  const encodeBase64 = () => {
    setOutput(btoa(input));
  };

  const decodeBase64 = () => {
    try {
      setOutput(atob(input));
    } catch (err) {
      setOutput("Invalid Base64 format");
    }
  };

  const encodeUrl = () => {
    setOutput(encodeURIComponent(input));
  };

  const decodeUrl = () => {
    try {
      setOutput(decodeURIComponent(input));
    } catch (err) {
      setOutput("Invalid URL encoding");
    }
  };

  const generateHash = async (algorithm: string) => {
    const encoder = new TextEncoder();
    const data = encoder.encode(input);
    const hashBuffer = await crypto.subtle.digest(algorithm, data);
    const hashArray = Array.from(new Uint8Array(hashBuffer));
    const hashHex = hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
    setOutput(hashHex);
  };

  return (
    <>
      <Helmet>
        <title>Crypto Tools | Text Tools</title>
        <meta name="description" content="Encode, decode, and hash text with various cryptographic tools." />
      </Helmet>

      <main className="container py-8">
        <div className="mb-6">
          <h1 className="text-3xl font-bold tracking-tight">Crypto Tools</h1>
          <p className="mt-2 text-muted-foreground">
            Encode, decode, and hash your text data.
          </p>
        </div>

        <div className="grid gap-6 lg:grid-cols-2">
          <Card>
            <CardHeader>
              <CardTitle>Input</CardTitle>
            </CardHeader>
            <CardContent>
              <Textarea
                placeholder="Enter your text here..."
                value={input}
                onChange={(e) => setInput(e.target.value)}
                className="min-h-[300px]"
              />
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Output</CardTitle>
            </CardHeader>
            <CardContent>
              <Textarea
                value={output}
                readOnly
                className="min-h-[300px] font-mono"
                placeholder="Result will appear here..."
              />
            </CardContent>
          </Card>
        </div>

        <Card className="mt-6">
          <CardHeader>
            <CardTitle>Tools</CardTitle>
          </CardHeader>
          <CardContent>
            <Tabs defaultValue="base64" className="w-full">
              <TabsList className="grid w-full grid-cols-3">
                <TabsTrigger value="base64">Base64</TabsTrigger>
                <TabsTrigger value="url">URL Encoding</TabsTrigger>
                <TabsTrigger value="hash">Hashing</TabsTrigger>
              </TabsList>
              
              <TabsContent value="base64" className="space-y-4">
                <div className="flex gap-2">
                  <Button onClick={encodeBase64}>Encode Base64</Button>
                  <Button onClick={decodeBase64} variant="outline">Decode Base64</Button>
                </div>
              </TabsContent>
              
              <TabsContent value="url" className="space-y-4">
                <div className="flex gap-2">
                  <Button onClick={encodeUrl}>Encode URL</Button>
                  <Button onClick={decodeUrl} variant="outline">Decode URL</Button>
                </div>
              </TabsContent>
              
              <TabsContent value="hash" className="space-y-4">
                <div className="flex gap-2">
                  <Button onClick={() => generateHash('SHA-256')}>SHA-256</Button>
                  <Button onClick={() => generateHash('SHA-1')} variant="outline">SHA-1</Button>
                  <Button onClick={() => generateHash('SHA-512')} variant="outline">SHA-512</Button>
                </div>
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>
      </main>
    </>
  );
};

export default CryptoTools;