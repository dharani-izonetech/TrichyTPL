export function getYoutubeId(url) {
  if (!url) return null;
  try {
    const parsed = new URL(url);
    if (parsed.hostname.includes("youtube.com")) {
      if (parsed.pathname === "/watch") return parsed.searchParams.get("v");
      if (parsed.pathname.startsWith("/live/")) return parsed.pathname.split("/").filter(Boolean)[1];
      if (parsed.pathname.startsWith("/embed/")) return parsed.pathname.split("/").filter(Boolean)[1];
      if (parsed.pathname.startsWith("/shorts/")) return parsed.pathname.split("/").filter(Boolean)[1];
    }
    if (parsed.hostname.includes("youtu.be")) return parsed.pathname.replace("/", "");
  } catch (error) {
    return null;
  }
  return null;
}

export function toYoutubeEmbedUrl(url) {
  const videoId = getYoutubeId(url);
  return videoId ? `https://www.youtube.com/embed/${videoId}` : null;
}

export function getYoutubeThumbnail(url) {
  const videoId = getYoutubeId(url);
  return videoId ? `https://img.youtube.com/vi/${videoId}/maxresdefault.jpg` : null;
}
