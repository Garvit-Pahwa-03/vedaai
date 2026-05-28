interface Props {
  width?: number;
  height?: number;
  className?: string;
}
export default function NoAssignmentsIcon({ width = 240, height = 240, className }: Props) {
  return (
    <svg
      width={width}
      height={height}
      viewBox="0 0 240 240"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
    >
      {/* Big grey circle - centered */}
      <circle cx="120" cy="120" r="90" fill="#e8eaf0" opacity="0.55" />

      {/* Document - centered in circle */}
      <rect x="80" y="70" width="80" height="105" rx="6" fill="white" stroke="#e5e7eb" strokeWidth="1.5" />

      {/* Line 1 - higher opacity */}
      <rect x="93" y="90" width="30" height="7" rx="3.5" fill="#9ca3af" opacity="1" />

      {/* Line 2 */}
      <rect x="93" y="105" width="54" height="7" rx="3.5" fill="#9ca3af" opacity="0.25" />

      {/* Line 3 */}
      <rect x="93" y="120" width="42" height="7" rx="3.5" fill="#9ca3af" opacity="0.25" />
      <rect x="93" y="135" width="42" height="7" rx="3.5" fill="#9ca3af" opacity="0.25" />
      <rect x="93" y="150" width="42" height="7" rx="3.5" fill="#9ca3af" opacity="0.25" />

      {/* Lines hidden behind magnifying glass */}
      <rect x="93" y="105" width="54" height="7" rx="3.5" fill="#9ca3af" opacity="0" />
      <rect x="93" y="135" width="42" height="7" rx="3.5" fill="#9ca3af" opacity="0" />


      {/* Magnifying glass circle - overlapping bottom-right of document */}
      <circle cx="145" cy="135" r="35" fill="white" stroke="#374151" strokeWidth="3.5" />

      {/* Red X - centered in magnifying glass */}
      <line x1="132" y1="122" x2="158" y2="148" stroke="#ef4444" strokeWidth="4" strokeLinecap="round" />
      <line x1="158" y1="122" x2="132" y2="148" stroke="#ef4444" strokeWidth="4" strokeLinecap="round" />
      {/* Magnifying glass handle */}
      <line x1="172" y1="162" x2="186" y2="176" stroke="#374151" strokeWidth="5" strokeLinecap="round" />

      {/* Sparkle dots */}
      <circle cx="210" cy="145" r="4" fill="#c4b5fd" opacity="0.6" />

      <rect x="170" y="45" width="70" height="38" fill="white" opacity="0.9" />
      <circle cx="185" cy="65" r="5" fill="#c4b5fd" opacity="0.6" />
      <rect x="200" y="59" width="30" height="12" rx="6" fill="#e5e7eb" opacity="0.9" />
      {/* 4-pointed star - change cx and cy to move it */}
{(() => {
  const cx = 55;  // ← change this to move LEFT/RIGHT
  const cy = 180;  // ← change this to move UP/DOWN
  const r = 7;   // ← change this to resize

  return (
    <path
      d={`M${cx} ${cy - r * 1.8}
          C${cx} ${cy - r * 1.8} ${cx + r * 0.4} ${cy - r * 0.4} ${cx + r * 1.8} ${cy}
          C${cx + r * 1.8} ${cy} ${cx + r * 0.4} ${cy + r * 0.4} ${cx} ${cy + r * 1.8}
          C${cx} ${cy + r * 1.8} ${cx - r * 0.4} ${cy + r * 0.4} ${cx - r * 1.8} ${cy}
          C${cx - r * 1.8} ${cy} ${cx - r * 0.4} ${cy - r * 0.4} ${cx} ${cy - r * 1.8} Z`}
      fill="#7ba7c7"
      opacity="0.65"
    />
  );
})()}
    </svg>
  );
}