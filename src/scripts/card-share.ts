document.querySelectorAll<HTMLButtonElement>("[data-share-button]").forEach((button) => {
  button.addEventListener("click", async () => {
    const shareData = {
      title: button.dataset.shareTitle ?? document.title,
      text: button.dataset.shareText ?? "",
      url: button.dataset.shareUrl ?? window.location.href,
    };

    if (navigator.share) {
      try {
        await navigator.share(shareData);
        return;
      } catch {
        return;
      }
    }

    try {
      await navigator.clipboard.writeText(shareData.url);
      const original = button.textContent;
      button.textContent = "Link copied!";
      setTimeout(() => {
        button.textContent = original;
      }, 2000);
    } catch {
      window.location.href = `mailto:?subject=${encodeURIComponent(shareData.title)}&body=${encodeURIComponent(shareData.url)}`;
    }
  });
});
