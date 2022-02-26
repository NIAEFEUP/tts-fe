import React from "react";
import { Container, Divider } from "@mui/material";
import Hero from "../components/Home/Hero";
import CardFeature from "../components/CardFeature";
import GridSection from "../components/Home/GridSection";
import homepage1 from "../images/homepage1.png";
import homepage2 from "../images/homepage2.jpg";

const HomePage = () => (
    <Container>
        <Hero />
        <Divider light />
        <CardFeature
            title="Why do we love tts?"
            subtitle="Because it's beautiful"
            text="But I must explain to you how all this mistaken idea of denouncing pleasure and praising pain was born and I will give you a complete account of the system, and expound the actual teachings of the great explorer of the truth, the master-builder of human happiness. No one rejects, dislikes, or avoids pleasure itself, because it is pleasure, but because those who do not know how to pursue pleasure rationally encounter consequences that are extremely painful. Nor again is there anyone who loves or pursues or desires to obtain pain of itself, because it is pain, but because occasionally circumstances occur in which toil and pain can procure him some great pleasure"
            image={homepage1}
            direction="row"
        />
        <CardFeature
            title="Why do we love tts?"
            subtitle="Because it's beautiful"
            text="But I must explain to you how all this mistaken idea of denouncing pleasure and praising pain was born and I will give you a complete account of the system, and expound the actual teachings of the great explorer of the truth, the master-builder of human happiness. No one rejects, dislikes, or avoids pleasure itself, because it is pleasure, but because those who do not know how to pursue pleasure rationally encounter consequences that are extremely painful. Nor again is there anyone who loves or pursues or desires to obtain pain of itself, because it is pain, but because occasionally circumstances occur in which toil and pain can procure him some great pleasure"
            image={homepage2}
            direction="row-reverse"
        />

        <GridSection />
    </Container>
);

export default HomePage;
