import React from "react";
import Header from "../components/Header"; // Header component
import Squares from "../components/squares";
import IconButton from "../components/button";


// Team members data
const teamMembers = [
  {
    name: "Mandy Yap",
    role: "CEO",
    course: "NUS Year 2 Data Science and Analytics",
    email: "mandy.yap.z.w@u.nus.edu",
    linkedin: "https://www.linkedin.com/in/mandy-yap-zhi-wei/",
    imgSrc: "https://lh3.googleusercontent.com/pw/AP1GczN8bOs_oonVZK2yX2TJacJVt_xU6G7wtWhVR_vEDCXe46wW7mfQAdZG7B5mJC7WZ0fNF27QlCDMGTk-QuqHmfs-Ro6TNM_q4cbGP60lPxyyXorHtUI=w2400",
  },
  {
    name: "Jason Suhari",
    role: "CTO & Founder",
    course: "NUS Year 2 Data Science and Analytics",
    email: "jason.suhari@u.nus.edu",
    linkedin: "https://www.linkedin.com/in/jasonmatthewsuhari/",
    imgSrc: "https://lh3.googleusercontent.com/pw/AP1GczPCOppX-hpDultf3KqcIl6GbmUDjjGZh14YN2_irKOu_PoLbi5N9fQWsq8ZuINiEKapoISHtR7Xc_Ye8ufFrOLdZAwa_2BXkjgN76ju_3qv1Eu43IM=w2400",
  },
  {
    name: "Ashley Tan",
    role: "CFO",
    course: "NUS Year 2 Data Science and Analytics",
    email: "e1156686@u.nus.edu",
    linkedin: "https://www.linkedin.com/in/ashley-tan-ying-shan/",
    imgSrc: "https://lh3.googleusercontent.com/pw/AP1GczPCOppX-hpDultf3KqcIl6GbmUDjjGZh14YN2_irKOu_PoLbi5N9fQWsq8ZuINiEKapoISHtR7Xc_Ye8ufFrOLdZAwa_2BXkjgN76ju_3qv1Eu43IM=w2400",
  },
  {
    name: "Neo JingYi",
    role: "CFO",
    course: "NUS Year 2 Data Science and Analytics",
    email: "neo_jing_yi@u.nus.edu",
    linkedin: "https://www.linkedin.com/in/jing-yi-neo/",
    imgSrc: "https://lh3.googleusercontent.com/pw/AP1GczPCOppX-hpDultf3KqcIl6GbmUDjjGZh14YN2_irKOu_PoLbi5N9fQWsq8ZuINiEKapoISHtR7Xc_Ye8ufFrOLdZAwa_2BXkjgN76ju_3qv1Eu43IM=w2400",
  },
];

const Contact: React.FC = () => {
  return (
    <div className="p-8 flex justify-center">
      <div className="max-w-4xl w-full bg-white bg-opacity-50 p-8 rounded-lg shadow-lg">
        <div className="text-center">
          <h1 className="text-black text-4xl font-bold mb-4">Contact Us</h1>
          <p className="text-gray-700 mb-4 leading-4">Want to know more about us and our project?</p>
          <p className="text-gray-700 mb-8 leading-4">Reach out to us by clicking on the Contact Button Now!</p>
        </div>

        <h2 className="text-3xl text-black font-bold text-center mb-8">Our Team</h2>

        {/* Flex container for team members */}
        <div className="flex flex-wrap items-center items-center justify-center gap-8">
          {teamMembers.map((member, index) => (
            <div key={index} className="max-w-sm bg-white rounded-lg shadow-lg overflow-hidden">
              <img className="mx-auto w-70 h-90 object-cover rounded-lg " src={member.imgSrc} alt={member.name} />
              <div className="p-6 text-center">
                <h2 className="text-2xl text-black font-bold mb-2">{member.name}</h2>
                <p className="text-gray-600 font-semibold mb-2">{member.role}</p>
                <p className="text-gray-700 mb-2">{member.course}</p> 
                <p className="text-gray-700 mb-4">{member.email}</p>
                <IconButton onClick={() => window.open(member.linkedin, "_blank")} text="Contact"/>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

const App: React.FC = () => {
  return (
    <div className="relative min-h-screen w-screen overflow-hidden">
      <section className="flex flex-col items-center py-16">
        <h2 className="text-4xl md:text-6xl font-extrabold mb-4 text-left">
          Interested in <span className="text-[#C0402B]">RedString</span>?
        </h2>
      </section>
      
      {/* Background Effect */}
      <div className="absolute top-0 left-0 w-full h-full -z-10">
        <Squares 
          direction="diagonal" 
          speed={0.3} 
          borderColor="rgba(255, 80, 80, 0.3)" 
          squareSize={40} 
          hoverFillColor="rgba(255, 0, 0, 0.5)" 
        />
      </div>

      <div className="relative z-10">
        <Header />
        <Contact /> {/* Render Contact Component */}
      </div>
    </div>
  );
};
export default App;
