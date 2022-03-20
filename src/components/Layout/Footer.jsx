import React from "react";
import { makeStyles } from "@mui/styles";
import { Grid, IconButton, Link, Typography } from "@mui/material";
import FacebookIcon from '@mui/icons-material/Facebook';
import InstagramIcon from '@mui/icons-material/Instagram';
import TwitterIcon from '@mui/icons-material/Twitter';
import GitHubIcon from '@mui/icons-material/GitHub';
import LinkedInIcon from '@mui/icons-material/LinkedIn';
import LaunchIcon from '@mui/icons-material/Launch';

const useStyles = makeStyles((theme) => ({
    footer: {
        color: theme.palette.tertiary.main,
        backgroundColor: theme.palette.dark.main,
        padding: theme.spacing(1),
    },
    button: {
        color: theme.palette.dark.light,
        fontSize: 28,
    },
    link: {
        display: "flex",
        alignItems: "center",
        fontSize: 18,
    }
}));

const Footer = () => {
    const classes = useStyles();

    return (
        <div className={classes.footer}>
            <Grid container direction="column" spacing={1}>
                <Grid container item justifyContent="center" spacing={1}>
                    <Grid item>
                        <IconButton
                            href="https://github.com/NIAEFEUP"
                            target="_blank"
                            rel="noopener"
                        >
                            <GitHubIcon className={classes.button} />
                        </IconButton>
                    </Grid>
                    <Grid item>
                        <IconButton
                            href="https://facebook.com/NIAEFEUP/"
                            target="_blank"
                            rel="noopener"
                        >
                            <FacebookIcon className={classes.button} />
                        </IconButton>
                    </Grid>
                    <Grid item>
                        <IconButton
                            href="https://www.instagram.com/niaefeup/"
                            target="_blank"
                            rel="noopener"
                        >
                            <InstagramIcon className={classes.button} />
                        </IconButton>
                    </Grid>
                    <Grid item>
                        <IconButton
                            href="https://twitter.com/niaefeup"
                            target="_blank"
                            rel="noopener"
                        >
                            <TwitterIcon className={classes.button} />
                        </IconButton>
                    </Grid>
                    <Grid item>
                        <IconButton
                            href="https://pt.linkedin.com/company/nifeup"
                            target="_blank"
                            rel="noopener"
                        >
                            <LinkedInIcon className={classes.button} />
                        </IconButton>
                    </Grid>
                </Grid>
                <Grid container item justifyContent="center">
                    <Link
                        href="https://ni.fe.up.pt"
                        className={classes.footer}
                        target="_blank"
                        underline="hover"
                        rel="noopener"
                    >
                        <Typography className={classes.link}>
                          Niaefeup <LaunchIcon fontSize="small" />
                        </Typography>
                    </Link>
                </Grid>
            </Grid>
        </div>
    );
};

export default Footer;
