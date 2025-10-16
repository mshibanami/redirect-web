export default function Image({ src, alt, width, hasRoundedCorners, hasShadow, height, margin = "0 0 20px 0", className }: {
    src: string;
    alt: string;
    hasRoundedCorners?: boolean;
    hasShadow?: boolean;
    width?: number;
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
                filter: hasShadow ? 'drop-shadow(0 3px 6px rgba(0, 0, 0, 0.1))' : 'none',
            }}
        />
    );
}
