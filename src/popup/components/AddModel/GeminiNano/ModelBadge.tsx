import React, { useEffect, useState } from "react";
import type { GEMINI_NANO_MODELS } from "./index";
import type { AvailabilityStatus } from "@src/types";
import Download from "@/assets/svg/Download";

type Props = {
    model: (typeof GEMINI_NANO_MODELS)[number];
};

const ModelBadge = (props: Props) => {
    const [availability, setAvailability] = useState<AvailabilityStatus>("unavailable");
    useEffect(() => {
        (async () => {
            //TODO enhance type checking, window is currently on any
            const availability = (await (window as any)[props.model.objectKey].availability()) ?? "unavailable";
            setAvailability(availability);
        })();
    }, []);

    async function downloadModel() {
        //TODO enhance type checking, window is currently on any
        const rewriter = await (window as any)[props.model.objectKey]?.create({});
        setAvailability("downloading");
        rewriter?.destroy();
    }

    return (
        <div className="flex gap-1">
            <div className="capitalize text-sm flex flex-col">
                {props.model.name}
                <span className="text-[10px] capitalize text-gray-500">{availability}</span>
            </div>
            <button className="flex" onClick={downloadModel}>
                {availability === "downloadable" && <Download />}
            </button>
        </div>
    );
};

export default ModelBadge;
