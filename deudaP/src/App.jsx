// import { Canvas } from "@react-three/fiber";
// import { useLoader } from "@react-three/fiber";
// import { Environment, OrbitControls } from "@react-three/drei";
// import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader";
// import { Suspense } from "react";
import { useEffect, useState } from "react";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import MiDeuda from "./MiDeuda";
import ViewDeudas from "./ViewDeudas";

// const Model = () => {
//   const gltf = useLoader(GLTFLoader, "./Kurumi/scene.gltf");
//   return (
//     <>
//       <primitive object={gltf.scene} scale={1.7} />
//     </>
//   );
// };

export default function App() {
  const [loading, setLoading] = useState(true);
  const [users, setUsers] = useState(null);

  useEffect(() => {
    // Simula la obtención de usuarios desde sessionStorage
    const user = sessionStorage.getItem("user");
    setUsers(user);
    setLoading(false);
  }, []);

  if (loading) {
    return <div>Loading...</div>; // Puedes usar un spinner o algo similar
  }
  console.log(users);
  return (
    <BrowserRouter>
      <Routes path="">
        <Route path="/mideuda" element={<MiDeuda />} />
        <Route path="/" element={<ViewDeudas />} />
      </Routes>
      {/* <Route path="*" element={<NotFound />} /> */}
    </BrowserRouter>
  );
}
