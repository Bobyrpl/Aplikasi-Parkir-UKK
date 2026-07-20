export function PageHeader({ eyebrow, title, description }) {
    return (
        <div className="mb-8">
            {eyebrow && (
                <p className="text-xs font-mono text-[#F4B400] mb-1 tracking-wider">
                    {eyebrow}
                </p>
            )}
            <h1 className="font-display text-2xl text-[#EDEFF2]">{title}</h1>
            {description && (
                <p className="text-sm text-[#8B94A3] mt-1">{description}</p>
            )}
        </div>
    );
}

export function StatCard({ label, value, accent = '#F4B400' }) {
    return (
        <div className="rounded-xl bg-[#1B212B] border border-white/5 p-5">
            <p className="text-xs font-mono text-[#8B94A3] mb-2">{label}</p>
            <p
                className="font-display text-3xl"
                style={{ color: accent }}
            >
                {value}
            </p>
        </div>
    );
}

export function Card({ children, className = '' }) {
    return (
        <div className={`rounded-xl bg-[#1B212B] border border-white/5 ${className}`}>
            {children}
        </div>
    );
}

export function Badge({ children, tone = 'neutral' }) {
    const tones = {
        neutral: 'bg-white/10 text-[#C3C9D3]',
        success: 'bg-[#35C48D]/15 text-[#35C48D]',
        danger: 'bg-[#E5484D]/15 text-[#E5484D]',
        warning: 'bg-[#F4B400]/15 text-[#F4B400]',
    };
    return (
        <span className={`inline-block rounded-full px-2.5 py-0.5 text-xs font-mono ${tones[tone]}`}>
            {children}
        </span>
    );
}

export function Table({ columns, children }) {
    return (
        <div className="overflow-x-auto rounded-xl border border-white/5">
            <table className="w-full text-sm">
                <thead>
                    <tr className="bg-[#1F2530] text-left">
                        {columns.map((col) => (
                            <th
                                key={col}
                                className="px-4 py-3 text-xs font-mono text-[#8B94A3] tracking-wider"
                            >
                                {col}
                            </th>
                        ))}
                    </tr>
                </thead>
                <tbody className="divide-y divide-white/5">{children}</tbody>
            </table>
        </div>
    );
}

export function Button({ children, variant = 'primary', className = '', ...props }) {
    const variants = {
        primary: 'bg-[#F4B400] text-[#14181F] hover:bg-[#e0a800]',
        ghost: 'bg-transparent text-[#C3C9D3] hover:bg-white/5 border border-white/10',
        danger: 'bg-[#E5484D]/15 text-[#E5484D] hover:bg-[#E5484D]/25',
    };
    return (
        <button
            className={`rounded-md px-4 py-2 text-sm font-medium transition-colors disabled:opacity-60 ${variants[variant]} ${className}`}
            {...props}
        >
            {children}
        </button>
    );
}

export function Input(props) {
    return (
        <input
            {...props}
            className={`w-full rounded-md bg-[#14181F] border border-white/10 px-3 py-2 text-sm text-[#EDEFF2] focus:outline-none focus:ring-2 focus:ring-[#F4B400] focus:border-transparent ${props.className || ''}`}
        />
    );
}
