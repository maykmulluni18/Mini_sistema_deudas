import React from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { Environment, OrbitControls, useFBX } from "@react-three/drei";
import { TextureLoader } from "three";
import { AnimationMixer } from "three";
import { Suspense } from "react";
import axios from "axios";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader";
import { useLoader } from "@react-three/fiber";
import { Physics, useSphere } from "@react-three/cannon";

import { myDeuda } from "./config/apis";

// const Model = () => {
//   const gltf = useLoader(GLTFLoader, "./Emilia/Emilia_v1.0_2.79.gltf");
//   return (
//     <>
//       <primitive object={gltf.scene} scale={1.8} />
//     </>
//   );
// };

const Model = () => {
  const gltf = useLoader(GLTFLoader, "./Emilia/Emilia_v1.0_2.79.gltf");
  const hairRef = React.useRef();

  // Buscar y referenciar la malla de cabello
  React.useEffect(() => {
    const hairMesh = gltf.scene.getObjectByName("HairMeshName"); // Reemplazar con el nombre real de la malla del cabello
    if (hairMesh) {
      hairRef.current = hairMesh;
      // Crear un objeto físico para el cabello
      useSphere(() => ({
        mass: 0.5, // Ajusta la masa para simular diferentes niveles de movimiento
        position: hairMesh.position.toArray(),
        args: [0.2], // Tamaño del objeto físico
        onCollide: (e) => console.log("Colisión detectada con el cabello", e),
        ref: hairRef,
      }));
    }
  }, [gltf]);

  return <primitive object={gltf.scene} scale={1.8} />;
};

const Scene = () => {
  // Load the FBX model with animations
  const fbx = useFBX("Kurumi.fbx");
  const [textures, setTextures] = React.useState([]);
  const modelRef = React.useRef();
  const mixer = React.useRef();
  // Load textures
  React.useEffect(() => {
    const loadTextures = async () => {
      const textureLoader = new TextureLoader();
      const textureUrls = [
        "/home/serena/Documents/Sis_Deudas/deudaP/public/YH062_Tokisaki_Kurumi.png",
        "/home/serena/Documents/Sis_Deudas/deudaP/public/YH062_Tokisaki_Kurumi_prop.png",
        "/home/serena/Documents/Sis_Deudas/deudaP/public/YH062_Tokisaki_Kurumi_mantilla.png",
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

  return <primitive ref={modelRef} object={fbx} scale={0.002} />;
};

const MiDeuda = () => {
  const [dataList, setDataList] = React.useState([]);

  async function myDeudas() {
    const users = sessionStorage.getItem("user");
    try {
      const response = await axios.get(myDeuda + users);
      setDataList(response.data.data);
      // console.log(response.data.data);
    } catch (error) {
      console.log(error);
    }
  }

  React.useEffect(() => {
    myDeudas();
  }, []);
  return (
    <div>
      <div className="relative pt-12 bg-gray-900  ">
        <div className="items-center flex flex-wrap ">
          <div className="w-full md:w-4/12 ml-auto mr-auto px-4 h-screen  ">
            {/* <Canvas>
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
            </Canvas> */}
            <Canvas>
              <Suspense fallback={null}>
                <Physics>
                  <Model />
                </Physics>{" "}
                <OrbitControls
                  enableRotate
                  maxPolarAngle={Math.PI / 2}
                  minPolarAngle={Math.PI / 2}
                  minAzimuthAngle={0}
                />
                <Environment preset="sunset" />
              </Suspense>
            </Canvas>
          </div>
          <div className="w-full md:w-5/12 ml-auto mr-auto px-4 h-screen ">
            <div className="md:pr-12 ">
              <div className="text-center"></div>
              <h3 className="text-3xl font-semibold text-center text-white ">
                SISTEMA DE DEUDAS
              </h3>
              <br></br>
              <div className="p-4">
                <ul className="space-y-4">
                  {dataList ? (
                    <div>
                      {dataList.map((deuda, index) => (
                        <li
                          key={index}
                          className={`p-4 border border-gray-200 rounded-md shadow-md ${
                            index % 2 === 0 ? "bg-gray-50" : "bg-white"
                          }`}
                        >
                          <div className="flex flex-wrap">
                            <div className="w-1/2 md:w-1/2 font-semibold">
                              Nombre:
                            </div>
                            <div className="w-1/2 md:w-1/2">{deuda.nombre}</div>
                          </div>
                          <div className="flex flex-wrap mt-2">
                            <div className="w-1/2 md:w-1/2 font-semibold">
                              Monto Inicial:
                            </div>
                            <div className="w-1/2 md:w-1/2">
                              {deuda.monto_inicial}
                            </div>
                          </div>
                          <div className="flex flex-wrap mt-2">
                            <div className="w-1/2 md:w-1/2 font-semibold">
                              Interés:
                            </div>
                            <div className="w-1/2 md:w-1/2">
                              {deuda.interes}
                            </div>
                          </div>
                          <div className="flex flex-wrap mt-2">
                            <div className="w-1/2 md:w-1/2 font-semibold">
                              Total Deuda:
                            </div>
                            <div className="w-1/2 md:w-1/2">
                              {deuda.total_deuda}
                            </div>
                          </div>
                          <div className="flex flex-wrap mt-2">
                            <div className="w-1/2 md:w-1/2 font-semibold">
                              Fecha Inicio:
                            </div>
                            <div className="w-1/2 md:w-1/2">
                              {deuda.fecha_inicio}
                            </div>
                          </div>
                          <div className="flex flex-wrap mt-2">
                            <div className="w-1/2 md:w-1/2 font-semibold">
                              Horas Pasadas:
                            </div>
                            <div className="w-1/2 md:w-1/2">
                              {deuda.hours_passed}
                            </div>
                          </div>
                          <div className="flex flex-wrap mt-2">
                            <div className="w-1/2 md:w-1/2 font-semibold">
                              Períodos:
                            </div>
                            <div className="w-1/2 md:w-1/2">
                              {deuda.periods}
                            </div>
                          </div>
                          <div className="flex flex-wrap mt-2">
                            <div className="w-1/2 md:w-1/2 font-semibold">
                              Interés Calculado:
                            </div>
                            <div className="w-1/2 md:w-1/2">
                              {deuda.calculated_interest}
                            </div>
                          </div>
                        </li>
                      ))}
                    </div>
                  ) : (
                    <p>Cargando...</p>
                  )}
                </ul>
              </div>

              {/* <div className="mb-4">
                <label className="block mb-2 text-lg text-white font-semibold">
                  Contraseña
                </label>
                <input
                  type="password"
                  id="password"
                  name="password"
                  //   value={codigoAcceso}
                  //   onChange={(e) => {
                  //     setCodigoAcceso(e.target.value);
                  //   }}
                  className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-cyan-500"
                  required
                />
              </div> */}
              <div className="text-center">
                <button
                  onClick={myDeudas}
                  className="group text-center relative h-12 w-48 overflow-hidden rounded-2xl bg-green-500 text-lg font-bold text-white"
                >
                  ACTUALIZAR DEUDA <i className="fas fa-rocket text-xl"> </i>
                  <div className="absolute text-center inset-0 h-full w-full scale-0 rounded-2xl transition-all duration-300 group-hover:scale-100 group-hover:bg-white/30"></div>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MiDeuda;
