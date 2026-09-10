document.querySelectorAll('[data-language-link]').forEach(link => {
  link.addEventListener('click', () => {
    const target = new URL(link.href);
    target.hash = window.location.hash;
    link.href = target.href;
  });
});
function syncPreview(details) {
  const slot = details.querySelector('.embed-slot');
  let parent = details.parentElement;
  let visible = details.open;
  while (parent) {
    if (parent.tagName === 'DETAILS' && !parent.open) visible = false;
    parent = parent.parentElement;
  }
  if (!visible) { slot.replaceChildren(); return; }
  if (slot.childElementCount) return;
  const url = new URL(details.dataset.mediaUrl);
  let src;
  if (url.origin === 'https://www.instagram.com' && /^\/(p|reel)\/[A-Za-z0-9_-]+\/$/.test(url.pathname)) {
    src = url.href + 'embed/';
  } else if (url.origin === 'https://www.facebook.com') {
    const plugin = url.pathname.startsWith('/share/r/') ? 'video.php' : 'post.php';
    src = 'https://www.facebook.com/plugins/' + plugin + '?href=' + encodeURIComponent(url.href) + '&show_text=true&width=500';
  } else return;
  const iframe = document.createElement('iframe');
  iframe.src = src;
  iframe.title = details.dataset.previewTitle;
  iframe.allow = 'encrypted-media; picture-in-picture; fullscreen';
  iframe.referrerPolicy = 'strict-origin-when-cross-origin';
  slot.append(iframe);
}
document.querySelectorAll('[data-media-url]').forEach(details => {
  details.addEventListener('toggle', () => syncPreview(details));
  syncPreview(details);
});
document.querySelectorAll('#videos, #social').forEach(section => {
  section.addEventListener('toggle', () => {
    section.querySelectorAll('[data-media-url]').forEach(details => {
      if (section.open) details.open = true;
      syncPreview(details);
    });
  });
});

const creatorVideos = document.getElementById('creator-videos');
if (creatorVideos) {
  creatorVideos.addEventListener('toggle', () => {
    creatorVideos.querySelectorAll('iframe[data-src]').forEach(frame => {
      if (creatorVideos.open) {
        if (!frame.hasAttribute('src')) frame.src = frame.dataset.src;
      } else {
        frame.removeAttribute('src');
      }
    });
  });
}
