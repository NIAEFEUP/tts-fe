import Hero from '../components/home/Hero'
import CardFeature from '../components/home/CardFeature'
import { HomePageImage, HomePageAltImage } from '../images'

const HomePage = () => (
  <div className="container mx-auto w-full px-6 md:px-0">
    <div className="my-12">
      <Hero />
    </div>
    <hr />
    <CardFeature
      title="Why do we love tts?"
      subtitle="Because it's beautiful"
      text="But I must explain to you how all this mistaken idea of denouncing pleasure and praising pain was born and I will give you a complete account of the system, and expound the actual teachings of the great explorer of the truth, the master-builder of human happiness. No one rejects, dislikes, or avoids pleasure itself, because it is pleasure, but because those who do not know how to pursue pleasure rationally encounter consequences that are extremely painful. Nor again is there anyone who loves or pursues or desires to obtain pain of itself, because it is pain, but because occasionally circumstances occur in which toil and pain can procure him some great pleasure"
      image={HomePageImage}
      reverse={false}
    />
    <CardFeature
      title="Why do we love tts?"
      subtitle="Because it's beautiful"
      text="But I must explain to you how all this mistaken idea of denouncing pleasure and praising pain was born and I will give you a complete account of the system, and expound the actual teachings of the great explorer of the truth, the master-builder of human happiness. No one rejects, dislikes, or avoids pleasure itself, because it is pleasure, but because those who do not know how to pursue pleasure rationally encounter consequences that are extremely painful. Nor again is there anyone who loves or pursues or desires to obtain pain of itself, because it is pain, but because occasionally circumstances occur in which toil and pain can procure him some great pleasure"
      image={HomePageAltImage}
      reverse={true}
    />
    <CardFeature
      title="Why do we love tts?"
      subtitle="Because it's beautiful"
      text="But I must explain to you how all this mistaken idea of denouncing pleasure and praising pain was born and I will give you a complete account of the system, and expound the actual teachings of the great explorer of the truth, the master-builder of human happiness. No one rejects, dislikes, or avoids pleasure itself, because it is pleasure, but because those who do not know how to pursue pleasure rationally encounter consequences that are extremely painful. Nor again is there anyone who loves or pursues or desires to obtain pain of itself, because it is pain, but because occasionally circumstances occur in which toil and pain can procure him some great pleasure"
      image={HomePageAltImage}
      reverse={false}
    />
  </div>
)

export default HomePage
