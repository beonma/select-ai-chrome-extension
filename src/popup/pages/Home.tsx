import { Button } from "@/components/ui/button";
import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { getAllCredentials } from "@src/utils/storage";
import type { Credential } from "@src/types";
import { Plus } from "lucide-react";
import Model from "@/components/Model";
import { toast } from "@/hooks/use-toast";

type Props = {
    children?: React.ReactNode;
};

const Home = (_props: Props) => {
    const [credentials, setCredentials] = useState<Credential[]>([]);
    useEffect(() => {
        getAllCredentials().then(response => {
            setCredentials(response);
        });
    }, [getAllCredentials]);

    function onCredentialsChangeHandler(credentials: Credential[]) {
        setCredentials(credentials);
        toast({
            title: "Models updated successfully !",
            description: "please don't forget to refresh the page you are working on for changes to take effect",
        });
    }

    return (
        <div>
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-2xl font-poppinsSemiBold">Models</h1>
                <Link to="addModal">
                    <Button>
                        <Plus strokeWidth={3} />
                    </Button>
                </Link>
                {/* <Button
                    variant="destructive"
                    onClick={() => {
                        chrome.storage.local.clear();
                        }}>
                        Clear
                        </Button> */}
            </div>
            <div className="flex flex-col gap-2">
                {credentials.length ? (
                    credentials.map(credential => (
                        <Model
                            key={credential.id}
                            credential={credential}
                            onCredentialsChange={onCredentialsChangeHandler}
                        />
                    ))
                ) : (
                    <div className="flex flex-col gap-2 items-center justify-center h-52">
                        <p className="text-center text-sm">
                            No available model yet, please add a new model from your provider of choice !
                        </p>
                        <Link to="addModal">
                            <Button>Add model</Button>
                        </Link>
                    </div>
                )}
            </div>
        </div>
    );
};

export default Home;
