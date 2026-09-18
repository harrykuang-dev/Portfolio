// Keep native details semantics and keyboard activation; defer closing until
// the content has folded away. A second click reverses from the current frame.
const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
document.querySelectorAll('details').forEach(details => {
  const summary = details.querySelector(':scope > summary');
  if (!summary) return;
  const content = document.createElement('div');
  content.className = 'disclosure-content';
  while (summary.nextSibling) content.append(summary.nextSibling);
  details.append(content);
  let animation;
  let expanded = details.open;
  details.dataset.expanded = String(expanded);

  const finish = () => {
    if (animation) animation.cancel();
    animation = null;
    details.open = expanded;
    content.style.removeProperty('height');
    content.style.removeProperty('overflow');
    content.inert = !expanded;
  };
  summary.addEventListener('click', event => {
    if (event.target.closest('a')) return;
    event.preventDefault();
    const height = details.open ? content.getBoundingClientRect().height : 0;
    const opacity = details.open ? getComputedStyle(content).opacity : 0;
    expanded = !expanded;
    details.dataset.expanded = String(expanded);
    if (animation) animation.cancel();
    animation = null;
    if (reducedMotion.matches) { finish(); return; }
    details.open = true;
    content.inert = !expanded;
    // Mount fixed-height embeds before measuring the opening destination.
    if (expanded) {
      if (details.matches('[data-media-url]')) syncPreview(details);
      if (details.matches('#videos, #social')) {
        details.querySelectorAll('[data-media-url]').forEach(preview => {
          preview.open = true;
          syncPreview(preview);
        });
      }
    }
    content.style.overflow = 'hidden';
    animation = content.animate([
      { height: `${height}px`, opacity },
      { height: expanded ? `${content.scrollHeight}px` : '0px', opacity: expanded ? 1 : 0 }
    ], { duration: expanded ? 460 : 360, easing: 'cubic-bezier(0.22, 1, 0.36, 1)', fill: 'both' });
    animation.onfinish = finish;
  });
  // Native/programmatic toggles (including opening embedded previews).
  details.addEventListener('toggle', () => {
    if (animation) return;
    expanded = details.open;
    details.dataset.expanded = String(expanded);
    content.inert = !expanded;
  });
  reducedMotion.addEventListener('change', finish);
});

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
