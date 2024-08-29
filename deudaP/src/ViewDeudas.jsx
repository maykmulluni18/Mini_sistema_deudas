import React from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { Environment, OrbitControls, useFBX } from "@react-three/drei";
import { TextureLoader } from "three";
import { AnimationMixer } from "three";
import { Suspense } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { loginPost } from "./config/apis";

const Scene = () => {
  // Load the FBX model with animations
  const fbx = useFBX("YH018_Tokisaki_Kurum_UGC.fbx");
  const [textures, setTextures] = React.useState([]);
  const modelRef = React.useRef();
  const mixer = React.useRef();
  // Load textures
  React.useEffect(() => {
    const loadTextures = async () => {
      const textureLoader = new TextureLoader();
      const textureUrls = [
        "/home/serena/Documents/Sis_Deudas/deudaP/public/YH018_Kurum.png",
      ];

      const loadedTextures = await Promise.all(
        textureUrls.map(
          (url) => new Promise((resolve) => textureLoader.load(url, resolve))
        )
      );
      setTextures(loadedTextures);
    };

    loadTextures();
  }, []);

  // Apply textures to the FBX model
  React.useEffect(() => {
    if (fbx && textures.length > 0) {
      fbx.traverse((child) => {
        if (child.isMesh) {
          child.material.map = textures[0];
          child.material.needsUpdate = true;
        }
      });
    }
  }, [fbx, textures]);

  // Initialize the AnimationMixer and play the walking animation
  React.useEffect(() => {
    if (fbx && fbx.animations.length > 0) {
      mixer.current = new AnimationMixer(fbx);
      const action = mixer.current.clipAction(fbx.animations[0]);
      action.play();
    } else {
      console.warn("No animations found in the FBX model.");
    }
  }, [fbx]);

  // Update the animation frame
  useFrame((state, delta) => {
    if (mixer.current) {
      mixer.current.update(delta);
    }
  });

  return <primitive ref={modelRef} object={fbx} scale={2.4} />;
};

const ViewDeudas = () => {
  // Post
  const [userName, setUserName] = React.useState("");
  const [codigoAcceso, setCodigoAcceso] = React.useState("");
  const [error, setError] = React.useState(null);
  const navigate = useNavigate();
  // login
  async function submit(e) {
    e.preventDefault();

    const body = {
      nombre: userName,
      codigo_acceso: codigoAcceso,
    };
    console.log(loginPost, body);
    try {
      const response = await axios.post(loginPost, body);
      if (response.status === 200) {
        // console.log("Login exitoso:", response.data);
        sessionStorage.setItem("user", response.data.data.id);
        navigate("/mideuda");
      }
    } catch (error) {
      // Captura los errores
      if (error.response) {
        // El servidor respondió con un estado distinto de 2xx
        setError(error.response.data.message || "Error desconocido");
      } else if (error.request) {
        // La solicitud fue hecha pero no hubo respuesta
        setError("No se pudo conectar con el servidor");
      } else {
        // Algo pasó al configurar la solicitud
        // setError("Error al configurar la solicitud");
      }
    }
  }

  return (
    <div className="relative pt-12 bg-gray-900">
      <div className="items-center flex flex-wrap ">
        <div className="w-full md:w-4/12 ml-auto mr-auto px-4 h-screen">
          <Canvas>
            <ambientLight />
            <pointLight position={[10, 0, 0]} />
            <Suspense fallback={null}>
              <Scene />
              <OrbitControls
                enableRotate
                maxPolarAngle={Math.PI / 2}
                minPolarAngle={Math.PI / 2}
                minAzimuthAngle={0}
              />
            </Suspense>
          </Canvas>
        </div>
        <div className="w-full md:w-5/12 ml-auto mr-auto  px-6 h-screen">
          <div className="md:pr-12  ">
            <div className="text-center"></div>
            <h3 className="text-3xl font-semibold text-center text-white ">
              SISTEMA DE DEUDAS
            </h3>
            <br></br>
            {error && <div style={{ color: "red" }}>{error}</div>}
            <form>
              <div className="mb-4">
                <label className="block mb-2 text-lg text-white font-semibold">
                  Nombre
                </label>
                <input
                  type="text"
                  id="nombre"
                  name="nombre"
                  value={userName}
                  onChange={(e) => {
                    setUserName(e.target.value);
                    setError("");
                  }}
                  className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-cyan-500"
                  required
                />
              </div>
              <div className="mb-4">
                <label className="block mb-2 text-lg text-white font-semibold">
                  Contraseña
                </label>
                <input
                  type="password"
                  id="password"
                  name="password"
                  value={codigoAcceso}
                  onChange={(e) => {
                    setCodigoAcceso(e.target.value);
                    setError("");
                  }}
                  className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-cyan-500"
                  required
                />
              </div>
              <div className="text-center">
                <button
                  type="submit"
                  onClick={submit}
                  className="group text-center relative h-12 w-48 overflow-hidden rounded-2xl bg-green-500 text-lg font-bold text-white"
                >
                  VER DEUDA <i className="fas fa-rocket text-xl">? </i>
                  <div className="absolute text-center inset-0 h-full w-full scale-0 rounded-2xl transition-all duration-300 group-hover:scale-100 group-hover:bg-white/30"></div>
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ViewDeudas;
