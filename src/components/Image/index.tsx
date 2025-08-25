export default function Image({ src, alt, width, hasRoundedCorners, hasShadow, height, margin, className }: {
    src: string;
    alt: string;
    width?: number;
    hasRoundedCorners?: boolean;
    hasShadow?: boolean;
    height?: number;
    margin?: string;
    className?: string;
}) {
    return (
        <img
            src={src}
            alt={alt}
            width={width}
            height={height}
            className={className}
            style={{
                borderRadius: hasRoundedCorners ? '16px' : '0',
                margin: margin,
                filter: hasShadow ? 'drop-shadow(0 0 10px rgba(0, 0, 0, 0.2))' : 'none',
            }}
        />
    );
}
