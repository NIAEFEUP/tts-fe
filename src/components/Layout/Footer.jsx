import React from "react";
import { makeStyles } from "@mui/styles";
import { Grid, IconButton } from "@mui/material";
import FacebookIcon from '@mui/icons-material/Facebook';
import InstagramIcon from '@mui/icons-material/Instagram';
import TwitterIcon from '@mui/icons-material/Twitter';
import GitHubIcon from '@mui/icons-material/GitHub';
import LinkedInIcon from '@mui/icons-material/LinkedIn';

const useStyles = makeStyles((theme) => ({
    footer: {
        color: "#fff",
        backgroundColor: theme.palette.dark.main,
        padding: theme.spacing(2),
    },
}));

const Footer = () => {
    const buttonColor = "#fff";
    const classes = useStyles();

    return (
        <div className={classes.footer}>
            <Grid container direction="column" spacing={1}>
                <Grid container item justifyContent="center" spacing={1}>
                    <Grid item>
                        <IconButton
                            href="https://github.com/NIAEFEUP"
                            size="large"
                            color="secondary"
                        >
                            <GitHubIcon />
                        </IconButton>
                    </Grid>
                    <Grid item>
                        <IconButton
                            href="https://facebook.com/NIAEFEUP/"
                            size="large"
                            color="secondary"
                        >
                            <FacebookIcon />
                        </IconButton>
                    </Grid>
                    <Grid item>
                        <IconButton
                            href="https://www.instagram.com/niaefeup/"
                            size="large"
                            color="secondary"
                        >
                            <InstagramIcon />
                        </IconButton>
                    </Grid>
                    <Grid item>
                        <IconButton
                            href="https://twitter.com/niaefeup"
                            size="large"
                            color="secondary"
                        >
                            <TwitterIcon />
                        </IconButton>
                    </Grid>
                    <Grid item>
                        <IconButton
                            href="https://pt.linkedin.com/company/nifeup"
                            size="large"
                            color="secondary"
                        >
                            <LinkedInIcon />
                        </IconButton>
                    </Grid>
                </Grid>
                <Grid container item justifyContent="center">
                    Niaefeup
                </Grid>
            </Grid>
        </div>
    );
};

export default Footer;
