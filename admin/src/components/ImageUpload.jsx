import { useEffect, useState } from "react";
import foodstuff from "../assets/images/web_logo.png";

const ImageUpload = ({
  value = "",
  onFileSelect,
  label = "Upload Image",
  helperText = "PNG, JPG, JPEG (Frontend brand theme)",
  accept = "image/*",
  required = false,
}) => {
  const [objectUrl, setObjectUrl] = useState("");

  const preview = objectUrl || value || "";

  // prevents memory leaks when user changes image many times
  useEffect(() => {
    return () => {
      if (objectUrl) URL.revokeObjectURL(objectUrl);
    };
  }, [objectUrl]);

  const handleChange = (event) => {
    const file = event.target.files?.[0];
    if (!file) return;

    if (objectUrl) URL.revokeObjectURL(objectUrl);

    const nextUrl = URL.createObjectURL(file);
    setObjectUrl(nextUrl);

    //
    // parent form needs file for FormData submit to backend
    if (typeof onFileSelect === "function") {
      onFileSelect(file);
    }
  };

  return (
    <label className="block w-full cursor-pointer rounded-xl border border-[#1f8b4c]/40 bg-[#0d2a1b] p-4 transition-colors hover:border-[#1f8b4c]">
      <div className="flex items-center gap-3">
        <img src={foodstuff} alt="MA Foodstuff" className="h-8 w-auto" />
        <div>
          <p className="text-sm font-semibold text-white">{label}</p>
          <p className="text-xs text-white/60">{helperText}</p>
        </div>
      </div>

      <input
        type="file"
        accept={accept}
        onChange={handleChange}
        required={required}
        className="mt-3 block w-full text-sm text-white file:mr-3 file:rounded-md file:border-0 file:bg-[#1f8b4c] file:px-3 file:py-2 file:text-white hover:file:bg-[#176a39]"
      />

      {preview ? (
        <img
          src={preview}
          alt="Preview"
          className="mt-4 h-36 w-full rounded-lg object-cover"
        />
      ) : null}
    </label>
  );
};

export default ImageUpload;
