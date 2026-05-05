import { useState, useCallback } from "react";
import { useDropzone } from "react-dropzone";
import { Upload, FileText, X, CheckCircle2, AlertCircle } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";

interface DocumentUploadProps {
  onFilesAccepted: (files: File[]) => void;
  maxFiles?: number;
  maxSize?: number;
  accept?: Record<string, string[]>;
  className?: string;
}

function formatBytes(bytes: number): string {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

const DocumentUpload = ({
  onFilesAccepted,
  maxFiles = 5,
  maxSize = 10 * 1024 * 1024,
  accept = {
    "application/pdf": [".pdf"],
    "image/*": [".jpg", ".jpeg", ".png"],
  },
  className,
}: DocumentUploadProps) => {
  const [acceptedFiles, setAcceptedFiles] = useState<File[]>([]);
  const [rejections, setRejections] = useState<string[]>([]);

  const onDrop = useCallback(
    (newAccepted: File[], newRejected: { file: File; errors: { message: string }[] }[]) => {
      const merged = [...acceptedFiles, ...newAccepted].slice(0, maxFiles);
      setAcceptedFiles(merged);
      onFilesAccepted(merged);

      if (newRejected.length > 0) {
        const messages = newRejected.map(
          (r) => `${r.file.name}: ${r.errors.map((e) => e.message).join(", ")}`
        );
        setRejections(messages);
      } else {
        setRejections([]);
      }
    },
    [acceptedFiles, maxFiles, onFilesAccepted]
  );

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    maxFiles,
    maxSize,
    accept,
  });

  const removeFile = (index: number) => {
    const updated = acceptedFiles.filter((_, i) => i !== index);
    setAcceptedFiles(updated);
    onFilesAccepted(updated);
  };

  const acceptedExtensions = Object.values(accept).flat().join(", ");
  const maxSizeMB = (maxSize / (1024 * 1024)).toFixed(0);

  return (
    <div className={cn("space-y-4", className)}>
      <div
        {...getRootProps()}
        className={cn(
          "relative flex flex-col items-center justify-center gap-3 rounded border-2 border-dashed px-6 py-10 cursor-pointer transition-all duration-200",
          isDragActive
            ? "border-primary bg-primary/5 scale-[1.01]"
            : "border-border bg-muted/20 hover:border-primary/50 hover:bg-muted/40"
        )}
      >
        <input {...getInputProps()} />
        <div
          className={cn(
            "flex h-14 w-14 items-center justify-center rounded-full border transition-colors",
            isDragActive
              ? "border-primary/40 bg-primary/10 text-primary"
              : "border-border bg-muted/50 text-muted-foreground"
          )}
        >
          <Upload size={22} />
        </div>
        <div className="text-center">
          <p className="text-sm font-semibold text-foreground">
            {isDragActive ? "Solte os arquivos aqui" : "Arraste arquivos aqui ou clique para selecionar"}
          </p>
          <p className="mt-1 text-xs text-muted-foreground">
            {acceptedExtensions} · máx. {maxSizeMB}MB por arquivo · até {maxFiles} arquivo(s)
          </p>
        </div>
      </div>

      <AnimatePresence>
        {acceptedFiles.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: -6 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -6 }}
            className="space-y-2"
          >
            {acceptedFiles.map((file, index) => (
              <motion.div
                key={`${file.name}-${index}`}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 10 }}
                transition={{ delay: index * 0.04 }}
                className="flex items-center gap-3 rounded border border-border bg-card px-4 py-3"
              >
                <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded bg-primary/10 text-primary">
                  <FileText size={16} />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="truncate text-sm font-medium text-card-foreground">{file.name}</p>
                  <p className="text-xs text-muted-foreground">{formatBytes(file.size)}</p>
                </div>
                <CheckCircle2 size={16} className="shrink-0 text-emerald-500" />
                <button
                  type="button"
                  onClick={() => removeFile(index)}
                  className="ml-1 shrink-0 rounded-md p-1 text-muted-foreground hover:bg-muted hover:text-foreground transition-colors"
                >
                  <X size={14} />
                </button>
              </motion.div>
            ))}
          </motion.div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {rejections.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: -4 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            className="space-y-1.5"
          >
            {rejections.map((msg, i) => (
              <div
                key={i}
                className="flex items-start gap-2 rounded border border-destructive/30 bg-destructive/5 px-3 py-2"
              >
                <AlertCircle size={14} className="mt-0.5 shrink-0 text-destructive" />
                <p className="text-xs text-destructive">{msg}</p>
              </div>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export { DocumentUpload };
export type { DocumentUploadProps };
