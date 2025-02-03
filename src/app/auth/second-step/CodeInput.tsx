import React, { useState, useRef } from "react";

type OTPInputProps = {
    length?: number;
    onChange?: (otp: string) => void;
    disabled?: boolean;
};

const OTPInput: React.FC<OTPInputProps> = ({ length = 6, onChange, disabled = false }) => {
    const otpLength = Math.min(Math.max(length, 1), 8);
    const [otp, setOtp] = useState<string[]>(new Array(otpLength).fill(""));
    const inputRefs = useRef<(HTMLInputElement | null)[]>([]);

    const updateOtp = (newOtp: string[]) => {
        setOtp(newOtp);
        if (onChange) {
            onChange(newOtp.join(""));
        }
    };

    const handleChange = (index: number, e: React.ChangeEvent<HTMLInputElement>) => {
        if (disabled) return;
        const value = e.target.value;
        if (!/^[0-9]?$/.test(value)) return;

        const newOtp = [...otp];
        newOtp[index] = value;
        updateOtp(newOtp);

        if (value && index < otpLength - 1) {
            inputRefs.current[index + 1]?.focus();
        }
    };

    const handleKeyDown = (index: number, e: React.KeyboardEvent<HTMLInputElement>) => {
        if (disabled) return;
        if (e.key === "Backspace" && !otp[index] && index > 0) {
            inputRefs.current[index - 1]?.focus();
        }
    };

    const handlePaste = (e: React.ClipboardEvent<HTMLInputElement>) => {
        if (disabled) return;
        e.preventDefault();
        const pasteData = e.clipboardData.getData("text").slice(0, otpLength).replace(/\D/g, "");
        const newOtp = otp.map((_, i) => pasteData[i] || "");
        updateOtp(newOtp);

        newOtp.forEach((_, i) => {
            if (inputRefs.current[i]) {
                inputRefs.current[i]!.value = newOtp[i] || "";
            }
        });
    };

    return (
        <div className={"w-full max-w-full flex gap-2 justify-between"}>
            {otp.map((_, index) => (
                <input
                    key={index}
                    ref={(el) => {
                        inputRefs.current[index] = el;
                    }}
                    type="text"
                    maxLength={1}
                    value={otp[index]}
                    onChange={(e) => handleChange(index, e)}
                    onKeyDown={(e) => handleKeyDown(index, e)}
                    onPaste={handlePaste}
                    disabled={disabled}
                    className={`text-2xl font-semibold w-full max-w-14 h-14 text-center border rounded-md outline-none focus:border-gray-500 focus:ring-2 focus:ring-gray-500 disabled:bg-gray-200 disabled:cursor-not-allowed`}
                />
            ))}
        </div>
    );
};

export default OTPInput;
