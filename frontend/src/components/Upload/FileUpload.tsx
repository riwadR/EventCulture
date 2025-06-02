import React, { useState, useRef, useCallback } from "react";
import {
  HiMiniArrowUpTray as Upload,
  HiMiniXMark as X,
  HiMiniPhoto as Image,
  HiMiniDocumentText as FileText,
  HiMiniVideoCamera as Video,
  HiMiniExclamationCircle as AlertCircle,
  HiMiniCheckCircle as CheckCircle,
  HiMiniArrowPath as Loader,
  HiMiniCamera as Camera
} from "react-icons/hi2";

interface FileUploadProps {
  type: "image" | "document" | "media";
  accept?: string;
  maxSize?: number; // en MB
  multiple?: boolean;
  onFileUploaded?: (urls: string[]) => void;
  onError?: (error: string) => void;
  className?: string;
  placeholder?: string;
  preview?: boolean;
}

interface UploadedFile {
  file: File;
  url?: string;
  status: "uploading" | "success" | "error";
  error?: string;
  progress?: number;
}

const FileUpload: React.FC<FileUploadProps> = ({
  type = "image",
  accept,
  maxSize = 5,
  multiple = false,
  onFileUploaded,
  onError,
  className = "",
  placeholder,
  preview = true,
}) => {
  const [files, setFiles] = useState<UploadedFile[]>([]);
  const [isDragOver, setIsDragOver] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Configuration par type
  const getConfig = () => {
    switch (type) {
      case "image":
        return {
          endpoint: "/api/upload/image",
          accept: accept || "image/*",
          icon: Image,
          placeholder: placeholder || "Cliquez ou glissez vos images ici",
          allowedTypes: [
            "image/jpeg",
            "image/jpg",
            "image/png",
            "image/gif",
            "image/webp"
          ]
        };
      case "document":
        return {
          endpoint: "/api/upload/document",
          accept: accept || ".pdf,.doc,.docx,.txt",
          icon: FileText,
          placeholder: placeholder || "Cliquez ou glissez vos documents ici",
          allowedTypes: [
            "application/pdf",
            "application/msword",
            "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
            "text/plain"
          ]
        };
      case "media":
        return {
          endpoint: "/api/upload/media",
          accept: accept || "image/*,video/*,audio/*",
          icon: Video,
          placeholder: placeholder || "Cliquez ou glissez vos fichiers média ici",
          allowedTypes: ["image/*", "video/*", "audio/*"]
        };
      default:
        return {
          endpoint: "/api/upload/image",
          accept: "image/*",
          icon: Image,
          placeholder: "Cliquez ou glissez vos fichiers ici",
          allowedTypes: ["image/*"]
        };
    }
  };

  const config = getConfig();

  // Validation du fichier
  const validateFile = (file: File): string | null => {
    // Vérifier la taille
    if (file.size > maxSize * 1024 * 1024) {
      return `Le fichier est trop volumineux (max: ${maxSize}MB)`;
    }

    // Vérifier le type
    const isAllowed = config.allowedTypes.some((allowedType) => {
      if (allowedType.endsWith("/*")) {
        return file.type.startsWith(allowedType.replace("/*", ""));
      }
      return file.type === allowedType;
    });

    if (!isAllowed) {
      return `Type de fichier non autorisé`;
    }

    return null;
  };

  // Upload d'un fichier
  const uploadFile = async (file: File): Promise<string> => {
    const formData = new FormData();
    formData.append(type === "image" ? "image" : "file", file);

    const token = localStorage.getItem("patrimoine_auth_token");

    const response = await fetch(config.endpoint, {
      method: "POST",
      headers: {
        ...(token && { Authorization: `Bearer ${token}` })
      },
      body: formData
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || "Erreur lors de l'upload");
    }

    const result = await response.json();

    if (!result.success) {
      throw new Error(result.error || "Erreur lors de l'upload");
    }

    return result.data.url;
  };

  // Traitement des fichiers sélectionnés
  const handleFiles = useCallback(
    async (selectedFiles: FileList) => {
      const newFiles: UploadedFile[] = [];

      for (let i = 0; i < selectedFiles.length; i++) {
        const file = selectedFiles[i];
        const validationError = validateFile(file);

        if (validationError) {
          newFiles.push({
            file,
            status: "error",
            error: validationError
          });
          continue;
        }

        newFiles.push({
          file,
          status: "uploading",
          progress: 0
        });
      }

      // Si pas multiple, remplacer les fichiers existants
      if (!multiple) {
        setFiles(newFiles);
      } else {
        setFiles((prev) => [...prev, ...newFiles]);
      }

      // Upload des fichiers valides
      const uploadPromises = newFiles
        .filter((f) => f.status === "uploading")
        .map(async (fileObj) => {
          try {
            const url = await uploadFile(fileObj.file);

            setFiles((prev) =>
              prev.map((f) =>
                f.file === fileObj.file
                  ? { ...f, status: "success" as const, url, progress: 100 }
                  : f
              )
            );

            return url;
          } catch (error) {
            const errorMessage =
              error instanceof Error ? error.message : "Erreur d'upload";

            setFiles((prev) =>
              prev.map((f) =>
                f.file === fileObj.file
                  ? { ...f, status: "error" as const, error: errorMessage }
                  : f
              )
            );

            onError?.(errorMessage);
            return null;
          }
        });

      try {
        const urls = await Promise.all(uploadPromises);
        const successUrls = urls.filter(Boolean) as string[];

        if (successUrls.length > 0 && onFileUploaded) {
          onFileUploaded(successUrls);
        }
      } catch (error) {
        console.error("Erreur lors de l'upload:", error);
      }
    },
    [multiple, maxSize, onFileUploaded, onError, config.allowedTypes]
  );

  // Gestionnaires d'événements
  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFiles = e.target.files;
    if (selectedFiles && selectedFiles.length > 0) {
      handleFiles(selectedFiles);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);

    const droppedFiles = e.dataTransfer.files;
    if (droppedFiles.length > 0) {
      handleFiles(droppedFiles);
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
  };

  // Supprimer un fichier
  const removeFile = (fileToRemove: UploadedFile) => {
    setFiles((prev) => prev.filter((f) => f.file !== fileToRemove.file));
  };

  // Obtenir l'icône pour un type de fichier
  const getFileIcon = (file: File) => {
    if (file.type.startsWith("image/")) return Image;
    if (file.type.startsWith("video/")) return Video;
    if (file.type.startsWith("audio/")) return Camera;
    return FileText;
  };

  const IconComponent = config.icon;

  return (
    <div className={`space-y-4 ${className}`}>
      {/* Zone de drop */}
      <div
        className={`
          relative border-2 border-dashed rounded-lg p-6 text-center cursor-pointer transition-colors
          ${
            isDragOver
              ? "border-emerald-500 bg-emerald-50"
              : "border-gray-300 hover:border-emerald-400 bg-gray-50 hover:bg-gray-100"
          }
        `}
        onDrop={handleDrop}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onClick={() => fileInputRef.current?.click()}
      >
        <input
          ref={fileInputRef}
          type="file"
          accept={config.accept}
          multiple={multiple}
          onChange={handleFileSelect}
          className="hidden"
        />

        <div className="space-y-4">
          <div className="mx-auto w-12 h-12 flex items-center justify-center">
            <IconComponent
              size={32}
              className={isDragOver ? "text-emerald-500" : "text-gray-400"}
            />
          </div>

          <div>
            <p className="text-sm font-medium text-gray-900">
              {config.placeholder}
            </p>
            <p className="text-xs text-gray-500 mt-1">
              Formats acceptés • Max {maxSize}MB {multiple ? "• Plusieurs fichiers" : ""}
            </p>
          </div>
        </div>
      </div>

      {/* Liste des fichiers */}
      {files.length > 0 && (
        <div className="space-y-2">
          <h4 className="text-sm font-medium text-gray-900">
            Fichiers ({files.length})
          </h4>

          <div className="space-y-2">
            {files.map((fileObj, index) => {
              const FileIcon = getFileIcon(fileObj.file);

              return (
                <div
                  key={index}
                  className="flex items-center space-x-3 p-3 bg-white border border-gray-200 rounded-lg"
                >
                  {/* Aperçu/Icône */}
                  <div className="flex-shrink-0">
                    {preview &&
                    fileObj.file.type.startsWith("image/") &&
                    fileObj.status === "success" ? (
                      <img
                        src={fileObj.url || URL.createObjectURL(fileObj.file)}
                        alt={fileObj.file.name}
                        className="w-10 h-10 object-cover rounded"
                      />
                    ) : (
                      <FileIcon size={20} className="text-gray-400" />
                    )}
                  </div>

                  {/* Info fichier */}
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-gray-900 truncate">
                      {fileObj.file.name}
                    </p>
                    <p className="text-xs text-gray-500">
                      {(fileObj.file.size / 1024 / 1024).toFixed(2)} MB
                    </p>
                  </div>

                  {/* Statut */}
                  <div className="flex items-center space-x-2">
                    {fileObj.status === "uploading" && (
                      <Loader size={16} className="text-blue-500 animate-spin" />
                    )}

                    {fileObj.status === "success" && (
                      <CheckCircle size={16} className="text-green-500" />
                    )}

                    {fileObj.status === "error" && (
                      <div className="flex items-center space-x-1">
                        <AlertCircle size={16} className="text-red-500" />
                        {fileObj.error && (
                          <span className="text-xs text-red-600" title={fileObj.error}>
                            Erreur
                          </span>
                        )}
                      </div>
                    )}

                    {/* Bouton supprimer */}
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        removeFile(fileObj);
                      }}
                      className="p-1 rounded text-gray-400 hover:text-red-500 hover:bg-red-50"
                    >
                      <X size={14} />
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Messages d'erreur globaux */}
      {files.some((f) => f.status === "error") && (
        <div className="p-3 bg-red-50 border border-red-200 rounded-lg">
          <div className="flex items-center space-x-2">
            <AlertCircle size={16} className="text-red-500" />
            <p className="text-sm text-red-700">
              Certains fichiers n'ont pas pu être uploadés
            </p>
          </div>
        </div>
      )}
    </div>
  );
};

export default FileUpload;
