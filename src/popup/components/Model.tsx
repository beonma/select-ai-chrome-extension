import React from "react";
import type { Credential } from "@src/types";
import { Button } from "./ui/button";
import { Trash2 } from "lucide-react";
import { deleteCredential, setDefaultCredential } from "@src/utils/storage";

type Props = {
    children?: React.ReactNode;
    credential: Credential;
    onCredentialsChange: (credentials: Credential[]) => void;
};

const Model = ({ credential, ...props }: Props) => {
    async function setDefaultModel() {
        const credentials = await setDefaultCredential(credential.id);
        props.onCredentialsChange(credentials);
    }

    async function deleteModel() {
        const credentials = await deleteCredential(credential.id);
        props.onCredentialsChange(credentials);
    }

    return (
        <div className="animate-fadeIn-1 flex justify-between items-start gap-4">
            <div className="truncate">
                <p className="truncate text-base">{credential.name}</p>
                <span className="text-xs text-gray-500">
                    {credential.provider}, {credential.model}
                </span>
            </div>
            <div className="flex">
                {!credential.isDefault && (
                    <Button
                        onClick={setDefaultModel}
                        className="animate-fadeIn-1 text-xs rounded-xs mr-1 px-2 py-1"
                        variant="outline">
                        Set default
                    </Button>
                )}
                <Button variant="outline" className="text-xs px-2 py-1" onClick={deleteModel}>
                    <Trash2 color="red" />
                </Button>
            </div>
        </div>
    );
};

export default Model;
