import { Button } from "@/components/ui/button";
import SelectField from "@/components/fields/SelectField";
import InputField from "@/components/fields/InputField";
import PROVIDERS from "../providers/providers.json";
import { useState } from "react";
import type { ProviderId } from "src/types";

const providersList = Object.keys(PROVIDERS) as ProviderId[];

function App() {
    const [formState, setFormState] = useState<{
        provider: ProviderId;
        model: string;
        apiKey: string;
    }>({
        provider: "groq",
        model: "",
        apiKey: "",
    });

    function onProviderChangeHandler(value: string) {
        setFormState(prev => ({ ...prev, provider: value as ProviderId, model: "" }));
    }

    function onModelChangeHandler(value: string) {
        setFormState(prev => ({ ...prev, model: value }));
    }

    return (
        <div className="p-4 w-96 h-96">
            <h1 className="text-3xl">Settings</h1>
            <div className="flex gap-4 flex-col mt-4">
                <div className="flex gap-2">
                    <SelectField
                        label="provider"
                        items={providersList.map(provider => ({ text: PROVIDERS[provider].name, value: provider }))}
                        onChange={onProviderChangeHandler}
                        value={formState.provider}
                    />
                    <SelectField
                        onChange={onModelChangeHandler}
                        label="model"
                        items={PROVIDERS[formState.provider].models.map(model => ({ text: model, value: model }))}
                        value={formState.model}
                    />
                </div>
                <InputField label="API key" placeholder="your api key here" />
                <div className="flex gap-2">
                    <Button>save</Button>
                    <Button variant="outline">Test connection</Button>
                </div>
            </div>
        </div>
    );
}

export default App;
