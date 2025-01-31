import React from "react";
import Header from "../components/Header"; // Header component
import Squares from "../components/squares";

const teamMembers = [
  {
    name: "Jason Matthew Suhari",
    photo: "https://via.placeholder.com/150",
    linkedin: "https://www.linkedin.com/in/alicejohnson",
    description: "Jason is a front-end developer with a passion for creating beautiful and user-friendly interfaces."
  },
  {
    name: "Neo Jing Yi",
    photo: "https://via.placeholder.com/150",
    linkedin: "https://www.linkedin.com/in/bobsmith",
    description: "Mandy specializes in back-end development and database management, ensuring seamless application performance."
  },
  {
    name: "Mandy Yap",
    photo: "https://via.placeholder.com/150",
    linkedin: "https://www.linkedin.com/in/charliebrown",
    description: "Charlie is a full-stack engineer with experience in cloud computing and distributed systems."
  },
  {
    name: "Ashley Tan",
    photo: "https://via.placeholder.com/150",
    linkedin: "https://www.linkedin.com/in/danawhite",
    description: "Dana is a UX/UI designer focused on enhancing user experiences with intuitive and accessible designs."
  }
];

const App: React.FC = () => {
  return (  
    <div className="relative min-h-screen w-screen overflow-hidden">
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
        <div className="max-w-4xl mx-auto mt-10 p-6 bg-white shadow-lg rounded-lg">
          <h2 className="text-3xl font-bold text-center mb-6">Meet Our Team</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {teamMembers.map((member, index) => (
              <div key={index} className="p-4 border rounded-lg shadow-md text-center">
                <img 
                  src={member.photo} 
                  alt={member.name} 
                  className="w-24 h-24 mx-auto rounded-full mb-4"
                />
                <h3 className="text-xl font-semibold">{member.name}</h3>
                <p className="text-gray-600 mb-2">{member.description}</p>
                <a 
                  href={member.linkedin} 
                  target="_blank" 
                  rel="noopener noreferrer" 
                  className="text-blue-500 hover:underline"
                >
                  LinkedIn Profile
                </a>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default App;
