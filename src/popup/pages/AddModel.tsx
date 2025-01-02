import InputField from "@/components/fields/InputField";
import SelectField from "@/components/fields/SelectField";
import { Button } from "@/components/ui/button";
import React, { useState } from "react";
import PROVIDERS from "@src/providers/providers.json";
import type { ProviderId, Credential } from "@src/types";
import { getNewId } from "@src/utils/misc";
import { addCredential } from "@src/utils/storage";
import { useNavigate } from "react-router-dom";
import { ChevronLeft } from "lucide-react";

type Props = {
    children?: React.ReactNode;
};

const providersList = Object.keys(PROVIDERS) as ProviderId[];

const AddModel = (_props: Props): React.JSX.Element => {
    const navigate = useNavigate();

    const [formState, setFormState] = useState<Credential>({
        id: getNewId(),
        name: "",
        provider: "groq",
        model: "",
        apiKey: "",
        isDefault: false,
    });

    function onProviderChangeHandler(value: string) {
        setFormState(prev => ({ ...prev, provider: value as ProviderId, model: "", apiKey: "" }));
    }

    function onModelChangeHandler(value: string) {
        setFormState(prev => ({ ...prev, model: value }));
    }

    async function onFormSubmitHandler() {
        if ((Object.keys(formState) as (keyof Credential)[]).some(input => formState[input] === "")) {
            return;
        }

        await addCredential(formState);
        navigate("/");
    }

    return (
        <React.Fragment>
            <div className="flex gap-2 items-center mb-6">
                <ChevronLeft
                    size={24}
                    strokeWidth={3}
                    className="text-primary cursor-pointer"
                    onClick={() => {
                        navigate("/");
                    }}
                />
                <h1 className="text-2xl font-poppinsSemiBold">Add Model</h1>
            </div>
            <div className="flex gap-4 flex-col">
                <div className="flex gap-2">
                    <SelectField
                        label="provider"
                        items={providersList.map(provider => ({
                            text: PROVIDERS[provider].name,
                            value: provider,
                        }))}
                        onChange={onProviderChangeHandler}
                        value={formState.provider}
                    />
                    <SelectField
                        onChange={onModelChangeHandler}
                        label="model"
                        items={PROVIDERS[formState.provider].models.map(model => ({
                            text: model,
                            value: model,
                        }))}
                        value={formState.model}
                    />
                </div>
                <InputField
                    label="name"
                    value={formState.name}
                    onChange={e => {
                        setFormState(prev => ({ ...prev, name: e.target.value }));
                    }}
                    placeholder="give it a name"
                    type="text"
                />
                <InputField
                    label="API key"
                    value={formState.apiKey}
                    onChange={e => {
                        setFormState(prev => ({ ...prev, apiKey: e.target.value }));
                    }}
                    placeholder="your api key here"
                    type="password"
                />
                <div className="flex gap-2">
                    <Button onClick={onFormSubmitHandler}>save</Button>
                    <Button variant="outline">Test connection</Button>
                </div>
            </div>
        </React.Fragment>
    );
};

export default AddModel;
