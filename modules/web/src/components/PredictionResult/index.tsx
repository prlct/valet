import {Prediction} from "utils/api";
import {Badge, Card, Grid, Skeleton, Text} from "@mantine/core";
import {Canvas} from "components/Canvas";
import React from "react";

interface PredictionResultProps {
    file: File | null;
    prediction?: Prediction;
    url: string | null;
    name: string;
    threshold: number;
    loading: boolean;
}

export function PredictionResult(props: PredictionResultProps) {

    const NoPredictionContent = () => {
        return <Card shadow="sm" radius="md" pb={8} withBorder sx={{height: 250}}>
            <Grid columns={24}>
                <Grid.Col span={7}>
                    <Text weight={500} size="sm" mb="md">{props.name}</Text>
                </Grid.Col>
            </Grid>
            <Card.Section sx={{height: "100%"}}>
                {props.loading ? <Skeleton height="100%"/> :
                    <Text size="sm" color="gray" mx="md">Upload image to see the result</Text>}
            </Card.Section>
        </Card>
    }

    const PredictionContent = () => {
        if (!props.prediction) return null;

        return <Card shadow="sm" radius="md" pb={8} withBorder sx={{maxHeight: 250}}>
            <Grid columns={24} gutter="xs">
                <Grid.Col span={6}>
                    <Text weight={500} size="sm" mb="md">{props.name}</Text>
                </Grid.Col>
                <Grid.Col span={8}>
                    <Badge color="teal" mb="xs" variant="light" p="xs" fullWidth>
                        Time: {(props.prediction.time / 1000).toFixed(1)}s
                    </Badge>
                </Grid.Col>
                <Grid.Col span={10}>
                    <Badge color="pink" mb="xs" variant="light" p="xs" fullWidth>
                        Threshold: {props.threshold}
                    </Badge>
                </Grid.Col>
            </Grid>
            <Card.Section>
                {props.file &&
                    <Canvas file={props.file} predictions={props.prediction.predictions} threshold={props.threshold}/>}
                {props.url &&
                    <Canvas url={props.url} predictions={props.prediction.predictions} threshold={props.threshold}/>}
            </Card.Section>
        </Card>
    }

    return props.prediction && !props.loading ? <PredictionContent/> : <NoPredictionContent/>
}
