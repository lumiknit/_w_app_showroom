const defaultManifest = {
  name: "lumiknit's Apps",
  short_name: "lumiApps",
  icons: [
    {
      src: "./android-chrome-192x192.png",
      sizes: "192x192",
      type: "image/png",
    },
    {
      src: "./android-chrome-384x384.png",
      sizes: "384x384",
      type: "image/png",
    },
  ],
  theme_color: "#000000",
  background_color: "#000000",
  display: "standalone",
};

// Add manifest change detect, and
// change head tag
//    <link rel="manifest" href="./site.webmanifest" />
// with the blob. (blob link)
export const updateManifest = () => {
  const isDark = window.matchMedia("(prefers-color-scheme: dark)").matches;

  const manifest = {
    ...defaultManifest,
    theme_color: isDark ? "#000000" : "#ffffff",
    background_color: isDark ? "#000000" : "#ffffff",
  };

  // Remove existing manifest link
  const existingLink = document.querySelector('link[rel="manifest"]');
  if (existingLink) {
    existingLink.remove();
  }

  // Create blob and blob URL for manifest
  const manifestBlob = new Blob([JSON.stringify(manifest)], {
    type: "application/json",
  });
  const manifestUrl = URL.createObjectURL(manifestBlob);

  // Create new manifest link
  const link = document.createElement("link");
  link.rel = "manifest";
  link.href = manifestUrl;
  document.head.appendChild(link);
};

export const addMediaChangeUpdateManifestListener = () => {
  const mediaQuery = window.matchMedia("(prefers-color-scheme: dark)");

  // Update manifest on initial load
  updateManifest();

  // Listen for theme changes
  const handleThemeChange = () => {
    updateManifest();
  };

  // Modern browsers
  if (mediaQuery.addEventListener) {
    mediaQuery.addEventListener("change", handleThemeChange);
  } else {
    // Fallback for older browsers
    mediaQuery.addListener(handleThemeChange);
  }

  return () => {
    if (mediaQuery.removeEventListener) {
      mediaQuery.removeEventListener("change", handleThemeChange);
    } else {
      mediaQuery.removeListener(handleThemeChange);
    }
  };
};
