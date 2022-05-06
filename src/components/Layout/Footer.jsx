import React from "react";
import { makeStyles } from "@mui/styles";
import { Grid, Button, Typography, List, ListItem } from "@mui/material";
import FacebookIcon from '@mui/icons-material/Facebook';
import InstagramIcon from '@mui/icons-material/Instagram';
import TwitterIcon from '@mui/icons-material/Twitter';
import GitHubIcon from '@mui/icons-material/GitHub';
import LinkedInIcon from '@mui/icons-material/LinkedIn';
import { Email, Language } from '@mui/icons-material';
import logo from "../../images/logo-ni.png";

const useStyles = makeStyles((theme) => ({
    footer: {
        color: theme.palette.tertiary.main,
        backgroundColor: theme.palette.dark.main,
        padding: theme.spacing(4),
    },
    button: {
        color: theme.palette.tertiary.main,
    },
    background: {
        color: theme.palette.dark.main,
    }
}));

const Footer = () => {
    const classes = useStyles();

    return (
        <div className={classes.footer}>
            <Grid container spacing={0} justifyContent="space-between">
                <Grid item xs={12} sm={6} md={3}>
                    <List>
                        <ListItem>
                            <Grid container spacing={1} alignItems="center">
                                <Grid item>
                                    <img src={logo} alt="Niafeup logo" width="65rem" height="auto" />
                                </Grid>
                                <Grid item>
                                    <Typography variant="h4">NIAEFEUP</Typography>
                                </Grid>
                            </Grid>
                        </ListItem>
                        <ListItem>
                            <Typography>Rua Dr. Roberto Frias 4200-465, Porto</Typography>
                        </ListItem>
                        <ListItem>
                            <Typography>Sala B315</Typography>
                        </ListItem>
                    </List>
                </Grid>
                <Grid container item xs={12} sm={6} md={3} spacing={0}>
                    <List>
                        <ListItem>
                            <Typography variant="h5">Social</Typography>
                        </ListItem>
                        <ListItem>
                            <Button
                                href="https://github.com/NIAEFEUP"
                                target="_blank"
                                rel="noopener"
                                startIcon={<GitHubIcon className={classes.button} />}
                            >
                                <Typography variant="button" className={classes.button}>GitHub</Typography>
                            </Button>
                        </ListItem>
                        <ListItem>
                            <Button
                                href="https://facebook.com/NIAEFEUP/"
                                target="_blank"
                                rel="noopener"
                                startIcon={<FacebookIcon className={classes.button} />}
                            >
                                <Typography variant="button" className={classes.button}>Facebook</Typography>
                            </Button>
                        </ListItem>
                        <ListItem>
                            <Button
                                href="https://www.instagram.com/niaefeup/"
                                target="_blank"
                                rel="noopener"
                                startIcon={<InstagramIcon className={classes.button} />}
                            >
                                <Typography variant="button" className={classes.button}>Instagram</Typography>
                            </Button>
                        </ListItem>
                    </List>
                    <List>
                        <ListItem>
                            <Typography variant="h5" className={classes.background}>.</Typography>
                        </ListItem>
                        <ListItem>
                            <Button
                                href="https://twitter.com/niaefeup"
                                target="_blank"
                                rel="noopener"
                                startIcon={<TwitterIcon className={classes.button} />}
                            >
                                <Typography variant="button" className={classes.button}>Twitter</Typography>
                            </Button>
                        </ListItem>
                        <ListItem>
                            <Button
                                href="https://pt.linkedin.com/company/nifeup"
                                target="_blank"
                                rel="noopener"
                                startIcon={<LinkedInIcon className={classes.button} />}
                            >
                                <Typography variant="button" className={classes.button}>LinkedIn</Typography>
                            </Button>
                        </ListItem>
                    </List>
                </Grid>
                <Grid container item xs={12} sm={6} md={3} spacing={0}>
                    <List>
                        <ListItem>
                            <Typography variant="h5">Contact us</Typography>
                        </ListItem>
                        <ListItem>
                            <Button
                                href="https://ni.fe.up.pt/"
                                target="_blank"
                                rel="noopener"
                                startIcon={<Language className={classes.button} />}
                            >
                                <Typography variant="button" className={classes.button}>Website</Typography>
                            </Button>
                        </ListItem>
                        <ListItem>
                            <Button
                                href="mailto:ni@aefeup.pt"
                                startIcon={<Email className={classes.button} />}
                            >
                                <Typography variant="button" className={classes.button}>ni@aefeup.pt</Typography>
                            </Button>
                        </ListItem>
                    </List>
                </Grid>
            </Grid>

        </div>
    );
};

export default Footer;
