<?php

namespace App\Http\Controllers;

use App\Models\Usuario;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;

class UsuarioController extends Controller
{
    public function index()
    {
        $usuarios = Usuario::all();
        return response()->json(['data' => $usuarios], 200);
    }

    public function create(Request $request)
    {
        $request->validate([
            'nombre' => 'required',
            'email' => 'email|unique:usuarios,email',
            'codigo_acceso' => 'required'
        ]);

        $inputData = $request->all();
        $inputData['codigo_acceso'] = Hash::make($request->codigo_acceso);

        $user = Usuario::create($inputData);

        return response()->json(['data' => $user], 201);

    }



    public function loginUsers(Request $request)
    {
        try {
            // Validar los datos de entrada
            $request->validate([
                'nombre' => 'required|string',
                'codigo_acceso' => 'required|string'
            ]);

            // Buscar al usuario por nombre
            $user = Usuario::where('nombre', $request->nombre)->first();

            // Verificar si el usuario existe y si el código de acceso es correcto
            if (!$user || !Hash::check($request->codigo_acceso, $user->codigo_acceso)) {
                return response()->json(['message' => 'Credenciales incorrectas'], 401);
            }

            // Generar un token para el usuario autenticado
            // $token = $user->createToken('auth_token')->plainTextToken;

            // Devolver una respuesta con el token de acceso
            return response()->json([
                'message' => 'Login exitoso',
                // 'access_token' => $token,
                'data' => $user,
            ], 200);

        } catch (\Exception $e) {
            // Manejar cualquier excepción que ocurra y devolver una respuesta de error
            return response()->json([
                'message' => 'Ocurrió un error al intentar iniciar sesión',
                'error' => $e->getMessage() // Opcional: puedes omitir esto en producción por razones de seguridad
            ], 500);
        }
    }


}
