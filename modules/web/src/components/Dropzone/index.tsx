import {Group, Text} from '@mantine/core';
import {UploadIcon, XIcon, ImageIcon} from '@primer/octicons-react';
import {Dropzone as MantineDropzone, DropzoneProps, IMAGE_MIME_TYPE} from '@mantine/dropzone';

export function Dropzone(props: Partial<DropzoneProps>) {
    return (
        <MantineDropzone
            onDrop={(files) => console.log('accepted files', files)}
            onReject={(files) => console.log('rejected files', files)}
            accept={IMAGE_MIME_TYPE}
            {...props}
        >
            <Group position="left" spacing="md" >
                <MantineDropzone.Accept>
                    <UploadIcon
                        size={25}
                    />
                </MantineDropzone.Accept>
                <MantineDropzone.Reject>
                    <XIcon
                        size={25}
                    />
                </MantineDropzone.Reject>
                <MantineDropzone.Idle>
                    <ImageIcon size={25} />
                </MantineDropzone.Idle>

                <div>
                    <Text size="md" inline color="dimmed">
                        Drag images here or click to select files
                    </Text>
                </div>
            </Group>
        </MantineDropzone>
    );
}
