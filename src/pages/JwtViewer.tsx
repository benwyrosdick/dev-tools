import { useState } from "react";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Helmet } from "react-helmet-async";

const JwtViewer = () => {
  const [jwtInput, setJwtInput] = useState("");
  const [decodedHeader, setDecodedHeader] = useState("");
  const [decodedPayload, setDecodedPayload] = useState("");
  const [signature, setSignature] = useState("");
  const [secretKey, setSecretKey] = useState("");
  const [signatureStatus, setSignatureStatus] = useState<"valid" | "invalid" | null>(null);
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
      setSignature(parts[2]);
      setError("");
      setSignatureStatus(null);
    } catch (err) {
      setError("Invalid JWT format");
      setDecodedHeader("");
      setDecodedPayload("");
      setSignature("");
      setSignatureStatus(null);
    }
  };

  const verifySignature = async () => {
    if (!jwtInput || !secretKey) {
      setSignatureStatus(null);
      return;
    }

    try {
      const parts = jwtInput.split('.');
      const headerPayload = `${parts[0]}.${parts[1]}`;
      
      // Convert secret to array buffer
      const encoder = new TextEncoder();
      const keyData = encoder.encode(secretKey);
      
      // Import key
      const key = await crypto.subtle.importKey(
        'raw',
        keyData,
        { name: 'HMAC', hash: 'SHA-256' },
        false,
        ['sign']
      );
      
      // Sign the header.payload
      const signature = await crypto.subtle.sign(
        'HMAC',
        key,
        encoder.encode(headerPayload)
      );
      
      // Convert to base64url
      const base64Signature = btoa(String.fromCharCode(...new Uint8Array(signature)))
        .replace(/\+/g, '-')
        .replace(/\//g, '_')
        .replace(/=/g, '');
      
      setSignatureStatus(base64Signature === parts[2] ? "valid" : "invalid");
    } catch (err) {
      setSignatureStatus("invalid");
    }
  };

  const handleInputChange = (value: string) => {
    setJwtInput(value);
    if (value.trim()) {
      decodeJwt(value.trim());
    } else {
      setDecodedHeader("");
      setDecodedPayload("");
      setSignature("");
      setError("");
      setSignatureStatus(null);
    }
  };

  const handleSecretChange = (value: string) => {
    setSecretKey(value);
    if (value && jwtInput) {
      verifySignature();
    } else {
      setSignatureStatus(null);
    }
  };

  return (
    <>
      <Helmet>
        <title>JWT Viewer & Decoder | Text Tools</title>
        <meta name="description" content="Decode and view JWT tokens with our online JWT viewer tool." />
      </Helmet>

      <main className="container py-8 flex flex-col" style={{ height: 'calc(100vh - 3.5rem)' }}>
        <div className="mb-6">
          <h1 className="text-3xl font-bold tracking-tight bg-gradient-to-r from-primary via-secondary to-accent bg-clip-text text-transparent">JWT Viewer</h1>
          <p className="mt-2 text-muted-foreground">
            Decode and inspect JWT tokens.
          </p>
        </div>

        <div className="space-y-6 flex-1 flex flex-col min-h-0">
          <Card className="border-primary/20 shadow-lg shadow-primary/5">
            <CardHeader className="bg-gradient-to-r from-primary/5 to-secondary/5">
              <CardTitle className="text-primary">JWT Token</CardTitle>
            </CardHeader>
            <CardContent className="mt-4">
              <Textarea
                placeholder="Paste your JWT token here..."
                value={jwtInput}
                onChange={(e) => handleInputChange(e.target.value)}
                className="min-h-[100px] font-mono"
              />
              {error && <p className="mt-2 text-sm text-destructive">{error}</p>}
            </CardContent>
          </Card>

          <div className="grid gap-6 lg:grid-cols-2 flex-1 min-h-0">
            <Card className="border-primary/20 shadow-lg shadow-primary/5 flex flex-col">
              <CardHeader className="bg-gradient-to-r from-secondary/5 to-primary/5">
                <CardTitle className="text-secondary">Payload</CardTitle>
              </CardHeader>
              <CardContent className="flex-1 flex flex-col min-h-0 pt-6">
                <Textarea
                  value={decodedPayload}
                  readOnly
                  className="flex-1 font-mono resize-none"
                  placeholder="Decoded payload will appear here..."
                />
              </CardContent>
            </Card>

            <div className="flex flex-col gap-6 min-h-0">
              <Card className="border-primary/20 shadow-lg shadow-primary/5">
                <CardHeader className="bg-gradient-to-r from-accent/5 to-primary/5">
                  <CardTitle className="text-accent">Header</CardTitle>
                </CardHeader>
                <CardContent className="pt-6">
                  <Textarea
                    value={decodedHeader}
                    readOnly
                    className="min-h-[150px] font-mono resize-none"
                    placeholder="Decoded header will appear here..."
                  />
                </CardContent>
              </Card>

              <Card className="border-primary/20 shadow-lg shadow-primary/5 flex-1 flex flex-col">
                <CardHeader className="bg-gradient-to-r from-primary/5 to-accent/5">
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-primary">Signature Verification</CardTitle>
                    {signatureStatus && (
                      <Badge variant={signatureStatus === "valid" ? "default" : "destructive"} className={signatureStatus === "valid" ? "bg-green-500" : ""}>
                        {signatureStatus === "valid" ? "Valid" : "Invalid"}
                      </Badge>
                    )}
                  </div>
                </CardHeader>
                <CardContent className="pt-6 flex-1 flex flex-col gap-4">
                  <div>
                    <label className="text-sm font-medium mb-2 block">Secret Key</label>
                    <Input
                      type="password"
                      placeholder="Enter secret key to verify..."
                      value={secretKey}
                      onChange={(e) => handleSecretChange(e.target.value)}
                      className="font-mono"
                    />
                  </div>
                  <div className="flex-1 flex flex-col">
                    <label className="text-sm font-medium mb-2 block">Signature</label>
                    <Textarea
                      value={signature}
                      readOnly
                      className="flex-1 font-mono resize-none text-xs"
                      placeholder="Signature will appear here..."
                    />
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </main>
    </>
  );
};

export default JwtViewer;