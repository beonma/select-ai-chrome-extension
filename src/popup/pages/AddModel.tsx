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
import { encryptRequest } from "@src/utils/encryption";
import { toast } from "@/hooks/use-toast";
import { ToastAction } from "@/components/ui/toast";
import GeminiNano, { GEMINI_NANO_MODELS } from "@/components/AddModel/GeminiNano";

type Props = {
    children?: React.ReactNode;
};

type FormState = Omit<Credential, "apiKey"> & { apiKey?: string };

const providersList = Object.keys(PROVIDERS) as ProviderId[];

const AddModel = (_props: Props): React.JSX.Element => {
    const navigate = useNavigate();

    const [formState, setFormState] = useState<FormState>({
        id: getNewId(),
        name: "",
        provider: "groq",
        model: "",
        apiKey: "",
        isDefault: false,
    });

    const [isSubmitting, setIsSubmitting] = useState(false);

    function onProviderChangeHandler(value: string) {
        setFormState(prev => ({
            ...prev,
            provider: value as ProviderId,
            model: "",
            apiKey: "",
        }));
    }

    function onModelChangeHandler(value: string) {
        setFormState(prev => ({ ...prev, model: value }));
    }

    // COMMENT odd function behavior when run on debugger
    async function onFormSubmitHandler() {
        const formData = { ...formState };

        try {
            setIsSubmitting(true);

            if (formData.provider === "gemini-nano") {
                delete formData.apiKey;
                formData.name = "Gemini Nano";
                formData.model = "built-in browser AI";

                const checkAvailability = await Promise.all(
                    GEMINI_NANO_MODELS.map(model => window[model.objectKey]?.availability()),
                );

                if (checkAvailability.some(el => el !== "available")) {
                    throw new Error("You must have all required models for built-in browser AI before proceeding.");
                }

                await addCredential(formData as Credential);
            } else {
                if ((Object.keys(formData) as (keyof Credential)[]).some(input => formData[input] === "")) {
                    throw new Error("All fields must be filled to register the model.");
                }

                const { encryptedData, iv } = await encryptRequest(formData.apiKey!);
                const credential: Credential = { ...formData, apiKey: { encryptedData, iv } };

                await addCredential(credential);
            }

            toast({
                title: "New model added !",
                description:
                    "To start using this model, check if it's already the default one. Don't forget to refresh the page for changes to take affect",
                // TODO add onClick handler, but need first to implement global state for credentials
                // action: <ToastAction altText="Set as default">Set as default</ToastAction>,
            });

            navigate("/");
        } catch (e) {
            let errorMessage: string = "";
            if (typeof e === "string") {
                errorMessage = e;
            }

            if (e instanceof Error) {
                errorMessage = e.message;
            }

            toast({
                title: "Error !",
                description: errorMessage,
            });

            setIsSubmitting(false);
        }
    }

    return (
        <React.Fragment>
            <div className="flex gap-2 items-center mb-6">
                <ChevronLeft
                    size={24}
                    strokeWidth={3}
                    className="text-primary cursor-pointer"
                    onClick={() => {
                        isSubmitting || navigate("/");
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
                    <div className="flex-1">
                        {formState.provider !== "gemini-nano" && (
                            <SelectField
                                onChange={onModelChangeHandler}
                                label="model"
                                items={PROVIDERS[formState.provider].models.map(model => ({
                                    text: model,
                                    value: model,
                                }))}
                                value={formState.model}
                            />
                        )}
                    </div>
                </div>
                {formState.provider !== "gemini-nano" && (
                    <InputField
                        label="name"
                        value={formState.name}
                        onChange={e => {
                            setFormState(prev => ({ ...prev, name: e.target.value }));
                        }}
                        placeholder="give it a name"
                        type="text"
                    />
                )}
                {formState.provider !== "gemini-nano" && (
                    <InputField
                        label="API key"
                        value={formState.apiKey}
                        onChange={e => {
                            setFormState(prev => ({ ...prev, apiKey: e.target.value }));
                        }}
                        placeholder="your api key here"
                        type="password"
                    />
                )}
                {formState.provider === "gemini-nano" && <GeminiNano />}
                <div className="flex gap-2">
                    <Button disabled={isSubmitting} onClick={onFormSubmitHandler}>
                        save
                    </Button>
                    {/* TODO add test connection */}
                    {/* {<Button variant="outline">Test connection</Button>} */}
                </div>
            </div>
        </React.Fragment>
    );
};

export default AddModel;
