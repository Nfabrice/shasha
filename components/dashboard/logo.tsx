export function ShashaMark({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 48 48"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      aria-hidden="true"
    >
      <g>
        {Array.from({ length: 8 }).map((_, i) => {
          const angle = (i * 360) / 8;
          return (
            <rect
              key={i}
              x="22.5"
              y="4"
              width="3"
              height="14"
              rx="1.5"
              fill={i % 2 === 0 ? "#F2711D" : "#F7A15A"}
              transform={`rotate(${angle} 24 24)`}
            />
          );
        })}
      </g>
      <circle cx="24" cy="24" r="6.5" fill="#F2711D" />
    </svg>
  );
}

export function Logo({ className }: { className?: string }) {
  return (
    <div className={className}>
      <div className="flex items-center gap-2.5">
        <ShashaMark className="h-9 w-9 shrink-0" />
        <div className="flex flex-col leading-tight">
          <span className="text-[15px] font-bold tracking-tight text-navy-900">SHASHA</span>
          <span className="text-[10px] font-semibold tracking-[0.2em] text-brand-500">NETWORK</span>
        </div>
      </div>
    </div>
  );
}
