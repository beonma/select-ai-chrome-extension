import React from "react";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

type Props = {
    children?: React.ReactNode;
    label: string;
    items: { text: string; value: string }[];
    onChange: (value: string) => void;
    value: string;
};

const SelectField = (props: Props) => {
    return (
        <div className="overflow-x-hidden flex-1 flex flex-col gap-2">
            <Label htmlFor="provider" className="leading-5 capitalize">
                {props.label}
            </Label>
            <Select
                onValueChange={value => {
                    props.onChange(value);
                }}
                value={props.value}>
                <SelectTrigger className="ring-inset">
                    <SelectValue placeholder="choose" />
                </SelectTrigger>
                <SelectContent className="max-h-52 max-w-48 rounded-xs">
                    {props.items.map(item => (
                        <SelectItem className="text-xs" key={item.value} value={item.value}>
                            {item.text}
                        </SelectItem>
                    ))}
                </SelectContent>
            </Select>
        </div>
    );
};

export default SelectField;
