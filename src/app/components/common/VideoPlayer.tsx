interface VideoPlayerProps {
  url: string;
  thumbnail?: string;
  title?: string;
}

export default function VideoPlayer({ url, thumbnail, title }: VideoPlayerProps) {
  return (
    <div className="relative overflow-hidden rounded-2xl bg-gray-100 aspect-video">
      <video
        src={url}
        poster={thumbnail}
        controls
        playsInline
        className="w-full h-full object-cover"
        title={title}
      />
    </div>
  );
}
