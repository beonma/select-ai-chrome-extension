import { Button } from "@/components/ui/button";
import SelectField from "@/components/fields/SelectField";
import InputField from "@/components/fields/InputField";

function App() {
    return (
        <div className="p-4 w-96 h-96">
            <h1 className="text-3xl">Settings</h1>
            <div className="flex gap-4 flex-col mt-4">
                <div className="flex gap-2">
                    <SelectField label="provider" items={["grok", "openai"]} />
                    <SelectField label="model" items={["grok-1.2", "grok-1.2.9", "grok-1.8"]} />
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
