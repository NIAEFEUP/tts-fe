import React from "react";

interface PageSizeSelectorProps {
    value: number;
    onChange: (value: number) => void;
    min?: number;
    max?: number;
}

export const PageSizeSelector: React.FC<PageSizeSelectorProps> = ({
    value,
    onChange,
    min = 1,
    max = 100,
}) => {
    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const raw = e.target.value;

        if (raw === "") {
            onChange(min);
            return;
        }

        const parsed = parseInt(raw, 10);
        if (Number.isNaN(parsed)) return;

        const clamped = Math.min(Math.max(parsed, min), max);
        onChange(clamped);
    };

    return (
        <div className="flex items-center gap-2 mb-4">
            <span className="text-sm text-gray-700">
                Cards por página:
            </span>

            <input
                type="number"
                className="w-20 rounded border px-2 py-1 text-sm"
                value={value}
                min={min}
                max={max}
                onChange={handleChange}
            />
        </div>
    );
};
