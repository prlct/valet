import React from 'react';

import {Global, MantineProvider} from "@mantine/core";

import {Layout} from "components/Layout";

function App() {
    return (
        <MantineProvider withGlobalStyles withNormalizeCSS>
            <Global styles={(theme) => ({
                body: { }
            })
            }/>
            <Layout/>
        </MantineProvider>
    );
}

export default App;
