import React, { ComponentProps } from "react";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";

type Props = {
    children?: React.ReactNode;
    label: string;
} & Omit<ComponentProps<"input">, "className" | "id">;

const InputField = ({ label, ...props }: Props) => {
    return (
        <div className="w-full flex flex-col gap-2">
            <Label className="leading-5 capitalize" htmlFor={label}>
                {label}
            </Label>
            <Input
                id={label}
                className="text-xs placeholder:italic placeholder:text-xs placeholder:text-gray-400 rounded-s-xs"
                {...props}
            />
        </div>
    );
};

export default InputField;
