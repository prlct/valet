import {createStyles} from '@mantine/core';

export const useStyles = createStyles((theme, _params) => ({
    card: {
        height: '100%',

        "&:hover": {
            backgroundColor: theme.colors.gray[1],
        }
    },
    button: {
        height: '100%',
        width: '100%',
    },
    image: {
        height: 150,

        '& *': {
            height: '100%',
        },

        '& img': {
            height: '100% !important'
        },
    },
}))
