// Custom Studio preview for hero slides: shows the uploaded image when
// present, otherwise the YouTube thumbnail for video slides.
import imageUrlBuilder from '@sanity/image-url';

const builder = imageUrlBuilder({
  projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID || '4j8vl1ls',
  dataset: process.env.NEXT_PUBLIC_SANITY_DATASET || 'production',
});

function youtubeId(url: string): string | null {
  if (!url) return null;
  const m = url.match(
    /(?:youtube\.com\/(?:watch\?v=|embed\/|shorts\/|live\/)|youtu\.be\/)([A-Za-z0-9_-]{6,})/
  );
  return m ? m[1] : null;
}

function thumbStyle(): React.CSSProperties {
  return { width: 40, height: 40, objectFit: 'cover', borderRadius: 4, flexShrink: 0 };
}

export function SlidePreview(props: {
  title?: React.ReactNode;
  subtitle?: React.ReactNode;
  media?: any;
  videoUrl?: string;
}) {
  const { title, subtitle, media, videoUrl } = props;
  let thumb: React.ReactNode = null;
  if (media?._ref || media?.asset?._ref) {
    // Raw Sanity image value -> build a CDN URL for it.
    const src = builder.image(media).width(80).height(80).fit('crop').url();
    thumb = <img src={src} alt="" style={thumbStyle()} />;
  } else if (videoUrl) {
    const id = youtubeId(videoUrl);
    if (id) {
      thumb = (
        <img
          src={`https://img.youtube.com/vi/${id}/hqdefault.jpg`}
          alt=""
          style={thumbStyle()}
        />
      );
    }
  }
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', minWidth: 0 }}>
      {thumb}
      <div style={{ minWidth: 0 }}>
        <div style={{ fontWeight: 500, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
          {title || 'Slide'}
        </div>
        {subtitle ? (
          <div style={{ fontSize: '0.8rem', opacity: 0.65 }}>{subtitle}</div>
        ) : null}
      </div>
    </div>
  );
}
