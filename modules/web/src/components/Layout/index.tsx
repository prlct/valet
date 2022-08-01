import React, {useEffect, useState} from "react";

import {Button, Container, Divider, Grid, Input} from "@mantine/core";
import {useScrollIntoView} from "@mantine/hooks";
import {LinkIcon} from "@primer/octicons-react"

import example1 from 'example_lot_1.jpeg'
import example2 from 'example_lot_2.jpeg'
import example3 from 'example_lot_3.jpeg'

import {Dropzone} from "components/Dropzone";
import {useImageRecognize} from "hooks/useDropzoneDrop";
import {useStyles} from "components/Layout/styles";
import {PredictionResult} from "components/PredictionResult";
import {ExampleImage} from "components/ExampleImage";

export function Layout() {
    const {classes} = useStyles();
    const [urlInputValue, setUrlInputValue] = useState<string>()

    const {onFileSubmit, onUrlSubmit, file, url, predictions, loading} = useImageRecognize();

    const {scrollIntoView, targetRef} = useScrollIntoView<HTMLDivElement>({offset: 10, duration: 500});

    useEffect(() => {
        scrollIntoView()
    }, [predictions, scrollIntoView])

    const onExampleImageClick = async (img: string) => {
        const response = await fetch(img)
        const blob = await response.blob()

        onFileSubmit([new File([blob], "sample")])
    }

    return (
        <Container>
            <Grid m="lg">
                <Grid.Col span={4}>
                    <ExampleImage classes={classes} label="Example 1" onClick={() => onExampleImageClick(example1)}
                                  src={example1}/>
                </Grid.Col>
                <Grid.Col span={4}>
                    <ExampleImage classes={classes} label="Example 2" onClick={() => onExampleImageClick(example2)}
                                  src={example2}/>
                </Grid.Col>
                <Grid.Col span={4}>
                    <ExampleImage classes={classes} label="Example 3" onClick={() => onExampleImageClick(example3)}
                                  src={example3}/>
                </Grid.Col>
                <Grid.Col span={12}>
                    <Dropzone onDrop={onFileSubmit}/>
                </Grid.Col>
                <Grid.Col span={12}>
                    <Divider
                        variant="dashed"
                        labelPosition="center"
                        label="OR"
                    />
                </Grid.Col>
                <Grid.Col span={9}>
                    <Input
                        icon={<LinkIcon/>}
                        placeholder="Paste image url"
                        size="md"
                        value={urlInputValue}
                        onChange={(e: React.FormEvent<HTMLInputElement>) => setUrlInputValue(e.currentTarget.value)}
                    />
                </Grid.Col>
                <Grid.Col span={3}>
                    <Button disabled={!urlInputValue && !loading} loading={loading} fullWidth size="md" onClick={() => {
                        onUrlSubmit(urlInputValue!)
                    }}>
                        Recognize
                    </Button>
                </Grid.Col>
                <Grid.Col span={6} ref={targetRef}>
                    <PredictionResult loading={loading} file={file} prediction={predictions?.azure.body} url={url} threshold={0.9}
                                      name="Azure CV"/>
                </Grid.Col>
                <Grid.Col span={6}>
                    <PredictionResult loading={loading} file={file} prediction={predictions?.yolo.body} url={url} threshold={0.5}
                                      name="YOLOv5"/>
                </Grid.Col>
            </Grid>
        </Container>
    )
}
