import React from "react";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

type Props = {
    children?: React.ReactNode;
    label: string;
    items: string[];
};

const SelectField = (props: Props) => {
    return (
        <div className="w-full flex flex-col gap-2">
            <Label htmlFor="provider" className="leading-5 capitalize">
                {props.label}
            </Label>
            <Select>
                <SelectTrigger>
                    <SelectValue placeholder="none" />
                </SelectTrigger>
                <SelectContent>
                    {props.items.map(item => (
                        <SelectItem key={item} value={item}>
                            {item}
                        </SelectItem>
                    ))}
                </SelectContent>
            </Select>
        </div>
    );
};

export default SelectField;
