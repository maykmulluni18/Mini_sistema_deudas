<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Laravel\Sanctum\HasApiTokens;
use App\Traits\UUID;
class Usuario extends Model
{
    use HasApiTokens, HasFactory, UUID;
    protected $fillable = [
        'user',
        'apellidos',
        'nombre',
        'email',
        'codigo_acceso',
        'status',
    ];

    public function deudas()
    {
        return $this->hasMany(Deuda::class);
    }
}
