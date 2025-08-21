import { useState } from "react";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Helmet } from "react-helmet-async";

const JwtViewer = () => {
  const [jwtInput, setJwtInput] = useState("");
  const [decodedHeader, setDecodedHeader] = useState("");
  const [decodedPayload, setDecodedPayload] = useState("");
  const [error, setError] = useState("");

  const decodeJwt = (jwt: string) => {
    try {
      const parts = jwt.split('.');
      if (parts.length !== 3) {
        throw new Error("Invalid JWT format");
      }

      const header = JSON.parse(atob(parts[0].replace(/-/g, '+').replace(/_/g, '/')));
      const payload = JSON.parse(atob(parts[1].replace(/-/g, '+').replace(/_/g, '/')));

      setDecodedHeader(JSON.stringify(header, null, 2));
      setDecodedPayload(JSON.stringify(payload, null, 2));
      setError("");
    } catch (err) {
      setError("Invalid JWT format");
      setDecodedHeader("");
      setDecodedPayload("");
    }
  };

  const handleInputChange = (value: string) => {
    setJwtInput(value);
    if (value.trim()) {
      decodeJwt(value.trim());
    } else {
      setDecodedHeader("");
      setDecodedPayload("");
      setError("");
    }
  };

  return (
    <>
      <Helmet>
        <title>JWT Viewer & Decoder | Text Tools</title>
        <meta name="description" content="Decode and view JWT tokens with our online JWT viewer tool." />
      </Helmet>

      <main className="container py-8">
        <div className="mb-6">
          <h1 className="text-3xl font-bold tracking-tight">JWT Viewer</h1>
          <p className="mt-2 text-muted-foreground">
            Decode and inspect JWT tokens.
          </p>
        </div>

        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>JWT Token</CardTitle>
            </CardHeader>
            <CardContent>
              <Textarea
                placeholder="Paste your JWT token here..."
                value={jwtInput}
                onChange={(e) => handleInputChange(e.target.value)}
                className="min-h-[100px] font-mono"
              />
              {error && <p className="mt-2 text-sm text-destructive">{error}</p>}
            </CardContent>
          </Card>

          <div className="grid gap-6 lg:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle>Header</CardTitle>
              </CardHeader>
              <CardContent>
                <Textarea
                  value={decodedHeader}
                  readOnly
                  className="min-h-[200px] font-mono"
                  placeholder="Decoded header will appear here..."
                />
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Payload</CardTitle>
              </CardHeader>
              <CardContent>
                <Textarea
                  value={decodedPayload}
                  readOnly
                  className="min-h-[200px] font-mono"
                  placeholder="Decoded payload will appear here..."
                />
              </CardContent>
            </Card>
          </div>
        </div>
      </main>
    </>
  );
};

export default JwtViewer;