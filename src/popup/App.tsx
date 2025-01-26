import React from "react";
import Home from "./pages/Home";
import AddModel from "./pages/AddModel";
import { MemoryRouter, Routes, Route } from "react-router-dom";
import { Toaster } from "@/components/ui/toaster";

type Props = {
    children?: React.ReactNode;
};

const App = (_props: Props) => {
    return (
        <div className="p-4 w-96 h-96">
            <MemoryRouter future={{ v7_startTransition: false, v7_relativeSplatPath: false }}>
                <Routes>
                    <Route path="/" element={<Home />} />
                    <Route path="/addModal" element={<AddModel />} />
                </Routes>
            </MemoryRouter>
            <Toaster />
        </div>
    );
};

export default App;
