import React from "react";
import Header from "../components/Header"; // Header component
import Squares from "../components/squares";
import IconButton from "../components/button";


// Team members data
const teamMembers = [
  {
    name: "Ashley Tan",
    role: "NUS",
    course: "Y2 Data Science and Analytics",
    email: "e1156686@u.nus.edu",
    linkedin: "https://www.linkedin.com/in/ashley-tan-ying-shan/",
    imgSrc: "../../public/ashley.png",
  },
  {
    name: "Jason Suhari",
    role: "NUS",
    course: "Y2 Data Science and Analytics",
    email: "jason.suhari@u.nus.edu",
    linkedin: "https://www.linkedin.com/in/jasonmatthewsuhari/",
    imgSrc: "../../public/jason.png",
  },  
  {
    name: "Mandy Yap",
    role: "NUS",
    course: "Y2 Data Science and Analytics",
    email: "mandy.yap.z.w@u.nus.edu",
    linkedin: "https://www.linkedin.com/in/mandy-yap-zhi-wei/",
    imgSrc: "../../public/mandy.png",
  },
  {
    name: "Neo JingYi",
    role: "NUS",
    course: "Y2 Data Science and Analytics",
    email: "neo_jing_yi@u.nus.edu",
    linkedin: "https://www.linkedin.com/in/jing-yi-neo/",
    imgSrc: "../../public/jingyi.png",
  },
];

const Contact: React.FC = () => {
  return (
    <div className="p-8 grid min-h-screen w-full justify-center">
      <div className="w-full bg-white p-8 rounded-lg shadow-lg">
        <div className="text-center">
          <h1 className="text-black text-4xl font-bold mb-4">Contact Us</h1>
          <p className="text-gray-700 mb-4 leading-4">Want to know more about us and our project?</p>
          <p className="text-gray-700 mb-8 leading-4">Reach out to us by clicking on the Contact Button Now!</p>
        </div>

        <h2 className="text-3xl text-black font-bold text-center mb-8">Our Team</h2>

        {/* Flex container for team members */}
        <div className="grid grid-cols-4 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-4 w-full gap-8 px-8">
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
