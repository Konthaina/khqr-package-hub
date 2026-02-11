import { useEffect, useMemo, useState, type ChangeEvent } from "react";
import { KHQRGenerator } from "konthaina-khqr";

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

export default function KhqrCard() {
    const khqrLogoSrc = `${import.meta.env.BASE_URL}khqr.svg`;
    const [currency, setCurrency] = useState<Currency>(khqrProfile.currency);
    const [amountInput, setAmountInput] = useState<string>(() => {
        if (typeof khqrProfile.amount === "number") {
            return khqrProfile.amount.toString();
        }
        return "";
    });

    useEffect(() => {
        if (currency === "KHR" && amountInput.includes(".")) {
            setAmountInput(amountInput.split(".")[0]);
        }
    }, [currency, amountInput]);

    const amountValue = useMemo(() => {
        if (!amountInput) return undefined;
        const parsed = Number(amountInput);
        if (!Number.isFinite(parsed)) return undefined;
        if (currency === "USD") {
            return Math.round(parsed * 100) / 100;
        }
        return Math.round(parsed);
    }, [amountInput, currency]);

    const isStatic = khqrProfile.isStatic && amountValue === undefined;

    const handleAmountChange = (event: ChangeEvent<HTMLInputElement>) => {
        const next = event.target.value.replace(/,/g, "");
        if (next === "") {
            setAmountInput("");
            return;
        }

        const amountPattern =
            currency === "USD" ? /^\d*(\.\d{0,2})?$/ : /^\d*$/;
        if (!amountPattern.test(next)) return;

        setAmountInput(next);
    };

    const { md5, isValid, qrImageUrl } = useMemo(() => {
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

        const { qr, md5 } = gen.generate();

        return {
            md5,
            isValid: KHQRGenerator.verify(qr),
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

    const amountSizingValue = amountInput || amountPlaceholder || "0";
    const amountInputWidth = Math.max(amountSizingValue.length, 1);

    return (
        <section className="flex w-full justify-center">
            <div className="w-full max-w-[360px]">

                {/* Currency Switcher */}
                <div className="mb-6 flex justify-left">
                    <div className="flex overflow-hidden rounded-[16px] text-xs font-bold uppercase text-[#E1232E]">
                        <button
                            type="button"
                            onClick={() => setCurrency("KHR")}
                            className={`px-6 py-3 transition-colors ${currency === "KHR" ? "bg-[#E1232E] text-white" : "bg-white text-[#E1232E]"
                                }`}
                        >
                            KHR
                        </button>
                        <button
                            type="button"
                            onClick={() => setCurrency("USD")}
                            className={`px-6 py-3 transition-colors ${currency === "USD" ? "bg-[#E1232E] text-white" : "bg-white text-[#E1232E]"
                                }`}
                        >
                            USD
                        </button>
                    </div>
                </div>

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

                    <div className="px-12 pt-6 bg-white">
                        <div className="space-y-2">
                            <p className="text-sm font-medium text-gray-800">
                                {khqrProfile.merchantName}
                            </p>

                            <div className="flex items-end gap-2">
                                <label htmlFor="khqr-amount" className="sr-only">
                                    Amount
                                </label>
                                <input
                                    id="khqr-amount"
                                    name="khqr-amount"
                                    type="text"
                                    inputMode={currency === "USD" ? "decimal" : "numeric"}
                                    autoComplete="off"
                                    placeholder={amountPlaceholder}
                                    value={amountInput}
                                    onChange={handleAmountChange}
                                    style={{ width: `${amountInputWidth}ch` }}
                                    className="bg-transparent text-4xl font-medium leading-none text-gray-900 placeholder:text-gray-300 focus:outline-none caret-transparent"
                                />
                                <span className="pb-3 text-sm font-medium uppercase text-gray-800">
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
                    <div className="px-12 py-6 text-center text-xs text-gray-600 bg-white"></div>
                </div>
            </div>
        </section >
    );
}
