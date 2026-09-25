import { ImageResponse } from 'next/og';

// Route segment config
export const runtime = 'edge';

// Image metadata
export const size = {
  width: 256,
  height: 256,
};
export const contentType = 'image/png';

// Image generation
export default function Icon() {
  return new ImageResponse(
    (
      // ImageResponse JSX element
      <div
        style={{
          width: '100%',
          height: '100%',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          background: '#18181b', // Zinc-900
          borderRadius: '56px',
        }}
      >
        <div
          style={{
            display: 'flex',
            color: '#eab308', // Yellow-500
            fontSize: 160,
            fontWeight: 'bold',
            fontFamily: 'sans-serif',
          }}
        >
          M
        </div>
      </div>
    ),
    // ImageResponse options
    {
      ...size,
    }
  );
}
