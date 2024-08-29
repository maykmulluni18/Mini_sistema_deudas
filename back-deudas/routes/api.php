<?php

use App\Http\Controllers\DeudaController;
use App\Http\Controllers\UsuarioController;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;

/*
|--------------------------------------------------------------------------
| API Routes
|--------------------------------------------------------------------------
|
| Here is where you can register API routes for your application. These
| routes are loaded by the RouteServiceProvider and all of them will
| be assigned to the "api" middleware group. Make something great!
|
*/

Route::middleware('auth:sanctum')->get('/user', function (Request $request) {
    return $request->user();
});
// Route::post('logins', [UsuarioController::class, 'login'])->name('logins.login');

Route::get('usuarios', [UsuarioController::class, 'index'])->name('usuarios.index');

Route::post('usuarios', [UsuarioController::class, 'create'])->name('usuarios.create');

Route::post('usuariosLogin', [UsuarioController::class, 'loginUsers'])->name('usuariosLogin.loginUsers');

Route::post('deuda', [DeudaController::class, 'create'])->name('deuda.create');

Route::get('mideuda/{id}', [DeudaController::class, 'miDeudas'])->name('mideuda.miDeudas');
