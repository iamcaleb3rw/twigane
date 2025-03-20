"use client";

import { ArrowRight, Copy } from "lucide-react";
import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "./ui/dialog";
import SocialMediaButton from "./SocialMediaButton";
import { FaWhatsapp, FaLinkedin, FaFacebook } from "react-icons/fa";
import { RiTwitterXFill } from "react-icons/ri";
import { MdEmail } from "react-icons/md";
import Divider from "./Divider";
import { usePathname } from "next/navigation";

const InviteButton = () => {
  const pathname = usePathname();
  const [copied, setCopied] = useState(false);

  // Get the full URL safely with fallback for SSR
  const getFullUrl = () => {
    if (typeof window === "undefined") return "";
    return window.location.origin + pathname;
  };

  const fullUrl = getFullUrl();
  const shareText = "Join me in this amazing learning community!";

  const handleCopy = async () => {
    try {
      // Fallback for browsers without clipboard API
      if (!navigator.clipboard) {
        const textArea = document.createElement("textarea");
        textArea.value = fullUrl;
        textArea.style.position = "fixed";
        document.body.appendChild(textArea);
        textArea.focus();
        textArea.select();

        try {
          document.execCommand("copy");
          setCopied(true);
        } catch (err) {
          console.error("Fallback: Copying failed", err);
        }

        document.body.removeChild(textArea);
      } else {
        await navigator.clipboard.writeText(fullUrl);
        setCopied(true);
      }

      setTimeout(() => setCopied(false), 2000); // Reset after 2 seconds
    } catch (err) {
      console.error("Failed to copy: ", err);
    }
  };

  // Handle native sharing if available
  const handleNativeShare = () => {
    if (
      typeof navigator !== "undefined" &&
      typeof navigator.share === "function"
    ) {
      navigator
        .share({
          title: "Join our learning community",
          text: shareText,
          url: fullUrl,
        })
        .catch((err) => console.error("Error sharing:", err));
    }
  };

  return (
    <Dialog>
      <DialogTrigger>
        <div className="bg-foreground hover:scale-[101%] transition-transform cursor-pointer rounded-full h-10 text-background max-w-[270px] p-1">
          <div className="w-full h-full flex justify-between items-center rounded-full">
            <p className="ml-3 text-sm md:text-base">Invite other students</p>
            <span className="rounded-full bg-background text-foreground h-full aspect-square flex items-center justify-center">
              <ArrowRight className="h-4 w-4" />
            </span>
          </div>
        </div>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Invite classmates</DialogTitle>
          <DialogDescription>
            Help your friends find the best way of learning. Invite them to the
            community.
          </DialogDescription>
        </DialogHeader>
        <div>
          <h1 className="text-lg font-bold">
            Share on your favorite platforms
          </h1>
          <hr />
          <div className="flex flex-wrap gap-2 mt-2">
            {/* WhatsApp */}
            <SocialMediaButton
              title="WhatsApp"
              icon={FaWhatsapp}
              color="#25D366"
              url={`https://wa.me/?text=${encodeURIComponent(`${shareText} ${fullUrl}`)}`}
            />

            {/* LinkedIn */}
            <SocialMediaButton
              title="LinkedIn"
              icon={FaLinkedin}
              color="#0077B5"
              url={`https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(fullUrl)}`}
            />

            {/* Twitter / X */}
            <SocialMediaButton
              title="X (Twitter)"
              icon={RiTwitterXFill}
              color="#000"
              url={`https://twitter.com/intent/tweet?url=${encodeURIComponent(fullUrl)}&text=${encodeURIComponent(shareText)}`}
            />

            {/* Facebook */}
            <SocialMediaButton
              title="Facebook"
              icon={FaFacebook}
              color="#1877F2"
              url={`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(fullUrl)}`}
            />

            {/* Email */}
            <SocialMediaButton
              title="Email"
              icon={MdEmail}
              color="#D44638"
              url={`mailto:?subject=${encodeURIComponent("Join our learning community")}&body=${encodeURIComponent(`${shareText} ${fullUrl}`)}`}
            />
          </div>

          {/* Native Share API button for mobile devices */}
          {typeof navigator !== "undefined" &&
            typeof navigator.share === "function" && (
              <>
                <Divider />
                <button
                  onClick={handleNativeShare}
                  className="w-full py-2 px-4 bg-primary text-primary-foreground rounded-md hover:bg-primary/90 transition-colors"
                >
                  Share using your device
                </button>
              </>
            )}

          <Divider />
          <p className="text-sm">Copy the link</p>
          <div className="bg-muted p-3 rounded-lg w-full flex items-center justify-between">
            <span className="truncate">{fullUrl}</span>
            <button
              onClick={handleCopy}
              className="ml-2 p-1 hover:bg-background rounded-md transition-colors"
              aria-label="Copy link"
            >
              <Copy className="h-4 w-4 text-gray-500 hover:text-gray-700" />
            </button>
          </div>
          {copied && (
            <p className="text-xs text-green-500 mt-1">Copied to clipboard!</p>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default InviteButton;
