<?php

namespace App\Http\Controllers;

use App\Models\Deuda;
use Illuminate\Http\Request;
use Carbon\Carbon;


class DeudaController extends Controller
{
    public function index($usuarioId)
    {
        $deudas = Deuda::where('usuario_id', $usuarioId)->get();
        return view('deudas.index', compact('deudas'));
    }

    public function create(Request $request)
    {
        $request->validate([
            'monto_inicial' => 'required|numeric',
            'fecha_inicio' => 'required|date',
        ]);

        $deuda = new Deuda();
        $deuda->usuario_id = $request->usuario_id;
        $deuda->monto_inicial = $request->monto_inicial;
        $deuda->interes = 0.08;
        $deuda->total_deuda = $request->monto_inicial;
        $deuda->fecha_inicio = $request->fecha_inicio;
        $deuda->save();
        return response()->json(['data' => $deuda], 201);
    }

    public function miDeudas($idUsers)
    {
        $currentDate = Carbon::now();
        $deudas = Deuda::select(
            'usuarios.nombre',
            'deudas.monto_inicial',
            'deudas.interes',
            'deudas.total_deuda',
            'deudas.fecha_inicio'
        )
            ->join('usuarios', 'usuarios.id', '=', 'deudas.usuario_id')
            ->selectRaw('
        TIMESTAMPDIFF(HOUR, deudas.fecha_inicio, ?) as hours_passed,
        CEIL(TIMESTAMPDIFF(HOUR, deudas.fecha_inicio, ?) / 4) as periods,
        deudas.total_deuda * deudas.interes * CEIL(TIMESTAMPDIFF(HOUR, deudas.fecha_inicio, ?) / 4) as calculated_interest
    ', [$currentDate, $currentDate, $currentDate])
            ->where('usuarios.id', $idUsers)
            ->get();

        return response()->json([
            'data' => $deudas
        ], 200);
    }


}
