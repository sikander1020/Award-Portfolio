import { useRef, useState } from "react";
import { ArrowLeft, Check, ImagePlus, Loader2, LockKeyhole, ShieldCheck, UploadCloud } from "lucide-react";
import { useLocation } from "wouter";
import { toast } from "sonner";
import { startLogin } from "@/const";
import { useAuth } from "@/_core/hooks/useAuth";
import { trpc } from "@/lib/trpc";

const slotOptions = ["hero", "about", "skills", "projects", "experience", "general"] as const;
type AssetSlot = (typeof slotOptions)[number];
const acceptedMimeTypes = ["image/jpeg", "image/png", "image/webp", "image/gif"] as const;

function formatBytes(value: number) {
  if (value < 1024 * 1024) return `${Math.round(value / 1024)} KB`;
  return `${(value / (1024 * 1024)).toFixed(1)} MB`;
}

async function toBase64(file: File) {
  return new Promise<string>((resolve, reject) => {
    const reader = new FileReader();
    reader.onerror = () => reject(new Error("Unable to read selected image"));
    reader.onload = () => {
      const result = typeof reader.result === "string" ? reader.result : "";
      const encoded = result.split(",")[1];
      if (!encoded) reject(new Error("Unable to encode selected image"));
      else resolve(encoded);
    };
    reader.readAsDataURL(file);
  });
}

export default function AssetVault() {
  const [, setLocation] = useLocation();
  const { user, loading, isAuthenticated, logout } = useAuth();
  const utils = trpc.useUtils();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [label, setLabel] = useState("");
  const [slot, setSlot] = useState<AssetSlot>("general");
  const isOwner = user?.role === "admin";
  const assetsQuery = trpc.assets.listMine.useQuery(undefined, { enabled: isOwner });
  const uploadMutation = trpc.assets.upload.useMutation({
    onSuccess: async () => {
      setSelectedFile(null);
      setLabel("");
      setSlot("general");
      if (fileInputRef.current) fileInputRef.current.value = "";
      await Promise.all([utils.assets.listMine.invalidate(), utils.assets.currentSlots.invalidate()]);
      toast("ASSET SECURED IN THE VAULT.");
    },
    onError: (error) => toast.error(error.message),
  });
  const assignMutation = trpc.assets.assignSlot.useMutation({
    onSuccess: async () => {
      await Promise.all([utils.assets.listMine.invalidate(), utils.assets.currentSlots.invalidate()]);
      toast("PORTFOLIO SLOT UPDATED.");
    },
    onError: (error) => toast.error(error.message),
  });

  const chooseFile = (file: File | undefined) => {
    if (!file) return;
    if (!acceptedMimeTypes.includes(file.type as (typeof acceptedMimeTypes)[number])) {
      toast.error("Use a JPG, PNG, WebP or GIF image.");
      return;
    }
    if (file.size > 6 * 1024 * 1024) {
      toast.error("Image must be 6 MB or smaller.");
      return;
    }
    setSelectedFile(file);
    setLabel(file.name.replace(/\.[^/.]+$/, "").replace(/[-_]+/g, " "));
  };

  const uploadSelectedFile = async () => {
    if (!selectedFile) return;
    const dataBase64 = await toBase64(selectedFile);
    uploadMutation.mutate({
      label: label.trim() || selectedFile.name,
      slot,
      fileName: selectedFile.name,
      mimeType: selectedFile.type as (typeof acceptedMimeTypes)[number],
      dataBase64,
    });
  };

  if (loading) return <main className="vault-page vault-state"><Loader2 className="vault-spinner" size={28} /> CONNECTING TO VAULT…</main>;
  if (!isAuthenticated) {
    return <main className="vault-page vault-state"><LockKeyhole size={34} /><h1>ASSET VAULT LOCKED</h1><p>Sign in with the portfolio owner account to manage stored imagery.</p><button type="button" className="vault-primary" onClick={startLogin}>SIGN IN TO CONTINUE</button><button type="button" className="vault-text-button" onClick={() => setLocation("/")}>RETURN TO PORTFOLIO</button></main>;
  }
  if (!isOwner) {
    return <main className="vault-page vault-state"><ShieldCheck size={34} /><h1>OWNER CLEARANCE REQUIRED</h1><p>This storage vault is reserved for the portfolio owner.</p><button type="button" className="vault-primary" onClick={() => setLocation("/")}>RETURN TO PORTFOLIO</button><button type="button" className="vault-text-button" onClick={() => logout()}>SIGN OUT</button></main>;
  }

  return (
    <main className="vault-page">
      <header className="vault-header">
        <button type="button" className="vault-back" onClick={() => setLocation("/")}><ArrowLeft size={16} /> PORTFOLIO</button>
        <div><span>VICE SIGNAL / OWNER CONSOLE</span><h1>ASSET <em>VAULT</em></h1></div>
        <button type="button" className="vault-signout" onClick={() => logout()}>SIGN OUT</button>
      </header>

      <section className="vault-grid">
        <article className="vault-upload-card">
          <div className="vault-card-heading"><span>01 / FILE STORAGE</span><h2>UPLOAD <em>ART</em></h2></div>
          <button type="button" className="vault-dropzone" onClick={() => fileInputRef.current?.click()}>
            <ImagePlus size={26} /><strong>{selectedFile ? selectedFile.name : "SELECT IMAGE"}</strong><span>{selectedFile ? `${formatBytes(selectedFile.size)} · ${selectedFile.type}` : "JPG, PNG, WEBP OR GIF · MAX 6 MB"}</span>
          </button>
          <input ref={fileInputRef} type="file" accept="image/jpeg,image/png,image/webp,image/gif" onChange={(event) => chooseFile(event.target.files?.[0])} hidden />
          <label>ASSET LABEL<input value={label} onChange={(event) => setLabel(event.target.value)} placeholder="e.g. Sunset Hero Portrait" /></label>
          <label>ASSIGN TO SLOT<select value={slot} onChange={(event) => setSlot(event.target.value as AssetSlot)}>{slotOptions.map((option) => <option key={option} value={option}>{option.toUpperCase()}</option>)}</select></label>
          <button type="button" className="vault-primary" disabled={!selectedFile || uploadMutation.isPending} onClick={uploadSelectedFile}>{uploadMutation.isPending ? <Loader2 className="vault-spinner" size={16} /> : <UploadCloud size={16} />} {uploadMutation.isPending ? "SECURING FILE…" : "UPLOAD TO VAULT"}</button>
        </article>

        <article className="vault-library-card">
          <div className="vault-card-heading"><span>02 / ACTIVE STORAGE</span><h2>ASSET <em>LIBRARY</em></h2></div>
          {assetsQuery.isLoading ? <div className="vault-library-status"><Loader2 className="vault-spinner" size={21} /> LOADING FILES…</div> : assetsQuery.data?.length ? <div className="vault-asset-grid">
            {assetsQuery.data.map((asset) => <article className="vault-asset" key={asset.id}>
              <img src={asset.url} alt={asset.label} />
              <div className="vault-asset-meta"><strong>{asset.label}</strong><span>{formatBytes(asset.byteSize)} · {asset.mimeType.replace("image/", "").toUpperCase()}</span></div>
              <div className="vault-asset-actions"><select value={asset.slot} onChange={(event) => assignMutation.mutate({ assetId: asset.id, slot: event.target.value as AssetSlot })}>{slotOptions.map((option) => <option key={option} value={option}>{option.toUpperCase()}</option>)}</select>{asset.slot !== "general" && <span className="vault-active-slot"><Check size={13} /> LIVE</span>}</div>
            </article>)}
          </div> : <div className="vault-library-status"><ImagePlus size={21} /> NO ASSETS YET. UPLOAD YOUR FIRST PORTFOLIO IMAGE.</div>}
        </article>
      </section>
    </main>
  );
}
