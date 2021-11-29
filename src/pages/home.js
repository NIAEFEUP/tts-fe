import { Container, Divider } from '@mui/material';
import React from 'react'
import Hero from '../components/Hero';
import CardFeature from '../components/CardFeature';
import ProfileCard from '../components/profile/ProfileCard';
import Student from '../components/profile/Student';
import GridSection from '../components/GridSection';

class Home extends React.Component {

    render() {

        let student = new Student({
            id: "id",
            name: "Afonso Medeiros",
            email: "up20xxxxxxx@edu.fe.up.pt",
            profilePicture: "some-path.png",
        });

        return (
            <Container>
                <Hero />
                <Divider light />
                <CardFeature
                    title="Why do we love tts?"
                    subtitle="Because it's beautiful"
                    text="But I must explain to you how all this mistaken idea of denouncing pleasure and praising pain was born and I will give you a complete account of the system, and expound the actual teachings of the great explorer of the truth, the master-builder of human happiness. No one rejects, dislikes, or avoids pleasure itself, because it is pleasure, but because those who do not know how to pursue pleasure rationally encounter consequences that are extremely painful. Nor again is there anyone who loves or pursues or desires to obtain pain of itself, because it is pain, but because occasionally circumstances occur in which toil and pain can procure him some great pleasure"
                    image=""
                    direction="row"
                />
                <CardFeature
                    title="Why do we love tts?"
                    subtitle="Because it's beautiful"
                    text="But I must explain to you how all this mistaken idea of denouncing pleasure and praising pain was born and I will give you a complete account of the system, and expound the actual teachings of the great explorer of the truth, the master-builder of human happiness. No one rejects, dislikes, or avoids pleasure itself, because it is pleasure, but because those who do not know how to pursue pleasure rationally encounter consequences that are extremely painful. Nor again is there anyone who loves or pursues or desires to obtain pain of itself, because it is pain, but because occasionally circumstances occur in which toil and pain can procure him some great pleasure"
                    image=""
                    direction="row-reverse"
                />
<<<<<<< HEAD

                <ProfileCard 
                    student={student}
                />

=======
                <GridSection />
>>>>>>> e5221d7938323fe7c59b26d60d7f64c1fc455eb9
            </Container>
        )
    }
} 

export default Home;
