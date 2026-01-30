"use client";

import { Button,Input , Label } from "@repo/design-system";
import type { Dictionary } from "@repo/internationalization";
import { 
  CheckCircle2, 
  Loader2, 
  Upload, 
  FolderKanban, 
  Headphones, 
  Clock, 
  TicketPercent,
  AlertCircle
} from "lucide-react";
import { useState, FormEvent } from "react";
import { useRouter } from "next/navigation";
import { hashFolder } from "../hashFolder";

const HumartzLogo = ({ className }: { className?: string }) => (
  <svg className={className} viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
    <title>Humartz Fingerprint</title>
    <path d="M12 2C7.5 2 4 5.5 4 10V16C4 16.55 4.45 17 5 17C5.55 17 6 16.55 6 16V10C6 6.5 8.5 4 12 4C15.5 4 18 6.5 18 10V18C18 18.55 18.45 19 19 19C19.55 19 20 18.55 20 18V10C20 5.5 16.5 2 12 2ZM12 6C9.5 6 7.5 8 7.5 10.5V17C7.5 17.55 7.95 18 8.5 18C9.05 18 9.5 17.55 9.5 17V10.5C9.5 9 10.5 8 12 8C13.5 8 14.5 9 14.5 10.5V16C14.5 16.55 14.95 17 15.5 17C16.05 17 16.5 16.55 16.5 16V10.5C16.5 8 14.5 6 12 6ZM12 10C11.5 10 11 10.5 11 11V16C11 16.55 11.45 17 12 17C12.55 17 13 16.55 13 16V11C13 10.5 12.5 10 12 10Z" fill="currentColor" />
  </svg>
);

type FileManagerClientProps = {
  dictionary: Dictionary;
  locale: string;
};

export const FileManagerClient = ({ dictionary, locale }: FileManagerClientProps) => {
  const router = useRouter();
  const t = dictionary.web?.upload?.files ?? {};

  const [projectFiles, setProjectFiles] = useState<File[]>([]);
  const [masterFile, setMasterFile] = useState<File | null>(null);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [trackName, setTrackName] = useState("");
  const [promoCode, setPromoCode] = useState("");
  
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [error, setError] = useState<string | null>(null);

  const validCode = process.env.NEXT_PUBLIC_FREE_UPLOAD_CODE;
  const isFree = promoCode.trim().length > 0 && 
                 promoCode.trim().toUpperCase() === validCode?.toUpperCase();

  const sanitize = (str: string) =>
    str.trim().toLowerCase().replace(/\s+/g, "_").replace(/[^a-z0-9.@_-]/g, "").replace(/_+/g, "_");

  async function uploadToR2(file: File, key: string) {
    const presign = await fetch("/api/upload", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ fileName: key, fileType: file.type }),
    });
    if (!presign.ok) throw new Error("Upload initialization failed");
    const { signedUrl } = await presign.json();
    await fetch(signedUrl, { method: "PUT", headers: { "Content-Type": file.type }, body: file });
  }

  const handleUpload = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!projectFiles.length || !masterFile) {
      setError("Please upload a project folder and a master file");
      return;
    }

    if (promoCode.trim().length > 0 && !isFree) {
      setError("The promo code you entered is incorrect.");
      return;
    }

    setIsUploading(true);
    setError(null);

    try {
      const allFiles = [masterFile, ...projectFiles];
      const hash = await hashFolder(allFiles);
      const folderPrefix = `Email_${sanitize(email)}_Name_${sanitize(name)}_hash_${hash}/`;

      let uploaded = 0;
      await uploadToR2(masterFile, folderPrefix + "master_" + masterFile.name);
      uploaded++;

      for (const file of projectFiles) {
        const relativePath = file.webkitRelativePath || file.name;
        await uploadToR2(file, folderPrefix + "project/" + relativePath);
        uploaded++;
        setUploadProgress(Math.round((uploaded / allFiles.length) * 100));
      }

      const verifyRes = await fetch("/api/upload", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ 
          endpoint: "verify-promo", 
          promoCode: promoCode.trim(),
          email: email,       // For automatic email
          artistName: name,   // For automatic email
          trackName: trackName // For automatic email
        }),
      });

      if (!verifyRes.ok) throw new Error("Verification failed");
      const dbData = await verifyRes.json();

      if (dbData.isFree === true) {
        router.push(`/${locale}/success`); 
      } else {
        router.push(`/${locale}/payment`); 
      }
      
    } catch (err: any) {
      console.error("Upload process error:", err);
      setError(err.message || "Upload failed");
      setIsUploading(false);
    }
  };

  const allFieldsFilled = !!name && !!email && !!trackName && !!masterFile && projectFiles.length > 0;

  return (
    <div className="w-full py-20 lg:py-40">
      <div className="container mx-auto max-w-6xl">
        <div className="grid gap-10 lg:grid-cols-2">
          
          {/* Left Column (Branding & Features Restored) */}
          <div className="flex flex-col gap-8">
            <div className="flex flex-col gap-4">
              <h4 className="max-w-xl text-left font-regular text-3xl tracking-tighter md:text-5xl">
                {t.title || "File Manager"}
              </h4>
              <p className="max-w-sm text-left text-lg text-muted-foreground">
                Professional audio delivery system for studio-grade projects.
              </p>
            </div>

            <div className="flex flex-col gap-6 mt-4">
              <div className="flex items-start gap-4">
                <HumartzLogo className="mt-1 h-6 w-6 text-primary shrink-0" />
                <div>
                  <p className="font-medium text-lg">Secure & Traceable</p>
                  <p className="text-sm text-muted-foreground">Encrypted cloud storage for your high-fidelity masters.</p>
                </div>
              </div>
              
              <div className="flex items-start gap-4">
                <FolderKanban className="mt-1 h-6 w-6 text-primary shrink-0" />
                <div>
                  <p className="font-medium text-lg">Folder Structure</p>
                  <p className="text-sm text-muted-foreground">Full multi-file support with folder hierarchy preservation.</p>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <Clock className="mt-1 h-6 w-6 text-primary shrink-0" />
                <div>
                  <p className="font-medium text-lg">Fast Processing</p>
                  <p className="text-sm text-muted-foreground">Engineers typically begin review within 24 hours of upload.</p>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column (Form) */}
          <div className="flex items-start justify-center p-6">
            <div className="w-full max-w-md flex flex-col gap-6 rounded-lg border p-8 bg-background shadow-sm">
              <form onSubmit={handleUpload} className="flex flex-col gap-6">
                <div className="grid gap-4">
                  <div className="grid gap-2">
                    <Label>Your Name</Label>
                    <Input value={name} onChange={(e) => setName(e.target.value)} disabled={isUploading} required />
                  </div>
                  <div className="grid gap-2">
                    <Label>Email</Label>
                    <Input type="email" value={email} onChange={(e) => setEmail(e.target.value)} disabled={isUploading} required />
                  </div>
                  <div className="grid gap-2">
                    <Label>Track Name</Label>
                    <Input value={trackName} onChange={(e) => setTrackName(e.target.value)} disabled={isUploading} required />
                  </div>
                  <div className="grid gap-2">
                    <Label>Project Folder</Label>
                    <Input type="file" /* @ts-ignore */ webkitdirectory="" multiple onChange={(e) => e.target.files && setProjectFiles(Array.from(e.target.files))} disabled={isUploading} />
                  </div>
                  <div className="grid gap-2">
                    <Label>Master Audio File</Label>
                    <Input type="file" accept="audio/*" onChange={(e) => setMasterFile(e.target.files ? e.target.files[0] : null)} disabled={isUploading} />
                  </div>

                  <div className="grid gap-2 pt-4 border-t mt-2">
                    <Label className="flex items-center gap-2 text-sm text-muted-foreground">
                      <TicketPercent className="h-4 w-4" /> Promo Code
                    </Label>
                    <Input 
                      placeholder="Enter code" 
                      value={promoCode} 
                      onChange={(e) => { setPromoCode(e.target.value); setError(null); }}
                      disabled={isUploading}
                      className={isFree ? "border-green-500 ring-green-500" : ""}
                    />
                    {isFree && <p className="text-xs text-green-600 font-medium animate-pulse">✨ Promo applied: Upload is free!</p>}
                  </div>
                </div>

                {error && (
                  <div className="flex items-center gap-2 text-sm text-destructive bg-destructive/10 p-3 rounded-md">
                    <AlertCircle className="h-4 w-4" /> {error}
                  </div>
                )}

                <Button type="submit" disabled={!allFieldsFilled || isUploading} className="w-full">
                  {isUploading ? (
                    <>Uploading {uploadProgress}% <Loader2 className="h-4 w-4 animate-spin ml-2" /></>
                  ) : isFree ? (
                    <>Upload Free <CheckCircle2 className="h-4 w-4 ml-2" /></>
                  ) : (
                    <>Proceed to Payment <Upload className="h-4 w-4 ml-2" /></>
                  )}
                </Button>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};