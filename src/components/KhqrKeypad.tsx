import { useEffect, useState } from "react";

type Currency = "KHR" | "USD";

type KhqrKeypadProps = {
    currency: Currency;
    onPress: (value: string) => void;
    disabledKeys?: string[];
};

export const KEYPAD_KEYS: Record<Currency, readonly string[]> = {
    USD: [
        "1",
        "2",
        "3",
        "4",
        "5",
        "6",
        "7",
        "8",
        "9",
        ".",
        "0",
        "backspace",
    ],
    KHR: [
        "1",
        "2",
        "3",
        "4",
        "5",
        "6",
        "7",
        "8",
        "9",
        "00",
        "0",
        "backspace",
    ],
};

const useDesktopKeypad = () => {
    const [showKeypad, setShowKeypad] = useState(false);

    useEffect(() => {
        if (typeof window === "undefined") return;
        const media = window.matchMedia("(hover: hover) and (pointer: fine)");
        const update = () => setShowKeypad(media.matches);
        update();
        if (typeof media.addEventListener === "function") {
            media.addEventListener("change", update);
            return () => media.removeEventListener("change", update);
        }
        media.addListener(update);
        return () => media.removeListener(update);
    }, []);

    return showKeypad;
};

export default function KhqrKeypad({
    currency,
    onPress,
    disabledKeys,
}: KhqrKeypadProps) {
    const showKeypad = useDesktopKeypad();
    if (!showKeypad) return null;

    const disabledSet = new Set(disabledKeys ?? []);

    return (
        <div className="w-[360px] shrink-0">
            <div className="flex h-full w-full flex-col rounded-[20px] bg-white p-4 text-gray-900 shadow-lg">
                <div className="grid flex-1 grid-cols-3 grid-rows-4 gap-3">
                    {KEYPAD_KEYS[currency].map((key) => {
                        const isBackspace = key === "backspace";
                        const isDisabled = disabledSet.has(key);
                        const label = isBackspace ? "Del" : key;

                        return (
                            <button
                                key={key}
                                type="button"
                                disabled={isDisabled}
                                aria-label={isBackspace ? "Delete" : `Key ${label}`}
                                onClick={() => onPress(key)}
                                className="rounded-[12px] bg-gray-100 text-lg font-semibold text-gray-800 shadow-sm transition-colors enabled:hover:bg-gray-200 enabled:active:bg-gray-300 disabled:cursor-not-allowed disabled:opacity-40"
                            >
                                {label}
                            </button>
                        );
                    })}
                </div>
            </div>
        </div>
    );
}
