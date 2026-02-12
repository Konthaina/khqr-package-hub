import { useEffect, useMemo, useRef, useState, type ChangeEvent } from "react";
import { KHQRGenerator } from "konthaina-khqr";
import KhqrKeypad, { KEYPAD_KEYS } from "@/components/KhqrKeypad";

type Currency = "KHR" | "USD";

type KhqrProfile = {
    accountId: string;
    merchantName: string;
    currency: Currency;
    city: string;
    isStatic: boolean;
    amount?: number;
    showZeroAmount?: boolean;
};

const khqrProfile: KhqrProfile = {
    accountId: "kon_thaina@cadi",
    merchantName: "Konthaina Coder",
    currency: "KHR",
    city: "Phnom Penh",
    isStatic: true,
    amount: undefined,
    showZeroAmount: true,
};

function formatAmount(
    amount: number | undefined,
    currency: Currency,
    showZeroAmount = true
) {
    if (typeof amount !== "number") return showZeroAmount ? "0" : "";
    const fractionDigits = currency === "USD" ? 2 : 0;

    return new Intl.NumberFormat("en-US", {
        minimumFractionDigits: fractionDigits,
        maximumFractionDigits: fractionDigits,
    }).format(amount);
}

function formatInputWithCommas(value: string, currency: Currency) {
    if (!value) return "";
    const [integerRaw, decimalRaw] = value.split(".");
    const integerPart = integerRaw === "" ? "0" : integerRaw;
    const formattedInteger = integerPart.replace(/\B(?=(\d{3})+(?!\d))/g, ",");

    if (currency === "USD") {
        if (value.includes(".")) {
            return `${formattedInteger}.${decimalRaw ?? ""}`;
        }
        return formattedInteger;
    }

    return formattedInteger;
}

export default function KhqrCard() {
    const khqrLogoSrc = `${import.meta.env.BASE_URL}khqr.svg`;
    const [currency, setCurrency] = useState<Currency>(khqrProfile.currency);
    const [amountInput, setAmountInput] = useState<string>(() => {
        if (typeof khqrProfile.amount === "number") {
            return khqrProfile.amount.toString();
        }
        return "";
    });

    // --- NEW: refs for auto-sizing input by real pixel width (no right-side gap) ---
    const amountMeasureRef = useRef<HTMLSpanElement>(null);
    const amountInputRef = useRef<HTMLInputElement>(null);

    useEffect(() => {
        if (currency === "KHR" && amountInput.includes(".")) {
            setAmountInput(amountInput.split(".")[0]);
        }
    }, [currency, amountInput]);

    useEffect(() => {
        setAmountInput("");
    }, [currency]);

    const amountValue = useMemo(() => {
        if (!amountInput) return undefined;
        const parsed = Number(amountInput);
        if (!Number.isFinite(parsed)) return undefined;
        if (currency === "USD") {
            return Math.round(parsed * 100) / 100;
        }
        return Math.round(parsed);
    }, [amountInput, currency]);

    const maxAmount = currency === "USD" ? 20000 : 100000000;
    const isStatic = khqrProfile.isStatic && amountValue === undefined;

    const normalizeAmountInput = (value: string) => {
        if (!value) return value;
        if (currency === "KHR") {
            return value.replace(/^0+(?=\d)/, "");
        }
        if (currency === "USD") {
            let normalized = value;
            if (
                normalized.length > 1 &&
                normalized.startsWith("0") &&
                normalized[1] !== "."
            ) {
                normalized = normalized.replace(/^0+/, "");
                if (!normalized) normalized = "0";
            }
            if (normalized.startsWith(".")) {
                normalized = `0${normalized}`;
            }
            return normalized;
        }
        return value;
    };

    const isValidAmountInput = (value: string) => {
        const amountPattern = currency === "USD" ? /^\d*(\.\d{0,2})?$/ : /^\d*$/;
        if (!amountPattern.test(value)) return false;
        if (!value) return true;

        const parsed = Number(value);
        if (!Number.isFinite(parsed)) return false;
        return parsed <= maxAmount;
    };

    const handleAmountChange = (event: ChangeEvent<HTMLInputElement>) => {
        const next = event.target.value.replace(/,/g, "");
        if (next === "") {
            setAmountInput("");
            return;
        }

        const normalized = normalizeAmountInput(next);
        if (!isValidAmountInput(normalized)) return;

        setAmountInput(normalized);
    };

    const handleKeypadPress = (value: string) => {
        if (value === "backspace") {
            setAmountInput((prev) => prev.slice(0, -1));
            return;
        }

        setAmountInput((prev) => {
            const next = `${prev}${value}`;
            const normalized = normalizeAmountInput(next);
            if (!isValidAmountInput(normalized)) return prev;
            return normalized;
        });
    };

    const { qrImageUrl } = useMemo(() => {
        const gen = new KHQRGenerator("individual")
            .setStatic(isStatic)
            .setBakongAccountId(khqrProfile.accountId)
            .setMerchantName(khqrProfile.merchantName)
            .setCurrency(currency)
            .setTerminalLabel("KONTHAINA-CODER")
            .setStoreLabel("KONTHAINA-CODER STORE")
            .setMobileNumber("+85515502705")
            .setMerchantCity(khqrProfile.city);

        if (typeof amountValue === "number") {
            gen.setAmount(amountValue);
        }

        const { qr } = gen.generate();

        return {
            qrImageUrl: `https://api.qrserver.com/v1/create-qr-code/?size=240x240&data=${encodeURIComponent(
                qr
            )}`,
        };
    }, [currency, amountValue, isStatic]);

    const amountPlaceholder = formatAmount(
        undefined,
        currency,
        khqrProfile.showZeroAmount
    );

    const displayAmount = formatInputWithCommas(amountInput, currency);
    const amountSizingValue = displayAmount || amountPlaceholder || "0";

    // --- NEW: auto-size input to exact pixel width of the text (no right-side space) ---
    useEffect(() => {
        const span = amountMeasureRef.current;
        const input = amountInputRef.current;
        if (!span || !input) return;

        // ensure span measures the same string the input shows
        span.textContent = amountSizingValue;

        const w = Math.ceil(span.getBoundingClientRect().width);

        // Small guard so it never collapses too tight
        input.style.width = `${Math.max(w, 8)}px`;
    }, [amountSizingValue, currency]);

    const keypadDisabledKeys = KEYPAD_KEYS[currency].filter((key) => {
        if (key === "backspace") return false;
        if (currency === "KHR" && amountInput === "" && (key === "0" || key === "00")) {
            return true;
        }
        if (amountInput === "0" && (key === "0" || key === "00")) {
            return true;
        }
        const normalized = normalizeAmountInput(`${amountInput}${key}`);
        return !isValidAmountInput(normalized);
    });

    return (
        <section className="flex w-full justify-center">
            <div className="flex w-full max-w-[760px] flex-col items-center">
                {/* Currency Switcher */}
                <div className="mb-6 flex w-full max-w-[720px] justify-left">
                    <div className="flex overflow-hidden rounded-[16px] text-xs font-bold uppercase text-[#E1232E]">
                        <button
                            type="button"
                            onClick={() => setCurrency("KHR")}
                            className={`px-6 py-3 transition-colors ${currency === "KHR"
                                ? "bg-[#E1232E] text-white"
                                : "bg-white text-[#E1232E]"
                                }`}
                        >
                            KHR
                        </button>
                        <button
                            type="button"
                            onClick={() => setCurrency("USD")}
                            className={`px-6 py-3 transition-colors ${currency === "USD"
                                ? "bg-[#E1232E] text-white"
                                : "bg-white text-[#E1232E]"
                                }`}
                        >
                            USD
                        </button>
                    </div>
                </div>

                <div className="flex w-full items-stretch justify-center gap-6">
                    <KhqrKeypad
                        currency={currency}
                        onPress={handleKeypadPress}
                        disabledKeys={keypadDisabledKeys}
                    />

                    <div className="w-full max-w-[360px]">
                        <div className="relative overflow-hidden rounded-[20px] text-black shadow-lg">
                            <div
                                className="
                  relative flex h-14 items-center justify-center bg-[#E1232E]
                  after:content-[''] after:absolute after:top-full after:-mt-px after:-right-px
                  after:h-10 after:w-10 after:bg-[#E1232E]
                  after:[clip-path:polygon(0_0,100%_0,100%_100%)]
                  after:pointer-events-none
                "
                            >
                                <img
                                    src={khqrLogoSrc}
                                    alt="KHQR"
                                    className="h-4 w-auto"
                                    loading="eager"
                                    decoding="async"
                                />
                            </div>

                            <div className="bg-white px-12 pt-6">
                                <div className="space-y-2">
                                    <p className="text-sm font-medium text-gray-800">
                                        {khqrProfile.merchantName}
                                    </p>

                                    <div className="flex items-center gap-2">
                                        <label htmlFor="khqr-amount" className="sr-only">
                                            Amount
                                        </label>

                                        {/* NEW: hidden measurer span (exact width) */}
                                        <span
                                            ref={amountMeasureRef}
                                            aria-hidden="true"
                                            className="invisible absolute -z-10 whitespace-pre text-4xl font-medium leading-none"
                                        >
                                            {amountSizingValue}
                                        </span>

                                        <input
                                            ref={amountInputRef}
                                            id="khqr-amount"
                                            name="khqr-amount"
                                            type="text"
                                            inputMode={currency === "USD" ? "decimal" : "numeric"}
                                            autoComplete="off"
                                            placeholder={amountPlaceholder}
                                            value={displayAmount}
                                            onChange={handleAmountChange}
                                            className="bg-transparent text-4xl font-medium leading-none text-gray-900 placeholder:text-gray-300 focus:outline-none caret-gray-900"
                                        />

                                        <span className="text-sm font-medium uppercase text-gray-800">
                                            {currency}
                                        </span>
                                    </div>
                                </div>

                                <div className="-mx-12 mt-4 border-t border-dashed border-black/20" />

                                <div className="relative mx-auto mt-10 aspect-square w-full bg-white">
                                    <img
                                        src={qrImageUrl}
                                        alt={`KHQR for ${khqrProfile.merchantName}`}
                                        className="h-full w-full object-contain"
                                        loading="lazy"
                                        decoding="async"
                                    />
                                    <img
                                        src={`${import.meta.env.BASE_URL}bakong.png`}
                                        alt="Bakong"
                                        className="absolute left-1/2 top-1/2 h-[16%] w-[16%] -translate-x-1/2 -translate-y-1/2 rounded-full bg-white p-[1%]"
                                        loading="lazy"
                                        decoding="async"
                                    />
                                </div>
                            </div>

                            <div className="bg-white px-12 py-6 text-center text-xs text-gray-600"></div>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
}
