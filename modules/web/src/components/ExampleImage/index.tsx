import {Card, Center, Image, Text, UnstyledButton} from "@mantine/core";
import React from "react";

export function ExampleImage(props: { classes: Record<string, string>, onClick: () => Promise<void>, src: string, label: string }) {
    return <UnstyledButton className={props.classes.button} onClick={props.onClick}>
        <Card className={props.classes.card} p={0} radius="md">
            <Image className={props.classes.image} src={props.src} radius="md"/>
            <Center>
                <Text my="sm">{props.label}</Text>
            </Center>
        </Card>
    </UnstyledButton>;
}
