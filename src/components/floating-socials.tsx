
"use client";

import Link from "next/link";
import { Button } from "./ui/button";
import { Instagram, Linkedin, Facebook, Youtube } from "lucide-react";
import { useState, useEffect } from "react";
import { client } from "@/sanity/lib/client";
import { SITE_SETTINGS_QUERY } from "@/sanity/lib/queries";

const defaults = {
  instagramUrl: "https://www.instagram.com/ijccindia?igsh=YW41MzJzNDY2M25y",
  linkedinUrl: "https://www.linkedin.com/company/indo-japan-chamber-of-commerce/",
  facebookUrl: "https://www.facebook.com/people/Indo-Japan-Chamber-of-Commerce/61573931145126/",
  youtubeUrl: "https://youtube.com/@ijcc-q2j?si=w7a8WSiep6_c3he3",
};

export function FloatingSocials() {
  const [links, setLinks] = useState(defaults);

  useEffect(() => {
    client
      .fetch(SITE_SETTINGS_QUERY)
      .then((s) => {
        if (s) {
          setLinks({
            instagramUrl: s.instagramUrl || defaults.instagramUrl,
            linkedinUrl: s.linkedinUrl || defaults.linkedinUrl,
            facebookUrl: s.facebookUrl || defaults.facebookUrl,
            youtubeUrl: s.youtubeUrl || defaults.youtubeUrl,
          });
        }
      })
      .catch(() => {});
  }, []);

  return (
    <div className="fixed left-0 top-1/2 -translate-y-1/2 z-50 hidden md:flex flex-col gap-1 p-1 bg-background/50 backdrop-blur-sm rounded-r-lg">
      <Button asChild variant="ghost" size="sm" className="h-8 w-8">
        <Link href={links.instagramUrl} target="_blank" rel="noopener noreferrer" title="Instagram">
          <Instagram className="h-4 w-4" />
           <span className="sr-only">Instagram</span>
        </Link>
      </Button>
      <Button asChild variant="ghost" size="sm" className="h-8 w-8">
        <Link href={links.linkedinUrl} target="_blank" rel="noopener noreferrer" title="LinkedIn">
          <Linkedin className="h-4 w-4" />
          <span className="sr-only">LinkedIn</span>
        </Link>
      </Button>
      <Button asChild variant="ghost" size="sm" className="h-8 w-8">
        <Link href={links.facebookUrl} target="_blank" rel="noopener noreferrer" title="Facebook">
          <Facebook className="h-4 w-4" />
          <span className="sr-only">Facebook</span>
        </Link>
      </Button>
      <Button asChild variant="ghost" size="sm" className="h-8 w-8">
        <Link href={links.youtubeUrl} target="_blank" rel="noopener noreferrer" title="YouTube">
          <Youtube className="h-4 w-4" />
          <span className="sr-only">YouTube</span>
        </Link>
      </Button>
    </div>
  );
}
