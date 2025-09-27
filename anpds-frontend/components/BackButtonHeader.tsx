import router from "next/router";

interface BackButtonHeaderProps {
  path: string;
}

const BackButtonHeader: React.FC<BackButtonHeaderProps> = ({ path }) => {
  return (
    <header className="sticky top-0 bg-gray-800 p-4 z-10">
      <button 
        onClick={() => {router.push(path);console.log("pressed");}
        } 
        className="text-white"
      >
        ← Back
      </button>
    </header>
  );
};

export default BackButtonHeader;